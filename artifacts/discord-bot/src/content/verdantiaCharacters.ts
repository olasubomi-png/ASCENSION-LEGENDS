/**
 * Verdantia Character Roster — official Continent 1 heroes.
 * Derived from official artwork (Stages I–V).
 * @see docs/Verdantia-Character-Skill-Bible.md
 */

export type AEFrequency =
  | 'ignara'
  | 'terris'
  | 'aeryn'
  | 'aquaris'
  | 'luminara'
  | 'umbris';

export type CombatRole =
  | 'tank'
  | 'warrior'
  | 'assassin'
  | 'mage'
  | 'ranger'
  | 'healer'
  | 'support'
  | 'summoner'
  | 'guardian'
  | 'hybrid'
  | 'commander'
  | 'beastmaster';

export type TransformationStage = 1 | 2 | 3 | 4 | 5;

export interface VerdantiaCharacter {
  id: string;
  name: string;
  title: string;
  continent: 'verdantia';
  role: CombatRole;
  primaryAE: AEFrequency;
  secondaryAE?: AEFrequency;
  description: string;
  weapon: string;
  skillIds: {
    basic: string;
    passive: string;
    skill1: string;
    skill2: string;
    skill3: string;
    ultimate: string;
    resonance: string;
  };
  artFolder: string;
}

