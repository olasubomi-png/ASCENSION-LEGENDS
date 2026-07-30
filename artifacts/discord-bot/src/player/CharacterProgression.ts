/**
 * CharacterProgression — XP gain, level-up, and stat growth per level.
 *
 * XP formula: Book 1 §3.2
 * Stat growth per level: Book 1 §4.2 (class-specific multipliers)
 *
 * Stat points and skill points are awarded on level-up for the player
 * to spend manually (Book 1 §3.3).
 */

import { CLASS_DEFINITIONS, xpToNextLevel } from '../constants/classes.js';
import type { ClassId } from '../constants/classes.js';

import type { LevelUpResult, ProgressionResult, RuntimeStats } from './types.js';

// ──────────────────────────────────────────────────────────────────────────────
// Growth constants  (Book 1 §4.2)
// ──────────────────────────────────────────────────────────────────────────────

const STAT_POINTS_PER_LEVEL = 3;
const SKILL_POINTS_PER_LEVEL = 1;
const MAX_LEVEL = 100;

/** Stat gain per level-up (flat). Scaled by class multiplier below. */
const BASE_STAT_GROWTH: Readonly<Partial<RuntimeStats>> = {
  maxHp: 15,
  maxEnergy: 5,
  attack: 3,
  defense: 2,
  magic: 2,
  magicDefense: 2,
  speed: 1,
  luck: 1,
};

/**
 * Per-class stat growth multipliers.
 * Vanguard: tanky growth; Invoker: magic-heavy; Wanderer: speed-heavy.
 */
const CLASS_GROWTH_MULTIPLIERS: Readonly<
  Record<ClassId, Readonly<Partial<Record<keyof typeof BASE_STAT_GROWTH, number>>>>
> = {
  vanguard: { maxHp: 1.6, defense: 1.5, attack: 1.1, magic: 0.5, magicDefense: 1.1, speed: 0.8 },
  invoker:  { maxHp: 0.8, defense: 0.7, attack: 0.6, magic: 1.8, magicDefense: 1.4, speed: 1.1 },
  wanderer: { maxHp: 1.0, defense: 0.9, attack: 1.3, magic: 0.9, magicDefense: 0.8, speed: 1.6 },
} as const;

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Compute the stat gains earned when levelling up from `fromLevel` to
 * `fromLevel + 1` for a given class.
 */
export function statGainsForLevel(
  fromLevel: number,
  classId: string,
): Partial<RuntimeStats> {
  const mults = CLASS_GROWTH_MULTIPLIERS[classId as ClassId] ?? {};
  const gains: Partial<RuntimeStats> = {};

  for (const [key, baseGain] of Object.entries(BASE_STAT_GROWTH) as [
    keyof typeof BASE_STAT_GROWTH,
    number,
  ][]) {
    const multiplier = (mults[key] as number | undefined) ?? 1.0;
    // Scale slightly with level so high-level gains are meaningful.
    const levelScale = 1 + fromLevel * 0.01;
    const gain = Math.round(baseGain * multiplier * levelScale);
    if (gain > 0) {
      (gains as Record<string, number>)[key] = gain;
    }
  }

  return gains;
}

/**
 * Apply level-up stat gains to a RuntimeStats object (pure, returns new object).
 */
export function applyStatGains(
  current: RuntimeStats,
  gains: Partial<RuntimeStats>,
): RuntimeStats {
  const result = { ...current };
  for (const [key, gain] of Object.entries(gains) as [keyof RuntimeStats, number][]) {
    const prev = (result as Record<string, number>)[key] ?? 0;
    (result as Record<string, number>)[key] = prev + gain;
  }
  // When maxHp/maxEnergy grow, current values grow proportionally (full heal on level-up)
  result.hp = result.maxHp;
  result.energy = result.maxEnergy;
  result.stamina = result.maxStamina;
  return result;
}

// ──────────────────────────────────────────────────────────────────────────────
// CharacterProgression
// ──────────────────────────────────────────────────────────────────────────────

export class CharacterProgression {
  /**
   * Award XP to a character and process any resulting level-ups.
   *
   * @param currentLevel      Current character level.
   * @param currentExperience Current XP total.
   * @param currentStats      Current RuntimeStats (modified in-place conceptually).
   * @param classId           The character's class (determines stat growth).
   * @param xpGained          XP to award.
   * @returns ProgressionResult — full breakdown of XP and level-ups.
   */
  awardExperience(
    currentLevel: number,
    currentExperience: number,
    currentStats: RuntimeStats,
    classId: string,
    xpGained: number,
  ): { result: ProgressionResult; newStats: RuntimeStats } {
    let level = currentLevel;
    let experience = currentExperience + xpGained;
    let stats = { ...currentStats };
    const levelUps: LevelUpResult[] = [];

    while (level < MAX_LEVEL) {
      const xpNeeded = xpToNextLevel(level);
      if (experience < xpNeeded) break;

      experience -= xpNeeded;
      level += 1;

      const gains = statGainsForLevel(level - 1, classId);
      stats = applyStatGains(stats, gains);

      levelUps.push({
        newLevel: level,
        statGains: gains,
        statPointsGained: STAT_POINTS_PER_LEVEL,
        skillPointsGained: SKILL_POINTS_PER_LEVEL,
        levelsGained: 1,
      });
    }

    const result: ProgressionResult = {
      experienceGained: xpGained,
      newExperience: experience,
      levelUps,
      didLevelUp: levelUps.length > 0,
    };

    return { result, newStats: stats };
  }

  /**
   * XP required to advance from `level` to `level + 1`.
   */
  xpToNextLevel(level: number): number {
    return xpToNextLevel(level);
  }

  /**
   * XP required to reach a specific target level from a starting level,
   * accumulating across all intermediate levels.
   */
  xpToReachLevel(fromLevel: number, toLevel: number): number {
    let total = 0;
    for (let lvl = fromLevel; lvl < toLevel && lvl < MAX_LEVEL; lvl++) {
      total += xpToNextLevel(lvl);
    }
    return total;
  }

  /**
   * Compute class-based starting stats from the class definition.
   */
  startingStats(classId: string): RuntimeStats | null {
    const def = CLASS_DEFINITIONS[classId as ClassId];
    if (!def) return null;
    return {
      hp: def.stats.hp,
      maxHp: def.stats.maxHp,
      energy: def.stats.mp,
      maxEnergy: def.stats.maxMp,
      attack: def.stats.attack,
      defense: def.stats.defense,
      magic: def.stats.magicAttack,
      magicDefense: def.stats.magicDefense,
      speed: def.stats.speed,
      accuracy: def.stats.accuracy,
      evasion: def.stats.evasion,
      critChance: def.stats.critRate,
      critDamage: def.stats.critDamage,
      luck: def.stats.luck,
      stamina: 100,
      maxStamina: 100,
    };
  }
}
