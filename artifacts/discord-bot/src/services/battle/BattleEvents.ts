/**
 * Typed EventEmitter for battle lifecycle events.
 *
 * Consumers can subscribe to coarse-grained lifecycle events without parsing
 * the raw BattleEvent stream.  All emits are synchronous and non-blocking.
 *
 * Events:
 *   'battle:start'  — emitted when a battle is initialised
 *   'battle:end'    — emitted when a battle resolves (win / draw / retreat)
 *   'round:start'   — emitted at the beginning of each round
 *   'round:end'     — emitted at the end of each round
 *   'turn:event'    — emitted for every structured BattleEvent from the engine
 */
import { EventEmitter } from 'node:events';

import type { BattleEvent, BattleOutcome, BattleType } from './types.js';

export interface BattleStartPayload {
  battleId: string;
  seed: string | number;
  type: BattleType;
}

export interface BattleEndPayload {
  battleId: string;
  outcome: BattleOutcome;
  winnerId?: string;
  rounds: number;
}

export interface RoundPayload {
  battleId: string;
  round: number;
}

export interface TurnEventPayload {
  battleId: string;
  event: BattleEvent;
}

export declare interface BattleEvents {
  on(event: 'battle:start', listener: (payload: BattleStartPayload) => void): this;
  on(event: 'battle:end', listener: (payload: BattleEndPayload) => void): this;
  on(event: 'round:start', listener: (payload: RoundPayload) => void): this;
  on(event: 'round:end', listener: (payload: RoundPayload) => void): this;
  on(event: 'turn:event', listener: (payload: TurnEventPayload) => void): this;
  emit(event: 'battle:start', payload: BattleStartPayload): boolean;
  emit(event: 'battle:end', payload: BattleEndPayload): boolean;
  emit(event: 'round:start', payload: RoundPayload): boolean;
  emit(event: 'round:end', payload: RoundPayload): boolean;
  emit(event: 'turn:event', payload: TurnEventPayload): boolean;
}

/**
 * BattleEvents — typed EventEmitter for the battle system.
 *
 * Usage:
 * ```ts
 * const events = new BattleEvents();
 * events.on('battle:end', ({ battleId, outcome }) => {
 *   console.log(`Battle ${battleId} ended: ${outcome}`);
 * });
 * ```
 */
 
export class BattleEvents extends EventEmitter {
  emitBattleStart(payload: BattleStartPayload): void {
    this.emit('battle:start', payload);
  }

  emitBattleEnd(payload: BattleEndPayload): void {
    this.emit('battle:end', payload);
  }

  emitRoundStart(payload: RoundPayload): void {
    this.emit('round:start', payload);
  }

  emitRoundEnd(payload: RoundPayload): void {
    this.emit('round:end', payload);
  }

  emitTurnEvent(payload: TurnEventPayload): void {
    this.emit('turn:event', payload);
  }
}