export const VERDANTIA_CHARACTERS: VerdantiaCharacter[] = [
  {
    id: 'c01-edran',
    name: 'Edran',
    title: 'The Verdant Blade',
    continent: 'verdantia',
    role: 'guardian',
    primaryAE: 'terris',
    description:
      'Stoic forest guardian clad in living leaf plate. Wields an emerald-cored longsword and stands as the living wall of Verdantia.',
    weapon: 'Emerald longsword',
    skillIds: {
      basic: 'edran_leafedge_slash',
      passive: 'edran_rooted_resolve',
      skill1: 'edran_canopy_guard',
      skill2: 'edran_vine_lash',
      skill3: 'edran_emerald_counter',
      ultimate: 'edran_worldroot_judgment',
      resonance: 'edran_heart_of_the_grove',
    },
    artFolder: 'verdantia/c01-edran',
  },
  {
    id: 'c02-lyra',
    name: 'Lyra',
    title: 'Windstrider',
    continent: 'verdantia',
    role: 'ranger',
    primaryAE: 'aeryn',
    secondaryAE: 'aquaris',
    description:
      'Elven wind-archer whose bow evolves from living wood into crystalline sky-steel. Master of the high currents.',
    weapon: 'Living / crystal wind bow',
    skillIds: {
      basic: 'lyra_gale_arrow',
      passive: 'lyra_zephyr_step',
      skill1: 'lyra_piercing_gale',
      skill2: 'lyra_skyward_barrage',
      skill3: 'lyra_mirrorwind',
      ultimate: 'lyra_tempest_sovereign',
      resonance: 'lyra_breath_of_the_high_peaks',
    },
    artFolder: 'verdantia/c02-lyra',
  },
  {
    id: 'c03-mosswick',
    name: 'Mosswick',
    title: 'The Elder Root',
    continent: 'verdantia',
    role: 'summoner',
    primaryAE: 'terris',
    description:
      'Ancient moss-bearded sage who is more forest than man. Commands roots, treants, and the memory of the deepwood.',
    weapon: 'Twisted root staff',
    skillIds: {
      basic: 'mosswick_staff_of_ages',
      passive: 'mosswick_ancient_canopy',
      skill1: 'mosswick_sprout_ward',
      skill2: 'mosswick_entangling_grove',
      skill3: 'mosswick_call_of_the_deepwood',
      ultimate: 'mosswick_world_tree_awakening',
      resonance: 'mosswick_verdant_covenant',
    },
    artFolder: 'verdantia/c03-mosswick',
  },
  {
    id: 'c04-kael',
    name: 'Kael',
    title: 'Shadowleaf',
    continent: 'verdantia',
    role: 'assassin',
    primaryAE: 'aeryn',
    secondaryAE: 'umbris',
    description:
      'Young forest scout who moves between leaf and shadow. Dual blades and absolute silence.',
    weapon: 'Twin short blades',
    skillIds: {
      basic: 'kael_twinleaf_cut',
      passive: 'kael_underbrush',
      skill1: 'kael_flicker_step',
      skill2: 'kael_poisondew',
      skill3: 'kael_vanish',
      ultimate: 'kael_eclipse_of_leaves',
      resonance: 'kael_nightwind_pact',
    },
    artFolder: 'verdantia/c04-kael',
  },
  {
    id: 'c05-sera',
    name: 'Sera',
    title: 'Tideglass',
    continent: 'verdantia',
    role: 'hybrid',
    primaryAE: 'aquaris',
    description:
      'Spear-maiden of the crystal waters. Scale armor and a spear of living ice-crystal.',
    weapon: 'Crystal water spear',
    skillIds: {
      basic: 'sera_crystal_thrust',
      passive: 'sera_tidal_flow',
      skill1: 'sera_cresting_strike',
      skill2: 'sera_mirror_pool',
      skill3: 'sera_abyssal_bind',
      ultimate: 'sera_leviathans_crown',
      resonance: 'sera_eternal_current',
    },
    artFolder: 'verdantia/c05-sera',
  },
  {
    id: 'c06-brynn',
    name: 'Brynn',
    title: 'Wolfkin',
    continent: 'verdantia',
    role: 'beastmaster',
    primaryAE: 'terris',
    description:
      'Tribal berserker bound to a green-eyed wolf. Bone and hide, whip and fang.',
    weapon: 'Bone whip + companion wolf',
    skillIds: {
      basic: 'brynn_bone_lash',
      passive: 'brynn_pack_bond',
      skill1: 'brynn_howl_of_the_green',
      skill2: 'brynn_rending_circle',
      skill3: 'brynn_primal_surge',
      ultimate: 'brynn_alpha_of_the_verdant_pack',
      resonance: 'brynn_heart_of_the_wild',
    },
    artFolder: 'verdantia/c06-brynn',
  },
  {
    id: 'c07-nyx',
    name: 'Nyx',
    title: 'Nightbolt',
    continent: 'verdantia',
    role: 'assassin',
    primaryAE: 'umbris',
    description:
      'Silent crossbow assassin of the deep shade. Purple eyes that never miss.',
    weapon: 'Ornate shadow crossbow',
    skillIds: {
      basic: 'nyx_shadow_bolt',
      passive: 'nyx_mark_of_the_unseen',
      skill1: 'nyx_piercing_void',
      skill2: 'nyx_blackout_volley',
      skill3: 'nyx_assassins_patience',
      ultimate: 'nyx_eventide_execution',
      resonance: 'nyx_voidstring',
    },
    artFolder: 'verdantia/c07-nyx',
  },
  {
    id: 'c08-orin',
    name: 'Orin',
    title: 'Inkweaver',
    continent: 'verdantia',
    role: 'mage',
    primaryAE: 'luminara',
    secondaryAE: 'terris',
    description:
      'Eccentric scholar whose quill and living script rewrite the battlefield.',
    weapon: 'Quill, tome, living script',
    skillIds: {
      basic: 'orin_scripted_strike',
      passive: 'orin_living_archive',
      skill1: 'orin_binding_glyph',
      skill2: 'orin_cascade_of_pages',
      skill3: 'orin_rewrite_fate',
      ultimate: 'orin_codex_of_the_first_grove',
      resonance: 'orin_eternal_quill',
    },
    artFolder: 'verdantia/c08-orin',
  },
  {
    id: 'c09-hadwin',
    name: 'Hadwin',
    title: 'Stonebough',
    continent: 'verdantia',
    role: 'tank',
    primaryAE: 'terris',
    description:
      'Bald warden of the villages. War maul, round shield, and the patience of stone.',
    weapon: 'War maul + round shield',
    skillIds: {
      basic: 'hadwin_maul_smash',
      passive: 'hadwin_unyielding_bark',
      skill1: 'hadwin_shield_slam',
      skill2: 'hadwin_fortify',
      skill3: 'hadwin_earthshatter',
      ultimate: 'hadwin_mountains_oath',
      resonance: 'hadwin_living_bastion',
    },
    artFolder: 'verdantia/c09-hadwin',
  },
  {
    id: 'c10-vael',
    name: 'Vael',
    title: 'Banner of the Green',
    continent: 'verdantia',
    role: 'commander',
    primaryAE: 'terris',
    description:
      'Battlefield commander in green-and-gold plate. Poleaxe raised, banner forever behind her.',
    weapon: 'Poleaxe / greataxe',
    skillIds: {
      basic: 'vael_poleaxe_sweep',
      passive: 'vael_rallying_presence',
      skill1: 'vael_commanding_strike',
      skill2: 'vael_hold_the_line',
      skill3: 'vael_banner_charge',
      ultimate: 'vael_verdant_crusade',
      resonance: 'vael_heart_of_command',
    },
    artFolder: 'verdantia/c10-vael',
  },
  {
    id: 'c11-aldous',
    name: 'Aldous',
    title: 'Dawnpriest',
    continent: 'verdantia',
    role: 'healer',
    primaryAE: 'luminara',
    description:
      'Radiant priest of the solar staff. White and green robes that never stain with darkness.',
    weapon: 'Solar staff',
    skillIds: {
      basic: 'aldous_solar_ray',
      passive: 'aldous_lights_mercy',
      skill1: 'aldous_radiant_mend',
      skill2: 'aldous_purifying_light',
      skill3: 'aldous_sanctuary',
      ultimate: 'aldous_solar_ascension',
      resonance: 'aldous_eternal_dawn',
    },
    artFolder: 'verdantia/c11-aldous',
  },
  {
    id: 'c12-mira',
    name: 'Mira',
    title: 'Bloomkeeper',
    continent: 'verdantia',
    role: 'support',
    primaryAE: 'terris',
    secondaryAE: 'luminara',
    description:
      'Gentle herbalist whose staff is a living branch and whose basket never empties of healing blooms.',
    weapon: 'Living branch staff',
    skillIds: {
      basic: 'mira_blossom_staff',
      passive: 'mira_life_bloom',
      skill1: 'mira_healing_petals',
      skill2: 'mira_sleeping_pollen',
      skill3: 'mira_overgrowth',
      ultimate: 'mira_eternal_spring',
      resonance: 'mira_seed_of_hope',
    },
    artFolder: 'verdantia/c12-mira',
  },
  {
    id: 'c13-theron',
    name: 'Theron',
    title: 'Prismblade',
    continent: 'verdantia',
    role: 'hybrid',
    primaryAE: 'terris',
    secondaryAE: 'ignara',
    description:
      'Warrior whose armor bears the six Frequency gems. Seeks unity of all Ascendance paths.',
    weapon: 'Enchanted longsword (prism gems)',
    skillIds: {
      basic: 'theron_prism_slash',
      passive: 'theron_chromatic_heart',
      skill1: 'theron_flame_vein',
      skill2: 'theron_frost_vein',
      skill3: 'theron_storm_vein',
      ultimate: 'theron_spectrum_cataclysm',
      resonance: 'theron_unity_of_the_six',
    },
    artFolder: 'verdantia/c13-theron',
  },
  {
    id: 'c14-zara',
    name: 'Zara',
    title: 'Starquill',
    continent: 'verdantia',
    role: 'mage',
    primaryAE: 'luminara',
    secondaryAE: 'aeryn',
    description:
      'Brilliant young academy mage. Crystal staff, floating tomes, and boundless arcane curiosity.',
    weapon: 'Crystal orb staff',
    skillIds: {
      basic: 'zara_arc_bolt',
      passive: 'zara_overcharge',
      skill1: 'zara_stellar_lance',
      skill2: 'zara_gravity_well',
      skill3: 'zara_arcane_barrier',
      ultimate: 'zara_celestial_codex',
      resonance: 'zara_living_library',
    },
    artFolder: 'verdantia/c14-zara',
  },
  {
    id: 'c15-dawnveil',
    name: 'Dawnveil',
    title: 'Twilight Edge',
    continent: 'verdantia',
    role: 'assassin',
    primaryAE: 'umbris',
    description:
      'Elegant dual-dagger assassin of the dusk. Silver hair, black veils, and blades that drink light.',
    weapon: 'Twin curved daggers',
    skillIds: {
      basic: 'dawnveil_crescent_cut',
      passive: 'dawnveil_veil_of_dusk',
      skill1: 'dawnveil_shadow_dance',
      skill2: 'dawnveil_soul_rend',
      skill3: 'dawnveil_mirror_blades',
      ultimate: 'dawnveil_eternal_nightfall',
      resonance: 'dawnveil_eclipse_pact',
    },
    artFolder: 'verdantia/c15-dawnveil',
  },
];

export function getVerdantiaCharacter(id: string): VerdantiaCharacter | undefined {
  return VERDANTIA_CHARACTERS.find((c) => c.id === id);
}

export function getVerdantiaCharactersByRole(role: CombatRole): VerdantiaCharacter[] {
  return VERDANTIA_CHARACTERS.filter((c) => c.role === role);
}

export function getVerdantiaCharactersByAE(ae: AEFrequency): VerdantiaCharacter[] {
  return VERDANTIA_CHARACTERS.filter(
    (c) => c.primaryAE === ae || c.secondaryAE === ae,
  );
}
