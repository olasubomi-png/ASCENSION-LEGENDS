import type {
  BattleAction,
  BattleElement,
  BattleEvent,
  BattleInput,
  BattleParticipant,
  BattleParticipantResult,
  BattleResult,
  BattleSkill,
  BattleStatus,
  StatusType,
} from './types.js';

const DEFENSE_FACTOR = 0.6;
const MAX_STATUSES = 4;
const MAX_ULTIMATE = 100;
const ELEMENTS: BattleElement[] = ['flame', 'frost', 'storm', 'terra', 'void', 'radiance', 'iron'];

const AFFINITY: Record<BattleElement, Record<BattleElement, number>> = {
  flame: { flame: 1, frost: 2, storm: 0.5, terra: 2, void: 1, radiance: 0.5, iron: 1 },
  frost: { flame: 0.5, frost: 1, storm: 2, terra: 0.5, void: 1, radiance: 2, iron: 1 },
  storm: { flame: 2, frost: 0.5, storm: 1, terra: 1, void: 2, radiance: 0.5, iron: 1 },
  terra: { flame: 0.5, frost: 2, storm: 1, terra: 1, void: 0.5, radiance: 2, iron: 1 },
  void: { flame: 1, frost: 1, storm: 0.5, terra: 2, void: 1, radiance: 0.5, iron: 1 },
  radiance: { flame: 2, frost: 0.5, storm: 2, terra: 0.5, void: 2, radiance: 1, iron: 1 },
  iron: { flame: 1, frost: 1, storm: 1, terra: 1, void: 1, radiance: 1, iron: 1 },
};

const MUTUALLY_EXCLUSIVE: Partial<Record<StatusType, StatusType>> = {
  burn: 'freeze',
  freeze: 'burn',
};

const COMBO_BONUS: Record<number, number> = {
  2: 0.05,
  3: 0.1,
  4: 0.15,
  5: 0.2,
  7: 0.3,
};

interface RuntimeParticipant {
  source: BattleParticipant;
  hp: number;
  energy: number;
  ultimateGauge: number;
  statuses: BattleStatus[];
  cooldowns: Map<string, number>;
  combo: number;
  comboElement?: BattleElement;
  blockMultiplier?: number;
  parryMultiplier?: number;
  counterReady: boolean;
  counterUsed: boolean;
}

/**
 * Pure, server-side battle resolver. It owns no persistence and uses only the
 * supplied seed, making a result reproducible for replay and dispute review.
 */
