import { CACHE_KEYS, CACHE_TTL, ID_PREFIXES } from '../../constants/index.js';
import type { IEconomyService, WalletBalance } from '../../interfaces/IEconomyService.js';
import type { ICacheService } from '../../interfaces/index.js';
import type { IWalletSchema } from '../../models/index.js';
import type { WalletRepository } from '../../repositories/index.js';
import type { Result } from '../../types/common.js';
import { ok, err } from '../../types/common.js';
import { childLogger } from '../../utils/logger.js';
import { generateIdWithPrefix } from '../../utils/ulid.js';

const log = childLogger('EconomyService');

export class EconomyService implements IEconomyService {
  constructor(
    private readonly walletRepo: WalletRepository,
    private readonly cache: ICacheService,
  ) {}

  async getBalance(userId: string): Promise<Result<WalletBalance>> {
    try {
      const cached = await this.cache.get<WalletBalance>(`${CACHE_KEYS.WALLET}${userId}`);
      if (cached) return ok(cached);

      const wallet = await this.walletRepo.findByUserId(userId);
      if (!wallet) return this.provisionWallet(userId);

      const balance = this.mapToBalance(wallet);
      await this.cache.set(`${CACHE_KEYS.WALLET}${userId}`, balance, CACHE_TTL.WALLET);
      return ok(balance);
    } catch (error) {
      log.error('Failed to get balance', { err: String(error), userId });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async credit(
    userId: string,
    amount: number,
    currency: 'gold' | 'gems',
    reason: string,
  ): Promise<Result<WalletBalance>> {
    try {
      if (amount <= 0) return err(new Error('Amount must be positive'));
      const wallet = await this.walletRepo.incrementBalance(userId, currency, amount);
      if (!wallet) return err(new Error('Wallet not found'));
      const balance = this.mapToBalance(wallet);
      await this.cache.del(`${CACHE_KEYS.WALLET}${userId}`);
      log.info('Balance credited', { userId, amount, currency, reason });
      return ok(balance);
    } catch (error) {
      log.error('Failed to credit balance', { err: String(error), userId, amount, currency });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async debit(
    userId: string,
    amount: number,
    currency: 'gold' | 'gems',
    reason: string,
  ): Promise<Result<WalletBalance>> {
    try {
      if (amount <= 0) return err(new Error('Amount must be positive'));
      const current = await this.getBalance(userId);
      if (!current.ok) return current;
      if (current.value[currency] < amount) {
        return err(
          new Error(`Insufficient ${currency}: need ${amount}, have ${current.value[currency]}`),
        );
      }
      const wallet = await this.walletRepo.incrementBalance(userId, currency, -amount);
      if (!wallet) return err(new Error('Wallet not found'));
      const balance = this.mapToBalance(wallet);
      await this.cache.del(`${CACHE_KEYS.WALLET}${userId}`);
      log.info('Balance debited', { userId, amount, currency, reason });
      return ok(balance);
    } catch (error) {
      log.error('Failed to debit balance', { err: String(error), userId, amount, currency });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private async provisionWallet(userId: string): Promise<Result<WalletBalance>> {
    const wallet = await this.walletRepo.create({
      _id: generateIdWithPrefix(ID_PREFIXES.WALLET),
      userId,
      gold: 0,
      gems: 0,
    });
    const balance = this.mapToBalance(wallet);
    await this.cache.set(`${CACHE_KEYS.WALLET}${userId}`, balance, CACHE_TTL.WALLET);
    return ok(balance);
  }

  private mapToBalance(wallet: IWalletSchema): WalletBalance {
    return {
      userId: wallet.userId,
      gold: wallet.gold,
      gems: wallet.gems,
      updatedAt: wallet.updatedAt,
    };
  }
}
