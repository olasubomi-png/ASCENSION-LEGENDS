
import { CACHE_KEYS, CACHE_TTL, ID_PREFIXES } from '../../constants/index.js';
import type { IProfileService, ProfileData } from '../../interfaces/IProfileService.js';
import type { ICacheService } from '../../interfaces/index.js';
import type { IProfileSchema } from '../../models/ProfileModel.js';
import type { ProfileRepository } from '../../repositories/ProfileRepository.js';
import type { Result } from '../../types/common.js';
import { ok, err } from '../../types/common.js';
import { childLogger } from '../../utils/logger.js';
import { generateIdWithPrefix } from '../../utils/ulid.js';

const log = childLogger('ProfileService');

export class ProfileService implements IProfileService {
  constructor(
    private readonly profileRepo: ProfileRepository,
    private readonly cache: ICacheService,
  ) {}

  async getProfile(discordId: string): Promise<Result<ProfileData | null>> {
    try {
      const cacheKey = `${CACHE_KEYS.PLAYER}profile:${discordId}`;
      const cached = await this.cache.get<ProfileData>(cacheKey);
      if (cached) return ok(cached);

      const profile = await this.profileRepo.findByDiscordId(discordId);
      if (!profile) return ok(null);

      const data = this.mapToData(profile);
      await this.cache.set(cacheKey, data, CACHE_TTL.PLAYER);
      return ok(data);
    } catch (error) {
      log.error('Failed to get profile', { err: String(error), discordId });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async createProfile(
    userId: string,
    discordId: string,
    powerRating: number,
  ): Promise<Result<ProfileData>> {
    try {
      const id = generateIdWithPrefix(ID_PREFIXES.PROFILE);
      const profile = await this.profileRepo.create({
        _id: id,
        profileId: id,
        userId,
        discordId,
        powerRating,
      });
      const data = this.mapToData(profile);
      await this.cache.set(
        `${CACHE_KEYS.PLAYER}profile:${discordId}`,
        data,
        CACHE_TTL.PLAYER,
      );
      log.info('Profile created', { userId, discordId, powerRating });
      return ok(data);
    } catch (error) {
      log.error('Failed to create profile', { err: String(error), userId });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async updatePowerRating(userId: string, powerRating: number): Promise<Result<ProfileData>> {
    try {
      const updated = await this.profileRepo.update(userId, { powerRating });
      if (!updated) return err(new Error('Profile not found'));
      await this.cache.del(`${CACHE_KEYS.PLAYER}profile:${updated.discordId}`);
      return ok(this.mapToData(updated));
    } catch (error) {
      log.error('Failed to update power rating', { err: String(error), userId });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async recordBattleResult(userId: string, won: boolean): Promise<Result<ProfileData>> {
    try {
      const increment: Partial<IProfileSchema> & Record<string, unknown> = {
        battlesTotal: 1,
        ...(won ? { battlesWon: 1 } : { battlesLost: 1 }),
      };
      const updated = await this.profileRepo.increment(userId, increment);
      if (!updated) return err(new Error('Profile not found'));
      await this.cache.del(`${CACHE_KEYS.PLAYER}profile:${updated.discordId}`);
      return ok(this.mapToData(updated));
    } catch (error) {
      log.error('Failed to record battle result', { err: String(error), userId, won });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private mapToData(profile: IProfileSchema): ProfileData {
    return {
      id: profile._id,
      profileId: profile.profileId,
      userId: profile.userId,
      discordId: profile.discordId,
      prestigeLevel: profile.prestigeLevel,
      powerRating: profile.powerRating,
      battlesTotal: profile.battlesTotal,
      battlesWon: profile.battlesWon,
      battlesLost: profile.battlesLost,
      rankPoints: profile.rankPoints,
      guildId: profile.guildId,
      titles: profile.titles,
      activeTitle: profile.activeTitle,
      loginStreak: profile.loginStreak,
      lastLoginDate: profile.lastLoginDate,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
