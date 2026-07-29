/**
 * Battle system public barrel.
 *
 * Import everything battle-related from this single entry point.
 * Internal sub-modules may change; this barrel is the stable surface.
 */

// Core engine
export { BattleEngine, SeededRandom, ELEMENTS } from './BattleEngine.js';
export { BattleService } from './BattleService.js';

// Deterministic RNG
export { SeededRandom as Rng } from './SeededRandom.js';
export type { ISeededRandom } from './SeededRandom.js';

// State primitives
export { createParticipantState, createBattleState } from './BattleState.js';
export type { BattleParticipantState, BattleState } from './BattleState.js';
export { createBattleContext } from './BattleContext.js';
export type { BattleContext } from './BattleContext.js';

// Pure calculators
export { DamageCalculator } from './DamageCalculator.js';
export type { DamageInput, DamageResult } from './DamageCalculator.js';
export { CriticalCalculator } from './CriticalCalculator.js';
export type { CritInput, CritResult } from './CriticalCalculator.js';
export { AccuracyCalculator } from './AccuracyCalculator.js';
export type { AccuracyInput } from './AccuracyCalculator.js';
export { EvasionCalculator } from './EvasionCalculator.js';
export type { EvasionInput } from './EvasionCalculator.js';

// Engines
export { StatusEffectEngine } from './StatusEffectEngine.js';
export type { EmitFn } from './StatusEffectEngine.js';
export { CooldownEngine } from './CooldownEngine.js';

// Infrastructure
export { BattleLogger } from './BattleLogger.js';
export { BattleSerializer } from './BattleSerializer.js';
export { BattleValidator } from './BattleValidator.js';
export type { ValidationResult } from './BattleValidator.js';
export { BattleEvents } from './BattleEvents.js';
export type {
  BattleStartPayload,
  BattleEndPayload,
  RoundPayload,
  TurnEventPayload,
} from './BattleEvents.js';

// Orchestration utilities
export { ActionQueue } from './ActionQueue.js';
export { Timeline } from './Timeline.js';
export { TurnManager } from './TurnManager.js';
export type { TurnOrder } from './TurnManager.js';

// High-level orchestration
export { BattleSession } from './BattleSession.js';
export type { BattleSessionOptions, SessionStatus } from './BattleSession.js';
export { BattleCoordinator } from './BattleCoordinator.js';
export type { BattleCoordinatorDeps } from './BattleCoordinator.js';
export { BattleManager } from './BattleManager.js';
export type { CreateBattleOptions } from './BattleManager.js';

// Types
export type {
  BattleAction,
  BattleActionType,
  BattleElement,
  BattleEvent,
  BattleEventType,
  BattleInput,
  BattleOutcome,
  BattleParticipant,
  BattleParticipantResult,
  BattleResult,
  BattleSkill,
  BattleStats,
  BattleStatus,
  BattleType,
  DamageType,
  StatusType,
} from './types.js';
