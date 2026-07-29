/**
 * Turn-order / initiative manager.
 *
 * Book 1, Section 6.3 — Initiative System:
 *   initiative = Speed + random_int(0, floor(Speed × 0.15))
 *   Highest initiative goes first; ties are broken alphabetically by ID
 *   (deterministic tie-break to avoid non-determinism).
 *
 * Slow status effect reduces effective speed:
 *   1 stack: −40 % speed
 *   2 stacks: −60 % speed  (minimum 10 % of base)
 */
import type { BattleParticipantState } from './BattleState.js';
import type { ISeededRandom } from './SeededRandom.js';

export interface TurnOrder {
  participant: BattleParticipantState;
  initiative: number;
}

export class TurnManager {
  /**
   * Compute initiative rolls for all living participants and return them in
   * descending initiative order (highest goes first).
   *
   * @param participants - All participants still in the battle (dead are filtered).
   * @param rng          - Shared deterministic RNG for this round.
   * @returns Sorted TurnOrder array — first entry acts first.
   */
  determineOrder(participants: BattleParticipantState[], rng: ISeededRandom): TurnOrder[] {
    return participants
      .filter((p) => p.hp > 0)
      .map((p) => ({ participant: p, initiative: this.rollInitiative(p, rng) }))
      .sort((a, b) =>
        b.initiative - a.initiative ||
        a.participant.id.localeCompare(b.participant.id),
      );
  }

  /**
   * Roll initiative for a single participant.
   *
   * @param participant - The participant.
   * @param rng         - Deterministic RNG.
   * @returns Initiative score.
   */
  rollInitiative(participant: BattleParticipantState, rng: ISeededRandom): number {
    const speed = this.effectiveSpeed(participant);
    return speed + rng.int(0, Math.floor(speed * 0.15));
  }

  /**
   * Compute effective speed after Slow status debuff.
   *
   * @param participant - Participant state.
   * @returns Effective speed (floored at 10 % of base).
   */
  effectiveSpeed(participant: BattleParticipantState): number {
    const slow = participant.statuses.find((s) => s.type === 'slow');
    const stacks = Math.min(2, slow?.stacks ?? 0);
    const reduction = stacks === 2 ? 0.6 : stacks === 1 ? 0.4 : 0;
    const base = participant.stats.speed;
    return Math.max(base * (1 - reduction), base * 0.1);
  }
}
