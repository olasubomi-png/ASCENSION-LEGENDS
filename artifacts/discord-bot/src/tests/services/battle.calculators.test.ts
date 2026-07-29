import { AccuracyCalculator } from '../../services/battle/AccuracyCalculator.js';
import { CriticalCalculator } from '../../services/battle/CriticalCalculator.js';
import { DamageCalculator } from '../../services/battle/DamageCalculator.js';
import { EvasionCalculator } from '../../services/battle/EvasionCalculator.js';
import { SeededRandom } from '../../services/battle/SeededRandom.js';

// ─── DamageCalculator ──────────────────────────────────────────────────────────

describe('DamageCalculator', () => {
  const calc = new DamageCalculator();

  it('physical damage: (Attack × Multiplier) − (Defense × 0.6)', () => {
    const result = calc.calculate({
      attack: 2000,
      magicAttack: 0,
      defense: 1200,
      magicDefense: 0,
      multiplier: 1.8,
      damageType: 'physical',
    });
    // (2000 × 1.8) − (1200 × 0.6) = 3600 − 720 = 2880
    expect(result.finalDamage).toBe(2880);
  });

  it('physical damage minimum is 1 when defense completely overwhelms attack', () => {
    const result = calc.calculate({
      attack: 5,
      magicAttack: 0,
      defense: 100_000,
      magicDefense: 0,
      multiplier: 1,
      damageType: 'physical',
    });
    // raw=5, min_damage = max(1, floor(5*0.15)) = max(1,0) = 1
    expect(result.finalDamage).toBe(1);
  });

  it('magic damage uses magicAttack vs magicDefense', () => {
    const result = calc.calculate({
      attack: 0,
      magicAttack: 1000,
      defense: 0,
      magicDefense: 500,
      multiplier: 1.5,
      damageType: 'magic',
    });
    // (1000 × 1.5) − (500 × 0.6) = 1500 − 300 = 1200
    expect(result.finalDamage).toBe(1200);
  });

  it('true damage ignores all defense', () => {
    const result = calc.calculate({
      attack: 500,
      magicAttack: 0,
      defense: 99_999,
      magicDefense: 99_999,
      multiplier: 2,
      damageType: 'true',
    });
    // 500 × 2 = 1000, no defense reduction
    expect(result.finalDamage).toBe(1000);
  });

  it('true damage minimum is 1', () => {
    const result = calc.calculate({
      attack: 0,
      magicAttack: 0,
      defense: 0,
      magicDefense: 0,
      multiplier: 0,
      damageType: 'true',
    });
    expect(result.finalDamage).toBe(1);
  });

  it('defense reduction cap prevents reducing below 15 % of raw damage', () => {
    const result = calc.calculate({
      attack: 100,
      magicAttack: 0,
      defense: 100_000,
      magicDefense: 0,
      multiplier: 1,
      damageType: 'physical',
    });
    // raw=100, minDamage = max(1, floor(15)) = 15
    expect(result.finalDamage).toBeGreaterThanOrEqual(15);
    expect(result.finalDamage).toBeLessThanOrEqual(100);
  });
});

// ─── CriticalCalculator ────────────────────────────────────────────────────────

describe('CriticalCalculator', () => {
  const calc = new CriticalCalculator();

  it('guaranteedCrit always crits regardless of RNG', () => {
    const rng = new SeededRandom('crit-guaranteed');
    const result = calc.evaluate({ critRate: 0, critDamage: 150, luck: 0, guaranteedCrit: true }, rng);
    expect(result.isCritical).toBe(true);
    expect(result.multiplier).toBeCloseTo(1.5);
  });

  it('0 % crit rate never crits (with large sample)', () => {
    const rng = new SeededRandom('no-crit');
    for (let i = 0; i < 200; i++) {
      const result = calc.evaluate({ critRate: 0, critDamage: 150, luck: 0 }, rng);
      expect(result.isCritical).toBe(false);
    }
  });

  it('crit multiplier is at least 1.5× on crit', () => {
    const rng = new SeededRandom('crit-multi');
    const result = calc.evaluate({ critRate: 100, critDamage: 150, luck: 0 }, rng);
    expect(result.multiplier).toBeGreaterThanOrEqual(1.5);
  });

  it('higher critDamage produces higher multiplier', () => {
    const r1 = calc.evaluate({ critRate: 100, critDamage: 150, luck: 0, guaranteedCrit: true }, new SeededRandom('cd1'));
    const r2 = calc.evaluate({ critRate: 100, critDamage: 300, luck: 0, guaranteedCrit: true }, new SeededRandom('cd2'));
    expect(r2.multiplier).toBeGreaterThan(r1.multiplier);
  });

  it('non-crit returns multiplier of 1.0', () => {
    const result = calc.evaluate({ critRate: 0, critDamage: 200, luck: 0 }, new SeededRandom('no-crit-2'));
    expect(result.multiplier).toBe(1.0);
  });

  it('effectiveCritChance is capped at 75', () => {
    const chance = calc.effectiveCritChance({ critRate: 200, luck: 0 });
    expect(chance).toBe(75);
  });

  it('Luck modifier boosts effective crit chance', () => {
    const base = calc.effectiveCritChance({ critRate: 50, luck: 0 });
    const boosted = calc.effectiveCritChance({ critRate: 50, luck: 500 });
    expect(boosted).toBeGreaterThan(base);
  });
});

