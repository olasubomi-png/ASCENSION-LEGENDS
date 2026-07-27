/**
 * Button handler: select_class:{classId}:{characterName}
 *
 * Fired when a player clicks a class selection button during /start.
 * Completes registration and shows the welcome card.
 */

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import type { ButtonInteraction } from 'discord.js';

import type { AscensionClient } from '../client/AscensionClient.js';
import type { ClassId } from '../constants/classes.js';
import { CLASS_DEFINITIONS, CLASS_ORDER } from '../constants/classes.js';
import { EMBED_COLORS } from '../constants/discord.js';
import type { ButtonHandler } from '../types/discord.js';
import { formatNumber } from '../utils/format.js';
import { childLogger } from '../utils/logger.js';

const log = childLogger('Button:ClassSelect');

/** Build the welcome embed shown after successful registration */
function buildWelcomeEmbed(
  characterName: string,
  classId: ClassId,
  starterGold: number,
): EmbedBuilder {
  const cls = CLASS_DEFINITIONS[classId];

  return new EmbedBuilder()
    .setTitle(`🌟 Your Legend Begins — ${characterName}`)
    .setDescription(
      [
        `You have chosen the path of the **${cls.emoji} ${cls.name}**.`,
        '',
        cls.flavor,
        '',
        '**Starter Package Received:**',
        '⚔️ Starter Weapon',
        '🛡️ Starter Armor',
        '🧪 Health Potion ×5',
        '💧 Mana Potion ×5',
        `💰 **${formatNumber(starterGold)} Gold**`,
        '',
        '**Next Steps:**',
        '> 📜 `/profile` — View your character card',
        '> ⚔️ `/battle` — Fight your first enemy *(coming soon)*',
        '> 🗺️ `/dungeon` — Enter your first dungeon *(coming soon)*',
      ].join('\n'),
    )
    .setColor(EMBED_COLORS.LEGENDARY)
    .addFields(
      { name: '❤️ HP', value: String(cls.stats.maxHp), inline: true },
      { name: '💧 Mana', value: String(cls.stats.maxMp), inline: true },
      { name: '⚔️ Attack', value: String(cls.stats.attack), inline: true },
      { name: '🛡️ Defense', value: String(cls.stats.defense), inline: true },
      { name: '✨ Magic ATK', value: String(cls.stats.magicAttack), inline: true },
      { name: '🔮 Magic DEF', value: String(cls.stats.magicDefense), inline: true },
      { name: '⚡ Speed', value: String(cls.stats.speed), inline: true },
      { name: '🍀 Luck', value: String(cls.stats.luck), inline: true },
      { name: '🎯 Crit Chance', value: `${cls.stats.critRate}%`, inline: true },
    )
    .setFooter({ text: 'Ascension Legends • Registration Complete' })
    .setTimestamp();
}

const classSelectHandler: ButtonHandler = {
  customId: /^select_class:/,

  async execute(interaction: ButtonInteraction): Promise<void> {
    await interaction.deferUpdate();

    const parts = interaction.customId.split(':');
    const classId = parts[1] as ClassId;
    const characterName = parts.slice(2).join(':'); // name may contain colons in edge cases

    // Validate classId
    if (!CLASS_ORDER.includes(classId)) {
      const errorEmbed = new EmbedBuilder()
        .setDescription('❌ Invalid class selection. Please use `/start` again.')
        .setColor(EMBED_COLORS.ERROR);
      await interaction.editReply({ embeds: [errorEmbed], components: [] });
      return;
    }

    const client = interaction.client as AscensionClient;
    const registrationService = client.registrationService;

    if (!registrationService) {
      log.error('RegistrationService not available on client');
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription('❌ Service unavailable. Please try again later.')
            .setColor(EMBED_COLORS.ERROR),
        ],
        components: [],
      });
      return;
    }

    // Check for duplicate registration (race condition guard)
    if (await registrationService.isRegistered(interaction.user.id)) {
      const dupEmbed = new EmbedBuilder()
        .setDescription('⚠️ You already have a character! Use `/profile` to view it.')
        .setColor(EMBED_COLORS.WARNING);
      await interaction.editReply({ embeds: [dupEmbed], components: [] });
      return;
    }

    // Perform registration
    const result = await registrationService.register({
      discordId: interaction.user.id,
      username: interaction.user.username,
      characterName,
      classId,
    });

    if (!result.ok) {
      log.error('Registration failed in button handler', {
        err: String(result.error),
        discordId: interaction.user.id,
        classId,
      });
      const failEmbed = new EmbedBuilder()
        .setDescription(`❌ Registration failed: ${result.error.message}`)
        .setColor(EMBED_COLORS.ERROR);
      await interaction.editReply({ embeds: [failEmbed], components: [] });
      return;
    }

    const { starterGold } = result.value;
    const welcomeEmbed = buildWelcomeEmbed(characterName, classId, starterGold);

    // Disable all class buttons after selection
    const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      ...CLASS_ORDER.map((cid) => {
        const cls = CLASS_DEFINITIONS[cid];
        return new ButtonBuilder()
          .setCustomId(`select_class:${cid}:${characterName}`)
          .setLabel(`${cls.emoji} ${cls.name}`)
          .setStyle(cid === classId ? ButtonStyle.Success : ButtonStyle.Secondary)
          .setDisabled(true);
      }),
    );

    await interaction.editReply({ embeds: [welcomeEmbed], components: [disabledRow] });

    log.info('Registration successful via button', {
      discordId: interaction.user.id,
      classId,
      characterName,
    });
  },
};

export default classSelectHandler;
