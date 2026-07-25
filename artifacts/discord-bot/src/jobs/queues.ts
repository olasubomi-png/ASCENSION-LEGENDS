import { Queue } from 'bullmq';

import { env } from '../config/index.js';
import { QUEUE_NAMES } from '../constants/jobs.js';
import { getRedisClient } from '../database/redis.js';
import { childLogger } from '../utils/logger.js';

const log = childLogger('Queues');

const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential' as const,
    delay: 1000,
  },
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 500 },
};

const connection = { connection: getRedisClient() };
const prefix = env.BULLMQ_PREFIX;

export const renderQueue = new Queue(QUEUE_NAMES.RENDER, {
  ...connection,
  prefix,
  defaultJobOptions,
});

export const battleQueue = new Queue(QUEUE_NAMES.BATTLE, {
  ...connection,
  prefix,
  defaultJobOptions,
});

export const notificationQueue = new Queue(QUEUE_NAMES.NOTIFICATION, {
  ...connection,
  prefix,
  defaultJobOptions: { ...defaultJobOptions, attempts: 5 },
});

export async function closeQueues(): Promise<void> {
  await Promise.all([
    renderQueue.close(),
    battleQueue.close(),
    notificationQueue.close(),
  ]);
  log.info('All queues closed');
}
