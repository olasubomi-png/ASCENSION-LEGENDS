import { config } from 'dotenv';
import { z } from 'zod';

import type { Environment } from '../types/environment.js';

// Load .env only in non-production environments
if (process.env['NODE_ENV'] !== 'production') {
  config();
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DISCORD_TOKEN: z.string().min(1, 'DISCORD_TOKEN is required'),
  DISCORD_CLIENT_ID: z.string().min(1, 'DISCORD_CLIENT_ID is required'),
  DISCORD_GUILD_ID: z.string().optional().transform((v) => v ?? undefined),
  MONGODB_URI: z.string().url('MONGODB_URI must be a valid URI'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional().transform((v) => v ?? undefined),
  REDIS_TLS: z.coerce.boolean().default(false),
  BULLMQ_PREFIX: z.string().default('ascension'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
  PORT: z.coerce.number().int().positive().default(3001),
  ADMIN_API_URL: z.string().url().optional().transform((v) => v ?? undefined),
  ADMIN_API_KEY: z.string().optional().transform((v) => v ?? undefined),
  ENABLE_SHARDING: z.coerce.boolean().default(false),
});

function loadEnv(): Environment {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const errors = result.error.errors
      .map((e) => `  • ${e.path.join('.')}: ${e.message}`)
      .join('\n');
    throw new Error(`Environment validation failed:\n${errors}`);
  }
  // Safe cast — the Zod schema output matches the Environment interface
  return result.data as unknown as Environment;
}

// Singleton — validated once at startup
export const env: Environment = loadEnv();
