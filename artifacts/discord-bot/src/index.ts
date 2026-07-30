/**
 * Ascension Legends — Discord Bot Entry Point
 *
 * Startup sequence:
 *  1. Validate environment variables
 *  2. Connect to MongoDB
 *  3. Connect to Redis
 *  4. Instantiate repositories
 *  5. Instantiate services (dependency injection)
 *  6. Load commands, events, buttons, modals
 *  7. Attach services to client (DI container)
 *  8. Start BullMQ workers
 *  9. Start health-check HTTP server
 * 10. Login to Discord
 * 11. Register graceful shutdown handlers
 */
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { classSelectHandler } from './buttons/index.js';
import { CacheService } from './cache/index.js';
import { AscensionClient, loadCommands, loadEvents } from './client/index.js';
import { env } from './config/index.js';
import { connectMongo, disconnectMongo } from './database/mongo.js';
import { connectRedis, disconnectRedis, getRedisClient } from './database/redis.js';
import { closeQueues } from './jobs/index.js';
import { characterNameModal } from './modals/index.js';
import {
  CharacterRepository,
  GuildRepository,
  InventoryRepository,
  ProfileRepository,
  UserRepository,
  WalletRepository,
} from './repositories/index.js';
import {
  CharacterService,
  EconomyService,
  GuildService,
  InventoryService,
  PlayerService,
  ProfileService,
  RegistrationService,
  BattleService,
} from './services/index.js';
import { startHealthServer, setDiscordReady } from './utils/health.js';
import { logger } from './utils/logger.js';
import { startRenderWorker, stopRenderWorker } from './workers/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function bootstrap(): Promise<void> {
  logger.info('🚀 Ascension Legends starting up…');

  // ── 1. Database connections ─────────────────────────────────────────────
  await connectMongo();
  await connectRedis();

  // ── 2. Repositories ─────────────────────────────────────────────────────
  const redis = getRedisClient();
  const cache = new CacheService(redis);

  const userRepo = new UserRepository();
  const walletRepo = new WalletRepository();
  const guildRepo = new GuildRepository();
  const characterRepo = new CharacterRepository();
  const inventoryRepo = new InventoryRepository();
  const profileRepo = new ProfileRepository();

  // ── 3. Services (DI) ────────────────────────────────────────────────────
  const playerService = new PlayerService(userRepo, cache);
  const economyService = new EconomyService(walletRepo, cache);
  const guildService = new GuildService(guildRepo);
  const characterService = new CharacterService(characterRepo, cache);
  const inventoryService = new InventoryService(inventoryRepo, cache);
  const profileService = new ProfileService(profileRepo, cache);
  const battleService = new BattleService();

  const registrationService = new RegistrationService(
    playerService,
    characterService,
    economyService,
    inventoryService,
    profileService,
    walletRepo,
    characterRepo,
  );

  void guildService; // used in future sprints

  // ── 4. Discord client ───────────────────────────────────────────────────
  const client = new AscensionClient();

  // Attach services for command handler access
  client.registrationService = registrationService;
  client.characterService = characterService;
  client.economyService = economyService;
  client.profileService = profileService;
  client.battleService = battleService;

  // ── 5. Load commands, events, buttons, modals ───────────────────────────
  const commandsDir = resolve(__dirname, 'commands');
  const eventsDir = resolve(__dirname, 'events');

  await Promise.all([
    loadCommands(client, commandsDir),
    loadEvents(client, eventsDir),
  ]);

  // Register button handlers
  client.buttons.set(classSelectHandler.customId, classSelectHandler);

  // Register modal handlers
  client.modals.set(characterNameModal.customId, characterNameModal);

  logger.info('Button handlers registered', { count: client.buttons.size });
  logger.info('Modal handlers registered', { count: client.modals.size });

  // ── 6. BullMQ workers ───────────────────────────────────────────────────
  startRenderWorker();

  // ── 7. Health server ────────────────────────────────────────────────────
  const healthServer = startHealthServer(env.PORT);

  // ── 8. Discord ready hook ───────────────────────────────────────────────
  client.once('ready', () => setDiscordReady(true));

  // ── 9. Login ─────────────────────────────────────────────────────────────
  await client.login(env.DISCORD_TOKEN);

  // ── 10. Graceful shutdown ─────────────────────────────────────────────────
  async function shutdown(signal: string): Promise<void> {
    logger.info('Shutdown signal received — draining…', { signal });

    setDiscordReady(false);
    await client.destroy();
    logger.info('Discord client destroyed');

    await Promise.allSettled([
      stopRenderWorker(),
      closeQueues(),
      disconnectMongo(),
      disconnectRedis(),
      new Promise<void>((res) => healthServer.close(() => res())),
    ]);

    logger.info('Ascension Legends shut down cleanly. Goodbye 👋');
    process.exit(0);
  }

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));

  process.on('unhandledRejection', (reason: unknown) => {
    logger.error('Unhandled promise rejection', { reason: String(reason) });
  });

  process.on('uncaughtException', (err: Error) => {
    logger.error('Uncaught exception — shutting down', { err: err.message });
    void shutdown('uncaughtException');
  });
}

bootstrap().catch((err: unknown) => {
  logger.error('Fatal startup error', { err: String(err) });
  process.exit(1);
});
