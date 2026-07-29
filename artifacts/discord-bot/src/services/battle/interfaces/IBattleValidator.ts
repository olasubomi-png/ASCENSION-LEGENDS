import type { BattleParticipantState, BattleState } from '../BattleState.js';
import type { ValidationResult } from '../BattleValidator.js';
import type { BattleAction } from '../types.js';

export interface IBattleValidator {
  validate(action: BattleAction, actor: BattleParticipantState, state: BattleState): ValidationResult;
  findInvalid(actions: BattleAction[], participants: BattleParticipantState[], state: BattleState): Array<{ action: BattleAction; reason: string }>;
}
