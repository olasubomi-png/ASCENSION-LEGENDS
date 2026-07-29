/**
 * A single live battle session.
 *
 * Wraps BattleEngine with session lifecycle semantics:
 *   CREATED → RUNNING → COMPLETED (or ERROR)
 *
 * Actions may be pre-loaded before run() or appended up until the moment
 * the session starts.  Once run() returns the session is immutable.
 *
 * @see Book 3, Section 5.1 — BattleService responsibilities
 */
import { ID_PREFIXES } from '../../constants/index.js';
import { generateIdWithPrefix } from '../../utils/ulid.js';

import { ActionQueue } from './ActionQueue.js';
import { BattleEngine } from './BattleEngine.js';
import type { IBattleLogger } from './interfaces/IBattleLogger.js';
import type { BattleAction, BattleInput, BattleParticipant, BattleResult, BattleType } from './types.js';

export type SessionStatus = 'created' | 'running' | 'completed' | 'error';

export interface BattleSessionOptions {
  /** Pre-generated battle ID; one will be generated if not provided. */
  battleId?: string;
  /** Deterministic seed; defaults to attacker:defender composite key. */
  seed?: string | number;
  participants: [BattleParticipant, BattleParticipant];
  maxRounds?: number;
  type?: BattleType;
}

export class BattleSession {
  private readonly engine: BattleEngine;
  private readonly queue: ActionQueue;
  private readonly logger?: IBattleLogger;

  private _result: BattleResult | null = null;
  private _status: SessionStatus = 'created';
  private _error: Error | null = null;

  readonly battleId: string;
  readonly seed: string | number;
  readonly type: BattleType;

  private readonly participants: [BattleParticipant, BattleParticipant];
  private readonly maxRounds: number;

  constructor(options: BattleSessionOptions, logger?: IBattleLogger) {
    this.participants = options.participants;
    this.maxRounds = options.maxRounds ?? 50;
    this.type = options.type ?? 'pve';
    this.battleId =
      options.battleId ?? generateIdWithPrefix(ID_PREFIXES.BATTLE);
    this.seed =
      options.seed ??
      `${options.participants[0].id}:${options.participants[1].id}`;

    this.engine = new BattleEngine();
    this.queue = new ActionQueue();
    this.logger = logger;
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  /**
   * Queue an action to be executed during the battle.
   *
   * @throws Error if the session has already completed.
   */
  addAction(action: BattleAction): void {
    if (this._status === 'completed' || this._status === 'error') {
      throw new Error(`Cannot add actions to a ${this._status} battle session`);
    }
    this.queue.add(action);
  }

  /**
   * Queue multiple actions.
   */
  addActions(actions: BattleAction[]): void {
    for (const action of actions) this.addAction(action);
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────────

  /**
   * Execute the battle synchronously and return the result.
   *
   * Calling run() on a completed session returns the cached result without
   * re-running (idempotent).
   *
   * @returns BattleResult — the complete, deterministic battle record.
   * @throws Error if the engine throws unexpectedly.
   */
  run(): BattleResult {
    if (this._status === 'completed' && this._result) return this._result;
    if (this._status === 'error') throw this._error ?? new Error('Session previously errored');

    this._status = 'running';
    this.logger?.logBattleStart(this.battleId, this.seed, this.type);

    try {
      const input: BattleInput = {
        battleId: this.battleId,
        seed: this.seed,
        participants: this.participants,
        actions: [...this.queue.getAll()],
        maxRounds: this.maxRounds,
        type: this.type,
      };

      this._result = this.engine.run(input);
      this._status = 'completed';
      this.logger?.logBattleEnd(
        this.battleId,
        this._result.outcome,
        this._result.winnerId,
        this._result.rounds,
      );
      return this._result;
    } catch (err) {
      this._status = 'error';
      this._error = err instanceof Error ? err : new Error(String(err));
      this.logger?.logError(this.battleId, 'Battle engine threw an unexpected error', {
        message: this._error.message,
      });
      throw this._error;
    }
  }

  // ─── Accessors ──────────────────────────────────────────────────────────────

  get status(): SessionStatus { return this._status; }
  get result(): BattleResult | null { return this._result; }
  get error(): Error | null { return this._error; }
  get isCompleted(): boolean { return this._status === 'completed'; }
  get queuedActionCount(): number { return this.queue.size; }
}
