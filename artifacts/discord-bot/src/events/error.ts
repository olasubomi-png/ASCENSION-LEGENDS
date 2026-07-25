import { Events } from 'discord.js';

import type { EventHandler } from '../client/EventLoader.js';
import { childLogger } from '../utils/logger.js';

const log = childLogger('Event:Error');

const errorEvent: EventHandler = {
  name: Events.Error,

  execute(error: unknown): void {
    log.error('Discord client error', { err: String(error) });
  },
};

export default errorEvent;
