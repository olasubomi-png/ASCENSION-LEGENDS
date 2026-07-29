/**
 * BattleCoordinator — orchestrates BattleSessions with cross-cutting concerns.
 *
 * Responsibilities:
 *   • Create and track BattleSessions by battleId
 *   • Emit BattleEvents for subscribers (render workers, analytics, etc.)
 *   • Log structured battle outcomes
 *   • Persist serialized replays in-memory (stub; persistence layer injected later)
 *   • Expose replays for retrieval
 *
 * @see Book 3, Section 1.3.1 — Battle Command Flow
 * @see Book 3, Section 5.1 — BattleService (parent of coordinator)
 */
import type { BattleEvents } from './BattleEvents.js';
import { BattleSerializer } from './BattleSerializer.js';
import { BattleSession } from './BattleSession.js';
import type { BattleSessionOptions } from './BattleSession.js';
import type { IBattleLogger } from './interfaces/IBattleLogger.js';
import type { BattleResult } from './types.js';

export interface BattleCoordinatorDeps {
  logger?: IBattleLogger;
  serializer?: BattleSerializer;
  events?: BattleEvents;
}

export class BattleCoordinator {
  private readonly sessions = new Map<string, BattleSession>();
  private readonly replays = new Map<string, BattleResult>();

  private readonly logger?: IBattleLogger;
  private readonly serializer: BattleSerializer;
  private readonly events?: BattleEvents;

  constructor(deps: BattleCoordinatorDeps = {}) {
    this.logger = deps.logger;
    this.serializer = deps.serializer ?? new BattleSerializer();
    this.events = deps.events;
  }

  // ─── Session management ──────────────────────────────────────────────────────

  /**
   * Create a new BattleSession and register it.
   *
   * @param options - Session configuration (participants, seed, etc.).
   * @returns The created, unstarted session.
   * @throws Error if a session with the same battleId already exists.
   */
  createSession(options: BattleSessionOptions): BattleSession {
    const session = new BattleSession(options, this.logger);
    if (this.sessions.has(session.battleId)) {
      throw new Error(`Session already exists for battleId: ${session.battleId}`);
    }
    this.sessions.set(session.battleId, session);
    return session;
  }

  /**
   * Execute a session to completion: emit start/end events, save replay.
   *
   * @param session - A session produced by createSession().
   * @returns The complete BattleResult.
   */
  async coordinate(session: BattleSession): Promise<BattleResult> {
    this.events?.emitBattleStart({
      battleId: session.battleId,
      seed: session.seed,
      type: session.type,
    });

    const result = session.run();

    // Cache serialized replay.
    this.replays.set(session.battleId, result);

    this.events?.emitBattleEnd({
      battleId: session.battleId,
      outcome: result.outcome,
      winnerId: result.winnerId,
      rounds: result.rounds,
    });

    return result;
  }

  // ─── Retrieval ───────────────────────────────────────────────────────────────

  getSession(battleId: string): BattleSession | null {
    return this.sessions.get(battleId) ?? null;
  }

  getReplay(battleId: string): BattleResult | null {
    return this.replays.get(battleId) ?? null;
  }

  getSerializedReplay(battleId: string): string | null {
    const result = this.replays.get(battleId);
    if (!result) return null;
    return this.serializer.serialize(result);
  }

  /** Number of sessions ever created by this coordinator. */
  get sessionCount(): number {
    return this.sessions.size;
  }
}
