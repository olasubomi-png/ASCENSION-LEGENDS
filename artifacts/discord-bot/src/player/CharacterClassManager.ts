/**
 * CharacterClassManager — class-specific logic, validation, and skill pools.
 *
 * Provides class-based ability unlocks, skill pools per class,
 * and class-tier transitions (future sprint hooks).
 *
 * @see Book 2 §4 — Playable Classes
 */

import { CLASS_DEFINITIONS, CLASS_ORDER } from '../constants/classes.js';
import type { ClassId, ClassDefinition } from '../constants/classes.js';

// ──────────────────────────────────────────────────────────────────────────────
// Class skill pools (Book 2 §4 — each class has archetype-specific skills)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Skill IDs available to each class, organised by category.
 * These are the canonical skill ID strings used across the skill registry.
 */
export const CLASS_SKILL_POOLS: Readonly<
  Record<ClassId, Readonly<{
    active: string[];
    passive: string[];
    ultimate: string[];
  }>>
> = {
  vanguard: {
    active: [
      'vanguard_shield_bash',
      'vanguard_war_cry',
      'vanguard_iron_wall',
      'vanguard_taunt',
      'vanguard_counter_stance',
    ],
    passive: [
      'vanguard_fortitude',
      'vanguard_retaliation',
    ],
    ultimate: [
      'vanguard_unbreakable_fortress',
    ],
  },
  invoker: {
    active: [
      'invoker_flame_bolt',
      'invoker_frost_nova',
      'invoker_arcane_burst',
      'invoker_mana_drain',
      'invoker_void_rift',
    ],
    passive: [
      'invoker_arcane_mastery',
      'invoker_mana_surge',
    ],
    ultimate: [
      'invoker_cataclysm',
    ],
  },
  wanderer: {
    active: [
      'wanderer_quick_strike',
      'wanderer_smoke_screen',
      'wanderer_shadow_step',
      'wanderer_ambush',
      'wanderer_expose_weakness',
    ],
    passive: [
      'wanderer_evasive_instinct',
      'wanderer_predator',
    ],
    ultimate: [
      'wanderer_phantom_assault',
    ],
  },
} as const;

// ──────────────────────────────────────────────────────────────────────────────
// Shared / cross-class skill pool
// ──────────────────────────────────────────────────────────────────────────────

/** Skills available to all classes regardless of archetype. */
export const UNIVERSAL_SKILL_IDS: Readonly<{
  active: string[];
  passive: string[];
  combo: string[];
}> = {
  active: ['basic_attack', 'healing_potion', 'rally'],
  passive: ['resilience', 'fortune'],
  combo: ['combo_finisher', 'combo_empowered'],
} as const;

// ──────────────────────────────────────────────────────────────────────────────
// CharacterClassManager
// ──────────────────────────────────────────────────────────────────────────────

export class CharacterClassManager {
  /**
   * Returns the full class definition for a given class ID, or null if unknown.
   */
  getClassDefinition(classId: string): ClassDefinition | null {
    return CLASS_DEFINITIONS[classId as ClassId] ?? null;
  }

  /**
   * Returns true if the classId is a recognised player class.
   */
  isValidClass(classId: string): classId is ClassId {
    return classId in CLASS_DEFINITIONS;
  }

  /**
   * Returns all valid class IDs in display order.
   */
  getAllClassIds(): ClassId[] {
    return [...CLASS_ORDER];
  }

  /**
   * Returns all skill IDs available to a class (class-specific + universal).
   */
  getAvailableSkillIds(classId: string): {
    active: string[];
    passive: string[];
    ultimate: string[];
    combo: string[];
  } {
    const pool = CLASS_SKILL_POOLS[classId as ClassId];
    if (!pool) {
      return {
        active: [...UNIVERSAL_SKILL_IDS.active],
        passive: [...UNIVERSAL_SKILL_IDS.passive],
        ultimate: [],
        combo: [...UNIVERSAL_SKILL_IDS.combo],
      };
    }

    return {
      active: [...pool.active, ...UNIVERSAL_SKILL_IDS.active],
      passive: [...pool.passive, ...UNIVERSAL_SKILL_IDS.passive],
      ultimate: [...pool.ultimate],
      combo: [...UNIVERSAL_SKILL_IDS.combo],
    };
  }

  /**
   * Returns true if the given skill ID belongs to the class's pool
   * or to the universal pool.
   */
  canUseSkill(classId: string, skillId: string): boolean {
    const available = this.getAvailableSkillIds(classId);
    return (
      available.active.includes(skillId) ||
      available.passive.includes(skillId) ||
      available.ultimate.includes(skillId) ||
      available.combo.includes(skillId)
    );
  }

  /**
   * Returns the starter skill IDs for a new character of the given class.
   * New characters begin with the first active skill and all passive skills.
   */
  getStarterSkillIds(classId: string): {
    active: string[];
    passive: string[];
    ultimate: string[];
    combo: string[];
  } {
    const available = this.getAvailableSkillIds(classId);
    return {
      active: available.active.slice(0, 1),       // first active skill
      passive: available.passive,                   // all passives from the start
      ultimate: [],                                 // ultimates unlocked later
      combo: [],                                    // combos unlocked via skill use
    };
  }

  /**
   * Returns the minimum character level required to unlock a skill tier.
   * Tier 1: levels 1–25, Tier 2: 26–50, Tier 3: 51–75, Tier 4: 76–100.
   */
  skillTierMinLevel(tier: 1 | 2 | 3 | 4): number {
    return (tier - 1) * 25 + 1;
  }
}
