import mongoose, { Schema } from 'mongoose';
import type { HydratedDocument, Model } from 'mongoose';

export interface IGuildSchema {
  _id: string;
  discordGuildId: string;
  name: string;
  ownerId: string;
  memberCount: number;
  deletedAt?: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export type IGuild = HydratedDocument<IGuildSchema>;

const guildSchema = new Schema<IGuildSchema>(
  {
    _id: { type: String, required: true },
    discordGuildId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    ownerId: { type: String, required: true, ref: 'User' },
    memberCount: { type: Number, required: true, default: 1 },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const GuildModel: Model<IGuildSchema> = mongoose.model<IGuildSchema>(
  'Guild',
  guildSchema,
  'guilds',
);
