import type { Result } from '../types/common.js';

export interface InventoryItem {
  id: string;
  userId: string;
  itemId: string;
  quantity: number;
  acquiredAt: Date;
}

export interface IInventoryService {
  getInventory(userId: string): Promise<Result<InventoryItem[]>>;
  grantItem(userId: string, itemId: string, quantity: number): Promise<Result<InventoryItem>>;
  removeItem(userId: string, itemId: string, quantity: number): Promise<Result<boolean>>;
}
