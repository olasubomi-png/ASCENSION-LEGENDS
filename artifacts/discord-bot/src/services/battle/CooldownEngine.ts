/**
 * Cooldown tracking engine.
 *
 * Cooldown rules (Book 1, Section 6.10):
 *   Standard skills:  0 turns (no cooldown)
 *   Advanced skills:  2–3 turn cooldown
 *   Ultimate skill:   5 turn cooldown after use + full gauge requirement
 *   Counter skills:   2-turn cooldown after counter triggers
 *
 * Cooldowns are stored as Map<skillId, remainingTurns>.
 * Each turn end, all counters are decremented; zeroed entries are removed.
 */
export class CooldownEngine {
  /**
   * Register a cooldown for a skill.
   *
   * @param cooldowns - Mutable cooldown map (owned by the participant state).
   * @param skillId   - Skill identifier.
   * @param turns     - Number of turns the cooldown lasts.
   */
  set(cooldowns: Map<string, number>, skillId: string, turns: number): void {
    if (turns > 0) cooldowns.set(skillId, turns);
  }

  /**
   * Returns true if the skill is currently on cooldown.
   */
  isOnCooldown(cooldowns: Map<string, number>, skillId: string): boolean {
    return cooldowns.has(skillId);
  }

  /**
   * Returns remaining turns for a skill, or 0 if not on cooldown.
   */
  remaining(cooldowns: Map<string, number>, skillId: string): number {
    return cooldowns.get(skillId) ?? 0;
  }

  /**
   * Decrement all active cooldowns by one. Entries reaching 0 are deleted.
   * Call this at the end of each round.
   *
   * @param cooldowns - Mutable cooldown map.
   */
  tick(cooldowns: Map<string, number>): void {
    for (const [skillId, remaining] of cooldowns) {
      if (remaining <= 1) {
        cooldowns.delete(skillId);
      } else {
        cooldowns.set(skillId, remaining - 1);
      }
    }
  }

  /**
   * Remove a specific cooldown immediately (e.g. skill reset items).
   */
  clear(cooldowns: Map<string, number>, skillId: string): void {
    cooldowns.delete(skillId);
  }

  /**
   * Remove all cooldowns (e.g. revival or battle reset).
   */
  clearAll(cooldowns: Map<string, number>): void {
    cooldowns.clear();
  }

  /**
   * Returns a plain-object snapshot of all active cooldowns (useful for serialization).
   */
  snapshot(cooldowns: Map<string, number>): Record<string, number> {
    return Object.fromEntries(cooldowns);
  }
}
