import { BattleEvents } from '../../services/battle/BattleEvents.js';
import { BattleManager } from '../../services/battle/BattleManager.js';
import { BattleSerializer } from '../../services/battle/BattleSerializer.js';
import type { BattleParticipant } from '../../services/battle/types.js';

function p(id: string, speedOverride = 100): BattleParticipant {
  return {
    id,
    name: id,
    stats: {
      hp: 1000, maxHp: 1000, mp: 100, maxMp: 100,
      attack: 200, defense: 100, magicAttack: 150, magicDefense: 100,
      speed: speedOverride, luck: 0, critRate: 0, critDamage: 150,
      evasion: 0, accuracy: 100,
    },
  };
}

describe('BattleManager', () => {
  it('runBattle() resolves to a complete BattleResult', async () => {
    const manager = new BattleManager();
    const result = await manager.runBattle({
      participants: [p('attacker'), p('defender')],
      seed: 'manager-test',
      maxRounds: 5,
    });
    expect(result.battleId).toBeTruthy();
    expect(['attacker_win', 'defender_win', 'draw', 'retreat']).toContain(result.outcome);
    expect(result.rounds).toBeGreaterThan(0);
  });

  it('runBattle() is deterministic with same seed', async () => {
    const manager = new BattleManager();
    const opts = { participants: [p('a'), p('b')] as [BattleParticipant, BattleParticipant], seed: 'fixed-mgr', maxRounds: 5 };
    const r1 = await manager.runBattle(opts);
    const r2 = await manager.runBattle({ ...opts });
    expect(r1.outcome).toBe(r2.outcome);
    expect(r1.rounds).toBe(r2.rounds);
  });

  it('runBattle() applies pre-supplied actions', async () => {
    const manager = new BattleManager();
    const kill = { id: 'kill', name: 'Kill', damageMultiplier: 100 };
    const result = await manager.runBattle({
      participants: [p('attacker', 1000), p('defender', 1)],
      seed: 'kill-test',
      maxRounds: 1,
      type: 'pve',
      actions: [{ actorId: 'attacker', targetId: 'defender', type: 'skill', skill: kill, round: 1 }],
    });
    expect(result.outcome).toBe('attacker_win');
  });

  it('getSession() returns the session after runBattle()', async () => {
    const manager = new BattleManager();
    const result = await manager.runBattle({ participants: [p('a'), p('b')], seed: 'session-get', maxRounds: 2 });
    const session = manager.getSession(result.battleId);
    expect(session).not.toBeNull();
    expect(session?.battleId).toBe(result.battleId);
  });

  it('getSession() returns null for unknown battleId', () => {
    const manager = new BattleManager();
    expect(manager.getSession('unknown')).toBeNull();
  });

  it('getReplay() returns result after battle completes', async () => {
    const manager = new BattleManager();
    const result = await manager.runBattle({ participants: [p('a'), p('b')], seed: 'replay-get', maxRounds: 3 });
    const replay = manager.getReplay(result.battleId);
    expect(replay).toEqual(result);
  });

  it('getSerializedReplay() returns JSON string', async () => {
    const manager = new BattleManager();
    const result = await manager.runBattle({ participants: [p('a'), p('b')], seed: 'serial', maxRounds: 2 });
    const json = manager.getSerializedReplay(result.battleId);
    expect(json).toBeTruthy();
    expect(() => JSON.parse(json!)).not.toThrow();
  });

  it('createSession() returns an unstarted session', () => {
    const manager = new BattleManager();
    const session = manager.createSession({ participants: [p('a'), p('b')], seed: 'manual' });
    expect(session.status).toBe('created');
    expect(session.isCompleted).toBe(false);
  });

  it('events are emitted during runBattle()', async () => {
    const events = new BattleEvents();
    const manager = new BattleManager(undefined, undefined, events);
    let started = false;
    let ended = false;
    events.on('battle:start', () => { started = true; });
    events.on('battle:end', () => { ended = true; });
    await manager.runBattle({ participants: [p('a'), p('b')], seed: 'events-test', maxRounds: 2 });
    expect(started).toBe(true);
    expect(ended).toBe(true);
  });
});

// ─── BattleSerializer round-trip ──────────────────────────────────────────────

describe('BattleSerializer', () => {
  const serializer = new BattleSerializer();

  it('serialize → deserialize round-trip preserves all fields', async () => {
    const manager = new BattleManager();
    const result = await manager.runBattle({ participants: [p('a'), p('b')], seed: 'roundtrip', maxRounds: 3 });
    const json = serializer.serialize(result);
    const restored = serializer.deserialize(json);
    expect(restored.battleId).toBe(result.battleId);
    expect(restored.outcome).toBe(result.outcome);
    expect(restored.events).toHaveLength(result.events.length);
    expect(restored.participants[0].id).toBe(result.participants[0].id);
  });

  it('summarize() returns compact JSON string', async () => {
    const manager = new BattleManager();
    const result = await manager.runBattle({ participants: [p('a'), p('b')], seed: 'sum', maxRounds: 2 });
    const summary = serializer.summarize(result);
    const parsed = JSON.parse(summary) as Record<string, unknown>;
    expect(parsed['battleId']).toBe(result.battleId);
    expect(parsed['outcome']).toBe(result.outcome);
  });
});