export class BattleEngine {
  run(input: BattleInput): BattleResult {
    if (input.participants.length !== 2) {
      throw new Error('BattleEngine requires exactly two participants');
    }

    const rng = new Xorshift128(input.seed);
    const participants = input.participants.map((participant) => this.createRuntime(participant)) as [
      RuntimeParticipant,
      RuntimeParticipant,
    ];
    const events: BattleEvent[] = [];
    let sequence = 0;
    const emit = (event: Omit<BattleEvent, 'sequence'>): void => {
      events.push({ sequence: sequence++, ...event });
    };

    emit({ round: 0, type: 'battle_started', metadata: { seed: String(input.seed) } });

    let outcome: BattleResult['outcome'] = 'draw';
    let winnerId: string | undefined;
    let completedRounds = 0;
    const maxRounds = input.maxRounds ?? 50;

    for (let round = 1; round <= maxRounds; round += 1) {
      completedRounds = round;
      participants.forEach((participant) => {
        participant.blockMultiplier = undefined;
        participant.parryMultiplier = undefined;
        participant.counterUsed = false;
      });

      const order = participants
        .filter((participant) => participant.hp > 0)
        .map((participant) => ({
          participant,
          initiative: this.rollInitiative(participant, rng),
        }))
        .sort((a, b) => b.initiative - a.initiative || a.participant.source.id.localeCompare(b.participant.source.id));

      order.forEach(({ participant, initiative }) => {
        emit({
          round,
          type: 'initiative',
          actorId: participant.source.id,
          metadata: { value: initiative },
        });
      });

      for (const { participant } of order) {
        if (participant.hp <= 0) continue;
        this.tickStatuses(participant, round, emit);
        if (participant.hp <= 0) continue;

        const opponent = participants.find((candidate) => candidate.source.id !== participant.source.id);
        if (!opponent || opponent.hp <= 0) break;

        participant.energy = Math.min(
          participant.source.stats.maxMp,
          participant.energy + Math.max(1, Math.round(10 + this.effectiveSpeed(participant) / 100)),
        );

        const action = this.actionFor(input.actions ?? [], round, participant.source.id, opponent.source.id);
        this.resolveAction(participant, opponent, action, round, rng, emit);

        if (opponent.hp <= 0 || participant.hp <= 0) break;
      }

      participants.forEach((participant) => {
        participant.cooldowns.forEach((remaining, skillId) => {
          if (remaining <= 1) participant.cooldowns.delete(skillId);
          else participant.cooldowns.set(skillId, remaining - 1);
        });
      });

      emit({ round, type: 'round_end' });
      const alive = participants.filter((participant) => participant.hp > 0);
      if (alive.length <= 1) {
        const remaining = alive[0];
        if (remaining) {
          winnerId = remaining.source.id;
          outcome = winnerId === participants[0].source.id ? 'attacker_win' : 'defender_win';
        } else {
          outcome = 'draw';
        }
        break;
      }
    }

    if (!winnerId && completedRounds >= maxRounds) {
      outcome = input.type === 'pve' ? 'retreat' : 'draw';
    }
    emit({
      round: completedRounds,
      type: 'battle_ended',
      outcome,
      metadata: winnerId ? { winnerId } : {},
    });

    return {
      battleId: input.battleId,
      seed: input.seed,
      type: input.type ?? 'pve',
      outcome,
      ...(winnerId ? { winnerId } : {}),
      rounds: completedRounds,
      participants: participants.map((participant) => this.toResult(participant)) as [
        BattleParticipantResult,
        BattleParticipantResult,
      ],
      events,
    };
  }

  private createRuntime(source: BattleParticipant): RuntimeParticipant {
    return {
      source: {
        ...source,
        stats: { ...source.stats },
      },
      hp: Math.max(0, source.stats.hp),
      energy: Math.max(0, source.stats.mp),
      ultimateGauge: 0,
      statuses: (source.statuses ?? []).map((status) => ({ ...status })),
      cooldowns: new Map(),
      combo: 0,
      counterReady: false,
      counterUsed: false,
    };
  }

  private toResult(participant: RuntimeParticipant): BattleParticipantResult {
    return {
      id: participant.source.id,
      name: participant.source.name,
      hp: participant.hp,
      maxHp: participant.source.stats.maxHp,
      energy: participant.energy,
      maxEnergy: participant.source.stats.maxMp,
      ultimateGauge: participant.ultimateGauge,
      statuses: participant.statuses.map((status) => ({ ...status })),
      combo: participant.combo,
    };
  }

  private rollInitiative(participant: RuntimeParticipant, rng: Xorshift128): number {
    const speed = this.effectiveSpeed(participant);
    return speed + rng.int(0, Math.floor(speed * 0.15));
  }

  private effectiveSpeed(participant: RuntimeParticipant): number {
    const slow = participant.statuses.find((status) => status.type === 'slow');
    const stacks = Math.min(2, slow?.stacks ?? 0);
    const reduction = stacks === 2 ? 0.6 : slow ? 0.4 : 0;
    return Math.max(participant.source.stats.speed * (1 - reduction), participant.source.stats.speed * 0.1);
  }

  private actionFor(actions: BattleAction[], round: number, actorId: string, targetId: string): BattleAction {
    const planned = actions.find(
      (action) => action.actorId === actorId && (action.round ?? 1) === round,
    );
    return planned ?? { actorId, targetId, type: 'attack' };
  }

