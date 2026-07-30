import { SkillValidator } from '../../skills/SkillValidator.js';
import type { SkillValidationContext } from '../../skills/types.js';

function baseCtx(overrides: Partial<SkillValidationContext> = {}): SkillValidationContext {
  return {
    actorId: 'actor_1',
    skillId: 'basic_attack',
    actorLevel: 10,
    actorClassId: 'vanguard',
    actorEnergy: 100,
    actorStamina: 100,
    actorTransformationId: undefined,
    isTransformed: false,
    cooldowns: new Map(),
    currentRound: 1,
    ultimateGauge: 0,
    targetIds: ['enemy_1'],
    activeComboChain: [],
    ...overrides,
  };
}

describe('SkillValidator', () => {
  let validator: SkillValidator;

  beforeEach(() => {
    validator = new SkillValidator();
  });

  it('returns invalid for unknown skill', () => {
    const result = validator.validate(baseCtx({ skillId: 'no_such_skill' }));
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/Unknown skill/);
  });

  it('passes validation for basic_attack', () => {
    const result = validator.validate(baseCtx());
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects when actor has insufficient energy', () => {
    const result = validator.validate(
      baseCtx({ skillId: 'vanguard_shield_bash', actorClassId: 'vanguard', actorEnergy: 5 }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('energy'))).toBe(true);
  });

  it('rejects when skill is on cooldown', () => {
    const cooldowns = new Map([['vanguard_shield_bash', 5]]);
    const result = validator.validate(
      baseCtx({
        skillId: 'vanguard_shield_bash',
        actorClassId: 'vanguard',
        actorEnergy: 100,
        cooldowns,
        currentRound: 3,
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('cooldown'))).toBe(true);
  });

  it('allows use when cooldown has expired', () => {
    const cooldowns = new Map([['vanguard_shield_bash', 2]]);
    const result = validator.validate(
      baseCtx({
        skillId: 'vanguard_shield_bash',
        actorClassId: 'vanguard',
        actorEnergy: 100,
        cooldowns,
        currentRound: 5, // expiry was round 2, now past
      }),
    );
    expect(result.valid).toBe(true);
  });

  it('rejects class-restricted skill for wrong class', () => {
    const result = validator.validate(
      baseCtx({ skillId: 'invoker_flame_bolt', actorClassId: 'vanguard' }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('restricted to classes'))).toBe(true);
  });

  it('allows class-restricted skill for correct class', () => {
    const result = validator.validate(
      baseCtx({ skillId: 'invoker_flame_bolt', actorClassId: 'invoker', actorEnergy: 100 }),
    );
    expect(result.valid).toBe(true);
  });

  it('rejects ultimate when gauge is not full', () => {
    const result = validator.validate(
      baseCtx({
        skillId: 'vanguard_unbreakable_fortress',
        actorClassId: 'vanguard',
        actorEnergy: 100,
        ultimateGauge: 50,
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('gauge'))).toBe(true);
  });

  it('allows ultimate when gauge is full', () => {
    const result = validator.validate(
      baseCtx({
        skillId: 'vanguard_unbreakable_fortress',
        actorClassId: 'vanguard',
        actorEnergy: 100,
        ultimateGauge: 100,
      }),
    );
    expect(result.valid).toBe(true);
  });

  it('rejects combo skill when prerequisite is missing from chain', () => {
    const result = validator.validate(
      baseCtx({
        skillId: 'combo_finisher',
        actorEnergy: 100,
        activeComboChain: [], // missing 'basic_attack'
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('prerequisites'))).toBe(true);
  });

  it('allows combo skill when prerequisite is in chain', () => {
    const result = validator.validate(
      baseCtx({
        skillId: 'combo_finisher',
        actorEnergy: 100,
        activeComboChain: ['basic_attack'],
      }),
    );
    expect(result.valid).toBe(true);
  });

  it('returns multiple errors at once', () => {
    const result = validator.validate(
      baseCtx({
        skillId: 'vanguard_shield_bash',
        actorClassId: 'invoker',  // wrong class
        actorEnergy: 0,            // insufficient energy
        cooldowns: new Map([['vanguard_shield_bash', 10]]),
        currentRound: 1,           // on cooldown
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });

  describe('canUse', () => {
    it('returns true for valid skill use', () => {
      expect(validator.canUse(baseCtx())).toBe(true);
    });

    it('returns false for invalid skill use', () => {
      expect(validator.canUse(baseCtx({ skillId: 'no_such_skill' }))).toBe(false);
    });
  });

  describe('isClassAllowed', () => {
    it('returns true for class-appropriate skill', () => {
      // signature: isClassAllowed(skillId, classId)
      expect(validator.isClassAllowed('invoker_flame_bolt', 'invoker')).toBe(true);
    });

    it('returns false for wrong class', () => {
      expect(validator.isClassAllowed('invoker_flame_bolt', 'vanguard')).toBe(false);
    });

    it('returns true for universal skills', () => {
      expect(validator.isClassAllowed('basic_attack', 'wanderer')).toBe(true);
      expect(validator.isClassAllowed('basic_attack', 'vanguard')).toBe(true);
    });

    it('returns false for unknown skill', () => {
      expect(validator.isClassAllowed('no_such_skill', 'vanguard')).toBe(false);
    });
  });
});
