/**
 * TargetSelector — resolves valid targets for a skill execution.
 *
 * Given a SkillTargetType and encounter context, returns the set of
 * participant IDs that should receive the skill's effects.
 */

import type {
  SkillTargetType,
  TargetSelectionContext,
  TargetSelectionResult,
} from './types.js';

export class TargetSelector {
  /**
   * Select targets for a skill use.
   *
   * @param ctx - Target selection context (actor, skill target type, participants).
   * @returns Selected participant IDs and whether the selection is valid.
   */
  select(ctx: TargetSelectionContext): TargetSelectionResult {
    const { targetType, actorId, aliveIds } = ctx;

    switch (targetType) {
      case 'self': {
        if (!aliveIds.includes(actorId)) {
          return { valid: false, selectedIds: [], error: 'Actor is not alive' };
        }
        return { valid: true, selectedIds: [actorId] };
      }

      case 'single_enemy': {
        return this.selectSingleEnemy(ctx);
      }

      case 'single_ally': {
        return this.selectSingleAlly(ctx);
      }

      case 'aoe_enemies': {
        const targets = ctx.enemyIds.filter((id) => aliveIds.includes(id));
        if (targets.length === 0) {
          return { valid: false, selectedIds: [], error: 'No living enemies to target' };
        }
        return { valid: true, selectedIds: targets };
      }

      case 'aoe_allies': {
        const targets = ctx.allyIds.filter((id) => aliveIds.includes(id));
        if (targets.length === 0) {
          return { valid: false, selectedIds: [], error: 'No living allies to target' };
        }
        return { valid: true, selectedIds: targets };
      }

      case 'all': {
        const targets = aliveIds.filter((id) => id !== actorId);
        if (targets.length === 0) {
          return { valid: false, selectedIds: [], error: 'No living participants to target' };
        }
        return { valid: true, selectedIds: targets };
      }

      default: {
        const _exhaustive: never = targetType;
        return {
          valid: false,
          selectedIds: [],
          error: `Unknown target type: ${String(_exhaustive)}`,
        };
      }
    }
  }

  /**
   * Returns true if the target type hits multiple participants at once.
   */
  isAoE(targetType: SkillTargetType): boolean {
    return (
      targetType === 'aoe_enemies' ||
      targetType === 'aoe_allies' ||
      targetType === 'all'
    );
  }

  /**
   * Returns true if the skill only affects the caster.
   */
  isSelf(targetType: SkillTargetType): boolean {
    return targetType === 'self';
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Private helpers
  // ──────────────────────────────────────────────────────────────────────────

  private selectSingleEnemy(ctx: TargetSelectionContext): TargetSelectionResult {
    const liveEnemies = ctx.enemyIds.filter((id) => ctx.aliveIds.includes(id));

    if (liveEnemies.length === 0) {
      return { valid: false, selectedIds: [], error: 'No living enemies to target' };
    }

    // Use explicitly requested target if valid
    if (ctx.requestedTargetId) {
      if (liveEnemies.includes(ctx.requestedTargetId)) {
        return { valid: true, selectedIds: [ctx.requestedTargetId] };
      }
      return {
        valid: false,
        selectedIds: [],
        error: `Requested target '${ctx.requestedTargetId}' is not a valid live enemy`,
      };
    }

    // Default: first live enemy
    return { valid: true, selectedIds: [liveEnemies[0]!] };
  }

  private selectSingleAlly(ctx: TargetSelectionContext): TargetSelectionResult {
    const liveAllies = ctx.allyIds.filter((id) => ctx.aliveIds.includes(id));

    if (liveAllies.length === 0) {
      return { valid: false, selectedIds: [], error: 'No living allies to target' };
    }

    if (ctx.requestedTargetId) {
      if (liveAllies.includes(ctx.requestedTargetId)) {
        return { valid: true, selectedIds: [ctx.requestedTargetId] };
      }
      return {
        valid: false,
        selectedIds: [],
        error: `Requested target '${ctx.requestedTargetId}' is not a valid live ally`,
      };
    }

    // Default: first live ally
    return { valid: true, selectedIds: [liveAllies[0]!] };
  }
}
