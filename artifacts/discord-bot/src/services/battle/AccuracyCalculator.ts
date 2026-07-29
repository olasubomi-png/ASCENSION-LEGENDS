/**
 * Hit-chance (accuracy) calculator.
 *
 * Book 1, Section 4.7:
 *   Hit_Chance = (Attacker_Accuracy / (Attacker_Accuracy + Target_Evasion)) × 100
 *   Floored at 5 %, capped at 95 %.
 *   Ultimate skills always hit (100 %).
 *
 * Blind status (debuff) reduces effective accuracy by 30 points before the formula.
 */
export interface AccuracyInput {
  /** Attacker accuracy stat. */
  attackerAccuracy: number;
  /** Defender evasion stat. */
  defenderEvasion: number;
  /** Whether the attacker has the Blind status (−30 accuracy). */
  attackerBlind?: boolean;
  /** Whether this is an Ultimate skill (always hits). */
  isUltimate?: boolean;
  /** Flat accuracy bonus from the skill definition. */
  accuracyBonus?: number;
}

const HIT_FLOOR = 5;
const HIT_CAP = 95;

export class AccuracyCalculator {
  /**
   * Compute the hit chance as a percentage in [5, 95] (or 100 for Ultimates).
   *
   * @param input - Accuracy/evasion stats and modifiers.
   * @returns Hit chance 0–100.
   */
  hitChance(input: AccuracyInput): number {
    if (input.isUltimate) return 100;

    const rawAccuracy =
      input.attackerAccuracy +
      (input.accuracyBonus ?? 0) -
      (input.attackerBlind ? 30 : 0);

    const accuracy = Math.max(0, rawAccuracy);
    const evasion = Math.max(0, input.defenderEvasion);
    const total = accuracy + evasion;

    if (total === 0) return HIT_CAP;

    const chance = (accuracy / total) * 100;
    return Math.min(HIT_CAP, Math.max(HIT_FLOOR, chance));
  }
}
