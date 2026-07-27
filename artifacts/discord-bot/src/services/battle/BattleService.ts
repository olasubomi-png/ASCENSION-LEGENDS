import { generateIdWithPrefix } from '../../utils/ulid.js';
import { ID_PREFIXES } from '../../constants/index.js';
import { BattleEngine } from './BattleEngine.js';
import type { BattleInput, BattleParticipant, BattleResult } from './types.js';

export interface BattleStartOptions {
  participants: [BattleParticipant, BattleParticipant];
  seed?: string | number;
  battleId?: string;
  actions?: BattleInput['actions'];
  maxRounds?: number;
  type?: BattleInput['type'];
}

/**
 * Application boundary around the deterministic engine.
 *
 * Persistence is intentionally injected later: this service keeps the latest
 * replay in memory for now, while callers already receive a complete result.
 */
export class BattleService {
  private readonly replays = new Map<string, BattleResult>();

  constructor(private readonly engine = new BattleEngine()) {}

  async initiateBattle(attackerId: string, defenderId: string, options?: BattleStartOptions): Promise<BattleResult> {
    if (!options?.participants) {
      throw new Error('Battle participants and stats are required to start a battle');
    }
    const battleId = options.battleId ?? generateIdWithPrefix(ID_PREFIXES.BATTLE);
    const result = this.engine.run({
      battleId,
      seed: options.seed ?? `${attackerId}:${defenderId}`,
      participants: options.participants,
      actions: options.actions,
      maxRounds: options.maxRounds,
      type: options.type,
    });
    this.replays.set(battleId, result);
    return result;
  }

  async getBattleReplay(battleId: string): Promise<BattleResult | null> {
    return this.replays.get(battleId) ?? null;
  }
}
