/**
 * Starter class definitions — Vanguard, Invoker, Wanderer.
 *
 * Stats sourced from Book 1 (§4 Character Stats) and Book 2 (§4 Playable Classes).
 * Base HP = 500 (Book 1 §4.2); multiplied by class HP modifier.
 * All percentage stats stored as integers (e.g. critRate: 5 = 5%).
 */

export type ClassId = 'vanguard' | 'invoker' | 'wanderer';

export interface ClassStats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  magicAttack: number;
  magicDefense: number;
  speed: number;
  luck: number;
  /** Stored as integer percent, e.g. 5 = 5% (Book 1 §4.9) */
  critRate: number;
  /** Stored as integer percent, e.g. 150 = 150% (Book 1 §4.10) */
  critDamage: number;
  /** Stored as integer percent, e.g. 10 = 10% (Book 1 §4.8) */
  evasion: number;
  /** Stored as integer percent, e.g. 85 = 85% (Book 1 §4.7) */
  accuracy: number;
}

export interface ClassDefinition {
  id: ClassId;
  name: string;
  emoji: string;
  description: string;
  flavor: string;
  hpMultiplier: number;
  stats: ClassStats;
}

// ──────────────────────────────────────────────────────────────────────────────
// Book 1 §4 base values (all characters)
// ──────────────────────────────────────────────────────────────────────────────
const BASE_HP = 500;          // Book 1 §4.2
const BASE_CRIT_RATE = 5;     // 5%  — Book 1 §4.9
const BASE_CRIT_DAMAGE = 150; // 150% — Book 1 §4.10
const BASE_ACCURACY = 85;     // 85% — Book 1 §4.7
const BASE_EVASION = 10;      // 10% — Book 1 §4.8

/**
 * Build a ClassStats object from raw stat inputs.
 * HP is derived from the base value × hpMultiplier.
 */
function buildStats(
  hpMultiplier: number,
  mp: number,
  attack: number,
  defense: number,
  magicAttack: number,
  magicDefense: number,
  speed: number,
  luck: number,
): ClassStats {
  const hp = Math.round(BASE_HP * hpMultiplier);
  return {
    hp,
    maxHp: hp,
    mp,
    maxMp: mp,
    attack,
    defense,
    magicAttack,
    magicDefense,
    speed,
    luck,
    critRate: BASE_CRIT_RATE,
    critDamage: BASE_CRIT_DAMAGE,
    evasion: BASE_EVASION,
    accuracy: BASE_ACCURACY,
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// CLASS DEFINITIONS
// Stats calibrated to Book 1 §4.2 (HP range 500 at Level 1)
// and Book 2 §4 archetype roles.
// ──────────────────────────────────────────────────────────────────────────────

export const CLASS_DEFINITIONS: Record<ClassId, ClassDefinition> = {
  /**
   * VANGUARD — Tank archetype
   * HP ×1.4 (Book 1 §4.2). High DEF, moderate ATK, low SPD.
   * Inspired by Book 2 Ironwarden and Solar Knight.
   */
  vanguard: {
    id: 'vanguard',
    name: 'Vanguard',
    emoji: '🛡️',
    description:
      'An iron-willed warrior who stands between allies and annihilation. ' +
      'Masters of Greatswords, Warhammers, and Spears.',
    flavor: '*"The line holds as long as I stand."*',
    hpMultiplier: 1.4,
    stats: buildStats(
      1.4,  // hpMultiplier → HP 700
      100,  // mp
      85,   // attack
      110,  // defense
      35,   // magicAttack
      60,   // magicDefense
      55,   // speed
      10,   // luck
    ),
  },

  /**
   * INVOKER — Mage archetype
   * HP ×0.85 (Book 1 §4.2). High Magic ATK/DEF, low physical, moderate SPD.
   * Inspired by Book 2 Pyroclast Mage and Void Weaver.
   */
  invoker: {
    id: 'invoker',
    name: 'Invoker',
    emoji: '🔮',
    description:
      'A conduit for raw magical forces. ' +
      'Commands Staves, Tomes, and Grimoires to devastating effect.',
    flavor: '*"Power is not taken — it is called forth."*',
    hpMultiplier: 0.85,
    stats: buildStats(
      0.85, // hpMultiplier → HP 425
      200,  // mp
      40,   // attack
      35,   // defense
      135,  // magicAttack
      90,   // magicDefense
      70,   // speed
      15,   // luck
    ),
  },

  /**
   * WANDERER — Rogue/Speed archetype
   * HP ×1.0 (Book 1 §4.2). High SPD + Luck, balanced ATK, low DEF.
   * Inspired by Book 2 Class 50 — The Wanderer (speed and unpredictability).
   */
  wanderer: {
    id: 'wanderer',
    name: 'Wanderer',
    emoji: '🗡️',
    description:
      'A ghost on the battlefield. Unmatched speed and evasion wielding ' +
      'Rapiers, Shortbows, and Dual Blades.',
    flavor: "*\"By the time you see me, I'm already gone.\"*",
    hpMultiplier: 1.0,
    stats: buildStats(
      1.0,  // hpMultiplier → HP 500
      130,  // mp
      105,  // attack
      55,   // defense
      60,   // magicAttack
      45,   // magicDefense
      120,  // speed
      20,   // luck
    ),
  },
};

export const CLASS_ORDER: ClassId[] = ['vanguard', 'invoker', 'wanderer'];

/**
 * XP required to reach `level + 1`.
 * Formula from Book 1 §3.2:
 *   XP_Required(level) = BASE_XP × (level ^ EXPONENT) × TIER_MODIFIER
 */
export function xpToNextLevel(level: number): number {
  const BASE_XP = 100;
  const EXPONENT = 1.8;
  let tierModifier = 1.0;
  if (level > 75) tierModifier = 1.3;
  else if (level > 50) tierModifier = 1.1;
  else if (level > 25) tierModifier = 0.9;
  return Math.round(BASE_XP * Math.pow(level, EXPONENT) * tierModifier);
}
