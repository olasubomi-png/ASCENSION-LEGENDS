import { CACHE_KEYS, CACHE_TTL, ID_PREFIXES } from '../../constants/index.js';
import type { IPlayerService, PlayerProfile } from '../../interfaces/IPlayerService.js';
import type { ICacheService } from '../../interfaces/index.js';
import type { IUserSchema } from '../../models/index.js';
import type { UserRepository } from '../../repositories/index.js';
import type { Result } from '../../types/common.js';
import { ok, err } from '../../types/common.js';
import { childLogger } from '../../utils/logger.js';
import { generateIdWithPrefix } from '../../utils/ulid.js';

const log = childLogger('PlayerService');

export class PlayerService implements IPlayerService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly cache: ICacheService,
  ) {}

  async getOrCreatePlayer(discordId: string, username: string): Promise<Result<PlayerProfile>> {
    try {
      const existing = await this.getPlayer(discordId);
      if (existing.ok && existing.value) {
        return ok(existing.value);
      }

      const id = generateIdWithPrefix(ID_PREFIXES.USER);
      const user = await this.userRepo.create({
        _id: id,
        discordId,
        username,
        discriminator: '0',
      });

      const profile = this.mapToProfile(user);
      await this.cache.set(`${CACHE_KEYS.PLAYER}${discordId}`, profile, CACHE_TTL.PLAYER);

      log.info('New player created', { discordId, id });
      return ok(profile);
    } catch (error) {
      log.error('Failed to get or create player', { err: String(error), discordId });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async getPlayer(discordId: string): Promise<Result<PlayerProfile | null>> {
    try {
      const cached = await this.cache.get<PlayerProfile>(`${CACHE_KEYS.PLAYER}${discordId}`);
      if (cached) return ok(cached);

      const user = await this.userRepo.findByDiscordId(discordId);
      if (!user) return ok(null);

      const profile = this.mapToProfile(user);
      await this.cache.set(`${CACHE_KEYS.PLAYER}${discordId}`, profile, CACHE_TTL.PLAYER);
      return ok(profile);
    } catch (error) {
      log.error('Failed to get player', { err: String(error), discordId });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async updateDisplayName(discordId: string, displayName: string): Promise<Result<PlayerProfile>> {
    try {
      const user = await this.userRepo.findByDiscordId(discordId);
      if (!user) return err(new Error('Player not found'));

      const updated = await this.userRepo.update(user._id, { username: displayName });
      if (!updated) return err(new Error('Update failed'));

      const profile = this.mapToProfile(updated);
      await this.cache.del(`${CACHE_KEYS.PLAYER}${discordId}`);
      return ok(profile);
    } catch (error) {
      log.error('Failed to update display name', { err: String(error), discordId });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private mapToProfile(user: IUserSchema): PlayerProfile {
    return {
      id: user._id,
      discordId: user.discordId,
      username: user.username,
      displayName: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
