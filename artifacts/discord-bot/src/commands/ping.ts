import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

import { EMBED_COLORS } from '../constants/discord.js';
import type { SlashCommand } from '../types/discord.js';
import { formatNumber } from '../utils/format.js';

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot latency and connection status.'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const sent = await interaction.deferReply({ fetchReply: true });

    const wsLatency = interaction.client.ws.ping;
    const apiLatency = sent.createdTimestamp - interaction.createdTimestamp;

    const statusEmoji = wsLatency < 100 ? '🟢' : wsLatency < 250 ? '🟡' : '🔴';

    const embed = new EmbedBuilder()
      .setTitle('🏓 Pong!')
      .setColor(EMBED_COLORS.PRIMARY)
      .addFields(
        {
          name: 'WebSocket Latency',
          value: `${statusEmoji} ${formatNumber(wsLatency)}ms`,
          inline: true,
        },
        {
          name: 'API Latency',
          value: `⚡ ${formatNumber(apiLatency)}ms`,
          inline: true,
        },
      )
      .setFooter({ text: 'Ascension Legends' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};

export default command;
