import { readdirSync, statSync } from 'node:fs';
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

/**
 * Returns true for files that should be imported as event modules.
 * Accepts .js (production) and .ts (development/tsx) only.
 * Explicitly rejects .d.ts declaration files and .map source-map files,
 * which appear alongside .js files in the dist output and must never
 * be dynamically imported at runtime.
 */
function isRuntimeFile(filename: string): boolean {
  if (filename.endsWith('.d.ts')) return false;
  if (filename.endsWith('.js.map')) return false;
  if (filename.endsWith('.js')) return true;
  if (filename.endsWith('.ts')) return true;
  return false;
}

export async function loadEvents(client: AscensionClient, eventsDir: string): Promise<void> {
  const dir = resolve(eventsDir);
  let registered = 0;

  function getEventFiles(directory: string): string[] {
    const entries = readdirSync(directory);
    const files: string[] = [];
    for (const entry of entries) {
      const fullPath = join(directory, entry);
      if (statSync(fullPath).isDirectory()) {
        files.push(...getEventFiles(fullPath));
      } else if (isRuntimeFile(entry)) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const files = getEventFiles(dir);

  for (const file of files) {
    try {
      const module = await import(pathToFileURL(file).href) as { default?: EventHandler };
      const event = module.default;

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!event?.name || !event.execute) {
        log.warn('Skipping event file — missing name or execute', { file });
        continue;
      }

      if (event.once) {
        client.once(event.name, (...args) => void event.execute(...args));
      } else {
        client.on(event.name, (...args) => void event.execute(...args));
      }

      registered++;
      log.debug('Event registered', { event: event.name });
    } catch (err) {
      log.warn('Failed to load event — skipping', { file, err: String(err) });
    }
  }

  log.info('Events loaded', { count: registered });
}
