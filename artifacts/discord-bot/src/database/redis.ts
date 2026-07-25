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

export async function connectRedis(): Promise<void> {
  await getRedisClient().connect();
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
