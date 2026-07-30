/**
 * SkillCooldownManager — tracks and manages skill cooldowns for one actor.
 *
 * Cooldowns are stored as the round number on which the skill becomes
 * available again (i.e. the first round it is usable after the cooldown ends).
 *
 * Example: skill used on round 3 with cooldown 2 → available again on round 6.
 *   Stored as: expiresAfterRound = 3 + 2 = 5 → available at round 6.
 */

import { getSkillDefinition } from './SkillRegistry.js';

export class SkillCooldownManager {
  private readonly cooldowns: Map<string, number> = new Map();

  // ──────────────────────────────────────────────────────────────────────────
  // Setting cooldowns
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Register a cooldown for a skill after it has been used.
   *
   * @param skillId     The skill that was just used.
   * @param usedOnRound The round on which the skill was used.
   */
  set(skillId: string, usedOnRound: number): void {
    const skill = getSkillDefinition(skillId);
    if (!skill || skill.requirements.cooldown <= 0) return;
    // The skill becomes available on the round AFTER the cooldown ends.
    const expiresAfterRound = usedOnRound + skill.requirements.cooldown;
    this.cooldowns.set(skillId, expiresAfterRound);
  }

  /**
   * Directly set a cooldown expiry round for a skill.
   * Use this when you know the exact expiry (e.g. restoring from a snapshot).
   */
  setRaw(skillId: string, expiresAfterRound: number): void {
    this.cooldowns.set(skillId, expiresAfterRound);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Querying cooldowns
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Returns true if the skill is on cooldown at the given round.
   */
  isOnCooldown(skillId: string, currentRound: number): boolean {
    const expiry = this.cooldowns.get(skillId);
    return expiry !== undefined && expiry >= currentRound;
  }

  /**
   * Returns the number of rounds until the skill is usable again, or 0.
   */
  roundsRemaining(skillId: string, currentRound: number): number {
    const expiry = this.cooldowns.get(skillId);
    if (expiry === undefined || expiry < currentRound) return 0;
    return expiry - currentRound + 1;
  }

  /**
   * Returns the round on which the skill becomes available again.
   * Returns 0 if the skill is not on cooldown.
   */
  availableOnRound(skillId: string, currentRound: number): number {
    const expiry = this.cooldowns.get(skillId);
    if (expiry === undefined || expiry < currentRound) return currentRound;
    return expiry + 1;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Lifecycle
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Advance to a new round — prune expired cooldowns to keep the map lean.
   */
  advance(currentRound: number): void {
    for (const [skillId, expiry] of this.cooldowns) {
      if (expiry < currentRound) {
        this.cooldowns.delete(skillId);
      }
    }
  }

  /**
   * Manually clear a specific skill's cooldown (e.g. a "reset cooldown" item).
   */
  clear(skillId: string): void {
    this.cooldowns.delete(skillId);
  }

  /**
   * Clear all cooldowns (e.g. end of battle).
   */
  clearAll(): void {
    this.cooldowns.clear();
  }

  /**
   * Reduce all active cooldowns by `rounds` (e.g. a cooldown reduction effect).
   * Removes any that would expire at or before the current round.
   */
  reduceAll(rounds: number, currentRound: number): void {
    for (const [skillId, expiry] of this.cooldowns) {
      const reduced = expiry - rounds;
      if (reduced < currentRound) {
        this.cooldowns.delete(skillId);
      } else {
        this.cooldowns.set(skillId, reduced);
      }
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Snapshot
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Return a read-only copy of the cooldown map for serialisation.
   */
  snapshot(): ReadonlyMap<string, number> {
    return new Map(this.cooldowns);
  }

  /**
   * Restore cooldowns from a snapshot.
   */
  restore(snapshot: ReadonlyMap<string, number>): void {
    this.cooldowns.clear();
    for (const [skillId, expiry] of snapshot) {
      this.cooldowns.set(skillId, expiry);
    }
  }

  /**
   * Returns all skill IDs currently on cooldown.
   */
  getOnCooldown(currentRound: number): string[] {
    const result: string[] = [];
    for (const [skillId, expiry] of this.cooldowns) {
      if (expiry >= currentRound) result.push(skillId);
    }
    return result;
  }
}
