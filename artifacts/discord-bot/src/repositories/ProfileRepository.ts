import type { IProfileSchema } from '../models/ProfileModel.js';
import { ProfileModel } from '../models/ProfileModel.js';

export type CreateProfileData = Pick<
  IProfileSchema,
  '_id' | 'profileId' | 'userId' | 'discordId' | 'powerRating'
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

  async incrementStat(
    userId: string,
    field: 'battlesTotal' | 'battlesWon' | 'battlesLost' | 'totalXpEarned',
    amount: number,
  ): Promise<IProfileSchema | null> {
    return ProfileModel.findOneAndUpdate(
      { userId, deletedAt: null },
      { $inc: { [field]: amount } },
      { new: true },
    )
      .lean()
      .exec() as Promise<IProfileSchema | null>;
  }
}
