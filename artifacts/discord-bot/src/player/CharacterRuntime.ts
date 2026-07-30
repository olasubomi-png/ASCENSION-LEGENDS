/**
 * CharacterRuntime — in-memory state manager for one character instance.
 *
 * Wraps a CharacterProfile (from the DB layer) with:
 *   - Full RuntimeStats (base + computed after modifiers)
 *   - StatModifierEngine for applying/removing modifiers
 *   - Computed CharacterAttributes (PR, caps, etc.)
 *   - Skill loadout and cooldown tracking
 *   - Transformation state
 *
 * CharacterRuntime is NOT persisted. Create one per battle/session from
 * a CharacterProfile and discard it when the session ends.
 */

import type { CharacterProfile } from '../interfaces/ICharacterService.js';
import { childLogger } from '../utils/logger.js';

import { computeAttributes } from './CharacterAttributes.js';
import { modelStatsToRuntime, cloneRuntimeStats } from './CharacterStats.js';
import { StatModifierEngine } from './StatModifierEngine.js';
import type {
  CharacterAttributes,
  CharacterRuntimeSnapshot,
  ModifierSourceType,
  RuntimeStats,
  StatModifier,
} from './types.js';

const log = childLogger('CharacterRuntime');

export class CharacterRuntime {
  private readonly modEngine = new StatModifierEngine();

  private _modifiers: StatModifier[] = [];
  private _baseStats: RuntimeStats;
  private _computedStats: RuntimeStats;
  private _attributes: CharacterAttributes;

  private _activeSkillIds: string[] = [];
  private _passiveSkillIds: string[] = [];
  private _ultimateSkillIds: string[] = [];
  private _comboSkillIds: string[] = [];

  private _cooldowns: Map<string, number> = new Map();

  private _transformationId: string | undefined = undefined;
  private _isTransformed = false;

