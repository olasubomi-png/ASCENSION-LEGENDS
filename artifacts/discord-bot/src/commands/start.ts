import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

import { EMBED_COLORS } from '../constants/discord.js';
import type { SlashCommand } from '../types/discord.js';

/**
 * /start — Begins a player's journey in Ascension Legends.
 * PLACEHOLDER: Character creation, tutorial, and onboarding will be implemented
 * once the gameplay layer is built.
 */
const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Begin your journey in Ascension Legends.'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({ ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('⚔️ Your Journey Awaits')
      .setDescription(
        [
          '**Ascension Legends** is still being forged in the fires of creation.',
          '',
          'The world is taking shape. Heroes will rise, battles will be fought, and legends will be written.',
          '',
          '> *"The greatest adventures begin with a single step."*',
          '',
          '🔔 Stay tuned — your adventure starts soon!',
        ].join('\n'),
      )
      .setColor(EMBED_COLORS.LEGENDARY)
      .setFooter({ text: 'Ascension Legends — Coming Soon' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};

export default command;
