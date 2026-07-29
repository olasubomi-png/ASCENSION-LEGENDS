import type { EvasionInput } from '../EvasionCalculator.js';

export interface IEvasionCalculator {
  dodgeChance(input: EvasionInput): number;
}
