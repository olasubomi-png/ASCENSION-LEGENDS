import { TargetSelector } from '../../skills/TargetSelector.js';
import type { TargetSelectionContext } from '../../skills/types.js';

function ctx(overrides: Partial<TargetSelectionContext> = {}): TargetSelectionContext {
  return {
    actorId: 'actor_1',
    targetType: 'single_enemy',
    allParticipantIds: ['actor_1', 'enemy_1', 'enemy_2', 'ally_1'],
    allyIds: ['actor_1', 'ally_1'],
    enemyIds: ['enemy_1', 'enemy_2'],
    aliveIds: ['actor_1', 'enemy_1', 'enemy_2', 'ally_1'],
    requestedTargetId: undefined,
    ...overrides,
  };
}

describe('TargetSelector', () => {
  let selector: TargetSelector;

  beforeEach(() => {
    selector = new TargetSelector();
  });

  describe('self', () => {
    it('selects only the actor', () => {
      const result = selector.select(ctx({ targetType: 'self' }));
      expect(result.valid).toBe(true);
      expect(result.selectedIds).toEqual(['actor_1']);
    });

    it('fails when actor is dead', () => {
      const result = selector.select(ctx({ targetType: 'self', aliveIds: ['enemy_1'] }));
      expect(result.valid).toBe(false);
    });
  });

  describe('single_enemy', () => {
    it('selects first live enemy by default', () => {
      const result = selector.select(ctx({ targetType: 'single_enemy' }));
      expect(result.valid).toBe(true);
      expect(result.selectedIds).toHaveLength(1);
      expect(result.selectedIds[0]).toBe('enemy_1');
    });

    it('selects requested enemy when valid', () => {
      const result = selector.select(ctx({
        targetType: 'single_enemy',
        requestedTargetId: 'enemy_2',
      }));
      expect(result.valid).toBe(true);
      expect(result.selectedIds[0]).toBe('enemy_2');
    });

    it('fails when requested target is not a live enemy', () => {
      const result = selector.select(ctx({
        targetType: 'single_enemy',
        requestedTargetId: 'actor_1', // actor is not an enemy
      }));
      expect(result.valid).toBe(false);
    });

    it('fails when all enemies are dead', () => {
      const result = selector.select(ctx({
        targetType: 'single_enemy',
        aliveIds: ['actor_1', 'ally_1'],
      }));
      expect(result.valid).toBe(false);
    });
  });

  describe('single_ally', () => {
    it('selects first live ally by default', () => {
      const result = selector.select(ctx({ targetType: 'single_ally' }));
      expect(result.valid).toBe(true);
      expect(['actor_1', 'ally_1']).toContain(result.selectedIds[0]);
    });

    it('selects requested ally when valid', () => {
      const result = selector.select(ctx({
        targetType: 'single_ally',
        requestedTargetId: 'ally_1',
      }));
      expect(result.valid).toBe(true);
      expect(result.selectedIds[0]).toBe('ally_1');
    });

    it('fails when requested target is an enemy', () => {
      const result = selector.select(ctx({
        targetType: 'single_ally',
        requestedTargetId: 'enemy_1',
      }));
      expect(result.valid).toBe(false);
    });
  });

  describe('aoe_enemies', () => {
    it('selects all live enemies', () => {
      const result = selector.select(ctx({ targetType: 'aoe_enemies' }));
      expect(result.valid).toBe(true);
      expect(result.selectedIds).toContain('enemy_1');
      expect(result.selectedIds).toContain('enemy_2');
      expect(result.selectedIds).not.toContain('actor_1');
    });

    it('excludes dead enemies', () => {
      const result = selector.select(ctx({
        targetType: 'aoe_enemies',
        aliveIds: ['actor_1', 'ally_1', 'enemy_2'], // enemy_1 dead
      }));
      expect(result.valid).toBe(true);
      expect(result.selectedIds).toEqual(['enemy_2']);
    });

    it('fails when no live enemies', () => {
      const result = selector.select(ctx({
        targetType: 'aoe_enemies',
        aliveIds: ['actor_1', 'ally_1'],
      }));
      expect(result.valid).toBe(false);
    });
  });

  describe('aoe_allies', () => {
    it('selects all live allies', () => {
      const result = selector.select(ctx({ targetType: 'aoe_allies' }));
      expect(result.valid).toBe(true);
      expect(result.selectedIds).toContain('actor_1');
      expect(result.selectedIds).toContain('ally_1');
    });
  });

  describe('all', () => {
    it('selects all participants except actor', () => {
      const result = selector.select(ctx({ targetType: 'all' }));
      expect(result.valid).toBe(true);
      expect(result.selectedIds).not.toContain('actor_1');
      expect(result.selectedIds).toHaveLength(3); // enemy_1, enemy_2, ally_1
    });
  });

  describe('helpers', () => {
    it('isAoE returns true for AoE target types', () => {
      expect(selector.isAoE('aoe_enemies')).toBe(true);
      expect(selector.isAoE('aoe_allies')).toBe(true);
      expect(selector.isAoE('all')).toBe(true);
      expect(selector.isAoE('single_enemy')).toBe(false);
      expect(selector.isAoE('self')).toBe(false);
    });

    it('isSelf returns true only for self target type', () => {
      expect(selector.isSelf('self')).toBe(true);
      expect(selector.isSelf('single_enemy')).toBe(false);
    });
  });
});
