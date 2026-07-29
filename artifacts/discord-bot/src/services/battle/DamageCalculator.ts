/**
 * Pure damage calculation pipeline.
 *
 * Implements the formula from Book 1, Section 4.4 / 4.14:
 *   Physical: (Attack × Skill_Modifier) − (Defense × 0.6),  min 1
 *   Magic:    (MagicAttack × Skill_Modifier) − (MagicDefense × 0.6), min 1
 *   True:     (Attack × Skill_Modifier),  bypasses all defense, min 1
 *
 * Defense reduction cap (Book 1, Section 4.5):
 *   Defense can never reduce damage below 15 % of the raw pre-defense damage.
 *   This prevents a single Defense stat from trivialising all content.
 *
 * Attack soft caps (Book 1, Section 4.4):
 *   > 10 000 Attack: +0.7 per additional point
 *   > 50 000 Attack: +0.4 per additional point
 */
import type { DamageType } from './types.js';

const DEFENSE_FACTOR = 0.6;
/** Defense can never reduce below 15 % of raw damage. */
const MIN_DAMAGE_RATIO = 0.15;

/** Inputs for a single damage calculation. */
export interface DamageInput {
  /** Effective attacker attack stat (already includes buffs). */
  attack: number;
  /** Effective attacker magic attack stat. */
  magicAttack: number;
  /** Effective defender defense stat. */
  defense: number;
  /** Effective defender magic defense stat. */
  magicDefense: number;
  /** Skill damage coefficient (1.0 = 100 % of attack). */
  multiplier: number;
  /** Damage type determines which attack/defense stats are used. */
  damageType: DamageType;
}

export interface DamageResult {
  /** Damage before defense is applied (or before cap). */
  rawDamage: number;
  /** Final damage after defense, cap, and floor are applied. */
  finalDamage: number;
}

export class DamageCalculator {
  /**
   * Compute damage for one hit.
   *
   * @param input - Attack, defense, multiplier and type.
   * @returns Raw pre-defense damage and final post-defense damage (min 1).
   */
  calculate(input: DamageInput): DamageResult {
    const { multiplier, damageType } = input;

    if (damageType === 'true') {
      // True damage bypasses all defenses.
      const rawDamage = this.applyAttack(input.attack, multiplier);
      return { rawDamage, finalDamage: Math.max(1, Math.round(rawDamage)) };
    }

    const attack = damageType === 'magic' ? input.magicAttack : input.attack;
    const defense = damageType === 'magic' ? input.magicDefense : input.defense;

    const rawDamage = this.applyAttack(attack, multiplier);
    const uncappedDamage = rawDamage - defense * DEFENSE_FACTOR;

    // Enforce the damage reduction cap: final damage is at least 15 % of raw.
    const minDamage = Math.max(1, Math.floor(rawDamage * MIN_DAMAGE_RATIO));
    const finalDamage = Math.max(minDamage, Math.round(uncappedDamage));

    return { rawDamage, finalDamage: Math.max(1, finalDamage) };
  }

  /**
   * Applies the soft-cap scaling to raw attack × multiplier.
   *
   * Book 1, Section 4.4 (soft caps):
   *   > 10 000: each additional point = 0.7 damage
   *   > 50 000: each additional point = 0.4 damage
   */
  private applyAttack(attack: number, multiplier: number): number {
    const effectiveAttack = this.softCapAttack(attack);
    return effectiveAttack * multiplier;
  }

  private softCapAttack(attack: number): number {
    if (attack <= 10_000) return attack;
    if (attack <= 50_000) {
      const excess = attack - 10_000;
      return 10_000 + excess * 0.7;
    }
    // Base at 50 000: 10_000 + (40_000 × 0.7) = 38_000
    const base50k = 10_000 + 40_000 * 0.7;
    const excess = attack - 50_000;
    return base50k + excess * 0.4;
  }
}
