import type { Redis } from 'ioredis';

import type { ICacheService } from '../interfaces/index.js';
import { childLogger } from '../utils/logger.js';

const log = childLogger('cache');

export class CacheService implements ICacheService {
  constructor(private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await this.redis.get(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (err) {
      log.error('Cache GET failed', { err: String(err), key });
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, serialized);
      } else {
        await this.redis.set(key, serialized);
      }
    } catch (err) {
      log.error('Cache SET failed', { err: String(err), key });
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (err) {
      log.error('Cache DEL failed', { err: String(err), key });
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      return (await this.redis.exists(key)) === 1;
    } catch (err) {
      log.error('Cache EXISTS failed', { err: String(err), key });
      return false;
    }
  }

  async flush(pattern: string): Promise<number> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length === 0) return 0;
      await this.redis.del(...keys);
      return keys.length;
    } catch (err) {
      log.error('Cache FLUSH failed', { err: String(err), pattern });
      return 0;
    }
  }
}
