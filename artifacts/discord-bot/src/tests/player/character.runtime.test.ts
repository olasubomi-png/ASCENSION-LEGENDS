import type { CharacterProfile } from '../../interfaces/ICharacterService.js';
import { CharacterRuntime } from '../../player/CharacterRuntime.js';

function makeProfile(overrides: Partial<CharacterProfile> = {}): CharacterProfile {
  return {
    id: 'char_test01',
    characterId: 'char_test01',
    userId: 'user_01',
    discordId: '123456789',
    name: 'TestHero',
    classId: 'vanguard',
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
    stats: {
      hp: 700,
      maxHp: 700,
      mp: 100,
      maxMp: 100,
      attack: 85,
      defense: 110,
      magicAttack: 35,
      magicDefense: 60,
      speed: 55,
      luck: 10,
      critRate: 5,
      critDamage: 150,
      evasion: 10,
      accuracy: 85,
    },
    statPoints: 0,
    skillPoints: 0,
    locationId: 'starting_zone',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('CharacterRuntime', () => {
  let runtime: CharacterRuntime;

  beforeEach(() => {
    runtime = new CharacterRuntime(makeProfile());
  });

  describe('identity', () => {
    it('exposes character identity fields', () => {
      expect(runtime.characterId).toBe('char_test01');
      expect(runtime.name).toBe('TestHero');
      expect(runtime.classId).toBe('vanguard');
      expect(runtime.level).toBe(1);
    });
  });

  describe('stats', () => {
    it('maps mp to energy', () => {
      expect(runtime.computedStats.energy).toBe(100);
      expect(runtime.computedStats.maxEnergy).toBe(100);
    });

    it('maps magicAttack to magic', () => {
      expect(runtime.computedStats.magic).toBe(35);
    });

    it('initialises stamina to 100', () => {
      expect(runtime.computedStats.stamina).toBe(100);
      expect(runtime.computedStats.maxStamina).toBe(100);
    });

    it('base and computed stats match initially', () => {
      expect(runtime.computedStats.attack).toBe(runtime.baseStats.attack);
    });
  });

  describe('stat modifiers', () => {
    it('addModifier updates computed stats', () => {
      runtime.addModifier({
        id: 'sword_atk',
        source: 'sword',
        sourceType: 'equipment',
        stat: 'attack',
        valueType: 'flat',
        value: 50,
      });
      expect(runtime.computedStats.attack).toBe(135); // 85 + 50
    });

    it('removeModifier reverts computed stats', () => {
      runtime.addModifier({
        id: 'sword_atk',
        source: 'sword',
        sourceType: 'equipment',
        stat: 'attack',
        valueType: 'flat',
        value: 50,
      });
      runtime.removeModifier('sword_atk');
      expect(runtime.computedStats.attack).toBe(85);
    });

    it('removeModifiersBySourceType removes all of type', () => {
      runtime.addModifier({ id: 'b1', source: 'buff_1', sourceType: 'buff', stat: 'attack', valueType: 'flat', value: 20 });
      runtime.addModifier({ id: 'e1', source: 'equip', sourceType: 'equipment', stat: 'defense', valueType: 'flat', value: 30 });
      runtime.removeModifiersBySourceType('buff');
      expect(runtime.computedStats.attack).toBe(85);
      expect(runtime.computedStats.defense).toBe(140); // equipment still active
    });

    it('tickModifiers removes expired modifiers', () => {
      runtime.addModifier({
        id: 'temp_atk',
        source: 'skill',
        sourceType: 'skill',
        stat: 'attack',
        valueType: 'flat',
        value: 30,
        duration: 1,
      });
      expect(runtime.computedStats.attack).toBe(115);
      runtime.tickModifiers();
      expect(runtime.computedStats.attack).toBe(85);
    });
  });

  describe('resource management', () => {
    it('spendEnergy reduces energy', () => {
      const success = runtime.spendEnergy(30);
      expect(success).toBe(true);
      expect(runtime.computedStats.energy).toBe(70);
    });

    it('spendEnergy fails when insufficient', () => {
      const success = runtime.spendEnergy(200);
      expect(success).toBe(false);
      expect(runtime.computedStats.energy).toBe(100); // unchanged
    });

    it('restoreEnergy caps at maxEnergy', () => {
      runtime.spendEnergy(50);
      runtime.restoreEnergy(200);
      expect(runtime.computedStats.energy).toBe(100);
    });

    it('takeDamage reduces HP', () => {
      const taken = runtime.takeDamage(200);
      expect(taken).toBe(200);
      expect(runtime.computedStats.hp).toBe(500);
    });

    it('takeDamage cannot reduce HP below 0', () => {
      const taken = runtime.takeDamage(9999);
      expect(taken).toBe(700);
      expect(runtime.computedStats.hp).toBe(0);
    });

    it('heal restores HP capped at maxHp', () => {
      runtime.takeDamage(300);
      const healed = runtime.heal(1000);
      expect(healed).toBe(300);
      expect(runtime.computedStats.hp).toBe(700);
    });

    it('isAlive returns false when HP reaches 0', () => {
      runtime.takeDamage(9999);
      expect(runtime.isAlive).toBe(false);
    });
  });

  describe('cooldowns', () => {
    it('sets and checks cooldown', () => {
      runtime.setCooldown('skill_abc', 5);
      expect(runtime.isOnCooldown('skill_abc', 3)).toBe(true);
      expect(runtime.isOnCooldown('skill_abc', 5)).toBe(true);
      expect(runtime.isOnCooldown('skill_abc', 6)).toBe(false);
    });

    it('cooldownRemaining returns correct value', () => {
      runtime.setCooldown('skill_abc', 5);
      expect(runtime.cooldownRemaining('skill_abc', 3)).toBe(3);
      expect(runtime.cooldownRemaining('skill_abc', 5)).toBe(1);
      expect(runtime.cooldownRemaining('skill_abc', 6)).toBe(0);
    });

    it('tickCooldowns removes expired entries', () => {
      runtime.setCooldown('skill_abc', 3);
      runtime.setCooldown('skill_xyz', 10);
      runtime.tickCooldowns(5);
      expect(runtime.isOnCooldown('skill_abc', 5)).toBe(false);
      expect(runtime.isOnCooldown('skill_xyz', 5)).toBe(true);
    });
  });

  describe('skill loadout', () => {
    it('sets and reads skill loadout', () => {
      runtime.setSkillLoadout(['active_1'], ['passive_1'], ['ult_1'], ['combo_1']);
      expect(runtime.activeSkillIds).toContain('active_1');
      expect(runtime.passiveSkillIds).toContain('passive_1');
      expect(runtime.ultimateSkillIds).toContain('ult_1');
      expect(runtime.comboSkillIds).toContain('combo_1');
    });

    it('addComboSkill adds without duplicates', () => {
      runtime.addComboSkill('combo_1');
      runtime.addComboSkill('combo_1');
      expect([...runtime.comboSkillIds].filter((id) => id === 'combo_1')).toHaveLength(1);
    });

    it('clearComboSkills empties combo list', () => {
      runtime.addComboSkill('combo_1');
      runtime.clearComboSkills();
      expect(runtime.comboSkillIds).toHaveLength(0);
    });
  });

  describe('transformation', () => {
    it('enters and tracks transformation', () => {
      runtime.enterTransformation('blaze_form');
      expect(runtime.isTransformed).toBe(true);
      expect(runtime.transformationId).toBe('blaze_form');
    });

    it('exitTransformation resets state', () => {
      runtime.enterTransformation('blaze_form');
      runtime.exitTransformation();
      expect(runtime.isTransformed).toBe(false);
      expect(runtime.transformationId).toBeUndefined();
    });

    it('exitTransformation removes transformation modifiers', () => {
      runtime.addModifier({
        id: 'tf_atk',
        source: 'blaze_form',
        sourceType: 'transformation',
        stat: 'attack',
        valueType: 'percent',
        value: 50,
      });
      runtime.enterTransformation('blaze_form');
      runtime.exitTransformation();
      expect(runtime.computedStats.attack).toBe(85); // modifier removed
    });
  });

  describe('snapshot', () => {
    it('snapshot returns a deep copy', () => {
      const snap = runtime.snapshot();
      expect(snap.characterId).toBe('char_test01');
      expect(snap.computedStats.attack).toBe(runtime.computedStats.attack);
      // Mutating snap does not affect runtime
      snap.computedStats.attack = 9999;
      expect(runtime.computedStats.attack).toBe(85);
    });
  });

  describe('attributes', () => {
    it('computes powerRating > 0', () => {
      expect(runtime.attributes.powerRating).toBeGreaterThan(0);
    });

    it('caps effectiveEvasion at 90', () => {
      runtime.addModifier({
        id: 'evasion_buff',
        source: 'test',
        sourceType: 'buff',
        stat: 'evasion',
        valueType: 'flat',
        value: 200,
      });
      expect(runtime.attributes.effectiveEvasion).toBeLessThanOrEqual(90);
    });
  });
});
