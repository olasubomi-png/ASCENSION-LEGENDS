import { createBattleState, createParticipantState } from '../../services/battle/BattleState.js';
import { BattleValidator } from '../../services/battle/BattleValidator.js';
import { StatusEffectEngine } from '../../services/battle/StatusEffectEngine.js';
import type { BattleAction, BattleParticipant } from '../../services/battle/types.js';

const statusEngine = new StatusEffectEngine();
const validator = new BattleValidator();

// Simple no-op emit for test setup
const noopEmit = () => undefined;

function makeP(id: string, overrides: Partial<BattleParticipant['stats']> = {}): ReturnType<typeof createParticipantState> {
  return createParticipantState({
    id,
    name: id,
    stats: {
      hp: 1000, maxHp: 1000, mp: 100, maxMp: 100,
      attack: 200, defense: 100, magicAttack: 150, magicDefense: 100,
      speed: 100, luck: 0, critRate: 5, critDamage: 150,
      evasion: 0, accuracy: 100,
      ...overrides,
    },
  });
}

function makeState(a = makeP('a'), b = makeP('b')) {
  return createBattleState('btl_test', 'seed', 'pve', [
    { id: a.id, name: a.name, stats: a.stats, element: a.element },
    { id: b.id, name: b.name, stats: b.stats, element: b.element },
  ]);
}

// ─── basic action types ────────────────────────────────────────────────────────

describe('BattleValidator — basic actions', () => {
  it('attack is always valid for a healthy actor', () => {
    const a = makeP('a');
    const state = makeState(a);
    const action: BattleAction = { actorId: 'a', targetId: 'b', type: 'attack' };
    expect(validator.validate(action, a, state).valid).toBe(true);
  });

  it('pass is always valid', () => {
    const a = makeP('a');
    const state = makeState(a);
    expect(validator.validate({ actorId: 'a', type: 'pass' }, a, state).valid).toBe(true);
  });

  it('block requires 10 energy', () => {
    const a = makeP('a', { mp: 5 });
    a.energy = 5;
    const state = makeState(a);
    expect(validator.validate({ actorId: 'a', type: 'block' }, a, state).valid).toBe(false);
  });

  it('block is valid when energy >= 10', () => {
    const a = makeP('a');
    a.energy = 10;
    const state = makeState(a);
    expect(validator.validate({ actorId: 'a', type: 'block' }, a, state).valid).toBe(true);
  });
});

// ─── actor state ──────────────────────────────────────────────────────────────

describe('BattleValidator — actor state checks', () => {
  it('defeated actor cannot act', () => {
    const a = makeP('a');
    a.hp = 0;
    const state = makeState(a);
    expect(validator.validate({ actorId: 'a', type: 'attack' }, a, state).valid).toBe(false);
  });

  it('actor not in battle is rejected', () => {
    const a = makeP('a');
    const outsider = makeP('outsider');
    const state = makeState(a);
    expect(validator.validate({ actorId: 'outsider', type: 'attack' }, outsider, state).valid).toBe(false);
  });

  it('frozen actor cannot act', () => {
    const a = makeP('a');
    statusEngine.apply(a, { type: 'freeze', duration: 2 }, 1, noopEmit);
    const state = makeState(a);
    expect(validator.validate({ actorId: 'a', type: 'attack' }, a, state).valid).toBe(false);
  });

  it('stunned actor cannot act', () => {
    const a = makeP('a');
    statusEngine.apply(a, { type: 'stun', duration: 1 }, 1, noopEmit);
    const state = makeState(a);
    expect(validator.validate({ actorId: 'a', type: 'attack' }, a, state).valid).toBe(false);
  });

  it('sleeping actor cannot act', () => {
    const a = makeP('a');
    statusEngine.apply(a, { type: 'sleep', duration: 2 }, 1, noopEmit);
    const state = makeState(a);
    expect(validator.validate({ actorId: 'a', type: 'attack' }, a, state).valid).toBe(false);
  });
});

// ─── skill actions ────────────────────────────────────────────────────────────

describe('BattleValidator — skill actions', () => {
  const fireBlast = { id: 'fire_blast', name: 'Fire Blast', energyCost: 30 };
  const ultimate = { id: 'ult', name: 'Ulti', energyCost: 50, isUltimate: true };

  it('skill without skill definition is invalid', () => {
    const a = makeP('a');
    const state = makeState(a);
    expect(validator.validate({ actorId: 'a', type: 'skill' }, a, state).valid).toBe(false);
  });

  it('skill valid when sufficient energy and not on cooldown', () => {
    const a = makeP('a');
    a.energy = 50;
    const state = makeState(a);
    const action: BattleAction = { actorId: 'a', type: 'skill', skill: fireBlast };
    expect(validator.validate(action, a, state).valid).toBe(true);
  });

  it('skill invalid when insufficient energy', () => {
    const a = makeP('a');
    a.energy = 10;
    const state = makeState(a);
    expect(validator.validate({ actorId: 'a', type: 'skill', skill: fireBlast }, a, state).valid).toBe(false);
  });

  it('skill invalid when on cooldown', () => {
    const a = makeP('a');
    a.energy = 100;
    a.cooldowns.set('fire_blast', 2);
    const state = makeState(a);
    expect(validator.validate({ actorId: 'a', type: 'skill', skill: fireBlast }, a, state).valid).toBe(false);
  });

  it('ultimate invalid when gauge < 100', () => {
    const a = makeP('a');
    a.energy = 100;
    a.ultimateGauge = 50;
    const state = makeState(a);
    expect(validator.validate({ actorId: 'a', type: 'skill', skill: ultimate }, a, state).valid).toBe(false);
  });

  it('ultimate valid when gauge = 100', () => {
    const a = makeP('a');
    a.energy = 100;
    a.ultimateGauge = 100;
    const state = makeState(a);
    expect(validator.validate({ actorId: 'a', type: 'skill', skill: ultimate }, a, state).valid).toBe(true);
  });

  it('silenced actor cannot use skills', () => {
    const a = makeP('a');
    a.energy = 100;
    statusEngine.apply(a, { type: 'silence', duration: 2 }, 1, noopEmit);
    const state = makeState(a);
    expect(validator.validate({ actorId: 'a', type: 'skill', skill: fireBlast }, a, state).valid).toBe(false);
  });
});

// ─── findInvalid ──────────────────────────────────────────────────────────────

describe('BattleValidator — findInvalid', () => {
  it('returns empty array when all actions are valid', () => {
    const a = makeP('a');
    const b = makeP('b');
    const state = makeState(a, b);
    const actions: BattleAction[] = [
      { actorId: 'a', type: 'attack' },
      { actorId: 'b', type: 'pass' },
    ];
    expect(validator.findInvalid(actions, [a, b], state)).toHaveLength(0);
  });

  it('returns invalid actions with reasons', () => {
    const a = makeP('a');
    a.hp = 0;
    const b = makeP('b');
    const state = makeState(a, b);
    const actions: BattleAction[] = [{ actorId: 'a', type: 'attack' }];
    const invalid = validator.findInvalid(actions, [a, b], state);
    expect(invalid).toHaveLength(1);
    expect(invalid[0]?.reason).toBeTruthy();
  });
});
