import type { ClassId } from '../constants/classes.js';
import type { Result } from '../types/common.js';

export interface RegistrationInput {
  discordId: string;
  username: string;
  characterName: string;
  classId: ClassId;
}

export interface RegistrationResult {
  userId: string;
  characterId: string;
  inventoryId: string;
  profileId: string;
  characterName: string;
  classId: ClassId;
  starterGold: number;
}

export interface IRegistrationService {
  isRegistered(discordId: string): Promise<boolean>;
  register(input: RegistrationInput): Promise<Result<RegistrationResult>>;
}
