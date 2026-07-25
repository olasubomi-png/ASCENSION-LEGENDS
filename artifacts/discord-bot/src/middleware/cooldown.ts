import { Collection } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

import { COMMAND_COOLDOWN_MS } from '../constants/discord.js';

/**
 * Simple in-memory cooldown tracker per user per command.
 * Replace with Redis-backed rate limiting for distributed deployments.
 */
const cooldowns = new Collection<string, Collection<string, number>>();

export function checkCooldown(
  interaction: ChatInputCommandInteraction,
  cooldownMs = COMMAND_COOLDOWN_MS,
): boolean {
  const commandName = interaction.commandName;
  const userId = interaction.user.id;

  if (!cooldowns.has(commandName)) {
    cooldowns.set(commandName, new Collection());
  }

  const timestamps = cooldowns.get(commandName)!;
  const now = Date.now();
  const expiry = timestamps.get(userId) ?? 0;

  if (now < expiry) {
    return false; // On cooldown
  }

  timestamps.set(userId, now + cooldownMs);
  setTimeout(() => timestamps.delete(userId), cooldownMs);
  return true; // Allowed
}

export function getRemainingCooldown(
  interaction: ChatInputCommandInteraction,
): number {
  const timestamps = cooldowns.get(interaction.commandName);
  if (!timestamps) return 0;
  const expiry = timestamps.get(interaction.user.id) ?? 0;
  return Math.max(0, expiry - Date.now());
}
