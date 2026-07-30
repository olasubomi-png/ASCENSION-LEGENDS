/**
 * /train — Sprint 4 PvE training battle.
 *
 * Flow:
 *   1. Require active character
 *   2. Pick level-scaled training monster
 *   3. Run deterministic BattleEngine via BattleService
 *   4. On win: award XP + gold; always record W/L on profile
 *   5. Reply with battle summary embed
 */

import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

import type { AscensionClient } from '../client/AscensionClient.js';
import type { ClassId } from '../constants/classes.js';
import { CLASS_DEFINITIONS } from '../constants/classes.js';
import { EMBED_COLORS } from '../constants/discord.js';
import {
  buildTrainingMonsterStats,
  pickTrainingMonster,
} from '../constants/monsters.js';
import type { BattleParticipant, BattleResult } from '../services/battle/types.js';
import type { SlashCommand } from '../types/discord.js';
import { formatNumber } from '../utils/format.js';
import { childLogger } from '../utils/logger.js';
import { CharacterService } from '../services/character/CharacterService.js';

const log = childLogger('Command:Train');

/** Base XP / gold scaled by monster power and player level (Phase 1 starter loop). */
function computeRewards(playerLevel: number, powerScale: number, won: boolean): {
  xp: number;
  gold: number;
} {
  if (!won) {
    return { xp: Math.max(5, Math.round(8 + playerLevel * 2)), gold: 0 };
  }
  const xp = Math.round(30 + playerLevel * 12 * powerScale);
  const gold = Math.round(15 + playerLevel * 5 * powerScale);
  return { xp, gold };
}

function summarizeBattle(result: BattleResult, playerId: string, monsterName: string): string {
  const damageEvents = result.events.filter((e) => e.type === 'damage' && (e.amount ?? 0) > 0);
  const crits = damageEvents.filter((e) => e.critical).length;
  const playerDamage = damageEvents
    .filter((e) => e.actorId === playerId)
    .reduce((sum, e) => sum + (e.amount ?? 0), 0);
  const monsterDamage = damageEvents
    .filter((e) => e.actorId !== playerId)
    .reduce((sum, e) => sum + (e.amount ?? 0), 0);

  return [
    `**Rounds:** ${result.rounds}`,
    `**Your damage:** ${formatNumber(playerDamage)}`,
    `**${monsterName} damage:** ${formatNumber(monsterDamage)}`,
    crits > 0 ? `**Critical hits:** ${crits}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName('train')
    .setDescription('Train against a local threat near Verdant Crossing and earn XP.'),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    const client = interaction.client as AscensionClient;
    const characterService = client.characterService;
    const battleService = client.battleService;
    const profileService = client.profileService;
    const economyService = client.economyService;

    if (!characterService || !battleService) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription('❌ Combat services are currently unavailable. Please try again later.')
            .setColor(EMBED_COLORS.ERROR),
        ],
      });
      return;
    }

    const characterResult = await characterService.getActiveCharacter(interaction.user.id);
    if (!characterResult.ok) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription('❌ Could not load your character. Please try again.')
            .setColor(EMBED_COLORS.ERROR),
        ],
      });
      return;
    }

    const character = characterResult.value;
    if (!character) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle('📜 No Character Found')
            .setDescription('You have not started your journey yet!\n\n> Use `/start` to create your character.')
            .setColor(EMBED_COLORS.INFO),
        ],
      });
      return;
    }

    const monsterDef = pickTrainingMonster(character.level);
    const monsterStats = buildTrainingMonsterStats(character.level, monsterDef.powerScale);
    const monsterId = `npc_${monsterDef.id}`;

    const playerParticipant: BattleParticipant = {
      id: character.characterId,
      name: character.name,
      stats: { ...character.stats },
      element: 'iron',
    };

    const monsterParticipant: BattleParticipant = {
      id: monsterId,
      name: monsterDef.name,
      stats: monsterStats,
      element: monsterDef.element,
    };

    let result: BattleResult;
    try {
      result = await battleService.initiateBattle(character.characterId, monsterId, {
        participants: [playerParticipant, monsterParticipant],
        seed: `${character.characterId}:${monsterId}:${Date.now()}`,
        type: 'pve',
        maxRounds: 30,
      });
    } catch (err) {
      log.error('Battle engine failed', { err: String(err), userId: interaction.user.id });
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription('❌ The battle could not be resolved. Please try again.')
            .setColor(EMBED_COLORS.ERROR),
        ],
      });
      return;
    }

    const won = result.winnerId === character.characterId;
    const { xp, gold } = computeRewards(character.level, monsterDef.powerScale, won);

    let levelUpLine = '';
    let updatedCharacter = character;

    if (xp > 0) {
      const xpResult = await characterService.awardExperience(
        character.characterId,
        interaction.user.id,
        xp,
      );
      if (xpResult.ok) {
        updatedCharacter = xpResult.value.character;
        if (xpResult.value.didLevelUp) {
          levelUpLine = `\n🎉 **Level up!** → **Level ${xpResult.value.newLevel}**`;
          if (profileService) {
            const newPr = CharacterService.powerRatingFromProfile(updatedCharacter);
            await profileService.updatePowerRating(character.userId, newPr);
          }
        }
      } else {
        log.warn('Failed to award XP', { err: String(xpResult.error) });
      }
    }

    if (gold > 0 && economyService) {
      const creditResult = await economyService.credit(
        character.userId,
        gold,
        'gold',
        `train:${monsterDef.id}`,
      );
      if (!creditResult.ok) {
        log.warn('Failed to credit gold', { err: String(creditResult.error) });
      }
    }

    if (profileService) {
      await profileService.recordBattleResult(character.userId, won);
    }

    const cls = CLASS_DEFINITIONS[character.classId as ClassId];
    const title = won
      ? `${monsterDef.emoji} Victory — ${monsterDef.name}`
      : `${monsterDef.emoji} Defeat — ${monsterDef.name}`;

    const outcomeColor = won ? EMBED_COLORS.SUCCESS : EMBED_COLORS.ERROR;
    const rewardLines = won
      ? [`**XP:** +${formatNumber(xp)}`, `**Gold:** +${formatNumber(gold)}`]
      : [`**Consolation XP:** +${formatNumber(xp)}`];

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(
        [
          `**${character.name}** ${cls?.emoji ?? '⚔️'} vs **${monsterDef.name}**`,
          monsterDef.description,
          '',
          summarizeBattle(result, character.characterId, monsterDef.name),
          '',
          rewardLines.join(' · ') + levelUpLine,
        ].join('\n'),
      )
      .setColor(outcomeColor)
      .addFields(
        {
          name: 'Your HP',
          value: `${result.participants[0]?.hp ?? 0} / ${result.participants[0]?.maxHp ?? character.stats.maxHp}`,
          inline: true,
        },
        {
          name: `${monsterDef.name} HP`,
          value: `${result.participants[1]?.hp ?? 0} / ${result.participants[1]?.maxHp ?? monsterStats.maxHp}`,
          inline: true,
        },
        {
          name: 'Level',
          value: String(updatedCharacter.level),
          inline: true,
        },
      )
      .setFooter({
        text: `Battle ID ${result.battleId} · Seed ${String(result.seed).slice(0, 24)}`,
      })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });

    log.info('Training battle completed', {
      userId: interaction.user.id,
      monsterId: monsterDef.id,
      won,
      rounds: result.rounds,
      xp,
      gold,
    });
  },
};

export default command;
