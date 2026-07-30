/**
 * SkillValidator — validates that a skill can be used given the actor's current state.
 *
 * Checks (in order):
 *  1. Skill exists in registry
 *  2. Class restriction
 *  3. Level requirement
 *  4. Transformation requirement
 *  5. Energy cost
 *  6. Stamina cost
 *  7. Cooldown
 *  8. Ultimate gauge (ultimates only)
 *  9. Combo prerequisites
 * 10. Target validity
 *
 * @see Book 1 §6.8 — Action resolution rules
 */

import { getSkillDefinition } from './SkillRegistry.js';
import type {
  SkillValidationContext,
  SkillValidationResult,
} from './types.js';

const MAX_ULTIMATE = 100;

export class SkillValidator {
  /**
   * Validate a single skill-use attempt.
   * Returns all errors found (not just the first).
   */
  validate(ctx: SkillValidationContext): SkillValidationResult {
    const errors: string[] = [];

    // 1. Skill existence
    const skill = getSkillDefinition(ctx.skillId);
    if (!skill) {
      return { valid: false, errors: [`Unknown skill: '${ctx.skillId}'`] };
    }

    const req = skill.requirements;

    // 2. Class restriction
    if (req.allowedClasses?.length) {
      if (!req.allowedClasses.includes(ctx.actorClassId)) {
        errors.push(
          `Skill '${skill.name}' is restricted to classes: ${req.allowedClasses.join(', ')} (actor class: ${ctx.actorClassId})`,
        );
      }
    }

    // 3. Level requirement
    if (req.minLevel !== undefined && ctx.actorLevel < req.minLevel) {
      errors.push(
        `Skill '${skill.name}' requires level ${req.minLevel} (actor level: ${ctx.actorLevel})`,
      );
    }

    // 4. Transformation requirement
    if (req.requiredTransformation !== undefined) {
      if (
        !ctx.isTransformed ||
        ctx.actorTransformationId !== req.requiredTransformation
      ) {
        errors.push(
          `Skill '${skill.name}' requires transformation '${req.requiredTransformation}'`,
        );
      }
    }

    // 5. Energy cost
    if (ctx.actorEnergy < req.energyCost) {
      errors.push(
        `Insufficient energy: '${skill.name}' costs ${req.energyCost} energy (have ${ctx.actorEnergy})`,
      );
    }

    // 6. Stamina cost
    if (req.staminaCost !== undefined && ctx.actorStamina < req.staminaCost) {
      errors.push(
        `Insufficient stamina: '${skill.name}' costs ${req.staminaCost} stamina (have ${ctx.actorStamina})`,
      );
    }

    // 7. Cooldown
    if (req.cooldown > 0) {
      const expiry = ctx.cooldowns.get(ctx.skillId);
      if (expiry !== undefined && expiry >= ctx.currentRound) {
        const remaining = expiry - ctx.currentRound + 1;
        errors.push(
          `Skill '${skill.name}' is on cooldown (${remaining} round${remaining !== 1 ? 's' : ''} remaining)`,
        );
      }
    }

    // 8. Ultimate gauge
    if (skill.category === 'ultimate') {
      const minGauge = req.minUltimateGauge ?? MAX_ULTIMATE;
      if (ctx.ultimateGauge < minGauge) {
        errors.push(
          `Ultimate gauge not full: requires ${minGauge}, have ${ctx.ultimateGauge}`,
        );
      }
    }

    // 9. Combo prerequisites
    if (req.comboPrerequisites?.length) {
      const chainSet = new Set(ctx.activeComboChain);
      const missing = req.comboPrerequisites.filter((p) => !chainSet.has(p));
      if (missing.length > 0) {
        errors.push(
          `Skill '${skill.name}' requires combo prerequisites: ${missing.join(', ')}`,
        );
      }
    }

    // 10. Target validation — at least one target required for non-self skills
    if (
      skill.targetType !== 'self' &&
      skill.targetType !== 'aoe_enemies' &&
      skill.targetType !== 'aoe_allies' &&
      skill.targetType !== 'all' &&
      ctx.targetIds.length === 0
    ) {
      errors.push(`Skill '${skill.name}' requires at least one target`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Quick check — returns true only if the skill can be used right now.
   */
  canUse(ctx: SkillValidationContext): boolean {
    return this.validate(ctx).valid;
  }

  /**
   * Returns true if the skill has no class restriction or allows the given class.
   */
  isClassAllowed(skillId: string, classId: string): boolean {
    const skill = getSkillDefinition(skillId);
    if (!skill) return false;
    const allowed = skill.requirements.allowedClasses;
    return !allowed?.length || allowed.includes(classId);
  }
}
