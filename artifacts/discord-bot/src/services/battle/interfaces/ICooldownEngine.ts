export interface ICooldownEngine {
  set(cooldowns: Map<string, number>, skillId: string, turns: number): void;
  isOnCooldown(cooldowns: Map<string, number>, skillId: string): boolean;
  remaining(cooldowns: Map<string, number>, skillId: string): number;
  tick(cooldowns: Map<string, number>): void;
  clear(cooldowns: Map<string, number>, skillId: string): void;
  clearAll(cooldowns: Map<string, number>): void;
  snapshot(cooldowns: Map<string, number>): Record<string, number>;
}
