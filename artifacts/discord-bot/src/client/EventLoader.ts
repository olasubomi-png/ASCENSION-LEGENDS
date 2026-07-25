import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { childLogger } from '../utils/logger.js';

import type { AscensionClient } from './AscensionClient.js';

const log = childLogger('EventLoader');

export interface EventHandler {
  name: string;
  once?: boolean;
  execute(...args: unknown[]): Promise<void> | void;
}

export async function loadEvents(client: AscensionClient, eventsDir: string): Promise<void> {
  const dir = resolve(eventsDir);
  const files = readdirSync(dir).filter((f) => f.endsWith('.js') || f.endsWith('.ts'));

  for (const file of files) {
    try {
      const fullPath = join(dir, file);
      const module = await import(pathToFileURL(fullPath).href) as { default?: EventHandler };
      const event = module.default;

      if (!event?.name || !event.execute) {
        log.warn('Skipping event file — missing name or execute', { file });
        continue;
      }

      if (event.once) {
        client.once(event.name, (...args) => void event.execute(...args));
      } else {
        client.on(event.name, (...args) => void event.execute(...args));
      }

      log.debug('Event registered', { event: event.name });
    } catch (err) {
      log.error('Failed to load event', { err: String(err), file });
    }
  }

  log.info('Events loaded', { count: files.length });
}