// ─── AccuracyCalculator ────────────────────────────────────────────────────────

describe('AccuracyCalculator', () => {
  const calc = new AccuracyCalculator();

  it('ultimate always hits (100 %)', () => {
    expect(calc.hitChance({ attackerAccuracy: 0, defenderEvasion: 9999, isUltimate: true })).toBe(100);
  });

  it('floored at 5 % against high-evasion target', () => {
    expect(calc.hitChance({ attackerAccuracy: 1, defenderEvasion: 9999 })).toBe(5);
  });

  it('capped at 95 % against zero-evasion target', () => {
    expect(calc.hitChance({ attackerAccuracy: 9999, defenderEvasion: 0 })).toBe(95);
  });

  it('blind debuff reduces hit chance when evasion creates separation', () => {
    // With evasion present, blind (−30 accuracy) should matter.
    // accuracy=100, evasion=100, blind → effective accuracy=70
    // normal: (100/200)*100 = 50 %; blind: (70/170)*100 ≈ 41.2 %
    const normal = calc.hitChance({ attackerAccuracy: 100, defenderEvasion: 100 });
    const blind = calc.hitChance({ attackerAccuracy: 100, defenderEvasion: 100, attackerBlind: true });
    expect(blind).toBeLessThan(normal);
  });

  it('equal accuracy and evasion gives 50 % hit chance', () => {
    const chance = calc.hitChance({ attackerAccuracy: 100, defenderEvasion: 100 });
    expect(chance).toBe(50);
  });

  it('accuracy bonus from skill adds to hit chance', () => {
    const base = calc.hitChance({ attackerAccuracy: 50, defenderEvasion: 100 });
    const bonus = calc.hitChance({ attackerAccuracy: 50, defenderEvasion: 100, accuracyBonus: 50 });
    expect(bonus).toBeGreaterThan(base);
  });
});

// ─── EvasionCalculator ────────────────────────────────────────────────────────

describe('EvasionCalculator', () => {
  const calc = new EvasionCalculator();

  it('standard attacks capped at 60 % dodge', () => {
    expect(calc.dodgeChance({ defenderEvasion: 9999, defenderSpeed: 0, attackerAccuracy: 1 })).toBe(60);
  });

  it('ultimate attacks capped at 35 % dodge', () => {
    expect(calc.dodgeChance({ defenderEvasion: 9999, defenderSpeed: 0, attackerAccuracy: 1, isUltimate: true })).toBe(35);
  });

  it('zero evasion yields 0 % dodge', () => {
    expect(calc.dodgeChance({ defenderEvasion: 0, defenderSpeed: 0, attackerAccuracy: 100 })).toBe(0);
  });

  it('speed contributes to effective evasion', () => {
    const noSpeed = calc.dodgeChance({ defenderEvasion: 100, defenderSpeed: 0, attackerAccuracy: 100 });
    const withSpeed = calc.dodgeChance({ defenderEvasion: 100, defenderSpeed: 500, attackerAccuracy: 100 });
    expect(withSpeed).toBeGreaterThan(noSpeed);
  });

  it('equal evasion and accuracy gives 50 % (speed is zero)', () => {
    const chance = calc.dodgeChance({ defenderEvasion: 100, defenderSpeed: 0, attackerAccuracy: 100 });
    expect(chance).toBe(50);
  });
});
