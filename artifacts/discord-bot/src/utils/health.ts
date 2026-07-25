import { createServer, type Server } from 'node:http';

import { isMongoConnected } from '../database/mongo.js';
import { isRedisConnected } from '../database/redis.js';

import { childLogger } from './logger.js';

const log = childLogger('HealthChecker');

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  uptime: number;
  timestamp: string;
  services: {
    mongodb: 'up' | 'down';
    redis: 'up' | 'down';
    discord: 'up' | 'down';
  };
}

let discordReady = false;

export function setDiscordReady(ready: boolean): void {
  discordReady = ready;
}

export function getHealthStatus(): HealthStatus {
  const services = {
    mongodb: isMongoConnected() ? ('up' as const) : ('down' as const),
    redis: isRedisConnected() ? ('up' as const) : ('down' as const),
    discord: discordReady ? ('up' as const) : ('down' as const),
  };

  const allUp = Object.values(services).every((s) => s === 'up');
  const allDown = Object.values(services).every((s) => s === 'down');

  return {
    status: allUp ? 'ok' : allDown ? 'down' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services,
  };
}

export function startHealthServer(port: number): Server {
  const server = createServer((req, res) => {
    if (req.url === '/health' && req.method === 'GET') {
      const health = getHealthStatus();
      const statusCode = health.status === 'down' ? 503 : 200;
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(health));
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(port, () => {
    log.info('Health check server listening', { port });
  });

  server.on('error', (err: unknown) => {
    log.error('Health check server error', { err: String(err) });
  });

  return server;
}
