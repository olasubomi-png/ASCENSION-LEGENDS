import { ID_PREFIXES } from '../../constants/index.js';
import type { IGuildService, GuildRecord } from '../../interfaces/IGuildService.js';
import type { IGuildSchema } from '../../models/index.js';
import type { GuildRepository } from '../../repositories/index.js';
import type { Result } from '../../types/common.js';
import { ok, err } from '../../types/common.js';
import { childLogger } from '../../utils/logger.js';
import { generateIdWithPrefix } from '../../utils/ulid.js';

const log = childLogger('GuildService');

export class GuildService implements IGuildService {
  constructor(private readonly guildRepo: GuildRepository) {}

  async getGuild(discordGuildId: string): Promise<Result<GuildRecord | null>> {
    try {
      const guild = await this.guildRepo.findByDiscordGuildId(discordGuildId);
      if (!guild) return ok(null);
      return ok(this.mapToRecord(guild));
    } catch (error) {
      log.error('Failed to get guild', { err: String(error), discordGuildId });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async createGuild(
    discordGuildId: string,
    name: string,
    ownerId: string,
  ): Promise<Result<GuildRecord>> {
    try {
      const existing = await this.guildRepo.findByDiscordGuildId(discordGuildId);
      if (existing) return err(new Error('Guild already exists'));
      const guild = await this.guildRepo.create({
        _id: generateIdWithPrefix(ID_PREFIXES.GUILD),
        discordGuildId,
        name,
        ownerId,
        memberCount: 1,
      });
      log.info('Guild created', { discordGuildId, name });
      return ok(this.mapToRecord(guild));
    } catch (error) {
      log.error('Failed to create guild', { err: String(error), discordGuildId });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private mapToRecord(guild: IGuildSchema): GuildRecord {
    return {
      id: guild._id,
      discordGuildId: guild.discordGuildId,
      name: guild.name,
      ownerId: guild.ownerId,
      memberCount: guild.memberCount,
      createdAt: guild.createdAt,
    };
  }
}
