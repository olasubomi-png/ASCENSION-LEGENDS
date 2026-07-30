import type { RuntimeStats } from '../../player/types.js';
import { ComboEngine } from '../../skills/ComboEngine.js';
import { SkillCooldownManager } from '../../skills/SkillCooldownManager.js';
import { SkillExecutor } from '../../skills/SkillExecutor.js';
import type { SkillExecutorInput } from '../../skills/SkillExecutor.js';

function actorStats(overrides: Partial<RuntimeStats> = {}): RuntimeStats {
  return {
    hp: 700, maxHp: 700, energy: 200, maxEnergy: 200,
    attack: 100, defense: 80, magic: 60, magicDefense: 60,
    speed: 70, accuracy: 85, evasion: 10,
    critChance: 0, critDamage: 150, luck: 10,
    stamina: 100, maxStamina: 100,
    ...overrides,
  };
}

function targetStats(overrides: Partial<RuntimeStats> = {}): RuntimeStats {
  return {
    hp: 500, maxHp: 500, energy: 100, maxEnergy: 100,
    attack: 60, defense: 50, magic: 40, magicDefense: 50,
    speed: 50, accuracy: 85, evasion: 5,
    critChance: 0, critDamage: 150, luck: 5,
    stamina: 100, maxStamina: 100,
    ...overrides,
  };
}

function makeInput(overrides: Partial<SkillExecutorInput> = {}): SkillExecutorInput {
  const cooldownManager = new SkillCooldownManager();
  const comboEngine = new ComboEngine();

  const pStats = new Map<string, RuntimeStats>();
  pStats.set('actor_1', actorStats());
  pStats.set('enemy_1', targetStats());

  return {
    ctx: {
      actorId: 'actor_1',
      targetIds: ['enemy_1'],
      skillId: 'basic_attack',
      round: 1,
      ultimateGauge: 0,
      activeComboChain: [],
    },
    actorStats: actorStats(),
    actorLevel: 10,
    actorClassId: 'vanguard',
    actorTransformationId: undefined,
    isTransformed: false,
    actorStamina: 100,
    ultimateGauge: 0,
    cooldownManager,
    comboEngine,
    encounterContext: {
      allParticipantIds: ['actor_1', 'enemy_1'],
      aliveIds: ['actor_1', 'enemy_1'],
      allyIds: ['actor_1'],
      enemyIds: ['enemy_1'],
      requestedTargetId: 'enemy_1',
    },
    participantStats: pStats,
    random: 0.5,
    ...overrides,
  };
}

