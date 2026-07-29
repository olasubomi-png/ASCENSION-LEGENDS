/**
 * Immutable context object passed to all calculator and engine calls.
 * Bundles the two participants involved in a computation with their battle metadata.
 *
 * Keeping context as a plain object (no class) makes it easy to create in tests
 * and prevents accidental mutation of shared state during a turn.
 *
 * @see Book 3, Section 6.11 — Death Handling (BattleContext usage)
 */
import type { BattleParticipantState } from './BattleState.js';
import type { ISeededRandom } from './SeededRandom.js';

export interface BattleContext {
  /** ID of the battle this context belongs to. */
  readonly battleId: string;
  /** Current round number (1-based). */
  readonly round: number;
  /** The participant currently taking an action. */
  readonly actor: BattleParticipantState;
  /** The participant receiving the action. */
  readonly target: BattleParticipantState;
  /** Deterministic RNG shared across the entire battle turn. */
  readonly rng: ISeededRandom;
}

/**
 * Factory helper.
 */
export function createBattleContext(
  battleId: string,
  round: number,
  actor: BattleParticipantState,
  target: BattleParticipantState,
  rng: ISeededRandom,
): BattleContext {
  return { battleId, round, actor, target, rng };
}
