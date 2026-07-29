/**
 * Runtime state of a battle — mutable snapshot used by calculators and engines.
 * Distinct from BattleResult (the immutable final record).
 *
 * @see Book 3, Section 6.12 — Replay Generation
 */
import type {
  BattleElement,
  BattleEvent,
  BattleOutcome,
  BattleParticipant,
  BattleStats,
  BattleStatus,
  BattleType,
} from './types.js';

export interface BattleParticipantState {
  readonly id: string;
  readonly name: string;
  readonly stats: Readonly<BattleStats>;
  readonly element: BattleElement;
  hp: number;
  energy: number;
  ultimateGauge: number;
  statuses: BattleStatus[];
  cooldowns: Map<string, number>;
  combo: number;
  comboElement?: BattleElement;
  blockMultiplier?: number;
  parryMultiplier?: number;
  counterReady: boolean;
  counterUsed: boolean;
}

export interface BattleState {
  readonly battleId: string;
  readonly seed: string | number;
  readonly type: BattleType;
  round: number;
  readonly maxRounds: number;
  readonly participants: [BattleParticipantState, BattleParticipantState];
  events: BattleEvent[];
  sequence: number;
  outcome?: BattleOutcome;
  winnerId?: string;
}

/**
 * Factory — creates a fresh BattleParticipantState from a BattleParticipant definition.
 */
export function createParticipantState(p: BattleParticipant): BattleParticipantState {
  return {
    id: p.id,
    name: p.name,
    stats: { ...p.stats },
    element: p.element ?? 'iron',
    hp: Math.max(0, p.stats.hp),
    energy: Math.max(0, p.stats.mp),
    ultimateGauge: 0,
    statuses: (p.statuses ?? []).map((s) => ({ ...s })),
    cooldowns: new Map<string, number>(),
    combo: 0,
    counterReady: false,
    counterUsed: false,
  };
}

/**
 * Factory — creates a fresh BattleState from the two participants and battle metadata.
 */
export function createBattleState(
  battleId: string,
  seed: string | number,
  type: BattleType,
  participants: [BattleParticipant, BattleParticipant],
  maxRounds = 50,
): BattleState {
  return {
    battleId,
    seed,
    type,
    round: 0,
    maxRounds,
    participants: [createParticipantState(participants[0]), createParticipantState(participants[1])],
    events: [],
    sequence: 0,
  };
}
