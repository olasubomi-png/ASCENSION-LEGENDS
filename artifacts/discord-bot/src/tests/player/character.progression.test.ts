import { CharacterProgression, statGainsForLevel, applyStatGains } from '../../player/CharacterProgression.js';
import type { RuntimeStats } from '../../player/types.js';

function baseStats(): RuntimeStats {
  return {
    hp: 700, maxHp: 700, energy: 100, maxEnergy: 100,
    attack: 85, defense: 110, magic: 35, magicDefense: 60,
    speed: 55, luck: 10, accuracy: 85, evasion: 10,
    critChance: 5, critDamage: 150, stamina: 100, maxStamina: 100,
  };
}

describe('CharacterProgression', () => {
  let prog: CharacterProgression;

  beforeEach(() => {
    prog = new CharacterProgression();
  });

  describe('xpToNextLevel', () => {
    it('returns a positive value for level 1', () => {
      expect(prog.xpToNextLevel(1)).toBeGreaterThan(0);
    });

    it('increases with level', () => {
      expect(prog.xpToNextLevel(10)).toBeGreaterThan(prog.xpToNextLevel(5));
      expect(prog.xpToNextLevel(50)).toBeGreaterThan(prog.xpToNextLevel(30));
    });

    it('uses tier modifier for levels > 75', () => {
      const lvl75 = prog.xpToNextLevel(75);
      const lvl76 = prog.xpToNextLevel(76);
      expect(lvl76).toBeGreaterThan(lvl75);
    });
  });

  describe('xpToReachLevel', () => {
    it('returns 0 when already at target', () => {
      expect(prog.xpToReachLevel(10, 10)).toBe(0);
    });

    it('accumulates xp across levels', () => {
      const total = prog.xpToReachLevel(1, 3);
      expect(total).toBe(prog.xpToNextLevel(1) + prog.xpToNextLevel(2));
    });
  });

  describe('awardExperience', () => {
    it('does not level up if xp is insufficient', () => {
      const { result } = prog.awardExperience(1, 0, baseStats(), 'vanguard', 10);
      expect(result.didLevelUp).toBe(false);
      expect(result.levelUps).toHaveLength(0);
      expect(result.newExperience).toBe(10);
    });

    it('levels up once when enough xp is awarded', () => {
      const needed = prog.xpToNextLevel(1);
      const { result, newStats } = prog.awardExperience(1, 0, baseStats(), 'vanguard', needed);
      expect(result.didLevelUp).toBe(true);
      expect(result.levelUps).toHaveLength(1);
      expect(result.levelUps[0]?.newLevel).toBe(2);
      expect(newStats.maxHp).toBeGreaterThan(700); // stat growth applied
    });

    it('levels up multiple times with large xp award', () => {
      const needed = prog.xpToReachLevel(1, 5);
      const { result } = prog.awardExperience(1, 0, baseStats(), 'vanguard', needed);
      expect(result.didLevelUp).toBe(true);
      expect(result.levelUps.length).toBeGreaterThanOrEqual(4);
    });

    it('awards stat points and skill points on level-up', () => {
      const needed = prog.xpToNextLevel(1);
      const { result } = prog.awardExperience(1, 0, baseStats(), 'invoker', needed);
      expect(result.levelUps[0]?.statPointsGained).toBeGreaterThan(0);
      expect(result.levelUps[0]?.skillPointsGained).toBeGreaterThan(0);
    });

    it('does not exceed max level 100', () => {
      const { result } = prog.awardExperience(100, 0, baseStats(), 'wanderer', 999999999);
      expect(result.didLevelUp).toBe(false);
    });

    it('carries over remaining xp after level-up', () => {
      const needed = prog.xpToNextLevel(1);
      const { result } = prog.awardExperience(1, 0, baseStats(), 'vanguard', needed + 50);
      expect(result.newExperience).toBe(50);
    });

    it('applies class-specific stat growth', () => {
      const needed = prog.xpToNextLevel(1);
      const { newStats: vanguardStats } = prog.awardExperience(1, 0, baseStats(), 'vanguard', needed);
      const { newStats: invokerStats } = prog.awardExperience(1, 0, baseStats(), 'invoker', needed);
      // Vanguard gets more HP, Invoker gets more magic
      expect(vanguardStats.maxHp).toBeGreaterThan(invokerStats.maxHp);
      expect(invokerStats.magic).toBeGreaterThan(vanguardStats.magic);
    });
  });

  describe('startingStats', () => {
    it('returns stats for vanguard', () => {
      const stats = prog.startingStats('vanguard');
      expect(stats).not.toBeNull();
      expect(stats!.maxHp).toBeGreaterThan(0);
    });

    it('returns null for unknown class', () => {
      expect(prog.startingStats('unknown_class')).toBeNull();
    });

    it('includes stamina field', () => {
      const stats = prog.startingStats('invoker');
      expect(stats!.stamina).toBe(100);
    });
  });

  describe('statGainsForLevel', () => {
    it('returns positive gains for level 1 vanguard', () => {
      const gains = statGainsForLevel(1, 'vanguard');
      expect(gains.maxHp).toBeGreaterThan(0);
      expect(gains.attack).toBeGreaterThan(0);
    });

    it('scales with level', () => {
      const lowGains = statGainsForLevel(1, 'vanguard');
      const highGains = statGainsForLevel(50, 'vanguard');
      expect(highGains.maxHp!).toBeGreaterThan(lowGains.maxHp!);
    });

    it('gives vanguard more HP than invoker', () => {
      const vg = statGainsForLevel(1, 'vanguard');
      const inv = statGainsForLevel(1, 'invoker');
      expect(vg.maxHp!).toBeGreaterThan(inv.maxHp!);
    });
  });

  describe('applyStatGains', () => {
    it('applies gains to stats', () => {
      const gains = { maxHp: 20, attack: 5 };
      const result = applyStatGains(baseStats(), gains);
      expect(result.maxHp).toBe(720);
      expect(result.attack).toBe(90);
    });

    it('resets hp/energy/stamina to max after level-up', () => {
      const depleted = { ...baseStats(), hp: 100, energy: 10, stamina: 20 };
      const result = applyStatGains(depleted, { maxHp: 50 });
      expect(result.hp).toBe(result.maxHp);
      expect(result.energy).toBe(result.maxEnergy);
      expect(result.stamina).toBe(result.maxStamina);
    });
  });
});
