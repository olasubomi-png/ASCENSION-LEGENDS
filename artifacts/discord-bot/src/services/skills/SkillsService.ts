/**
 * SkillsService — public service façade for the skill system.
 *
 * Wraps the skill subsystem (SkillManager, SkillExecutor, etc.) and exposes
 * a clean interface for command handlers and other services.
 *
 * Replaces the previous placeholder implementation.
 */

import { PassiveSkillEngine } from '../../skills/PassiveSkillEngine.js';
import { SkillManager } from '../../skills/SkillManager.js';
import { getSkillDefinition, getSkillsByCategory } from '../../skills/SkillRegistry.js';
import { SkillValidator } from '../../skills/SkillValidator.js';
import type { SkillDefinition } from '../../skills/types.js';
import type { Result } from '../../types/common.js';
import { ok, err } from '../../types/common.js';
import { childLogger } from '../../utils/logger.js';

const log = childLogger('SkillsService');

export class SkillsService {
  private readonly manager = new SkillManager();
  private readonly validator = new SkillValidator();
  private readonly passiveEngine = new PassiveSkillEngine();

  /**
   * Return all skills available to a given character class.
   */
  async getSkillsForClass(classId: string): Promise<Result<SkillDefinition[]>> {
    try {
      const skills = this.manager.getSkillsForClass(classId);
      return ok(skills);
    } catch (error) {
      log.error('getSkillsForClass failed', { classId, err: String(error) });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Return a single skill definition by ID.
   */
  async getSkill(skillId: string): Promise<Result<SkillDefinition | null>> {
    try {
      const skill = getSkillDefinition(skillId);
      return ok(skill ?? null);
    } catch (error) {
      log.error('getSkill failed', { skillId, err: String(error) });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Return all skills of a given category.
   */
  async getByCategory(
    category: SkillDefinition['category'],
  ): Promise<Result<SkillDefinition[]>> {
    try {
      return ok(getSkillsByCategory(category));
    } catch (error) {
      log.error('getByCategory failed', { category, err: String(error) });
      return err(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * Check whether a skill can be used by a given class.
   */
  isClassAllowed(classId: string, skillId: string): boolean {
    return this.validator.isClassAllowed(skillId, classId);
  }

  /**
   * Resolve passive skill IDs into always-on stat modifiers.
   * Used when building a CharacterRuntime.
   */
  buildAlwaysOnModifiers(passiveSkillIds: string[]) {
    return this.passiveEngine.buildAlwaysOnModifiers(passiveSkillIds);
  }

  /**
   * Resolve a list of skill IDs to their definitions.
   */
  resolveSkills(skillIds: string[]): SkillDefinition[] {
    return this.manager.resolveSkills(skillIds);
  }
}
