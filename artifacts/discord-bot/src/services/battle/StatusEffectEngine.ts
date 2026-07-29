/**
 * Status effect lifecycle engine.
 *
 * Handles: apply (with stacking rules), tick (DoT / HoT per turn), and removal.
 *
 * Book 1 status effect rules (Sections 8.2–8.14):
 *   Burn:         15 % of sourceAttack per turn × stacks (max 5)
 *   Poison:       10 % of sourceAttack, escalates +5 % per turn, max 30 %, ignores Defense
 *   Bleed:        2 % of target's MAX HP per stack per turn; min 50 HP
 *   Regeneration: 1.5 % of target's MAX HP per turn (heal)
 *   Shock:        12 % of sourceAttack + −20 Energy per turn
 *   All others:   No per-turn effect; control / stat debuff only
 *
 * Mutual exclusions:
 *   Burn ↔ Freeze: applying one removes the other
 */
import type { BattleParticipantState } from './BattleState.js';
import type { BattleEvent, BattleStatus, StatusType } from './types.js';

export type EmitFn = (event: Omit<BattleEvent, 'sequence'>) => void;

const MAX_STATUSES = 4;

const MUTUALLY_EXCLUSIVE: Partial<Record<StatusType, StatusType>> = {
  burn: 'freeze',
  freeze: 'burn',
};

export class StatusEffectEngine {
  /**
   * Process per-turn ticks for every status on the participant.
   * Decrements durations and removes expired statuses.
   *
   * @param participant - Mutable participant state to update.
   * @param round       - Current round (for event metadata).
   * @param emit        - Function to emit battle events.
   */
  tick(participant: BattleParticipantState, round: number, emit: EmitFn): void {
    for (const status of [...participant.statuses]) {
      this.processStatusTick(participant, status, round, emit);
      status.duration -= 1;
      if (status.duration <= 0) {
        this.remove(participant, status.type, round, emit);
      }
    }
  }

  /**
   * Apply a status to a participant, respecting stacking and mutual-exclusion rules.
   *
   * @param participant - Mutable participant state.
   * @param incoming    - The status to apply (duration, stacks, value).
   * @param round       - Current round.
   * @param emit        - Event emitter.
   */
  apply(participant: BattleParticipantState, incoming: BattleStatus, round: number, emit: EmitFn): void {
    // Remove mutually exclusive status first.
    const opposing = MUTUALLY_EXCLUSIVE[incoming.type];
    if (opposing) this.remove(participant, opposing, round, emit);

    const existing = participant.statuses.find((s) => s.type === incoming.type);
    if (existing) {
      // Refresh duration (keep the longer of the two) and increment stacks.
      existing.duration = Math.max(existing.duration, incoming.duration);
      existing.stacks = Math.min(5, (existing.stacks ?? 1) + (incoming.stacks ?? 1));
      if (incoming.value !== undefined) {
        existing.value = Math.max(existing.value ?? 0, incoming.value);
      }
    } else {
      // Evict oldest status if at the cap.
      if (participant.statuses.length >= MAX_STATUSES) participant.statuses.shift();
      participant.statuses.push({ ...incoming, stacks: incoming.stacks ?? 1 });
    }

    emit({ round, type: 'status_applied', targetId: participant.id, status: incoming.type });
  }

  /**
   * Remove a status by type. No-op if not present.
   */
  remove(participant: BattleParticipantState, type: StatusType, round: number, emit: EmitFn): void {
    const index = participant.statuses.findIndex((s) => s.type === type);
    if (index >= 0) {
      participant.statuses.splice(index, 1);
      emit({ round, type: 'status_removed', targetId: participant.id, status: type });
    }
  }

  /**
   * True if the participant currently has the given status.
   */
  has(participant: BattleParticipantState, type: StatusType): boolean {
    return participant.statuses.some((s) => s.type === type);
  }

  /**
   * True if the participant is incapacitated (cannot act this turn).
   * Book 1: freeze, sleep, stun all skip the turn.
   */
  isIncapacitated(participant: BattleParticipantState): boolean {
    return this.has(participant, 'freeze') || this.has(participant, 'sleep') || this.has(participant, 'stun');
  }

  // ─── Private helpers ────────────────────────────────────────────────────────

  private processStatusTick(
    participant: BattleParticipantState,
    status: BattleStatus,
    round: number,
    emit: EmitFn,
  ): void {
    const sourceAttack = status.sourceAttack ?? participant.stats.attack;
    const stacks = status.stacks ?? 1;

    switch (status.type) {
      case 'burn': {
        const amount = Math.max(1, Math.round(sourceAttack * 0.15 * stacks));
        participant.hp = Math.max(0, participant.hp - amount);
        emit({ round, type: 'status_tick', actorId: participant.id, amount, status: 'burn' });
        break;
      }
      case 'poison': {
        // Escalates +5 % per tick based on elapsed ticks. We use stacks as tick count proxy.
        const rate = Math.min(0.3, 0.1 + (stacks - 1) * 0.05);
        const amount = Math.max(1, Math.round(sourceAttack * rate));
        participant.hp = Math.max(0, participant.hp - amount);
        emit({ round, type: 'status_tick', actorId: participant.id, amount, status: 'poison' });
        break;
      }
      case 'bleed': {
        const amount = Math.max(50, Math.round(participant.stats.maxHp * 0.02 * stacks));
        participant.hp = Math.max(0, participant.hp - amount);
        emit({ round, type: 'status_tick', actorId: participant.id, amount, status: 'bleed' });
        break;
      }
      case 'regeneration': {
        const amount = Math.max(1, Math.round(participant.stats.maxHp * 0.015));
        participant.hp = Math.min(participant.stats.maxHp, participant.hp + amount);
        emit({ round, type: 'status_tick', actorId: participant.id, amount, status: 'regeneration' });
        break;
      }
      case 'shock': {
        const dmg = Math.max(1, Math.round(sourceAttack * 0.12));
        participant.hp = Math.max(0, participant.hp - dmg);
        const energyDrain = Math.min(20, participant.energy);
        participant.energy = Math.max(0, participant.energy - 20);
        emit({
          round,
          type: 'status_tick',
          actorId: participant.id,
          amount: dmg,
          status: 'shock',
          metadata: { energyDrain },
        });
        break;
      }
      // Control / debuff statuses — no per-turn numerical effect.
      default:
        break;
    }
  }
}
