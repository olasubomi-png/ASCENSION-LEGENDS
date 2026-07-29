/**
 * Dodge-chance (evasion) calculator.
 *
 * Book 1, Section 4.8:
 *   Dodge_Chance = Evasion / (Evasion + Attacker_Accuracy) × 100
 *   Capped at 60 % against standard attacks.
 *   Capped at 35 % against Ultimate skills (harder to evade).
 *
 * Speed contributes a small bonus to evasion (Book 1, Section 4.6):
 *   +Evasion_Base + (Speed / 500)
 */
export interface EvasionInput {
  /** Defender evasion stat. */
  defenderEvasion: number;
  /** Defender speed stat (contributes Speed/500 to effective evasion). */
  defenderSpeed: number;
  /** Attacker accuracy stat. */
  attackerAccuracy: number;
  /** Whether this is an Ultimate skill (harder cap). */
  isUltimate?: boolean;
}

const DODGE_CAP_STANDARD = 60;
const DODGE_CAP_ULTIMATE = 35;
const DODGE_FLOOR = 0;

export class EvasionCalculator {
  /**
   * Compute the dodge chance as a percentage.
   *
   * @param input - Evasion, speed and accuracy stats.
   * @returns Dodge chance 0–60 (or 0–35 vs Ultimates).
   */
  dodgeChance(input: EvasionInput): number {
    const speedBonus = input.defenderSpeed / 500;
    const effectiveEvasion = Math.max(0, input.defenderEvasion + speedBonus);
    const accuracy = Math.max(0, input.attackerAccuracy);
    const total = effectiveEvasion + accuracy;

    if (total === 0) return DODGE_FLOOR;

    const cap = input.isUltimate ? DODGE_CAP_ULTIMATE : DODGE_CAP_STANDARD;
    const chance = (effectiveEvasion / total) * 100;
    return Math.min(cap, Math.max(DODGE_FLOOR, chance));
  }
}
