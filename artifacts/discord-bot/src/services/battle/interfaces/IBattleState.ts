import type { BattleElement, BattleEvent, BattleOutcome, BattleStats, BattleStatus, BattleType } from '../types.js';

export interface IBattleParticipantState {
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

export interface IBattleState {
  readonly battleId: string;
  readonly seed: string | number;
  readonly type: BattleType;
  round: number;
  readonly maxRounds: number;
  readonly participants: [IBattleParticipantState, IBattleParticipantState];
  events: BattleEvent[];
  sequence: number;
  outcome?: BattleOutcome;
  winnerId?: string;
}
