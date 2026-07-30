import type { ClassId } from '../constants/classes.js';
import type { ICharacterStats } from '../models/CharacterModel.js';
import type { Result } from '../types/common.js';

export interface CharacterProfile {
  id: string;
  characterId: string;
  userId: string;
  discordId: string;
  name: string;
  classId: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  stats: ICharacterStats;
  statPoints: number;
  skillPoints: number;
  locationId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCharacterInput {
  userId: string;
  discordId: string;
  classId: ClassId;
  name: string;
}

export interface AwardExperienceResult {
  character: CharacterProfile;
  experienceGained: number;
  didLevelUp: boolean;
  levelsGained: number;
  newLevel: number;
}

export interface ICharacterService {
  createCharacter(input: CreateCharacterInput): Promise<Result<CharacterProfile>>;
  getActiveCharacter(discordId: string): Promise<Result<CharacterProfile | null>>;
  hasCharacter(discordId: string): Promise<boolean>;
  awardExperience(
    characterId: string,
    discordId: string,
    xpGained: number,
  ): Promise<Result<AwardExperienceResult>>;
}
