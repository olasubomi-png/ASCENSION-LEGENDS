import type { RedisOptions } from 'ioredis';
import { Redis } from 'ioredis';

import { env } from '../config/index.js';
import { childLogger } from '../utils/logger.js';

const log = childLogger('redis');

let _client: Redis | null = null;

/**
 * ioredis options for BullMQ queues and workers.
 *
 * BullMQ must receive a plain options object — NOT a Redis instance.
 * When given a Redis instance, BullMQ calls .duplicate() then .connect() on
 * the copy, which throws "Redis is already connecting/connected" because
 * ioredis auto-connects on instantiation. Passing options lets BullMQ manage
 * its own internal connections without touching our singleton.
 *
 * BullMQ requires maxRetriesPerRequest: null and enableReadyCheck: false.
 */
export function getBullMQConnectionOptions(): RedisOptions {
  return {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD ?? undefined,
    tls: env.REDIS_TLS ? {} : undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy: (times: number): number | null => {
      if (times > 10) return null;
      return Math.min(times * 200, 2000);
    },
  };
}

/**
 * Returns the app-wide Redis singleton used by CacheService and any direct
 * ioredis callers. ioredis connects automatically on instantiation — no
 * explicit .connect() call is needed or safe to make.
 */
export function getRedisClient(): Redis {
  if (_client) return _client;

  const client = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD ?? undefined,
    tls: env.REDIS_TLS ? {} : undefined,
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
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
 * Wait for the Redis singleton to reach the ready state.
 * ioredis connects automatically — this function only waits; it never calls
 * .connect() (doing so would throw "Redis is already connecting/connected").
 */
export async function connectRedis(): Promise<void> {
  const client = getRedisClient();
  if (client.status === 'ready') return;

  await new Promise<void>((resolve, reject) => {
    const onReady = (): void => {
      client.removeListener('error', onError);
      resolve();
    };
    const onError = (err: Error): void => {
      client.removeListener('ready', onReady);
      reject(err);
    };
    client.once('ready', onReady);
    client.once('error', onError);
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
