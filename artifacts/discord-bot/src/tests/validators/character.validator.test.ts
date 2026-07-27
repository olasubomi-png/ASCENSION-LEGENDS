import { characterValidator } from '../../validators/character.validator.js';

describe('characterValidator.name', () => {
  // ── Valid names ───────────────────────────────────────────────────────────
  it('accepts a simple ASCII name', () => {
    expect(characterValidator.name.safeParse('HeroOne').success).toBe(true);
  });

  it('accepts a name with spaces', () => {
    expect(characterValidator.name.safeParse('Iron Veil').success).toBe(true);
  });

  it('accepts a name with hyphens and underscores', () => {
    expect(characterValidator.name.safeParse('Shadow-Blade_X').success).toBe(true);
  });

  it('accepts unicode letters (Japanese characters, 3+ chars)', () => {
    // '勇者X' = 3 code points — meets the 3-char minimum
    expect(characterValidator.name.safeParse('勇者X').success).toBe(true);
  });

  it('accepts exactly 3 characters', () => {
    expect(characterValidator.name.safeParse('Axe').success).toBe(true);
  });

  it('accepts exactly 16 characters', () => {
    expect(characterValidator.name.safeParse('A'.repeat(16)).success).toBe(true);
  });

  // ── Too short ─────────────────────────────────────────────────────────────
  it('rejects names shorter than 3 characters', () => {
    expect(characterValidator.name.safeParse('AB').success).toBe(false);
    expect(characterValidator.name.safeParse('A').success).toBe(false);
    expect(characterValidator.name.safeParse('').success).toBe(false);
  });

  // ── Too long ──────────────────────────────────────────────────────────────
  it('rejects names longer than 16 characters', () => {
    expect(characterValidator.name.safeParse('A'.repeat(17)).success).toBe(false);
  });

  // ── Invalid characters ────────────────────────────────────────────────────
  it('rejects names with special characters like @', () => {
    expect(characterValidator.name.safeParse('Hero@Name').success).toBe(false);
  });

  it('rejects names with hashtags', () => {
    expect(characterValidator.name.safeParse('Hero#1').success).toBe(false);
  });

  it('rejects names with exclamation marks', () => {
    expect(characterValidator.name.safeParse('Hero!').success).toBe(false);
  });

  // ── Profanity ─────────────────────────────────────────────────────────────
  it('rejects names containing profanity', () => {
    expect(characterValidator.name.safeParse('fuckHero').success).toBe(false);
  });

  it('rejects names matching reserved words', () => {
    expect(characterValidator.name.safeParse('adminUser').success).toBe(false);
  });

  // ── Trimming ──────────────────────────────────────────────────────────────
  it('trims leading/trailing whitespace before validation', () => {
    // '  HeroName  ' after trim is 'HeroName' — valid
    expect(characterValidator.name.safeParse('  HeroName  ').success).toBe(true);
  });
});