  constructor(private readonly profile: CharacterProfile) {
    this._baseStats = modelStatsToRuntime(profile.stats);
    this._computedStats = cloneRuntimeStats(this._baseStats);
    this._attributes = computeAttributes(this._computedStats);
    log.debug('CharacterRuntime created', { characterId: profile.characterId });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Identity
  // ──────────────────────────────────────────────────────────────────────────

  get characterId(): string {
    return this.profile.characterId;
  }

  get userId(): string {
    return this.profile.userId;
  }

  get discordId(): string {
    return this.profile.discordId;
  }

  get name(): string {
    return this.profile.name;
  }

  get classId(): string {
    return this.profile.classId;
  }

  get level(): number {
    return this.profile.level;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Stats
  // ──────────────────────────────────────────────────────────────────────────

  get baseStats(): Readonly<RuntimeStats> {
    return this._baseStats;
  }

  get computedStats(): Readonly<RuntimeStats> {
    return this._computedStats;
  }

  get attributes(): Readonly<CharacterAttributes> {
    return this._attributes;
  }

  get modifiers(): ReadonlyArray<StatModifier> {
    return this._modifiers;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Stat modifier management
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Add or replace a stat modifier and recompute all stats.
   */
  addModifier(modifier: StatModifier): void {
    this._modifiers = this.modEngine.add(this._modifiers, modifier);
    this.recompute();
    log.debug('Modifier added', { id: modifier.id, stat: modifier.stat });
  }

  /**
   * Remove a modifier by ID and recompute.
   */
  removeModifier(modifierId: string): void {
    this._modifiers = this.modEngine.remove(this._modifiers, modifierId);
    this.recompute();
  }

  /**
   * Remove all modifiers from a source type (e.g. clear all debuffs).
   */
  removeModifiersBySourceType(sourceType: ModifierSourceType): void {
    this._modifiers = this.modEngine.removeBySourceType(this._modifiers, sourceType);
    this.recompute();
  }

  /**
   * Remove all modifiers from a specific source (e.g. an item was unequipped).
   */
  removeModifiersBySource(source: string): void {
    this._modifiers = this.modEngine.removeBySource(this._modifiers, source);
    this.recompute();
  }

  /**
   * Tick all timed modifiers down by one round. Expired modifiers are removed.
   */
  tickModifiers(): void {
    const before = this._modifiers.length;
    this._modifiers = this.modEngine.tick(this._modifiers);
    if (this._modifiers.length !== before) {
      this.recompute();
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Resource management
  // ──────────────────────────────────────────────────────────────────────────

  /** Spend energy. Returns false if insufficient energy. */
  spendEnergy(amount: number): boolean {
    if (this._computedStats.energy < amount) return false;
    this._computedStats = { ...this._computedStats, energy: this._computedStats.energy - amount };
    return true;
  }

  /** Restore energy, capped at maxEnergy. */
  restoreEnergy(amount: number): void {
    this._computedStats = {
      ...this._computedStats,
      energy: Math.min(this._computedStats.maxEnergy, this._computedStats.energy + amount),
    };
  }

  /** Apply damage to HP. Returns actual damage taken (after 0 floor). */
  takeDamage(amount: number): number {
    const actual = Math.max(0, Math.min(amount, this._computedStats.hp));
    this._computedStats = { ...this._computedStats, hp: this._computedStats.hp - actual };
    return actual;
  }

  /** Restore HP, capped at maxHp. */
  heal(amount: number): number {
    const canHeal = this._computedStats.maxHp - this._computedStats.hp;
    const actual = Math.min(amount, canHeal);
    if (actual > 0) {
      this._computedStats = { ...this._computedStats, hp: this._computedStats.hp + actual };
    }
    return actual;
  }

  /** Spend stamina. Returns false if insufficient. */
  spendStamina(amount: number): boolean {
    if (this._computedStats.stamina < amount) return false;
    this._computedStats = {
      ...this._computedStats,
      stamina: this._computedStats.stamina - amount,
    };
    return true;
  }

  get isAlive(): boolean {
    return this._computedStats.hp > 0;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Skill loadout
  // ──────────────────────────────────────────────────────────────────────────

  setSkillLoadout(
    activeIds: string[],
    passiveIds: string[],
    ultimateIds: string[],
    comboIds: string[] = [],
  ): void {
    this._activeSkillIds = [...activeIds];
    this._passiveSkillIds = [...passiveIds];
    this._ultimateSkillIds = [...ultimateIds];
    this._comboSkillIds = [...comboIds];
  }

  get activeSkillIds(): ReadonlyArray<string> {
    return this._activeSkillIds;
  }

  get passiveSkillIds(): ReadonlyArray<string> {
    return this._passiveSkillIds;
  }

  get ultimateSkillIds(): ReadonlyArray<string> {
    return this._ultimateSkillIds;
  }

  get comboSkillIds(): ReadonlyArray<string> {
    return this._comboSkillIds;
  }

  addComboSkill(skillId: string): void {
    if (!this._comboSkillIds.includes(skillId)) {
      this._comboSkillIds = [...this._comboSkillIds, skillId];
    }
  }

  clearComboSkills(): void {
    this._comboSkillIds = [];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Cooldown management
  // ──────────────────────────────────────────────────────────────────────────

  /** Set cooldown for a skill (expires at given round number, inclusive). */
  setCooldown(skillId: string, expiresAtRound: number): void {
    this._cooldowns.set(skillId, expiresAtRound);
  }

  /** Returns true if the skill is on cooldown at the given round. */
  isOnCooldown(skillId: string, currentRound: number): boolean {
    const expiry = this._cooldowns.get(skillId);
    return expiry !== undefined && expiry >= currentRound;
  }

  /** Returns rounds remaining on cooldown, or 0 if not on cooldown. */
  cooldownRemaining(skillId: string, currentRound: number): number {
    const expiry = this._cooldowns.get(skillId);
    if (expiry === undefined || expiry < currentRound) return 0;
    return expiry - currentRound + 1;
  }

  /** Advance all cooldowns — removes entries that have expired. */
  tickCooldowns(currentRound: number): void {
    for (const [skillId, expiry] of this._cooldowns) {
      if (expiry < currentRound) {
        this._cooldowns.delete(skillId);
      }
    }
  }

  get cooldowns(): ReadonlyMap<string, number> {
    return this._cooldowns;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Transformation
  // ──────────────────────────────────────────────────────────────────────────

  enterTransformation(transformationId: string): void {
    this._transformationId = transformationId;
    this._isTransformed = true;
    log.debug('Transformation entered', { characterId: this.characterId, transformationId });
  }

  exitTransformation(): void {
    if (!this._isTransformed) return;
    if (this._transformationId) {
      this.removeModifiersBySource(this._transformationId);
    }
    this._transformationId = undefined;
    this._isTransformed = false;
    log.debug('Transformation exited', { characterId: this.characterId });
  }

  get isTransformed(): boolean {
    return this._isTransformed;
  }

  get transformationId(): string | undefined {
    return this._transformationId;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Snapshot
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Produce an immutable snapshot of the current runtime state.
   * Suitable for serialisation, logging, or passing to pure functions.
   */
  snapshot(): CharacterRuntimeSnapshot {
    return {
      characterId: this.characterId,
      userId: this.userId,
      discordId: this.discordId,
      name: this.name,
      classId: this.classId,
      level: this.level,
      baseStats: cloneRuntimeStats(this._baseStats),
      computedStats: cloneRuntimeStats(this._computedStats),
      modifiers: [...this._modifiers],
      attributes: { ...this._attributes },
      activeSkillIds: [...this._activeSkillIds],
      passiveSkillIds: [...this._passiveSkillIds],
      ultimateSkillIds: [...this._ultimateSkillIds],
      comboSkillIds: [...this._comboSkillIds],
      cooldowns: new Map(this._cooldowns),
      transformationId: this._transformationId,
      isTransformed: this._isTransformed,
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Internal
  // ──────────────────────────────────────────────────────────────────────────

  private recompute(): void {
    // Recompute from base + current modifiers, preserving current HP/energy/stamina
    const recomputed = this.modEngine.compute(this._baseStats, this._modifiers);

    // Preserve current resource levels (don't reset HP to max on modifier change)
    this._computedStats = {
      ...recomputed,
      hp: Math.min(this._computedStats.hp, recomputed.maxHp),
      energy: Math.min(this._computedStats.energy, recomputed.maxEnergy),
      stamina: Math.min(this._computedStats.stamina, recomputed.maxStamina),
    };

    this._attributes = computeAttributes(this._computedStats);
  }
}
