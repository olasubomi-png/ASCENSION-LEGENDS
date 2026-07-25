import { Colors } from 'discord.js';

/** Standard embed colours for the game */
export const EMBED_COLORS = {
  PRIMARY: Colors.Blue,
  SUCCESS: Colors.Green,
  ERROR: Colors.Red,
  WARNING: Colors.Yellow,
  INFO: Colors.Blurple,
  LEGENDARY: Colors.Gold,
  EPIC: Colors.Purple,
} as const;

/** Pagination limits for Discord embeds */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 25,
} as const;

export const INTERACTION_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export const COMMAND_COOLDOWN_MS = 3_000; // 3 seconds default cooldown
