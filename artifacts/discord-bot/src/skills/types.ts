/**
 * Skill System — core type definitions.
 *
 * Supports: active, passive, ultimate, combo, AoE, single-target,
 * buff, debuff, heal, and transformation skills.
 *
 * @see Book 1 §6 — Battle System (skill integration)
 * @see Book 3 §6 — Technical skill architecture
 */

import type { StatKey } from '../player/types.js';
import type { BattleElement, DamageType, StatusType } from '../services/battle/types.js';

// ──────────────────────────────────────────────────────────────────────────────
// Enumerations
// ──────────────────────────────────────────────────────────────────────────────

export type SkillCategory = 'active' | 'passive' | 'ultimate' | 'combo';

export type SkillTargetType =
  | 'single_enemy'
  | 'single_ally'
  | 'self'
  | 'aoe_enemies'
  | 'aoe_allies'
  | 'all';

export type SkillEffectType =
  | 'damage'
  | 'heal'
  | 'buff'
  | 'debuff'
  | 'transform'
  | 'shield'
  | 'drain'
  | 'dot'   // damage-over-time
  | 'hot';  // heal-over-time

// ──────────────────────────────────────────────────────────────────────────────
// Skill definition
// ──────────────────────────────────────────────────────────────────────────────

/**
 * A single effect applied by a skill.
 */
export interface SkillEffect {
  type: SkillEffectType;
  /**
   * For damage/heal/shield: coefficient applied to the relevant attack stat.
   * For buff/debuff: modifier value (flat or percent).
   * For drain: fraction of damage healed back.
   */
  value: number;
  valueType: 'flat' | 'multiplier' | 'percent';
  /** For buff/debuff effects: the stat being modified. */
  stat?: StatKey;
  /** Number of rounds the effect persists (omit for instant effects). */
  duration?: number;
  /** For DOT/HOT effects: applied status type. */
  statusType?: StatusType;
  /** Probability 0–1 that statusType is applied (default 1.0). */
  statusChance?: number;
  /** For multi-hit skills: number of individual hits. */
  hits?: number;
}

/**
 * Requirements that must be met before a skill can be used.
 */
export interface SkillRequirements {
  /** Energy cost (deducted from character's energy pool). */
  energyCost: number;
  /** Stamina cost (optional secondary resource). */
  staminaCost?: number;
  /** Cooldown in rounds after use. 0 = no cooldown. */
  cooldown: number;
  /** Minimum character level required. */
  minLevel?: number;
  /** Allowed class IDs. Empty array or omitted = all classes. */
  allowedClasses?: string[];
  /** Required active transformation ID (if any). */
  requiredTransformation?: string;
  /** Skill IDs that must have been used this combo chain. */
  comboPrerequisites?: string[];
  /** Minimum ultimate gauge value (0–100). Relevant for ultimates. */
  minUltimateGauge?: number;
}

/**
 * Complete skill definition — the game data record for one skill.
 */
export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  targetType: SkillTargetType;
  /** Physical, magic, or true damage (omit for non-damaging skills). */
  damageType?: DamageType;
  element?: BattleElement;
  requirements: SkillRequirements;
  effects: SkillEffect[];
  /**
   * Skill IDs that become available as combo follow-ups after this skill.
   * Only relevant while the combo window is open (same turn or next N rounds).
   */
  comboFollowUps?: string[];
  /** If true, using this skill enters a transformation. */
  isTransformation?: boolean;
  /** Transformation ID applied when this skill is used. */
  transformationId?: string;
  /** If true, cannot be countered (Book 1 §6.8). */
  cannotBeCountered?: boolean;
  /** Guaranteed critical hit. */
  guaranteedCrit?: boolean;
}

// ──────────────────────────────────────────────────────────────────────────────
// Execution context
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Context passed to the skill execution pipeline for one skill use.
 */
