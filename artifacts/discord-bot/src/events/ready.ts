import { Events } from 'discord.js';

import type { AscensionClient } from '../client/AscensionClient.js';
import { deployCommands } from '../client/DeployCommands.js';
import type { EventHandler } from '../client/EventLoader.js';
import { childLogger } from '../utils/logger.js';

const log = childLogger('Event:Ready');

const readyEvent: EventHandler = {
  name: Events.ClientReady,
  once: true,

  async execute(client: unknown): Promise<void> {
    const ascensionClient = client as AscensionClient;
    log.info('Bot is online and ready', { tag: ascensionClient.user?.tag });

    try {
      await deployCommands(ascensionClient);
    } catch (err) {
      log.error('Failed to deploy slash commands', { err: String(err) });
    }
  },
};

export default readyEvent;
