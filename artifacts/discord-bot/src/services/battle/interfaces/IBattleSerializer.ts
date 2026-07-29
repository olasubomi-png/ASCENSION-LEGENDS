import type { BattleResult } from '../types.js';

export interface IBattleSerializer {
  serialize(result: BattleResult): string;
  deserialize(json: string): BattleResult;
  summarize(result: BattleResult): string;
}
