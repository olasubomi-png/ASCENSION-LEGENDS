import { SeededRandom } from '../../services/battle/SeededRandom.js';

describe('SeededRandom', () => {
  it('produces the same sequence for the same string seed', () => {
    const a = new SeededRandom('battle-abc');
    const b = new SeededRandom('battle-abc');
    const samples = 20;
    for (let i = 0; i < samples; i++) {
      expect(b.next()).toBe(a.next());
    }
  });

  it('produces the same sequence for the same numeric seed', () => {
    const a = new SeededRandom(42);
    const b = new SeededRandom(42);
    for (let i = 0; i < 20; i++) {
      expect(b.next()).toBe(a.next());
    }
  });

  it('produces different sequences for different seeds', () => {
    const a = new SeededRandom('seed-a');
    const b = new SeededRandom('seed-b');
    const results: boolean[] = [];
    for (let i = 0; i < 10; i++) {
      results.push(a.next() !== b.next());
    }
    // At least one value should differ.
    expect(results.some(Boolean)).toBe(true);
  });

  it('int(min, max) returns values in [min, max] inclusive', () => {
    const rng = new SeededRandom('int-test');
    const min = 5;
    const max = 15;
    for (let i = 0; i < 500; i++) {
      const v = rng.int(min, max);
      expect(v).toBeGreaterThanOrEqual(min);
      expect(v).toBeLessThanOrEqual(max);
    }
  });

  it('int(n, n) always returns n', () => {
    const rng = new SeededRandom('edge');
    for (let i = 0; i < 20; i++) {
      expect(rng.int(7, 7)).toBe(7);
    }
  });

  it('int(max < min) returns min', () => {
    const rng = new SeededRandom('edge');
    expect(rng.int(10, 5)).toBe(10);
  });

  it('percent() returns values in [0, 100)', () => {
    const rng = new SeededRandom('pct-test');
    for (let i = 0; i < 500; i++) {
      const v = rng.percent();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(100);
    }
  });

  it('does not use Math.random (next() is deterministic without Date/Math entropy)', () => {
    // If this test is flaky Math.random is somehow involved — it must not be.
    const r1 = new SeededRandom('determinism');
    const r2 = new SeededRandom('determinism');
    expect(r1.next()).toBe(r2.next());
    expect(r1.next()).toBe(r2.next());
  });

  it('survives string(number) seed equality', () => {
    const a = new SeededRandom(1234);
    const b = new SeededRandom('1234');
    // String and numeric seeds of the same value hash differently — that's fine,
    // we just verify each is internally consistent.
    const va = a.next();
    const vb = b.next();
    // They differ unless the hash collision is by coincidence.
    const a2 = new SeededRandom(1234);
    expect(a2.next()).toBe(va);
    const b2 = new SeededRandom('1234');
    expect(b2.next()).toBe(vb);
  });
});
