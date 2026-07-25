import { economyValidator } from '../../validators/economy.validator.js';

describe('economyValidator.amount', () => {
  it('accepts valid positive integers', () => {
    expect(economyValidator.amount.safeParse(1).success).toBe(true);
    expect(economyValidator.amount.safeParse(1000).success).toBe(true);
    expect(economyValidator.amount.safeParse(1_000_000).success).toBe(true);
  });

  it('rejects zero and negative numbers', () => {
    expect(economyValidator.amount.safeParse(0).success).toBe(false);
    expect(economyValidator.amount.safeParse(-1).success).toBe(false);
  });

  it('rejects amounts exceeding the maximum', () => {
    expect(economyValidator.amount.safeParse(1_000_001).success).toBe(false);
  });

  it('rejects non-integer amounts', () => {
    expect(economyValidator.amount.safeParse(1.5).success).toBe(false);
  });
});

describe('economyValidator.currency', () => {
  it('accepts gold and gems', () => {
    expect(economyValidator.currency.safeParse('gold').success).toBe(true);
    expect(economyValidator.currency.safeParse('gems').success).toBe(true);
  });

  it('rejects unknown currencies', () => {
    expect(economyValidator.currency.safeParse('diamonds').success).toBe(false);
    expect(economyValidator.currency.safeParse('').success).toBe(false);
  });
});
