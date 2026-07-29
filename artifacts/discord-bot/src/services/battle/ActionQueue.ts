/**
 * Round-scoped action queue.
 *
 * Stores planned BattleActions indexed by (round, actorId). When a round is
 * resolved the engine asks for each actor's action; if none was queued the
 * queue falls back to a basic attack.
 *
 * Thread-safety note: this runs synchronously inside the pure engine — no
 * concurrency concerns.
 */
import type { BattleAction, BattleActionType } from './types.js';

export class ActionQueue {
  private readonly actions: BattleAction[] = [];

  /**
   * Enqueue an action for a specific round and actor.
   * Overwrites any previously queued action for the same (round, actorId) pair.
   */
  add(action: BattleAction): void {
    const existing = this.actions.findIndex(
      (a) => a.actorId === action.actorId && (a.round ?? 1) === (action.round ?? 1),
    );
    if (existing >= 0) {
      this.actions[existing] = action;
    } else {
      this.actions.push(action);
    }
  }

  /**
   * Add multiple actions at once.
   */
  addAll(actions: BattleAction[]): void {
    for (const action of actions) {
      this.add(action);
    }
  }

  /**
   * Retrieve the action for the given round and actor.
   * Falls back to a basic attack targeting `defaultTargetId` if nothing was queued.
   *
   * @param round           - Current round number.
   * @param actorId         - The acting participant's ID.
   * @param defaultTargetId - Fallback target for the generated basic attack.
   */
  dequeue(round: number, actorId: string, defaultTargetId: string): BattleAction {
    const planned = this.actions.find(
      (a) => a.actorId === actorId && (a.round ?? 1) === round,
    );
    return planned ?? this.defaultAction(actorId, defaultTargetId);
  }

  /**
   * Remove all actions queued for a given round (call after the round resolves).
   */
  clearRound(round: number): void {
    let i = this.actions.length;
    while (i--) {
      const action = this.actions[i];
      if (action !== undefined && (action.round ?? 1) === round) {
        this.actions.splice(i, 1);
      }
    }
  }

  /** Remove all queued actions. */
  clear(): void {
    this.actions.length = 0;
  }

  /** Read-only view of all queued actions. */
  getAll(): readonly BattleAction[] {
    return this.actions;
  }

  /** Number of queued actions. */
  get size(): number {
    return this.actions.length;
  }

  private defaultAction(actorId: string, targetId: string): BattleAction {
    return { actorId, targetId, type: 'attack' as BattleActionType };
  }
}
