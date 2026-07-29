/**
 * Serialize / deserialize BattleResult for persistence and replay.
 *
 * BattleResult is plain JSON-safe except for Map<string, number> cooldown fields
 * in participant states, which require a custom replacer/reviver.
 *
 * @see Book 3, Section 6.12 — Replay Generation
 */
import type { BattleResult } from './types.js';

const MAP_TAG = '__Map__';

export class BattleSerializer {
  /**
   * Serialize a BattleResult to a JSON string.
   * Maps are converted to `{ __Map__: true, entries: [k, v][] }` objects.
   *
   * @param result - The battle result to serialize.
   * @returns JSON string.
   */
  serialize(result: BattleResult): string {
    return JSON.stringify(result, (_key, value: unknown) => {
      if (value instanceof Map) {
        return { [MAP_TAG]: true, entries: [...(value as Map<unknown, unknown>).entries()] };
      }
      return value;
    });
  }

  /**
   * Deserialize a JSON string back into a BattleResult.
   * Restores Map objects from their serialized form.
   *
   * @param json - JSON string produced by serialize().
   * @returns Reconstructed BattleResult.
   * @throws SyntaxError if the JSON is malformed.
   */
  deserialize(json: string): BattleResult {
    return JSON.parse(json, (_key, value: unknown) => {
      if (
        value !== null &&
        typeof value === 'object' &&
        MAP_TAG in (value as Record<string, unknown>) &&
        Array.isArray((value as Record<string, unknown>)['entries'])
      ) {
        return new Map((value as { entries: [unknown, unknown][] }).entries);
      }
      return value;
    }) as BattleResult;
  }

  /**
   * Returns a compact summary string suitable for logging (not for replay).
   */
  summarize(result: BattleResult): string {
    return JSON.stringify({
      battleId: result.battleId,
      seed: result.seed,
      type: result.type,
      outcome: result.outcome,
      winnerId: result.winnerId,
      rounds: result.rounds,
      eventCount: result.events.length,
    });
  }
}