describe('SkillExecutor', () => {
  let executor: SkillExecutor;

  beforeEach(() => {
    executor = new SkillExecutor();
  });

  describe('basic_attack', () => {
    it('executes successfully', () => {
      const result = executor.execute(makeInput());
      expect(result.ok).toBe(true);
    });

    it('returns damage effect', () => {
      const result = executor.execute(makeInput());
      if (!result.ok) throw new Error(result.reason);
      expect(result.appliedEffects.some((e) => e.type === 'damage')).toBe(true);
    });

    it('energy remaining reflects 0 cost of basic_attack', () => {
      const result = executor.execute(makeInput());
      if (!result.ok) throw new Error(result.reason);
      expect(result.energyRemaining).toBe(200);
    });
  });

  describe('vanguard_shield_bash', () => {
    it('executes for vanguard with sufficient energy', () => {
      const input = makeInput({
        ctx: {
          actorId: 'actor_1', targetIds: ['enemy_1'],
          skillId: 'vanguard_shield_bash', round: 1,
          ultimateGauge: 0, activeComboChain: [],
        },
        actorClassId: 'vanguard',
      });
      const result = executor.execute(input);
      expect(result.ok).toBe(true);
    });

    it('fails for wrong class', () => {
      const input = makeInput({
        ctx: {
          actorId: 'actor_1', targetIds: ['enemy_1'],
          skillId: 'vanguard_shield_bash', round: 1,
          ultimateGauge: 0, activeComboChain: [],
        },
        actorClassId: 'invoker',
      });
      const result = executor.execute(input);
      expect(result.ok).toBe(false);
    });

    it('deducts energy correctly', () => {
      const input = makeInput({
        ctx: {
          actorId: 'actor_1', targetIds: ['enemy_1'],
          skillId: 'vanguard_shield_bash', round: 1,
          ultimateGauge: 0, activeComboChain: [],
        },
        actorClassId: 'vanguard',
      });
      const result = executor.execute(input);
      if (!result.ok) throw new Error(result.reason);
      expect(result.energyRemaining).toBe(175); // 200 - 25
    });

    it('sets cooldown correctly', () => {
      const input = makeInput({
        ctx: {
          actorId: 'actor_1', targetIds: ['enemy_1'],
          skillId: 'vanguard_shield_bash', round: 2,
          ultimateGauge: 0, activeComboChain: [],
        },
        actorClassId: 'vanguard',
      });
      const result = executor.execute(input);
      if (!result.ok) throw new Error(result.reason);
      // cooldown 3, used on round 2 → expires after round 5
      expect(result.cooldownUntilRound).toBe(5);
    });
  });

  describe('invoker_frost_nova (AoE)', () => {
    it('targets all enemies', () => {
      const pStats = new Map<string, RuntimeStats>();
      pStats.set('actor_1', actorStats());
      pStats.set('enemy_1', targetStats());
      pStats.set('enemy_2', targetStats());

      const input = makeInput({
        ctx: {
          actorId: 'actor_1', targetIds: ['enemy_1', 'enemy_2'],
          skillId: 'invoker_frost_nova', round: 1,
          ultimateGauge: 0, activeComboChain: [],
        },
        actorClassId: 'invoker',
        participantStats: pStats,
        encounterContext: {
          allParticipantIds: ['actor_1', 'enemy_1', 'enemy_2'],
          aliveIds: ['actor_1', 'enemy_1', 'enemy_2'],
          allyIds: ['actor_1'],
          enemyIds: ['enemy_1', 'enemy_2'],
        },
      });

      const result = executor.execute(input);
      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error(result.reason);
      const targetIds = new Set(result.appliedEffects.map((e) => e.targetId));
      expect(targetIds.has('enemy_1')).toBe(true);
      expect(targetIds.has('enemy_2')).toBe(true);
    });
  });

  describe('ultimate skill', () => {
    it('rejects ultimate when gauge is insufficient', () => {
      const input = makeInput({
        ctx: {
          actorId: 'actor_1', targetIds: ['enemy_1'],
          skillId: 'vanguard_unbreakable_fortress', round: 1,
          ultimateGauge: 50, activeComboChain: [],
        },
        actorClassId: 'vanguard',
        ultimateGauge: 50,
      });
      const result = executor.execute(input);
      expect(result.ok).toBe(false);
    });

    it('executes ultimate when gauge is full', () => {
      const input = makeInput({
        ctx: {
          actorId: 'actor_1', targetIds: [],
          skillId: 'vanguard_unbreakable_fortress', round: 1,
          ultimateGauge: 100, activeComboChain: [],
        },
        actorClassId: 'vanguard',
        ultimateGauge: 100,
        encounterContext: {
          allParticipantIds: ['actor_1', 'enemy_1'],
          aliveIds: ['actor_1', 'enemy_1'],
          allyIds: ['actor_1'],
          enemyIds: ['enemy_1'],
        },
      });
      const result = executor.execute(input);
      expect(result.ok).toBe(true);
    });
  });

  describe('combo skill', () => {
    it('rejects combo skill without prerequisite', () => {
      const input = makeInput({
        ctx: {
          actorId: 'actor_1', targetIds: ['enemy_1'],
          skillId: 'combo_finisher', round: 1,
          ultimateGauge: 0, activeComboChain: [],
        },
      });
      const result = executor.execute(input);
      expect(result.ok).toBe(false);
      expect(result.ok === false && result.reason).toMatch(/prerequisites/);
    });

    it('allows combo skill when prerequisite is in chain', () => {
      const comboEngine = new ComboEngine();
      comboEngine.recordSkillUse('actor_1', 'basic_attack', 1);

      const input = makeInput({
        ctx: {
          actorId: 'actor_1', targetIds: ['enemy_1'],
          skillId: 'combo_finisher', round: 1,
          ultimateGauge: 0, activeComboChain: ['basic_attack'],
        },
        comboEngine,
      });
      const result = executor.execute(input);
      expect(result.ok).toBe(true);
    });
  });

  describe('unknown skill', () => {
    it('returns error for unknown skill ID', () => {
      const input = makeInput({
        ctx: {
          actorId: 'actor_1', targetIds: ['enemy_1'],
          skillId: 'no_such_skill', round: 1,
          ultimateGauge: 0, activeComboChain: [],
        },
      });
      const result = executor.execute(input);
      expect(result.ok).toBe(false);
    });
  });

  describe('heal skill (healing_potion)', () => {
    it('returns a heal effect targeting self', () => {
      const input = makeInput({
        ctx: {
          actorId: 'actor_1', targetIds: [],
          skillId: 'healing_potion', round: 1,
          ultimateGauge: 0, activeComboChain: [],
        },
        encounterContext: {
          allParticipantIds: ['actor_1', 'enemy_1'],
          aliveIds: ['actor_1', 'enemy_1'],
          allyIds: ['actor_1'],
          enemyIds: ['enemy_1'],
        },
      });
      const result = executor.execute(input);
      expect(result.ok).toBe(true);
      if (!result.ok) throw new Error(result.reason);
      expect(result.appliedEffects.some((e) => e.type === 'heal')).toBe(true);
    });
  });
});
