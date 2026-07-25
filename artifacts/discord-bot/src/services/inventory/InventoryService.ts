import { childLogger } from '../../utils/logger.js';

const log = childLogger('InventoryService');

/**
 * InventoryService — manages player item ownership and item grants.
 *
 * PLACEHOLDER: Implementation will include item schema validation,
 * inventory slot limits (MAX_INVENTORY_SLOTS = 100), and item stacking logic.
 */
export class InventoryService {
  async getInventory(_userId: string): Promise<void> {
    log.info('InventoryService.getInventory — placeholder');
    throw new Error('Inventory system not yet implemented');
  }

  async grantItem(_userId: string, _itemId: string, _quantity: number): Promise<void> {
    log.info('InventoryService.grantItem — placeholder');
    throw new Error('Inventory system not yet implemented');
  }
}
