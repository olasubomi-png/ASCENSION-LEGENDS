import type { BattleSession } from '../BattleSession.js';
import type { BattleAction, BattleParticipant, BattleResult, BattleType } from '../types.js';

export interface IBattleManagerCreateOptions {
  participants: [BattleParticipant, BattleParticipant];
  seed?: string | number;
  battleId?: string;
  actions?: BattleAction[];
  maxRounds?: number;
  type?: BattleType;
}

export interface IBattleManager {
  runBattle(options: IBattleManagerCreateOptions): Promise<BattleResult>;
  createSession(options: Omit<IBattleManagerCreateOptions, 'actions'>): BattleSession;
  getSession(battleId: string): BattleSession | null;
  getReplay(battleId: string): BattleResult | null;
  getSerializedReplay(battleId: string): string | null;
}
