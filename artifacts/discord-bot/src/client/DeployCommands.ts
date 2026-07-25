import { REST, Routes } from 'discord.js';

import { env } from '../config/index.js';
import { childLogger } from '../utils/logger.js';

import type { AscensionClient } from './AscensionClient.js';

const log = childLogger('DeployCommands');

export async function deployCommands(client: AscensionClient): Promise<void> {
  const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);
  const commandData = client.commands.map((cmd) => cmd.data.toJSON());

  if (env.DISCORD_GUILD_ID) {
    await rest.put(
      Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_GUILD_ID),
      { body: commandData },
    );
    log.info('Guild commands deployed', { count: commandData.length, guildId: env.DISCORD_GUILD_ID });
  } else {
    await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), { body: commandData });
    log.info('Global commands deployed', { count: commandData.length });
  }
}
