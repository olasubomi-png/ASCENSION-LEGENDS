import type { IInventorySchema, IInventoryItemSchema } from '../models/InventoryModel.js';
import { InventoryModel } from '../models/InventoryModel.js';

export type CreateInventoryData = Pick<
  IInventorySchema,
  '_id' | 'inventoryId' | 'userId' | 'discordId' | 'items' | 'maxSlots'
>;

export class InventoryRepository {
  async findByUserId(userId: string): Promise<IInventorySchema | null> {
    return InventoryModel.findOne({ userId, deletedAt: null })
      .lean()
      .exec() as Promise<IInventorySchema | null>;
  }

  async create(data: CreateInventoryData): Promise<IInventorySchema> {
    const inventory = new InventoryModel(data);
    const saved = await inventory.save();
    return saved.toObject() as IInventorySchema;
  }

  async addItems(
    userId: string,
    items: IInventoryItemSchema[],
  ): Promise<IInventorySchema | null> {
    return InventoryModel.findOneAndUpdate(
      { userId, deletedAt: null },
      { $push: { items: { $each: items } } },
      { new: true },
    )
      .lean()
      .exec() as Promise<IInventorySchema | null>;
  }

  async removeItem(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<IInventorySchema | null> {
    // Pull items by itemId and decrement quantity
    const inventory = await InventoryModel.findOne({ userId, deletedAt: null }).exec();
    if (!inventory) return null;

    const item = inventory.items.find((i) => i.itemId === itemId);
    if (!item || item.quantity < quantity) return null;

    if (item.quantity === quantity) {
      await InventoryModel.updateOne(
        { userId },
        { $pull: { items: { itemId } } },
      );
    } else {
      await InventoryModel.updateOne(
        { userId, 'items.itemId': itemId },
        { $inc: { 'items.$.quantity': -quantity } },
      );
    }

    return InventoryModel.findOne({ userId, deletedAt: null })
      .lean()
      .exec() as Promise<IInventorySchema | null>;
  }

  async equipItem(
    userId: string,
    itemId: string,
    slot: string,
  ): Promise<IInventorySchema | null> {
    // Unequip any item in that slot first
    await InventoryModel.updateOne(
      { userId, 'items.slot': slot },
      { $set: { 'items.$[].equipped': false, 'items.$[].slot': undefined } },
    );
    // Equip this item
    return InventoryModel.findOneAndUpdate(
      { userId, 'items.itemId': itemId },
      { $set: { 'items.$.equipped': true, 'items.$.slot': slot } },
      { new: true },
    )
      .lean()
      .exec() as Promise<IInventorySchema | null>;
  }
}
