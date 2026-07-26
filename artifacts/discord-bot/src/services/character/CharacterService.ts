import type { ClassId } from '../../constants/classes.js';
import { CLASS_DEFINITIONS, xpToNextLevel } from '../../constants/classes.js';
import { CACHE_KEYS, CACHE_TTL, ID_PREFIXES } from '../../constants/index.js';
import type { ICharacterService, CharacterProfile, CreateCharacterInput } from '../../interfaces/ICharacterService.js';
import type { ICacheService } from '../../interfaces/index.js';
import type { ICharacterSchema } from '../../models/CharacterModel.js';
import type { CharacterRepository } from '../../repositories/CharacterRepository.js';
import type { Result } from '../../types/common.js';
import { ok, err } from '../../types/common.js';
import { childLogger } from '../../utils/logger.js';
import { generateIdWithPrefix } from '../../utils/ulid.js';

const log = childLogger('CharacterService');

export class CharacterService implements ICharacterService {
  constructor(
    private readonly characterRepo: CharacterRepository,
    private readonly cache: ICacheService,
  ) {}

  async createCharacter(input: CreateCharacterInput): Promise<Result<CharacterProfile>> {
    try {
      const { userId, discordId, classId, name } = input;

      const classDef = CLASS_DEFINITIONS[classId as ClassId];
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!classDef) {
        return err(new Error(`Unknown class: ${classId}`));
      }

      const id = generateIdWithPrefix(ID_PREFIXES.CHARACTER);
      const character = await this.characterRepo.create({
        _id: id,
        characterId: id,
        userId,
        discordId,
        name: name.trim(),
        classId,
        level: 1,
        experience: 0,
        experienceToNextLevel: xpToNextLevel(1),
        stats: { ...classDef.stats },
        statPoints: 0,
        skillPoints: 0,
        locationId: 'starting_zone',
        zoneId: 'verdant_crossing',
        isActive: true,
      });

      const profile = this.mapToProfile(character);
      await this.cache.set(
        `${CACHE_KEYS.PLAYER}character:${discordId}`,
        profile,
        CACHE_TTL.PLAYER,
      );

      log.info('Character created', { discordId, classId, id });
      return ok(profile);
    } catch (error) {
      log.error('Failed to create character', { err: String(error), input });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async getActiveCharacter(discordId: string): Promise<Result<CharacterProfile | null>> {
    try {
      const cacheKey = `${CACHE_KEYS.PLAYER}character:${discordId}`;
      const cached = await this.cache.get<CharacterProfile>(cacheKey);
      if (cached) return ok(cached);

      const character = await this.characterRepo.findActiveByDiscordId(discordId);
      if (!character) return ok(null);

      const profile = this.mapToProfile(character);
      await this.cache.set(cacheKey, profile, CACHE_TTL.PLAYER);
      return ok(profile);
    } catch (error) {
      log.error('Failed to get active character', { err: String(error), discordId });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  async hasCharacter(discordId: string): Promise<boolean> {
    try {
      return this.characterRepo.existsByDiscordId(discordId);
    } catch {
      return false;
    }
  }

  private mapToProfile(character: ICharacterSchema): CharacterProfile {
    return {
      id: character._id,
      characterId: character.characterId,
      userId: character.userId,
      discordId: character.discordId,
      name: character.name,
      classId: character.classId,
      level: character.level,
      experience: character.experience,
      experienceToNextLevel: character.experienceToNextLevel,
      stats: character.stats,
      statPoints: character.statPoints,
      skillPoints: character.skillPoints,
      locationId: character.locationId,
      isActive: character.isActive,
      createdAt: character.createdAt,
      updatedAt: character.updatedAt,
    };
  }
}
