import { createParticipantState } from '../../services/battle/BattleState.js';
import { CooldownEngine } from '../../services/battle/CooldownEngine.js';
import { StatusEffectEngine } from '../../services/battle/StatusEffectEngine.js';
import type { BattleEvent, BattleParticipant } from '../../services/battle/types.js';

function makeParticipant(overrides: Partial<BattleParticipant['stats']> = {}): ReturnType<typeof createParticipantState> {
  const p: BattleParticipant = {
    id: 'p1',
    name: 'Test',
    stats: {
      hp: 1000, maxHp: 1000, mp: 100, maxMp: 100,
      attack: 200, defense: 100,
      magicAttack: 150, magicDefense: 100,
      speed: 100, luck: 0, critRate: 5, critDamage: 150,
      evasion: 0, accuracy: 100,
      ...overrides,
    },
  };
  return createParticipantState(p);
}

const collect = (): { events: BattleEvent[]; emit: (e: Omit<BattleEvent, 'sequence'>) => void } => {
  const events: BattleEvent[] = [];
  let seq = 0;
  return {
    events,
    emit: (e) => events.push({ sequence: seq++, ...e }),
  };
};

// ─── StatusEffectEngine ────────────────────────────────────────────────────────

describe('StatusEffectEngine', () => {
  const engine = new StatusEffectEngine();

  it('apply() adds a new status', () => {
    const p = makeParticipant();
    const { emit } = collect();
    engine.apply(p, { type: 'burn', duration: 3 }, 1, emit);
    expect(p.statuses).toHaveLength(1);
    expect(p.statuses[0]?.type).toBe('burn');
  });

  it('apply() stacks duration and stacks when status already present', () => {
    const p = makeParticipant();
    const { emit } = collect();
    engine.apply(p, { type: 'burn', duration: 3, stacks: 1 }, 1, emit);
    engine.apply(p, { type: 'burn', duration: 2, stacks: 1 }, 1, emit);
    expect(p.statuses).toHaveLength(1);
    expect(p.statuses[0]?.stacks).toBe(2);
    expect(p.statuses[0]?.duration).toBe(3); // max(3,2)
  });

  it('stacks capped at 5', () => {
    const p = makeParticipant();
    const { emit } = collect();
    for (let i = 0; i < 10; i++) {
      engine.apply(p, { type: 'poison', duration: 5, stacks: 1 }, 1, emit);
    }
    expect(p.statuses[0]?.stacks).toBe(5);
  });

  it('apply() mutually excludes burn and freeze', () => {
    const p = makeParticipant();
    const { emit } = collect();
    engine.apply(p, { type: 'freeze', duration: 2 }, 1, emit);
    engine.apply(p, { type: 'burn', duration: 3 }, 1, emit);
    expect(engine.has(p, 'freeze')).toBe(false);
    expect(engine.has(p, 'burn')).toBe(true);
  });

  it('remove() deletes the status and emits status_removed', () => {
    const p = makeParticipant();
    const { events, emit } = collect();
    engine.apply(p, { type: 'silence', duration: 2 }, 1, emit);
    engine.remove(p, 'silence', 1, emit);
    expect(engine.has(p, 'silence')).toBe(false);
    expect(events.some((e) => e.type === 'status_removed' && e.status === 'silence')).toBe(true);
  });

  it('remove() is a no-op if status not present', () => {
    const p = makeParticipant();
    const { events, emit } = collect();
    engine.remove(p, 'silence', 1, emit);
    expect(events).toHaveLength(0);
  });

  it('tick() deals burn damage (15 % sourceAttack × stacks)', () => {
    const p = makeParticipant({ attack: 200 });
    const { emit } = collect();
    engine.apply(p, { type: 'burn', duration: 3, stacks: 1, sourceAttack: 200 }, 1, emit);
    const hpBefore = p.hp;
    engine.tick(p, 1, emit);
    const expected = Math.max(1, Math.round(200 * 0.15 * 1));
    expect(p.hp).toBe(hpBefore - expected);
  });

  it('tick() heals with regeneration', () => {
    const p = makeParticipant({ hp: 500, maxHp: 1000 });
    const { emit } = collect();
    engine.apply(p, { type: 'regeneration', duration: 3 }, 1, emit);
    engine.tick(p, 1, emit);
    const expected = Math.max(1, Math.round(1000 * 0.015));
    expect(p.hp).toBeGreaterThan(500);
    expect(p.hp).toBe(500 + expected);
  });

  it('tick() deals bleed damage based on maxHp', () => {
    const p = makeParticipant({ hp: 1000, maxHp: 1000 });
    const { emit } = collect();
    engine.apply(p, { type: 'bleed', duration: 3, stacks: 1 }, 1, emit);
    const hpBefore = p.hp;
    engine.tick(p, 1, emit);
    const expected = Math.max(50, Math.round(1000 * 0.02 * 1));
    expect(p.hp).toBe(hpBefore - expected);
  });

  it('tick() drains energy with shock', () => {
    const p = makeParticipant({ hp: 1000, maxHp: 1000 });
    const { emit } = collect();
    engine.apply(p, { type: 'shock', duration: 3, sourceAttack: 200 }, 1, emit);
    engine.tick(p, 1, emit);
    expect(p.energy).toBe(80); // 100 - 20
  });

  it('tick() expires a duration-1 status after one tick', () => {
    const p = makeParticipant();
    const { emit } = collect();
    engine.apply(p, { type: 'stun', duration: 1 }, 1, emit);
    engine.tick(p, 1, emit);
    expect(engine.has(p, 'stun')).toBe(false);
  });

  it('isIncapacitated returns true for stun, freeze, sleep', () => {
    for (const type of ['stun', 'freeze', 'sleep'] as const) {
      const p = makeParticipant();
      const { emit } = collect();
      engine.apply(p, { type, duration: 2 }, 1, emit);
      expect(engine.isIncapacitated(p)).toBe(true);
    }
  });

  it('isIncapacitated returns false for non-incapacitating statuses', () => {
    const p = makeParticipant();
    const { emit } = collect();
    engine.apply(p, { type: 'burn', duration: 2 }, 1, emit);
    expect(engine.isIncapacitated(p)).toBe(false);
  });

  it('evicts oldest status when at the 4-status cap', () => {
    const p = makeParticipant();
    const { emit } = collect();
    engine.apply(p, { type: 'burn', duration: 5 }, 1, emit);
    engine.apply(p, { type: 'silence', duration: 5 }, 1, emit);
    engine.apply(p, { type: 'slow', duration: 5 }, 1, emit);
    engine.apply(p, { type: 'curse', duration: 5 }, 1, emit);
    // Now at 4; adding barrier evicts 'burn' (oldest).
    engine.apply(p, { type: 'barrier', duration: 5, value: 100 }, 1, emit);
    expect(p.statuses).toHaveLength(4);
    expect(engine.has(p, 'burn')).toBe(false);
    expect(engine.has(p, 'barrier')).toBe(true);
  });
});

