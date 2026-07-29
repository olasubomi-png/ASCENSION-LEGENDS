import type { SessionStatus } from '../BattleSession.js';
import type { BattleAction, BattleResult, BattleType } from '../types.js';

export interface IBattleSession {
  readonly battleId: string;
  readonly seed: string | number;
  readonly type: BattleType;
  readonly status: SessionStatus;
  readonly result: BattleResult | null;
  readonly error: Error | null;
  readonly isCompleted: boolean;
  readonly queuedActionCount: number;
  addAction(action: BattleAction): void;
  addActions(actions: BattleAction[]): void;
  run(): BattleResult;
}