export interface SkillExecutionContext {
  actorId: string;
  targetIds: string[];
  skillId: string;
  /** Current round or tick number — used for cooldown expiry. */
  round: number;
  /** Ultimate gauge of the actor (0–100). */
  ultimateGauge?: number;
  /** Combo chain skill IDs used so far this session. */
  activeComboChain?: string[];
}

/**
 * The result of executing a skill for one actor–target pair.
 */
export interface AppliedEffect {
  targetId: string;
  type: SkillEffectType;
  /** Numeric magnitude (damage, heal amount, modifier value, etc.). */
  value: number;
  critical?: boolean;
  statusApplied?: StatusType;
}

export interface SkillExecutionResult {
  ok: true;
  skillId: string;
  actorId: string;
  appliedEffects: AppliedEffect[];
  /** New combo follow-ups unlocked after this skill. */
  comboFollowUpsUnlocked: string[];
  /** Whether this skill initiated a transformation. */
  transformationTriggered: boolean;
  transformationId?: string;
  /** Energy remaining on actor after cost. */
  energyRemaining: number;
  /** Cooldown round until which the skill is locked (inclusive). */
  cooldownUntilRound: number;
}

export interface SkillExecutionError {
  ok: false;
  skillId: string;
  actorId: string;
  reason: string;
}

export type SkillExecutionOutcome = SkillExecutionResult | SkillExecutionError;

// ──────────────────────────────────────────────────────────────────────────────
// Validation
// ──────────────────────────────────────────────────────────────────────────────

export interface SkillValidationContext {
  actorId: string;
  skillId: string;
  actorLevel: number;
  actorClassId: string;
  actorEnergy: number;
  actorStamina: number;
  actorTransformationId?: string;
  isTransformed: boolean;
  /** skillId → round on which the cooldown expires. */
  cooldowns: Map<string, number>;
  currentRound: number;
  ultimateGauge: number;
  targetIds: string[];
  /** Skill IDs already used in current combo chain. */
  activeComboChain: string[];
}

export interface SkillValidationResult {
  valid: boolean;
  errors: string[];
}

// ──────────────────────────────────────────────────────────────────────────────
// Passive triggers
// ──────────────────────────────────────────────────────────────────────────────

export type PassiveTrigger =
  | 'on_turn_start'
  | 'on_turn_end'
  | 'on_hit_dealt'
  | 'on_hit_received'
  | 'on_kill'
  | 'on_hp_below_50'
  | 'on_hp_below_25'
  | 'on_status_applied'
  | 'on_crit'
  | 'on_dodge'
  | 'passive_always'; // always-on stat bonus

export interface PassiveSkillDefinition extends SkillDefinition {
  category: 'passive';
  trigger: PassiveTrigger;
  /**
   * Chance 0–1 that the passive fires when its trigger condition is met.
   * Default 1.0.
   */
  procChance?: number;
}

// ──────────────────────────────────────────────────────────────────────────────
// Target selection
// ──────────────────────────────────────────────────────────────────────────────

export interface TargetSelectionContext {
  actorId: string;
  targetType: SkillTargetType;
  /** All participant IDs in the encounter. */
  allParticipantIds: string[];
  /** IDs of participants that are allies of the actor. */
  allyIds: string[];
  /** IDs of participants that are enemies of the actor. */
  enemyIds: string[];
  /** IDs of participants that are alive (hp > 0). */
  aliveIds: string[];
  /** Explicit target provided by the player. */
  requestedTargetId?: string;
}

export interface TargetSelectionResult {
  valid: boolean;
  selectedIds: string[];
  error?: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// Combo state
// ──────────────────────────────────────────────────────────────────────────────

export interface ComboState {
  actorId: string;
  /** Ordered list of skill IDs used in the current chain. */
  chain: string[];
  /** Skills currently available as next combo steps. */
  availableFollowUps: string[];
  /** Round on which the combo window closes. */
  expiresAtRound: number;
}
