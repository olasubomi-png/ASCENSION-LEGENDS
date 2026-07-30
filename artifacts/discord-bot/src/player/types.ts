/**
 * Character Runtime — core type definitions.
 *
 * These types represent a character's in-memory state during gameplay.
 * They extend the persisted ICharacterStats with runtime concepts
 * (energy management, stamina, computed modifiers, transformation state).
 *
 * Naming follows the Game Design Bible (Book 1 §4):
 *   HP, Energy (was MP), Attack, Defense, Magic, Speed,
 *   Accuracy, Evasion, CritChance, CritDamage, Luck, Stamina.
 */

// ──────────────────────────────────────────────────────────────────────────────
// Stat keys
// ──────────────────────────────────────────────────────────────────────────────

export type StatKey =
  | 'hp'
  | 'maxHp'
  | 'energy'
  | 'maxEnergy'
  | 'attack'
  | 'defense'
  | 'magic'
  | 'magicDefense'
  | 'speed'
  | 'accuracy'
  | 'evasion'
  | 'critChance'
  | 'critDamage'
  | 'luck'
  | 'stamina'
  | 'maxStamina';

// ──────────────────────────────────────────────────────────────────────────────
// Runtime stats
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Full runtime stat block. All percentage stats are stored as integers:
 * critChance: 5 = 5%, accuracy: 85 = 85%, etc.  (Book 1 §4.7–§4.10)
 */
export interface RuntimeStats {
  hp: number;
  maxHp: number;
  /** Energy replaces MP at the runtime layer. */
  energy: number;
  maxEnergy: number;
  attack: number;
  defense: number;
  /** Magic replaces magicAttack at the runtime layer. */
  magic: number;
  magicDefense: number;
  speed: number;
  /** Stored as integer percent, e.g. 85 = 85% (Book 1 §4.7). */
  accuracy: number;
  /** Stored as integer percent, e.g. 10 = 10% (Book 1 §4.8). */
  evasion: number;
  /** Stored as integer percent, e.g. 5 = 5% (Book 1 §4.9). */
  critChance: number;
  /** Stored as integer percent, e.g. 150 = 150% (Book 1 §4.10). */
  critDamage: number;
  luck: number;
  stamina: number;
  maxStamina: number;
}

// ──────────────────────────────────────────────────────────────────────────────
// Stat modifiers
// ──────────────────────────────────────────────────────────────────────────────

export type ModifierSourceType =
  | 'equipment'
  | 'skill'
  | 'buff'
  | 'debuff'
  | 'status'
  | 'transformation';

export type ModifierValueType = 'flat' | 'percent';

/**
 * A single stat modifier applied to a character's runtime stats.
 *
 * Flat modifiers are added before percent modifiers.
 * Percent modifiers multiply the (base + flat) total.
 */
export interface StatModifier {
  /** Unique modifier instance ID (e.g. skill/item ULID). */
  id: string;
  /** Human-readable source name (e.g. "Iron Vanguard Pauldrons"). */
  source: string;
  sourceType: ModifierSourceType;
  stat: StatKey;
  valueType: ModifierValueType;
  value: number;
  /** Rounds/ticks remaining. undefined = permanent (e.g. equipment). */
  duration?: number;
}

// ──────────────────────────────────────────────────────────────────────────────
// Derived attributes
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Attributes derived from RuntimeStats — used by the battle engine
 * and display layers. Computed fresh each time stats change.
 */
export interface CharacterAttributes {
  /** Effective attack power after all modifiers. */
  effectiveAttack: number;
  /** Effective magic power after all modifiers. */
  effectiveMagic: number;
  /** Effective physical mitigation after all modifiers. */
  effectiveDefense: number;
  /** Effective magical mitigation after all modifiers. */
  effectiveMagicDefense: number;
  /** Power Rating (Book 1 §3.4). */
  powerRating: number;
  /** PR rank label (Bronze, Silver … Legend). */
  rankLabel: string;
  /** True evasion chance clamped 0–90% (Book 1 §4.8). */
  effectiveEvasion: number;
  /** True accuracy value clamped 0–100% (Book 1 §4.7). */
  effectiveAccuracy: number;
  /** Effective crit chance clamped 0–75% (Book 1 §4.9). */
  effectiveCritChance: number;
}

// ──────────────────────────────────────────────────────────────────────────────
// Character runtime snapshot
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Full in-memory character state. This is the primary object passed
 * between services during a session; it is never persisted directly.
 */
export interface CharacterRuntimeSnapshot {
  characterId: string;
  userId: string;
  discordId: string;
  name: string;
  classId: string;
  level: number;
  baseStats: RuntimeStats;
  computedStats: RuntimeStats;
  modifiers: StatModifier[];
  attributes: CharacterAttributes;
  /** Active skill IDs learned by the character. */
  activeSkillIds: string[];
  /** Passive skill IDs learned by the character. */
  passiveSkillIds: string[];
  /** Ultimate skill IDs learned by the character. */
  ultimateSkillIds: string[];
  /** Combo skill IDs currently available (unlocked by prior skills). */
  comboSkillIds: string[];
  /** skillId → rounds remaining on cooldown. */
  cooldowns: Map<string, number>;
  /** Active transformation ID, if any. */
  transformationId?: string;
  isTransformed: boolean;
}

// ──────────────────────────────────────────────────────────────────────────────
// Progression
// ──────────────────────────────────────────────────────────────────────────────

export interface LevelUpResult {
  newLevel: number;
  statGains: Partial<RuntimeStats>;
  statPointsGained: number;
  skillPointsGained: number;
  levelsGained: number;
}

export interface ProgressionResult {
  experienceGained: number;
  newExperience: number;
  levelUps: LevelUpResult[];
  didLevelUp: boolean;
}
