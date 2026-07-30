/**
 * ActiveSkillEngine — computes effects for active skill execution.
 *
 * Handles: damage, heal, buff, debuff, shield, drain, dot, hot effects.
 * Reads the actor's computed stats to resolve multiplier-based values.
 * Returns a list of AppliedEffect records — does not mutate any state.
 *
 * @see Book 1 §6 — Battle System, skill resolution
 */

import type { RuntimeStats } from '../player/types.js';
import { DamageCalculator } from '../services/battle/DamageCalculator.js';
import { childLogger } from '../utils/logger.js';

import type {
  AppliedEffect,
  SkillDefinition,
  SkillEffect,
  SkillEffectType,
} from './types.js';

const log = childLogger('ActiveSkillEngine');

// ──────────────────────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────────────────────

export interface ActiveSkillExecutionInput {
  skill: SkillDefinition;
  actorStats: RuntimeStats;
  targetIds: string[];
  /** Per-target current stats (for AoE, keyed by ID). */
  targetStats: Map<string, RuntimeStats>;
  round: number;
  /** Deterministic 0–1 random number for crit/proc checks. */
  random: number;
}

export interface ActiveSkillExecutionOutput {
  appliedEffects: AppliedEffect[];
  energyConsumed: number;
  staminaConsumed: number;
}

export class ActiveSkillEngine {
  private readonly dmgCalc = new DamageCalculator();

