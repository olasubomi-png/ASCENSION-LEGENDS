import { createLogger, format, transports } from 'winston';

import { env } from '../config/index.js';

const { combine, timestamp, errors, json, colorize, simple } = format;

const isDevelopment = env.NODE_ENV === 'development';

export const logger = createLogger({
  level: env.LOG_LEVEL,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    errors({ stack: true }),
    json(),
  ),
  defaultMeta: { service: 'ascension-legends' },
  transports: [
    isDevelopment
      ? new transports.Console({
          format: combine(colorize(), simple()),
        })
      : new transports.Console(),
  ],
  exitOnError: false,
});

export type ChildLogger = {
  debug(msg: string, meta?: Record<string, unknown>): void;
  info(msg: string, meta?: Record<string, unknown>): void;
  warn(msg: string, meta?: Record<string, unknown>): void;
  error(msg: string, meta?: Record<string, unknown>): void;
};

/** Child logger factory — attach context to a named subsystem. */
export function childLogger(module: string): ChildLogger {
  const child = logger.child({ module });
  return {
    debug: (msg, meta) => child.debug(msg, meta),
    info: (msg, meta) => child.info(msg, meta),
    warn: (msg, meta) => child.warn(msg, meta),
    error: (msg, meta) => child.error(msg, meta),
  };
}
