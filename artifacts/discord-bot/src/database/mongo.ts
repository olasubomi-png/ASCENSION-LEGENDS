import mongoose from 'mongoose';

import { env } from '../config/index.js';
import { childLogger } from '../utils/logger.js';

const log = childLogger('mongodb');

let isConnected = false;

export async function connectMongo(): Promise<void> {
  if (isConnected) return;

  mongoose.connection.on('connected', () => {
    log.info('MongoDB connected');
    isConnected = true;
  });

  mongoose.connection.on('error', (err: unknown) => {
    log.error('MongoDB connection error', { err: String(err) });
  });

  mongoose.connection.on('disconnected', () => {
    log.warn('MongoDB disconnected');
    isConnected = false;
  });

  await mongoose.connect(env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5_000,
    socketTimeoutMS: 45_000,
    family: 4,
  });
}

export async function disconnectMongo(): Promise<void> {
  if (!isConnected) return;
  await mongoose.connection.close();
  log.info('MongoDB disconnected gracefully');
}

export function isMongoConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
