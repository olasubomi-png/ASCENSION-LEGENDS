/**
 * Starter class definitions.
 * Stats sourced from Book1-Game-Developer-Bible.md and Database-Schema.md.
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
  critRate: number;
  critDamage: number;
  evasion: number;
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

const BASE_HP = 500;
const BASE_ACCURACY = 85;
const BASE_CRIT_RATE = 5;
const BASE_CRIT_DAMAGE = 150;
const BASE_EVASION = 10;

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

export const CLASS_DEFINITIONS: Record<ClassId, ClassDefinition> = {
  vanguard: {
    id: 'vanguard',
    name: 'Vanguard',
    emoji: '🛡️',
    description: 'An iron-willed warrior who stands between allies and annihilation. Masters of Greatswords, Warhammers, and Spears.',
    flavor: '*"The line holds as long as I stand."*',
    hpMultiplier: 1.4,
    stats: buildStats(1.4, 80, 12, 15, 7, 10, 8, 5),
  },
  invoker: {
    id: 'invoker',
    name: 'Invoker',
    emoji: '🔮',
    description: 'A conduit for raw magical forces. Commands Staves, Tomes, and Grimoires to devastating effect.',
    flavor: '*"Power is not taken — it is called forth."*',
    hpMultiplier: 0.85,
    stats: buildStats(0.85, 150, 7, 8, 15, 12, 10, 6),
  },
  wanderer: {
    id: 'wanderer',
    name: 'Wanderer',
    emoji: '🗡️',
    description: 'A ghost on the battlefield. Unmatched speed and evasion wielding Rapiers, Shortbows, and Dual Blades.',
    flavor: '*"By the time you see me, I\'m already gone."*',
    hpMultiplier: 1.0,
    stats: buildStats(1.0, 100, 12, 10, 8, 8, 15, 8),
  },
};

export const CLASS_ORDER: ClassId[] = ['vanguard', 'invoker', 'wanderer'];

/** XP required to reach the next level. Formula from Book1. */
export function xpToNextLevel(level: number): number {
  const TIER_1_MODIFIER = 1.0; // levels 1–25
  return Math.round(100 * Math.pow(level, 1.8) * TIER_1_MODIFIER);
}
