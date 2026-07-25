import { readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import type { SlashCommand } from '../types/discord.js';
import { childLogger } from '../utils/logger.js';

import type { AscensionClient } from './AscensionClient.js';

const log = childLogger('CommandLoader');

export async function loadCommands(client: AscensionClient, commandsDir: string): Promise<void> {
  const dir = resolve(commandsDir);

  function getCommandFiles(directory: string): string[] {
    const entries = readdirSync(directory);
    const files: string[] = [];
    for (const entry of entries) {
      const fullPath = join(directory, entry);
      if (statSync(fullPath).isDirectory()) {
        files.push(...getCommandFiles(fullPath));
      } else if (entry.endsWith('.js') || entry.endsWith('.ts')) {
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
      if (!command?.data || !command.execute) {
        log.warn('Skipping file — missing data or execute export', { file });
        continue;
      }
      client.commands.set(command.data.name, command);
      log.debug('Command registered', { command: command.data.name });
    } catch (err) {
      log.error('Failed to load command', { err: String(err), file });
    }
  }

  log.info('Commands loaded', { count: client.commands.size });
}
