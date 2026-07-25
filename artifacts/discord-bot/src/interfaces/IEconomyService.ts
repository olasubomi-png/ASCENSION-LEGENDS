import type { Result } from '../types/common.js';

export interface WalletBalance {
  userId: string;
  gold: number;
  gems: number;
  updatedAt: Date;
}

export type TransactionType = 'credit' | 'debit' | 'transfer';

export interface IEconomyService {
  getBalance(userId: string): Promise<Result<WalletBalance>>;
  credit(userId: string, amount: number, currency: 'gold' | 'gems', reason: string): Promise<Result<WalletBalance>>;
  debit(userId: string, amount: number, currency: 'gold' | 'gems', reason: string): Promise<Result<WalletBalance>>;
}
