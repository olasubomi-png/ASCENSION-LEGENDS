/**
 * PassiveSkillEngine — evaluates and applies passive skill effects.
 *
 * Passives fire on specific triggers (on_hit_received, on_crit, etc.) or
 * are always-on stat bonuses. This engine handles both modes.
 *
 * Always-on passives produce StatModifiers that are applied via the
 * StatModifierEngine. Triggered passives fire when their condition is met
 * and may apply temporary modifiers or instant effects.
 */

import { StatModifierEngine } from '../player/StatModifierEngine.js';
import type { StatModifier, RuntimeStats } from '../player/types.js';
import { childLogger } from '../utils/logger.js';

import { getPassiveSkills } from './SkillRegistry.js';
import type { PassiveSkillDefinition, PassiveTrigger, SkillEffect } from './types.js';


const log = childLogger('PassiveSkillEngine');

export interface PassiveApplicationResult {
  skillId: string;
  fired: boolean;
  modifiersAdded: StatModifier[];
  instantHeal?: number;
  instantEnergyRestore?: number;
}

export class PassiveSkillEngine {
  private readonly modEngine = new StatModifierEngine();

  // ──────────────────────────────────────────────────────────────────────────
  // Always-on passives
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Generate StatModifiers for all always-on passives in the given skill list.
   * Call this whenever a character's passive loadout changes.
   *
   * @param passiveSkillIds Passive skill IDs the character has equipped.
   * @returns Array of StatModifiers to add to the character's modifier list.
   */
  buildAlwaysOnModifiers(passiveSkillIds: string[]): StatModifier[] {
    const passives = getPassiveSkills().filter(
      (p) => passiveSkillIds.includes(p.id) && p.trigger === 'passive_always',
    );

    const modifiers: StatModifier[] = [];
    for (const passive of passives) {
      for (const effect of passive.effects) {
        if (effect.stat && (effect.type === 'buff' || effect.type === 'debuff')) {
          modifiers.push({
            id: `passive_${passive.id}_${effect.stat}`,
            source: passive.id,
            sourceType: 'skill',
            stat: effect.stat,
            valueType: effect.valueType === 'percent' ? 'percent' : 'flat',
            value: effect.value,
            // No duration = permanent (as long as the passive is equipped)
          });
        }
      }
    }

    log.debug('Built always-on modifiers', { count: modifiers.length });
    return modifiers;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Triggered passives
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Evaluate triggered passives for a specific event trigger.
   * Returns the passives that fired and any resulting modifiers/effects.
   *
   * @param passiveSkillIds Passive skill IDs to evaluate.
   * @param trigger         The trigger event that occurred.
   * @param random          0–1 random value for proc chance evaluation.
   * @param currentRound    The current combat round (for modifier durations).
   */
  evaluateTrigger(
    passiveSkillIds: string[],
    trigger: PassiveTrigger,
    random: number,
    currentRound: number,
  ): PassiveApplicationResult[] {
    const passives = getPassiveSkills().filter(
      (p) => passiveSkillIds.includes(p.id) && p.trigger === trigger,
    );

    const results: PassiveApplicationResult[] = [];

    for (const passive of passives) {
      const procChance = passive.procChance ?? 1.0;
      const fires = random < procChance;

      if (!fires) {
        results.push({ skillId: passive.id, fired: false, modifiersAdded: [] });
        continue;
      }

      const modifiers: StatModifier[] = [];
      let instantHeal: number | undefined;
      let instantEnergyRestore: number | undefined;

      for (const effect of passive.effects) {
        this.processTriggeredEffect(effect, passive, currentRound, modifiers, {
          onHeal: (v) => { instantHeal = (instantHeal ?? 0) + v; },
          onEnergyRestore: (v) => { instantEnergyRestore = (instantEnergyRestore ?? 0) + v; },
        });
      }

      log.debug('Passive fired', { skillId: passive.id, trigger });
      results.push({
        skillId: passive.id,
        fired: true,
        modifiersAdded: modifiers,
        instantHeal,
        instantEnergyRestore,
      });
    }

    return results;
  }

  /**
   * Apply always-on passive modifiers to a set of base stats (pure, no side effects).
   * Convenience method that composes buildAlwaysOnModifiers + StatModifierEngine.compute.
   */
  applyAlwaysOnToStats(baseStats: RuntimeStats, passiveSkillIds: string[]): RuntimeStats {
    const modifiers = this.buildAlwaysOnModifiers(passiveSkillIds);
    return this.modEngine.compute(baseStats, modifiers);
  }

  /**
   * Returns all passives that match a given trigger.
   */
  getPassivesForTrigger(passiveSkillIds: string[], trigger: PassiveTrigger): PassiveSkillDefinition[] {
    return getPassiveSkills().filter(
      (p) => passiveSkillIds.includes(p.id) && p.trigger === trigger,
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Private helpers
  // ──────────────────────────────────────────────────────────────────────────

  private processTriggeredEffect(
    effect: SkillEffect,
    passive: PassiveSkillDefinition,
    currentRound: number,
    modifiers: StatModifier[],
    callbacks: {
      onHeal: (v: number) => void;
      onEnergyRestore: (v: number) => void;
    },
  ): void {
    if ((effect.type === 'buff' || effect.type === 'debuff') && effect.stat) {
      modifiers.push({
        id: `passive_${passive.id}_${currentRound}_${effect.stat}`,
        source: passive.id,
        sourceType: 'skill',
        stat: effect.stat,
        valueType: effect.valueType === 'percent' ? 'percent' : 'flat',
        value: effect.value,
        duration: effect.duration ?? 1,
      });
    } else if (effect.type === 'hot' || effect.type === 'heal') {
      callbacks.onEnergyRestore(effect.value);
    }
  }
}
