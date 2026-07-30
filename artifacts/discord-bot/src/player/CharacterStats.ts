/**
 * CharacterStats — mapping and initialisation helpers.
 *
 * Converts persisted ICharacterStats (model layer) to the runtime
 * RuntimeStats representation, and provides a zero/default constructor.
 *
 * Naming bridge:
 *   mp / maxMp      → energy / maxEnergy  (runtime layer)
 *   magicAttack     → magic
 *   stamina         → new runtime-only resource (100 / 100 default)
 */

import type { ICharacterStats } from '../models/CharacterModel.js';

import type { RuntimeStats, StatKey } from './types.js';

// ──────────────────────────────────────────────────────────────────────────────
// Default values
// ──────────────────────────────────────────────────────────────────────────────

export const DEFAULT_STAMINA = 100;

// ──────────────────────────────────────────────────────────────────────────────
// Conversion helpers
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Convert a persisted ICharacterStats to an in-memory RuntimeStats.
 * Current HP/Energy are initialised to their maximums (character is at full health).
 */
export function modelStatsToRuntime(model: ICharacterStats): RuntimeStats {
  return {
    hp: model.hp,
    maxHp: model.maxHp,
    energy: model.mp,
    maxEnergy: model.maxMp,
    attack: model.attack,
    defense: model.defense,
    magic: model.magicAttack,
    magicDefense: model.magicDefense,
    speed: model.speed,
    accuracy: model.accuracy,
    evasion: model.evasion,
    critChance: model.critRate,
    critDamage: model.critDamage,
    luck: model.luck,
    stamina: DEFAULT_STAMINA,
    maxStamina: DEFAULT_STAMINA,
  };
}

/**
 * Convert a RuntimeStats back to the persisted ICharacterStats shape.
 * Stamina is not persisted (runtime-only).
 */
export function runtimeStatsToModel(runtime: RuntimeStats): ICharacterStats {
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
    accuracy: runtime.accuracy,
    evasion: runtime.evasion,
    critRate: runtime.critChance,
    critDamage: runtime.critDamage,
    luck: runtime.luck,
  };
}

/**
 * Produce a zero-value RuntimeStats (useful for testing / placeholder).
 */
export function zeroRuntimeStats(): RuntimeStats {
  return {
    hp: 0,
    maxHp: 0,
    energy: 0,
    maxEnergy: 0,
    attack: 0,
    defense: 0,
    magic: 0,
    magicDefense: 0,
    speed: 0,
    accuracy: 0,
    evasion: 0,
    critChance: 0,
    critDamage: 0,
    luck: 0,
    stamina: 0,
    maxStamina: 0,
  };
}

/**
 * Return a deep copy of RuntimeStats (avoids accidental mutation).
 */
export function cloneRuntimeStats(stats: RuntimeStats): RuntimeStats {
  return { ...stats };
}

// ──────────────────────────────────────────────────────────────────────────────
// Stat clamping
// ──────────────────────────────────────────────────────────────────────────────

/** Minimum values for each stat. Prevents negatives from debuffs. */
export const STAT_MINIMUMS: Readonly<Record<StatKey, number>> = {
  hp: 0,
  maxHp: 1,
  energy: 0,
  maxEnergy: 1,
  attack: 0,
  defense: 0,
  magic: 0,
  magicDefense: 0,
  speed: 1,
  accuracy: 1,
  evasion: 0,
  critChance: 0,
  critDamage: 100, // 100% minimum — never reduces below base damage
  luck: 0,
  stamina: 0,
  maxStamina: 1,
} as const;

/** Maximum caps for percentage stats (Book 1 §4.7–§4.10). */
export const STAT_MAXIMUMS: Readonly<Partial<Record<StatKey, number>>> = {
  accuracy: 100,
  evasion: 90,
  critChance: 75,
} as const;

/**
 * Clamp a single stat value to its valid range.
 */
export function clampStat(key: StatKey, value: number): number {
  const min = STAT_MINIMUMS[key];
  const max = STAT_MAXIMUMS[key];
  const clamped = Math.max(min, value);
  return max !== undefined ? Math.min(max, clamped) : clamped;
}

/**
 * Apply clamping to every stat in a RuntimeStats object in-place.
 */
export function clampAllStats(stats: RuntimeStats): RuntimeStats {
  const keys = Object.keys(stats) as StatKey[];
  const clamped = { ...stats };
  for (const key of keys) {
    (clamped as Record<StatKey, number>)[key] = clampStat(
      key,
      (stats as Record<StatKey, number>)[key],
    );
  }
  // HP/energy cannot exceed their maximums
  clamped.hp = Math.min(clamped.hp, clamped.maxHp);
  clamped.energy = Math.min(clamped.energy, clamped.maxEnergy);
  clamped.stamina = Math.min(clamped.stamina, clamped.maxStamina);
  return clamped;
}
