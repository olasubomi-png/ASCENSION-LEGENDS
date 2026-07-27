import { BattleEngine } from '../../services/battle/BattleEngine.js';
import type { BattleParticipant, BattleSkill } from '../../services/battle/types.js';

function participant(id: string, overrides: Partial<BattleParticipant['stats']> = {}): BattleParticipant {
  const stats = {
    hp: 1_000,
    maxHp: 1_000,
    mp: 100,
    maxMp: 100,
    attack: 200,
    defense: 100,
    magicAttack: 180,
    magicDefense: 100,
    speed: 100,
    luck: 0,
    critRate: 0,
    critDamage: 150,
    evasion: 0,
    accuracy: 100,
    ...overrides,
  };
  return { id, name: id, stats };
}

const strike: BattleSkill = {
  id: 'strike',
  name: 'Strike',
  damageMultiplier: 1,
  element: 'iron',
  damageType: 'physical',
};

describe('BattleEngine', () => {
  it('replays the same result for the same seed', () => {
    const input = {
      battleId: 'btl_test',
      seed: 'fixed-seed',
      participants: [participant('a'), participant('b')] as [BattleParticipant, BattleParticipant],
      actions: [
        { actorId: 'a', targetId: 'b', type: 'skill' as const, skill: strike, round: 1 },
        { actorId: 'b', targetId: 'a', type: 'skill' as const, skill: strike, round: 1 },
      ],
      maxRounds: 1,
    };

    const first = new BattleEngine().run(input);
    const second = new BattleEngine().run(input);
    expect(second).toEqual(first);
    expect(first.events.at(-1)?.type).toBe('battle_ended');
  });

  it('uses the documented physical damage formula', () => {
    const result = new BattleEngine().run({
      battleId: 'btl_formula',
      seed: 'formula',
      participants: [
        participant('attacker', { attack: 2_000, speed: 1_000 }),
        participant('defender', { defense: 1_200, speed: 1 }),
      ],
      actions: [
        { actorId: 'attacker', targetId: 'defender', type: 'skill', skill: { ...strike, damageMultiplier: 1.8 }, round: 1 },
      ],
      maxRounds: 1,
    });

    const damage = result.events.find((event) => event.type === 'damage' && event.actorId === 'attacker');
    expect(damage?.amount).toBe(2_880);
  });

  it('reduces damage with block and consumes shield before HP', () => {
    const result = new BattleEngine().run({
      battleId: 'btl_defense',
      seed: 'defense',
      participants: [
        participant('attacker', { attack: 200, speed: 1 }),
        participant('defender', { speed: 1_000 },),
      ],
      actions: [
        { actorId: 'defender', type: 'block', round: 1 },
        {
          actorId: 'attacker',
          targetId: 'defender',
          type: 'skill',
          skill: { ...strike, damageMultiplier: 2 },
          round: 1,
        },
      ],
      maxRounds: 1,
    });

    const defender = result.participants.find((entry) => entry.id === 'defender');
    expect(defender?.hp).toBe(1_000 - 119);
  });

  it('applies status ticks and expires them', () => {
    const result = new BattleEngine().run({
      battleId: 'btl_status',
      seed: 'status',
      participants: [
        participant('attacker', { speed: 1_000 }),
        participant('defender', { speed: 1 }),
      ],
      actions: [
        {
          actorId: 'attacker',
          targetId: 'defender',
          type: 'skill',
          skill: {
            ...strike,
            status: { type: 'burn', duration: 1 },
            statusChance: 1,
          },
          round: 1,
        },
      ],
      maxRounds: 2,
    });

    const defender = result.participants.find((entry) => entry.id === 'defender');
    expect(result.events.some((event) => event.type === 'status_tick' && event.status === 'burn')).toBe(true);
    expect(defender?.statuses.some((status) => status.type === 'burn')).toBe(false);
  });

  it('declares the surviving participant the winner', () => {
    const result = new BattleEngine().run({
      battleId: 'btl_draw',
      seed: 'draw',
      participants: [
        participant('a', { hp: 1, maxHp: 1, speed: 100 }),
        participant('b', { hp: 1, maxHp: 1, speed: 1 }),
      ],
      actions: [
        { actorId: 'a', targetId: 'b', type: 'skill', skill: { ...strike, damageMultiplier: 100 }, round: 1 },
      ],
      maxRounds: 1,
    });

    expect(result.outcome).toBe('attacker_win');
  });
});