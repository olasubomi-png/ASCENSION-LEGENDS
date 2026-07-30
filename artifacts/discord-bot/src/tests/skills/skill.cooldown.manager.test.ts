import { SkillCooldownManager } from '../../skills/SkillCooldownManager.js';

describe('SkillCooldownManager', () => {
  let manager: SkillCooldownManager;

  beforeEach(() => {
    manager = new SkillCooldownManager();
  });

  describe('set', () => {
    it('sets a cooldown using the skill definition', () => {
      manager.set('vanguard_shield_bash', 3); // cooldown 3 → expires after round 6
      expect(manager.isOnCooldown('vanguard_shield_bash', 4)).toBe(true);
      expect(manager.isOnCooldown('vanguard_shield_bash', 6)).toBe(true);
      expect(manager.isOnCooldown('vanguard_shield_bash', 7)).toBe(false);
    });

    it('does nothing for skills with 0 cooldown', () => {
      manager.set('basic_attack', 1);
      expect(manager.isOnCooldown('basic_attack', 1)).toBe(false);
    });

    it('does nothing for unknown skills', () => {
      manager.set('no_such_skill', 1);
      expect(manager.isOnCooldown('no_such_skill', 1)).toBe(false);
    });
  });

  describe('setRaw', () => {
    it('directly sets expiry round', () => {
      manager.setRaw('some_skill', 10);
      expect(manager.isOnCooldown('some_skill', 10)).toBe(true);
      expect(manager.isOnCooldown('some_skill', 11)).toBe(false);
    });
  });

  describe('roundsRemaining', () => {
    it('returns correct rounds remaining', () => {
      manager.setRaw('skill_x', 8);
      expect(manager.roundsRemaining('skill_x', 5)).toBe(4); // 8 - 5 + 1
      expect(manager.roundsRemaining('skill_x', 8)).toBe(1);
      expect(manager.roundsRemaining('skill_x', 9)).toBe(0);
    });

    it('returns 0 when not on cooldown', () => {
      expect(manager.roundsRemaining('skill_x', 1)).toBe(0);
    });
  });

  describe('availableOnRound', () => {
    it('returns the first round the skill is available', () => {
      manager.setRaw('skill_x', 5);
      expect(manager.availableOnRound('skill_x', 3)).toBe(6);
    });

    it('returns current round when not on cooldown', () => {
      expect(manager.availableOnRound('skill_x', 5)).toBe(5);
    });
  });

  describe('advance', () => {
    it('prunes expired cooldowns', () => {
      manager.setRaw('skill_a', 3);
      manager.setRaw('skill_b', 10);
      manager.advance(6);
      expect(manager.isOnCooldown('skill_a', 6)).toBe(false);
      expect(manager.isOnCooldown('skill_b', 6)).toBe(true);
    });
  });

  describe('clear', () => {
    it('clears a specific skill cooldown', () => {
      manager.setRaw('skill_a', 20);
      manager.clear('skill_a');
      expect(manager.isOnCooldown('skill_a', 5)).toBe(false);
    });
  });

  describe('clearAll', () => {
    it('clears all cooldowns', () => {
      manager.setRaw('skill_a', 10);
      manager.setRaw('skill_b', 20);
      manager.clearAll();
      expect(manager.getOnCooldown(1)).toHaveLength(0);
    });
  });

  describe('reduceAll', () => {
    it('reduces all active cooldowns', () => {
      manager.setRaw('skill_a', 8);
      manager.setRaw('skill_b', 5);
      manager.reduceAll(3, 1);
      // skill_a: 8 - 3 = 5, still active at round 4
      expect(manager.isOnCooldown('skill_a', 4)).toBe(true);
      expect(manager.isOnCooldown('skill_a', 6)).toBe(false);
      // skill_b: 5 - 3 = 2, already expired at round 3
      expect(manager.isOnCooldown('skill_b', 3)).toBe(false);
    });
  });

  describe('snapshot / restore', () => {
    it('round-trips correctly', () => {
      manager.setRaw('skill_a', 5);
      manager.setRaw('skill_b', 10);
      const snap = manager.snapshot();

      const newManager = new SkillCooldownManager();
      newManager.restore(snap);

      expect(newManager.isOnCooldown('skill_a', 3)).toBe(true);
      expect(newManager.isOnCooldown('skill_b', 8)).toBe(true);
    });
  });

  describe('getOnCooldown', () => {
    it('returns only skills currently on cooldown', () => {
      manager.setRaw('skill_a', 5);
      manager.setRaw('skill_b', 10);
      manager.setRaw('skill_c', 2);
      const active = manager.getOnCooldown(4); // skill_c expired
      expect(active).toContain('skill_a');
      expect(active).toContain('skill_b');
      expect(active).not.toContain('skill_c');
    });
  });
});
