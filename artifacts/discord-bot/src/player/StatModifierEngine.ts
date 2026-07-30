/**
 * StatModifierEngine — applies, removes, and computes stat modifiers.
 *
 * Processing order (Book 1 §4.3):
 *  1. Start with base stats.
 *  2. Sum all FLAT modifiers per stat.
 *  3. Apply PERCENT modifiers multiplicatively on top of (base + flat).
 *  4. Clamp final values to valid ranges.
 *
 * Sources: equipment, skills, buffs, debuffs, status effects, transformations.
 */

import { clampAllStats, clampStat, cloneRuntimeStats } from './CharacterStats.js';
import type { ModifierSourceType, RuntimeStats, StatKey, StatModifier } from './types.js';

// ──────────────────────────────────────────────────────────────────────────────
// Engine
// ──────────────────────────────────────────────────────────────────────────────

export class StatModifierEngine {
  /**
   * Compute a new RuntimeStats by applying all modifiers to the base stats.
   *
   * Flat modifiers are summed per stat first; percent modifiers then
   * multiply the (base + flat) total for each stat.
   */
  compute(base: RuntimeStats, modifiers: StatModifier[]): RuntimeStats {
    const result = cloneRuntimeStats(base);

    // ── Pass 1: sum flat modifiers ──────────────────────────────────────────
    const flatDeltas = this.sumFlat(modifiers);
    const keys = Object.keys(flatDeltas) as StatKey[];
    for (const key of keys) {
      const delta = flatDeltas[key] ?? 0;
      if (delta !== 0) {
        (result as Record<StatKey, number>)[key] =
          (result as Record<StatKey, number>)[key] + delta;
      }
    }

    // ── Pass 2: apply percent modifiers multiplicatively ────────────────────
    const percentByKey = this.groupPercent(modifiers);
    for (const [key, totalPercent] of percentByKey) {
      const base = (result as Record<StatKey, number>)[key];
      (result as Record<StatKey, number>)[key] = Math.round(
        base * (1 + totalPercent / 100),
      );
    }

    return clampAllStats(result);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Modifier management
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Add a modifier to the list, replacing any existing modifier with the same ID.
   */
  add(modifiers: StatModifier[], modifier: StatModifier): StatModifier[] {
    const existing = modifiers.findIndex((m) => m.id === modifier.id);
    if (existing >= 0) {
      const updated = [...modifiers];
      updated[existing] = modifier;
      return updated;
    }
    return [...modifiers, modifier];
  }

  /**
   * Remove a modifier by its ID.
   */
  remove(modifiers: StatModifier[], modifierId: string): StatModifier[] {
    return modifiers.filter((m) => m.id !== modifierId);
  }

  /**
   * Remove all modifiers from a given source type.
   */
  removeBySourceType(
    modifiers: StatModifier[],
    sourceType: ModifierSourceType,
  ): StatModifier[] {
    return modifiers.filter((m) => m.sourceType !== sourceType);
  }

  /**
   * Remove all modifiers from a specific source (e.g. a specific item ID).
   */
  removeBySource(modifiers: StatModifier[], source: string): StatModifier[] {
    return modifiers.filter((m) => m.source !== source);
  }

  /**
   * Tick durations down by 1 and return modifiers that haven't expired.
   * Permanent modifiers (duration === undefined) are always retained.
   */
  tick(modifiers: StatModifier[]): StatModifier[] {
    return modifiers
      .map((m) => {
        if (m.duration === undefined) return m;
        return { ...m, duration: m.duration - 1 };
      })
      .filter((m) => m.duration === undefined || m.duration > 0);
  }

  /**
   * Return modifiers that expire (duration reaches 0) in the next tick.
   */
  expiring(modifiers: StatModifier[]): StatModifier[] {
    return modifiers.filter((m) => m.duration !== undefined && m.duration <= 1);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Queries
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Return all active modifiers affecting a specific stat.
   */
  forStat(modifiers: StatModifier[], stat: StatKey): StatModifier[] {
    return modifiers.filter((m) => m.stat === stat);
  }

  /**
   * Compute the total flat bonus for a single stat.
   */
  totalFlatForStat(modifiers: StatModifier[], stat: StatKey): number {
    return modifiers
      .filter((m) => m.stat === stat && m.valueType === 'flat')
      .reduce((sum, m) => sum + m.value, 0);
  }

  /**
   * Compute the total percent bonus for a single stat.
   */
  totalPercentForStat(modifiers: StatModifier[], stat: StatKey): number {
    return modifiers
      .filter((m) => m.stat === stat && m.valueType === 'percent')
      .reduce((sum, m) => sum + m.value, 0);
  }

  /**
   * Compute the effective value of one stat given base stats and all modifiers.
   */
  effectiveStat(
    base: RuntimeStats,
    modifiers: StatModifier[],
    stat: StatKey,
  ): number {
    const baseValue = (base as Record<StatKey, number>)[stat];
    const flatTotal = this.totalFlatForStat(modifiers, stat);
    const percentTotal = this.totalPercentForStat(modifiers, stat);
    const withFlat = baseValue + flatTotal;
    const withPercent = Math.round(withFlat * (1 + percentTotal / 100));
    return clampStat(stat, withPercent);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Private helpers
  // ──────────────────────────────────────────────────────────────────────────

  private sumFlat(modifiers: StatModifier[]): Partial<Record<StatKey, number>> {
    const deltas: Partial<Record<StatKey, number>> = {};
    for (const m of modifiers) {
      if (m.valueType !== 'flat') continue;
      deltas[m.stat] = (deltas[m.stat] ?? 0) + m.value;
    }
    return deltas;
  }

  private groupPercent(modifiers: StatModifier[]): Map<StatKey, number> {
    const map = new Map<StatKey, number>();
    for (const m of modifiers) {
      if (m.valueType !== 'percent') continue;
      map.set(m.stat, (map.get(m.stat) ?? 0) + m.value);
    }
    return map;
  }
}
