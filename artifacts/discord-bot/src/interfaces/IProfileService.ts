import type { Result } from '../types/common.js';

export interface ProfileData {
  id: string;
  profileId: string;
  userId: string;
  discordId: string;
  prestigeLevel: number;
  powerRating: number;
  battlesTotal: number;
  battlesWon: number;
  battlesLost: number;
  rankPoints: number;
  guildId?: string | undefined;
  titles: string[];
  activeTitle?: string | undefined;
  loginStreak: number;
  lastLoginDate?: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProfileService {
  getProfile(discordId: string): Promise<Result<ProfileData | null>>;
  createProfile(userId: string, discordId: string, powerRating: number): Promise<Result<ProfileData>>;
  updatePowerRating(userId: string, powerRating: number): Promise<Result<ProfileData>>;
  /** Record a completed battle (increments total + win or loss). */
  recordBattleResult(userId: string, won: boolean): Promise<Result<ProfileData>>;
}
