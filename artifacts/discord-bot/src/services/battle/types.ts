import type { ICharacterStats } from '../../models/CharacterModel.js';

export type BattleElement = 'flame' | 'frost' | 'storm' | 'terra' | 'void' | 'radiance' | 'iron';
/** physical: uses Attack vs Defense; magic: uses MagicAttack vs MagicDefense; true: bypasses all defense. */
export type DamageType = 'physical' | 'magic' | 'true';
export type BattleType = 'pve' | 'pvp';
export type BattleOutcome = 'attacker_win' | 'defender_win' | 'draw' | 'retreat';

export type StatusType =
  | 'burn'
  | 'freeze'
  | 'poison'
  | 'bleed'
  | 'shock'
  | 'fear'
  | 'silence'
  | 'curse'
  | 'blind'
  | 'regeneration'
  | 'shield'
  | 'barrier'
  | 'weakness'
  | 'slow'
  | 'sleep'
  | 'stun';

export interface BattleStatus {
  type: StatusType;
  duration: number;
  stacks?: number;
  /** Attack value captured when a damage-over-time effect was applied. */
  sourceAttack?: number;
  /** Shield / barrier hit points, or an optional custom effect value. */
  value?: number;
}

export interface BattleStats extends ICharacterStats {}

export interface BattleParticipant {
  id: string;
  name: string;
  stats: BattleStats;
  element?: BattleElement;
  statuses?: BattleStatus[];
}

export interface BattleSkill {
  id: string;
  name: string;
  element?: BattleElement;
  damageType?: DamageType;
  damageMultiplier?: number;
  energyCost?: number;
  cooldown?: number;
  hits?: number;
  status?: BattleStatus;
  statusChance?: number;
  healingMultiplier?: number;
  shieldMultiplier?: number;
  isUltimate?: boolean;
  guaranteedCrit?: boolean;
  cannotBeCountered?: boolean;
  accuracyBonus?: number;
  critChanceBonus?: number;
}

export type BattleActionType = 'attack' | 'skill' | 'block' | 'parry' | 'counter' | 'pass';

export interface BattleAction {
  actorId: string;
  targetId?: string;
  type: BattleActionType;
  skill?: BattleSkill;
  round?: number;
}

export interface BattleInput {
  battleId: string;
  seed: string | number;
  participants: [BattleParticipant, BattleParticipant];
  actions?: BattleAction[];
  maxRounds?: number;
  type?: BattleType;
}

export type BattleEventType =
  | 'battle_started'
  | 'initiative'
  | 'status_tick'
  | 'action'
  | 'damage'
  | 'heal'
  | 'status_applied'
  | 'status_removed'
  | 'counter'
  | 'round_end'
  | 'battle_ended';

export interface BattleEvent {
  sequence: number;
  round: number;
  type: BattleEventType;
  actorId?: string;
  targetId?: string;
  action?: BattleActionType;
  amount?: number;
  status?: StatusType;
  critical?: boolean;
  outcome?: string;
  metadata?: Record<string, number | string | boolean>;
}

export interface BattleParticipantResult {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  ultimateGauge: number;
  statuses: BattleStatus[];
  combo: number;
}

export interface BattleResult {
  battleId: string;
  seed: string | number;
  type: BattleType;
  outcome: BattleOutcome;
  winnerId?: string;
  rounds: number;
  participants: [BattleParticipantResult, BattleParticipantResult];
  events: BattleEvent[];
}
