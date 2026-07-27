/**
 * RegistrationService unit tests.
 *
 * Uses hand-built mocks — no MongoDB/Redis required.
 * Env vars are stubbed via jest.mock so the env validation never fires.
 */

// ──────────────────────────────────────────────────────────────────────────────
// Mock env-dependent modules BEFORE any real imports touch them.
// ──────────────────────────────────────────────────────────────────────────────
jest.mock('../../config/index.js', () => ({
  env: {
    DISCORD_TOKEN: 'mock',
    DISCORD_CLIENT_ID: 'mock',
    MONGODB_URI: 'mongodb://localhost/test',
    REDIS_URL: 'redis://localhost',
    PORT: 3000,
    NODE_ENV: 'test',
    LOG_LEVEL: 'silent',
  },
}));

jest.mock('../../utils/logger.js', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() },
  childLogger: () => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() }),
}));

// ──────────────────────────────────────────────────────────────────────────────
// Real imports (after mocks are registered)
// ──────────────────────────────────────────────────────────────────────────────
import type { ClassId } from '../../constants/classes.js';
import { RegistrationService } from '../../services/registration/RegistrationService.js';

// ──────────────────────────────────────────────────────────────────────────────
// Mock factories
// ──────────────────────────────────────────────────────────────────────────────

function makeCharacterService(hasChar: boolean) {
  return {
    hasCharacter: jest.fn().mockResolvedValue(hasChar),
    createCharacter: jest.fn().mockResolvedValue({
      ok: true,
      value: {
        characterId: 'char_test123',
        name: 'TestHero',
        classId: 'vanguard',
        userId: 'user_test123',
        discordId: '123456789012345678',
        level: 1,
        experience: 0,
        experienceToNextLevel: 100,
        stats: {
          hp: 700, maxHp: 700, mp: 100, maxMp: 100,
          attack: 85, defense: 110, magicAttack: 35, magicDefense: 60,
          speed: 55, luck: 10, critRate: 5, critDamage: 150,
          evasion: 10, accuracy: 85,
        },
        statPoints: 0,
        skillPoints: 0,
        locationId: 'starting_zone',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  };
}

function makePlayerService() {
  return {
    getOrCreatePlayer: jest.fn().mockResolvedValue({
      ok: true,
      value: {
        id: 'user_test123',
        discordId: '123456789012345678',
        username: 'testuser',
        displayName: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  };
}

function makeEconomyService() {
  return {
    getBalance: jest.fn().mockResolvedValue({ ok: true, value: { gold: 0, gems: 0 } }),
    credit: jest.fn().mockResolvedValue({ ok: true, value: { gold: 500, gems: 0 } }),
  };
}

function makeInventoryService() {
  return {
    createInventory: jest.fn().mockResolvedValue({
      ok: true,
      value: { _id: 'inv_test123', items: [] },
    }),
  };
}

function makeProfileService() {
  return {
    createProfile: jest.fn().mockResolvedValue({
      ok: true,
      value: {
        profileId: 'prof_test123',
        powerRating: 1500,
        battlesWon: 0,
        battlesLost: 0,
      },
    }),
  };
}

function makeWalletRepo() {
  return {};
}

function makeCharacterRepo() {
  return {};
}

// ──────────────────────────────────────────────────────────────────────────────
// Helper: build a RegistrationService from mocks
// ──────────────────────────────────────────────────────────────────────────────

function buildService(characterHasChar: boolean) {
  return new RegistrationService(
    makePlayerService() as never,
    makeCharacterService(characterHasChar) as never,
    makeEconomyService() as never,
    makeInventoryService() as never,
    makeProfileService() as never,
    makeWalletRepo() as never,
    makeCharacterRepo() as never,
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────────────────────────────────────

const VALID_INPUT = {
  discordId: '123456789012345678',
  username: 'testuser',
  characterName: 'TestHero',
  classId: 'vanguard' as ClassId,
};

describe('RegistrationService.isRegistered', () => {
  it('returns true when character exists', async () => {
    const service = buildService(true);
    await expect(service.isRegistered('123456789012345678')).resolves.toBe(true);
  });

  it('returns false when no character exists', async () => {
    const service = buildService(false);
    await expect(service.isRegistered('123456789012345678')).resolves.toBe(false);
  });
});

describe('RegistrationService.register', () => {
  it('returns err when player is already registered', async () => {
    const service = buildService(true);
    const result = await service.register(VALID_INPUT);
    expect(result.ok).toBe(false);
  });

  it('returns ok with correct shape for a new player', async () => {
    const service = buildService(false);
    const result = await service.register(VALID_INPUT);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.characterName).toBe('TestHero');
    expect(result.value.classId).toBe('vanguard');
    expect(result.value.starterGold).toBe(500);
    expect(result.value.characterId).toBe('char_test123');
  });

  it('calls playerService.getOrCreatePlayer once', async () => {
    const playerService = makePlayerService();
    const service = new RegistrationService(
      playerService as never,
      makeCharacterService(false) as never,
      makeEconomyService() as never,
      makeInventoryService() as never,
      makeProfileService() as never,
      makeWalletRepo() as never,
      makeCharacterRepo() as never,
    );
    await service.register(VALID_INPUT);
    expect(playerService.getOrCreatePlayer).toHaveBeenCalledTimes(1);
  });

  it('calls characterService.createCharacter with correct params', async () => {
    const characterService = makeCharacterService(false);
    const service = new RegistrationService(
      makePlayerService() as never,
      characterService as never,
      makeEconomyService() as never,
      makeInventoryService() as never,
      makeProfileService() as never,
      makeWalletRepo() as never,
      makeCharacterRepo() as never,
    );
    await service.register(VALID_INPUT);
    expect(characterService.createCharacter).toHaveBeenCalledWith(
      expect.objectContaining({
        classId: 'vanguard',
        name: 'TestHero',
      }),
    );
  });

  it('credits starter gold to the wallet', async () => {
    const economyService = makeEconomyService();
    const service = new RegistrationService(
      makePlayerService() as never,
      makeCharacterService(false) as never,
      economyService as never,
      makeInventoryService() as never,
      makeProfileService() as never,
      makeWalletRepo() as never,
      makeCharacterRepo() as never,
    );
    await service.register(VALID_INPUT);
    expect(economyService.credit).toHaveBeenCalledWith(
      expect.any(String),
      500,
      'gold',
      'starter_reward',
    );
  });
});
