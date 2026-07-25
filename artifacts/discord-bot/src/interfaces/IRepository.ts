import type { PaginatedResult } from '../types/common.js';

/**
 * Generic repository interface — all concrete repositories implement this.
 */
export interface IRepository<TEntity, TId = string> {
  findById(id: TId): Promise<TEntity | null>;
  findMany(filter: Partial<TEntity>, limit?: number, cursor?: string): Promise<PaginatedResult<TEntity>>;
  create(data: Omit<TEntity, '_id' | 'createdAt' | 'updatedAt'>): Promise<TEntity>;
  update(id: TId, data: Partial<TEntity>): Promise<TEntity | null>;
  delete(id: TId): Promise<boolean>;
}
