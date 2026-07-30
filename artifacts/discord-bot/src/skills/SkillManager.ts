/**
 * SkillManager — queries the skill registry and manages character skill loadouts.
 *
 * Provides the primary query surface for skills: lookup by ID, by class,
 * by category, and validation of skill ownership.
 */

import { childLogger } from '../utils/logger.js';

import {
  getAllSkills,
  getPassiveSkills,
  getSkillDefinition,
  getSkillsByCategory,
  skillExists,
} from './SkillRegistry.js';
import type { PassiveSkillDefinition, SkillDefinition } from './types.js';

const log = childLogger('SkillManager');

export class SkillManager {
  // ──────────────────────────────────────────────────────────────────────────
  // Registry queries
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Fetch a skill definition by ID. Returns null if not found.
   */
  getSkill(skillId: string): SkillDefinition | null {
    const skill = getSkillDefinition(skillId);
    if (!skill) {
      log.debug('Skill not found', { skillId });
      return null;
    }
    return skill;
  }

  /**
   * Returns true if the skill ID is registered.
   */
  skillExists(skillId: string): boolean {
    return skillExists(skillId);
  }

  /**
   * Returns all skills of a specific category.
   */
  getByCategory(category: SkillDefinition['category']): SkillDefinition[] {
    return getSkillsByCategory(category);
  }

  /**
   * Returns all passive skill definitions (includes trigger metadata).
   */
  getAllPassives(): PassiveSkillDefinition[] {
    return getPassiveSkills();
  }

  /**
   * Returns all skill definitions in the registry.
   */
  getAll(): SkillDefinition[] {
    return getAllSkills();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Loadout queries
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Resolve a list of skill IDs into full SkillDefinitions.
   * Logs a warning and skips IDs that are not found.
   */
  resolveSkills(skillIds: string[]): SkillDefinition[] {
    const resolved: SkillDefinition[] = [];
    for (const id of skillIds) {
      const def = getSkillDefinition(id);
      if (def) {
        resolved.push(def);
      } else {
        log.warn('Unknown skill ID in loadout', { skillId: id });
      }
    }
    return resolved;
  }

  /**
   * Resolve a list of IDs, returning only passive definitions.
   */
  resolvePassives(skillIds: string[]): PassiveSkillDefinition[] {
    return this.resolveSkills(skillIds).filter(
      (s): s is PassiveSkillDefinition => s.category === 'passive',
    );
  }

  /**
   * Returns skills from a loadout that can be used as combo follow-ups
   * given the last skill used.
   */
  getComboFollowUps(lastSkillId: string, loadoutIds: string[]): SkillDefinition[] {
    const lastSkill = getSkillDefinition(lastSkillId);
    if (!lastSkill?.comboFollowUps?.length) return [];

    const followUpIds = new Set(lastSkill.comboFollowUps);
    return this.resolveSkills(loadoutIds).filter((s) => followUpIds.has(s.id));
  }

  /**
   * Returns skills from the loadout that are currently available
   * (not on cooldown, prerequisites met).
   */
  getAvailableSkills(
    loadoutIds: string[],
    cooldowns: ReadonlyMap<string, number>,
    currentRound: number,
    comboChain: string[] = [],
  ): SkillDefinition[] {
    return this.resolveSkills(loadoutIds).filter((skill) => {
      // Cooldown check
      const expiry = cooldowns.get(skill.id);
      if (expiry !== undefined && expiry >= currentRound) return false;

      // Combo prerequisite check
      const prereqs = skill.requirements.comboPrerequisites;
      if (prereqs?.length) {
        const chainSet = new Set(comboChain);
        if (!prereqs.every((p) => chainSet.has(p))) return false;
      }

      return true;
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Class filter
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Returns all skills that are usable by the given class
   * (either class-restricted to it, or unrestricted).
   */
  getSkillsForClass(classId: string): SkillDefinition[] {
    return getAllSkills().filter((skill) => {
      const allowed = skill.requirements.allowedClasses;
      return !allowed?.length || allowed.includes(classId);
    });
  }
}
