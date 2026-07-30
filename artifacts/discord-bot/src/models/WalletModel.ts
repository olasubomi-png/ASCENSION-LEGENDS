import mongoose, { Schema } from 'mongoose';
import type { HydratedDocument, Model } from 'mongoose';

export interface IWalletSchema {
  _id: string;
  userId: string;
  gold: number;
  gems: number;
  deletedAt?: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export type IWallet = HydratedDocument<IWalletSchema>;

const walletSchema = new Schema<IWalletSchema>(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, unique: true, ref: 'User' },
    gold: { type: Number, required: true, default: 0, min: 0 },
    gems: { type: Number, required: true, default: 0, min: 0 },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const WalletModel: Model<IWalletSchema> = mongoose.model<IWalletSchema>(
  'Wallet',
  walletSchema,
  'wallets',
);
