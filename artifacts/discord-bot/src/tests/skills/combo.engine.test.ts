import { ComboEngine } from '../../skills/ComboEngine.js';

describe('ComboEngine', () => {
  let engine: ComboEngine;

  beforeEach(() => {
    engine = new ComboEngine();
  });

  describe('recordSkillUse', () => {
    it('starts a new chain on first skill use', () => {
      const state = engine.recordSkillUse('actor_1', 'basic_attack', 1);
      expect(state.chain).toEqual(['basic_attack']);
      expect(state.actorId).toBe('actor_1');
    });

    it('extends an existing chain within the window', () => {
      engine.recordSkillUse('actor_1', 'basic_attack', 1);
      const state = engine.recordSkillUse('actor_1', 'vanguard_shield_bash', 2);
      expect(state.chain).toEqual(['basic_attack', 'vanguard_shield_bash']);
    });

    it('starts a fresh chain if the window expired', () => {
      engine.recordSkillUse('actor_1', 'basic_attack', 1);
      // window expires after round 3 (1 + 2)
      const state = engine.recordSkillUse('actor_1', 'vanguard_war_cry', 10);
      expect(state.chain).toEqual(['vanguard_war_cry']);
    });

    it('populates follow-ups from the skill definition', () => {
      const state = engine.recordSkillUse('actor_1', 'wanderer_quick_strike', 1);
      expect(state.availableFollowUps).toContain('wanderer_ambush');
      expect(state.availableFollowUps).toContain('combo_finisher');
    });

    it('tracks separate chains per actor', () => {
      engine.recordSkillUse('actor_1', 'basic_attack', 1);
      engine.recordSkillUse('actor_2', 'invoker_flame_bolt', 1);
      expect(engine.getChain('actor_1', 1)).toEqual(['basic_attack']);
      expect(engine.getChain('actor_2', 1)).toEqual(['invoker_flame_bolt']);
    });
  });

  describe('getState', () => {
    it('returns state within the window', () => {
      engine.recordSkillUse('actor_1', 'basic_attack', 1);
      expect(engine.getState('actor_1', 2)).not.toBeNull();
      expect(engine.getState('actor_1', 3)).not.toBeNull();
    });

    it('returns null after window expires', () => {
      engine.recordSkillUse('actor_1', 'basic_attack', 1);
      expect(engine.getState('actor_1', 4)).toBeNull();
    });

    it('returns null when no chain exists', () => {
      expect(engine.getState('actor_1', 1)).toBeNull();
    });
  });

  describe('chainLength', () => {
    it('returns 0 when no chain', () => {
      expect(engine.chainLength('actor_1', 1)).toBe(0);
    });

    it('returns correct length', () => {
      engine.recordSkillUse('actor_1', 'basic_attack', 1);
      engine.recordSkillUse('actor_1', 'wanderer_quick_strike', 2);
      expect(engine.chainLength('actor_1', 2)).toBe(2);
    });
  });

  describe('isValidFollowUp', () => {
    it('returns true for a valid follow-up', () => {
      engine.recordSkillUse('actor_1', 'basic_attack', 1);
      expect(engine.isValidFollowUp('actor_1', 'combo_finisher', 1)).toBe(true);
    });

    it('returns false for an invalid follow-up', () => {
      engine.recordSkillUse('actor_1', 'basic_attack', 1);
      expect(engine.isValidFollowUp('actor_1', 'invoker_cataclysm', 1)).toBe(false);
    });

    it('returns false when chain expired', () => {
      engine.recordSkillUse('actor_1', 'basic_attack', 1);
      expect(engine.isValidFollowUp('actor_1', 'combo_finisher', 10)).toBe(false);
    });
  });

  describe('comboBonusMultiplier', () => {
    it('returns 1.0 for chain of 1', () => {
      expect(engine.comboBonusMultiplier(1)).toBe(1.0);
    });

    it('returns 1.05 for chain of 2', () => {
      expect(engine.comboBonusMultiplier(2)).toBe(1.05);
    });

    it('returns 1.10 for chain of 3', () => {
      expect(engine.comboBonusMultiplier(3)).toBe(1.10);
    });

    it('returns 1.20 for chain of 5', () => {
      expect(engine.comboBonusMultiplier(5)).toBe(1.20);
    });

    it('returns 1.30 for chain of 7+', () => {
      expect(engine.comboBonusMultiplier(7)).toBe(1.30);
      expect(engine.comboBonusMultiplier(10)).toBe(1.30);
    });
  });

  describe('advance', () => {
    it('prunes expired chains on advance', () => {
      engine.recordSkillUse('actor_1', 'basic_attack', 1);
      engine.recordSkillUse('actor_2', 'basic_attack', 5);
      engine.advance(5); // actor_1 chain expires (1 + 2 = 3 < 5)
      expect(engine.getState('actor_1', 5)).toBeNull();
      expect(engine.getState('actor_2', 5)).not.toBeNull();
    });
  });

  describe('reset', () => {
    it('resets chain for a specific actor', () => {
      engine.recordSkillUse('actor_1', 'basic_attack', 1);
      engine.reset('actor_1');
      expect(engine.getState('actor_1', 1)).toBeNull();
    });

    it('resetAll clears all chains', () => {
      engine.recordSkillUse('actor_1', 'basic_attack', 1);
      engine.recordSkillUse('actor_2', 'basic_attack', 1);
      engine.resetAll();
      expect(engine.getAllActiveStates(1)).toHaveLength(0);
    });
  });

  describe('getUnlockedFollowUps', () => {
    it('returns follow-up IDs for a skill with them', () => {
      const followUps = engine.getUnlockedFollowUps('basic_attack', []);
      expect(followUps).toContain('combo_finisher');
    });

    it('returns empty array for skills with no follow-ups', () => {
      const followUps = engine.getUnlockedFollowUps('healing_potion', []);
      expect(followUps).toHaveLength(0);
    });
  });
});
