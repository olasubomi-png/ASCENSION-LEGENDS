import type { DamageInput, DamageResult } from '../DamageCalculator.js';

export interface IDamageCalculator {
  calculate(input: DamageInput): DamageResult;
}
