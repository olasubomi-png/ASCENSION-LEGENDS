/**
 * Structured battle logger.
 *
 * Thin wrapper around the application-level Winston child logger.
 * Keeps all battle-related log calls in one place and ensures consistent fields.
 *
 * @see Book 3, Section 16.7 — Documentation Standards (JSDoc on public methods)
 */
import { childLogger } from '../../utils/logger.js';

import type { BattleOutcome, BattleType, StatusType } from './types.js';

export class BattleLogger {
  private readonly log = childLogger('battle-engine');

  /**
   * Log battle initialisation.
   *
   * @param battleId - Unique battle identifier.
   * @param seed     - Deterministic seed used for this battle.
   * @param type     - PvE or PvP.
   */
  logBattleStart(battleId: string, seed: string | number, type?: BattleType): void {
    this.log.info('Battle started', { battleId, seed: String(seed), type });
  }

  /**
   * Log the conclusion of a battle.
   *
   * @param battleId - Unique battle identifier.
   * @param outcome  - attacker_win | defender_win | draw | retreat.
   * @param winnerId - The winning participant ID (undefined on draw / retreat).
   * @param rounds   - Total rounds completed.
   */
  logBattleEnd(battleId: string, outcome: BattleOutcome, winnerId?: string, rounds?: number): void {
    this.log.info('Battle ended', { battleId, outcome, winnerId, rounds });
  }

  /**
   * Log the start of a round.
   */
  logRoundStart(battleId: string, round: number): void {
    this.log.debug('Round start', { battleId, round });
  }

  /**
   * Log a participant's action.
   *
   * @param battleId   - Battle identifier.
   * @param round      - Current round.
   * @param actorId    - ID of the participant acting.
   * @param actionType - Type of action taken.
   * @param outcome    - How the action resolved (hit, miss, etc.).
   */
  logAction(battleId: string, round: number, actorId: string, actionType: string, outcome?: string): void {
    this.log.debug('Action resolved', { battleId, round, actorId, actionType, outcome });
  }

  /**
   * Log a damage event.
   *
   * @param battleId      - Battle identifier.
   * @param round         - Current round.
   * @param actorId       - Attacker.
   * @param targetId      - Defender.
   * @param amount        - Final damage dealt.
   * @param isCritical    - Whether the hit was a critical.
   * @param shieldAbsorbed - Damage absorbed by shield / barrier.
   */
  logDamage(
    battleId: string,
    round: number,
    actorId: string,
    targetId: string,
    amount: number,
    isCritical?: boolean,
    shieldAbsorbed?: number,
  ): void {
    this.log.debug('Damage dealt', { battleId, round, actorId, targetId, amount, isCritical, shieldAbsorbed });
  }

  /**
   * Log a status effect application or removal.
   */
  logStatus(
    battleId: string,
    round: number,
    targetId: string,
    status: StatusType,
    applied: boolean,
  ): void {
    this.log.debug(`Status ${applied ? 'applied' : 'removed'}`, {
      battleId,
      round,
      targetId,
      status,
    });
  }

  /**
   * Log an engine-level error (unexpected state, overflow protection, etc.).
   */
  logError(battleId: string, message: string, meta?: Record<string, unknown>): void {
    this.log.error(message, { battleId, ...meta });
  }
}
