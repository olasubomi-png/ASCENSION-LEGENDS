/**
 * Critical hit determination and damage multiplier.
 *
 * Book 1, Section 4.9–4.10:
 *   Is_Critical = Random(0, 100) < (Critical_Chance × Luck_Modifier)
 *   Luck_Modifier = 1 + (Luck / 1000)
 *   Hard cap: 75 % max crit chance
 *   Minimum crit damage: 150 %
 */
import type { ISeededRandom } from './SeededRandom.js';

export interface CritInput {
  /** Character's critRate stat (0–100). */
  critRate: number;
  /** Character's critDamage stat (e.g. 150 = 150 %). */
  critDamage: number;
  /** Character's Luck stat. */
  luck: number;
  /** Bonus crit chance from a skill (additive, optional). */
  critChanceBonus?: number;
  /** Skill forces a critical hit regardless of RNG. */
  guaranteedCrit?: boolean;
}

export interface CritResult {
  isCritical: boolean;
  /** Damage multiplier to apply (>= 1.5 on crit, 1.0 on non-crit). */
  multiplier: number;
}

const CRIT_HARD_CAP = 75;
const BASE_CRIT_DAMAGE = 150; // 150 % = 1.5×

export class CriticalCalculator {
  /**
   * Determine whether this hit crits and return the damage multiplier.
   *
   * @param input  - Attacker stats and skill overrides.
   * @param rng    - Shared deterministic RNG for this turn.
   * @returns CritResult with isCritical flag and final damage multiplier.
   */
  evaluate(input: CritInput, rng: ISeededRandom): CritResult {
    const isCritical = input.guaranteedCrit || this.rollCrit(input, rng);
    const multiplier = isCritical
      ? Math.max(BASE_CRIT_DAMAGE, input.critDamage) / 100
      : 1.0;
    return { isCritical, multiplier };
  }

  /** Effective crit chance, capped and Luck-boosted. */
  effectiveCritChance(input: Pick<CritInput, 'critRate' | 'luck' | 'critChanceBonus'>): number {
    const luckModifier = 1 + input.luck / 1000;
    const raw = (input.critRate + (input.critChanceBonus ?? 0)) * luckModifier;
    return Math.min(CRIT_HARD_CAP, Math.max(0, raw));
  }

  private rollCrit(input: CritInput, rng: ISeededRandom): boolean {
    const chance = this.effectiveCritChance(input);
    return rng.percent() < chance;
  }
}
