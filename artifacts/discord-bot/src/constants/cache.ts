/** Redis key prefixes and TTLs (seconds) */
export const CACHE_KEYS = {
  PLAYER: 'player:',
  WALLET: 'wallet:',
  GUILD: 'guild:',
  INVENTORY: 'inventory:',
  LEADERBOARD: 'leaderboard:',
  BATTLE: 'battle:',
} as const;

export const CACHE_TTL = {
  PLAYER: 300,       // 5 min
  WALLET: 60,        // 1 min (financial data — short TTL)
  GUILD: 600,        // 10 min
  INVENTORY: 120,    // 2 min
  LEADERBOARD: 30,   // 30 sec (real-time feel)
  BATTLE: 3600,      // 1 hour (immutable after completion)
} as const;
