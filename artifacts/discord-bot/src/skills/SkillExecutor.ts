/**
 * SkillExecutor — orchestrates the full skill execution pipeline.
 *
 * Pipeline (per skill use):
 *  1. Validate the skill use (SkillValidator)
 *  2. Resolve targets (TargetSelector)
 *  3. Execute effects (ActiveSkillEngine / UltimateSkillEngine)
 *  4. Record cooldown (SkillCooldownManager)
 *  5. Update combo chain (ComboEngine)
 *
 * This class is stateless — all stateful objects (cooldowns, combo state,
 * character runtime) are passed in and mutated by the caller.
 */

import type { RuntimeStats } from '../player/types.js';
import { childLogger } from '../utils/logger.js';

import { ActiveSkillEngine } from './ActiveSkillEngine.js';
import type { ComboEngine } from './ComboEngine.js';
import type { SkillCooldownManager } from './SkillCooldownManager.js';
import { getSkillDefinition } from './SkillRegistry.js';
import { SkillValidator } from './SkillValidator.js';
import { TargetSelector } from './TargetSelector.js';
import { UltimateSkillEngine } from './UltimateSkillEngine.js';
import type {
  SkillExecutionContext,
  SkillExecutionError,
  SkillExecutionOutcome,
  SkillExecutionResult,
  TargetSelectionContext,
} from './types.js';

const log = childLogger('SkillExecutor');

export interface SkillExecutorInput {
  ctx: SkillExecutionContext;
  actorStats: RuntimeStats;
  actorLevel: number;
  actorClassId: string;
  actorTransformationId?: string;
  isTransformed: boolean;
  actorStamina: number;
  ultimateGauge: number;
  cooldownManager: SkillCooldownManager;
  comboEngine: ComboEngine;
  /** All participant IDs, alive IDs, ally IDs, enemy IDs. */
  encounterContext: {
    allParticipantIds: string[];
    aliveIds: string[];
    allyIds: string[];
    enemyIds: string[];
    requestedTargetId?: string;
  };
  /** Per-participant RuntimeStats for damage/heal calculation. */
  participantStats: Map<string, RuntimeStats>;
  random: number;
}

export class SkillExecutor {
  private readonly validator = new SkillValidator();
  private readonly targetSelector = new TargetSelector();
  private readonly activeEngine = new ActiveSkillEngine();
  private readonly ultimateEngine = new UltimateSkillEngine();

  /**
   * Execute a skill through the full pipeline.
   *
   * Returns a SkillExecutionResult on success or SkillExecutionError on failure.
   * Does NOT mutate state — caller must apply results (deduct energy, set cooldown, etc.)
   */
  execute(input: SkillExecutorInput): SkillExecutionOutcome {
    const { ctx, cooldownManager, comboEngine } = input;

    // ── 1. Look up skill ───────────────────────────────────────────────────
    const skill = getSkillDefinition(ctx.skillId);
    if (!skill) {
      return this.error(ctx, `Unknown skill: '${ctx.skillId}'`);
    }

    // ── 2. Validate ────────────────────────────────────────────────────────
    const comboChain = comboEngine.getChain(ctx.actorId, ctx.round);
    const validationResult = this.validator.validate({
      actorId: ctx.actorId,
      skillId: ctx.skillId,
      actorLevel: input.actorLevel,
      actorClassId: input.actorClassId,
      actorEnergy: input.actorStats.energy,
      actorStamina: input.actorStamina,
      actorTransformationId: input.actorTransformationId,
      isTransformed: input.isTransformed,
      cooldowns: new Map(cooldownManager.snapshot()),
      currentRound: ctx.round,
      ultimateGauge: input.ultimateGauge,
      targetIds: ctx.targetIds,
      activeComboChain: comboChain,
    });

    if (!validationResult.valid) {
      log.debug('Skill validation failed', { skillId: ctx.skillId, errors: validationResult.errors });
      return this.error(ctx, validationResult.errors.join('; '));
    }

    // ── 3. Resolve targets ─────────────────────────────────────────────────
    const targetCtx: TargetSelectionContext = {
      actorId: ctx.actorId,
      targetType: skill.targetType,
      allParticipantIds: input.encounterContext.allParticipantIds,
      aliveIds: input.encounterContext.aliveIds,
      allyIds: input.encounterContext.allyIds,
      enemyIds: input.encounterContext.enemyIds,
      requestedTargetId: input.encounterContext.requestedTargetId,
    };

    const targetResult = this.targetSelector.select(targetCtx);
    if (!targetResult.valid) {
      return this.error(ctx, targetResult.error ?? 'Invalid targets');
    }

    const resolvedTargetIds = targetResult.selectedIds;

    // ── 4. Execute effects ─────────────────────────────────────────────────
    let appliedEffects;
    let energyConsumed: number;
    let transformationTriggered = false;
    let transformationId: string | undefined;

    if (skill.category === 'ultimate') {
      const ultOutput = this.ultimateEngine.execute({
        skillId: ctx.skillId,
        actorStats: input.actorStats,
        targetIds: resolvedTargetIds,
        targetStats: input.participantStats,
        ultimateGauge: input.ultimateGauge,
        round: ctx.round,
        random: input.random,
      });

      if (!ultOutput.ok) {
        return this.error(ctx, ultOutput.error ?? 'Ultimate execution failed');
      }

      appliedEffects = ultOutput.appliedEffects;
      energyConsumed = ultOutput.energyConsumed;
      transformationTriggered = ultOutput.transformationTriggered;
      transformationId = ultOutput.transformationId;
    } else {
      const activeOutput = this.activeEngine.execute({
        skill,
        actorStats: input.actorStats,
        targetIds: resolvedTargetIds,
        targetStats: input.participantStats,
        round: ctx.round,
        random: input.random,
      });

      appliedEffects = activeOutput.appliedEffects;
      energyConsumed = activeOutput.energyConsumed;
    }

    // ── 5. Compute combo follow-ups ────────────────────────────────────────
    const comboFollowUpsUnlocked = skill.comboFollowUps ?? [];

    // ── 6. Compute cooldown expiry ─────────────────────────────────────────
    const cooldownUntilRound =
      skill.requirements.cooldown > 0
        ? ctx.round + skill.requirements.cooldown
        : ctx.round - 1; // no cooldown → already expired

    // ── 7. Compute energy remaining ────────────────────────────────────────
    const energyRemaining = Math.max(0, input.actorStats.energy - energyConsumed);

    log.debug('Skill executed', {
      skillId: ctx.skillId,
      actorId: ctx.actorId,
      targets: resolvedTargetIds.length,
      effects: appliedEffects.length,
    });

    const result: SkillExecutionResult = {
      ok: true,
      skillId: ctx.skillId,
      actorId: ctx.actorId,
      appliedEffects,
      comboFollowUpsUnlocked,
      transformationTriggered,
      transformationId,
      energyRemaining,
      cooldownUntilRound,
    };

    return result;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Private helpers
  // ──────────────────────────────────────────────────────────────────────────

  private error(ctx: SkillExecutionContext, reason: string): SkillExecutionError {
    return { ok: false, skillId: ctx.skillId, actorId: ctx.actorId, reason };
  }
}