  /**
   * Execute an active skill and return all applied effects.
   * Pure — no state mutation. Caller must apply results.
   */
  execute(input: ActiveSkillExecutionInput): ActiveSkillExecutionOutput {
    const { skill, actorStats, targetIds, targetStats, random } = input;
    const appliedEffects: AppliedEffect[] = [];

    for (const targetId of targetIds) {
      const tStats = targetStats.get(targetId);
      if (!tStats) {
        log.warn('Target stats not found', { targetId, skillId: skill.id });
        continue;
      }

      for (const effect of skill.effects) {
        const effects = this.resolveEffect(
          effect,
          skill,
          actorStats,
          tStats,
          targetId,
          random,
        );
        appliedEffects.push(...effects);
      }
    }

    return {
      appliedEffects,
      energyConsumed: skill.requirements.energyCost,
      staminaConsumed: skill.requirements.staminaCost ?? 0,
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Effect resolution
  // ──────────────────────────────────────────────────────────────────────────

  private resolveEffect(
    effect: SkillEffect,
    skill: SkillDefinition,
    actorStats: RuntimeStats,
    targetStats: RuntimeStats,
    targetId: string,
    random: number,
  ): AppliedEffect[] {
    switch (effect.type) {
      case 'damage':
        return this.resolveDamage(effect, skill, actorStats, targetStats, targetId, random);
      case 'heal':
        return [this.resolveHeal(effect, actorStats, targetId)];
      case 'shield':
        return [this.resolveShield(effect, actorStats, targetId)];
      case 'buff':
        return [this.resolveStatEffect('buff', effect, actorStats, targetId, random)];
      case 'debuff':
        return [this.resolveStatEffect('debuff', effect, actorStats, targetId, random)];
      case 'drain':
        return this.resolveDrain(effect, skill, actorStats, targetStats, targetId, random);
      case 'dot':
        return [this.resolveDot(effect, skill, actorStats, targetStats, targetId, random)];
      case 'hot':
        return [this.resolveHot(effect, actorStats, targetId)];
      default: {
        log.warn('Unknown effect type', { type: effect.type, skillId: skill.id });
        return [];
      }
    }
  }

  private resolveDamage(
    effect: SkillEffect,
    skill: SkillDefinition,
    actorStats: RuntimeStats,
    targetStats: RuntimeStats,
    targetId: string,
    random: number,
  ): AppliedEffect[] {
    const hits = effect.hits ?? 1;
    const results: AppliedEffect[] = [];
    const multiplier = effect.valueType === 'flat' ? 0 : effect.value;

    // Crit check
    const critThreshold = (actorStats.critChance / 100);
    const isCrit = skill.guaranteedCrit || random < critThreshold;
    const critMultiplier = isCrit ? actorStats.critDamage / 100 : 1.0;

    for (let hit = 0; hit < hits; hit++) {
      const dmgResult = this.dmgCalc.calculate({
        attack: actorStats.attack,
        magicAttack: actorStats.magic,
        defense: targetStats.defense,
        magicDefense: targetStats.magicDefense,
        multiplier: effect.valueType === 'multiplier' ? multiplier * critMultiplier : 1,
        damageType: skill.damageType ?? 'physical',
      });

      const finalDamage = effect.valueType === 'flat'
        ? Math.max(1, Math.round(effect.value * critMultiplier))
        : dmgResult.finalDamage;

      results.push({
        targetId,
        type: 'damage',
        value: finalDamage,
        critical: isCrit,
        statusApplied: undefined,
      });
    }

    // Status application check
    for (const eff of [effect]) {
      if (eff.statusType && eff.statusChance !== undefined) {
        if (random < eff.statusChance) {
          results.push({
            targetId,
            type: this.effectTypeFromStatus(eff.statusType),
            value: eff.duration ?? 2,
            statusApplied: eff.statusType,
          });
        }
      }
    }

    return results;
  }

  private resolveHeal(
    effect: SkillEffect,
    actorStats: RuntimeStats,
    targetId: string,
  ): AppliedEffect {
    const value = effect.valueType === 'multiplier'
      ? Math.round(actorStats.magic * effect.value)
      : Math.round(effect.value);

    return { targetId, type: 'heal', value: Math.max(1, value) };
  }

  private resolveShield(
    effect: SkillEffect,
    actorStats: RuntimeStats,
    targetId: string,
  ): AppliedEffect {
    const value = effect.valueType === 'multiplier'
      ? Math.round(actorStats.defense * effect.value)
      : Math.round(effect.value);

    return { targetId, type: 'shield', value: Math.max(1, value) };
  }

  private resolveStatEffect(
    effectType: SkillEffectType,
    effect: SkillEffect,
    _actorStats: RuntimeStats,
    targetId: string,
    random: number,
  ): AppliedEffect {
    // Apply status chance if defined
    if (effect.statusType && effect.statusChance !== undefined && random >= effect.statusChance) {
      // Status didn't proc — return zero-value effect
      return { targetId, type: effectType, value: 0 };
    }

    return {
      targetId,
      type: effectType,
      value: Math.round(Math.abs(effect.value)),
      statusApplied: effect.statusType,
    };
  }

  private resolveDrain(
    effect: SkillEffect,
    skill: SkillDefinition,
    actorStats: RuntimeStats,
    targetStats: RuntimeStats,
    targetId: string,
    random: number,
  ): AppliedEffect[] {
    // Drain: deal damage, heal actor for fraction of damage dealt
    const dmgResult = this.dmgCalc.calculate({
      attack: actorStats.attack,
      magicAttack: actorStats.magic,
      defense: targetStats.defense,
      magicDefense: targetStats.magicDefense,
      multiplier: effect.value,
      damageType: skill.damageType ?? 'magic',
    });

    const healAmount = Math.round(dmgResult.finalDamage * effect.value);
    const isCrit = random < actorStats.critChance / 100;

    return [
      { targetId, type: 'damage', value: dmgResult.finalDamage, critical: isCrit },
      { targetId: 'self', type: 'heal', value: Math.max(1, healAmount) },
    ];
  }

  private resolveDot(
    effect: SkillEffect,
    skill: SkillDefinition,
    actorStats: RuntimeStats,
    _targetStats: RuntimeStats,
    targetId: string,
    random: number,
  ): AppliedEffect {
    const procs = !effect.statusChance || random < (effect.statusChance);
    if (!procs || !effect.statusType) {
      return { targetId, type: 'dot', value: 0 };
    }

    const tickDamage = effect.valueType === 'multiplier'
      ? Math.round(
          actorStats.attack * effect.value *
          (skill.damageType === 'magic' ? (actorStats.magic / Math.max(1, actorStats.attack)) : 1),
        )
      : Math.round(effect.value);

    return {
      targetId,
      type: 'dot',
      value: Math.max(1, tickDamage),
      statusApplied: effect.statusType,
    };
  }

  private resolveHot(
    effect: SkillEffect,
    actorStats: RuntimeStats,
    targetId: string,
  ): AppliedEffect {
    const value = effect.valueType === 'multiplier'
      ? Math.round(actorStats.magic * effect.value)
      : Math.round(effect.value);

    return { targetId, type: 'hot', value: Math.max(1, value) };
  }

  private effectTypeFromStatus(statusType: string): SkillEffectType {
    const dotStatuses = new Set(['burn', 'poison', 'bleed', 'shock']);
    return dotStatuses.has(statusType) ? 'dot' : 'debuff';
  }
}
