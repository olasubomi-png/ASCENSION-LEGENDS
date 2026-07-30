
import type { ClassId } from '../../constants/classes.js';
import { CLASS_DEFINITIONS, xpToNextLevel } from '../../constants/classes.js';
import { CACHE_KEYS, CACHE_TTL, ID_PREFIXES } from '../../constants/index.js';
import type {
  ICharacterService,
  CharacterProfile,
  CreateCharacterInput,
  AwardExperienceResult,
} from '../../interfaces/ICharacterService.js';
import type { ICacheService } from '../../interfaces/index.js';
import type { ICharacterSchema, ICharacterStats } from '../../models/CharacterModel.js';
import { CharacterProgression } from '../../player/CharacterProgression.js';
import type { RuntimeStats } from '../../player/types.js';
import type { CharacterRepository } from '../../repositories/CharacterRepository.js';
import type { Result } from '../../types/common.js';
import { ok, err } from '../../types/common.js';
import { childLogger } from '../../utils/logger.js';
import { generateIdWithPrefix } from '../../utils/ulid.js';
import { calculatePowerRatingFromStats } from '../../utils/statsCalculator.js';

const log = childLogger('CharacterService');
const progression = new CharacterProgression();

function toRuntimeStats(stats: ICharacterStats): RuntimeStats {
  return {
    hp: stats.hp,
    maxHp: stats.maxHp,
    energy: stats.mp,
    maxEnergy: stats.maxMp,
    attack: stats.attack,
    defense: stats.defense,
    magic: stats.magicAttack,
    magicDefense: stats.magicDefense,
    speed: stats.speed,
    accuracy: stats.accuracy,
    evasion: stats.evasion,
    critChance: stats.critRate,
    critDamage: stats.critDamage,
    luck: stats.luck,
    stamina: 100,
    maxStamina: 100,
  };
}

function fromRuntimeStats(runtime: RuntimeStats, _previous: ICharacterStats): ICharacterStats {
  return {
    hp: runtime.hp,
    maxHp: runtime.maxHp,
    mp: runtime.energy,
    maxMp: runtime.maxEnergy,
    attack: runtime.attack,
    defense: runtime.defense,
    magicAttack: runtime.magic,
    magicDefense: runtime.magicDefense,
    speed: runtime.speed,
    luck: runtime.luck,
    critRate: runtime.critChance,
    critDamage: runtime.critDamage,
    evasion: runtime.evasion,
    accuracy: runtime.accuracy,
  };
}

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

  async awardExperience(
    characterId: string,
    discordId: string,
    xpGained: number,
  ): Promise<Result<AwardExperienceResult>> {
    try {
      if (xpGained <= 0) {
        return err(new Error('xpGained must be positive'));
      }

      const existing = await this.characterRepo.findById(characterId);
      if (!existing) {
        return err(new Error('Character not found'));
      }

      const runtime = toRuntimeStats(existing.stats);
      const { result, newStats } = progression.awardExperience(
        existing.level,
        existing.experience,
        runtime,
        existing.classId,
        xpGained,
      );

      const levelsGained = result.levelUps.reduce((sum, lu) => sum + lu.levelsGained, 0);
      const newLevel = result.didLevelUp
        ? result.levelUps[result.levelUps.length - 1]!.newLevel
        : existing.level;

      const statPointsGained = result.levelUps.reduce((sum, lu) => sum + lu.statPointsGained, 0);
      const skillPointsGained = result.levelUps.reduce((sum, lu) => sum + lu.skillPointsGained, 0);

      const persistedStats = fromRuntimeStats(newStats, existing.stats);
      // Full heal on level-up already applied in progression; otherwise keep current HP/MP
      if (!result.didLevelUp) {
        persistedStats.hp = existing.stats.hp;
        persistedStats.mp = existing.stats.mp;
      }

      const updated = await this.characterRepo.update(characterId, {
        level: newLevel,
        experience: result.newExperience,
        experienceToNextLevel: xpToNextLevel(newLevel),
        stats: persistedStats,
        statPoints: existing.statPoints + statPointsGained,
        skillPoints: existing.skillPoints + skillPointsGained,
      });

      if (!updated) {
        return err(new Error('Failed to persist character progression'));
      }

      const profile = this.mapToProfile(updated);
      await this.cache.del(`${CACHE_KEYS.PLAYER}character:${discordId}`);
      await this.cache.set(
        `${CACHE_KEYS.PLAYER}character:${discordId}`,
        profile,
        CACHE_TTL.PLAYER,
      );

      log.info('Experience awarded', {
        characterId,
        xpGained,
        didLevelUp: result.didLevelUp,
        newLevel,
      });

      return ok({
        character: profile,
        experienceGained: xpGained,
        didLevelUp: result.didLevelUp,
        levelsGained,
        newLevel,
      });
    } catch (error) {
      log.error('Failed to award experience', { err: String(error), characterId, xpGained });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /** Helper for callers that need fresh PR after level-up. */
  static powerRatingFromProfile(character: CharacterProfile): number {
    return calculatePowerRatingFromStats(character.stats);
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
