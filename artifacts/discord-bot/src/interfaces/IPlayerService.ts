import type { Result } from '../types/common.js';

export interface PlayerProfile {
  id: string;
  discordId: string;
  username: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlayerService {
  getOrCreatePlayer(discordId: string, username: string): Promise<Result<PlayerProfile>>;
  getPlayer(discordId: string): Promise<Result<PlayerProfile | null>>;
  updateDisplayName(discordId: string, displayName: string): Promise<Result<PlayerProfile>>;
}
