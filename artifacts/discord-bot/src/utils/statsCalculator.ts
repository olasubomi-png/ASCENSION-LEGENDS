/**
 * Stats Calculator — Book 1 formulas for Power Rating computation.
 *
 * All formulas sourced from Book1-Game-Developer-Bible.md:
 *   §3.4 Power Rating formula
 *   §3.2 XP formula
 *
 * NOTE: critRate, critDamage, accuracy, evasion are stored as integer percentages
 * (e.g. critRate = 5 means 5%). The PR formula is applied with decimal conversion.
 */

import type { ClassStats } from '../constants/classes.js';

// ──────────────────────────────────────────────────────────────────────────────
// Power Rating (Book 1 §3.4)
// ──────────────────────────────────────────────────────────────────────────────

export interface PowerRatingInput {
  attack: number;
  defense: number;
  hp: number;
  speed: number;
  /** Integer percent (e.g. 5 = 5%) */
  critRate: number;
  /** Integer percent (e.g. 150 = 150%) */
  critDamage: number;
  /** Integer percent (e.g. 85 = 85%) */
  accuracy: number;
  /** Integer percent (e.g. 10 = 10%) */
  evasion: number;
  luck: number;
  equipmentScore?: number;
  skillScore?: number;
  transformationBonus?: number;
  prestigeLevel?: number;
}

/**
 * Compute Power Rating using the Book 1 §3.4 formula.
 *
 * PR = (Attack × 2.0) + (Defense × 1.5) + (HP / 10)
 *    + (Speed × 1.2) + (CritChance_decimal × 200)
 *    + (CritDamage_decimal × 100) + (Accuracy_decimal × 100)
 *    + (Evasion_decimal × 150) + (Luck × 80)
 *    + EquipmentScore + (SkillScore × 1.5)
 *    + TransformationBonus + (PrestigeLevel × 500)
 *
 * Percentage stats are divided by 100 before applying the multipliers.
 */
export function calculatePowerRating(input: PowerRatingInput): number {
  const {
    attack,
    defense,
    hp,
    speed,
    critRate,
    critDamage,
    accuracy,
    evasion,
    luck,
    equipmentScore = 0,
    skillScore = 0,
    transformationBonus = 0,
    prestigeLevel = 0,
  } = input;

  const pr =
    attack * 2.0 +
    defense * 1.5 +
    hp / 10 +
    speed * 1.2 +
    (critRate / 100) * 200 +
    (critDamage / 100) * 100 +
    (accuracy / 100) * 100 +
    (evasion / 100) * 150 +
    luck * 80 +
    equipmentScore +
    skillScore * 1.5 +
    transformationBonus +
    prestigeLevel * 500;

  return Math.round(pr);
}

/**
 * Compute PR from a ClassStats object (Level-1 character, no equipment/skills).
 */
export function calculatePowerRatingFromStats(stats: ClassStats): number {
  return calculatePowerRating({
    attack: stats.attack,
    defense: stats.defense,
    hp: stats.maxHp,
    speed: stats.speed,
    critRate: stats.critRate,
    critDamage: stats.critDamage,
    accuracy: stats.accuracy,
    evasion: stats.evasion,
    luck: stats.luck,
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// Power Rating rank label (Book 1 §3.4)
// ──────────────────────────────────────────────────────────────────────────────

export function getPowerRatingLabel(pr: number): string {
  if (pr < 1000) return 'Unranked';
  if (pr < 5000) return 'Bronze';
  if (pr < 15000) return 'Silver';
  if (pr < 40000) return 'Gold';
  if (pr < 100000) return 'Platinum';
  if (pr < 250000) return 'Diamond';
  if (pr < 500000) return 'Ascendant';
  return 'Legend';
}

// ──────────────────────────────────────────────────────────────────────────────
// XP formula (Book 1 §3.2)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * XP_Required(level) = BASE_XP × (level ^ 1.8) × TIER_MODIFIER
 *
 * TIER_MODIFIER:
 *   1.0 for levels 1–25
 *   0.9 for levels 26–50  (slight ease — player retention zone)
 *   1.1 for levels 51–75  (re-engagement through challenge)
 *   1.3 for levels 76–100 (endgame gate)
 */
export function xpRequired(level: number): number {
  const BASE_XP = 100;
  const EXPONENT = 1.8;
  let tierModifier = 1.0;
  if (level > 75) tierModifier = 1.3;
  else if (level > 50) tierModifier = 1.1;
  else if (level > 25) tierModifier = 0.9;
  return Math.round(BASE_XP * Math.pow(level, EXPONENT) * tierModifier);
}

// ──────────────────────────────────────────────────────────────────────────────
// Starter kit definitions (Sprint 2)
// ──────────────────────────────────────────────────────────────────────────────

export interface StarterItem {
  itemId: string;
  quantity: number;
  /** Equipment slot, if pre-equipped */
  slot?: string;
}

/** Items granted to every new player at registration. */
export const STARTER_KIT: StarterItem[] = [
  { itemId: 'starter_weapon', quantity: 1, slot: 'weapon' },
  { itemId: 'starter_armor', quantity: 1, slot: 'armor' },
  { itemId: 'health_potion', quantity: 5 },
  { itemId: 'mana_potion', quantity: 5 },
];

/** Gold granted to every new player (Book 1 §5 — starter rewards). */
export const STARTER_GOLD = 500;
