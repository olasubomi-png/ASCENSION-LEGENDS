/**
 * CharacterAttributes — derives display/combat attributes from RuntimeStats.
 *
 * Computed attributes are recalculated whenever stats change.
 * Caps enforced per Book 1 §4.7–§4.10:
 *   Accuracy:   max 100%
 *   Evasion:    max 90%
 *   CritChance: max 75%
 *
 * Power Rating formula: Book 1 §3.4
 */

import { calculatePowerRating, getPowerRatingLabel } from '../utils/statsCalculator.js';

import type { CharacterAttributes, RuntimeStats } from './types.js';

// ──────────────────────────────────────────────────────────────────────────────
// Caps (integer percent)
// ──────────────────────────────────────────────────────────────────────────────

const MAX_ACCURACY = 100;
const MAX_EVASION = 90;
const MAX_CRIT_CHANCE = 75;

// ──────────────────────────────────────────────────────────────────────────────
// Computation
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Compute derived CharacterAttributes from a RuntimeStats snapshot.
 * This function is pure — given the same stats it always returns the same result.
 */
export function computeAttributes(stats: RuntimeStats): CharacterAttributes {
  const effectiveAccuracy = Math.min(MAX_ACCURACY, Math.max(0, stats.accuracy));
  const effectiveEvasion = Math.min(MAX_EVASION, Math.max(0, stats.evasion));
  const effectiveCritChance = Math.min(MAX_CRIT_CHANCE, Math.max(0, stats.critChance));

  const powerRating = calculatePowerRating({
    attack: stats.attack,
    defense: stats.defense,
    hp: stats.maxHp,
    speed: stats.speed,
    critRate: stats.critChance,
    critDamage: stats.critDamage,
    accuracy: stats.accuracy,
    evasion: stats.evasion,
    luck: stats.luck,
  });

  return {
    effectiveAttack: stats.attack,
    effectiveMagic: stats.magic,
    effectiveDefense: stats.defense,
    effectiveMagicDefense: stats.magicDefense,
    powerRating,
    rankLabel: getPowerRatingLabel(powerRating),
    effectiveEvasion,
    effectiveAccuracy,
    effectiveCritChance,
  };
}
