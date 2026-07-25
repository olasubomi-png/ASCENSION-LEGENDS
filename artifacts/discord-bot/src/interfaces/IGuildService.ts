import type { Result } from '../types/common.js';

export interface GuildRecord {
  id: string;
  discordGuildId: string;
  name: string;
  ownerId: string;
  memberCount: number;
  createdAt: Date;
}

export interface IGuildService {
  getGuild(discordGuildId: string): Promise<Result<GuildRecord | null>>;
  createGuild(discordGuildId: string, name: string, ownerId: string): Promise<Result<GuildRecord>>;
}
