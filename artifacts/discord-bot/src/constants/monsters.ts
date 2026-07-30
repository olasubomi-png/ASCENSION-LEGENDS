/**
 * Training / starter PvE opponents for Sprint 4.
 * Stats scale from player level so early battles stay relevant (Book 1 combat loop).
 */

import type { BattleElement } from '../services/battle/types.js';
import type { ICharacterStats } from '../models/CharacterModel.js';

export interface TrainingMonsterDef {
  id: string;
  name: string;
  emoji: string;
  description: string;
  element: BattleElement;
  /** Multiplier applied to base training stats relative to player level. */
  powerScale: number;
}

export const TRAINING_MONSTERS: TrainingMonsterDef[] = [
  {
    id: 'verdant_slime',
    name: 'Verdant Slime',
    emoji: '🟢',
    description: 'A soft mass of Ascendance residue that oozes near Verdant Crossing.',
    element: 'terra',
    powerScale: 0.75,
  },
  {
    id: 'ember_wolf',
    name: 'Ember Wolf',
    emoji: '🐺',
    description: 'A pack hunter wreathed in low flame — fast and aggressive.',
    element: 'flame',
    powerScale: 0.95,
  },
  {
    id: 'storm_sprite',
    name: 'Storm Sprite',
    emoji: '⚡',
    description: 'A flickering spirit of Aeryn Frequency drawn to battle noise.',
    element: 'storm',
    powerScale: 1.05,
  },
  {
    id: 'iron_golem_shard',
    name: 'Iron Golem Shard',
    emoji: '🗿',
    description: 'A broken construct fragment — slow, durable, and heavy-handed.',
    element: 'iron',
    powerScale: 1.15,
  },
];

/**
 * Build monster stats scaled to the player's level and chosen power scale.
 * Keeps early PvE approachable while still testing the full battle engine.
 */
export function buildTrainingMonsterStats(
  playerLevel: number,
  powerScale: number,
): ICharacterStats {
  const lvl = Math.max(1, playerLevel);
  const scale = powerScale * (0.9 + lvl * 0.08);

  const maxHp = Math.round(180 * scale + lvl * 22);
  const maxMp = Math.round(60 * scale + lvl * 4);
  const attack = Math.round(28 * scale + lvl * 4);
  const defense = Math.round(18 * scale + lvl * 3);
  const magicAttack = Math.round(20 * scale + lvl * 3);
  const magicDefense = Math.round(16 * scale + lvl * 2);
  const speed = Math.round(40 * scale + lvl * 2);

  return {
    hp: maxHp,
    maxHp,
    mp: maxMp,
    maxMp,
    attack,
    defense,
    magicAttack,
    magicDefense,
    speed,
    luck: 5 + Math.floor(lvl / 5),
    critRate: 5,
    critDamage: 150,
    evasion: 8,
    accuracy: 80,
  };
}

export function pickTrainingMonster(playerLevel: number): TrainingMonsterDef {
  if (playerLevel <= 3) return TRAINING_MONSTERS[0]!;
  if (playerLevel <= 8) return TRAINING_MONSTERS[1]!;
  if (playerLevel <= 15) return TRAINING_MONSTERS[2]!;
  return TRAINING_MONSTERS[3]!;
}
