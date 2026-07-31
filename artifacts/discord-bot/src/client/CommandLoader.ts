import { readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import type { SlashCommand } from '../types/discord.js';
import { childLogger } from '../utils/logger.js';

import type { AscensionClient } from './AscensionClient.js';

const log = childLogger('CommandLoader');

/**
 * Returns true for files that should be imported as command modules.
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

export async function loadCommands(client: AscensionClient, commandsDir: string): Promise<void> {
  const dir = resolve(commandsDir);

  function getCommandFiles(directory: string): string[] {
    const entries = readdirSync(directory);
    const files: string[] = [];
    for (const entry of entries) {
      const fullPath = join(directory, entry);
      if (statSync(fullPath).isDirectory()) {
        files.push(...getCommandFiles(fullPath));
      } else if (isRuntimeFile(entry)) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const files = getCommandFiles(dir);

  for (const file of files) {
    try {
      const module = await import(pathToFileURL(file).href) as { default?: SlashCommand };
      const command = module.default;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!command?.data || !command.execute) {
        log.warn('Skipping file — missing data or execute export', { file });
        continue;
      }
      client.commands.set(command.data.name, command);
      log.debug('Command registered', { command: command.data.name });
    } catch (err) {
      log.warn('Failed to load command — skipping', { file, err: String(err) });
    }
  }

  log.info('Commands loaded', { count: client.commands.size });
}