  private tickStatuses(
    participant: RuntimeParticipant,
    round: number,
    emit: (event: Omit<BattleEvent, 'sequence'>) => void,
  ): void {
    for (const status of [...participant.statuses]) {
      let amount = 0;
      switch (status.type) {
        case 'burn':
          amount = Math.max(1, Math.round((status.sourceAttack ?? participant.source.stats.attack) * 0.15 * (status.stacks ?? 1)));
          break;
        case 'poison':
          amount = Math.max(1, Math.round((status.sourceAttack ?? participant.source.stats.attack) * Math.min(0.3, 0.1 + ((status.stacks ?? 1) - 1) * 0.05)));
          break;
        case 'bleed':
          amount = Math.max(50, Math.round(participant.source.stats.maxHp * 0.02 * (status.stacks ?? 1)));
          break;
        case 'regeneration':
          amount = Math.max(1, Math.round(participant.source.stats.maxHp * 0.015));
          participant.hp = Math.min(participant.source.stats.maxHp, participant.hp + amount);
          emit({ round, type: 'status_tick', actorId: participant.source.id, amount, status: status.type });
          break;
        default:
          break;
      }
      if (amount > 0 && status.type !== 'regeneration') {
        participant.hp = Math.max(0, participant.hp - amount);
        emit({ round, type: 'status_tick', actorId: participant.source.id, amount, status: status.type });
      }
      status.duration -= 1;
      if (status.duration <= 0) {
        this.removeStatus(participant, status.type, round, emit);
      }
    }
  }

  private resolveAction(
    actor: RuntimeParticipant,
    target: RuntimeParticipant,
    action: BattleAction,
    round: number,
    rng: Xorshift128,
    emit: (event: Omit<BattleEvent, 'sequence'>) => void,
  ): void {
    if (actor.statuses.some((status) => status.type === 'freeze' || status.type === 'sleep')) {
      emit({ round, type: 'action', actorId: actor.source.id, action: action.type, outcome: 'incapacitated' });
      return;
    }
    if (action.type === 'pass') {
      emit({ round, type: 'action', actorId: actor.source.id, action: action.type, outcome: 'pass' });
      return;
    }
    if (action.type === 'block' || action.type === 'parry' || action.type === 'counter') {
      const cost = action.type === 'block' ? 10 : 0;
      if (actor.energy < cost) {
        emit({ round, type: 'action', actorId: actor.source.id, action: action.type, outcome: 'insufficient_energy' });
        return;
      }
      actor.energy -= cost;
      if (action.type === 'block') actor.blockMultiplier = 0.35;
      if (action.type === 'parry') actor.parryMultiplier = 0.7;
      if (action.type === 'counter') actor.counterReady = true;
      emit({ round, type: 'action', actorId: actor.source.id, action: action.type, outcome: 'ready' });
      return;
    }

    const skill = action.type === 'skill' ? action.skill : undefined;
    if (skill && !this.canUseSkill(actor, skill)) {
      emit({ round, type: 'action', actorId: actor.source.id, action: action.type, outcome: 'skill_unavailable' });
      return;
    }
    if (actor.statuses.some((status) => status.type === 'silence') && skill) {
      emit({ round, type: 'action', actorId: actor.source.id, action: action.type, outcome: 'silenced' });
      return;
    }

    const energyCost = skill?.energyCost ?? 0;
    actor.energy -= energyCost;
    if (skill) {
      if (skill.isUltimate) actor.ultimateGauge = 0;
      else this.chargeUltimate(actor, energyCost > 0 ? 10 : 5);
      if ((skill.cooldown ?? 0) > 0) actor.cooldowns.set(skill.id, skill.cooldown ?? 0);
    }

    emit({ round, type: 'action', actorId: actor.source.id, targetId: target.source.id, action: action.type });
    if (skill?.healingMultiplier) {
      const amount = Math.max(1, Math.round(actor.source.stats.maxHp * skill.healingMultiplier));
      actor.hp = Math.min(actor.source.stats.maxHp, actor.hp + amount);
      emit({ round, type: 'heal', actorId: actor.source.id, targetId: actor.source.id, amount });
    }
    if (skill?.shieldMultiplier) {
      this.applyStatus(
        actor,
        { type: 'shield', duration: skill.cooldown ?? 3, value: actor.source.stats.maxHp * skill.shieldMultiplier },
        round,
        emit,
      );
    }

    const hits = Math.max(1, skill?.hits ?? 1);
    for (let hit = 0; hit < hits && target.hp > 0; hit += 1) {
      this.resolveHit(actor, target, action, skill, round, rng, emit);
    }
  }

