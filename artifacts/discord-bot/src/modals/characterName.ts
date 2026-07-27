/**
 * Modal: character_name
 *
 * Shown during /start step 1. Collects the player's desired character name.
 * On submit, validates the name and shows the class selection embed.
 */

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import type { ModalSubmitInteraction } from 'discord.js';

import { CLASS_DEFINITIONS, CLASS_ORDER } from '../constants/classes.js';
import { EMBED_COLORS } from '../constants/discord.js';
import type { ModalHandler } from '../types/discord.js';
import { characterValidator } from '../validators/character.validator.js';

export const MODAL_ID = 'character_name';

/** Build the modal shown to the player */
export function buildCharacterNameModal(): ModalBuilder {
  const modal = new ModalBuilder()
    .setCustomId(MODAL_ID)
    .setTitle('Choose Your Name, Hero');

  const nameInput = new TextInputBuilder()
    .setCustomId('name')
    .setLabel('Character Name (3–16 characters)')
    .setStyle(TextInputStyle.Short)
    .setMinLength(3)
    .setMaxLength(16)
    .setPlaceholder('e.g. Kazuren, Shadowblade, IronWarden…')
    .setRequired(true);

  modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput));
  return modal;
}

/** Build the class selection embed + buttons shown after name is validated */
function buildClassSelectEmbed(characterName: string): {
  embed: EmbedBuilder;
  rows: ActionRowBuilder<ButtonBuilder>[];
} {
  const embed = new EmbedBuilder()
    .setTitle(`⚔️ Welcome, ${characterName}!`)
    .setDescription(
      [
        '**Your name has been accepted.** Now choose your path.',
        '',
        '> Each class shapes your journey differently.',
        '> Your choice cannot be changed after registration.',
        '',
      ].join('\n'),
    )
    .setColor(EMBED_COLORS.LEGENDARY)
    .setFooter({ text: 'Ascension Legends • Character Creation' });

  for (const classId of CLASS_ORDER) {
    const cls = CLASS_DEFINITIONS[classId];
    embed.addFields({
      name: `${cls.emoji} ${cls.name}`,
      value: [
        cls.description,
        '',
        cls.flavor,
        '',
        `❤️ HP: **${cls.stats.maxHp}** | ⚔️ ATK: **${cls.stats.attack}** | 🛡️ DEF: **${cls.stats.defense}** | ⚡ SPD: **${cls.stats.speed}**`,
      ].join('\n'),
      inline: false,
    });
  }

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    ...CLASS_ORDER.map((classId) => {
      const cls = CLASS_DEFINITIONS[classId];
      return new ButtonBuilder()
        .setCustomId(`select_class:${classId}:${characterName}`)
        .setLabel(`${cls.emoji} ${cls.name}`)
        .setStyle(ButtonStyle.Primary);
    }),
  );

  return { embed, rows: [row] };
}

const characterNameModal: ModalHandler = {
  customId: MODAL_ID,

  async execute(interaction: ModalSubmitInteraction): Promise<void> {
    await interaction.deferReply({ ephemeral: true });

    const rawName = interaction.fields.getTextInputValue('name');

    // Validate character name
    const validation = characterValidator.name.safeParse(rawName);
    if (!validation.success) {
      const errorMsg = validation.error.errors.map((e) => e.message).join(' ');
      const errorEmbed = new EmbedBuilder()
        .setDescription(`❌ **Invalid name:** ${errorMsg}`)
        .setColor(EMBED_COLORS.ERROR);
      await interaction.editReply({ embeds: [errorEmbed] });
      return;
    }

    const characterName = validation.data;
    const { embed, rows } = buildClassSelectEmbed(characterName);
    await interaction.editReply({ embeds: [embed], components: rows });
  },
};

export default characterNameModal;
