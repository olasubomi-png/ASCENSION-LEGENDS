import { ActionQueue } from '../../services/battle/ActionQueue.js';
import { createParticipantState } from '../../services/battle/BattleState.js';
import { SeededRandom } from '../../services/battle/SeededRandom.js';
import { Timeline } from '../../services/battle/Timeline.js';
import { TurnManager } from '../../services/battle/TurnManager.js';
import type { BattleEvent, BattleParticipant } from '../../services/battle/types.js';

function evt(seq: number, type: BattleEvent['type'], overrides: Partial<BattleEvent> = {}): BattleEvent {
  return { sequence: seq, round: 1, type, ...overrides };
}

function makeP(id: string, speed = 100): ReturnType<typeof createParticipantState> {
  const p: BattleParticipant = {
    id, name: id,
    stats: {
      hp: 1000, maxHp: 1000, mp: 100, maxMp: 100,
      attack: 200, defense: 100, magicAttack: 150, magicDefense: 100,
      speed, luck: 0, critRate: 5, critDamage: 150,
      evasion: 0, accuracy: 100,
    },
  };
  return createParticipantState(p);
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

describe('Timeline', () => {
  it('push() and toArray() maintain order', () => {
    const tl = new Timeline();
    tl.push(evt(0, 'battle_started'));
    tl.push(evt(1, 'round_end'));
    tl.push(evt(2, 'battle_ended'));
    expect(tl.toArray()).toHaveLength(3);
    expect(tl.toArray()[0]?.type).toBe('battle_started');
  });

  it('findByType() returns matching events', () => {
    const tl = new Timeline();
    tl.push(evt(0, 'damage'));
    tl.push(evt(1, 'heal'));
    tl.push(evt(2, 'damage'));
    expect(tl.findByType('damage')).toHaveLength(2);
    expect(tl.findByType('heal')).toHaveLength(1);
  });

  it('findByActor() filters by actorId', () => {
    const tl = new Timeline();
    tl.push(evt(0, 'damage', { actorId: 'a' }));
    tl.push(evt(1, 'damage', { actorId: 'b' }));
    tl.push(evt(2, 'action', { actorId: 'a' }));
    expect(tl.findByActor('a')).toHaveLength(2);
  });

  it('findByParticipant() matches actorId or targetId', () => {
    const tl = new Timeline();
    tl.push(evt(0, 'damage', { actorId: 'a', targetId: 'b' }));
    tl.push(evt(1, 'damage', { actorId: 'b', targetId: 'a' }));
    tl.push(evt(2, 'damage', { actorId: 'c', targetId: 'c' }));
    expect(tl.findByParticipant('a')).toHaveLength(2);
  });

  it('findByRound() filters by round', () => {
    const tl = new Timeline();
    tl.push(evt(0, 'action', { round: 1 }));
    tl.push(evt(1, 'action', { round: 2 }));
    tl.push(evt(2, 'action', { round: 2 }));
    expect(tl.findByRound(2)).toHaveLength(2);
  });

  it('getRange() returns inclusive sequence range', () => {
    const tl = new Timeline();
    for (let i = 0; i < 5; i++) tl.push(evt(i, 'action'));
    expect(tl.getRange(1, 3)).toHaveLength(3);
  });

  it('totalDamageByActor() sums damage correctly', () => {
    const tl = new Timeline();
    tl.push(evt(0, 'damage', { actorId: 'a', amount: 100 }));
    tl.push(evt(1, 'damage', { actorId: 'a', amount: 200 }));
    tl.push(evt(2, 'damage', { actorId: 'b', amount: 999 }));
    expect(tl.totalDamageByActor('a')).toBe(300);
  });

  it('pushAll() adds all events in order', () => {
    const tl = new Timeline();
    tl.pushAll([evt(0, 'action'), evt(1, 'heal'), evt(2, 'damage')]);
    expect(tl.length).toBe(3);
  });

  it('clear() resets the timeline', () => {
    const tl = new Timeline();
    tl.push(evt(0, 'action'));
    tl.clear();
    expect(tl.length).toBe(0);
  });

  it('last returns the last event', () => {
    const tl = new Timeline();
    tl.push(evt(0, 'battle_started'));
    tl.push(evt(1, 'battle_ended'));
    expect(tl.last?.type).toBe('battle_ended');
  });

  it('last is undefined on empty timeline', () => {
    expect(new Timeline().last).toBeUndefined();
  });
});

// ─── ActionQueue ──────────────────────────────────────────────────────────────

describe('ActionQueue', () => {
  it('dequeue() returns queued action for the round', () => {
    const q = new ActionQueue();
    q.add({ actorId: 'a', targetId: 'b', type: 'skill', round: 2 });
    const action = q.dequeue(2, 'a', 'b');
    expect(action.type).toBe('skill');
  });

  it('dequeue() falls back to basic attack when nothing queued', () => {
    const q = new ActionQueue();
    const action = q.dequeue(1, 'a', 'b');
    expect(action.type).toBe('attack');
    expect(action.actorId).toBe('a');
    expect(action.targetId).toBe('b');
  });

  it('add() overwrites previous action for same (round, actorId)', () => {
    const q = new ActionQueue();
    q.add({ actorId: 'a', type: 'attack', round: 1 });
    q.add({ actorId: 'a', type: 'pass', round: 1 });
    expect(q.size).toBe(1);
    expect(q.dequeue(1, 'a', 'b').type).toBe('pass');
  });

  it('clearRound() removes only that round', () => {
    const q = new ActionQueue();
    q.add({ actorId: 'a', type: 'attack', round: 1 });
    q.add({ actorId: 'a', type: 'pass', round: 2 });
    q.clearRound(1);
    expect(q.size).toBe(1);
    expect(q.dequeue(2, 'a', 'b').type).toBe('pass');
  });

  it('clear() removes everything', () => {
    const q = new ActionQueue();
    q.addAll([
      { actorId: 'a', type: 'attack', round: 1 },
      { actorId: 'b', type: 'pass', round: 1 },
    ]);
    q.clear();
    expect(q.size).toBe(0);
  });
});

// ─── TurnManager ──────────────────────────────────────────────────────────────

describe('TurnManager', () => {
  const manager = new TurnManager();

  it('determineOrder() excludes dead participants', () => {
    const a = makeP('a', 100);
    const b = makeP('b', 200);
    b.hp = 0;
    const order = manager.determineOrder([a, b], new SeededRandom('order'));
    expect(order).toHaveLength(1);
    expect(order[0]?.participant.id).toBe('a');
  });

  it('determineOrder() puts higher speed first', () => {
    const slow = makeP('slow', 100);
    const fast = makeP('fast', 1000);
    // With very large speed difference, fast should almost always go first.
    let fastFirst = 0;
    for (let i = 0; i < 50; i++) {
      const order = manager.determineOrder([slow, fast], new SeededRandom(`order-${i}`));
      if (order[0]?.participant.id === 'fast') fastFirst++;
    }
    expect(fastFirst).toBeGreaterThan(40); // fast wins > 80 % of the time
  });

  it('rollInitiative() returns value in [speed, speed + floor(speed*0.15)]', () => {
    const p = makeP('p', 200);
    for (let i = 0; i < 100; i++) {
      const initiative = manager.rollInitiative(p, new SeededRandom(`init-${i}`));
      expect(initiative).toBeGreaterThanOrEqual(200);
      expect(initiative).toBeLessThanOrEqual(200 + Math.floor(200 * 0.15));
    }
  });

  it('effectiveSpeed() applies slow debuff reduction', () => {
    const p = makeP('p', 1000);
    p.statuses.push({ type: 'slow', duration: 3, stacks: 1 });
    const speed = manager.effectiveSpeed(p);
    expect(speed).toBe(600); // 1000 * (1 - 0.4) = 600
  });

  it('effectiveSpeed() with 2 stacks of slow reduces by 60 %', () => {
    const p = makeP('p', 1000);
    p.statuses.push({ type: 'slow', duration: 3, stacks: 2 });
    const speed = manager.effectiveSpeed(p);
    expect(speed).toBe(400); // 1000 * (1 - 0.6) = 400
  });

  it('determineOrder() breaks ties alphabetically by ID', () => {
    // Same speed, same rng seed → same initiative → tie broken by ID.
    const a = makeP('alpha', 100);
    const b = makeP('beta', 100);
    // Force identical initiative by patching rng to always return 0 bonus.
    const fixedRng = { next: () => 0, int: (_min: number, _max: number) => 0, percent: () => 50 };
    const order = manager.determineOrder([b, a], fixedRng);
    expect(order[0]?.participant.id).toBe('alpha'); // alpha < beta lexicographically
  });
});
