/**
 * Validates a BattleAction before it is executed by the engine.
 *
 * Checks performed (Book 1, Sections 6.2, 6.8, 6.10):
 *   - Actor is alive and in the battle
 *   - Actor is not incapacitated (stun / freeze / sleep)
 *   - For skill actions: silence check, energy check, cooldown check, ultimate gauge check
 *   - For block: minimum energy requirement
 *   - For attack: no additional checks (always available)
 */
import type { BattleParticipantState, BattleState } from './BattleState.js';
import type { BattleAction } from './types.js';

export interface ValidationResult {
  /** True if the action is legal given the current state. */
  valid: boolean;
  /** Human-readable reason if invalid. */
  reason?: string;
}

const MAX_ULTIMATE = 100;
const BLOCK_ENERGY_COST = 10;

export class BattleValidator {
  /**
   * Validate a single action.
   *
   * @param action - The action the participant wishes to take.
   * @param actor  - Current runtime state of the acting participant.
   * @param state  - Full battle state (used for ID membership check).
   * @returns ValidationResult with valid flag and optional reason.
   */
  validate(action: BattleAction, actor: BattleParticipantState, state: BattleState): ValidationResult {
    // Actor must be in this battle.
    const inBattle = state.participants.some((p) => p.id === actor.id);
    if (!inBattle) return { valid: false, reason: 'Actor is not a participant in this battle' };

    // Actor must be alive.
    if (actor.hp <= 0) return { valid: false, reason: 'Actor is defeated' };

    // Incapacitation check (stun / freeze / sleep skip turn).
    const incapacitated = actor.statuses.some(
      (s) => s.type === 'stun' || s.type === 'freeze' || s.type === 'sleep',
    );
    if (incapacitated) return { valid: false, reason: 'Actor is incapacitated and cannot act' };

    switch (action.type) {
      case 'pass':
        return { valid: true };

      case 'attack':
        return { valid: true };

      case 'block':
        if (actor.energy < BLOCK_ENERGY_COST) {
          return {
            valid: false,
            reason: `Insufficient energy for Block (requires ${BLOCK_ENERGY_COST}, have ${actor.energy})`,
          };
        }
        return { valid: true };

      case 'parry':
      case 'counter':
        return { valid: true };

      case 'skill': {
        const skill = action.skill;
        if (!skill) return { valid: false, reason: 'Skill action requires a skill definition' };

        // Silence prevents all skill use.
        const silenced = actor.statuses.some((s) => s.type === 'silence');
        if (silenced) return { valid: false, reason: 'Actor is silenced and cannot use skills' };

        // Energy check.
        const cost = skill.energyCost ?? 0;
        if (actor.energy < cost) {
          return { valid: false, reason: `Insufficient energy (requires ${cost}, have ${actor.energy})` };
        }

        // Cooldown check.
        const remaining = actor.cooldowns.get(skill.id);
        if (remaining !== undefined) {
          return { valid: false, reason: `Skill '${skill.id}' is on cooldown (${remaining} turns remaining)` };
        }

        // Ultimate gauge check.
        if (skill.isUltimate && actor.ultimateGauge < MAX_ULTIMATE) {
          return {
            valid: false,
            reason: `Ultimate gauge not full (${actor.ultimateGauge}/${MAX_ULTIMATE})`,
          };
        }

        return { valid: true };
      }

      default:
        return { valid: false, reason: `Unknown action type: ${String((action as BattleAction).type)}` };
    }
  }

  /**
   * Validate a list of actions, returning only the invalid ones.
   */
  findInvalid(
    actions: BattleAction[],
    participants: BattleParticipantState[],
    state: BattleState,
  ): Array<{ action: BattleAction; reason: string }> {
    const results: Array<{ action: BattleAction; reason: string }> = [];
    for (const action of actions) {
      const actor = participants.find((p) => p.id === action.actorId);
      if (!actor) {
        results.push({ action, reason: 'Actor not found in participant list' });
        continue;
      }
      const result = this.validate(action, actor, state);
      if (!result.valid) {
        results.push({ action, reason: result.reason ?? 'Invalid action' });
      }
    }
    return results;
  }
}
