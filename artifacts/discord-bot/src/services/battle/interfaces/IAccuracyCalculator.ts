import type { AccuracyInput } from '../AccuracyCalculator.js';

export interface IAccuracyCalculator {
  hitChance(input: AccuracyInput): number;
}
