import { modelStatsToRuntime } from '../../player/CharacterStats.js';
import { StatModifierEngine } from '../../player/StatModifierEngine.js';
import type { RuntimeStats, StatModifier } from '../../player/types.js';

function baseStats(): RuntimeStats {
  return {
    hp: 500,
    maxHp: 500,
    energy: 100,
    maxEnergy: 100,
    attack: 100,
    defense: 80,
    magic: 60,
    magicDefense: 60,
    speed: 70,
    accuracy: 85,
    evasion: 10,
    critChance: 5,
    critDamage: 150,
    luck: 10,
    stamina: 100,
    maxStamina: 100,
  };
}

function mod(overrides: Partial<StatModifier>): StatModifier {
  return {
    id: 'test_mod',
    source: 'test',
    sourceType: 'equipment',
    stat: 'attack',
    valueType: 'flat',
    value: 0,
    ...overrides,
  };
}

describe('StatModifierEngine', () => {
  let engine: StatModifierEngine;

  beforeEach(() => {
    engine = new StatModifierEngine();
  });

  describe('compute', () => {
    it('returns base stats when no modifiers', () => {
      const base = baseStats();
      const result = engine.compute(base, []);
      expect(result.attack).toBe(100);
      expect(result.defense).toBe(80);
    });

    it('applies flat modifier correctly', () => {
      const base = baseStats();
      const modifiers = [mod({ id: 'm1', stat: 'attack', valueType: 'flat', value: 50 })];
      const result = engine.compute(base, modifiers);
      expect(result.attack).toBe(150);
    });

    it('applies percent modifier on top of base', () => {
      const base = baseStats();
      const modifiers = [mod({ id: 'm1', stat: 'attack', valueType: 'percent', value: 20 })];
      const result = engine.compute(base, modifiers);
      expect(result.attack).toBe(120); // 100 * 1.2
    });

    it('applies flat before percent', () => {
      const base = baseStats();
      const modifiers = [
        mod({ id: 'm1', stat: 'attack', valueType: 'flat', value: 100 }),
        mod({ id: 'm2', stat: 'attack', valueType: 'percent', value: 50 }),
      ];
      const result = engine.compute(base, modifiers);
      // (100 + 100) * 1.5 = 300
      expect(result.attack).toBe(300);
    });

    it('stacks multiple percent modifiers additively', () => {
      const base = baseStats();
      const modifiers = [
        mod({ id: 'm1', stat: 'attack', valueType: 'percent', value: 10 }),
        mod({ id: 'm2', stat: 'attack', valueType: 'percent', value: 20 }),
      ];
      const result = engine.compute(base, modifiers);
      // 100 * (1 + 0.10 + 0.20) = 130
      expect(result.attack).toBe(130);
    });

    it('clamps critChance to 75%', () => {
      const base = baseStats();
      const modifiers = [mod({ id: 'm1', stat: 'critChance', valueType: 'flat', value: 100 })];
      const result = engine.compute(base, modifiers);
      expect(result.critChance).toBe(75);
    });

    it('clamps evasion to 90%', () => {
      const base = baseStats();
      const modifiers = [mod({ id: 'm1', stat: 'evasion', valueType: 'flat', value: 200 })];
      const result = engine.compute(base, modifiers);
      expect(result.evasion).toBe(90);
    });

    it('clamps hp to maxHp', () => {
      const base = { ...baseStats(), hp: 400 };
      // Reduce maxHp below current hp
      const modifiers = [mod({ id: 'm1', stat: 'maxHp', valueType: 'flat', value: -200 })];
      const result = engine.compute(base, modifiers);
      expect(result.hp).toBeLessThanOrEqual(result.maxHp);
    });

    it('applies negative flat modifier (debuff)', () => {
      const base = baseStats();
      const modifiers = [mod({ id: 'm1', stat: 'defense', valueType: 'flat', value: -30 })];
      const result = engine.compute(base, modifiers);
      expect(result.defense).toBe(50);
    });

    it('clamps defense to minimum 0', () => {
      const base = baseStats();
      const modifiers = [mod({ id: 'm1', stat: 'defense', valueType: 'flat', value: -999 })];
      const result = engine.compute(base, modifiers);
      expect(result.defense).toBe(0);
    });
  });

  describe('add / remove', () => {
    it('adds a modifier', () => {
      const m = mod({ id: 'eq1' });
      const result = engine.add([], m);
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('eq1');
    });

    it('replaces existing modifier with same ID', () => {
      const m1 = mod({ id: 'eq1', value: 10 });
      const m2 = mod({ id: 'eq1', value: 20 });
      const result = engine.add([m1], m2);
      expect(result).toHaveLength(1);
      expect(result[0]?.value).toBe(20);
    });

    it('removes a modifier by ID', () => {
      const m1 = mod({ id: 'eq1' });
      const m2 = mod({ id: 'eq2' });
      const result = engine.remove([m1, m2], 'eq1');
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('eq2');
    });

    it('removeBySourceType removes matching modifiers', () => {
      const m1 = mod({ id: 'eq1', sourceType: 'equipment' });
      const m2 = mod({ id: 'b1', sourceType: 'buff' });
      const result = engine.removeBySourceType([m1, m2], 'equipment');
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe('b1');
    });

    it('removeBySource removes modifiers from a specific source', () => {
      const m1 = mod({ id: 'eq1', source: 'sword_of_doom' });
      const m2 = mod({ id: 'eq2', source: 'iron_shield' });
      const result = engine.removeBySource([m1, m2], 'sword_of_doom');
      expect(result).toHaveLength(1);
    });
  });

  describe('tick', () => {
    it('reduces duration by 1 each tick', () => {
      const m = mod({ id: 'm1', duration: 3 });
      const after1 = engine.tick([m]);
      expect(after1[0]?.duration).toBe(2);
    });

    it('removes modifiers when duration reaches 0', () => {
      const m = mod({ id: 'm1', duration: 1 });
      const result = engine.tick([m]);
      expect(result).toHaveLength(0);
    });

    it('keeps permanent modifiers (undefined duration)', () => {
      const m = mod({ id: 'm1', duration: undefined });
      const result = engine.tick([m]);
      expect(result).toHaveLength(1);
    });
  });

  describe('queries', () => {
    it('totalFlatForStat sums flat modifiers for a stat', () => {
      const mods = [
        mod({ id: 'm1', stat: 'attack', valueType: 'flat', value: 30 }),
        mod({ id: 'm2', stat: 'attack', valueType: 'flat', value: 20 }),
        mod({ id: 'm3', stat: 'defense', valueType: 'flat', value: 50 }),
      ];
      expect(engine.totalFlatForStat(mods, 'attack')).toBe(50);
    });

    it('effectiveStat computes single stat correctly', () => {
      const base = baseStats();
      const mods = [mod({ id: 'm1', stat: 'attack', valueType: 'flat', value: 50 })];
      expect(engine.effectiveStat(base, mods, 'attack')).toBe(150);
    });
  });

  describe('modelStatsToRuntime round-trip', () => {
    it('maps critRate to critChance', () => {
      const modelStats = {
        hp: 700, maxHp: 700, mp: 100, maxMp: 100,
        attack: 85, defense: 110, magicAttack: 35, magicDefense: 60,
        speed: 55, luck: 10, critRate: 5, critDamage: 150, evasion: 10, accuracy: 85,
      };
      const runtime = modelStatsToRuntime(modelStats);
      expect(runtime.critChance).toBe(5);
      expect(runtime.magic).toBe(35);
      expect(runtime.energy).toBe(100);
    });
  });
});
