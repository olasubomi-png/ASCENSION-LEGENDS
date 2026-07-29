import { BattleSession } from '../../services/battle/BattleSession.js';
import type { BattleParticipant } from '../../services/battle/types.js';

function p(id: string): BattleParticipant {
  return {
    id,
    name: id,
    stats: {
      hp: 1000, maxHp: 1000, mp: 100, maxMp: 100,
      attack: 200, defense: 100, magicAttack: 150, magicDefense: 100,
      speed: 100, luck: 0, critRate: 0, critDamage: 150,
      evasion: 0, accuracy: 100,
    },
  };
}

describe('BattleSession', () => {
  it('starts in "created" status', () => {
    const session = new BattleSession({ participants: [p('a'), p('b')] });
    expect(session.status).toBe('created');
    expect(session.isCompleted).toBe(false);
  });

  it('run() transitions to "completed" and returns a result', () => {
    const session = new BattleSession({
      participants: [p('a'), p('b')],
      seed: 'test-session',
      maxRounds: 3,
    });
    const result = session.run();
    expect(session.status).toBe('completed');
    expect(session.isCompleted).toBe(true);
    expect(result.battleId).toBeTruthy();
    expect(result.events.length).toBeGreaterThan(0);
  });

  it('run() is idempotent — same result returned on repeated calls', () => {
    const session = new BattleSession({
      participants: [p('a'), p('b')],
      seed: 'idempotent-seed',
      maxRounds: 3,
    });
    const r1 = session.run();
    const r2 = session.run();
    expect(r2).toEqual(r1);
  });

  it('result is null before run()', () => {
    const session = new BattleSession({ participants: [p('a'), p('b')] });
    expect(session.result).toBeNull();
  });

  it('addAction() queues actions that affect battle outcome', () => {
    const highDamageSkill = { id: 'kill', name: 'Kill', damageMultiplier: 100, damageType: 'physical' as const };
    const session = new BattleSession({
      participants: [p('attacker'), p('defender')],
      seed: 'action-test',
      type: 'pvp',
      maxRounds: 1,
    });
    session.addAction({ actorId: 'attacker', targetId: 'defender', type: 'skill', skill: highDamageSkill, round: 1 });
    const result = session.run();
    expect(result.outcome).toBe('attacker_win');
  });

  it('addActions() queues multiple actions', () => {
    const session = new BattleSession({
      participants: [p('a'), p('b')],
      seed: 'multi',
      maxRounds: 2,
    });
    session.addActions([
      { actorId: 'a', type: 'pass', round: 1 },
      { actorId: 'b', type: 'pass', round: 1 },
    ]);
    expect(session.queuedActionCount).toBe(2);
    session.run();
  });

  it('addAction() throws after session is completed', () => {
    const session = new BattleSession({ participants: [p('a'), p('b')], maxRounds: 1 });
    session.run();
    expect(() => session.addAction({ actorId: 'a', type: 'pass' })).toThrow();
  });

  it('generates a unique battleId if not provided', () => {
    const s1 = new BattleSession({ participants: [p('a'), p('b')] });
    const s2 = new BattleSession({ participants: [p('a'), p('b')] });
    expect(s1.battleId).not.toBe(s2.battleId);
  });

  it('uses provided battleId when given', () => {
    const session = new BattleSession({
      participants: [p('a'), p('b')],
      battleId: 'btl_custom123',
    });
    expect(session.battleId).toBe('btl_custom123');
  });

  it('seed is deterministic: same seed → same events', () => {
    const opts = { participants: [p('a'), p('b')] as [BattleParticipant, BattleParticipant], seed: 'fixed', maxRounds: 5 };
    const r1 = new BattleSession(opts).run();
    const r2 = new BattleSession(opts).run();
    expect(r2.events).toEqual(r1.events);
  });
});
