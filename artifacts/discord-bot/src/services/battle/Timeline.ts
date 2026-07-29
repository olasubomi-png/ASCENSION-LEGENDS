/**
 * Ordered, queryable timeline of BattleEvents.
 *
 * The BattleEngine emits events in strictly ascending sequence order.
 * Timeline stores them and exposes query helpers so callers can inspect
 * individual turns, actors, or event types without scanning the raw array.
 *
 * @see Book 3, Section 6.12 — Replay Generation (TurnRecord structure)
 */
import type { BattleEvent, BattleEventType, StatusType } from './types.js';

export class Timeline {
  private readonly events: BattleEvent[] = [];

  /** Append an event to the end of the timeline. */
  push(event: BattleEvent): void {
    this.events.push(event);
  }

  /** Append multiple events in order. */
  pushAll(events: BattleEvent[]): void {
    for (const event of events) this.events.push(event);
  }

  /** All events matching the given type. */
  findByType(type: BattleEventType): BattleEvent[] {
    return this.events.filter((e) => e.type === type);
  }

  /** All events where actorId or targetId matches `participantId`. */
  findByParticipant(participantId: string): BattleEvent[] {
    return this.events.filter(
      (e) => e.actorId === participantId || e.targetId === participantId,
    );
  }

  /** All events where actorId matches. */
  findByActor(actorId: string): BattleEvent[] {
    return this.events.filter((e) => e.actorId === actorId);
  }

  /** All events from a given round. */
  findByRound(round: number): BattleEvent[] {
    return this.events.filter((e) => e.round === round);
  }

  /** Events in a closed sequence range [fromSeq, toSeq]. */
  getRange(fromSeq: number, toSeq: number): BattleEvent[] {
    return this.events.filter((e) => e.sequence >= fromSeq && e.sequence <= toSeq);
  }

  /** Total damage dealt by a participant across the entire battle. */
  totalDamageByActor(actorId: string): number {
    return this.events
      .filter((e) => e.type === 'damage' && e.actorId === actorId && (e.amount ?? 0) > 0)
      .reduce((sum, e) => sum + (e.amount ?? 0), 0);
  }

  /** All status_tick events for a given status type. */
  findStatusTicks(status: StatusType): BattleEvent[] {
    return this.events.filter((e) => e.type === 'status_tick' && e.status === status);
  }

  /** Immutable snapshot of all events. */
  toArray(): readonly BattleEvent[] {
    return [...this.events];
  }

  /** Number of events recorded. */
  get length(): number {
    return this.events.length;
  }

  /** Last recorded event or undefined if empty. */
  get last(): BattleEvent | undefined {
    return this.events[this.events.length - 1];
  }

  /** Reset — clear all events. */
  clear(): void {
    this.events.length = 0;
  }
}
