/**
 * ComboEngine — manages combo chains during a combat session.
 *
 * A combo chain is an ordered sequence of skills used consecutively.
 * After each skill use, the engine checks whether any follow-up skills
 * are unlocked, and tracks the window in which they can be used.
 *
 * Combo window: 2 rounds after the chain-starting skill is used.
 * If the window expires or an irrelevant skill is used, the chain resets.
 *
 * @see Book 1 §6.9 — Combo System
 */

import { childLogger } from '../utils/logger.js';

import { getSkillDefinition } from './SkillRegistry.js';
import type { ComboState, SkillDefinition } from './types.js';

const log = childLogger('ComboEngine');

/** How many rounds the combo window stays open. */
const COMBO_WINDOW_ROUNDS = 2;

export class ComboEngine {
  private states: Map<string, ComboState> = new Map();

  // ──────────────────────────────────────────────────────────────────────────
  // Chain management
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Record that an actor used a skill. Extends or starts a combo chain.
   *
   * @param actorId  The actor who used the skill.
   * @param skillId  The skill that was used.
   * @param round    The current round.
   * @returns The updated combo state for this actor.
   */
  recordSkillUse(actorId: string, skillId: string, round: number): ComboState {
    const skill = getSkillDefinition(skillId);
    const followUps = skill?.comboFollowUps ?? [];

    const existing = this.states.get(actorId);

    // Extend existing chain only if this skill is a valid follow-up in the window.
    // An irrelevant skill (not in availableFollowUps) breaks the chain — reset it.
    if (existing && existing.expiresAtRound >= round) {
      const isValidContinuation = existing.availableFollowUps.includes(skillId);

      if (isValidContinuation) {
        const newChain = [...existing.chain, skillId];
        const state: ComboState = {
          actorId,
          chain: newChain,
          availableFollowUps: followUps,
          expiresAtRound: round + COMBO_WINDOW_ROUNDS,
        };
        this.states.set(actorId, state);
        log.debug('Combo chain extended', { actorId, chain: newChain });
        return state;
      }

      // Irrelevant skill — fall through to start a fresh chain
      log.debug('Combo chain broken by irrelevant skill', { actorId, skillId });
    }

    // Start a new chain
    const state: ComboState = {
      actorId,
      chain: [skillId],
      availableFollowUps: followUps,
      expiresAtRound: round + COMBO_WINDOW_ROUNDS,
    };
    this.states.set(actorId, state);

    if (followUps.length > 0) {
      log.debug('New combo chain started', { actorId, skillId, followUps });
    }

    return state;
  }

  /**
   * Get the current combo state for an actor.
   * Returns null if there is no active chain.
   */
  getState(actorId: string, round: number): ComboState | null {
    const state = this.states.get(actorId);
    if (!state || state.expiresAtRound < round) return null;
    return state;
  }

  /**
   * Returns the current combo chain length for an actor (0 if no active chain).
   */
  chainLength(actorId: string, round: number): number {
    return this.getState(actorId, round)?.chain.length ?? 0;
  }

  /**
   * Returns follow-up skill IDs available to an actor at this round.
   */
  getAvailableFollowUps(actorId: string, round: number): string[] {
    return this.getState(actorId, round)?.availableFollowUps ?? [];
  }

  /**
   * Returns the full combo chain for an actor (empty if expired).
   */
  getChain(actorId: string, round: number): string[] {
    return this.getState(actorId, round)?.chain ?? [];
  }

  /**
   * Returns true if a skill ID is a valid combo follow-up for an actor.
   */
  isValidFollowUp(actorId: string, skillId: string, round: number): boolean {
    const state = this.getState(actorId, round);
    return state?.availableFollowUps.includes(skillId) ?? false;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Damage bonus
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Returns the combo damage bonus multiplier for the current chain length.
   * Book 1 §6.9: 2-hit = +5%, 3-hit = +10%, 4-hit = +15%, 5-hit = +20%, 7-hit = +30%.
   */
  comboBonusMultiplier(chainLength: number): number {
    if (chainLength >= 7) return 1.30;
    if (chainLength >= 5) return 1.20;
    if (chainLength >= 4) return 1.15;
    if (chainLength >= 3) return 1.10;
    if (chainLength >= 2) return 1.05;
    return 1.0;
  }

  /**
   * Returns unlocked combo skills after using a skill.
   * Includes follow-ups from the skill definition.
   */
  getUnlockedFollowUps(skillId: string, _loadoutIds: string[]): string[] {
    const skill = getSkillDefinition(skillId);
    return skill?.comboFollowUps ?? [];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Lifecycle
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Advance to a new round — prune expired chains.
   */
  advance(currentRound: number): void {
    for (const [actorId, state] of this.states) {
      if (state.expiresAtRound < currentRound) {
        this.states.delete(actorId);
        log.debug('Combo chain expired', { actorId });
      }
    }
  }

  /**
   * Manually reset the combo chain for an actor (e.g. they were stunned).
   */
  reset(actorId: string): void {
    this.states.delete(actorId);
  }

  /**
   * Reset all combo chains (e.g. end of battle).
   */
  resetAll(): void {
    this.states.clear();
  }

  /**
   * Returns all currently active combo states.
   */
  getAllActiveStates(currentRound: number): ComboState[] {
    return [...this.states.values()].filter(
      (s) => s.expiresAtRound >= currentRound,
    );
  }

  /**
   * Resolve the full chain of SkillDefinitions for an actor.
   */
  resolveChain(actorId: string, round: number): SkillDefinition[] {
    const chain = this.getChain(actorId, round);
    return chain
      .map((id) => getSkillDefinition(id))
      .filter((s): s is SkillDefinition => s !== undefined);
  }
}