// ─── CooldownEngine ────────────────────────────────────────────────────────────

describe('CooldownEngine', () => {
  const engine = new CooldownEngine();

  it('set() registers a cooldown', () => {
    const cd = new Map<string, number>();
    engine.set(cd, 'fire_blast', 3);
    expect(engine.isOnCooldown(cd, 'fire_blast')).toBe(true);
    expect(engine.remaining(cd, 'fire_blast')).toBe(3);
  });

  it('set() ignores 0-turn cooldowns', () => {
    const cd = new Map<string, number>();
    engine.set(cd, 'basic_attack', 0);
    expect(engine.isOnCooldown(cd, 'basic_attack')).toBe(false);
  });

  it('tick() decrements all active cooldowns', () => {
    const cd = new Map<string, number>();
    engine.set(cd, 'skill_a', 3);
    engine.set(cd, 'skill_b', 1);
    engine.tick(cd);
    expect(engine.remaining(cd, 'skill_a')).toBe(2);
    expect(engine.isOnCooldown(cd, 'skill_b')).toBe(false);
  });

  it('tick() removes cooldown when it reaches 0', () => {
    const cd = new Map<string, number>();
    engine.set(cd, 'skill', 1);
    engine.tick(cd);
    expect(engine.isOnCooldown(cd, 'skill')).toBe(false);
  });

  it('clear() removes a specific cooldown', () => {
    const cd = new Map<string, number>();
    engine.set(cd, 'skill', 5);
    engine.clear(cd, 'skill');
    expect(engine.isOnCooldown(cd, 'skill')).toBe(false);
  });

  it('clearAll() removes all cooldowns', () => {
    const cd = new Map<string, number>();
    engine.set(cd, 'a', 3);
    engine.set(cd, 'b', 2);
    engine.clearAll(cd);
    expect(cd.size).toBe(0);
  });

  it('snapshot() returns plain object', () => {
    const cd = new Map<string, number>();
    engine.set(cd, 'x', 4);
    engine.set(cd, 'y', 2);
    const snap = engine.snapshot(cd);
    expect(snap).toEqual({ x: 4, y: 2 });
  });
});
