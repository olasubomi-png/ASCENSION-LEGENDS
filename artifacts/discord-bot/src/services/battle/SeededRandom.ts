/**
 * Deterministic seeded PRNG interface and implementation.
 * Zero Math.random() calls — every sequence is reproducible given the same seed.
 *
 * Algorithm: Xorshift128 (George Marsaglia, 2003).
 * Period: 2^128 − 1. Fast, low-memory, passes all BigCrush tests.
 *
 * @see Book 3, Section 6.13 — Deterministic Simulation
 */
export interface ISeededRandom {
  /** Returns a raw 32-bit unsigned integer. */
  next(): number;
  /** Returns a uniformly distributed integer in [min, max] inclusive. */
  int(min: number, max: number): number;
  /**
   * Returns a float in [0, 100).
   * Use for percentage-based checks: `rng.percent() < 30` ≈ 30% chance.
   */
  percent(): number;
}

/**
 * Xorshift128 PRNG.
 *
 * Seeding uses FNV-1a to hash the seed string into four 32-bit state words,
 * ensuring even short seeds produce well-distributed initial states.
 *
 * Usage:
 * ```ts
 * const rng = new SeededRandom('battle-seed-001');
 * const roll = rng.int(1, 100);      // random integer [1, 100]
 * const isCrit = rng.percent() < 25; // 25 % chance
 * ```
 */
export class SeededRandom implements ISeededRandom {
  private readonly state: [number, number, number, number];

  constructor(seed: string | number) {
    // FNV-1a hash for good avalanche from short seeds.
    let hash = 2166136261;
    for (const char of String(seed)) {
      hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
    }
    this.state = [
      hash >>> 0,
      (Math.imul(hash ^ 0x9e3779b9, 1664525) + 1013904223) >>> 0,
      (Math.imul(hash ^ 0x243f6a88, 1103515245) + 12345) >>> 0,
      (Math.imul(hash ^ 0xb7e15162, 22695477) + 1) >>> 0,
    ];
    // Guard against all-zero state (degenerate case).
    if (this.state.every((v) => v === 0)) this.state[0] = 1;
  }

  /** Advance the state one step and return the new output word. */
  next(): number {
    const [x, y, z, w] = this.state;
    const t = (x ^ (x << 11)) >>> 0;
    this.state[0] = y;
    this.state[1] = z;
    this.state[2] = w;
    this.state[3] = (w ^ (w >>> 19) ^ t ^ (t >>> 8)) >>> 0;
    return this.state[3];
  }

  int(min: number, max: number): number {
    if (max <= min) return min;
    return min + (this.next() % (max - min + 1));
  }

  percent(): number {
    return (this.next() / 0x100000000) * 100;
  }
}
