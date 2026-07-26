/**
 * Ascension Legends — Discord Bot Entry Point
 *
 * Startup sequence:
 *  1. Validate environment variables
 *  2. Connect to MongoDB
 *  3. Connect to Redis
 *  4. Instantiate services (dependency injection)
 *  5. Load commands & events
 *  6. Start BullMQ workers
 *  7. Start health-check HTTP server
 *  8. Login to Discord
 *  9. Register graceful shutdown handlers
 */
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CacheService } from './cache/index.js';
import { AscensionClient, loadCommands, loadEvents } from './client/index.js';
import { env } from './config/index.js';
import { connectMongo, disconnectMongo } from './database/mongo.js';
import { connectRedis, disconnectRedis, getRedisClient } from './database/redis.js';
import { closeQueues } from './jobs/index.js';
import { CharacterRepository, UserRepository, WalletRepository, GuildRepository } from './repositories/index.js';
import { CharacterService, PlayerService, EconomyService, GuildService } from './services/index.js';
import { startHealthServer, setDiscordReady } from './utils/health.js';
import { logger } from './utils/logger.js';
import { startRenderWorker, stopRenderWorker } from './workers/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function bootstrap(): Promise<void> {
  logger.info('🚀 Ascension Legends starting up…');

  // ── 1. Database connections ─────────────────────────────────────────────
  await connectMongo();
  await connectRedis();

  // ── 2. Dependency injection ─────────────────────────────────────────────
  const redis = getRedisClient();
  const cache = new CacheService(redis);

  const userRepo = new UserRepository();
  const walletRepo = new WalletRepository();
  const guildRepo = new GuildRepository();
  const characterRepo = new CharacterRepository();

  // Services are constructed and ready to be injected into command handlers.
  // They are intentionally stored here as the DI container root.
  const services = {
    player: new PlayerService(userRepo, cache),
    economy: new EconomyService(walletRepo, cache),
    guild: new GuildService(guildRepo),
    character: new CharacterService(characterRepo, cache),
  };
  void services; // DI root — commands will reference these when gameplay is implemented

  // ── 3. Discord client ───────────────────────────────────────────────────
  const client = new AscensionClient();

  const commandsDir = resolve(__dirname, 'commands');
  const eventsDir = resolve(__dirname, 'events');

  await Promise.all([
    loadCommands(client, commandsDir),
    loadEvents(client, eventsDir),
  ]);

  // ── 4. BullMQ workers ───────────────────────────────────────────────────
  startRenderWorker();

  // ── 5. Health server ────────────────────────────────────────────────────
  const healthServer = startHealthServer(env.PORT);

  // ── 6. Discord ready hook ───────────────────────────────────────────────
  client.once('ready', () => setDiscordReady(true));

  // ── 7. Login ─────────────────────────────────────────────────────────────
  await client.login(env.DISCORD_TOKEN);

  // ── 8. Graceful shutdown ─────────────────────────────────────────────────
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
