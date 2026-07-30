/**
 * SkillRegistry — canonical game-data registry for all skill definitions.
 *
 * Every skill in the game lives here. Skills reference stat keys, elements,
 * and damage types from the existing type system.
 *
 * Skills cover all required categories:
 *   Active, Passive, Ultimate, Combo, AoE, Single-Target,
 *   Buff, Debuff, Heal, Drain, Transformation.
 *
 * @see Book 1 §6 — Battle System
 * @see Book 2 §4 — Playable Classes (class-specific skill flavour)
 */

import type { PassiveSkillDefinition, SkillDefinition } from './types.js';

// ──────────────────────────────────────────────────────────────────────────────
// Universal skills (all classes)
// ──────────────────────────────────────────────────────────────────────────────

const UNIVERSAL_SKILLS: SkillDefinition[] = [
  {
    id: 'basic_attack',
    name: 'Basic Attack',
    description: 'A straightforward physical strike.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'iron',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'damage', value: 1.0, valueType: 'multiplier' }],
    comboFollowUps: ['combo_finisher'],
  },
  {
    id: 'healing_potion',
    name: 'Healing Potion',
    description: 'Consume a healing potion to restore HP.',
    category: 'active',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 5, minLevel: 1 },
    effects: [{ type: 'heal', value: 200, valueType: 'flat' }],
  },
  {
    id: 'rally',
    name: 'Rally',
    description: 'Boost your own attack for 2 rounds.',
    category: 'active',
    targetType: 'self',
    requirements: { energyCost: 15, cooldown: 4 },
    effects: [
      { type: 'buff', value: 20, valueType: 'percent', stat: 'attack', duration: 2 },
    ],
  },
  {
    id: 'resilience',
    name: 'Resilience',
    description: 'Passive: +10% Defense bonus, always active.',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'buff', value: 10, valueType: 'percent', stat: 'defense' }],
    trigger: 'passive_always',
  } as PassiveSkillDefinition,
  {
    id: 'fortune',
    name: 'Fortune',
    description: 'Passive: +5 Luck, always active.',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'buff', value: 5, valueType: 'flat', stat: 'luck' }],
    trigger: 'passive_always',
  } as PassiveSkillDefinition,
  {
    id: 'combo_finisher',
    name: 'Combo Finisher',
    description: 'A powerful strike that can only follow a successful combo opener.',
    category: 'combo',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'iron',
    requirements: {
      energyCost: 20,
      cooldown: 0,
      comboPrerequisites: ['basic_attack'],
    },
    effects: [{ type: 'damage', value: 1.8, valueType: 'multiplier', hits: 2 }],
  },
  {
    id: 'combo_empowered',
    name: 'Empowered Strike',
    description: 'A true-damage combo finisher guaranteed to critically hit.',
    category: 'combo',
    targetType: 'single_enemy',
    damageType: 'true',
    requirements: {
      energyCost: 35,
      cooldown: 2,
      comboPrerequisites: ['basic_attack', 'combo_finisher'],
    },
    effects: [{ type: 'damage', value: 1.5, valueType: 'multiplier' }],
    guaranteedCrit: true,
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Vanguard skills (tank archetype)
// ──────────────────────────────────────────────────────────────────────────────

const VANGUARD_SKILLS: SkillDefinition[] = [
  // Active — single target damage + stun
  {
    id: 'vanguard_shield_bash',
    name: 'Shield Bash',
    description: 'Slam your shield into the enemy, dealing damage and stunning them.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'iron',
    requirements: { energyCost: 25, cooldown: 3, allowedClasses: ['vanguard'] },
    effects: [
      { type: 'damage', value: 1.2, valueType: 'multiplier' },
      { type: 'debuff', value: 1, valueType: 'flat', statusType: 'stun', statusChance: 0.5, duration: 1 },
    ],
    comboFollowUps: ['combo_finisher'],
  },
  // Active — self buff (war cry)
  {
    id: 'vanguard_war_cry',
    name: 'War Cry',
    description: 'Unleash a fearsome cry, boosting Attack and Defense for 3 rounds.',
    category: 'active',
    targetType: 'self',
    requirements: { energyCost: 20, cooldown: 5, allowedClasses: ['vanguard'] },
    effects: [
      { type: 'buff', value: 15, valueType: 'percent', stat: 'attack', duration: 3 },
      { type: 'buff', value: 15, valueType: 'percent', stat: 'defense', duration: 3 },
    ],
  },
  // Active — self shield
  {
    id: 'vanguard_iron_wall',
    name: 'Iron Wall',
    description: 'Raise an impenetrable barrier, absorbing the next 300 damage.',
    category: 'active',
    targetType: 'self',
    requirements: { energyCost: 30, cooldown: 6, allowedClasses: ['vanguard'] },
    effects: [{ type: 'shield', value: 300, valueType: 'flat', duration: 3 }],
  },
  // Active — debuff (taunt — not yet engine-backed, stores as debuff metadata)
  {
    id: 'vanguard_taunt',
    name: 'Taunt',
    description: 'Force the enemy to attack you, lowering their Magic by 20% for 2 rounds.',
    category: 'active',
    targetType: 'single_enemy',
    requirements: { energyCost: 15, cooldown: 4, allowedClasses: ['vanguard'] },
    effects: [
      { type: 'debuff', value: -20, valueType: 'percent', stat: 'magic', duration: 2 },
    ],
  },
  // Active — counter stance
  {
    id: 'vanguard_counter_stance',
    name: 'Counter Stance',
    description: 'Enter a stance that retaliates for 150% damage when struck.',
    category: 'active',
    targetType: 'self',
    requirements: { energyCost: 20, cooldown: 4, allowedClasses: ['vanguard'] },
    effects: [{ type: 'buff', value: 50, valueType: 'percent', stat: 'defense', duration: 2 }],
  },
  // Passive — flat HP + defense
  {
    id: 'vanguard_fortitude',
    name: 'Fortitude',
    description: 'Passive: +100 HP and +15 Defense permanently.',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0, allowedClasses: ['vanguard'] },
    effects: [
      { type: 'buff', value: 100, valueType: 'flat', stat: 'maxHp' },
      { type: 'buff', value: 15, valueType: 'flat', stat: 'defense' },
    ],
    trigger: 'passive_always',
  } as PassiveSkillDefinition,
  // Passive — on-hit retaliation buff
  {
    id: 'vanguard_retaliation',
    name: 'Retaliation',
    description: 'Passive: When struck, gain +10% Attack for 1 round (70% chance).',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0, allowedClasses: ['vanguard'] },
    effects: [{ type: 'buff', value: 10, valueType: 'percent', stat: 'attack', duration: 1 }],
    trigger: 'on_hit_received',
    procChance: 0.7,
  } as PassiveSkillDefinition,
  // Ultimate — AoE taunt + massive self-buff
  {
    id: 'vanguard_unbreakable_fortress',
    name: 'Unbreakable Fortress',
    description: 'Channel the iron of your ancestors — become invincible for 2 rounds and deal reflect damage.',
    category: 'ultimate',
    targetType: 'self',
    requirements: { energyCost: 50, cooldown: 0, allowedClasses: ['vanguard'], minUltimateGauge: 100 },
    effects: [
      { type: 'buff', value: 50, valueType: 'percent', stat: 'defense', duration: 2 },
      { type: 'buff', value: 50, valueType: 'percent', stat: 'magicDefense', duration: 2 },
      { type: 'shield', value: 500, valueType: 'flat', duration: 2 },
    ],
    cannotBeCountered: true,
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Invoker skills (mage archetype)
// ──────────────────────────────────────────────────────────────────────────────

const INVOKER_SKILLS: SkillDefinition[] = [
  // Active — single target magic damage + burn
  {
    id: 'invoker_flame_bolt',
    name: 'Flame Bolt',
    description: 'Hurl a bolt of pure flame, dealing magic damage and applying burn.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'magic',
    element: 'flame',
    requirements: { energyCost: 25, cooldown: 2, allowedClasses: ['invoker'] },
    effects: [
      { type: 'damage', value: 1.4, valueType: 'multiplier' },
      { type: 'dot', value: 0.15, valueType: 'multiplier', statusType: 'burn', statusChance: 0.6, duration: 3 },
    ],
    comboFollowUps: ['invoker_frost_nova'],
  },
  // Active — AoE freeze
  {
    id: 'invoker_frost_nova',
    name: 'Frost Nova',
    description: 'Burst of freezing energy hits all enemies, slowing them.',
    category: 'active',
    targetType: 'aoe_enemies',
    damageType: 'magic',
    element: 'frost',
    requirements: { energyCost: 35, cooldown: 4, allowedClasses: ['invoker'] },
    effects: [
      { type: 'damage', value: 0.9, valueType: 'multiplier' },
      { type: 'debuff', value: -15, valueType: 'flat', stat: 'speed', statusType: 'slow', statusChance: 0.8, duration: 2 },
    ],
  },
  // Active — burst magic damage
  {
    id: 'invoker_arcane_burst',
    name: 'Arcane Burst',
    description: 'Unleash raw arcane energy in a 3-hit storm.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'magic',
    requirements: { energyCost: 40, cooldown: 3, allowedClasses: ['invoker'] },
    effects: [{ type: 'damage', value: 0.8, valueType: 'multiplier', hits: 3 }],
  },
  // Active — drain (damage + heal)
  {
    id: 'invoker_mana_drain',
    name: 'Mana Drain',
    description: 'Siphon the target\'s magical essence, dealing damage and restoring your energy.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'magic',
    element: 'void',
    requirements: { energyCost: 20, cooldown: 3, allowedClasses: ['invoker'] },
    // drain resolves as: damage(value multiplier) + self-heal(fraction of damage dealt).
    // Do NOT add a separate 'damage' effect here — resolveDrain already applies the hit.
    effects: [
      { type: 'drain', value: 0.8, valueType: 'multiplier' },
    ],
  },
  // Active — void rift (debuff + silence)
  {
    id: 'invoker_void_rift',
    name: 'Void Rift',
    description: 'Tear a hole in reality, silencing the enemy and reducing their Magic Defense.',
    category: 'active',
    targetType: 'single_enemy',
    element: 'void',
    requirements: { energyCost: 30, cooldown: 5, allowedClasses: ['invoker'] },
    effects: [
      { type: 'debuff', value: 1, valueType: 'flat', statusType: 'silence', statusChance: 0.9, duration: 2 },
      { type: 'debuff', value: -25, valueType: 'percent', stat: 'magicDefense', duration: 2 },
    ],
  },
  // Passive — arcane mastery (+magic %)
  {
    id: 'invoker_arcane_mastery',
    name: 'Arcane Mastery',
    description: 'Passive: +15% Magic damage, always active.',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0, allowedClasses: ['invoker'] },
    effects: [{ type: 'buff', value: 15, valueType: 'percent', stat: 'magic' }],
    trigger: 'passive_always',
  } as PassiveSkillDefinition,
  // Passive — mana surge (energy regen on crit)
  {
    id: 'invoker_mana_surge',
    name: 'Mana Surge',
    description: 'Passive: Critical hits restore 10 Energy (50% chance).',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0, allowedClasses: ['invoker'] },
    effects: [{ type: 'hot', value: 10, valueType: 'flat' }],
    trigger: 'on_crit',
    procChance: 0.5,
  } as PassiveSkillDefinition,
  // Ultimate — Cataclysm (AoE magic, transformation unlock)
  {
    id: 'invoker_cataclysm',
    name: 'Cataclysm',
    description: 'Channel the void itself. AoE magic annihilation that curses all enemies.',
    category: 'ultimate',
    targetType: 'aoe_enemies',
    damageType: 'magic',
    element: 'void',
    requirements: { energyCost: 60, cooldown: 0, allowedClasses: ['invoker'], minUltimateGauge: 100 },
    effects: [
      { type: 'damage', value: 2.5, valueType: 'multiplier' },
      { type: 'debuff', value: 1, valueType: 'flat', statusType: 'curse', statusChance: 1.0, duration: 3 },
    ],
    guaranteedCrit: true,
    cannotBeCountered: true,
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Wanderer skills (rogue/speed archetype)
// ──────────────────────────────────────────────────────────────────────────────

const WANDERER_SKILLS: SkillDefinition[] = [
  // Active — quick strike (high speed priority damage)
  {
    id: 'wanderer_quick_strike',
    name: 'Quick Strike',
    description: 'A lightning-fast strike that hits twice before the enemy can react.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'iron',
    requirements: { energyCost: 20, cooldown: 2, allowedClasses: ['wanderer'] },
    effects: [{ type: 'damage', value: 0.9, valueType: 'multiplier', hits: 2 }],
    comboFollowUps: ['wanderer_ambush', 'combo_finisher'],
  },
  // Active — smoke screen (self evasion buff + enemy accuracy debuff)
  {
    id: 'wanderer_smoke_screen',
    name: 'Smoke Screen',
    description: 'Throw a smoke bomb, raising your Evasion and blinding the enemy.',
    category: 'active',
    targetType: 'self',
    requirements: { energyCost: 25, cooldown: 4, allowedClasses: ['wanderer'] },
    effects: [
      { type: 'buff', value: 20, valueType: 'flat', stat: 'evasion', duration: 2 },
      { type: 'debuff', value: 1, valueType: 'flat', statusType: 'blind', statusChance: 0.9, duration: 2 },
    ],
  },
  // Active — shadow step (self teleport / evasion burst)
  {
    id: 'wanderer_shadow_step',
    name: 'Shadow Step',
    description: 'Melt into the shadows; your next attack is a guaranteed critical hit.',
    category: 'active',
    targetType: 'self',
    requirements: { energyCost: 30, cooldown: 5, allowedClasses: ['wanderer'] },
    effects: [
      { type: 'buff', value: 75, valueType: 'flat', stat: 'critChance', duration: 1 },
      { type: 'buff', value: 50, valueType: 'percent', stat: 'attack', duration: 1 },
    ],
  },
  // Active — ambush (high damage, requires stealth via quick_strike combo)
  {
    id: 'wanderer_ambush',
    name: 'Ambush',
    description: 'Strike from the shadows for devastating damage. Combo-only.',
    category: 'combo',
    targetType: 'single_enemy',
    damageType: 'physical',
    requirements: {
      energyCost: 35,
      cooldown: 1,
      allowedClasses: ['wanderer'],
      comboPrerequisites: ['wanderer_quick_strike'],
    },
    effects: [{ type: 'damage', value: 2.2, valueType: 'multiplier' }],
    guaranteedCrit: true,
    cannotBeCountered: true,
  },
  // Active — expose weakness (debuff defence)
  {
    id: 'wanderer_expose_weakness',
    name: 'Expose Weakness',
    description: 'Find a crack in the enemy\'s armour, reducing their Defense by 30% for 2 rounds.',
    category: 'active',
    targetType: 'single_enemy',
    requirements: { energyCost: 20, cooldown: 3, allowedClasses: ['wanderer'] },
    effects: [
      { type: 'debuff', value: -30, valueType: 'percent', stat: 'defense', duration: 2 },
    ],
  },
  // Passive — evasive instinct (+evasion always)
  {
    id: 'wanderer_evasive_instinct',
    name: 'Evasive Instinct',
    description: 'Passive: +8% Evasion, always active.',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0, allowedClasses: ['wanderer'] },
    effects: [{ type: 'buff', value: 8, valueType: 'flat', stat: 'evasion' }],
    trigger: 'passive_always',
  } as PassiveSkillDefinition,
  // Passive — predator (+damage after dodge)
  {
    id: 'wanderer_predator',
    name: 'Predator',
    description: 'Passive: After dodging, your next attack deals +25% damage.',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0, allowedClasses: ['wanderer'] },
    effects: [{ type: 'buff', value: 25, valueType: 'percent', stat: 'attack', duration: 1 }],
    trigger: 'on_dodge',
    procChance: 1.0,
  } as PassiveSkillDefinition,
  // Ultimate — phantom assault (multi-hit AoE transformation)
  {
    id: 'wanderer_phantom_assault',
    name: 'Phantom Assault',
    description: 'Become a phantom, striking all enemies 5 times at blinding speed.',
    category: 'ultimate',
    targetType: 'aoe_enemies',
    damageType: 'physical',
    element: 'void',
    requirements: { energyCost: 50, cooldown: 0, allowedClasses: ['wanderer'], minUltimateGauge: 100 },
    effects: [
      { type: 'damage', value: 0.6, valueType: 'multiplier', hits: 5 },
      { type: 'buff', value: 40, valueType: 'percent', stat: 'speed', duration: 2 },
    ],
    cannotBeCountered: true,
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// Registry map
// ──────────────────────────────────────────────────────────────────────────────

const ALL_SKILLS: SkillDefinition[] = [
  ...UNIVERSAL_SKILLS,
  ...VANGUARD_SKILLS,
  ...INVOKER_SKILLS,
  ...WANDERER_SKILLS,
];

const SKILL_MAP = new Map<string, SkillDefinition>(
  ALL_SKILLS.map((skill) => [skill.id, skill]),
);

/**
 * Look up a skill definition by its ID.
 * Returns undefined if the skill ID is not registered.
 */
export function getSkillDefinition(id: string): SkillDefinition | undefined {
  return SKILL_MAP.get(id);
}

/**
 * Returns all registered skill definitions.
 */
export function getAllSkills(): SkillDefinition[] {
  return [...ALL_SKILLS];
}

/**
 * Returns all skills matching a specific category.
 */
export function getSkillsByCategory(
  category: SkillDefinition['category'],
): SkillDefinition[] {
  return ALL_SKILLS.filter((s) => s.category === category);
}

/**
 * Returns all passive skill definitions (with trigger metadata).
 */
export function getPassiveSkills(): PassiveSkillDefinition[] {
  return ALL_SKILLS.filter((s): s is PassiveSkillDefinition => s.category === 'passive');
}

/**
 * Returns true if a skill ID exists in the registry.
 */
export function skillExists(id: string): boolean {
  return SKILL_MAP.has(id);
}
