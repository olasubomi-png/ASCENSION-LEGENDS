import { CACHE_KEYS, CACHE_TTL, ID_PREFIXES } from '../../constants/index.js';
import type { IInventoryService, InventoryItem } from '../../interfaces/IInventoryService.js';
import type { ICacheService } from '../../interfaces/index.js';
import type { IInventoryItemSchema, IInventorySchema } from '../../models/InventoryModel.js';
import type { InventoryRepository } from '../../repositories/InventoryRepository.js';
import type { Result } from '../../types/common.js';
import { ok, err } from '../../types/common.js';
import { childLogger } from '../../utils/logger.js';
import { generateIdWithPrefix } from '../../utils/ulid.js';

const log = childLogger('InventoryService');

export class InventoryService implements IInventoryService {
  constructor(
    private readonly inventoryRepo: InventoryRepository,
    private readonly cache: ICacheService,
  ) {}

  async getInventory(userId: string): Promise<Result<InventoryItem[]>> {
    try {
      const cacheKey = `${CACHE_KEYS.INVENTORY}${userId}`;
      const cached = await this.cache.get<InventoryItem[]>(cacheKey);
      if (cached) return ok(cached);

      const inventory = await this.inventoryRepo.findByUserId(userId);
      if (!inventory) return ok([]);

      const items = this.mapItems(inventory);
      await this.cache.set(cacheKey, items, CACHE_TTL.INVENTORY);
      return ok(items);
    } catch (error) {
      log.error('Failed to get inventory', { err: String(error), userId });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async grantItem(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<Result<InventoryItem>> {
    try {
      if (quantity <= 0) return err(new Error('Quantity must be positive'));

      const item: IInventoryItemSchema = {
        itemId,
        quantity,
        acquiredAt: new Date(),
        equipped: false,
      };

      const updated = await this.inventoryRepo.addItems(userId, [item]);
      if (!updated) return err(new Error('Inventory not found'));

      await this.cache.del(`${CACHE_KEYS.INVENTORY}${userId}`);
      log.info('Item granted', { userId, itemId, quantity });

      return ok({
        id: updated._id,
        userId,
        itemId,
        quantity,
        acquiredAt: item.acquiredAt,
      });
    } catch (error) {
      log.error('Failed to grant item', { err: String(error), userId, itemId });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async removeItem(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<Result<boolean>> {
    try {
      if (quantity <= 0) return err(new Error('Quantity must be positive'));
      const updated = await this.inventoryRepo.removeItem(userId, itemId, quantity);
      if (!updated) return err(new Error('Item not found or insufficient quantity'));
      await this.cache.del(`${CACHE_KEYS.INVENTORY}${userId}`);
      return ok(true);
    } catch (error) {
      log.error('Failed to remove item', { err: String(error), userId, itemId });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Create a brand-new inventory document for a player.
   * Called during registration.
   */
  async createInventory(
    userId: string,
    discordId: string,
    starterItems: IInventoryItemSchema[],
  ): Promise<Result<IInventorySchema>> {
    try {
      const id = generateIdWithPrefix(ID_PREFIXES.INVENTORY);
      const inventory = await this.inventoryRepo.create({
        _id: id,
        inventoryId: id,
        userId,
        discordId,
        items: starterItems,
        maxSlots: 100,
      });
      log.info('Inventory created', { userId, discordId, itemCount: starterItems.length });
      return ok(inventory);
    } catch (error) {
      log.error('Failed to create inventory', { err: String(error), userId });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private mapItems(inventory: IInventorySchema): InventoryItem[] {
    return inventory.items.map((item) => ({
      id: inventory._id,
      userId: inventory.userId,
      itemId: item.itemId,
      quantity: item.quantity,
      acquiredAt: item.acquiredAt,
    }));
  }
}
