import type { CritInput, CritResult } from '../CriticalCalculator.js';

import type { ISeededRandom } from './ISeededRandom.js';

export interface ICriticalCalculator {
  evaluate(input: CritInput, rng: ISeededRandom): CritResult;
  effectiveCritChance(input: Pick<CritInput, 'critRate' | 'luck' | 'critChanceBonus'>): number;
}
