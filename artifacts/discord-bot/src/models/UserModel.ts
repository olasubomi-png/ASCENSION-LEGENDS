import mongoose, { Schema } from 'mongoose';
import type { HydratedDocument, Model } from 'mongoose';

export interface IUserSchema {
  _id: string;
  discordId: string;
  username: string;
  discriminator: string;
  email?: string | undefined;
  deletedAt?: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export type IUser = HydratedDocument<IUserSchema>;

const userSchema = new Schema<IUserSchema>(
  {
    _id: { type: String, required: true },
    discordId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true },
    discriminator: { type: String, default: '0' },
    email: { type: String },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.index({ deletedAt: 1 });

export const UserModel: Model<IUserSchema> = mongoose.model<IUserSchema>(
  'User',
  userSchema,
  'users',
);
