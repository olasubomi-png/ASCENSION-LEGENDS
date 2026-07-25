export interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  DISCORD_TOKEN: string;
  DISCORD_CLIENT_ID: string;
  DISCORD_GUILD_ID: string | undefined;
  MONGODB_URI: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string | undefined;
  REDIS_TLS: boolean;
  BULLMQ_PREFIX: string;
  LOG_LEVEL: 'error' | 'warn' | 'info' | 'http' | 'debug';
  PORT: number;
  ADMIN_API_URL: string | undefined;
  ADMIN_API_KEY: string | undefined;
  ENABLE_SHARDING: boolean;
}
