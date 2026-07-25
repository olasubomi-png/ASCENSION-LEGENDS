import { Worker } from 'bullmq';
import type { Job } from 'bullmq';

import { QUEUE_NAMES, JOB_NAMES } from '../constants/jobs.js';
import { getRedisClient } from '../database/redis.js';
import { childLogger } from '../utils/logger.js';

const log = childLogger('RenderWorker');

export interface RenderBattleGifJobData {
  battleId: string;
  frames: string[];
}

export interface RenderProfileCardJobData {
  userId: string;
  discordId: string;
}

type RenderJobData = RenderBattleGifJobData | RenderProfileCardJobData;

async function processRenderJob(job: Job<RenderJobData>): Promise<void> {
  log.info('Processing render job', { jobId: job.id, jobName: job.name });

  switch (job.name) {
    case JOB_NAMES.RENDER_BATTLE_GIF: {
      log.info('Battle GIF render — placeholder', { jobId: job.id });
      break;
    }
    case JOB_NAMES.RENDER_PROFILE_CARD: {
      log.info('Profile card render — placeholder', { jobId: job.id });
      break;
    }
    default:
      log.warn('Unknown render job type', { jobName: job.name });
  }
}

let worker: Worker | null = null;

export function startRenderWorker(): Worker {
  if (worker) return worker;

  worker = new Worker(QUEUE_NAMES.RENDER, processRenderJob, {
    connection: getRedisClient(),
    concurrency: 2,
  });

  worker.on('completed', (job) => {
    log.info('Render job completed', { jobId: job.id, jobName: job.name });
  });

  worker.on('failed', (job, err) => {
    log.error('Render job failed', { jobId: job?.id, jobName: job?.name, err: String(err) });
  });

  log.info('Render worker started');
  return worker;
}

export async function stopRenderWorker(): Promise<void> {
  if (worker) {
    await worker.close();
    worker = null;
    log.info('Render worker stopped');
  }
}
