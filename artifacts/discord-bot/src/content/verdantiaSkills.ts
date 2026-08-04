/**
 * Verdantia skill definitions — production registry entries.
 * Unique kits for all 15 Continent 1 heroes.
 * Integrates with existing SkillDefinition / PassiveSkillDefinition types.
 *
 * @see docs/Verdantia-Character-Skill-Bible.md
 */

/** Stage scaling helpers — applied at runtime by the progression system. */
export const STAGE_DAMAGE_MULT: Record<number, number> = {
  1: 1.0,
  2: 1.15,
  3: 1.35,
  4: 1.6,
  5: 2.0,
};

export const STAGE_CD_REDUCTION: Record<number, number> = {
  1: 0,
  2: 0,
  3: 1,
  4: 1,
  5: 2,
};

// ─────────────────────────────────────────────────────────────────────────────
// EDRAN — Guardian / Terris
// ─────────────────────────────────────────────────────────────────────────────

export const EDRAN_SKILLS = [
  {
    id: 'edran_leafedge_slash',
    name: 'Leafedge Slash',
    description: 'A precise two-cut sequence with living leaf trails along the blade.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'nature',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'damage', value: 1.0, valueType: 'multiplier', hits: 2 }],
  },
  {
    id: 'edran_rooted_resolve',
    name: 'Rooted Resolve',
    description: 'Passive: +8% Defense. When struck below 50% HP, gain a bark shield (once per 4 rounds).',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'buff', value: 8, valueType: 'percent', stat: 'defense' }],
  },
  {
    id: 'edran_canopy_guard',
    name: 'Canopy Guard',
    description: 'Raise living bark plates that shield self and nearby allies.',
    category: 'active',
    targetType: 'aoe_allies',
    requirements: { energyCost: 25, cooldown: 4 },
    effects: [{ type: 'shield', value: 180, valueType: 'flat', duration: 2 }],
  },
  {
    id: 'edran_vine_lash',
    name: 'Vine Lash',
    description: 'Vines erupt to pull and root a single enemy.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'nature',
    requirements: { energyCost: 20, cooldown: 3 },
    effects: [
      { type: 'damage', value: 1.1, valueType: 'multiplier' },
      { type: 'debuff', value: 1, valueType: 'flat', statusType: 'root', statusChance: 0.85, duration: 1 },
    ],
  },
  {
    id: 'edran_emerald_counter',
    name: 'Emerald Counter',
    description: 'Enter a counter stance. Next attack taken triggers a heavy retaliatory strike.',
    category: 'active',
    targetType: 'self',
    requirements: { energyCost: 30, cooldown: 5 },
    effects: [{ type: 'buff', value: 40, valueType: 'percent', stat: 'defense', duration: 2 }],
  },
  {
    id: 'edran_worldroot_judgment',
    name: 'Worldroot Judgment',
    description: 'Plant the sword; the forest erupts in a root field that damages and roots all enemies.',
    category: 'ultimate',
    targetType: 'aoe_enemies',
    damageType: 'physical',
    element: 'nature',
    requirements: { energyCost: 50, cooldown: 0, minUltimateGauge: 100 },
    effects: [
      { type: 'damage', value: 2.2, valueType: 'multiplier' },
      { type: 'debuff', value: 1, valueType: 'flat', statusType: 'root', statusChance: 1.0, duration: 2 },
    ],
  },
  {
    id: 'edran_heart_of_the_grove',
    name: 'Heart of the Grove',
    description: 'Resonance: Terris energy blooms. Allies gain regeneration and armor; enemies are slowed.',
    category: 'resonance',
    targetType: 'aoe_allies',
    requirements: { energyCost: 40, cooldown: 6 },
    effects: [
      { type: 'heal', value: 120, valueType: 'flat' },
      { type: 'buff', value: 15, valueType: 'percent', stat: 'defense', duration: 3 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LYRA — Ranger / Aeryn + Aquaris
// ─────────────────────────────────────────────────────────────────────────────

export const LYRA_SKILLS = [
  {
    id: 'lyra_gale_arrow',
    name: 'Gale Arrow',
    description: 'A wind-charged shot that marks the target.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'wind',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'damage', value: 1.05, valueType: 'multiplier' }],
  },
  {
    id: 'lyra_zephyr_step',
    name: 'Zephyr Step',
    description: 'Passive: +12% Speed. After dodging, next attack deals bonus wind damage.',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'buff', value: 12, valueType: 'percent', stat: 'speed' }],
  },
  {
    id: 'lyra_piercing_gale',
    name: 'Piercing Gale',
    description: 'A focused shot that ignores a portion of armor.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'wind',
    requirements: { energyCost: 22, cooldown: 3 },
    effects: [{ type: 'damage', value: 1.4, valueType: 'multiplier' }],
  },
  {
    id: 'lyra_skyward_barrage',
    name: 'Skyward Barrage',
    description: 'Rain of arrows on a small area.',
    category: 'active',
    targetType: 'aoe_enemies',
    damageType: 'physical',
    element: 'wind',
    requirements: { energyCost: 28, cooldown: 4 },
    effects: [{ type: 'damage', value: 0.85, valueType: 'multiplier', hits: 3 }],
  },
  {
    id: 'lyra_mirrorwind',
    name: 'Mirrorwind',
    description: 'Create a wind mirror that reflects the next projectile.',
    category: 'active',
    targetType: 'self',
    requirements: { energyCost: 25, cooldown: 5 },
    effects: [{ type: 'buff', value: 1, valueType: 'flat', duration: 2 }],
  },
  {
    id: 'lyra_tempest_sovereign',
    name: 'Tempest Sovereign',
    description: 'Ultimate: Call a cyclone that lifts and shreds all enemies.',
    category: 'ultimate',
    targetType: 'aoe_enemies',
    damageType: 'magical',
    element: 'wind',
    requirements: { energyCost: 50, cooldown: 0, minUltimateGauge: 100 },
    effects: [{ type: 'damage', value: 2.4, valueType: 'multiplier' }],
  },
  {
    id: 'lyra_breath_of_the_high_peaks',
    name: 'Breath of the High Peaks',
    description: 'Resonance: Aeryn + Aquaris. Party gains speed and cleanse; rain of pure wind arrows.',
    category: 'resonance',
    targetType: 'aoe_allies',
    requirements: { energyCost: 40, cooldown: 6 },
    effects: [
      { type: 'buff', value: 20, valueType: 'percent', stat: 'speed', duration: 3 },
      { type: 'cleanse', value: 1, valueType: 'flat' },
    ],
  },
];
// ─────────────────────────────────────────────────────────────────────────────
// MOSSWICK — Summoner / Terris
// ─────────────────────────────────────────────────────────────────────────────

export const MOSSWICK_SKILLS = [
  {
    id: 'mosswick_staff_of_ages',
    name: 'Staff of Ages',
    description: 'A slow, heavy strike of living wood.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'magical',
    element: 'nature',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'damage', value: 0.95, valueType: 'multiplier' }],
  },
  {
    id: 'mosswick_ancient_canopy',
    name: 'Ancient Canopy',
    description: 'Passive: Summons last longer. Allies under canopy gain minor regen.',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'buff', value: 5, valueType: 'percent', stat: 'hp_regen' }],
  },
  {
    id: 'mosswick_sprout_ward',
    name: 'Sprout Ward',
    description: 'Raise a wooden ward that absorbs damage for an ally.',
    category: 'active',
    targetType: 'single_ally',
    requirements: { energyCost: 22, cooldown: 3 },
    effects: [{ type: 'shield', value: 150, valueType: 'flat', duration: 2 }],
  },
  {
    id: 'mosswick_entangling_grove',
    name: 'Entangling Grove',
    description: 'Roots erupt under enemies, dealing damage and rooting.',
    category: 'active',
    targetType: 'aoe_enemies',
    damageType: 'magical',
    element: 'nature',
    requirements: { energyCost: 28, cooldown: 4 },
    effects: [
      { type: 'damage', value: 1.0, valueType: 'multiplier' },
      { type: 'debuff', value: 1, valueType: 'flat', statusType: 'root', statusChance: 0.7, duration: 1 },
    ],
  },
  {
    id: 'mosswick_call_of_the_deepwood',
    name: 'Call of the Deepwood',
    description: 'Summon a treant ally for several turns.',
    category: 'active',
    targetType: 'self',
    requirements: { energyCost: 35, cooldown: 5 },
    effects: [{ type: 'summon', value: 1, valueType: 'flat' }],
  },
  {
    id: 'mosswick_world_tree_awakening',
    name: 'World Tree Awakening',
    description: 'Ultimate: The grove becomes a battlefield of living wood and thorns.',
    category: 'ultimate',
    targetType: 'aoe_enemies',
    damageType: 'magical',
    element: 'nature',
    requirements: { energyCost: 50, cooldown: 0, minUltimateGauge: 100 },
    effects: [{ type: 'damage', value: 2.3, valueType: 'multiplier' }],
  },
  {
    id: 'mosswick_verdant_covenant',
    name: 'Verdant Covenant',
    description: 'Resonance: Bind the party to the land. Strong regen and nature resistance.',
    category: 'resonance',
    targetType: 'aoe_allies',
    requirements: { energyCost: 40, cooldown: 6 },
    effects: [
      { type: 'heal', value: 100, valueType: 'flat' },
      { type: 'buff', value: 20, valueType: 'percent', stat: 'nature_resist', duration: 3 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// KAEL — Assassin / Aeryn + Umbris
// ─────────────────────────────────────────────────────────────────────────────

export const KAEL_SKILLS = [
  {
    id: 'kael_twinleaf_cut',
    name: 'Twinleaf Cut',
    description: 'Two quick blade strikes from the underbrush.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'wind',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'damage', value: 0.55, valueType: 'multiplier', hits: 2 }],
  },
  {
    id: 'kael_underbrush',
    name: 'Underbrush',
    description: 'Passive: +15% crit from stealth or after Vanish.',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'buff', value: 15, valueType: 'percent', stat: 'crit' }],
  },
  {
    id: 'kael_flicker_step',
    name: 'Flicker Step',
    description: 'Dash behind the target and strike.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'wind',
    requirements: { energyCost: 20, cooldown: 3 },
    effects: [{ type: 'damage', value: 1.3, valueType: 'multiplier' }],
  },
  {
    id: 'kael_poisondew',
    name: 'Poisondew',
    description: 'Coat blades; next hits apply poison.',
    category: 'active',
    targetType: 'self',
    requirements: { energyCost: 18, cooldown: 4 },
    effects: [{ type: 'buff', value: 1, valueType: 'flat', duration: 3 }],
  },
  {
    id: 'kael_vanish',
    name: 'Vanish',
    description: 'Enter stealth for a short time. Next attack is a guaranteed crit.',
    category: 'active',
    targetType: 'self',
    requirements: { energyCost: 25, cooldown: 5 },
    effects: [{ type: 'buff', value: 1, valueType: 'flat', duration: 2 }],
  },
  {
    id: 'kael_eclipse_of_leaves',
    name: 'Eclipse of Leaves',
    description: 'Ultimate: Shadow and leaf blades rain on a single target.',
    category: 'ultimate',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'shadow',
    requirements: { energyCost: 50, cooldown: 0, minUltimateGauge: 100 },
    effects: [{ type: 'damage', value: 2.8, valueType: 'multiplier', hits: 5 }],
  },
  {
    id: 'kael_nightwind_pact',
    name: 'Nightwind Pact',
    description: 'Resonance: Aeryn + Umbris. Party gains stealth-adjacent crit and speed.',
    category: 'resonance',
    targetType: 'aoe_allies',
    requirements: { energyCost: 40, cooldown: 6 },
    effects: [
      { type: 'buff', value: 12, valueType: 'percent', stat: 'crit', duration: 3 },
      { type: 'buff', value: 10, valueType: 'percent', stat: 'speed', duration: 3 },
    ],
  },
];
// ─────────────────────────────────────────────────────────────────────────────
// SERA — Hybrid / Aquaris
// ─────────────────────────────────────────────────────────────────────────────

export const SERA_SKILLS = [
  {
    id: 'sera_crystal_thrust',
    name: 'Crystal Thrust',
    description: 'A piercing spear thrust of living ice-crystal.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'water',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'damage', value: 1.05, valueType: 'multiplier' }],
  },
  {
    id: 'sera_tidal_flow',
    name: 'Tidal Flow',
    description: 'Passive: Skills that hit restore a small amount of energy.',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'buff', value: 5, valueType: 'percent', stat: 'energy_on_hit' }],
  },
  {
    id: 'sera_cresting_strike',
    name: 'Cresting Strike',
    description: 'A wave-powered thrust that can knock back.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'water',
    requirements: { energyCost: 22, cooldown: 3 },
    effects: [{ type: 'damage', value: 1.35, valueType: 'multiplier' }],
  },
  {
    id: 'sera_mirror_pool',
    name: 'Mirror Pool',
    description: 'Create a reflecting pool that reduces incoming damage.',
    category: 'active',
    targetType: 'self',
    requirements: { energyCost: 25, cooldown: 4 },
    effects: [{ type: 'buff', value: 25, valueType: 'percent', stat: 'defense', duration: 2 }],
  },
  {
    id: 'sera_abyssal_bind',
    name: 'Abyssal Bind',
    description: 'Chains of deep water slow and damage the target.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'magical',
    element: 'water',
    requirements: { energyCost: 28, cooldown: 4 },
    effects: [
      { type: 'damage', value: 1.2, valueType: 'multiplier' },
      { type: 'debuff', value: 30, valueType: 'percent', stat: 'speed', duration: 2 },
    ],
  },
  {
    id: 'sera_leviathans_crown',
    name: "Leviathan's Crown",
    description: 'Ultimate: A towering water serpent crashes down on all enemies.',
    category: 'ultimate',
    targetType: 'aoe_enemies',
    damageType: 'magical',
    element: 'water',
    requirements: { energyCost: 50, cooldown: 0, minUltimateGauge: 100 },
    effects: [{ type: 'damage', value: 2.5, valueType: 'multiplier' }],
  },
  {
    id: 'sera_eternal_current',
    name: 'Eternal Current',
    description: 'Resonance: Aquaris flow heals allies and cleanses over time.',
    category: 'resonance',
    targetType: 'aoe_allies',
    requirements: { energyCost: 40, cooldown: 6 },
    effects: [
      { type: 'heal', value: 140, valueType: 'flat' },
      { type: 'cleanse', value: 1, valueType: 'flat' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// BRYNN — Beastmaster / Terris
// ─────────────────────────────────────────────────────────────────────────────

export const BRYNN_SKILLS = [
  {
    id: 'brynn_bone_lash',
    name: 'Bone Lash',
    description: 'A cracking whip strike that can bleed.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'nature',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'damage', value: 1.0, valueType: 'multiplier' }],
  },
  {
    id: 'brynn_pack_bond',
    name: 'Pack Bond',
    description: 'Passive: Wolf companion fights beside you. Shared damage reduction.',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'buff', value: 8, valueType: 'percent', stat: 'defense' }],
  },
  {
    id: 'brynn_howl_of_the_green',
    name: 'Howl of the Green',
    description: 'Rally the pack. Allies gain attack; enemies may be feared briefly.',
    category: 'active',
    targetType: 'aoe_allies',
    requirements: { energyCost: 24, cooldown: 4 },
    effects: [{ type: 'buff', value: 15, valueType: 'percent', stat: 'attack', duration: 2 }],
  },
  {
    id: 'brynn_rending_circle',
    name: 'Rending Circle',
    description: 'You and the wolf attack in a circle, hitting nearby enemies.',
    category: 'active',
    targetType: 'aoe_enemies',
    damageType: 'physical',
    element: 'nature',
    requirements: { energyCost: 28, cooldown: 4 },
    effects: [{ type: 'damage', value: 1.1, valueType: 'multiplier', hits: 2 }],
  },
  {
    id: 'brynn_primal_surge',
    name: 'Primal Surge',
    description: 'Enter a berserk state: higher damage, lower defense.',
    category: 'active',
    targetType: 'self',
    requirements: { energyCost: 30, cooldown: 5 },
    effects: [
      { type: 'buff', value: 30, valueType: 'percent', stat: 'attack', duration: 3 },
      { type: 'debuff', value: 15, valueType: 'percent', stat: 'defense', duration: 3 },
    ],
  },
  {
    id: 'brynn_alpha_of_the_verdant_pack',
    name: 'Alpha of the Verdant Pack',
    description: 'Ultimate: Call the full pack. Multiple wolf strikes across the field.',
    category: 'ultimate',
    targetType: 'aoe_enemies',
    damageType: 'physical',
    element: 'nature',
    requirements: { energyCost: 50, cooldown: 0, minUltimateGauge: 100 },
    effects: [{ type: 'damage', value: 2.2, valueType: 'multiplier', hits: 4 }],
  },
  {
    id: 'brynn_heart_of_the_wild',
    name: 'Heart of the Wild',
    description: 'Resonance: Terris wild energy. Party gains lifesteal and tenacity.',
    category: 'resonance',
    targetType: 'aoe_allies',
    requirements: { energyCost: 40, cooldown: 6 },
    effects: [
      { type: 'buff', value: 10, valueType: 'percent', stat: 'lifesteal', duration: 3 },
      { type: 'buff', value: 20, valueType: 'percent', stat: 'tenacity', duration: 3 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// NYX — Assassin / Umbris
// ─────────────────────────────────────────────────────────────────────────────

export const NYX_SKILLS = [
  {
    id: 'nyx_shadow_bolt',
    name: 'Shadow Bolt',
    description: 'A silent crossbow bolt from the dark.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'shadow',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'damage', value: 1.1, valueType: 'multiplier' }],
  },
  {
    id: 'nyx_mark_of_the_unseen',
    name: 'Mark of the Unseen',
    description: 'Passive: First shot on a target marks them. Marked take bonus damage from you.',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'buff', value: 12, valueType: 'percent', stat: 'damage_to_marked' }],
  },
  {
    id: 'nyx_piercing_void',
    name: 'Piercing Void',
    description: 'A bolt that ignores a portion of defense.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'shadow',
    requirements: { energyCost: 22, cooldown: 3 },
    effects: [{ type: 'damage', value: 1.45, valueType: 'multiplier' }],
  },
  {
    id: 'nyx_blackout_volley',
    name: 'Blackout Volley',
    description: 'Three bolts into the dark; chance to blind.',
    category: 'active',
    targetType: 'aoe_enemies',
    damageType: 'physical',
    element: 'shadow',
    requirements: { energyCost: 28, cooldown: 4 },
    effects: [{ type: 'damage', value: 0.75, valueType: 'multiplier', hits: 3 }],
  },
  {
    id: 'nyx_assassins_patience',
    name: "Assassin's Patience",
    description: 'Enter aim stance. Next bolt is a guaranteed high crit.',
    category: 'active',
    targetType: 'self',
    requirements: { energyCost: 20, cooldown: 5 },
    effects: [{ type: 'buff', value: 50, valueType: 'percent', stat: 'crit', duration: 2 }],
  },
  {
    id: 'nyx_eventide_execution',
    name: 'Eventide Execution',
    description: 'Ultimate: A single perfect shot from pure void.',
    category: 'ultimate',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'shadow',
    requirements: { energyCost: 50, cooldown: 0, minUltimateGauge: 100 },
    effects: [{ type: 'damage', value: 3.0, valueType: 'multiplier' }],
  },
  {
    id: 'nyx_voidstring',
    name: 'Voidstring',
    description: 'Resonance: Umbris. Party crit and shadow damage rise; enemies are mildly suppressed.',
    category: 'resonance',
    targetType: 'aoe_allies',
    requirements: { energyCost: 40, cooldown: 6 },
    effects: [
      { type: 'buff', value: 15, valueType: 'percent', stat: 'crit', duration: 3 },
      { type: 'buff', value: 15, valueType: 'percent', stat: 'shadow_damage', duration: 3 },
    ],
  },
];
// ─────────────────────────────────────────────────────────────────────────────
// ORIN — Mage / Luminara + Terris
// ─────────────────────────────────────────────────────────────────────────────

export const ORIN_SKILLS = [
  {
    id: 'orin_scripted_strike',
    name: 'Scripted Strike',
    description: 'Living ink forms a glyph that strikes the enemy.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'magical',
    element: 'radiance',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'damage', value: 1.0, valueType: 'multiplier' }],
  },
  {
    id: 'orin_living_archive',
    name: 'Living Archive',
    description: 'Passive: Spells have a chance to refund energy.',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'buff', value: 10, valueType: 'percent', stat: 'energy_on_cast' }],
  },
  {
    id: 'orin_binding_glyph',
    name: 'Binding Glyph',
    description: 'A glowing rune roots the target briefly.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'magical',
    element: 'radiance',
    requirements: { energyCost: 22, cooldown: 3 },
    effects: [
      { type: 'damage', value: 1.15, valueType: 'multiplier' },
      { type: 'debuff', value: 1, valueType: 'flat', statusType: 'root', statusChance: 0.8, duration: 1 },
    ],
  },
  {
    id: 'orin_cascade_of_pages',
    name: 'Cascade of Pages',
    description: 'Flying pages slice through multiple enemies.',
    category: 'active',
    targetType: 'aoe_enemies',
    damageType: 'magical',
    element: 'radiance',
    requirements: { energyCost: 28, cooldown: 4 },
    effects: [{ type: 'damage', value: 0.9, valueType: 'multiplier', hits: 3 }],
  },
  {
    id: 'orin_rewrite_fate',
    name: 'Rewrite Fate',
    description: 'Reroll a recent negative effect on an ally.',
    category: 'active',
    targetType: 'single_ally',
    requirements: { energyCost: 30, cooldown: 5 },
    effects: [{ type: 'cleanse', value: 2, valueType: 'flat' }],
  },
  {
    id: 'orin_codex_of_the_first_grove',
    name: 'Codex of the First Grove',
    description: 'Ultimate: Open the living book; radiant text damages all foes and shields allies.',
    category: 'ultimate',
    targetType: 'aoe_enemies',
    damageType: 'magical',
    element: 'radiance',
    requirements: { energyCost: 50, cooldown: 0, minUltimateGauge: 100 },
    effects: [
      { type: 'damage', value: 2.1, valueType: 'multiplier' },
      { type: 'shield', value: 100, valueType: 'flat', duration: 2 },
    ],
  },
  {
    id: 'orin_eternal_quill',
    name: 'Eternal Quill',
    description: 'Resonance: Luminara + Terris. Party gains magic power and nature resist.',
    category: 'resonance',
    targetType: 'aoe_allies',
    requirements: { energyCost: 40, cooldown: 6 },
    effects: [
      { type: 'buff', value: 18, valueType: 'percent', stat: 'magic_attack', duration: 3 },
      { type: 'buff', value: 15, valueType: 'percent', stat: 'nature_resist', duration: 3 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HADWIN — Tank / Terris
// ─────────────────────────────────────────────────────────────────────────────

export const HADWIN_SKILLS = [
  {
    id: 'hadwin_maul_smash',
    name: 'Maul Smash',
    description: 'A heavy overhead blow with the war maul.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'earth',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'damage', value: 1.1, valueType: 'multiplier' }],
  },
  {
    id: 'hadwin_unyielding_bark',
    name: 'Unyielding Bark',
    description: 'Passive: +12% Defense. Taunt lasts longer.',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'buff', value: 12, valueType: 'percent', stat: 'defense' }],
  },
  {
    id: 'hadwin_shield_slam',
    name: 'Shield Slam',
    description: 'Slam the shield to stun and generate threat.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'earth',
    requirements: { energyCost: 20, cooldown: 3 },
    effects: [
      { type: 'damage', value: 0.9, valueType: 'multiplier' },
      { type: 'debuff', value: 1, valueType: 'flat', statusType: 'stun', statusChance: 0.7, duration: 1 },
    ],
  },
  {
    id: 'hadwin_fortify',
    name: 'Fortify',
    description: 'Brace. Large temporary shield and defense boost.',
    category: 'active',
    targetType: 'self',
    requirements: { energyCost: 25, cooldown: 4 },
    effects: [
      { type: 'shield', value: 220, valueType: 'flat', duration: 2 },
      { type: 'buff', value: 25, valueType: 'percent', stat: 'defense', duration: 2 },
    ],
  },
  {
    id: 'hadwin_earthshatter',
    name: 'Earthshatter',
    description: 'Smash the ground; nearby enemies are damaged and slowed.',
    category: 'active',
    targetType: 'aoe_enemies',
    damageType: 'physical',
    element: 'earth',
    requirements: { energyCost: 30, cooldown: 4 },
    effects: [
      { type: 'damage', value: 1.2, valueType: 'multiplier' },
      { type: 'debuff', value: 25, valueType: 'percent', stat: 'speed', duration: 2 },
    ],
  },
  {
    id: 'hadwin_mountains_oath',
    name: "Mountain's Oath",
    description: 'Ultimate: Become an immovable bastion. Massive shield and taunt all.',
    category: 'ultimate',
    targetType: 'self',
    requirements: { energyCost: 50, cooldown: 0, minUltimateGauge: 100 },
    effects: [
      { type: 'shield', value: 400, valueType: 'flat', duration: 3 },
      { type: 'buff', value: 40, valueType: 'percent', stat: 'defense', duration: 3 },
    ],
  },
  {
    id: 'hadwin_living_bastion',
    name: 'Living Bastion',
    description: 'Resonance: Terris. Party gains defense and a share of your shield.',
    category: 'resonance',
    targetType: 'aoe_allies',
    requirements: { energyCost: 40, cooldown: 6 },
    effects: [
      { type: 'buff', value: 20, valueType: 'percent', stat: 'defense', duration: 3 },
      { type: 'shield', value: 80, valueType: 'flat', duration: 2 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// VAEL — Commander / Terris
// ─────────────────────────────────────────────────────────────────────────────

export const VAEL_SKILLS = [
  {
    id: 'vael_poleaxe_sweep',
    name: 'Poleaxe Sweep',
    description: 'A wide sweep of the poleaxe.',
    category: 'active',
    targetType: 'aoe_enemies',
    damageType: 'physical',
    element: 'earth',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'damage', value: 0.85, valueType: 'multiplier' }],
  },
  {
    id: 'vael_rallying_presence',
    name: 'Rallying Presence',
    description: 'Passive: Nearby allies gain +8% attack.',
    category: 'passive',
    targetType: 'aoe_allies',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'buff', value: 8, valueType: 'percent', stat: 'attack' }],
  },
  {
    id: 'vael_commanding_strike',
    name: 'Commanding Strike',
    description: 'A focused blow that marks the target for allies.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'earth',
    requirements: { energyCost: 22, cooldown: 3 },
    effects: [{ type: 'damage', value: 1.3, valueType: 'multiplier' }],
  },
  {
    id: 'vael_hold_the_line',
    name: 'Hold the Line',
    description: 'Banner rises. Allies gain defense and resist knockback.',
    category: 'active',
    targetType: 'aoe_allies',
    requirements: { energyCost: 25, cooldown: 4 },
    effects: [{ type: 'buff', value: 20, valueType: 'percent', stat: 'defense', duration: 2 }],
  },
  {
    id: 'vael_banner_charge',
    name: 'Banner Charge',
    description: 'Lead a charge; damage and temporary attack buff for the party.',
    category: 'active',
    targetType: 'aoe_enemies',
    damageType: 'physical',
    element: 'earth',
    requirements: { energyCost: 30, cooldown: 5 },
    effects: [
      { type: 'damage', value: 1.25, valueType: 'multiplier' },
      { type: 'buff', value: 15, valueType: 'percent', stat: 'attack', duration: 2 },
    ],
  },
  {
    id: 'vael_verdant_crusade',
    name: 'Verdant Crusade',
    description: 'Ultimate: Full battlefield command. High AoE damage and party invigorate.',
    category: 'ultimate',
    targetType: 'aoe_enemies',
    damageType: 'physical',
    element: 'earth',
    requirements: { energyCost: 50, cooldown: 0, minUltimateGauge: 100 },
    effects: [
      { type: 'damage', value: 2.3, valueType: 'multiplier' },
      { type: 'buff', value: 20, valueType: 'percent', stat: 'attack', duration: 3 },
    ],
  },
  {
    id: 'vael_heart_of_command',
    name: 'Heart of Command',
    description: 'Resonance: Terris. Party gains attack, defense, and a small heal.',
    category: 'resonance',
    targetType: 'aoe_allies',
    requirements: { energyCost: 40, cooldown: 6 },
    effects: [
      { type: 'buff', value: 12, valueType: 'percent', stat: 'attack', duration: 3 },
      { type: 'buff', value: 12, valueType: 'percent', stat: 'defense', duration: 3 },
      { type: 'heal', value: 80, valueType: 'flat' },
    ],
  },
];
// ─────────────────────────────────────────────────────────────────────────────
// ALDOUS — Healer / Luminara
// ─────────────────────────────────────────────────────────────────────────────

export const ALDOUS_SKILLS = [
  {
    id: 'aldous_solar_ray',
    name: 'Solar Ray',
    description: 'A beam of pure light that damages undead and dark foes harder.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'magical',
    element: 'radiance',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'damage', value: 0.95, valueType: 'multiplier' }],
  },
  {
    id: 'aldous_lights_mercy',
    name: "Light's Mercy",
    description: 'Passive: Healing you deal also grants a small shield.',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'buff', value: 10, valueType: 'percent', stat: 'heal_power' }],
  },
  {
    id: 'aldous_radiant_mend',
    name: 'Radiant Mend',
    description: 'Strong single-target heal.',
    category: 'active',
    targetType: 'single_ally',
    requirements: { energyCost: 22, cooldown: 2 },
    effects: [{ type: 'heal', value: 180, valueType: 'flat' }],
  },
  {
    id: 'aldous_purifying_light',
    name: 'Purifying Light',
    description: 'Cleanse one ally and deal light damage to nearby enemies.',
    category: 'active',
    targetType: 'single_ally',
    requirements: { energyCost: 25, cooldown: 3 },
    effects: [
      { type: 'cleanse', value: 2, valueType: 'flat' },
      { type: 'heal', value: 80, valueType: 'flat' },
    ],
  },
  {
    id: 'aldous_sanctuary',
    name: 'Sanctuary',
    description: 'Create a zone of light that heals allies over time.',
    category: 'active',
    targetType: 'aoe_allies',
    requirements: { energyCost: 30, cooldown: 5 },
    effects: [{ type: 'heal', value: 60, valueType: 'flat', duration: 3 }],
  },
  {
    id: 'aldous_solar_ascension',
    name: 'Solar Ascension',
    description: 'Ultimate: Full party heal, cleanse, and a burst of radiance on enemies.',
    category: 'ultimate',
    targetType: 'aoe_allies',
    requirements: { energyCost: 50, cooldown: 0, minUltimateGauge: 100 },
    effects: [
      { type: 'heal', value: 250, valueType: 'flat' },
      { type: 'cleanse', value: 3, valueType: 'flat' },
    ],
  },
  {
    id: 'aldous_eternal_dawn',
    name: 'Eternal Dawn',
    description: 'Resonance: Luminara. Party gains heal power and radiance resistance.',
    category: 'resonance',
    targetType: 'aoe_allies',
    requirements: { energyCost: 40, cooldown: 6 },
    effects: [
      { type: 'buff', value: 20, valueType: 'percent', stat: 'heal_power', duration: 3 },
      { type: 'heal', value: 100, valueType: 'flat' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MIRA — Support / Terris + Luminara
// ─────────────────────────────────────────────────────────────────────────────

export const MIRA_SKILLS = [
  {
    id: 'mira_blossom_staff',
    name: 'Blossom Staff',
    description: 'A gentle staff strike that also seeds a small heal.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'magical',
    element: 'nature',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'damage', value: 0.85, valueType: 'multiplier' }],
  },
  {
    id: 'mira_life_bloom',
    name: 'Life Bloom',
    description: 'Passive: Allies near you slowly regenerate.',
    category: 'passive',
    targetType: 'aoe_allies',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'buff', value: 5, valueType: 'percent', stat: 'hp_regen' }],
  },
  {
    id: 'mira_healing_petals',
    name: 'Healing Petals',
    description: 'Scatter petals that heal one ally.',
    category: 'active',
    targetType: 'single_ally',
    requirements: { energyCost: 20, cooldown: 2 },
    effects: [{ type: 'heal', value: 150, valueType: 'flat' }],
  },
  {
    id: 'mira_sleeping_pollen',
    name: 'Sleeping Pollen',
    description: 'Pollen cloud that can sleep an enemy briefly.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'magical',
    element: 'nature',
    requirements: { energyCost: 25, cooldown: 4 },
    effects: [
      { type: 'damage', value: 0.7, valueType: 'multiplier' },
      { type: 'debuff', value: 1, valueType: 'flat', statusType: 'sleep', statusChance: 0.6, duration: 1 },
    ],
  },
  {
    id: 'mira_overgrowth',
    name: 'Overgrowth',
    description: 'Vines protect an ally and slowly heal them.',
    category: 'active',
    targetType: 'single_ally',
    requirements: { energyCost: 28, cooldown: 4 },
    effects: [
      { type: 'shield', value: 120, valueType: 'flat', duration: 2 },
      { type: 'heal', value: 40, valueType: 'flat', duration: 2 },
    ],
  },
  {
    id: 'mira_eternal_spring',
    name: 'Eternal Spring',
    description: 'Ultimate: Field of flowers heals the party strongly over time.',
    category: 'ultimate',
    targetType: 'aoe_allies',
    requirements: { energyCost: 50, cooldown: 0, minUltimateGauge: 100 },
    effects: [{ type: 'heal', value: 200, valueType: 'flat', duration: 3 }],
  },
  {
    id: 'mira_seed_of_hope',
    name: 'Seed of Hope',
    description: 'Resonance: Terris + Luminara. Party regen and cleanse.',
    category: 'resonance',
    targetType: 'aoe_allies',
    requirements: { energyCost: 40, cooldown: 6 },
    effects: [
      { type: 'heal', value: 90, valueType: 'flat' },
      { type: 'cleanse', value: 1, valueType: 'flat' },
      { type: 'buff', value: 10, valueType: 'percent', stat: 'hp_regen', duration: 3 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// THERON — Hybrid / Multi
// ─────────────────────────────────────────────────────────────────────────────

export const THERON_SKILLS = [
  {
    id: 'theron_prism_slash',
    name: 'Prism Slash',
    description: 'A sword cut that flashes with multiple Frequencies.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'radiance',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'damage', value: 1.05, valueType: 'multiplier' }],
  },
  {
    id: 'theron_chromatic_heart',
    name: 'Chromatic Heart',
    description: 'Passive: After using a skill of one element, next skill of a different element deals bonus damage.',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'buff', value: 10, valueType: 'percent', stat: 'damage' }],
  },
  {
    id: 'theron_flame_vein',
    name: 'Flame Vein',
    description: 'Ignara-infused slash. Burns the target.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'magical',
    element: 'fire',
    requirements: { energyCost: 20, cooldown: 3 },
    effects: [{ type: 'damage', value: 1.3, valueType: 'multiplier' }],
  },
  {
    id: 'theron_frost_vein',
    name: 'Frost Vein',
    description: 'Aquaris-infused slash. Slows the target.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'magical',
    element: 'water',
    requirements: { energyCost: 20, cooldown: 3 },
    effects: [
      { type: 'damage', value: 1.2, valueType: 'multiplier' },
      { type: 'debuff', value: 25, valueType: 'percent', stat: 'speed', duration: 2 },
    ],
  },
  {
    id: 'theron_storm_vein',
    name: 'Storm Vein',
    description: 'Aeryn-infused slash. Hits a small area.',
    category: 'active',
    targetType: 'aoe_enemies',
    damageType: 'magical',
    element: 'wind',
    requirements: { energyCost: 25, cooldown: 4 },
    effects: [{ type: 'damage', value: 1.1, valueType: 'multiplier' }],
  },
  {
    id: 'theron_spectrum_cataclysm',
    name: 'Spectrum Cataclysm',
    description: 'Ultimate: All six Frequencies erupt in sequence.',
    category: 'ultimate',
    targetType: 'aoe_enemies',
    damageType: 'magical',
    element: 'radiance',
    requirements: { energyCost: 50, cooldown: 0, minUltimateGauge: 100 },
    effects: [{ type: 'damage', value: 2.6, valueType: 'multiplier', hits: 6 }],
  },
  {
    id: 'theron_unity_of_the_six',
    name: 'Unity of the Six',
    description: 'Resonance: Party gains a small buff to every damage type.',
    category: 'resonance',
    targetType: 'aoe_allies',
    requirements: { energyCost: 40, cooldown: 6 },
    effects: [{ type: 'buff', value: 10, valueType: 'percent', stat: 'all_damage', duration: 3 }],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ZARA — Mage / Luminara + Aeryn
// ─────────────────────────────────────────────────────────────────────────────

export const ZARA_SKILLS = [
  {
    id: 'zara_arc_bolt',
    name: 'Arc Bolt',
    description: 'A quick arcane bolt from the crystal staff.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'magical',
    element: 'radiance',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'damage', value: 1.05, valueType: 'multiplier' }],
  },
  {
    id: 'zara_overcharge',
    name: 'Overcharge',
    description: 'Passive: After 3 spells, next spell costs less and hits harder.',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'buff', value: 15, valueType: 'percent', stat: 'magic_attack' }],
  },
  {
    id: 'zara_stellar_lance',
    name: 'Stellar Lance',
    description: 'A concentrated beam of starlight.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'magical',
    element: 'radiance',
    requirements: { energyCost: 25, cooldown: 3 },
    effects: [{ type: 'damage', value: 1.5, valueType: 'multiplier' }],
  },
  {
    id: 'zara_gravity_well',
    name: 'Gravity Well',
    description: 'Pull enemies toward a point and slow them.',
    category: 'active',
    targetType: 'aoe_enemies',
    damageType: 'magical',
    element: 'wind',
    requirements: { energyCost: 28, cooldown: 4 },
    effects: [
      { type: 'damage', value: 1.0, valueType: 'multiplier' },
      { type: 'debuff', value: 30, valueType: 'percent', stat: 'speed', duration: 2 },
    ],
  },
  {
    id: 'zara_arcane_barrier',
    name: 'Arcane Barrier',
    description: 'A floating shield of pure mana.',
    category: 'active',
    targetType: 'self',
    requirements: { energyCost: 22, cooldown: 4 },
    effects: [{ type: 'shield', value: 160, valueType: 'flat', duration: 2 }],
  },
  {
    id: 'zara_celestial_codex',
    name: 'Celestial Codex',
    description: 'Ultimate: Open the star-tome; massive radiance damage in an area.',
    category: 'ultimate',
    targetType: 'aoe_enemies',
    damageType: 'magical',
    element: 'radiance',
    requirements: { energyCost: 50, cooldown: 0, minUltimateGauge: 100 },
    effects: [{ type: 'damage', value: 2.5, valueType: 'multiplier' }],
  },
  {
    id: 'zara_living_library',
    name: 'Living Library',
    description: 'Resonance: Luminara + Aeryn. Party magic power and speed rise.',
    category: 'resonance',
    targetType: 'aoe_allies',
    requirements: { energyCost: 40, cooldown: 6 },
    effects: [
      { type: 'buff', value: 18, valueType: 'percent', stat: 'magic_attack', duration: 3 },
      { type: 'buff', value: 12, valueType: 'percent', stat: 'speed', duration: 3 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DAWNVEIL — Assassin / Umbris
// ─────────────────────────────────────────────────────────────────────────────

export const DAWNVEIL_SKILLS = [
  {
    id: 'dawnveil_crescent_cut',
    name: 'Crescent Cut',
    description: 'Twin curved daggers in a crescent arc.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'shadow',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'damage', value: 0.6, valueType: 'multiplier', hits: 2 }],
  },
  {
    id: 'dawnveil_veil_of_dusk',
    name: 'Veil of Dusk',
    description: 'Passive: After a kill or assist, enter a brief stealth.',
    category: 'passive',
    targetType: 'self',
    requirements: { energyCost: 0, cooldown: 0 },
    effects: [{ type: 'buff', value: 12, valueType: 'percent', stat: 'crit' }],
  },
  {
    id: 'dawnveil_shadow_dance',
    name: 'Shadow Dance',
    description: 'Dash through the target, striking multiple times.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'shadow',
    requirements: { energyCost: 24, cooldown: 3 },
    effects: [{ type: 'damage', value: 0.7, valueType: 'multiplier', hits: 3 }],
  },
  {
    id: 'dawnveil_soul_rend',
    name: 'Soul Rend',
    description: 'A deep cut that applies a stacking bleed.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'shadow',
    requirements: { energyCost: 22, cooldown: 3 },
    effects: [{ type: 'damage', value: 1.35, valueType: 'multiplier' }],
  },
  {
    id: 'dawnveil_mirror_blades',
    name: 'Mirror Blades',
    description: 'Create shadow copies that attack with you once.',
    category: 'active',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'shadow',
    requirements: { energyCost: 28, cooldown: 5 },
    effects: [{ type: 'damage', value: 0.8, valueType: 'multiplier', hits: 3 }],
  },
  {
    id: 'dawnveil_eternal_nightfall',
    name: 'Eternal Nightfall',
    description: 'Ultimate: The field darkens; a flurry of finishing strikes on one target.',
    category: 'ultimate',
    targetType: 'single_enemy',
    damageType: 'physical',
    element: 'shadow',
    requirements: { energyCost: 50, cooldown: 0, minUltimateGauge: 100 },
    effects: [{ type: 'damage', value: 3.2, valueType: 'multiplier', hits: 6 }],
  },
  {
    id: 'dawnveil_eclipse_pact',
    name: 'Eclipse Pact',
    description: 'Resonance: Umbris. Party gains crit and shadow damage; foes are lightly suppressed.',
    category: 'resonance',
    targetType: 'aoe_allies',
    requirements: { energyCost: 40, cooldown: 6 },
    effects: [
      { type: 'buff', value: 15, valueType: 'percent', stat: 'crit', duration: 3 },
      { type: 'buff', value: 15, valueType: 'percent', stat: 'shadow_damage', duration: 3 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRY EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const VERDANTIA_ALL_SKILLS = [
  ...EDRAN_SKILLS,
  ...LYRA_SKILLS,
  ...MOSSWICK_SKILLS,
  ...KAEL_SKILLS,
  ...SERA_SKILLS,
  ...BRYNN_SKILLS,
  ...NYX_SKILLS,
  ...ORIN_SKILLS,
  ...HADWIN_SKILLS,
  ...VAEL_SKILLS,
  ...ALDOUS_SKILLS,
  ...MIRA_SKILLS,
  ...THERON_SKILLS,
  ...ZARA_SKILLS,
  ...DAWNVEIL_SKILLS,
];

export function getVerdantiaSkill(id: string) {
  return VERDANTIA_ALL_SKILLS.find((s) => s.id === id);
}
