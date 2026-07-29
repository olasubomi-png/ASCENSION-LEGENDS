import type { BattleParticipantState } from '../BattleState.js';
import type { EmitFn } from '../StatusEffectEngine.js';
import type { BattleStatus, StatusType } from '../types.js';

export interface IStatusEffectEngine {
  tick(participant: BattleParticipantState, round: number, emit: EmitFn): void;
  apply(participant: BattleParticipantState, status: BattleStatus, round: number, emit: EmitFn): void;
  remove(participant: BattleParticipantState, type: StatusType, round: number, emit: EmitFn): void;
  has(participant: BattleParticipantState, type: StatusType): boolean;
  isIncapacitated(participant: BattleParticipantState): boolean;
}
