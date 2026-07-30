/**
 * UltimateSkillEngine — handles ultimate skill execution.
 *
 * Ultimates are treated as enhanced active skills with additional rules:
 *  - Require a full ultimate gauge (100/100) by default
 *  - Reset the ultimate gauge to 0 after use
 *  - Cannot be countered (if flagged)
 *  - May trigger transformations
 *
 * Delegates effect computation to ActiveSkillEngine.
 *
 * @see Book 1 §6.12 — Ultimate Abilities
 */

import type { RuntimeStats } from '../player/types.js';
import { childLogger } from '../utils/logger.js';

import { ActiveSkillEngine, type ActiveSkillExecutionOutput } from './ActiveSkillEngine.js';
import { getSkillDefinition } from './SkillRegistry.js';
import type { AppliedEffect } from './types.js';

const log = childLogger('UltimateSkillEngine');

const MAX_ULTIMATE_GAUGE = 100;

export interface UltimateExecutionInput {
  skillId: string;
  actorStats: RuntimeStats;
  targetIds: string[];
  targetStats: Map<string, RuntimeStats>;
  ultimateGauge: number;
  round: number;
  random: number;
}

export interface UltimateExecutionOutput {
  ok: boolean;
  error?: string;
  appliedEffects: AppliedEffect[];
  energyConsumed: number;
  gaugeConsumed: number;
  transformationTriggered: boolean;
  transformationId?: string;
}

export class UltimateSkillEngine {
  private readonly activeEngine = new ActiveSkillEngine();

  /**
   * Execute an ultimate skill.
   *
   * Validates the gauge, delegates effect resolution to ActiveSkillEngine,
   * then resets the gauge.
   */
  execute(input: UltimateExecutionInput): UltimateExecutionOutput {
    const skill = getSkillDefinition(input.skillId);

    if (!skill) {
      return this.failure(`Unknown skill: '${input.skillId}'`);
    }

    if (skill.category !== 'ultimate') {
      return this.failure(`Skill '${input.skillId}' is not an ultimate skill`);
    }

    const minGauge = skill.requirements.minUltimateGauge ?? MAX_ULTIMATE_GAUGE;
    if (input.ultimateGauge < minGauge) {
      return this.failure(
        `Ultimate gauge insufficient: requires ${minGauge}, have ${input.ultimateGauge}`,
      );
    }

    log.debug('Ultimate skill fired', { skillId: input.skillId, gauge: input.ultimateGauge });

    const activeOutput: ActiveSkillExecutionOutput = this.activeEngine.execute({
      skill,
      actorStats: input.actorStats,
      targetIds: input.targetIds,
      targetStats: input.targetStats,
      round: input.round,
      random: input.random,
    });

    return {
      ok: true,
      appliedEffects: activeOutput.appliedEffects,
      energyConsumed: activeOutput.energyConsumed,
      gaugeConsumed: MAX_ULTIMATE_GAUGE,
      transformationTriggered: skill.isTransformation ?? false,
      transformationId: skill.transformationId,
    };
  }

  /**
   * Compute how much ultimate gauge to award after an action.
   * Book 1 §6.12: normal attacks award 10; skills award more based on energy cost.
   */
  computeGaugeGain(energyCost: number, isUltimate: boolean): number {
    if (isUltimate) return 0; // ultimates don't charge gauge
    if (energyCost === 0) return 8;  // basic attacks
    return Math.min(20, 8 + Math.floor(energyCost / 5));
  }

  /**
   * Compute gauge gained when receiving damage (defensive gauge buildup).
   * Book 1 §6.12: taking damage awards gauge based on % max HP lost.
   */
  computeDefensiveGaugeGain(damageTaken: number, maxHp: number): number {
    if (maxHp <= 0) return 0;
    const hpFraction = damageTaken / maxHp;
    return Math.round(hpFraction * 15); // up to 15 gauge per hit
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Private helpers
  // ──────────────────────────────────────────────────────────────────────────

  private failure(error: string): UltimateExecutionOutput {
    log.warn('Ultimate skill failed', { error });
    return {
      ok: false,
      error,
      appliedEffects: [],
      energyConsumed: 0,
      gaugeConsumed: 0,
      transformationTriggered: false,
    };
  }
}
