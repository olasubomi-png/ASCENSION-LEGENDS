import mongoose, { Schema } from 'mongoose';
import type { HydratedDocument, Model } from 'mongoose';

/** A single item stack in a player's inventory. */
export interface IInventoryItemSchema {
  itemId: string;
  quantity: number;
  acquiredAt: Date;
  /** Whether this item is currently equipped in a gear slot. */
  equipped: boolean;
  /** Equipment slot, if equipped: 'weapon' | 'armor' | 'helm' | 'boots' | 'ring' | 'amulet' */
  slot?: string | undefined;
}

export interface IInventorySchema {
  _id: string;
  inventoryId: string;
  userId: string;
  discordId: string;
  items: IInventoryItemSchema[];
  maxSlots: number;
  deletedAt?: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export type IInventory = HydratedDocument<IInventorySchema>;

const inventoryItemSchema = new Schema<IInventoryItemSchema>(
  {
    itemId: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1, min: 0 },
    acquiredAt: { type: Date, default: (): Date => new Date() },
    equipped: { type: Boolean, default: false },
    slot: { type: String },
  },
  { _id: false },
);

const inventorySchema = new Schema<IInventorySchema>(
  {
    _id: { type: String, required: true },
    inventoryId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, unique: true, index: true, ref: 'User' },
    discordId: { type: String, required: true, index: true },
    items: { type: [inventoryItemSchema], default: [] },
    maxSlots: { type: Number, default: 100 },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

inventorySchema.index({ userId: 1 });

export const InventoryModel: Model<IInventorySchema> = mongoose.model<IInventorySchema>(
  'Inventory',
  inventorySchema,
  'inventories',
);