  private canUseSkill(actor: RuntimeParticipant, skill: BattleSkill): boolean {
    return (
      actor.energy >= (skill.energyCost ?? 0) &&
      !actor.cooldowns.has(skill.id) &&
      (!skill.isUltimate || actor.ultimateGauge >= MAX_ULTIMATE)
    );
  }

  private resolveHit(
    actor: RuntimeParticipant,
    target: RuntimeParticipant,
    action: BattleAction,
    skill: BattleSkill | undefined,
    round: number,
    rng: Xorshift128,
    emit: (event: Omit<BattleEvent, 'sequence'>) => void,
  ): void {
    const element = skill?.element ?? actor.source.element ?? 'iron';
    const ultimate = skill?.isUltimate ?? false;
    const accuracy = Math.min(100, Math.max(0, actor.source.stats.accuracy + (skill?.accuracyBonus ?? 0) - (this.hasStatus(actor, 'blind') ? 30 : 0)));
    const hitChance = ultimate ? 100 : Math.max(5, accuracy - target.source.stats.evasion);
    if (!ultimate && rng.percent() >= hitChance) {
      actor.combo = 0;
      actor.comboElement = undefined;
      emit({ round, type: 'damage', actorId: actor.source.id, targetId: target.source.id, amount: 0, outcome: 'miss' });
      return;
    }

    if (target.parryMultiplier && !ultimate) {
      target.parryMultiplier = undefined;
      actor.combo = 0;
      actor.comboElement = undefined;
      const counterDamage = this.baseDamage(target, actor, 0.7, 'physical', 'iron');
      actor.hp = Math.max(0, actor.hp - counterDamage);
      emit({ round, type: 'counter', actorId: target.source.id, targetId: actor.source.id, amount: counterDamage, outcome: 'parry' });
      return;
    }

    const critical = skill?.guaranteedCrit || (ultimate && actor.source.stats.luck > 0) || rng.percent() < actor.source.stats.critRate + (skill?.critChanceBonus ?? 0);
    const multiplier = skill?.damageMultiplier ?? 1;
    const damageType = skill?.damageType ?? 'physical';
    let damage = this.baseDamage(actor, target, multiplier, damageType, element);
    const affinity = AFFINITY[element][target.source.element ?? 'iron'];
    damage *= affinity;
    if (this.hasStatus(target, 'weakness')) damage *= 1.25;
    if (element === 'frost' && this.hasStatus(target, 'freeze')) {
      damage *= 1.4;
      this.removeStatus(target, 'freeze', round, emit);
    }
    damage *= 1 + this.comboBonus(actor.combo + 1);
    if (critical) damage *= actor.source.stats.critDamage / 100;
    if (target.blockMultiplier) damage *= target.blockMultiplier;
    damage = Math.max(1, Math.round(damage));

    const shield = target.statuses.find((status) => status.type === 'shield');
    let shieldAbsorbed = 0;
    if (shield?.value) {
      shieldAbsorbed = Math.min(shield.value, damage);
      shield.value -= shieldAbsorbed;
      damage -= shieldAbsorbed;
      if (shield.value <= 0) this.removeStatus(target, 'shield', round, emit);
    }
    target.hp = Math.max(0, target.hp - damage);
    actor.combo = actor.comboElement === element ? actor.combo + 1 : 1;
    actor.comboElement = element;
    this.chargeUltimate(actor, Math.floor(damage / 100));
    this.chargeUltimate(target, Math.floor(damage / 50));
    if (actor.combo >= 10) this.chargeUltimate(actor, 50);
    emit({
      round,
      type: 'damage',
      actorId: actor.source.id,
      targetId: target.source.id,
      amount: damage,
      critical,
      outcome: affinity > 1 ? 'super_effective' : affinity < 1 ? 'resisted' : 'hit',
      metadata: { affinity, combo: actor.combo, shieldAbsorbed },
    });

    if (target.hp > 0 && !skill?.cannotBeCountered && !ultimate && actor.source.stats.attack > 0) {
      if (target.counterReady && !target.counterUsed) {
        target.counterUsed = true;
        target.counterReady = false;
        const counterDamage = this.baseDamage(target, actor, 0.6, 'physical', 'iron');
        actor.hp = Math.max(0, actor.hp - counterDamage);
        emit({ round, type: 'counter', actorId: target.source.id, targetId: actor.source.id, amount: counterDamage, outcome: 'counter' });
      }
    }
    if (skill?.status && target.hp > 0) {
      const resist = Math.min(0.95, (target.source.stats.luck / 1000) * 0.5);
      const chance = (skill.statusChance ?? 1) * (1 - resist);
      if (rng.percent() < chance * 100) {
        this.applyStatus(target, { ...skill.status, sourceAttack: actor.source.stats.attack }, round, emit);
      }
    }
  }

