import {
  Events,
  EmbedBuilder,
  InteractionType,
} from 'discord.js';
import type { Interaction } from 'discord.js';

import type { AscensionClient } from '../client/AscensionClient.js';
import type { EventHandler } from '../client/EventLoader.js';
import { EMBED_COLORS } from '../constants/discord.js';
import { checkCooldown, getRemainingCooldown } from '../middleware/cooldown.js';
import { formatDuration } from '../utils/format.js';
import { childLogger } from '../utils/logger.js';

const log = childLogger('Event:InteractionCreate');

const interactionCreateEvent: EventHandler = {
  name: Events.InteractionCreate,

  async execute(interaction: unknown): Promise<void> {
    const ix = interaction as Interaction;
    const client = ix.client as AscensionClient;

    // ── Slash Commands ──────────────────────────────────────────────────────
    if (ix.isChatInputCommand()) {
      const command = client.commands.get(ix.commandName);
      if (!command) {
        log.warn('Unknown command received', { command: ix.commandName });
        return;
      }

      if (!checkCooldown(ix)) {
        const remaining = getRemainingCooldown(ix);
        const embed = new EmbedBuilder()
          .setDescription(
            `⏳ Please wait **${formatDuration(remaining)}** before using this command again.`,
          )
          .setColor(EMBED_COLORS.WARNING);
        await ix.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      try {
        await command.execute(ix);
        log.debug('Command executed', {
          command: ix.commandName,
          user: ix.user.tag,
          guild: ix.guildId,
        });
      } catch (err) {
        log.error('Command execution failed', { err: String(err), command: ix.commandName });
        const errorEmbed = new EmbedBuilder()
          .setDescription(
            '❌ An error occurred while executing this command. Please try again later.',
          )
          .setColor(EMBED_COLORS.ERROR);

        if (ix.deferred || ix.replied) {
          await ix.editReply({ embeds: [errorEmbed] });
        } else {
          await ix.reply({ embeds: [errorEmbed], ephemeral: true });
        }
      }
      return;
    }

    // ── Autocomplete ────────────────────────────────────────────────────────
    if (ix.isAutocomplete()) {
      const handler = client.autocomplete.get(ix.commandName);
      if (!handler) return;
      try {
        await handler.execute(ix);
      } catch (err) {
        log.error('Autocomplete failed', { err: String(err), command: ix.commandName });
      }
      return;
    }

    // ── Buttons ─────────────────────────────────────────────────────────────
    if (ix.isButton()) {
      const customId = ix.customId;
      const handler = client.buttons.find(
        (_, key) => (key instanceof RegExp ? key.test(customId) : key === customId),
      );
      if (!handler) {
        log.warn('No button handler found', { customId });
        return;
      }
      try {
        await handler.execute(ix);
      } catch (err) {
        log.error('Button handler failed', { err: String(err), customId });
      }
      return;
    }

    // ── Select Menus ────────────────────────────────────────────────────────
    if (ix.isAnySelectMenu()) {
      const customId = ix.customId;
      const handler = client.selectMenus.find(
        (_, key) => (key instanceof RegExp ? key.test(customId) : key === customId),
      );
      if (!handler) {
        log.warn('No select menu handler found', { customId });
        return;
      }
      try {
        await handler.execute(ix as never);
      } catch (err) {
        log.error('Select menu handler failed', { err: String(err), customId });
      }
      return;
    }

    // ── Modals ──────────────────────────────────────────────────────────────
    if (ix.type === InteractionType.ModalSubmit) {
      const customId = ix.customId;
      const handler = client.modals.find(
        (_, key) => (key instanceof RegExp ? key.test(customId) : key === customId),
      );
      if (!handler) {
        log.warn('No modal handler found', { customId });
        return;
      }
      try {
        await handler.execute(ix);
      } catch (err) {
        log.error('Modal handler failed', { err: String(err), customId });
      }
    }
  },
};

export default interactionCreateEvent;
