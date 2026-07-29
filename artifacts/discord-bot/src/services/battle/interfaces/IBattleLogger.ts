import type { BattleOutcome, BattleType, StatusType } from '../types.js';

export interface IBattleLogger {
  logBattleStart(battleId: string, seed: string | number, type?: BattleType): void;
  logBattleEnd(battleId: string, outcome: BattleOutcome, winnerId?: string, rounds?: number): void;
  logRoundStart(battleId: string, round: number): void;
  logAction(battleId: string, round: number, actorId: string, actionType: string, outcome?: string): void;
  logDamage(battleId: string, round: number, actorId: string, targetId: string, amount: number, isCritical?: boolean, shieldAbsorbed?: number): void;
  logStatus(battleId: string, round: number, targetId: string, status: StatusType, applied: boolean): void;
  logError(battleId: string, message: string, meta?: Record<string, unknown>): void;
}
