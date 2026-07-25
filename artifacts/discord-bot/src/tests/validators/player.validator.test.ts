import { playerValidator } from '../../validators/player.validator.js';

describe('playerValidator.displayName', () => {
  it('accepts valid display names', () => {
    expect(playerValidator.displayName.safeParse('HeroName').success).toBe(true);
    expect(playerValidator.displayName.safeParse('Shadow Knight').success).toBe(true);
    expect(playerValidator.displayName.safeParse('xX_Slayer_Xx').success).toBe(true);
  });

  it('rejects names that are too short', () => {
    expect(playerValidator.displayName.safeParse('A').success).toBe(false);
  });

  it('rejects names that are too long', () => {
    expect(playerValidator.displayName.safeParse('A'.repeat(33)).success).toBe(false);
  });

  it('rejects names with invalid characters', () => {
    expect(playerValidator.displayName.safeParse('Hero@#$').success).toBe(false);
  });
});

describe('playerValidator.discordId', () => {
  it('accepts valid 18-digit Discord IDs', () => {
    expect(playerValidator.discordId.safeParse('123456789012345678').success).toBe(true);
  });

  it('rejects non-numeric IDs', () => {
    expect(playerValidator.discordId.safeParse('abc123def456').success).toBe(false);
  });

  it('rejects IDs that are too short', () => {
    expect(playerValidator.discordId.safeParse('12345').success).toBe(false);
  });
});
