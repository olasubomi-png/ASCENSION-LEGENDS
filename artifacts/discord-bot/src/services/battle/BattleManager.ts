/**
 * BattleManager — top-level entry point for the battle system.
 *
 * Provides a single, dependency-injected facade over BattleCoordinator.
 * Command handlers and services should only interact with BattleManager,
 * never directly with BattleSession or BattleEngine.
 *
 * Dependency injection:
 *   All collaborators are injected (or default-constructed) in the constructor,
 *   enabling clean unit tests via mocked dependencies.
 *
 * @see Book 3, Section 1.3.1 — Battle Command Flow
 * @see Book 3, Section 5.1 — IBattleService (this fulfils the engine half)
 */
import { BattleCoordinator } from './BattleCoordinator.js';
import type { BattleEvents } from './BattleEvents.js';
import { BattleSerializer } from './BattleSerializer.js';
import type { BattleSession } from './BattleSession.js';
import type { IBattleLogger } from './interfaces/IBattleLogger.js';
import type { BattleAction, BattleParticipant, BattleResult, BattleType } from './types.js';

export interface CreateBattleOptions {
  participants: [BattleParticipant, BattleParticipant];
  /** Pre-computed seed. Defaults to `${attacker.id}:${defender.id}`. */
  seed?: string | number;
  /** Pre-computed battle ID. One is generated if not provided. */
  battleId?: string;
  /** Pre-planned actions (e.g. PvE scripted enemy moves). */
  actions?: BattleAction[];
  maxRounds?: number;
  type?: BattleType;
}

export class BattleManager {
  private readonly coordinator: BattleCoordinator;

  /**
   * @param logger     - Optional battle logger (omit in tests / when logging is not needed).
   * @param serializer - Replay serializer.
   * @param events     - Optional event bus for subscribers.
   */
  constructor(
    logger?: IBattleLogger,
    serializer = new BattleSerializer(),
    events?: BattleEvents,
  ) {
    this.coordinator = new BattleCoordinator({ logger, serializer, events });
  }

  // ─── Primary API ─────────────────────────────────────────────────────────────

  /**
   * Create a session, optionally pre-load actions, run it to completion, and
   * return the deterministic BattleResult.
   *
   * @param options - Participants, seed, actions, and configuration.
   * @returns Promise resolving to the complete battle record.
   */
  async runBattle(options: CreateBattleOptions): Promise<BattleResult> {
    const session = this.coordinator.createSession({
      battleId: options.battleId,
      seed: options.seed,
      participants: options.participants,
      maxRounds: options.maxRounds,
      type: options.type,
    });

    if (options.actions?.length) {
      session.addActions(options.actions);
    }

    return this.coordinator.coordinate(session);
  }

  /**
   * Create a session without running it — useful when actions will be added
   * incrementally (e.g. live PvP with per-round input).
   *
   * Call session.run() when all actions are ready.
   */
  createSession(options: Omit<CreateBattleOptions, 'actions'>): BattleSession {
    return this.coordinator.createSession({
      battleId: options.battleId,
      seed: options.seed,
      participants: options.participants,
      maxRounds: options.maxRounds,
      type: options.type,
    });
  }

  // ─── Retrieval ───────────────────────────────────────────────────────────────

  /**
   * Retrieve a live or completed session.
   */
  getSession(battleId: string): BattleSession | null {
    return this.coordinator.getSession(battleId);
  }

  /**
   * Retrieve the full BattleResult for a completed battle.
   */
  getReplay(battleId: string): BattleResult | null {
    return this.coordinator.getReplay(battleId);
  }

  /**
   * Retrieve a JSON-serialized replay string (for persistence / audit).
   */
  getSerializedReplay(battleId: string): string | null {
    return this.coordinator.getSerializedReplay(battleId);
  }
}
