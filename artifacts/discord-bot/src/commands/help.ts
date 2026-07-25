import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

import { EMBED_COLORS } from '../constants/discord.js';
import type { SlashCommand } from '../types/discord.js';

/**
 * /help — Shows available commands and game information.
 * PLACEHOLDER: Will be expanded with full command documentation and
 * interactive category navigation once more commands are implemented.
 */
const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('View all available Ascension Legends commands.'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({ ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('📖 Ascension Legends — Help')
      .setDescription(
        'Welcome to **Ascension Legends**, a high-fidelity Discord MMORPG.\n\nHere are the currently available commands:',
      )
      .setColor(EMBED_COLORS.PRIMARY)
      .addFields(
        {
          name: '🏓 `/ping`',
          value: 'Check the bot latency and connection status.',
          inline: false,
        },
        {
          name: '⚔️ `/start`',
          value: 'Begin your journey in Ascension Legends. *(Coming soon)*',
          inline: false,
        },
        {
          name: '📜 `/profile [user]`',
          value: "View your or another player's profile card. *(Coming soon)*",
          inline: false,
        },
        {
          name: '📖 `/help`',
          value: 'Show this help menu.',
          inline: false,
        },
      )
      .addFields({
        name: '📣 More commands coming soon!',
        value:
          'Battle, inventory, guild, skills, quests, and more are in development.',
      })
      .setFooter({ text: 'Ascension Legends • Use /start to begin' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};

export default command;