  private baseDamage(
    attacker: RuntimeParticipant,
    defender: RuntimeParticipant,
    multiplier: number,
    damageType: 'physical' | 'magic',
    _element: BattleElement,
  ): number {
    const attack = damageType === 'magic' ? attacker.source.stats.magicAttack : attacker.source.stats.attack;
    const defense = damageType === 'magic' ? defender.source.stats.magicDefense : defender.source.stats.defense;
    return Math.max(1, attack * multiplier - defense * DEFENSE_FACTOR);
  }

  private comboBonus(combo: number): number {
    const thresholds = Object.keys(COMBO_BONUS).map(Number).filter((threshold) => threshold <= combo);
    return thresholds.length === 0 ? 0 : COMBO_BONUS[Math.max(...thresholds)] ?? 0;
  }

  private chargeUltimate(participant: RuntimeParticipant, amount: number): void {
    participant.ultimateGauge = Math.min(MAX_ULTIMATE, Math.max(0, participant.ultimateGauge + amount));
  }

  private hasStatus(participant: RuntimeParticipant, type: StatusType): boolean {
    return participant.statuses.some((status) => status.type === type);
  }

  private applyStatus(
    participant: RuntimeParticipant,
    incoming: BattleStatus,
    round: number,
    emit: (event: Omit<BattleEvent, 'sequence'>) => void,
  ): void {
    const opposing = MUTUALLY_EXCLUSIVE[incoming.type];
    if (opposing) this.removeStatus(participant, opposing, round, emit);
    const existing = participant.statuses.find((status) => status.type === incoming.type);
    if (existing) {
      existing.duration = Math.max(existing.duration, incoming.duration);
      existing.stacks = Math.min(5, (existing.stacks ?? 1) + (incoming.stacks ?? 1));
      if (incoming.value !== undefined) existing.value = Math.max(existing.value ?? 0, incoming.value);
    } else {
      if (participant.statuses.length >= MAX_STATUSES) participant.statuses.shift();
      participant.statuses.push({ ...incoming, stacks: incoming.stacks ?? 1 });
    }
    emit({ round, type: 'status_applied', targetId: participant.source.id, status: incoming.type });
  }

  private removeStatus(
    participant: RuntimeParticipant,
    type: StatusType,
    round: number,
    emit: (event: Omit<BattleEvent, 'sequence'>) => void,
  ): void {
    const index = participant.statuses.findIndex((status) => status.type === type);
    if (index >= 0) {
      participant.statuses.splice(index, 1);
      emit({ round, type: 'status_removed', targetId: participant.source.id, status: type });
    }
  }
}

class Xorshift128 {
  private readonly state: [number, number, number, number];

  constructor(seed: string | number) {
    let hash = 2166136261;
    for (const character of String(seed)) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
    this.state = [
      hash >>> 0,
      (Math.imul(hash ^ 0x9e3779b9, 1664525) + 1013904223) >>> 0,
      (Math.imul(hash ^ 0x243f6a88, 1103515245) + 12345) >>> 0,
      (Math.imul(hash ^ 0xb7e15162, 22695477) + 1) >>> 0,
    ];
    if (this.state.every((value) => value === 0)) this.state[0] = 1;
  }

  next(): number {
    const [x, y, z, w] = this.state;
    const t = (x ^ (x << 11)) >>> 0;
    this.state[0] = y;
    this.state[1] = z;
    this.state[2] = w;
    this.state[3] = (w ^ (w >>> 19) ^ t ^ (t >>> 8)) >>> 0;
    return this.state[3];
  }

  int(min: number, max: number): number {
    if (max <= min) return min;
    return min + (this.next() % (max - min + 1));
  }

  percent(): number {
    return (this.next() / 0x100000000) * 100;
  }
}