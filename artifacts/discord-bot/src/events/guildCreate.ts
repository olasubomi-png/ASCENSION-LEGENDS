import { Events } from 'discord.js';
import type { Guild } from 'discord.js';

import type { EventHandler } from '../client/EventLoader.js';
import { childLogger } from '../utils/logger.js';

const log = childLogger('Event:GuildCreate');

const guildCreateEvent: EventHandler = {
  name: Events.GuildCreate,

  execute(guild: unknown): void {
    const g = guild as Guild;
    log.info('Bot joined a new guild', {
      guildId: g.id,
      guildName: g.name,
      memberCount: g.memberCount,
    });
  },
};

export default guildCreateEvent;
