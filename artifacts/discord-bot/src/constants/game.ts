/** ULID prefixes per entity type, as per Database-Schema.md */
export const ID_PREFIXES = {
  USER: 'user_',
  PROFILE: 'prof_',
  CHARACTER: 'char_',
  WALLET: 'wlt_',
  INVENTORY: 'inv_',
  BATTLE: 'btl_',
  GUILD: 'gld_',
  QUEST: 'qst_',
  ITEM: 'item_',
  LEDGER: 'ldgr_',
} as const;

export const CURRENCY = {
  GOLD: 'gold',
  GEMS: 'gems',
} as const;

export type Currency = (typeof CURRENCY)[keyof typeof CURRENCY];

/** Starting resources for a new player */
export const NEW_PLAYER_DEFAULTS = {
  GOLD: 100,
  GEMS: 0,
} as const;

export const MAX_GUILD_MEMBERS = 50;
export const MAX_INVENTORY_SLOTS = 100;
