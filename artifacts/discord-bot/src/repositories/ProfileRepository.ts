import type { IProfileSchema } from '../models/ProfileModel.js';
import { ProfileModel } from '../models/ProfileModel.js';

export type CreateProfileData = Pick<
  IProfileSchema,
  '_id' | 'profileId' | 'userId' | 'discordId' | 'powerRating'
>;

/** Numeric profile fields that may be atomically incremented. */
export type ProfileIncrementFields = Partial<
  Pick<
    IProfileSchema,
    | 'battlesTotal'
    | 'battlesWon'
    | 'battlesLost'
    | 'totalXpEarned'
    | 'rankPoints'
    | 'loginStreak'
    | 'powerRating'
    | 'prestigeLevel'
  >
>;

export class ProfileRepository {
  async findByDiscordId(discordId: string): Promise<IProfileSchema | null> {
    return ProfileModel.findOne({ discordId, deletedAt: null })
      .lean()
      .exec() as Promise<IProfileSchema | null>;
  }

  async findByUserId(userId: string): Promise<IProfileSchema | null> {
    return ProfileModel.findOne({ userId, deletedAt: null })
      .lean()
      .exec() as Promise<IProfileSchema | null>;
  }

  async create(data: CreateProfileData): Promise<IProfileSchema> {
    const profile = new ProfileModel(data);
    const saved = await profile.save();
    return saved.toObject() as IProfileSchema;
  }

  async update(
    userId: string,
    data: Partial<IProfileSchema>,
  ): Promise<IProfileSchema | null> {
    return ProfileModel.findOneAndUpdate(
      { userId, deletedAt: null },
      { $set: data },
      { new: true },
    )
      .lean()
      .exec() as Promise<IProfileSchema | null>;
  }

  /**
   * Atomically increment one or more numeric profile counters ($inc).
   * Used by ProfileService.recordBattleResult (battlesTotal + win/loss in one write).
   */
  async increment(
    userId: string,
    fields: ProfileIncrementFields,
  ): Promise<IProfileSchema | null> {
    return ProfileModel.findOneAndUpdate(
      { userId, deletedAt: null },
      { $inc: fields },
      { new: true },
    )
      .lean()
      .exec() as Promise<IProfileSchema | null>;
  }

  /** Single-field increment helper (kept for call sites that only touch one counter). */
  async incrementStat(
    userId: string,
    field: 'battlesTotal' | 'battlesWon' | 'battlesLost' | 'totalXpEarned',
    amount: number,
  ): Promise<IProfileSchema | null> {
    return this.increment(userId, { [field]: amount });
  }
}
