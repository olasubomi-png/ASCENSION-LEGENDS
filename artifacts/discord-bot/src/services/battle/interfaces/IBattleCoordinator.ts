import type { BattleSession, BattleSessionOptions } from '../BattleSession.js';
import type { BattleResult } from '../types.js';

export interface IBattleCoordinator {
  createSession(options: BattleSessionOptions): BattleSession;
  coordinate(session: BattleSession): Promise<BattleResult>;
  getSession(battleId: string): BattleSession | null;
  getReplay(battleId: string): BattleResult | null;
  getSerializedReplay(battleId: string): string | null;
  readonly sessionCount: number;
}
