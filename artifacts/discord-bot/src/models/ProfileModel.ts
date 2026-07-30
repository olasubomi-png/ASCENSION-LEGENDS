import mongoose, { Schema } from 'mongoose';
import type { HydratedDocument, Model } from 'mongoose';

export interface IProfileSchema {
  _id: string;
  profileId: string;
  userId: string;
  discordId: string;
  /** Prestige level (0 = not yet prestiged) */
  prestigeLevel: number;
  /** Current power rating — recalculated on stat changes */
  powerRating: number;
  /** Total battles fought */
  battlesTotal: number;
  /** Total battles won */
  battlesWon: number;
  /** Total battles lost */
  battlesLost: number;
  /** Current PvP rank points */
  rankPoints: number;
  /** Current guild ID, if any */
  guildId?: string | undefined;
  /** Total XP earned across all prestiges */
  totalXpEarned: number;
  /** Unlocked cosmetic titles */
  titles: string[];
  /** Currently active title */
  activeTitle?: string | undefined;
  /** Login streak count */
  loginStreak: number;
  /** Last login date */
  lastLoginDate?: Date | undefined;
  deletedAt?: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export type IProfile = HydratedDocument<IProfileSchema>;

const profileSchema = new Schema<IProfileSchema>(
  {
    _id: { type: String, required: true },
    profileId: { type: String, required: true, unique: true },
    userId: { type: String, required: true, unique: true, ref: 'User' },
    discordId: { type: String, required: true, index: true },
    prestigeLevel: { type: Number, default: 0, min: 0, max: 10 },
    powerRating: { type: Number, default: 0, min: 0 },
    battlesTotal: { type: Number, default: 0, min: 0 },
    battlesWon: { type: Number, default: 0, min: 0 },
    battlesLost: { type: Number, default: 0, min: 0 },
    rankPoints: { type: Number, default: 0, min: 0 },
    guildId: { type: String },
    totalXpEarned: { type: Number, default: 0, min: 0 },
    titles: { type: [String], default: [] },
    activeTitle: { type: String },
    loginStreak: { type: Number, default: 0, min: 0 },
    lastLoginDate: { type: Date },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

profileSchema.index({ powerRating: -1 });
profileSchema.index({ rankPoints: -1 });

export const ProfileModel: Model<IProfileSchema> = mongoose.model<IProfileSchema>(
  'Profile',
  profileSchema,
  'profiles',
);
