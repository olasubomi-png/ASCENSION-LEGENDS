/**
 * /profile — Display a player's profile card.
 *
 * Shows:
 *   - Character portrait placeholder
 *   - Name, class, level, XP
 *   - Power Rating + rank label
 *   - Guild
 *   - Prestige level
 *   - Core stats
 *   - Equipment slots (placeholders)
 *   - Currencies (gold, gems)
 *   - Win / loss record
 *
 * Rendering: Canvas image card via ProfileCardRenderer.
 * Falls back to rich embed if Canvas is unavailable.
 */

import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

import type { AscensionClient } from '../client/AscensionClient.js';
import type { ClassId } from '../constants/classes.js';
import { CLASS_DEFINITIONS } from '../constants/classes.js';
import { EMBED_COLORS } from '../constants/discord.js';
import { ProfileCardRenderer } from '../renderer/ProfileCardRenderer.js';
import type { SlashCommand } from '../types/discord.js';
import { formatNumber } from '../utils/format.js';
import { childLogger } from '../utils/logger.js';
import { getPowerRatingLabel } from '../utils/statsCalculator.js';

const log = childLogger('Command:Profile');
const renderer = new ProfileCardRenderer();

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View your Ascension Legends character profile.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Player whose profile to view (defaults to yourself).')
        .setRequired(false),
    ) as unknown as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    const target = interaction.options.getUser('user') ?? interaction.user;
    const client = interaction.client as AscensionClient;

    // Load character
    const characterResult = await client.characterService?.getActiveCharacter(target.id);
    if (!characterResult || !characterResult.ok) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription('❌ Could not load character data. Please try again.')
            .setColor(EMBED_COLORS.ERROR),
        ],
      });
      return;
    }

    const character = characterResult.value;
    if (!character) {
      const isSelf = target.id === interaction.user.id;
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle('📜 No Character Found')
            .setDescription(
              isSelf
                ? 'You have not started your journey yet!\n\n> Use `/start` to create your character.'
                : `**${target.displayName}** has not started their journey yet.`,
            )
            .setColor(EMBED_COLORS.INFO),
        ],
      });
      return;
    }

    // Load wallet — may be undefined if economyService is not attached
    const walletResult = await client.economyService?.getBalance(character.userId);
    // walletResult is Result<Wallet>|undefined; extract value when ok
    const wallet = walletResult?.ok === true ? walletResult.value : null;

    // Load profile (power rating, prestige, etc.)
    const profileResult = await client.profileService?.getProfile(target.id);
    const profile = profileResult?.ok === true ? profileResult.value : null;

    const cls = CLASS_DEFINITIONS[character.classId as ClassId];
    const pr = profile !== null ? profile.powerRating : 0;
    const prLabel = getPowerRatingLabel(pr);

    // Attempt Canvas render
    let imageAttachment: { attachment: Buffer; name: string } | null = null;
    try {
      const cardBuffer = await renderer.render({
        userId: target.id,
        username: character.name,
        level: character.level,
        className: cls.name,
        classEmoji: cls.emoji,
        gold: wallet !== null ? wallet.gold : 0,
        gems: wallet !== null ? wallet.gems : 0,
        stats: character.stats,
        powerRating: pr,
        powerRatingLabel: prLabel,
        experience: character.experience,
        experienceToNextLevel: character.experienceToNextLevel,
        prestigeLevel: profile !== null ? profile.prestigeLevel : 0,
        battlesWon: profile !== null ? profile.battlesWon : 0,
        battlesLost: profile !== null ? profile.battlesLost : 0,
        guildId: profile !== null ? profile.guildId : undefined,
        avatarUrl: target.displayAvatarURL({ size: 256, extension: 'png' }),
      });

      if (cardBuffer.length > 0) {
        imageAttachment = { attachment: cardBuffer, name: 'profile-card.png' };
      }
    } catch (renderErr) {
      log.warn('Canvas render failed, falling back to embed', {
        err: String(renderErr),
        userId: target.id,
      });
    }

    // Build the embed (always shown; image appended if available)
    const xpPercent =
      character.experienceToNextLevel > 0
        ? Math.floor((character.experience / character.experienceToNextLevel) * 100)
        : 0;
    const xpBar = buildProgressBar(xpPercent, 10);

    const prestigeLevel = profile !== null ? profile.prestigeLevel : 0;
    const guildId = profile !== null ? profile.guildId : null;

    const embed = new EmbedBuilder()
      .setTitle(`${cls.emoji} ${character.name}`)
      .setDescription(
        [
          `**Class:** ${cls.name}`,
          `**Level:** ${character.level} — *${getLevelTitle(character.level)}*`,
          imageAttachment
            ? ''
            : `**XP:** ${formatNumber(character.experience)} / ${formatNumber(character.experienceToNextLevel)} ${xpBar} (${xpPercent}%)`,
          `**Power Rating:** ${formatNumber(pr)} *(${prLabel})*`,
          prestigeLevel > 0 ? `**Prestige:** ✨ Level ${prestigeLevel}` : '',
          guildId !== null ? `**Guild:** <guild data>` : '**Guild:** *None*',
        ]
          .filter(Boolean)
          .join('\n'),
      )
      .setColor(EMBED_COLORS.LEGENDARY)
      .setThumbnail(target.displayAvatarURL({ size: 256 }))
      .addFields(
        // Stats
        {
          name: '❤️ HP',
          value: `${formatNumber(character.stats.hp)} / ${formatNumber(character.stats.maxHp)}`,
          inline: true,
        },
        {
          name: '💧 Mana',
          value: `${formatNumber(character.stats.mp)} / ${formatNumber(character.stats.maxMp)}`,
          inline: true,
        },
        { name: '⚡ Speed', value: String(character.stats.speed), inline: true },
        { name: '⚔️ Attack', value: String(character.stats.attack), inline: true },
        { name: '🛡️ Defense', value: String(character.stats.defense), inline: true },
        { name: '✨ Magic ATK', value: String(character.stats.magicAttack), inline: true },
        { name: '🎯 Crit Chance', value: `${character.stats.critRate}%`, inline: true },
        { name: '💥 Crit Dmg', value: `${character.stats.critDamage}%`, inline: true },
        { name: '🍀 Luck', value: String(character.stats.luck), inline: true },
        // Economy
        {
          name: '💰 Gold',
          value: formatNumber(wallet !== null ? wallet.gold : 0),
          inline: true,
        },
        {
          name: '💎 Gems',
          value: formatNumber(wallet !== null ? wallet.gems : 0),
          inline: true,
        },
        { name: '\u200B', value: '\u200B', inline: true },
        // Record
        {
          name: '🏆 Wins',
          value: String(profile !== null ? profile.battlesWon : 0),
          inline: true,
        },
        {
          name: '💀 Losses',
          value: String(profile !== null ? profile.battlesLost : 0),
          inline: true,
        },
        {
          name: '🗡️ Total Battles',
          value: String(profile !== null ? profile.battlesTotal : 0),
          inline: true,
        },
        // Equipment placeholders
        {
          name: '🗡️ Equipment',
          value: [
            '**Weapon:** Starter Weapon',
            '**Armor:** Starter Armor',
            '**Helm:** —',
            '**Boots:** —',
            '**Ring:** —',
            '**Amulet:** —',
          ].join('\n'),
          inline: false,
        },
      )
      .setFooter({ text: `Ascension Legends • ${target.username}` })
      .setTimestamp();

    if (imageAttachment) {
      embed.setImage(`attachment://${imageAttachment.name}`);
      await interaction.editReply({
        embeds: [embed],
        files: [imageAttachment],
      });
    } else {
      await interaction.editReply({ embeds: [embed] });
    }

    log.debug('Profile viewed', { viewerId: interaction.user.id, targetId: target.id });
  },
};

function buildProgressBar(percent: number, length: number): string {
  const filled = Math.round((percent / 100) * length);
  const empty = length - filled;
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
}

function getLevelTitle(level: number): string {
  if (level <= 10) return 'Initiate';
  if (level <= 25) return 'Acolyte';
  if (level <= 50) return 'Challenger';
  if (level <= 75) return 'Veteran';
  if (level <= 99) return 'Elite';
  return 'Ascended';
}

export default command;
