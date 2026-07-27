/**
 * /start — Player registration and character creation.
 *
 * Flow:
 *   1. Check if already registered → ephemeral "already registered"
 *   2. Open character-name modal (Step 1)
 *   3. Modal submit → validate name → show class selection (Step 2)
 *   4. Class button click → register() → show welcome card
 *
 * The modal and button handlers live in:
 *   src/modals/characterName.ts
 *   src/buttons/classSelect.ts
 */

import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

import type { AscensionClient } from '../client/AscensionClient.js';
import { EMBED_COLORS } from '../constants/discord.js';
import { buildCharacterNameModal } from '../modals/characterName.js';
import type { SlashCommand } from '../types/discord.js';
import { childLogger } from '../utils/logger.js';

const log = childLogger('Command:Start');

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Begin your journey in Ascension Legends — create your hero.'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const client = interaction.client as AscensionClient;
    const registrationService = client.registrationService;

    // Fast-path: if service is unavailable, fail gracefully
    if (!registrationService) {
      log.error('RegistrationService not attached to client');
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription('❌ Service is currently unavailable. Please try again later.')
            .setColor(EMBED_COLORS.ERROR),
        ],
        ephemeral: true,
      });
      return;
    }

    // Guard: already registered
    const alreadyRegistered = await registrationService.isRegistered(interaction.user.id);
    if (alreadyRegistered) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('⚔️ Already Enlisted')
            .setDescription(
              [
                'You already have a character in Ascension Legends!',
                '',
                '> Use `/profile` to view your character.',
              ].join('\n'),
            )
            .setColor(EMBED_COLORS.WARNING),
        ],
        ephemeral: true,
      });
      return;
    }

    // Step 1: show character name modal
    const modal = buildCharacterNameModal();
    await interaction.showModal(modal);

    log.debug('Character name modal shown', { userId: interaction.user.id });
  },
};

export default command;
