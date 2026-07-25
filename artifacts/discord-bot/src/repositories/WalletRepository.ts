import type { IWalletSchema } from '../models/index.js';
import { WalletModel } from '../models/index.js';

export type CreateWalletData = Pick<IWalletSchema, '_id' | 'userId' | 'gold' | 'gems'> & {
  deletedAt?: Date | undefined;
};

export class WalletRepository {
  async findByUserId(userId: string): Promise<IWalletSchema | null> {
    return WalletModel.findOne({ userId, deletedAt: null }).lean().exec() as Promise<IWalletSchema | null>;
  }

  async create(data: CreateWalletData): Promise<IWalletSchema> {
    const wallet = new WalletModel(data);
    const saved = await wallet.save();
    return saved.toObject() as IWalletSchema;
  }

  async incrementBalance(
    userId: string,
    field: 'gold' | 'gems',
    amount: number,
  ): Promise<IWalletSchema | null> {
    return WalletModel.findOneAndUpdate(
      { userId, deletedAt: null },
      { $inc: { [field]: amount } },
      { new: true },
    ).lean().exec() as Promise<IWalletSchema | null>;
  }
}
