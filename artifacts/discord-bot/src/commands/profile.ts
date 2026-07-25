import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

import { EMBED_COLORS } from '../constants/discord.js';
import type { SlashCommand } from '../types/discord.js';

/**
 * /profile — Displays a player's profile card.
 * PLACEHOLDER: Full profile rendering (Canvas image generation, stats, class info)
 * will be implemented once the player data layer and renderer are complete.
 */
const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription("View your Ascension Legends profile.")
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The player whose profile to view (defaults to yourself).')
        .setRequired(false),
    ) as unknown as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    const target = interaction.options.getUser('user') ?? interaction.user;

    const embed = new EmbedBuilder()
      .setTitle(`📜 ${target.displayName}'s Profile`)
      .setDescription(
        [
          '**Class:** *Not yet chosen*',
          '**Level:** *—*',
          '**Power:** *—*',
          '',
          '> Your legend is still being written. Use `/start` to begin your journey.',
        ].join('\n'),
      )
      .setThumbnail(target.displayAvatarURL({ size: 256 }))
      .setColor(EMBED_COLORS.INFO)
      .addFields(
        { name: '⚔️ Battles', value: '—', inline: true },
        { name: '🏆 Wins', value: '—', inline: true },
        { name: '💀 Losses', value: '—', inline: true },
        { name: '💰 Gold', value: '—', inline: true },
        { name: '💎 Gems', value: '—', inline: true },
        { name: '🏅 Rank', value: '—', inline: true },
      )
      .setFooter({ text: 'Ascension Legends • Full profile coming soon' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};

export default command;
