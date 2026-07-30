import { Redis } from 'ioredis';

import { env } from '../config/index.js';
import { childLogger } from '../utils/logger.js';

const log = childLogger('redis');

let _client: Redis | null = null;

export function getRedisClient(): Redis {
  if (_client) return _client;

  const client = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD ?? undefined,
    tls: env.REDIS_TLS ? {} : undefined,
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    // lazyConnect: true is required so that BullMQ's internal .duplicate() +
    // .connect() pattern works correctly. Without it, duplicates auto-connect
    // immediately and BullMQ's subsequent .connect() call throws
    // "Redis is already connecting/connected".
    lazyConnect: true,
    retryStrategy: (times: number): number | null => {
      if (times > 10) return null;
      return Math.min(times * 200, 2000);
    },
  });

  client.on('connect', () => log.info('Redis connecting…'));
  client.on('ready', () => log.info('Redis ready'));
  client.on('error', (err: unknown) => log.error('Redis error', { err: String(err) }));
  client.on('close', () => log.warn('Redis connection closed'));
  client.on('reconnecting', () => log.info('Redis reconnecting…'));

  _client = client;
  return _client;
}

/**
 * Connect the Redis singleton and wait for it to be ready.
 * Guards against being called on an already-connecting/connected client
 * so it is safe to call multiple times during startup.
 */
export async function connectRedis(): Promise<void> {
  const client = getRedisClient();

  // Already up — nothing to do.
  if (client.status === 'ready') return;

  // Not yet started — initiate the connection.
  if (client.status === 'wait') {
    await client.connect();
    return;
  }

  // Mid-connection (status: 'connecting' | 'connect') — just wait for ready.
  await new Promise<void>((resolve, reject) => {
    client.once('ready', resolve);
    client.once('error', reject);
  });
}

export async function disconnectRedis(): Promise<void> {
  if (_client) {
    await _client.quit();
    _client = null;
    log.info('Redis disconnected gracefully');
  }
}

export function isRedisConnected(): boolean {
  return _client?.status === 'ready';
}
