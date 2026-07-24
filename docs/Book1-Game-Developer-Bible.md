# ASCENSION LEGENDS
## Game Developer Bible — Book 1: Foundation & Systems Design
### Internal Document | Studio Version 1.0 | Classification: CONFIDENTIAL

---

> *"Not just a bot. A world."*
>
> This document is the authoritative reference for all design decisions, systems architecture, and game philosophy underlying Ascension Legends. Every engineer, designer, and writer who touches this project must read and internalize this bible before writing a single line of code or content.

---

# TABLE OF CONTENTS

1. [Game Vision](#1-game-vision)
2. [Core Gameplay Loop](#2-core-gameplay-loop)
3. [Player Progression](#3-player-progression)
4. [Character Stats](#4-character-stats)
5. [Economy](#5-economy)
6. [Battle System](#6-battle-system)
7. [Battle Types](#7-battle-types)
8. [Status Effects](#8-status-effects)
9. [Damage Types & Elemental Affinities](#9-damage-types--elemental-affinities)
10. [Equipment System](#10-equipment-system)
11. [Inventory System](#11-inventory-system)
12. [Skill System](#12-skill-system)
13. [Transformation System](#13-transformation-system)
14. [Visual System](#14-visual-system)
15. [Cinematic Battle System](#15-cinematic-battle-system)
16. [Discord Commands Reference](#16-discord-commands-reference)
17. [Scalability Architecture](#17-scalability-architecture)
18. [Development Standards](#18-development-standards)

---

# 1. GAME VISION

## 1.1 Philosophy

Ascension Legends is built on a single founding principle: **every interaction should feel earned, meaningful, and epic**.

Most Discord bots treat the platform as a novelty — a text-based pet simulator or a number-increment grind. Ascension Legends rejects that entirely. We treat Discord as a legitimate game delivery platform, one where millions of players are already present, socially organized, and emotionally invested in their communities.

Our philosophy is anchored in three pillars:

### Pillar 1 — Depth Over Simplicity
Every system must have layers. A new player sees a clean, inviting surface. A veteran player sees intricate, interconnected machinery. We never dumb down — we reveal complexity progressively through play.

### Pillar 2 — Social Architecture
The game's most powerful mechanics are social. Guild wars, raid coordination, PvP rivalries, tournament circuits — these are not features, they are the core product. Discord is a social network first. We build for that reality.

### Pillar 3 — Visual Ambition
A Discord bot should not look like a Discord bot. Every embed, every battle sequence, every profile card must feel like it was designed by a professional studio. We use dynamic image rendering, cinematic GIF sequences, and animated canvas layers to deliver console-quality visual feedback inside a chat interface.

---

## 1.2 Game Philosophy — Extended

### On Balance
Balance is not equality. Balance is each player's choice feeling meaningful regardless of path. A player who builds a pure Speed archetype and a player who builds a pure Power archetype should both feel effective — just differently. We do not balance by making everything the same. We balance by making trade-offs feel real.

### On Progression
Time spent must feel rewarded. However, we explicitly reject "endless grind with no payoff." Every 10 levels of grind should produce a visible, exciting milestone: a new skill unlocked, a new dungeon opened, a new story chapter revealed, a new visual transformation available.

### On Economy
The in-game economy is a living system. Inflation, player trading, market manipulation — these are real threats. We design the economy the way a central bank designs monetary policy: deliberate, data-driven, responsive. Gold is not just a number. Every gold sink must serve a design purpose.

### On Fairness
Free-to-play players must have a meaningful path to everything in the game. Premium currency (Stardust) unlocks cosmetics and convenience, never power. A F2P player who grinds daily can compete in ranked PvP. A premium player who buys packs gets visual prestige, not a win button.

### On Community
Servers are nations. Guilds are armies. Rivalries are legends. The game should generate stories that players want to tell on social media — "Our guild defeated the World Boss at 3am, 12 members deep, nobody had potions left." These moments happen through design, not accident.

---

## 1.3 Target Audience

### Primary Audience
| Segment | Description | Size Estimate |
|---|---|---|
| RPG enthusiasts | Players who love character building, stat optimization, loot | Core 40% of playerbase |
| Discord power users | Server members already deeply embedded in Discord communities | Core 35% of playerbase |
| Competitive gamers | PvP-driven players seeking ranked glory, leaderboards, tournaments | 15% of playerbase |
| Collector/builder types | Equipment chasers, set completionists, transformation hunters | 10% of playerbase |

### Secondary Audience
| Segment | Description |
|---|---|
| Casual gamers | Players who engage 10–30 min/day, use idle features |
| Guild leaders | Organizational players who drive community engagement |
| Content streamers | Players who stream Discord gameplay sessions |

### Age Demographics (Projected)
- 16–19: 25%
- 20–24: 38%
- 25–30: 22%
- 31+: 15%

---

## 1.4 Unique Selling Points

### USP 1 — Cinematic Battle Sequences
No other Discord MMORPG generates dynamic cinematic clips for battle outcomes. Ascension Legends uses a server-side canvas renderer to produce animated sequences (3–8 seconds) showing actual character sprites clashing, abilities firing, and outcomes resolving. These render and deliver in real-time.

### USP 2 — True MMORPG Depth
Most Discord RPGs are shallow by design. Ascension Legends has: 15+ character stat dimensions, 6 equipment slots with upgrade/enchant paths, 12+ status effect types, elemental affinity triangles, a 9-tier skill tree per class, transformation states with mastery tracking, guild war strategies, and a 200+ hour progression path.

### USP 3 — Server-Native Identity
Each Discord server that adds Ascension Legends becomes a living world region. Servers can develop regional identities, house server-exclusive events, and face off in cross-server Guild Wars. The game grows with the server's community.

### USP 4 — Transparent Economy Design
We publish economy data to players. Inflation metrics, gold burn rates, market averages — players who want to understand the system can. This builds trust and creates a class of sophisticated player who becomes a community economist and influencer.

### USP 5 — Original Transformation System
Without referencing any existing IP, we have designed the Ascension Resonance System — an original transformation framework with 4 stages, visual aura progression, unique ability unlocks, and mastery ladders. This is a centerpiece feature.

### USP 6 — First-Class Guild Experience
Guild systems in Discord bots are usually an afterthought. Ours is a game within the game. Guild HQ upgrades, guild skills, guild treasury, guild war declarations, guild rankings — the guild experience alone justifies playing.

---

## 1.5 Competitive Advantages

| Advantage | Competitors | Ascension Legends |
|---|---|---|
| Visual Quality | Text embeds, basic images | Dynamic cinematic renders, animated sequences |
| Content Depth | 20–50 hours of meaningful content | 200+ hours, expandable by module |
| Economy Design | Single currency, minimal sinks | 7 currency types, deliberate sink design |
| Social Systems | Basic guilds | Guild wars, alliances, server rivalries |
| Progression | Linear level grind | Prestige, transformations, class mastery |
| Battle System | Roll dice, display result | Turn-based, tactical, cinematic |
| Documentation | None or README.md | Full Game Developer Bible, player wiki |

### Competitor Analysis

**Competitor A — UnbelievaBoat Economy Bot**
Strength: Well-established economy. Weakness: No combat, no progression.

**Competitor B — Tatsu Bot**
Strength: Social features, currency system. Weakness: Shallow RPG, no real battle depth.

**Competitor C — Dank Memer**
Strength: Huge userbase, meme humor. Weakness: Comedy focus prevents serious RPG design.

**Competitor D — Pokétwo / PokéMeow**
Strength: Collector loop is compelling. Weakness: Legally derivative (Pokémon IP), no original systems.

**Competitor E — AniGame**
Strength: Anime aesthetic, character collecting. Weakness: Gacha-heavy, pay-to-win concerns, shallow combat.

**Ascension Legends' window:** A serious, original MMORPG experience that respects Discord's social fabric and delivers console-quality depth.

---

## 1.6 Long-Term Roadmap

```
PHASE 1 — FOUNDATION (Months 1–4)
├── Core battle engine
├── Character creation & 3 starter classes
├── Level 1–50 progression
├── Basic economy (Gold, Crystals)
├── Equipment system (Tiers 1–4)
├── Solo dungeons (10 dungeons)
├── Basic guild system
└── Slash commands (60 commands)

PHASE 2 — EXPANSION (Months 5–8)
├── Prestige/Rebirth system
├── Full economy (all 7 currencies)
├── Guild Wars (beta)
├── PvP Arena (Ranked Season 1)
├── 5-player Raids
├── Elemental expansion (all types)
├── Transformation system (Stage 1–2)
├── World Boss (weekly events)
└── Slash commands (120 commands)

PHASE 3 — DEPTH (Months 9–14)
├── Story campaign (30 chapters)
├── Challenge Tower (100 floors)
├── Tournament system (bracketed)
├── Cross-server Guild Wars
├── Transformation system (Stage 3–4)
├── Crafting system
├── Auction House
├── Server economy dashboards
└── Slash commands (180+ commands)

PHASE 4 — ECOSYSTEM (Months 15–24)
├── Player Trading (curated)
├── Seasonal content system
├── Monthly narrative events
├── Achievement/Trophy system
├── Clan Alliances (multi-guild)
├── Legendary equipment tier
├── API for community tools
├── Web dashboard (external)
└── 500,000+ user scalability certified

PHASE 5 — PLATFORM (Year 3+)
├── Companion mobile app
├── Public API + SDK
├── Esports tournament integration
├── Server partnership program
└── Open modding system
```

---

# 2. CORE GAMEPLAY LOOP

## 2.1 The New Player Experience

The first 30 minutes of Ascension Legends must convert a skeptic into a believer. Every friction point must be identified and eliminated. Every payoff must arrive sooner than the player expects.

### Onboarding Sequence

```
Step 1: /start
  → Character creation embed appears
  → Player selects name
  → Player selects from 3 Starter Classes (Vanguard, Invoker, Wanderer)
  → Cinematic intro plays (5-second animated sequence)
  → Player profile created in database
  → Tutorial quest chain begins automatically

Step 2: Tutorial Quest Chain (First 10 Minutes)
  Quest 1: "First Strike"   → Battle a training dummy → Learn basic combat → Reward: 50 Gold, 1 Iron Sword
  Quest 2: "Know Thyself"   → Open /profile → Learn to read stats → Reward: 100 XP, 1 Health Potion
  Quest 3: "Gear Up"        → Equip your first weapon → Learn equipment system → Reward: 50 Gold, 1 Iron Shield
  Quest 4: "Into the Wild"  → Complete first dungeon encounter → Learn dungeon system → Reward: 100 Gold, 200 XP
  Quest 5: "Guild Seeker"   → View /guild list or create a guild → Learn guild system → Reward: 250 XP, Guild Pass x1

Step 3: First Milestone (Level 5)
  → Unlock skill slots
  → First skill selection screen
  → Receive first Crystal reward
  → "Welcome to Ascension Legends" title awarded

Step 4: Open Loop Begins
  → Daily quests activate
  → World map unlocked
  → PvP available at Level 10
  → Dungeon pool expands
```

---

## 2.2 The Daily Loop

The daily loop is designed for **15–45 minutes of active engagement** with **passive income running in the background**.

```
MORNING CYCLE (First login of the day)
├── Daily login bonus claimed
├── Daily quest board refreshed (5 quests)
├── Guild check-in bonus
├── Market prices updated
└── World Boss timer displayed

ACTIVE PLAY SESSION
├── Complete daily quests (XP, Gold, Materials)
├── Run 1–3 dungeons (Loot, XP, Dungeon Keys)
├── Challenge 1–3 PvP opponents (Arena Tokens, Ranking)
├── Check Guild Tasks (Guild Coins)
├── Visit Shop (spend currencies)
└── Upgrade/Enchant equipment (Crafting Materials)

PASSIVE INCOME (Time-based)
├── Training Ground XP (every 30 minutes)
├── Gold Treasury trickle (Guild members contribute)
├── Merchant Post sales (sell items while offline)
└── Daily dungeon key regeneration

END OF DAY HOOK
├── Check leaderboard position
├── Review guild war status
├── Set overnight training focus
└── Preview tomorrow's rotating shop
```

---

## 2.3 The Weekly Loop

| Day | Featured Content | Special Rewards |
|---|---|---|
| Monday | Guild War Declaration Window | Guild Coin Bonus |
| Tuesday | Dungeon Rush Event (bonus drops) | Rare Material ×2 |
| Wednesday | Arena Double Token Day | Arena Token ×2 |
| Thursday | World Boss Spawn | World Boss Exclusive Drops |
| Friday | Crafting Bonus Day (25% cost reduction) | Blueprint Fragments |
| Saturday | Tournament Weekend Begins | Tournament Tokens, Trophies |
| Sunday | Guild War Resolution + Rewards | Guild Rankings Updated |

---

## 2.4 The Progression Loop

```
SHORT TERM (1–3 days)
├── Level up (every 30–60 min active play)
├── Unlock new skill
├── Upgrade one equipment piece
└── Complete daily quest chain

MEDIUM TERM (1–2 weeks)
├── Reach new rank tier (Bronze → Silver → Gold → Platinum → Diamond → Ascendant → Legend)
├── Complete a dungeon series
├── Contribute to Guild War victory
├── Unlock Transformation Stage 1
└── Reach level 25, 50, 75 milestones

LONG TERM (1–3 months)
├── Reach Level 100 → Prestige
├── Complete story campaign Act 1
├── Obtain a Legendary equipment piece
├── Reach Diamond PvP rank
├── Complete Transformation Mastery Stage 1
└── Contribute to server-first World Boss kill

ULTRA LONG TERM (3+ months)
├── Max Prestige (Rebirth)
├── Full Legendary loadout
├── Complete all Transformation stages
├── Tournament champion title
└── Server-wide recognition as top player
```

---

## 2.5 Retention Mechanics

### Streak System
Daily login streak. Every 7-day streak grants a **Streak Chest** with bonus items. Missing a day resets the streak but does not penalize existing items.

### Achievement System
Hundreds of achievements across every system. Achievements grant: Titles, Cosmetics, Currencies, Permanent stat bonuses (small, for completionist investment).

### Seasonal Prestige
Each 3-month Season introduces exclusive cosmetics, titles, and ranked rewards. Seasons end, cosmetics become unavailable. FOMO is deliberately calibrated — never gatekeeping power, always gatekeeping identity.

### Social Hooks
- Guild member check-ins increase guild XP
- PvP victories notify the defeated player
- World Boss kill appears in server feed
- Tournament brackets are publicly visible

---

# 3. PLAYER PROGRESSION

## 3.1 Level System

### Level Cap & Tiers

| Tier Name | Level Range | Unlock Theme |
|---|---|---|
| Initiate | 1–10 | Tutorial, basics, first class skills |
| Acolyte | 11–25 | Class identity, first dungeon tier, PvP unlock |
| Challenger | 26–50 | Elemental affinity, advanced skills, guild wars |
| Veteran | 51–75 | Prestige preview, rare equipment, transformation Stage 1 |
| Elite | 76–99 | Legendary equipment tier, tournament access, transformation Stage 2 |
| Ascended | 100 | Prestige gateway, full system access |
| Prestige 1–10 | 100+ | Post-ascension loop, rebirth bonuses, legend cosmetics |

---

## 3.2 XP Formulas

### XP Required Per Level

The core formula uses an exponential curve that flattens slightly in the mid-game to prevent burnout:

```
XP_Required(level) = BASE_XP × (level ^ EXPONENT) × TIER_MODIFIER

Where:
  BASE_XP = 100
  EXPONENT = 1.8
  TIER_MODIFIER = 1.0 for levels 1–25
               = 0.9 for levels 26–50   (slight ease — player retention zone)
               = 1.1 for levels 51–75   (re-engagement through challenge)
               = 1.3 for levels 76–100  (endgame gate)
```

### XP Required Table (Selected Levels)

| Level | XP Required | Cumulative XP | Est. Active Play Time |
|---|---|---|---|
| 1 | 100 | 100 | ~5 minutes |
| 5 | 1,741 | 4,681 | ~30 minutes |
| 10 | 6,310 | 22,009 | ~2 hours |
| 25 | 55,902 | 450,000 | ~15 hours |
| 50 | 325,000 | 4,200,000 | ~60 hours |
| 75 | 1,100,000 | 18,000,000 | ~130 hours |
| 100 | 3,500,000 | 65,000,000 | ~200 hours |

### XP Sources

| Source | XP Reward | Notes |
|---|---|---|
| Standard Battle (PvE) | 50–200 | Scales with enemy level |
| Dungeon Clear | 500–5,000 | Scales with dungeon tier |
| Daily Quest Completion | 200–1,000 | Per quest |
| World Boss Participation | 2,000–10,000 | Based on damage dealt |
| Raid Completion | 5,000–25,000 | Tier dependent |
| PvP Victory | 100–500 | Scaled to opponent rank |
| Training Ground (passive) | 30/30min | While online or offline |
| Story Chapter Clear | 1,000–10,000 | First-time bonus |
| Achievement Unlock | 100–5,000 | One-time per achievement |

---

## 3.3 Prestige / Rebirth System

### Prestige Overview
At Level 100, the player may trigger **Ascension Rite**, resetting their level to 1 while granting permanent Prestige bonuses and unlocking exclusive content layers.

### What Resets
- Level (back to 1)
- Raw stat points
- Quest board state

### What Carries Forward
- Prestige Level (permanent)
- Prestige Bonuses (see below)
- Transformation unlocks already earned
- Legendary equipment (locked, cannot be used until Level 50 post-prestige)
- Guild membership
- Titles and cosmetics
- Achievement progress

### Prestige Bonus Table

| Prestige Level | XP Bonus | Gold Bonus | Base Stat Boost | Special Unlock |
|---|---|---|---|---|
| Prestige 1 | +5% XP | +5% Gold | +50 all stats | Prestige Aura (Bronze) |
| Prestige 2 | +10% XP | +10% Gold | +120 all stats | Prestige Title: "The Reborn" |
| Prestige 3 | +15% XP | +15% Gold | +210 all stats | Exclusive Prestige Dungeon |
| Prestige 4 | +20% XP | +20% Gold | +320 all stats | Prestige Aura (Silver) |
| Prestige 5 | +25% XP | +25% Gold | +450 all stats | Prestige Weapon Skin |
| Prestige 6 | +30% XP | +30% Gold | +600 all stats | Exclusive Class Form |
| Prestige 7 | +35% XP | +35% Gold | +770 all stats | Prestige Aura (Gold) |
| Prestige 8 | +40% XP | +40% Gold | +960 all stats | Server-wide Announcement |
| Prestige 9 | +45% XP | +45% Gold | +1,170 all stats | Prestige Aura (Crimson) |
| Prestige 10 | +50% XP | +50% Gold | +1,500 all stats | "Legend" Title + Aura (Obsidian) |

---

## 3.4 Power Rating

Power Rating (PR) is a single composite number representing a player's overall combat effectiveness. It is used for:
- Matchmaking
- Dungeon access gating
- World Boss contribution tracking
- Leaderboard display

### Power Rating Formula

```
PR = (Attack × 2.0)
   + (Defense × 1.5)
   + (HP / 10)
   + (Speed × 1.2)
   + (Critical Chance × 200)
   + (Critical Damage × 100)
   + (Accuracy × 100)
   + (Evasion × 150)
   + (Luck × 80)
   + Equipment Score
   + (Skill Score × 1.5)
   + (Transformation Bonus)
   + (Prestige Bonus × 500)

Equipment Score = Σ(each equipped item's base power value)
Skill Score = Σ(each unlocked skill's power weight)
Transformation Bonus = current transformation stage × 1,000
```

### Power Rating Thresholds

| Power Rating | Rank Label | Access |
|---|---|---|
| 0–999 | Unranked | Tutorial only |
| 1,000–4,999 | Bronze | Basic dungeons, casual PvP |
| 5,000–14,999 | Silver | Tier 2 dungeons, ranked PvP |
| 15,000–39,999 | Gold | Tier 3 dungeons, guild wars |
| 40,000–99,999 | Platinum | Elite dungeons, tournaments |
| 100,000–249,999 | Diamond | Legendary equipment tier |
| 250,000–499,999 | Ascendant | Endgame raids, world boss |
| 500,000+ | Legend | All content, prestige recognition |

---

## 3.5 Ranking System

### PvP Ranking (Separate from Power Rating)
PvP rank is earned exclusively through Arena victories. Ranking uses an **Elo-like system with decay prevention**.

### Rank Tiers

```
BRONZE      (0–999 RP)      Bronze crest, no decay
SILVER      (1,000–2,999)   Silver crest, no decay
GOLD        (3,000–6,999)   Gold crest, -5 RP/day if not playing
PLATINUM    (7,000–14,999)  Platinum crest, -10 RP/day
DIAMOND     (15,000–29,999) Diamond crest, -15 RP/day
ASCENDANT   (30,000–49,999) Ascendant crest, -20 RP/day
LEGEND      (50,000+)       Legend crest, top 100 globally
```

### RP Gain/Loss Formula

```
RP_Change = BASE × MODIFIER × STREAK_BONUS

Win against higher rank: +25 to +45 RP
Win against equal rank:  +20 RP
Win against lower rank:  +10 to +18 RP
Loss against higher rank: -8 to -12 RP
Loss against equal rank:  -20 RP
Loss against lower rank:  -28 to -38 RP

STREAK_BONUS:
  3-win streak: ×1.1
  5-win streak: ×1.2
  10-win streak: ×1.35 (max)
```

---

## 3.6 Progression Pacing

### The "Time to Next Dopamine Hit" Principle

Every player should hit a meaningful progression milestone within 10–15 minutes of active play. The progression pacing is designed around this psychological target.

```
0–10 min: Level up or quest completion
10–20 min: Skill unlock or equipment drop
20–30 min: Dungeon completion reward
30–45 min: Daily quest chain complete
1–2 hours: Rank tier advancement (early game)
4–8 hours: Class milestone (every 10 levels)
1–3 days: Major system unlock
1 week: Transformation stage progress
1 month: Prestige eligibility
```

### Anti-Burnout Mechanics

1. **Stamina is not a gate** — players can always play. Stamina only affects bonus drop rates, not access.
2. **Catch-up XP** — if a player hasn't logged in for 3+ days, their first login gives 2× XP for 2 hours.
3. **Weekly XP Cap Removed** — we do not cap weekly XP. Dedicated players are rewarded.
4. **Overflow Buffers** — Daily quest completion creates "bonus buffer" — extra gold drop rate for next 3 battles.

---

# 4. CHARACTER STATS

## 4.1 Stat Overview

Every character in Ascension Legends has 12 primary stats. Each stat is a discrete value tracked in the database and recalculated on demand based on base stats + equipment bonuses + skill bonuses + transformation bonuses + prestige bonuses.

```
STAT CALCULATION ORDER:
  1. Base stat (class + level)
  2. + Equipment flat bonus
  3. × Equipment percentage bonus
  4. + Skill flat bonus
  5. × Skill percentage bonus
  6. + Transformation flat bonus
  7. × Transformation percentage bonus
  8. + Prestige flat bonus
  = Final Stat Value (used in all calculations)
```

---

## 4.2 HP (Hit Points)

**Definition:** The total amount of damage a character can absorb before being defeated.

**Base Range:** 500 (Level 1) → 50,000 (Level 100) → 200,000+ (Prestige 10)

**Class Modifiers:**
| Class | HP Multiplier |
|---|---|
| Vanguard (Tank) | ×1.4 |
| Invoker (Mage) | ×0.85 |
| Wanderer (Rogue) | ×1.0 |
| Sentinel (Healer) | ×1.1 |
| Berserker (Warrior) | ×1.2 |
| Phantom (Assassin) | ×0.9 |

**Combat Role:**
- When HP reaches 0, the character is defeated
- HP does not regenerate between battle rounds automatically (requires Regeneration status, skills, or items)
- HP displayed as current/max in all battle UIs (e.g., `12,450 / 18,000`)

**Leveling:** HP increases by `BASE_HP_GAIN × CLASS_MULTIPLIER` per level

```
BASE_HP_GAIN per level:
  Levels 1–25:  +200 per level
  Levels 26–50: +350 per level
  Levels 51–75: +550 per level
  Levels 76–100:+800 per level
```

---

## 4.3 Energy

**Definition:** A regenerating resource spent to use skills. The "mana" equivalent in Ascension Legends.

**Base Range:** 100 (Level 1) → 1,000 (Level 100)

**Regeneration:** Energy recovers at a rate of `10 + (Speed / 100)` per turn during battle.

**Energy Costs by Skill Type:**
| Skill Type | Energy Cost Range |
|---|---|
| Basic Attack | 0 (free) |
| Standard Active Skill | 20–40 |
| Advanced Active Skill | 50–80 |
| Ultimate Skill | 100–150 |
| Support Skill | 15–30 |

**Key Design Rule:** A player who spams Ultimate skills will exhaust Energy quickly. Resource management is a core tactical decision.

**Out-of-battle behavior:** Energy fully restores between battles.

---

## 4.4 Attack

**Definition:** Determines the baseline damage output of physical abilities.

**Formula:**
```
Physical_Damage = (Attack × Skill_Modifier) - (Target_Defense × Defense_Factor)

Where:
  Skill_Modifier = the skill's damage coefficient (e.g., 1.5 = 150% Attack)
  Defense_Factor = 0.6 (diminishing returns prevent Defense from being a wall)
  Minimum damage = max(1, calculated_damage)
```

**Attack Scaling Example:**
- Player with 2,000 Attack uses a skill with 1.8× modifier vs. enemy with 1,200 Defense:
  - `(2,000 × 1.8) - (1,200 × 0.6) = 3,600 - 720 = 2,880 damage`

**Soft Cap:** At extreme Attack values, each additional point returns diminishing bonus damage (over 10,000 Attack: +0.7 damage per point; over 50,000: +0.4 damage per point). This prevents a single stat from trivializing all content.

---

## 4.5 Defense

**Definition:** Reduces incoming physical damage.

**Formula:**
```
Damage_Received = max(1, (Incoming_Attack) - (Defense × 0.6))

With Damage_Reduction_Cap = 85% (Defense can never reduce damage below 15% of original)
```

**Tank Design Note:** Defense is deliberately not the dominant stat for survivability. Tanks use Defense + HP + Shield skills to create layered survivability, not a single stat wall.

---

## 4.6 Speed

**Definition:** Determines turn order in combat and affects Energy regeneration.

**Turn Order Formula:**
```
Turn_Initiative = Speed + Random(0, Speed × 0.15)

(15% randomness prevents pure Speed builds from being perfectly predictable)

Highest Initiative goes first in the round.
```

**Additional Speed Effects:**
- Dodge Chance: `Evasion_Base + (Speed / 500)` — Speed contributes slightly to evasion
- Energy Regen: `10 + (Speed / 100)` per turn
- Flee Success Rate: `(Speed / Enemy_Speed) × 0.8` (capped at 80%)

**Speed Breakpoints:**
| Speed | Notable Effect |
|---|---|
| 500 | Consistent first-mover advantage vs. base enemies |
| 1,500 | Always acts before most PvP opponents at similar level |
| 3,000 | Double-tap threshold (may act twice before slow opponents) |
| 5,000+ | Phantom class territory — extreme Speed archetype |

---

## 4.7 Accuracy

**Definition:** The probability that an attack will land against an opponent.

**Base Accuracy:** 85% (all characters)

**Accuracy Formula:**
```
Hit_Chance = (Attacker_Accuracy / (Attacker_Accuracy + Target_Evasion)) × 100

Capped at 95% (never guaranteed hit) and floored at 5% (never guaranteed miss)
```

**Miss Mechanic:** When an attack misses, the UI displays a stylized "MISS" indicator in the battle embed. Miss does not cost Energy.

---

## 4.8 Evasion

**Definition:** The probability that the character avoids an incoming attack.

**Evasion Formula:**
```
Dodge_Chance = Evasion / (Evasion + Attacker_Accuracy)

Capped at 60% dodge rate against standard attacks
Capped at 35% dodge rate against Ultimate skills (they are harder to avoid)
```

**Evasion Synergy:** The Wanderer and Phantom classes gain bonus Evasion from Speed, creating a "glass cannon" defensive identity — they avoid hits rather than tank them.

---

## 4.9 Critical Chance

**Definition:** The probability that an attack deals a Critical Hit (bonus damage).

**Base Critical Chance:** 5% (all characters)

**Formula:**
```
Is_Critical = Random(0, 100) < (Critical_Chance × Luck_Modifier)
Where Luck_Modifier = 1 + (Luck / 1000)
```

**Caps:**
- Hard cap at 75% Critical Chance (even with maximum investment)
- Soft cap at 50% Critical Chance (diminishing returns begin)

---

## 4.10 Critical Damage

**Definition:** The damage multiplier applied on Critical Hits.

**Base Critical Damage:** 150% (all characters — 1.5× normal damage)

**Formula:**
```
Critical_Damage_Dealt = Normal_Damage × (Critical_Damage / 100)

With minimum 150% (never below base critical)
And soft cap at 400% (extreme investment returns diminishing bonus)
```

**Notable Thresholds:**
| Critical Damage | Multiplier |
|---|---|
| 150 (base) | ×1.50 |
| 200 | ×2.00 |
| 300 | ×3.00 |
| 400 (soft cap) | ×4.00 |

---

## 4.11 Luck

**Definition:** A meta-stat that modifies many probabilistic outcomes.

**Luck Effects:**
| System | Luck Effect |
|---|---|
| Critical Chance | × (1 + Luck / 1000) multiplier |
| Item Drop Rate | +1% per 100 Luck |
| Equipment Rarity Roll | +0.5% chance per 100 Luck |
| Status Effect Resist | +0.2% resist per 100 Luck |
| Crafting Success Rate | +0.3% per 100 Luck |
| Auction Deals | +1% discount chance per 100 Luck |

**Design Note:** Luck is never the primary driver of any outcome. It provides edge. A high-Luck build cannot guarantee legendary drops — it improves the baseline odds.

---

## 4.12 Stamina

**Definition:** Governs bonus drop rates and special event triggers. NOT a gate on play.

**Stamina Mechanics:**
- Maximum: 200 Stamina
- Regeneration: +10/hour (natural), +30 via consumable items
- Effect: 100+ Stamina = 100% drop rates; 0 Stamina = 50% drop rates (never 0%)

**Stamina as Quality of Life, Not Gate:**
Players can battle with 0 Stamina — they simply receive half the drop bonuses. The game never locks combat behind Stamina.

---

## 4.13 Power Score

**Definition:** The composite numerical representation of a character's combat effectiveness (distinct from raw PR rating).

```
Power Score = (HP / 100)
            + Attack
            + Defense
            + (Speed × 0.8)
            + (Energy × 0.5)
            + (Critical Chance × 300)
            + (Critical Damage × 150)
            + (Accuracy × 200)
            + (Evasion × 250)
            + (Luck × 100)
            + (Stamina × 10)
```

**Power Score Usage:**
- Displayed on `/profile` card
- Used for dungeon difficulty gating (suggested Power Score per dungeon tier)
- Raid matchmaking minimum threshold

---

## 4.14 Combat Calculation Reference

```
FULL TURN DAMAGE CALCULATION:

1. Determine Hit: Random(0,100) < Hit_Chance?
   → No: MISS (0 damage)
   → Yes: Continue

2. Determine Crit: Random(0,100) < Crit_Chance?
   → Yes: Set crit_multiplier = (Critical_Damage / 100)
   → No: Set crit_multiplier = 1.0

3. Base Damage:
   damage = (Attacker_Attack × Skill_Multiplier) - (Defender_Defense × 0.6)
   damage = max(1, damage)

4. Element Modifier:
   damage = damage × Element_Affinity_Modifier

5. Status Modifiers:
   Apply Weakness: damage × 1.25
   Apply Blind: if attacker is blind, Hit_Chance reduced by 30%

6. Critical Application:
   damage = damage × crit_multiplier

7. Shield/Block Check:
   if defender has Shield status: damage = max(0, damage - Shield_Value)
   if defender activated Block: damage × 0.35

8. Final Damage Dealt:
   HP_after = HP_before - damage
   if HP_after <= 0: DEFEATED
```

---

# 5. ECONOMY

## 5.1 Economic Philosophy

The economy of Ascension Legends is designed to serve three constituencies simultaneously:

1. **The Player** — must feel that effort is always rewarded, spending is always valuable
2. **The Game** — must maintain a functioning market where currencies have real value
3. **The Studio** — must generate sustainable revenue without compromising gameplay fairness

Every economic decision flows from one principle: **Currency must feel earned to feel meaningful.**

---

## 5.2 Currency Types

### Currency 1 — Gold (⚙️)

**Role:** Primary everyday currency. Used for most standard transactions.

**Earn Methods:**
- Battle victories: 10–500 Gold
- Selling items: Variable
- Daily quests: 200–2,000 Gold
- Dungeon clear: 100–5,000 Gold
- NPC bounties: 50–1,000 Gold

**Spend Methods:**
- Standard shop: Consumables, basic equipment upgrades
- NPC services: Equipment repair, skill reset
- Training: Accelerated Training Ground sessions
- Market: Buying from player market (Player Trading)

**Inflation Prevention:** Daily Gold earn is capped at `Level × 500` Gold per day. Gold sinks are explicit (repair costs, upgrade costs, market fees).

---

### Currency 2 — Crystals (💎)

**Role:** Mid-tier currency. Used for higher-quality transactions. Earned through gameplay, not purchasable.

**Earn Methods:**
- Dungeon completion milestones
- Weekly challenge rewards
- Achievement unlocks
- Seasonal event rewards
- PvP rank tier advancement

**Spend Methods:**
- Equipment Tier 3–5 upgrades
- Special skill unlocks
- Transformation unlock requirements (partial)
- Auction House fee reduction
- Premium consumables (battle potions, escape scrolls)

**Design Note:** Crystals cannot be bought with real money. This protects the mid-game economy from pay-to-win pressure.

---

### Currency 3 — Guild Coins (🏛️)

**Role:** Guild-specific currency. Earned through guild participation. Spent exclusively in the Guild Store.

**Earn Methods:**
- Daily guild check-in: 50 Guild Coins
- Guild task completion: 100–500 Guild Coins
- Guild War victory (contribution): 200–2,000 Guild Coins
- Guild Boss kill: 500–3,000 Guild Coins
- Guild rank improvement: 1,000 bonus

**Spend Methods:**
- Guild Store: Exclusive equipment mods, cosmetics, guild banners
- Guild Upgrades: Contribution to guild HQ level (shared pool)
- Guild Skills: Passive bonuses for all guild members

**Anti-Hoarding:** Guild Coins decay at 5%/week above 50,000 held. Maximum soft cap is 200,000 (hard cap). This forces active spending.

---

### Currency 4 — Raid Tokens (⚔️)

**Role:** Exclusive to Raid content. Spent on Raid-specific rewards.

**Earn Methods:**
- Raid completion: 50–500 Raid Tokens
- Raid MVP bonus: +100–300 tokens
- Raid difficulty bonus: Scales with tier

**Spend Methods:**
- Raid Shop: Unique equipment, rare materials, transformation catalysts
- Raid Enhancements: Buy extra raid attempts (limited)

---

### Currency 5 — Arena Tokens (🥊)

**Role:** PvP-specific currency. Earned through Arena participation.

**Earn Methods:**
- Arena victory: 50 tokens
- Arena loss: 10 tokens (participation reward)
- Daily Arena quest completion: 200 tokens
- Rank advancement: 500–2,000 tokens

**Spend Methods:**
- Arena Shop: PvP-specific equipment, combat consumables, cosmetic effects

---

### Currency 6 — Crafting Materials

**Role:** A family of currencies (not a single currency) used in the Crafting system.

**Material Types:**
| Material | Rarity | Primary Source |
|---|---|---|
| Iron Ore | Common | Low-tier dungeons |
| Steel Fragment | Uncommon | Mid-tier dungeons |
| Mythrite Shard | Rare | High-tier dungeons, Raids |
| Void Crystal | Epic | World Boss, Legendary dungeons |
| Celestium Core | Legendary | Prestige dungeons, Story end rewards |

**Crafting Materials cannot be traded directly** between players. They can only be consumed through the crafting system.

---

### Currency 7 — Stardust (✨) — Premium Currency

**Role:** Real-money premium currency. Spent ONLY on cosmetics and convenience. NEVER on power.

**Purchase Methods:**
- Direct Discord purchase via Stripe integration (future Phase 4)
- Premium event rewards (small amounts)
- Gifted by guild leaders (from their own Stardust)

**Allowed Spend:**
- Cosmetic aura colors
- Weapon skin overlays
- Alternate character art frames
- Nickname color on leaderboard
- Inventory expansion (above free tier limit)
- Stamina refill (convenience, not required)
- Battle animation style selection

**Forbidden Spend (by design contract):**
- Attack/Defense/any stat increase
- Equipment tier purchase
- Skill unlock bypass
- Rank point purchase
- Any mechanism that increases combat power

---

## 5.3 Inflation Prevention Systems

| System | Mechanism |
|---|---|
| Daily Gold Earn Cap | `Level × 500` Gold/day maximum from battles |
| Repair Costs | Equipment degrades in Raids; repair costs Gold |
| Market Listing Fee | 5% Gold tax on all market listings |
| Upgrade Failure Sink | Failed upgrades consume materials without refund |
| Guild HQ Contribution | Gold sinks into collective guild pool |
| Consumable Expiration | Some consumables expire after 30 days if unused |
| Seasonal Wipes | Arena Tokens reset each season; hoarders lose nothing, but urgency increases spend |

---

## 5.4 Trading Restrictions

To prevent market manipulation by organized groups:

1. **Minimum Time Requirement** — Account must be at least 7 days old to use player market
2. **Level Restriction** — Player market access at Level 20+
3. **Listing Limits** — Maximum 10 active listings per player
4. **Price Range Control** — Listings cannot be priced more than 5× or less than 0.2× the system's 7-day market average for that item type
5. **Trade History** — All trades are logged; suspicious pattern (rapid cycling between two accounts) triggers review flag
6. **Soulbound Items** — Legendary equipment is Soulbound after equipping (cannot be traded)
7. **No Direct Gifting** — Players cannot send raw Gold to other players (prevents botted account value transfer)

---

## 5.5 Anti-Exploit Systems

| Exploit Type | Prevention Method |
|---|---|
| Botting (Auto-battle) | Rate limiting: max 1 battle command per 3 seconds; CAPTCHA triggers on suspicious patterns |
| Account Sharing | Session locking: account can only be active in one Discord session at a time |
| Gold Duplication | All economy transactions are atomic database operations with rollback on failure |
| Infinite Farming | Stamina system reduces drop rates; daily caps on currency |
| Market Manipulation | Price range enforcement, trade velocity monitoring |
| Alt Account Abuse | IP-flagging (not IP-banning), account age requirements, transfer restrictions |
| Battle Result Manipulation | Server-side battle computation only; clients receive results, never compute them |
| API Abuse | Rate limiting per user ID and per IP; exponential backoff on repeated failures |

---

# 6. BATTLE SYSTEM

## 6.1 Battle System Overview

The Ascension Legends battle system is a **turn-based tactical engine** executed entirely server-side. The Discord client displays results as animated embeds. Players issue commands; the server resolves outcomes.

### Core Principles
1. **Server-Authoritative** — All computations happen on the server. The client is a display terminal.
2. **Deterministic with Seeded Randomness** — Battle seeds are logged for replay and dispute resolution.
3. **Tactically Rich** — A minimum of 4 meaningful decisions per battle (skill selection, target selection, item use, flee attempt).
4. **Visually Spectacular** — Every turn produces embed updates with animated reaction.

---

## 6.2 Turn Structure

```
BATTLE INITIALIZATION
├── Both participants' stats computed (applying all buffs/bonuses)
├── Turn order determined (Speed-based Initiative roll)
├── Battle ID generated and logged
└── Opening cinematic triggered

TURN SEQUENCE (Per Round):
├── Phase 1: Status Effect Processing
│   ├── Tick all status effects (Burn damage, Poison damage, Regeneration heal, etc.)
│   ├── Check for status expiration
│   └── Check for incapacitating effects (Sleep, Fear: may skip turn)
│
├── Phase 2: Action Selection
│   ├── Player: Selects action from button menu or command
│   ├── AI (PvE): Evaluates behavior matrix (see AI section)
│   └── PvP: Simultaneous selection with 30-second timeout
│
├── Phase 3: Action Resolution (in Initiative order)
│   ├── Validate action (sufficient Energy, not silenced, etc.)
│   ├── Execute action (damage calc, healing, buff application)
│   ├── Apply secondary effects (status effect application)
│   └── Update HP bars and status display
│
├── Phase 4: Counter/Reaction Phase
│   ├── Check for Counter skills (trigger on being hit)
│   ├── Check for Block declarations (before attack lands)
│   └── Resolve any triggered passive abilities
│
├── Phase 5: Win Condition Check
│   ├── HP <= 0: DEFEATED
│   ├── Battle round limit reached: DRAW (PvP) or RETREAT (PvE)
│   └── Special victory conditions (story battles)
│
└── Phase 6: Turn Display
    ├── Generate turn summary embed
    ├── Push animated status to Discord
    └── Advance to next turn or resolve battle
```

---

## 6.3 Initiative System

```
INITIATIVE ROLL:
initiative = Speed + random_int(0, floor(Speed × 0.15))

EXAMPLE:
Player A: Speed 1,200 → initiative = 1,200 + random(0, 180) = 1,290 (rolled)
Player B: Speed 1,500 → initiative = 1,500 + random(0, 225) = 1,523 (rolled)
Player B goes first.

INITIATIVE MODIFIERS:
+15% initiative: "First Strike" passive skill
+20% initiative: Speed-type Transformation active
-20% initiative: "Slow" status effect
+30% initiative: Certain Ultimate skills (act immediately, bypass queue)
```

---

## 6.4 Combo System

Combos are achieved by landing consecutive hits of the same element or skill chain.

```
COMBO COUNTER:
- Starts at 0 each battle
- Increments by 1 on each consecutive hit (no misses, no blocks)
- Resets to 0 on miss, dodge, or blocked hit

COMBO BONUSES:
  ×2 Combo: +5% damage
  ×3 Combo: +10% damage
  ×4 Combo: +15% damage + guaranteed next hit lands (accuracy overridden)
  ×5 Combo: +20% damage + status effect duration +1 turn
  ×7 Combo: +30% damage + special "Combo Burst" visual trigger
  ×10 Combo: CHAIN ULTIMATE — Ultimate Gauge charges 50% instantly

COUNTER TO COMBO:
  "Counter" skill: Breaks opponent combo, resets counter
  Block: Preserves combo if you're the attacker; breaks opponent's combo
  Evasion: Breaks attacker's combo

COMBO DISPLAY:
  Battle embed shows a "🔥 COMBO ×N" indicator that animates with each hit.
```

---

## 6.5 Counter System

Certain skills and passive abilities trigger **Counters** — reactive actions that occur when specific conditions are met.

| Counter Type | Trigger Condition | Effect |
|---|---|---|
| Basic Counter | Character is attacked physically | Deals 60% Attack damage back instantly |
| Parry | Character declares parry action this turn | Next physical attack is deflected; no damage; 70% Attack counter |
| Elemental Counter | Enemy uses element this character resists | Deal element-resisted damage as counter bonus |
| Vengeance | HP drops below 25% | Next incoming hit triggers automatic counter |
| Reflex | Enemy misses due to evasion | Guaranteed counter with 80% Attack damage |

**Counter Restrictions:**
- Only one Counter can be triggered per turn
- Some skills explicitly state "cannot be countered"
- Ultimate skills bypass Counter checks

---

## 6.6 Dodge & Block

### Dodge
```
Dodge Outcome: Attack misses entirely
Trigger: Passive evasion check (Evasion stat vs. Attacker Accuracy)
Can be: Enhanced with skills (add +X% dodge for N turns)
Does not consume Energy
Visually: "EVADE" indicator with blur effect
```

### Block
```
Block Outcome: Damage reduced to 35% of calculated value
Trigger: Activated skill or passive ability (player declares Block this turn)
Can be: Enhanced (Block Value skill increases reduction to 50%)
Costs: 10 Energy to activate Block as a skill
Note: Block and Dodge cannot both trigger on the same hit
Note: Blocking sacrifices your attack this turn (or allows both if "Counter-Block" passive is active)
```

---

## 6.7 Status Effect Application

```
STATUS APPLICATION CHANCE:
base_chance = skill.status_chance   (defined per skill, e.g., 35%)
final_chance = base_chance × (1 - target_resist)
target_resist = (Luck / 1000) × 0.5 + class_innate_resist

EXAMPLE:
Skill applies Burn at 40% base
Target has 800 Luck: resist = (800/1000) × 0.5 = 0.40 (40%)
final_chance = 40% × (1 - 0.40) = 24% chance to apply Burn
```

**Multiple Status Effects:**
- Up to 4 status effects can be active on a character simultaneously
- The 5th status effect application replaces the oldest active status
- Some effects are mutually exclusive (Burn + Freeze cannot coexist; the newer one wins)

---

## 6.8 Critical Hit System

```
CRITICAL HIT SEQUENCE:
1. Roll: random(0, 100) < Critical_Chance?
   → If yes: CRITICAL HIT
   → If no: Normal hit

2. Critical Damage: damage × (Critical_Damage / 100)

3. Critical Display: Battle embed shows "⚡ CRITICAL!" with flash effect

CRITICAL MODIFIERS:
- Some skills "guarantee crit" (costs more Energy)
- "No Crit" zone: Some boss abilities have anti-crit fields (50% reduced crit chance)
- "Lethal Strike" passive: If crit damage would exceed 60% of target HP, triggers bonus effect

CRITICAL HIT VISUAL RULES:
- Critical hits trigger a distinct animation frame in the cinematic system
- The damage number display is ×2 size for crits
- A unique sound cue accompanies crits (implemented via embed emoji sequence)
```

---

## 6.9 Ultimate Gauge

The Ultimate Gauge is a meter that fills through combat and unleashes a powerful Ultimate Skill when full.

```
ULTIMATE GAUGE:
- Maximum: 100 points
- Starting: 0 (each battle starts with 0)

ULTIMATE CHARGE SOURCES:
- Dealing damage: +1 per 100 damage dealt
- Receiving damage: +2 per 100 damage taken (encourages fighting back)
- Using standard skills: +5 per use
- Using Energy skills: +10 per use
- Activating Combo ×10: +50 instant
- Certain passive skills: Passive charge at turn start

ULTIMATE GAUGE THRESHOLDS:
- 50%: "Empowered" — next skill deals +10% damage
- 75%: "Surging" — all stats +5% for 2 turns
- 100%: "ULTIMATE READY" — player can activate Ultimate Skill

USING ULTIMATE:
- Costs 100 Energy (in addition to gauge)
- Cannot be dodged (accuracy always 100%)
- Critical chance: 100% if any Luck (guaranteed crit above 1 Luck)
- Ultimate Gauge resets to 0 after use
- Cooldown: Ultimate can only be used once every 5 turns
```

---

## 6.10 Cooldown System

```
COOLDOWN CATEGORIES:
- Standard skills: 0 turns (no cooldown, but limited by Energy)
- Advanced skills: 2–3 turn cooldown
- Ultimate skill: 5 turn cooldown after use + full gauge requirement
- Passive skills: Permanent (no activation, no cooldown)
- Counter skills: 2-turn cooldown after counter triggers
- Transformation: 20-turn cooldown after transformation activates

COOLDOWN DISPLAY:
Each skill button shows remaining cooldown turns in parentheses.
e.g., [Inferno Strike (3 turns)] means this skill is on cooldown for 3 more turns.
```

---

## 6.11 AI Behavior System

PvE enemies use a behavior matrix that creates distinct combat personalities without requiring complex AI.

```
AI BEHAVIOR TYPES:

1. AGGRESSIVE (e.g., Dungeon Beasts)
   Priority: Deal maximum damage every turn
   Pattern: Always uses highest-damage skill available
   Special: Ignores buffs; goes for kill
   Counter-play: Tank + outlast; use Defense/Shield

2. DEFENSIVE (e.g., Shield Guardians)
   Priority: Survive indefinitely
   Pattern: Alternates attack/defend cycles; heals when below 40% HP
   Special: Activates Block on every other turn
   Counter-play: Break armor with Armor-Pierce skills; apply DoTs

3. STATUS-FOCUSED (e.g., Poison Wyrms)
   Priority: Stack status effects
   Pattern: Applies 1 status per turn; maintains pressure
   Special: Retargets status if immune, applies alternate
   Counter-play: Status cleanse items; high Luck build

4. COMBO-BUILDER (e.g., Shadow Dancers)
   Priority: Build combo multiplier for a powerful finisher
   Pattern: Basic attacks to build combo; unleashes heavy skill at ×5+
   Special: Uses Counter if interrupted during combo-build
   Counter-play: Break their combo with a Counter skill

5. SUPPORT (e.g., Cult Healer)
   Priority: Sustain allied enemies (in multi-enemy battles)
   Pattern: Heals weakest ally; buffs damaged allies; attacks only when no allies need help
   Special: Prioritizes eliminating threat to allied healers
   Counter-play: Silence status; kill healer first

6. BOSS (unique per boss)
   Priority: Phase-based behavior with unique mechanics
   Pattern: Changes strategy at 75%, 50%, and 25% HP thresholds
   Special: Immune to certain status effects; has ultimate pattern
   Counter-play: Read the boss log; use recommended element
```

---

# 7. BATTLE TYPES

## 7.1 PvE (Standard)

**Definition:** Player vs. Environment battles against NPC enemies.

**Structure:**
- 1 player vs. 1 enemy OR 1 player vs. 2–3 enemies (mob battles)
- Turn-based, standard rules apply
- No time pressure on player (60-second action timeout)
- Player can use items during battle

**Reward Structure:**
- Gold (scaled to enemy level)
- XP (scaled to enemy level)
- Equipment drops (based on Luck + Stamina)
- Crafting materials (rare drops)

**Content:** Open World encounters, Daily mission battles, Story battles

---

## 7.2 PvP (Player vs. Player)

**Definition:** Player vs. Player combat in the Arena.

**Structure:**
- 1v1, turn-based
- Both players issue actions simultaneously with 30-second timeout
- If timeout: Auto-attack fires
- Actions revealed simultaneously each turn (creates mind-game element)

**Simultaneous Resolution:**
```
Turn Resolution Order when both players select simultaneously:
1. Check for special priority effects (certain skills go first regardless of Speed)
2. Compare initiative (Speed-based, as normal)
3. Higher initiative acts first within the turn
4. Both actions resolve in sequence (not truly simultaneous, but selected simultaneously)
```

**Reward Structure:**
- Arena Tokens (win and loss)
- RP (win only)
- Daily PvP quests

**Modes:**
- Casual Arena: No RP gain/loss, Arena Tokens only
- Ranked Arena: RP tracking, seasonal rewards
- Tournament: Bracketed elimination (see Tournament section)

---

## 7.3 Guild War

**Definition:** Guild vs. Guild combat involving up to 20 members per side.

**Structure:**
```
GUILD WAR TIMELINE:
  Monday: Declaration window opens (any guild can declare war on another)
  Tuesday–Friday: Battle window — guild members fight opposing guild members
  Saturday midnight: War concludes; winner determined
  Sunday: Rewards distributed; rankings updated

WAR SCORING:
  Each player victory: +1 War Point for guild
  Enemy flag capture (special event): +5 War Points
  Daily objective completion: +3 War Points
  Final MVP bonus: Most kills on winning side gets bonus title for 1 week

WIN CONDITION:
  Team with most War Points at close of battle window wins.
  Tiebreaker: Fewer losses
```

**Reward Structure:**
- Winning guild: +2,000 Guild Coins per member, +500 Guild XP
- Losing guild: +500 Guild Coins per member (participation), +100 Guild XP
- War MVP: +1,000 Guild Coins + exclusive "War Hero" title (temporary)

---

## 7.4 Dungeon System

**Definition:** Structured PvE experiences with multiple rooms, encounters, and a boss.

### Dungeon Tiers

| Tier | Recommended PR | Rooms | Boss | Loot Pool |
|---|---|---|---|---|
| Tier 1 | 1,000–4,999 | 3 rooms + boss | Standard | Common–Uncommon |
| Tier 2 | 5,000–14,999 | 4 rooms + boss | Enhanced | Uncommon–Rare |
| Tier 3 | 15,000–39,999 | 5 rooms + boss | Elite | Rare–Epic |
| Tier 4 | 40,000–99,999 | 6 rooms + boss + mini-boss | Legendary | Epic |
| Tier 5 | 100,000+ | 8 rooms + 2 mini-bosses + final boss | Mythic | Epic–Legendary |

### Dungeon Flow
```
Enter Dungeon (/dungeon enter [dungeon_name])
  → Room 1: 1–2 enemy encounters
  → Room 2: 1–2 enemy encounters + chest (optional loot)
  → Room N: (continues based on tier)
  → Mini-Boss Room: Enhanced enemy with special mechanic
  → Final Boss Room: Boss battle with cinematic opener
  → Victory: Full loot distribution + dungeon clear XP

DUNGEON KEYS:
  Each dungeon requires 1 Dungeon Key to enter
  Key regeneration: 1 key per 4 hours (max 5 stored)
  Extra keys purchasable with Crystals (limited: 3 extra per day)

DUNGEON DIFFICULTY MODES:
  Normal: Standard rewards, standard difficulty
  Hard: +50% enemy stats, +75% rewards, chance for bonus chest
  Elite: +120% enemy stats, +200% rewards, guaranteed rare chest
```

---

## 7.5 Raid System

**Definition:** Multi-player cooperative PvE against a powerful raid boss.

**Structure:**
- 3–5 players in a party
- Raid boss has 10× the HP of a dungeon boss
- Each player fights the boss simultaneously (sequential turns per player)
- Total damage from all players depletes boss HP
- Boss has AoE attacks (hits all players each use)

### Raid Roles
| Role | Class Fit | Contribution |
|---|---|---|
| Tank | Vanguard, Berserker | Absorbs boss aggro/AoE; reduces damage to party |
| DPS | Phantom, Wanderer | Deals maximum damage per turn |
| Healer | Sentinel | Heals party members each turn |
| Buffer | Invoker | Applies party-wide buffs, debuffs on boss |

### Raid Mechanics
```
AGGRO SYSTEM:
Boss targets the player who dealt the most damage last turn.
If that player dies, boss retargets highest remaining DPS.
Tank skills generate "aggro" even without damage.

AoE ATTACK:
Boss uses AoE every 5 turns. All players take 60% of AoE damage.
Tank can use "Cover" skill to intercept (takes 100%, party takes 0%).

ENRAGE TIMER:
If raid is not completed within 30 turns: Boss enters ENRAGE.
Enraged boss: +50% all damage, guaranteed crits, uses AoE every 2 turns.

WIPE CONDITION:
If all 5 players are defeated: Raid fails. No reward distribution.
```

---

## 7.6 World Boss

**Definition:** A server-wide event where all active players battle a single mega-boss.

**Spawn:** Every Thursday; exists for 24 hours.

**Structure:**
- All willing server players can attack the World Boss
- Each player battles solo against the World Boss in their own session
- Damage is aggregated server-wide
- Boss has a shared HP pool (e.g., 10,000,000 HP for a medium server)
- When boss HP reaches 0: Boss defeated, rewards distributed

### World Boss Reward Tiers

| Contribution | Reward Tier |
|---|---|
| Top 1% damage | Legendary chest + exclusive cosmetic |
| Top 5% damage | Epic chest + rare material |
| Top 20% damage | Rare chest |
| Participated (any damage) | Common reward + Participation Crystal |

---

## 7.7 Tournament System

**Definition:** Structured competition with brackets, elimination rounds, and ranked prizes.

```
TOURNAMENT SCHEDULE:
  Weekend tournaments: Saturday–Sunday
  Monthly championships: End of every month
  Seasonal grand tournament: End of each 3-month season

BRACKET STRUCTURE:
  32 players → 16 matches Round 1
  16 players → 8 matches Round 2
  8 players → 4 matches Quarterfinals
  4 players → 2 matches Semifinals
  2 players → 1 match Final (Grand Cinematic)

RULES:
  Standard PvP rules apply
  Item use: Allowed (one-use items permitted per match)
  Time limit: 20 turns per match; if tied, Sudden Death (next hit wins)
  Bans: Each player may ban 1 skill before the match (Tournament mode only)

PRIZES:
  1st Place: Champion title, Exclusive weapon skin, 5,000 Arena Tokens, 10,000 Crystals
  2nd Place: Runner-up title, 2,500 Arena Tokens, 5,000 Crystals
  3rd/4th: Semifinalist title, 1,000 Arena Tokens, 2,500 Crystals
  Participation: Tournament token (for Tournament shop)
```

---

## 7.8 Story Battles

**Definition:** Scripted battles within the campaign story. Narrative-driven with unique mechanics.

**Design Rules:**
- Story battles can have scripted outcomes for narrative purposes (Phase 1 always loses to the antagonist until Act 3)
- Story battles have unique visual themes (custom enemy art, unique battle background)
- Some story battles introduce tutorial mechanics for new systems
- Story battles can be replayed after completion (but reward XP/Gold only on first clear)

---

## 7.9 Challenge Tower

**Definition:** A solo PvE endurance challenge with 100 floors.

```
TOWER STRUCTURE:
  Floors 1–20:   Easy (Iron Tier) — Enemies at 80% of player level
  Floors 21–40:  Normal (Bronze Tier) — Enemies at 100% of player level
  Floors 41–60:  Hard (Silver Tier) — Enemies at 120% of player level
  Floors 61–80:  Expert (Gold Tier) — Enemies at 150% of player level
  Floors 81–99:  Master (Diamond Tier) — Enemies at 200% + special mechanics
  Floor 100:     Apex Boss — Unique challenge; only ~1% of players reach this floor

TOWER RULES:
  - HP carries over between floors (no recovery between battles)
  - Players can use a limited number of "Tower Potions" (5 total, purchased before entering)
  - Death sends player back to the start of their current tier (not floor 1)
  - Progress is saved: Player can exit and resume from their last floor

TOWER REWARDS (Milestone Floors):
  Floor 20:  Tower Crystal ×5
  Floor 40:  Rare Equipment Chest
  Floor 60:  Epic Equipment Chest + unique title
  Floor 80:  Legendary Equipment Chest + Tower cosmetic
  Floor 100: "Apex Conqueror" title + Legendary+ equipment + permanent stat rune
```

---

# 8. STATUS EFFECTS

## 8.1 Status Effect Framework

Status effects are temporary conditions applied during battle. They are tracked per-character and processed at the start of each turn.

### Status Display Format
```
Character Name [HP: 8,250 / 10,000]
Active Effects: 🔥 Burn (3T) | ❄️ Freeze (1T) | 💚 Regeneration (2T)
```

### Status Effect Properties
Each status effect has:
- **Type:** Damage, Control, Buff, Debuff
- **Max Duration:** Maximum turns it can last
- **Stack Rule:** Whether multiple applications stack or reset
- **Resistance:** Whether it's fully blocked by high Luck or class passives
- **Mutual Exclusions:** Which effects cannot coexist

---

## 8.2 Burn 🔥

**Type:** Damage over time (DoT)
**Description:** The target is on fire, taking damage at the start of each turn.

```
Damage per turn: Attacker_Attack × 0.15
Duration: 3 turns (base), max 5 turns with stacking
Stacking: Each new Burn application refreshes duration + adds 10% to the DoT multiplier
          (max stack: ×0.35 Burn damage at full 5 stacks)

Mutual Exclusion: Burn and Freeze cannot coexist. If Burn is applied to a Frozen target:
  → Freeze is removed instantly
  → Burn applies at 50% potency (thaw costs some fire energy)

Immunity: Fire-type characters have 50% Burn resistance
Visual: 🔥 icon, red glow on character embed frame

Removal: "Extinguish" skill; "Freeze" application; waiting out duration
```

---

## 8.3 Freeze ❄️

**Type:** Control (Incapacitating)
**Description:** The target is frozen solid. Cannot act while frozen.

```
Skip Turns: Target cannot take any action while frozen
Duration: 1–2 turns (base); 3 turns with Glacial enhancement
Movement Penalty: If Speed is relevant, Frozen character acts last if thawed mid-round

Damage Bonus: Ice-type attacks against Frozen target: +40% damage (shatter bonus)

Mutual Exclusion: Freeze and Burn cannot coexist (see Burn section)

Break Condition: Taking a "Shatter" hit while frozen deals ×1.4 damage AND breaks freeze
                 Ice character can choose to "shatter" frozen target deliberately

Immunity: Ice-type characters immune; Fire-type characters: 50% resistance

Visual: ❄️ icon, blue crystalline overlay on character embed

Removal: Fire-type attack; Fire skill; Burn application; waiting out duration
```

---

## 8.4 Poison 🟢

**Type:** Damage over time (DoT)
**Description:** The target is poisoned, taking escalating damage each turn.

```
Damage per turn: Attacker_Attack × 0.10 initially
Escalation: Each turn Poison is active, damage increases by ×0.05 (max ×0.30)

Duration: 5 turns (base)
Stacking: Multiple Poison applications do NOT stack separate DoTs.
          A new application refreshes duration and resets escalation (strategic re-application is a trade-off)

Poison ignores Defense completely (represents internal damage)

Immunity: Nature/Toxic class characters: 50% resistance

Visual: 🟢 icon, green drip effect on character embed

Removal: "Antidote" item; "Cleanse" skill; waiting out duration (duration is long — attrition value)
```

---

## 8.5 Bleed 🩸

**Type:** Damage over time (DoT) — Physical variant
**Description:** The target is bleeding, losing HP based on their own maximum HP.

```
Damage per turn: 2% of target's MAX HP (unusual — scales with victim, not attacker)
Duration: 4 turns
Stacking: Up to 3 stacks; each stack adds another 2% max HP damage

Design Note: Bleed is the anti-tank status. High HP characters take more Bleed damage.
Minimum damage: 50 HP per stack per turn (prevents irrelevance on low-HP enemies)

Immunity: Undead-type enemies immune (they don't bleed)

Visual: 🩸 icon, crimson drip on character embed frame

Removal: "Bandage" item; "Stop Bleeding" skill; waiting out duration
```

---

## 8.6 Shock ⚡

**Type:** Damage + Control
**Description:** The target is struck by electricity, taking damage and losing Energy.

```
Damage: Attacker_Attack × 0.12 per turn
Energy Drain: -20 Energy per turn (in addition to damage)
Duration: 3 turns
Stacking: Each new Shock application adds 1 turn to duration (max 5 turns)

Design Note: Shock is the anti-caster status. Drains Energy = no skills next turn if Energy depleted.

Critical Shock: If Shocked target has 0 Energy, next Shock hit stuns for 1 turn ("Circuit Break")

Immunity: Lightning-type characters: 75% resistance

Visual: ⚡ icon, yellow flickering effect on embed

Removal: "Insulate" skill; waiting out duration
```

---

## 8.7 Fear 😨

**Type:** Control
**Description:** The target is too afraid to act optimally. 50% chance to fail their action each turn.

```
Effect: Each turn target attempts action, roll random(0,1) — if 0, action fails (wasted turn)
Duration: 2–3 turns
Note: Ultimate skills CANNOT be interrupted by Fear (if they are queued, they resolve regardless)

Additional Effect: Target cannot use "Flee" while Feared

Stacking: Duration extends by 1 per new application (max 4 turns)

Immunity: High-Luck characters have extra resistance; Boss-type enemies immune

Visual: 😨 icon, shaking/pixelated overlay on character embed

Removal: "Courage" skill; "Mental Fortress" passive; waiting out duration
```

---

## 8.8 Silence 🔇

**Type:** Control
**Description:** The target cannot use Active or Ultimate skills. Basic attacks still function.

```
Effect: Silenced characters can ONLY:
  - Basic Attack (0 Energy cost)
  - Use items
  - Attempt Flee
  All skill slots are disabled while Silence is active.

Duration: 2 turns
Stacking: Non-stacking; new application resets duration

Design Note: Silence is a devastating opener against skill-reliant classes (Invoker, Phantom)
             but barely affects pure-attack Berserkers

Immunity: "Indomitable Will" passive (some endgame skills)

Visual: 🔇 icon, grey grayed-out skill buttons in embed

Removal: "Cleanse" skill; waiting out duration
```

---

## 8.9 Curse 💀

**Type:** Debuff (Stat Reduction)
**Description:** The target's positive effects are halved, and new buffs are 50% effective.

```
Effect 1: Any active buffs (stat increases) on the target are reduced to 50% effectiveness
Effect 2: Any new buffs applied while Cursed are at 50% effectiveness
Effect 3: All Luck-based checks (item drops, status resist, crit) reduced by 30%

Duration: 4 turns
Stacking: Non-stacking; new application resets duration

Unique: Curse cannot be removed by standard Cleanse skills — requires "Exorcise" or "Purify" skills

Visual: 💀 icon, dark purple haze on character embed frame

Removal: "Exorcise" skill; "Purify" item; waiting out duration
```

---

## 8.10 Blind 👁️

**Type:** Debuff (Accuracy Reduction)
**Description:** The target cannot see clearly; Accuracy drastically reduced.

```
Effect: Target's Accuracy reduced by 40%
Result: All attacks have heavily reduced hit chance
Duration: 3 turns

Synergy: Blind + Evasion-heavy opponent = near-untouchable combination

Partial Blind (Smoke-type variants): 20% accuracy penalty, 4 turns

Immunity: Characters with "True Sight" passive; Dark-type characters: 50% resistance

Visual: 👁️ icon, blur filter over attacker's attack display in embed

Removal: "Clear Sight" skill; "Antidote" item; waiting out duration
```

---

## 8.11 Regeneration 💚

**Type:** Buff (Healing over time)
**Description:** The target regenerates HP at the start of each turn.

```
Healing per turn: Attacker_Magic_Power × 0.20 (if applied by skill)
                  OR flat amount based on the skill's power rating

Duration: 3 turns (base)
Stacking: Multiple Regen applications stack (max 3 stacks, each independent)

Display: Total regen per turn shown in status tag
         e.g., 💚 Regen (2T) [+840/turn]

Note: Regeneration cannot heal above maximum HP

Visual: 💚 icon, green sparkle pulse on character embed, HP number turns green in status bar

Applied by: Sentinel skills, consumable potions, certain equipment
```

---

## 8.12 Shield 🛡️

**Type:** Buff (Damage Absorption)
**Description:** An energy barrier absorbs a fixed amount of incoming damage.

```
Shield HP: Defined by the skill that applied it (e.g., "Barrier Pulse: 3,500 Shield HP")
Mechanic: Incoming damage hits Shield first; remaining damage (if any) hits real HP
          Shield: 3,500 HP | Incoming: 2,000 → Shield absorbs all → Shield HP: 1,500 remaining
          Shield: 1,500 HP | Incoming: 2,000 → Shield breaks, remaining 500 hits real HP

Duration: Until broken or 5 turns (whichever comes first)

Stacking: New Shield replaces old Shield (does not stack values)
          Exception: "Layered Shield" skill creates a secondary shield over existing one

Visual: 🛡️ icon, blue translucent overlay on character embed; shield HP shown separately

Break Effect: When Shield is destroyed, a "SHIELD BROKEN" animation triggers in battle embed

Applied by: Vanguard skills, Sentinel skills, certain Artifacts
```

---

## 8.13 Weakness 🔻

**Type:** Debuff (Damage Received Increase)
**Description:** The target becomes vulnerable, taking increased damage.

```
Effect: Target receives X% more damage from all attacks
Standard Weakness: +25% damage received
Enhanced Weakness: +40% damage received (from higher-tier skills)
Duration: 3 turns

Stacking: Does not stack multiple percentages; new application refreshes duration and
          upgrades to the higher multiplier if new application is stronger

Synergy: Weakness + Critical Hit = extremely high burst potential

Applied by: Invoker debuff skills, certain Raid mechanics, Dark-type abilities

Visual: 🔻 icon, orange tint on target's character frame in embed
```

---

## 8.14 Slow 🐢

**Type:** Debuff (Speed Reduction)
**Description:** The target's Speed is significantly reduced, affecting turn order and action efficiency.

```
Effect: Target's Speed reduced by 40% for duration
Result: Slower initiative; reduced Energy regeneration; reduced evasion contribution

Duration: 3 turns
Stacking: Stacks up to twice (second stack reduces Speed by 60% total instead of 40%)

Maximum Slow: Speed cannot be reduced below 10% of its original value (floor)
Freeze Synergy: A Slowed + Frozen character acts last when thawed

Applied by: Nature-type skills, certain Status-type characters, environmental effects

Visual: 🐢 icon, slow-motion animation flag on the affected character's action display
```

---

## 8.15 Sleep 💤

**Type:** Control (Incapacitating)
**Description:** The target is put to sleep. Cannot act. Wakes up when damaged.

```
Effect: Target cannot take ANY action while Sleeping (similar to Freeze but different mechanic)
Wake Condition: Any damage (even 1 HP) wakes the target immediately
Sleep Trap: Skilled players can "save" a high-damage hit to wake the enemy at full advantage

Duration: 3 turns OR until damaged

Sleep Bonus: While target is Sleeping, attacker's next attack deals +30% damage
             (this bonus applies to the wake-up hit)

Immunity: Boss-type enemies immune; Dark-type characters: 50% resistance
          Note: This is intentional — Sleep against a boss requires the boss's sleep resist to be lowered first (special mechanic)

Applied by: Invoker Somnomancy skills, certain guild skills, event items

Visual: 💤 icon, Zzz floating above character, character embed shows closed eyes
```

---

# 9. DAMAGE TYPES & ELEMENTAL AFFINITIES

## 9.1 Damage Type Overview

All damage in Ascension Legends belongs to a **Type**. Types interact through a system of **Affinities** — strengths and weaknesses. Correct element use is rewarded with bonus damage; incorrect element use suffers a penalty.

### The Seven Elements

| Element | Symbol | Domain |
|---|---|---|
| Flame | 🔥 | Fire, heat, explosive |
| Frost | ❄️ | Ice, cold, crystal |
| Storm | ⚡ | Lightning, thunder, electricity |
| Terra | 🌿 | Earth, nature, growth |
| Void | 🌑 | Darkness, shadow, null |
| Radiance | ✨ | Light, holy, celestial |
| Iron | ⚙️ | Physical, neutral (no elemental affinity) |

---

## 9.2 Elemental Affinity Chart

### Reading the Chart
- **Strong Against (2.0×):** Attacker's element deals double damage
- **Neutral (1.0×):** Normal damage
- **Weak Against (0.5×):** Attacker's element deals half damage
- **Absorbs:** Target absorbs the element (heals instead of damages)

```
ELEMENT AFFINITY TABLE:

ATTACKER →     FLAME    FROST    STORM    TERRA    VOID    RADIANCE    IRON
DEFENDER ↓

FLAME          1.0      2.0      0.5      2.0      1.0      0.5        1.0
FROST          0.5      1.0      2.0      0.5      1.0      2.0        1.0
STORM          2.0      0.5      1.0      1.0      2.0      0.5        1.0
TERRA          0.5      2.0      1.0      1.0      0.5      2.0        1.0
VOID           1.0      1.0      0.5      2.0      1.0      0.5        1.0
RADIANCE       2.0      0.5      2.0      0.5      2.0      1.0        1.0
IRON           1.0      1.0      1.0      1.0      1.0      1.0        1.0
```

*(Iron/Physical element has no affinities — it is universally neutral)*

### Elemental Description Matrix

| Attacker | Target | Result | Narrative Reason |
|---|---|---|---|
| Flame | Frost | ×2.0 | Fire melts ice; overwhelming heat destroys cold |
| Flame | Terra | ×2.0 | Fire burns vegetation; nature's weakness |
| Flame | Radiance | ×0.5 | Holy light dampens destructive fire |
| Flame | Storm | ×0.5 | Lightning doesn't care about fire |
| Frost | Storm | ×2.0 | Ice slows electrical flow; conductivity dampened |
| Frost | Radiance | ×2.0 | Cold subdues divine energy |
| Storm | Flame | ×2.0 | Electricity ignites and amplifies heat |
| Storm | Void | ×2.0 | Light-force storm illuminates shadow |
| Terra | Frost | ×2.0 | Earth shatters frozen surfaces |
| Terra | Radiance | ×2.0 | Grounded energy neutralizes celestial power |
| Void | Terra | ×2.0 | Darkness corrupts organic growth |
| Void | Radiance | ×0.5 | Light obliterates shadow (mutual weakness both ways) |
| Radiance | Void | ×2.0 | Divine light annihilates darkness |
| Radiance | Flame | ×2.0 | Holy fire purifies mundane flame |
| Radiance | Storm | ×2.0 | Celestial power overpowers natural lightning |

---

## 9.3 Dual-Element Affinity (Advanced Mechanic)

Some high-tier enemies and characters have **Dual-Element** affinity — they belong to two elements simultaneously. Damage calculations use the average of both element results.

```
EXAMPLE: A creature with FLAME + TERRA dual affinity
  → Hit by Frost: Frost vs Flame = 0.5 | Frost vs Terra = 2.0 | Average = 1.25× damage
  → Hit by Storm: Storm vs Flame = 0.5 | Storm vs Terra = 1.0 | Average = 0.75× damage
```

---

## 9.4 Elemental Mastery (Player System)

Players can level up **Elemental Mastery** in their primary element to gain passive bonuses:

```
ELEMENTAL MASTERY TIERS:
  Mastery 0 (Unaffiliated): No bonus, can use any element
  Mastery 1 (Initiate):     +5% damage with primary element
  Mastery 2 (Adept):        +10% damage, +10% status chance for element status
  Mastery 3 (Expert):       +15% damage, elemental skill Energy cost -10%
  Mastery 4 (Master):       +20% damage, unlock element-exclusive passive
  Mastery 5 (Grandmaster):  +30% damage, unlock unique "Grand Technique" skill

MASTERY GAIN: 1 point per 10 uses of primary element skills
              Mastery is class-specific; changing class resets mastery
```

---

# 10. EQUIPMENT SYSTEM

## 10.1 Equipment Slot System

Every character has **9 equipment slots**. Each slot accepts only certain item types.

```
EQUIPMENT SLOTS:
  [ Weapon  ]   — Primary damage instrument
  [ Offhand ]   — Secondary item (Shield, Focus, Tome, Quiver)
  [ Helmet  ]   — Head armor
  [ Body    ]   — Chest armor
  [ Gloves  ]   — Hand armor
  [ Boots   ]   — Foot armor
  [ Relic   ]   — Ancient item with passive effects
  [ Artifact]   — Magical construct with unique abilities
  [ Aura Core ] — Energy-infused gem providing aura bonuses
```

---

## 10.2 Equipment Rarity

| Rarity | Color Code | Background Color | Stat Multiplier | Drop Rate |
|---|---|---|---|---|
| Common | ⬜ White | #CCCCCC | ×1.0 | 50% |
| Uncommon | 🟢 Green | #2ECC71 | ×1.25 | 30% |
| Rare | 🔵 Blue | #3498DB | ×1.60 | 15% |
| Epic | 🟣 Purple | #9B59B6 | ×2.20 | 4% |
| Legendary | 🟡 Gold | #F39C12 | ×3.50 | 0.9% |
| Mythic | 🔴 Red | #E74C3C | ×5.00 | 0.1% |
| Celestial | 🌈 Prismatic | Animated | ×7.50 | 0.01% |

**Celestial Note:** Celestial items are intended to be server-known rarities. When a Celestial item drops, a server-wide announcement fires.

---

## 10.3 Weapon Types

| Weapon Type | Class Affinity | Stat Focus | Special Property |
|---|---|---|---|
| Greatsword | Berserker, Vanguard | High Attack | Heavy Strike: +20% damage, -1 speed |
| Rapier | Phantom, Wanderer | Speed + Attack | Finesse: +10% crit chance |
| Staff | Invoker, Sentinel | Magic Power | Amplify: +15% skill damage |
| Axe | Berserker | Attack + Bleed | Cleave: 20% chance to hit adjacent target |
| Shortbow | Wanderer | Accuracy + Speed | Range: always acts before melee at equal speed |
| Tome | Invoker | Magic Power + Energy | Arcane Reserve: +20% max Energy |
| Claws | Phantom | Speed + Critical | Combo Starter: +5% combo damage |
| Warhammer | Vanguard | Attack + Stun | Concuss: 15% chance to apply brief Stun |
| Dual Blades | Wanderer, Phantom | Speed + Crit | Twin Strike: attacks twice for 60% damage each |
| Grimoire | Invoker | Magic Power + Curse | Hex Amplifier: cursed targets take +15% skill damage |
| Spear | Vanguard, Berserker | Attack + Defense pierce | Reach: ignores 20% of target's Defense |

---

## 10.4 Armor Types

| Armor Slot | Light (Evasion Focus) | Medium (Balanced) | Heavy (Defense Focus) |
|---|---|---|---|
| Helmet | +Accuracy, +Luck | +Defense, +HP | +Defense, +Block |
| Body | +Evasion, +Speed | +Defense, +HP | +Defense, +HP (high) |
| Gloves | +Critical, +Accuracy | +Attack, +Defense | +Defense, +Stamina |
| Boots | +Speed, +Evasion | +Speed, +Defense | +HP, +Defense |

**Armor Weight Rules:**
- Characters can mix Light/Medium/Heavy armor
- Wearing full sets of the same weight unlocks a Set Bonus (see below)
- Heavy armor equipped by a Speed-build character suffers a -15% Speed penalty

---

## 10.5 Relics

Relics are **legendary-grade passive items** with effects unlike standard stat-boosting gear. They drop only from bosses and World Boss events.

```
RELIC EXAMPLES:

"Eye of the Abyss" (Epic Relic)
  Effect: When HP falls below 20%, activate Void Shield (absorbs 2,500 damage)
  Cooldown: Once per battle

"Stormcaller's Heart" (Legendary Relic)
  Effect: Storm-element skills chain to an adjacent enemy for 30% damage
  Passive: +15% Storm damage permanently

"The Undying Ember" (Mythic Relic)
  Effect: Once per battle, survive a lethal hit with 1 HP and gain Regeneration (800/turn, 3 turns)
  Passive: Burn duration you apply +1 turn
```

**Relic Locking:** Only one Relic slot. Relics are Soulbound on equip.

---

## 10.6 Artifacts

Artifacts are unique magical constructs with **active abilities** — they can be triggered in battle as a "free action" (does not consume a turn or Energy).

```
ARTIFACT EXAMPLES:

"Resonance Crystal" (Rare Artifact)
  Active: Charge 25 Ultimate Gauge immediately (1-battle cooldown)

"Nullfield Prism" (Epic Artifact)
  Active: Cleanse one status effect from yourself instantly (once per battle)

"Epoch Shard" (Legendary Artifact)
  Active: Rewind one turn — return to your HP and status at the start of this turn
  Limits: Cannot rewind from defeat; once per battle
```

---

## 10.7 Aura Cores

Aura Cores provide **aura-type bonuses** — percentage-based improvements that interact with the Transformation system.

```
AURA CORE TYPES:

Crimson Aura Core:    +5% Attack | +3% Critical Chance
Azure Aura Core:      +5% Defense | +10% HP
Emerald Aura Core:    +5% Speed | +5% Evasion
Golden Aura Core:     +5% Luck | +3% Critical Damage
Obsidian Aura Core:   +5% all stats (half value of individual cores)
Celestial Aura Core:  +8% all stats + passive Ultimate Gauge charge (+2/turn) [Celestial rarity]
```

---

## 10.8 Equipment Upgrade System

```
UPGRADE STRUCTURE:
  Each equipment piece can be upgraded from +0 to +15
  Each upgrade increases all stats by a percentage:

  +1 to +5:   +8% stats per level; Success rate: 95%
  +6 to +10:  +10% stats per level; Success rate: 75%; Failure: reverts to +5
  +11 to +14: +15% stats per level; Success rate: 45%; Failure: degrades by 1 level
  +15:        Maximum upgrade. "ASCENDED" tag applied to item name.

UPGRADE COST (Gold + Materials):
  +1 to +5:   Iron Ore × (level) + Gold × (level × 200)
  +6 to +10:  Steel Fragment × (level-5) + Gold × (level × 800)
  +11 to +14: Mythrite Shard × (level-10) + Gold × (level × 3,000)
  +15:        Void Crystal × 3 + Celestium Core × 1 + Gold × 50,000

SAFETY NET:
  "Preservation Stone" item: Prevents degradation on failure (does not guarantee success)
  Obtained from: Weekly quest reward, Raid drops
```

---

## 10.9 Enchantment System

Enchantments add **secondary effects** beyond stat increases. Applied after upgrading.

```
ENCHANTMENT TIERS:
  Tier 1 (Uncommon): Minor stat bonus (e.g., +50 flat HP)
  Tier 2 (Rare):     Conditional effect (e.g., "On kill: +10% speed for 2 turns")
  Tier 3 (Epic):     Powerful passive (e.g., "Block chance +8%")
  Tier 4 (Legendary): Unique effect (e.g., "Attacks have 12% chance to apply any status effect")

ENCHANTMENT PROCESS:
  1. Acquire Enchantment Scroll (Tier matched to target)
  2. Apply via /enchant [item_slot] [scroll]
  3. Enchantment replaces existing enchantment (cannot have 2)
  4. Failed enchant (if applicable): scroll consumed, item unchanged

ENCHANTMENT SOURCES:
  Tier 1: Dungeon drops, Shop purchase
  Tier 2: Hard/Elite dungeon drops, Crafting
  Tier 3: Raid drops, Tournament prizes
  Tier 4: World Boss exclusive, Legendary dungeon guaranteed
```

---

## 10.10 Set Bonuses

Equipping multiple pieces from the same **Set** grants compounding bonuses.

```
SET BONUS EXAMPLES:

"Iron Sentinel Set" (Full Heavy Armor):
  2 Pieces: +10% Defense
  4 Pieces: +15% Defense + Block chance 10% passive
  Full Set: +20% Defense + "Stone Wall" passive (when HP <30%, gain Shield 5,000)

"Phantom's Edge Set" (Light Armor + Dual Blades):
  2 Pieces: +8% Speed + +5% Evasion
  3 Pieces: +12% Critical Chance
  Full Set: +20% Critical Damage + "Ghost Step" passive (first attack each battle cannot miss)

"Storm Invoker Set" (Staff + Tome):
  2 Pieces: +10% Storm damage
  Full Set: "Chain Lightning" passive — Storm skills arc to 1 additional target for 25% damage
```

---

# 11. INVENTORY SYSTEM

## 11.1 Inventory Overview

The inventory system manages all items not currently equipped. Items are stored per-character in the database.

```
INVENTORY STRUCTURE:
  Equipment Section: Unequipped weapons, armor, relics, artifacts, aura cores
  Consumables Section: Potions, scrolls, keys, food items
  Materials Section: Crafting materials (stackable)
  Quest Items Section: Quest-related items (separate, cannot be discarded)
  Special Items Section: Event items, tokens (cannot be discarded)
```

---

## 11.2 Storage Limits

```
FREE TIER:
  Equipment: 30 slots
  Consumables: 20 slots
  Materials: 50 slots (materials stack by type, so 50 = 50 distinct material types)

EXPANDED TIER (Stardust purchase):
  Equipment: 60 slots (+30)
  Consumables: 50 slots (+30)
  Materials: 100 slots (+50)

MAX TIER (Stardust purchase):
  Equipment: 120 slots
  Consumables: 100 slots
  Materials: 200 slots

OVERFLOW: If inventory is full, new items are queued in "Overflow Inbox" for 72 hours.
          After 72 hours, unclaimed items are sold automatically at 50% market value.
```

---

## 11.3 Stack Sizes

| Item Type | Max Stack Size |
|---|---|
| Iron Ore | 999 |
| Steel Fragment | 999 |
| Mythrite Shard | 200 |
| Void Crystal | 50 |
| Celestium Core | 10 |
| Health Potion (Common) | 99 |
| Health Potion (Rare) | 50 |
| Dungeon Key | 5 |
| Enchantment Scroll | 10 per tier |
| Preservation Stone | 20 |

---

## 11.4 Inventory Management Features

```
SORTING OPTIONS (via /inventory sort):
  - By Rarity (Legendary → Common)
  - By Type (Equipment, Consumables, Materials)
  - By Level Requirement (high to low)
  - By Recent Acquisition (newest first)

FILTERING:
  /inventory filter rarity:epic      → shows only Epic items
  /inventory filter type:weapon      → shows only weapons
  /inventory filter level:50+        → shows items requiring Level 50+
  /inventory filter equipped:no      → shows only unequipped items

FAVORITES:
  /inventory favorite [item_id]      → marks item with ⭐ flag
  ⭐ favorited items appear at top of inventory sort
  ⭐ favorited items cannot be sold in bulk operations

ITEM LOCKING:
  /inventory lock [item_id]          → marks item with 🔒
  🔒 locked items CANNOT be:
    - Sold individually or in bulk
    - Used as upgrade fodder
    - Discarded
  Unlock requires explicit confirmation command with item ID

QUICK SELL:
  /inventory sell-junk               → sells all Common items not favorited or locked
  /inventory sell-rarity [common|uncommon|rare]  → sell by rarity threshold
  Confirmation required before any bulk sell operation
```

---

# 12. SKILL SYSTEM

## 12.1 Skill System Overview

Each character class has access to a **Skill Tree** with 40+ skills across 6 categories. Players unlock skills by spending **Skill Points** gained through leveling.

```
SKILL POINT DISTRIBUTION:
  Per level: +1 Skill Point
  Level milestone bonus: +3 Skill Points at levels 10, 25, 50, 75, 100
  Prestige bonus: +10 Skill Points at each prestige
  Total at Level 100 (Prestige 0): 118 Skill Points
  Total at Level 100 (Prestige 10): 218 Skill Points

SKILL SLOTS (Battle):
  Active Slots: 4 (player chooses which 4 active skills to equip)
  Passive Slots: 4 (player chooses which 4 passive skills to equip)
  Ultimate Slot: 1 (only one Ultimate active at a time)
  Counter Slot: 1 (only one Counter active at a time)
```

---

## 12.2 Active Skills

**Definition:** Skills the player manually activates during battle. Cost Energy.

```
ACTIVE SKILL TEMPLATE:

Name: [Skill Name]
Class: [Which class(es) can learn this]
Element: [Elemental type]
Energy Cost: [X Energy]
Cooldown: [N turns]
Damage: [X% of Attack]
Effect: [Secondary effect if any]
Unlock Requirement: [Level X or prerequisite skill]
```

### Sample Active Skills by Class

**Vanguard:**
| Skill | Energy | Cooldown | Damage | Effect |
|---|---|---|---|---|
| Shield Slam | 20 | 0 | 90% ATK | 20% chance: Stun 1 turn |
| Iron Fortress | 35 | 3 | — | Block: -65% damage for 1 turn; Counter-ready |
| Warlord's Might | 60 | 4 | 180% ATK | If Shield equipped: +40% damage |
| Rally | 40 | 5 | — | Heal 15% max HP; remove 1 debuff |
| Earthquake Stomp | 80 | 5 | 220% ATK | Terra element; applies Slow (2 turns) |

**Invoker:**
| Skill | Energy | Cooldown | Damage | Effect |
|---|---|---|---|---|
| Arcane Bolt | 15 | 0 | 100% Magic | — |
| Soul Drain | 35 | 3 | 80% Magic | Drains 30 Energy from target |
| Cascade | 60 | 4 | 150% Magic | Hits 2 times (75% each); 2nd hit stuns if 1st crits |
| Void Rupture | 80 | 5 | 200% Magic | Void element; applies Weakness (3 turns) |
| Time Freeze | 90 | 6 | — | Applies Freeze (2 turns); self +30% next attack |

---

## 12.3 Passive Skills

**Definition:** Always-active bonuses. Do not require activation. Do not cost Energy.

```
PASSIVE SKILL EXAMPLES:

"Battle Hardening" (Vanguard, Level 5)
  Effect: Each time you take damage, gain +50 Defense (max: +500; resets at battle end)

"Predator's Mark" (Phantom, Level 15)
  Effect: After any dodge, your next attack has +25% Critical Chance

"Mana Surge" (Invoker, Level 25)
  Effect: When your Energy is above 80%, all skill damage +10%

"Iron Will" (Berserker, Level 30)
  Effect: HP cannot be reduced below 1 HP from a single hit (once per battle)

"Wind Reading" (Wanderer, Level 20)
  Effect: Evasion +12%; when you dodge, gain +2 Ultimate Gauge

"Sacred Ground" (Sentinel, Level 35)
  Effect: At the start of each turn, heal 1.5% of max HP if above 50% HP
```

---

## 12.4 Ultimate Skills

**Definition:** The most powerful skills. Require a full Ultimate Gauge (100) to activate. Cannot be dodged.

```
ULTIMATE SKILL EXAMPLES:

VANGUARD: "Indestructible Charge"
  Gauge Cost: 100
  Energy Cost: 120
  Cooldown: 5 turns
  Effect: Charge forward dealing 350% ATK (Iron element). Gain Shield (HP × 0.3) for 3 turns.
  Cinematic: Full charge sequence with earth-shattering impact visual

INVOKER: "Singularity Collapse"
  Gauge Cost: 100
  Energy Cost: 140
  Cooldown: 5 turns
  Effect: Create a Void singularity dealing 400% Magic damage. Applies Curse (3 turns).
          All your skill cooldowns reduced by 2.
  Cinematic: Reality-warping implosion visual

PHANTOM: "Shadow Execution"
  Gauge Cost: 100
  Energy Cost: 110
  Cooldown: 5 turns
  Effect: Teleport behind target; deliver 3 rapid strikes (120% ATK each).
          If target is below 30% HP: Instant kill bypassing HP check.
  Cinematic: Blink + triple slash sequence

BERSERKER: "Ragnarok Surge"
  Gauge Cost: 100
  Energy Cost: 130
  Cooldown: 5 turns
  Effect: Enter Berserker Rage for 3 turns: +40% ATK, +30% Critical Chance, lose 5% HP per turn.
          First strike: 300% ATK, guaranteed crit.
  Cinematic: Explosion of red energy, enemy flying back

SENTINEL: "Divine Restoration"
  Gauge Cost: 100
  Energy Cost: 100
  Cooldown: 5 turns
  Effect: Heal to full HP. Remove ALL debuffs. Shield (50% max HP) for 2 turns. Regeneration (×3 stack).
  Cinematic: Golden light eruption, character briefly glows with divine energy

WANDERER: "Thousand Steps"
  Gauge Cost: 100
  Energy Cost: 120
  Cooldown: 5 turns
  Effect: Attack 5 times in rapid succession (80% ATK each). Each hit has +20% crit chance.
          After all hits: Gain Evasion +30% for 3 turns.
  Cinematic: Whirlwind attack sequence with speed-blur trail
```

---

## 12.5 Support Skills

**Definition:** Non-offensive skills that buff allies or debuff enemies. Used in multiplayer Raid contexts.

```
SUPPORT SKILL EXAMPLES:

"Battle Cry" (Vanguard — Party support)
  Effect: All party members +15% ATK for 3 turns

"Mystic Ward" (Invoker — Party support)
  Effect: All party members gain elemental resistance +30% for 2 turns

"Guardian Aura" (Sentinel — Continuous support)
  Effect: Passive — adjacent party members take 10% less damage; rerouted to Sentinel

"Rally the Fallen" (Sentinel — Emergency support)
  Effect: Revive one defeated party member at 30% HP (Raid battles only)
          Cooldown: Once per Raid; Costs 80 Energy
```

---

## 12.6 Counter Skills

**Definition:** Reactive skills that trigger on specific conditions (being hit, dodging, etc.)

```
COUNTER SKILL EXAMPLES:

"Retribution" (Vanguard)
  Trigger: Upon taking physical damage
  Effect: Deal 70% ATK counter damage; no Energy cost; cannot be dodged
  Cooldown: 2 turns after triggering

"Shadow Riposte" (Phantom)
  Trigger: Upon successfully dodging an attack
  Effect: Instantly attack for 120% ATK; guaranteed crit
  Cooldown: 3 turns

"Arcane Reflection" (Invoker)
  Trigger: Upon taking magic/elemental damage
  Effect: Reflect 40% of received damage back to attacker
  Cooldown: 3 turns

"Venom Reply" (Wanderer)
  Trigger: Upon being hit by melee attack
  Effect: Apply Poison to attacker (40% chance; Luck-modified)
  Cooldown: 2 turns
```

---

## 12.7 Transformation Skills

**Definition:** Skills that interact with or enhance the Transformation system. Unlocked during transformation progression.

```
TRANSFORMATION SKILL EXAMPLES:

"Resonance Awakening" (All classes — unlocks Transformation Stage 1)
  Requirement: 50 Resonance Points; Level 30
  Effect: Activate Transformation Stage 1 for 10 turns; +20% all stats
  Cooldown: 20 turns; Once per battle maximum

"Ascension Drive" (Unlocks at Mastery Tier 2)
  Effect: While Transformed, all active skill costs -25% Energy
  Type: Passive (active only while transformed)

"Aura Blast" (Unique to Transformation Stage 3)
  Effect: Releases an aura explosion dealing 250% ATK (element matches transformation element)
  Energy: 100 | Cooldown: 4 turns | Available only in transformed state
```

---

# 13. TRANSFORMATION SYSTEM

## 13.1 System Overview — The Resonance Ascension Framework

The **Resonance Ascension Framework (RAF)** is Ascension Legends' original transformation system. It is built on the concept of a player's inner energy — called **Resonance** — building to a breaking point where the character transcends their normal form, unlocking new power states, visual signatures, and abilities.

**Design Mandate:** This system references NO existing intellectual property. All terminology, visual descriptions, stage names, and ability names are original to Ascension Legends.

---

## 13.2 Resonance Points

The resource that powers all transformations.

```
RESONANCE POINTS (RP):
  Maximum: 1,000 RP
  Starting: 0 RP per battle

RESONANCE GAIN SOURCES:
  Per battle victory: +20 RP
  Critical hit landed: +5 RP
  HP falls below 25%: +30 RP (near-death surge)
  Status effect resisted: +10 RP
  Combo ×5: +15 RP
  Daily quest completion: +50 RP
  Dungeon boss defeated: +100 RP
  PvP victory: +50 RP

RESONANCE DECAY:
  Resonance decays at -10 RP per hour offline (min: 0)
  Active play does not decay
  Transformation use: Consumes 300 RP (Stage 1), 600 RP (Stage 2), etc.
```

---

## 13.3 Transformation Stages

```
STAGE OVERVIEW:

STAGE 0: Dormant
  State: No transformation active; normal character appearance
  Availability: All characters
  Unlock: Default

STAGE 1: Resonant Form
  State: First awakening; character's energy begins to externalize
  Visual: Soft aura glow matching class element color; eyes change color
  Stat Boost: All stats +20%
  Unlock Requirements: 500 cumulative Resonance Points earned | Level 30
  Duration: 10 turns
  Cooldown: 20 turns
  RP Cost: 300

STAGE 2: Exalted Form
  State: Character's power fully manifests; physical form enhances visibly
  Visual: Aura intensifies; hair/energy rises; particle effects emanate from form
  Stat Boost: All stats +45%; Elemental damage +15%
  New Ability: "Aura Burst" — Deals 250% ATK with element; guaranteed crit
  Unlock Requirements: 2,000 cumulative Resonance Points | Level 60 | Stage 1 Mastery Tier 2
  Duration: 8 turns
  Cooldown: 20 turns
  RP Cost: 600

STAGE 3: Transcendent Form
  State: Character reaches the apex of their class archetype; identity fully realized
  Visual: Aura becomes a full body envelopment; wings/energy constructs may form (class-specific)
  Stat Boost: All stats +80%; Elemental damage +30%; All skills +1 tier effectiveness
  New Ability: "Final Resonance" — 400% ATK; applies ALL elemental effects simultaneously; 4-turn cooldown
  Unique Passive: "Transcendent Resolve" — Cannot be one-shotted in this form; minimum survive at 1 HP once
  Unlock Requirements: 10,000 cumulative Resonance | Level 90 | Stage 2 Mastery Tier 3
  Duration: 6 turns (shorter because power is overwhelming)
  Cooldown: 25 turns
  RP Cost: 900

STAGE 4: Apex Resonance (Ultimate Transformation)
  State: Theoretical maximum — only the most devoted players achieve this
  Visual: Full transformation sequence (5-second cinematic); character becomes infused with pure Resonance energy; unique to each class
  Stat Boost: All stats +150%; Elemental damage +60%; Ultimate Gauge fills 50% faster
  New Ability: "Resonance Ascension" — Deals 600% ATK; ignores all resistances and immunities; 3-hit sequence with unique cinematic per hit
  Unique Passive 1: "Apex Aura" — Enemies in Apex form deal 30% less damage
  Unique Passive 2: "Resonance Overflow" — While in Apex form, each turn restores 50 Energy
  Unlock Requirements: 50,000 cumulative Resonance | Prestige 3 | Level 100 | Stage 3 Mastery Tier 5 | Apex Resonance Crystal (rare drop from Prestige Dungeon)
  Duration: 5 turns (maximum power, minimum duration)
  Cooldown: 30 turns (can only trigger once every 30 turns — roughly once per long battle)
  RP Cost: 1,000 (entire maximum gauge)
```

---

## 13.4 Transformation Mastery

Each transformation stage has a **Mastery Ladder** that progresses as the player uses the transformation.

```
MASTERY TIERS (per Stage):

Tier 1 — Awakened (0–50 uses)
  Unlock: Base stage abilities active
  Bonus: None beyond the base stat boost

Tier 2 — Resonating (51–150 uses)
  Bonus: Stage duration +2 turns; RP cost -50

Tier 3 — Harmonized (151–300 uses)
  Bonus: Stage cooldown -3 turns; New passive skill unlocked (stage-specific)

Tier 4 — Attuned (301–500 uses)
  Bonus: Stat boost +5% beyond base; New active skill unlocked (stage-specific)

Tier 5 — Transcended (501+ uses)
  Bonus: Stage becomes "permanent mode" — stat boost applied as passive (50% of boost) even when not transformed
  Unlock: This stage now transitions more smoothly to the next stage (reduced RP cost to chain)

MASTERY DISPLAY:
  /profile shows Transformation Stage and Mastery Tier for each stage
  Server milestone announcement: "Player [Name] has achieved Stage 3 Mastery Tier 5!"
```

---

## 13.5 Visual Changes by Class

*All visual descriptions below reference original design concepts only.*

| Class | Stage 1 | Stage 2 | Stage 3 | Stage 4 |
|---|---|---|---|---|
| Vanguard | Iron-grey aura, eyes glow silver | Stone-like plating forms on shoulders, deep crimson aura | Full crystalline armor manifests, aura solidifies into visible shield constructs | Colossus form — doubled in apparent size, aura forms an impenetrable spherical barrier |
| Invoker | Blue arcane wisps orbit them | Runes ignite on skin surface, eyes become pure light | Reality warps around them; geometric patterns orbit | Void-space tears open behind them; character stands at the center of a collapsing star |
| Phantom | Dark smoke trails behind every movement | Shadow self appears mirrored; both move in sync | Character flickers between light and shadow mid-movement; eye count doubles | Becomes a dark constellation — outline only, stars where eyes should be, pure void body |
| Berserker | Crimson energy bleeds from fists | Weapon grows with concentrated force; hair levitates | War-scars on body glow red; massive aura constructs form weapons behind them | Primal giant form; aura becomes a conflagration that fills the battle space |
| Wanderer | Leaves and wind spiral naturally around them | Air currents become visible; feet leave circular ripples | Body merges partially with wind — partially translucent | Disappears entirely into wind form; appears only at point of impact as a storm-eye |
| Sentinel | Golden light radiates from chest | Wings of light form behind them (purely energy); | Becomes a pure light avatar; physical form barely visible within | True divine manifestation: massive radiant form; enemies take damage just from proximity |

---

## 13.6 Transformation Cooldown Management

```
COOLDOWN RULES:
  Each transformation stage has its own cooldown, tracked independently
  Cooldown begins when transformation expires (not when it's activated)
  Cooldowns are counted in turns during battle; also apply out-of-battle (in hours: 1 turn = 5 minutes)

COOLDOWN ITEMS:
  "Resonance Catalyst" — Reduces active transformation cooldown by 5 turns (consumable)
  "Resonance Shard" — Reduces all transformation cooldowns by 2 turns each (rare consumable)
  These items drop from Raid content and cannot be purchased from the shop.

CHAIN TRANSFORMATION RULE:
  At Stage 3 Mastery Tier 5: Stage 3 can immediately chain into Stage 4 if Stage 4 is unlocked.
  This means a player can spend 900 RP for Stage 3 → immediately use remaining 100 RP for Stage 4 transition.
  This creates a seamless escalation moment — a storytelling beat in the battle.
```

---

## 13.7 Aura Evolution

**Aura** is the visible energy that surrounds a character outside of battle (shown in profile embeds and cinematic openers). Auras evolve independently of transformation stages but are influenced by them.

```
AURA TIERS:
  Tier 0: None (Level 1–9)
  Tier 1: Faint (Level 10+; color matches class element)
  Tier 2: Active (Level 25+; aura pulses slowly)
  Tier 3: Radiant (Level 50+; aura has distinct particle effects)
  Tier 4: Dominant (Level 75+; aura fills portrait frame)
  Tier 5: Legendary (Prestige 1+; aura has unique animation pattern)
  Tier 6: Transcendent (Stage 3 Mastery Tier 5; aura is class-unique design)
  Tier 7: Apex (Stage 4 Mastery Tier 5; rarest visual in the game)

COSMETIC AURA OVERRIDES (Stardust purchase):
  Players can override their aura color (not tier) using cosmetic aura packs.
  These are purely visual — no gameplay effect.
```

---

# 14. VISUAL SYSTEM

## 14.1 Visual Design Philosophy

Every visual element in Ascension Legends communicates **information and emotion simultaneously**. A player looking at an embed should feel something — excitement, tension, pride — while also getting the data they need.

**Technical Constraint:** Discord embeds are rendered server-side as images. All complex visuals are generated by a canvas rendering engine (using `node-canvas` or `sharp`) and sent as image attachments. Interactive elements (buttons) overlay the image.

---

## 14.2 Player Profile Screen

```
/profile (or /profile @user)

LAYOUT:
┌─────────────────────────────────────────────────┐
│  [SERVER BANNER BAR]  [CLASS ICON]  [RANK ICON] │
│                                                  │
│  [CHARACTER ART - 200×300 region]  [NAME]        │
│                                    [TITLE]        │
│                                    [LEVEL / XP]  │
│                                    [CLASS]        │
│                                    [GUILD]        │
│                                    [PRESTIGE]     │
│                                                  │
│  STATS                                           │
│  HP: ████████████░░  12,450 / 15,000             │
│  EN: █████████░░░░░  780 / 1,000                 │
│  ┌────────────────────────────────────────────┐  │
│  │ ATK: 3,240  |  DEF: 2,100  |  SPD: 1,850  │  │
│  │ ACC: 91%    |  EVA: 22%    |  LCK: 640     │  │
│  │ CRIT: 28%   |  CDMG: 215%  |  PR: 42,880   │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  TRANSFORMATION                                  │
│  Stage: Exalted (Stage 2) | Mastery: Tier 3      │
│  Resonance: 720 / 1,000                          │
│                                                  │
│  AURA: [Aura Tier 4 — Radiant, Flame element]   │
└─────────────────────────────────────────────────┘

COLORS: Dynamic based on class element (Flame = red/orange palette)
FOOTER: "Power Rating: 42,880 | PvP Rank: Gold Tier | Winrate: 64%"
```

---

## 14.3 Inventory Screen

```
/inventory

LAYOUT:
Embed title: "[Character Name]'s Inventory"
Tab buttons: [Equipment] [Consumables] [Materials] [Quest Items]

EQUIPMENT TAB:
┌───────────────────────────────────────────┐
│ EQUIPPED                                  │
│ ⚔️ [Legendary] Voidsteel Greatsword +12   │
│ 🛡️ [Epic] Bulwark of the Ancient +8       │
│ 🪖 [Rare] Iron Sentinel Helm +5           │
│ ...                                       │
│                                           │
│ INVENTORY (28/30 slots)                   │
│ [Item Card] [Item Card] [Item Card] ...   │
│ [Item Card] [Item Card] [Item Card] ...   │
└───────────────────────────────────────────┘

ITEM CARD FORMAT (within inventory grid):
  - Rarity color border
  - Item icon (custom per item type)
  - Item name (abbreviated if long)
  - + Level
  - Lock icon if locked
  - Star icon if favorited
```

---

## 14.4 Battle UI

```
BATTLE EMBED FORMAT:
┌──────────────────────────────────────────────────┐
│  ⚔️ BATTLE — [Player] vs [Enemy/Player]          │
│  ────────────────────────────────────────────    │
│  [PLAYER CHARACTER ART]      [ENEMY ART]         │
│                                                  │
│  [Name] Lv.72               [Enemy] Lv.68        │
│  HP: ██████████ 14,200/14,200  HP: ███░░░ 3,240/10,000│
│  EN: ████████░░ 800/1000    Charge: ████████░░░  │
│  Effects: 🔥 Burn (2T)      Effects: 💤 Sleep(1T)│
│  ────────────────────────────────────────────    │
│  TURN 7 | COMBO: 🔥×3 | LAST ACTION:            │
│  → [Player] used Arcane Bolt → 2,840 damage!     │
│  → Critical Hit! ⚡ ×2.15                         │
│  → [Enemy] is Sleeping — cannot act              │
│  ────────────────────────────────────────────    │
│  ⚡ ULTIMATE GAUGE: ████████████░░░░ 78/100      │
└──────────────────────────────────────────────────┘

BUTTONS (Discord Component Row 1):
  [⚔️ Attack] [🔥 Skill 1] [❄️ Skill 2] [⚡ Skill 3]
  
BUTTONS (Discord Component Row 2):
  [💫 Skill 4] [🌀 Ultimate] [🧪 Item] [🚪 Flee]
  
Button states:
  - Grayed out if: on cooldown, insufficient energy, silenced, not enough gauge
  - Glowing if: ultimate ready (pulsing gold border)
```

---

## 14.5 Guild UI

```
/guild info [guild_name]

GUILD PROFILE CARD:
┌──────────────────────────────────────────────────┐
│  🏛️ [Guild Banner Image]                         │
│  Guild Name: THE IRON CITADEL                    │
│  Tag: [IRON] | Level: 22 | Rank: #4 (Regional)  │
│  Members: 48/50 | Prestige Score: 142,000        │
│  ────────────────────────────────────────────    │
│  DESCRIPTION: "We stand unbroken."               │
│  ────────────────────────────────────────────    │
│  TOP MEMBERS:                                    │
│  1. IronQueen         PR: 284,000  🏆             │
│  2. StormHammer       PR: 241,000                │
│  3. VoidBreaker       PR: 218,000                │
│  ────────────────────────────────────────────    │
│  WAR STATUS: ⚔️ At War with [SHADOW COVENANT]    │
│  Score: 142 — 89 (Winning)                       │
│  Time remaining: 38 hours                        │
│  ────────────────────────────────────────────    │
│  GUILD TREASURY: 2,400,000 Gold | 18,000 Guild Coins│
│  HQ Level: 8/10 | Guild Skills Unlocked: 12/20   │
└──────────────────────────────────────────────────┘
```

---

## 14.6 Shop Screen

```
/shop

SHOP EMBED (Rotating daily):
┌──────────────────────────────────────────────────┐
│  🛒 ASCENSION LEGENDS SHOP                       │
│  🔄 Resets in: 14h 22m                           │
│  ────────────────────────────────────────────    │
│  FEATURED (3 items, change daily):               │
│  [Epic Enchantment Scroll] ←→ 500 Crystals       │
│  [Void Crystal ×5]         ←→ 800 Crystals       │
│  [Rare Equipment Box]      ←→ 1,200 Gold         │
│  ────────────────────────────────────────────    │
│  STANDARD (permanent):                           │
│  [Health Potion] 50 Gold | [Energy Refill] 30 Gold│
│  [Dungeon Key ×1] 200 Crystals                   │
│  [Preservation Stone] 150 Crystals               │
│  ────────────────────────────────────────────    │
│  GUILD STORE (Guild members only):               │
│  [Guild Cosmetic Banner Pack] 2,000 Guild Coins  │
│  [Equipment Mod Scroll] 500 Guild Coins          │
└──────────────────────────────────────────────────┘

BUTTONS: [Buy Featured 1] [Buy Featured 2] [Browse Standard] [Guild Store]
```

---

## 14.7 Quest Screen

```
/quests

DAILY QUESTS EMBED:
┌──────────────────────────────────────────────────┐
│  📋 DAILY QUESTS — Resets in: 8h 14m             │
│  ────────────────────────────────────────────    │
│  ✅ [COMPLETE] Battle 5 enemies — 200 XP, 100 Gold│
│  🔲 [2/3] Clear a dungeon 3 times — 500 XP, 300 Gold│
│  🔲 [0/1] Defeat an Arena opponent — 100 Arena Tokens│
│  🔲 [0/5] Apply a status effect 5 times — 150 Gold│
│  🔲 [0/1] Use your Ultimate skill — 200 XP       │
│  ────────────────────────────────────────────    │
│  WEEKLY QUEST:                                   │
│  🔲 [0/1] Participate in Guild War — 1,000 Guild Coins│
│  ────────────────────────────────────────────    │
│  ACHIEVEMENT PROGRESS:                           │
│  "True Warrior" — Win 500 battles: [412/500]     │
│  "Combo Legend" — Reach ×10 combo: [8/10 max]   │
└──────────────────────────────────────────────────┘
```

---

## 14.8 Equipment Screen

```
/equipment

EQUIPMENT DETAIL EMBED:
┌──────────────────────────────────────────────────┐
│  ⚔️ EQUIPMENT — [Character Name]                 │
│  ────────────────────────────────────────────    │
│  [Equipment Silhouette — 9 slots shown]          │
│  ────────────────────────────────────────────    │
│  WEAPON: [Legendary] Voidsteel Greatsword +12    │
│  ATK: +2,840 | SPD: -120 | Element: Void         │
│  Enchant: On-kill: +10% Speed (2 turns)          │
│                                                  │
│  ARMOR (Body): [Epic] Shadow Sentinel Mail +8    │
│  DEF: +1,200 | HP: +4,000 | Evasion: +8%        │
│  Enchant: Incoming crits reduced by 15%          │
│                                                  │
│  ARTIFACT: [Rare] Nullfield Prism                │
│  Active: Cleanse 1 status effect (1/battle)      │
│  ────────────────────────────────────────────    │
│  SET BONUS: Iron Sentinel (3/4 pieces)           │
│  Active: DEF +10%, +15% DEF (unlocked)           │
│  Next: 4/4 — Block chance passive (locked)       │
│  ────────────────────────────────────────────    │
│  TOTAL POWER SCORE: 42,880                       │
└──────────────────────────────────────────────────┘
```

---

## 14.9 Leaderboard Screen

```
/leaderboard [type: power|arena|guild|prestige]

LEADERBOARD EMBED:
┌──────────────────────────────────────────────────┐
│  🏆 GLOBAL POWER RANKING                         │
│  Updated: 5 minutes ago                          │
│  ────────────────────────────────────────────    │
│  1. 🌈 CelestialBlade     PR: 891,240  [Legend]  │
│  2. 🌈 VoidArchmage        PR: 874,000  [Legend] │
│  3. 🟡 IronEmperor         PR: 812,000  [Ascendant]│
│  4. 🟡 StormGrandmaster    PR: 788,000  [Ascendant]│
│  5. 🟡 PhantomQueen        PR: 755,000  [Ascendant]│
│  ...                                             │
│  ────────────────────────────────────────────    │
│  YOUR RANK: #3,241 | PR: 42,880 | [Gold Tier]   │
│  Server Rank: #8 | Guild Rank: #2                │
└──────────────────────────────────────────────────┘

BUTTONS: [Global] [Server] [Guild] [Friends]
```

---

## 14.10 Reward Screen

```
BATTLE VICTORY REWARD EMBED:

┌──────────────────────────────────────────────────┐
│  ✨ VICTORY!                                     │
│  [Victory Cinematic Frame — Character Pose]      │
│  ────────────────────────────────────────────    │
│  REWARDS:                                        │
│  ⚙️ Gold: +340 Gold                             │
│  ⭐ XP: +280 XP → Level Progress: 72.4%          │
│  [ITEM DROP] 🔵 Rare Equipment: Iron Sentinel Helm│
│  ────────────────────────────────────────────    │
│  BATTLE STATS:                                   │
│  Damage Dealt: 28,450 | Damage Taken: 12,300     │
│  Combos: ×6 max | Skills Used: 8 | Turns: 12     │
│  Crits: 4 / 8 attacks (50%)                      │
│  ────────────────────────────────────────────    │
│  💤 [XP] ██████████████████░░░░ 72% to Level 73  │
└──────────────────────────────────────────────────┘
```

---

# 15. CINEMATIC BATTLE SYSTEM

## 15.1 System Overview

The Cinematic Battle System (CBS) generates **animated image sequences** that play at key moments in every battle. These are not pre-made videos — they are **dynamically rendered** per-battle using a server-side canvas engine.

```
TECHNICAL STACK:
  Renderer: node-canvas (Node.js canvas API)
  Format: Animated GIF or APNG (per Discord embed compatibility)
  Frame Rate: 15 fps (balance of visual quality and file size)
  Duration: 3–8 seconds depending on event type
  Delivery: Sent as embed image attachment
  Generation Time Target: < 2 seconds (must not delay battle response)
```

---

## 15.2 Cinematic Trigger Points

| Trigger | Duration | Description |
|---|---|---|
| Battle Start | 3 seconds | Characters appear; auras ignite; pre-battle stare-down |
| Ultimate Activation | 5–7 seconds | Full Ultimate cinematic sequence per skill |
| Transformation Trigger | 5–8 seconds | Transformation stage sequence |
| Critical Hit Landing | 2 seconds | Impact flash, damage number explodes |
| Status Effect Application | 1.5 seconds | Effect manifests visually on target |
| Boss Phase Transition | 4 seconds | Boss transforms, new phase begins |
| Victory | 3 seconds | Winner poses; aura fills frame |
| Defeat | 2 seconds | Defeated character falls; scene fades |
| World Boss Kill | 8 seconds | Boss destruction sequence; server-wide clip |

---

## 15.3 Scene Transition Design

```
SCENE TRANSITIONS:

BATTLE START SEQUENCE:
  Frame 0:    Black screen
  Frame 1–5:  Arena background materializes (dungeon, arena, overworld — context-specific)
  Frame 6–10: Player character slides in from left with speed line effects
  Frame 11–15: Enemy character slides in from right
  Frame 16–22: Both characters take combat stances; auras activate
  Frame 23–27: Zoom in on player character's eyes — aura intensifies
  Frame 28–32: Camera pulls back to battle-ready wide shot
  Frame 33–45: "BATTLE START" text appears with particle burst

TRANSITION TYPES:
  Cut (frame cut): Instant scene change — used for quick hits
  Blur-Wipe: Speed-blur sweep across frame — used for fast movement
  Flash-Cut: White flash between frames — used for impact moments
  Fade: Classic dissolve — used for defeat, stage transitions
  Zoom-Burst: Camera rushes toward subject — used for dramatic reveals
```

---

## 15.4 Camera Movements

```
CAMERA MOVEMENT LIBRARY:

TRACK-IN: Camera slowly moves toward subject → builds tension (battle start, boss reveal)
TRACK-OUT: Camera pulls back → shows scale (transformation reveal, world boss)
PAN-LEFT/RIGHT: Camera sweeps horizontally → follows movement, attack trajectory
DUTCH ANGLE: Tilted frame → instability, chaos (enemy enrage)
SNAP-TO: Instant cut to new angle → impact punctuation
SHATTER-SHAKE: Rapid micro-movements → impact landed, screen shakes
ZOOM-CRASH: Extremely fast zoom in → Ultimate skill activation moment

STANDARD BATTLE CAMERA:
  Default position: Wide shot, both characters in frame
  Attack: Camera tracks attacker → impact → tracks to receiver
  Hit: Camera shakes (0.5 second) on receiver's side
  Critical: Camera zoom crash + shake
```

---

## 15.5 Character Animation Layers

Each character in the cinematic system is composed of layered sprite assets rendered in real-time:

```
CHARACTER ANIMATION LAYERS (render order, bottom to top):
  Layer 1 (Base): Character art body (base idle pose)
  Layer 2 (Aura): Aura effect beneath character
  Layer 3 (Weapon): Weapon in hand (varies by class)
  Layer 4 (Status): Status effect visual overlays
  Layer 5 (Transformation): Transformation effects (glow, particles)
  Layer 6 (Attack FX): Attack motion blur / speed lines
  Layer 7 (Impact FX): Hit effects at point of contact
  Layer 8 (Damage Number): Floating damage number (animated position)
  Layer 9 (UI):  HP bar overlay, status icons

ANIMATION STATES:
  idle        → breathing cycle (chest slight rise/fall, 30-frame loop)
  attack      → reach forward, strike, return
  hit         → recoil animation (lean back, slight knockback)
  dodge       → step-aside or blur-dash depending on class
  critical    → slower, emphasis frames on impact
  ultimate    → full-frame animation, unique per class
  transform   → stage-specific transformation sequence
  victory     → class-specific victory pose (5 frames held)
  defeat      → fall animation, fade to translucent
```

---

## 15.6 Attack Effects by Element

| Element | Projectile Visual | Impact Visual | Screen Effect |
|---|---|---|---|
| Flame 🔥 | Fire spiral, ember trail | Explosion burst, fire ring | Screen tint orange on crit |
| Frost ❄️ | Ice shard formation | Crystal shatter effect | Blue frost overlay |
| Storm ⚡ | Lightning arc | Electrical spark explosion | White flash |
| Terra 🌿 | Rock spike protrusion | Stone crash | Ground shake |
| Void 🌑 | Dark energy tendril | Reality distortion ring | Screen invert briefly |
| Radiance ✨ | Light beam | Divine burst | White gold bloom |
| Iron ⚙️ | Motion blur | Impact dust cloud | Standard shake |

---

## 15.7 Damage Indicator System

```
DAMAGE NUMBER DESIGN:
  Standard hit: White number, rises and fades over 0.8 seconds
  Critical hit: Gold number, 2× size, explosive entry animation, slower fade
  Miss: Grey "MISS" text, wavy motion, quick fade
  Status damage (DoT): Color-coded per effect, smaller number, offset left
  Heal: Green number with + prefix, rises faster

DAMAGE NUMBER POSITIONS:
  Physical damage: Rises from center-chest of target
  Status damage: Rises from head of target (stacked if multiple)
  Healing: Rises from feet of target (different column)

OVERKILL EFFECT:
  If damage exceeds remaining HP by more than 2×: "OBLITERATED" text instead of number
  If damage exceeds remaining HP by more than 5×: "DEVASTATED" + extra particle effect
```

---

## 15.8 Victory and Defeat Animations

### Victory
```
VICTORY SEQUENCE (3 seconds):
  Frame 0–10:  Winning character straightens from battle stance
  Frame 11–20: Camera tracks upward as aura expands
  Frame 21–30: Victory pose held — class-specific:
                Vanguard: Plant weapon in ground, stand tall
                Invoker: Energy coalesces around hands, float briefly
                Phantom: Sheath weapon, turn away coolly
                Berserker: Roar, flex, aura explodes
                Wanderer: Leap and land lightly
                Sentinel: Bow, wings fold inward
  Frame 31–45: "VICTORY" text materializes with particle burst
  Frame 46–50: Reward panel appears below animation

DEFEAT SEQUENCE (2 seconds):
  Frame 0–8:   Defeated character staggers
  Frame 9–20:  Character falls to one knee
  Frame 21–30: Fade to translucent; aura extinguishes
  Frame 31–35: "DEFEATED" text appears (red, with crack effect)
```

---

# 16. DISCORD COMMANDS REFERENCE

## 16.1 Command Design Principles

- All commands use Discord's **slash command** system (`/command`)
- Command names are lowercase, hyphen-separated
- All responses include **ephemeral options** where appropriate (private responses)
- Commands that initiate battles lock the user into an interaction session
- Admin commands require specific roles

---

## 16.2 Player Commands

### Character & Profile

| Command | Parameters | Description |
|---|---|---|
| `/start` | — | Create character, begin onboarding |
| `/profile` | `[user]` | View your or another user's profile |
| `/stats` | `[user]` | Detailed stat breakdown |
| `/title set` | `title` | Set active title from earned titles |
| `/titles` | — | List all earned titles |
| `/class info` | `[class]` | View class details and skill tree |
| `/rename` | `new_name` | Rename character (costs 500 Gold) |
| `/prestige` | — | Trigger Prestige/Rebirth at Level 100 |
| `/delete` | — | Delete character (requires confirmation) |

### Battle & Combat

| Command | Parameters | Description |
|---|---|---|
| `/battle` | `[target]` | Initiate a PvE battle at your location |
| `/arena` | `[casual\|ranked]` | Enter PvP Arena |
| `/challenge` | `@user` | Challenge specific player to PvP duel |
| `/dungeon enter` | `dungeon_name, [difficulty]` | Enter a dungeon |
| `/dungeon list` | — | List available dungeons |
| `/raid join` | `raid_id` | Join an active raid party |
| `/raid create` | `raid_name` | Create a new raid lobby |
| `/raid leave` | — | Leave current raid party |
| `/worldboss attack` | — | Participate in current World Boss |
| `/worldboss status` | — | View World Boss HP and event status |
| `/tower enter` | — | Enter the Challenge Tower |
| `/tower status` | — | View current tower floor and progress |
| `/flee` | — | Attempt to flee current battle |

### Skills & Progression

| Command | Parameters | Description |
|---|---|---|
| `/skills` | — | View skill tree |
| `/skills equip` | `skill_name, slot` | Equip a skill to a slot |
| `/skills unequip` | `slot` | Remove skill from slot |
| `/skills level` | `skill_name` | Upgrade a skill (Skill Points) |
| `/skills reset` | — | Reset all skill points (costs Crystals) |
| `/transform` | `[stage]` | Activate transformation (if conditions met) |
| `/resonance` | — | View Resonance Points and transformation status |

### Equipment & Items

| Command | Parameters | Description |
|---|---|---|
| `/inventory` | `[tab]` | Open inventory |
| `/equip` | `item_id` | Equip an item |
| `/unequip` | `slot` | Unequip an item slot |
| `/equipment` | — | View equipped items |
| `/upgrade` | `slot` | Upgrade equipped item |
| `/enchant` | `slot, scroll_id` | Apply enchantment scroll |
| `/craft` | `recipe_name` | Craft an item |
| `/craft recipes` | — | Browse available crafting recipes |
| `/item info` | `item_id` | Detailed item information |
| `/inventory sell` | `item_id, [quantity]` | Sell item to NPC |
| `/inventory sell-junk` | — | Bulk sell Common items |
| `/inventory sort` | `[method]` | Sort inventory |
| `/inventory filter` | `[criteria]` | Filter inventory |
| `/inventory lock` | `item_id` | Lock item from accidental sale |
| `/inventory favorite` | `item_id` | Favorite an item |

### Economy & Market

| Command | Parameters | Description |
|---|---|---|
| `/balance` | — | View all currency balances |
| `/shop` | `[category]` | Open the shop |
| `/shop buy` | `item_id, [quantity]` | Purchase from shop |
| `/market list` | — | Browse player market |
| `/market post` | `item_id, price` | List item on market |
| `/market remove` | `listing_id` | Remove your market listing |
| `/market buy` | `listing_id` | Purchase from player market |
| `/market history` | — | Your trading history |
| `/daily` | — | Claim daily login reward |
| `/quests` | — | View daily/weekly quests |

### Training & Passive Systems

| Command | Parameters | Description |
|---|---|---|
| `/train` | `stat` | Set active Training Ground focus stat |
| `/train status` | — | Check current training progress |
| `/rest` | — | Recover Stamina faster (reduces activity) |
| `/stamina` | — | View current Stamina |

---

## 16.3 Guild Commands

| Command | Parameters | Description |
|---|---|---|
| `/guild create` | `name, tag, description` | Create a guild |
| `/guild join` | `guild_name` | Join a guild (if open) |
| `/guild apply` | `guild_name` | Apply to a private guild |
| `/guild leave` | — | Leave current guild |
| `/guild info` | `[guild_name]` | View guild information |
| `/guild members` | — | List guild members and roles |
| `/guild invite` | `@user` | Invite user to guild (officers+) |
| `/guild kick` | `@user` | Remove member (officers+) |
| `/guild promote` | `@user, role` | Change member role (leaders+) |
| `/guild settings` | — | Modify guild settings (leaders+) |
| `/guild upgrade` | `building` | Upgrade a Guild HQ building |
| `/guild skills` | — | View guild skill tree |
| `/guild skills unlock` | `skill_name` | Unlock guild skill (leaders+) |
| `/guild treasury` | — | View guild treasury |
| `/guild donate` | `amount, currency` | Donate to guild treasury |
| `/guild war declare` | `target_guild` | Declare war on a guild (leaders+) |
| `/guild war status` | — | View active war status |
| `/guild war history` | — | View past war results |
| `/guild tasks` | — | View current guild tasks |
| `/guild tasks complete` | `task_id` | Mark contribution to task |
| `/guild store` | — | Open guild exclusive store |
| `/guild leaderboard` | — | Guild rankings |
| `/guild log` | — | Recent guild activity log |
| `/guild disband` | — | Disband guild (leaders only, confirmation required) |

---

## 16.4 Economy Commands

| Command | Parameters | Description |
|---|---|---|
| `/exchange` | `from, to, amount` | Exchange between eligible currencies |
| `/auction` | — | Open Auction House |
| `/auction post` | `item_id, start_price, duration` | Post item to auction |
| `/auction bid` | `auction_id, amount` | Place bid |
| `/auction buyout` | `auction_id` | Instant buyout at listed price |
| `/auction watch` | `auction_id` | Add to watchlist |
| `/auction history` | — | Completed auction history |
| `/wallet` | — | Detailed currency view |
| `/tax info` | — | Current market and transaction fees |

---

## 16.5 PvP Commands

| Command | Parameters | Description |
|---|---|---|
| `/arena ranked` | — | Enter ranked matchmaking |
| `/arena casual` | — | Enter casual 1v1 |
| `/arena history` | `[user]` | View match history |
| `/arena stats` | `[user]` | Detailed PvP statistics |
| `/ranking` | `[user]` | View rank and RP |
| `/ranking season` | — | Current season leaderboard |
| `/challenge` | `@user` | Direct challenge |
| `/challenge accept` | `challenge_id` | Accept incoming challenge |
| `/challenge decline` | `challenge_id` | Decline incoming challenge |
| `/tournament info` | — | Current/upcoming tournament |
| `/tournament register` | — | Register for tournament |
| `/tournament bracket` | — | View tournament bracket |
| `/tournament history` | — | Past tournament results |

---

## 16.6 Admin Commands

| Command | Access | Description |
|---|---|---|
| `/admin add-currency` | Superadmin | Add currency to a player account |
| `/admin remove-currency` | Superadmin | Remove currency from player account |
| `/admin ban` | Admin | Ban player from the bot in this server |
| `/admin unban` | Admin | Unban player |
| `/admin reset-player` | Superadmin | Full account reset |
| `/admin set-level` | Superadmin | Set player level |
| `/admin spawn-boss` | Superadmin | Manually trigger World Boss |
| `/admin announce` | Admin | Send server-wide announcement |
| `/admin event start` | Admin | Start a server event |
| `/admin event end` | Admin | End an active event |
| `/admin server-settings` | Admin | Configure server-specific settings |
| `/admin logs` | Admin | View admin action log |
| `/admin economy report` | Admin | View economy health metrics |
| `/admin maintenance` | Superadmin | Enable/disable maintenance mode |

---

## 16.7 Moderation Commands

| Command | Access | Description |
|---|---|---|
| `/mod ban` | Moderator | Ban from bot in this server |
| `/mod mute` | Moderator | Mute player from bot interactions |
| `/mod report` | Any Player | Report another player |
| `/mod report-view` | Moderator | View pending reports |
| `/mod report-resolve` | Moderator | Resolve a report |
| `/mod history` | Moderator | View moderation history |
| `/mod appeal` | Player | Appeal a moderation decision |

---

## 16.8 Event Commands

| Command | Description |
|---|---|
| `/event info` | View current events |
| `/event join` | Participate in active event |
| `/event leaderboard` | Event-specific rankings |
| `/event shop` | Spend event tokens |
| `/event history` | Past event results |
| `/season info` | Current season details |
| `/season rewards` | Preview season reward track |
| `/season rank` | Your rank in current season |

---

# 17. SCALABILITY ARCHITECTURE

## 17.1 Scale Targets

Ascension Legends is architected to support:

```
USER SCALE:
  Launch target: 50,000 active users
  Phase 2 target: 200,000 active users
  Phase 4 target: 500,000+ active users

SERVER SCALE:
  Launch target: 5,000 Discord servers
  Phase 2 target: 20,000 Discord servers
  Phase 4 target: 50,000+ Discord servers

CONCURRENT BATTLE SESSIONS:
  Launch: 500 concurrent battles
  Phase 2: 5,000 concurrent battles
  Phase 4: 50,000 concurrent battles

COMMAND THROUGHPUT:
  Launch: 1,000 commands/minute
  Phase 2: 10,000 commands/minute
  Phase 4: 100,000 commands/minute
```

---

## 17.2 Architecture Overview

```
SYSTEM ARCHITECTURE DIAGRAM:

┌─────────────────────────────────────────────────────────────┐
│                    Discord Gateway Layer                      │
│    (Multiple bot shards — 1 shard per 1,000–2,500 servers)  │
└─────────────────┬──────────────────────────────┬────────────┘
                  │                              │
         ┌────────▼────────┐           ┌─────────▼──────────┐
         │  Gateway Manager │           │   REST API Handler │
         │   (Shard Coordinator)        │   (Command Events) │
         └────────┬────────┘           └─────────┬──────────┘
                  │                              │
         ┌────────▼──────────────────────────────▼────────────┐
         │                 Message Queue (Redis / BullMQ)       │
         │  battle.queue | economy.queue | notification.queue  │
         └─────────┬──────────────────────────────────────────┘
                   │
     ┌─────────────▼──────────────────────────────┐
     │          Worker Pool (Horizontally Scaled)  │
     │   BattleWorker | EconomyWorker | NotifyWorker│
     │   (Each worker independently processes queues)│
     └────────────────────┬────────────────────────┘
                          │
         ┌────────────────▼──────────────────────────────────┐
         │                   Cache Layer (Redis Cluster)        │
         │   player_session | battle_state | market_cache      │
         └────────────────┬──────────────────────────────────┘
                          │
         ┌────────────────▼──────────────────────────────────┐
         │           Database Layer (MongoDB Atlas)            │
         │   Primary (Write) | Read Replicas | Aggregation    │
         └────────────────────────────────────────────────────┘
```

---

## 17.3 Sharding Strategy

Discord bots must be sharded for large scale deployment.

```
SHARDING DESIGN:
  Shard Size: 1,500 guilds per shard (below Discord's 2,500 max for comfort)
  Shard Manager: Custom implementation using discord.js's ShardingManager
  Shard Communication: Redis pub/sub for cross-shard events
    (e.g., global leaderboard update, world boss spawn notification)

SHARD-AWARE COMMANDS:
  Commands that affect only one server: processed by that server's shard
  Commands affecting multiple shards (global leaderboard, cross-server events): 
    → Centralized event processor via message queue
    → Results broadcast back to relevant shards

SHARD FAILURE RECOVERY:
  Shard crash: Automatic restart via PM2 cluster mode
  Shard restart time: < 5 seconds
  In-progress battles during shard crash: State recovered from Redis
    → Battle state written to Redis every turn
    → On shard reconnect, in-progress battles resume from last Redis state
```

---

## 17.4 Redis Caching Strategy

```
CACHE CATEGORIES:

HOT CACHE (TTL: 60 seconds):
  Key: player:{userId}:session
  Value: Full player stat object (for battle use)
  Why: Battle calculations require full stats every turn; DB call per turn is unacceptable

WARM CACHE (TTL: 5 minutes):
  Key: player:{userId}:profile
  Value: Profile data (level, prestige, guild, titles)
  Why: Profile viewed frequently; 5-minute staleness acceptable

BATTLE STATE (TTL: 30 minutes):
  Key: battle:{battleId}:state
  Value: Full battle state (both participants, HP, effects, turn number, seed)
  Why: Battle must survive shard crashes; in-memory only is insufficient

MARKET CACHE (TTL: 2 minutes):
  Key: market:listings:{itemType}
  Value: Active market listings for that item type
  Why: Frequently browsed; 2-minute staleness acceptable

LEADERBOARD CACHE (TTL: 10 minutes):
  Key: leaderboard:{type}:{scope}
  Value: Top 100 entries for that leaderboard
  Why: Real-time leaderboard updates are expensive; 10-minute delay acceptable

GUILD CACHE (TTL: 3 minutes):
  Key: guild:{guildId}:data
  Value: Guild profile, member count, war status
  Why: Frequently viewed; updates not ultra-critical

SHOP CACHE (TTL: Until daily reset):
  Key: shop:daily:{date}
  Value: Today's rotating shop items
  Why: Shop rotates once per day; one DB read per day is ideal
```

---

## 17.5 MongoDB Architecture

```
DATABASE DESIGN:

COLLECTIONS:
  players              — Core player data (stats, currency, level, prestige)
  player_inventory     — Items owned by each player (refs to items collection)
  player_skills        — Skills unlocked and equipped
  player_transformations — Transformation progress and mastery
  items                — Master item catalog (read-heavy, rarely writes)
  battles              — Completed battle records (append-only, archive after 90 days)
  battle_sessions      — Active battle sessions (ephemeral; deleted on completion)
  guilds               — Guild data (members, treasury, HQ, war status)
  guild_wars           — Guild war records
  market_listings      — Active player market listings
  market_history       — Completed market transactions (90-day retention)
  quests               — Active and completed quest tracking
  achievements         — Achievement progress per player
  leaderboards         — Cached leaderboard snapshots (rebuilt via aggregation)
  events               — Active events, participation records
  economy_log          — Economy transaction audit trail (120-day retention)
  audit_log            — Admin/mod action log (indefinite retention)

INDEXING STRATEGY:
  players:
    - Index: { userId: 1 } — unique, primary lookup
    - Index: { guildId: 1 } — guild member queries
    - Index: { "ranking.pvp": -1 } — leaderboard
    - Index: { level: -1, prestige: -1 } — power ranking sort
  
  battles:
    - Index: { battleId: 1 } — unique
    - Index: { participants: 1, createdAt: -1 } — player history
    - Index: { createdAt: 1 } — TTL index for 90-day cleanup
  
  market_listings:
    - Index: { itemType: 1, price: 1 } — browse and sort
    - Index: { sellerId: 1 } — seller's listings
    - Sparse Index: { expiresAt: 1 } — expired listing cleanup

WRITE PATTERNS:
  Battle turn update: Update battle_sessions only (Redis-primary, DB backup)
  Player stat change: Write to players collection; invalidate Redis hot cache
  Economy transaction: Atomic session (using MongoDB transactions for accuracy)
  Market transaction: Two-step atomic (delist from market, add to buyer inventory)

AGGREGATION PIPELINES:
  Economy health dashboard: 30-minute background job; results to leaderboards collection
  Leaderboard rebuild: 10-minute background job; results to leaderboards collection
  Guild war score tally: 5-minute background job during war windows
```

---

## 17.6 Rate Limiting

```
RATE LIMIT DESIGN:

COMMAND RATE LIMITS (per user):
  General commands: 5 per 5 seconds (rolling window)
  Battle commands: 1 per 2 seconds (during battle session)
  Economy commands: 3 per 10 seconds
  Market commands: 2 per 5 seconds
  Admin commands: 10 per 60 seconds

IMPLEMENTATION:
  Rate limiters stored in Redis (sliding window algorithm)
  Key format: ratelimit:{userId}:{commandCategory}
  Exceeded limit: Returns ephemeral error embed with remaining cooldown time
  Repeated violations: Temporary command lockout (5 minutes)

SERVER-LEVEL RATE LIMITS:
  Total command volume per server: 100 commands/minute
  Protects against server-level spam attacks
  Servers exceeding limit: Queued rather than rejected (brief delay, not error)

GLOBAL RATE LIMITS (anti-DDoS):
  IP-level request limits on REST endpoints
  Discord webhook rate limit compliance (built into discord.js)
  Battle session concurrency cap: 50 concurrent per shard
```

---

## 17.7 Background Workers

```
WORKER CATEGORIES:

BATTLE WORKER:
  Processes: Battle turn computation, battle result finalization
  Queue: battle.queue (Redis BullMQ)
  Concurrency: 50 concurrent jobs per worker instance
  Priority: High (low latency required)
  Scale: Horizontal — add more worker instances under load

ECONOMY WORKER:
  Processes: Market transactions, currency transfers, shop resets
  Queue: economy.queue
  Concurrency: 20 concurrent jobs
  Priority: High (transactional integrity required)
  Special: All economy jobs run with MongoDB transaction sessions

NOTIFICATION WORKER:
  Processes: Discord message delivery (challenge notifications, guild alerts, event announcements)
  Queue: notification.queue
  Concurrency: 100 concurrent jobs (I/O bound, not CPU bound)
  Retry: Exponential backoff on Discord API rate limit hits

ANALYTICS WORKER:
  Processes: Economy metrics, leaderboard rebuilds, guild war tallies
  Queue: analytics.queue
  Concurrency: 5 concurrent jobs (CPU intensive)
  Schedule: Cron-driven (not event-driven)

CLEANUP WORKER:
  Processes: Expired market listings, battle session cleanup, log archival
  Queue: cleanup.queue
  Concurrency: 3 concurrent jobs
  Schedule: Every 15 minutes

WORLD BOSS WORKER:
  Processes: Aggregating all player damage contributions to World Boss
  Queue: worldboss.queue
  Special: Fan-out design — writes to each player's damage slot independently, periodic aggregation

CINEMATIC RENDERER:
  Processes: canvas animation rendering for battle cinematics
  Queue: cinematic.queue
  Concurrency: 10 concurrent renders (GPU-accelerated where available)
  Target latency: < 2 seconds per cinematic
```

---

## 17.8 Horizontal Scaling Plan

```
SCALING TRIGGERS:

Scale Up Trigger (add instances):
  CPU > 70% sustained 5 minutes
  Memory > 80%
  Queue depth > 500 jobs (BullMQ)
  Response time P95 > 2 seconds

Scale Down Trigger (remove instances):
  CPU < 20% sustained 15 minutes
  Queue depth < 50 jobs
  Response time P95 < 500ms

STATELESS DESIGN:
  All workers are stateless — no in-memory session state
  All session state stored in Redis
  New worker instances can be added without coordination

CONTAINER ORCHESTRATION:
  Target: Kubernetes (k8s) in production
  Container images: Docker (Node.js 20 Alpine base)
  Auto-scaling: Kubernetes HPA (Horizontal Pod Autoscaler) on queue depth metrics
  
DEPLOYMENT TARGET:
  Cloud: AWS (primary), with GCP fallback
  Region: Multi-region in Phase 3+ (US-East, EU-West, APAC)
  Database: MongoDB Atlas (managed, multi-region in Phase 3)
  Redis: Redis Cloud Enterprise (managed cluster)
```

---

# 18. DEVELOPMENT STANDARDS

## 18.1 Technology Stack

```
CORE RUNTIME:
  Runtime: Node.js 20 LTS
  Language: TypeScript (strict mode; no implicit any)
  Package Manager: pnpm
  Discord Library: discord.js v14 (latest stable)
  
DATABASE:
  Primary: MongoDB with Mongoose (ODM)
  Cache: Redis (ioredis client)
  Queue: BullMQ (Redis-backed)
  
CANVAS/IMAGING:
  Rendering: node-canvas
  Image Processing: sharp (for optimization)
  Animation Output: gifencoder or apngasm (APNG preferred for quality)
  
TESTING:
  Unit: Vitest
  Integration: Supertest (for REST endpoints)
  E2E: Custom Discord interaction simulator
  
INFRASTRUCTURE:
  Containerization: Docker
  Orchestration: Kubernetes (production)
  CI/CD: GitHub Actions
  Monitoring: Prometheus + Grafana
  Logging: Pino (structured JSON) → Loki → Grafana
  Error Tracking: Sentry
```

---

## 18.2 Folder Structure

```
ascension-legends/
├── src/
│   ├── bot/
│   │   ├── client.ts              — Discord client initialization
│   │   ├── shards/
│   │   │   └── manager.ts         — Shard manager
│   │   └── events/                — Discord event handlers
│   │       ├── ready.ts
│   │       ├── interactionCreate.ts
│   │       └── guildCreate.ts
│   │
│   ├── commands/                  — Slash command definitions
│   │   ├── player/
│   │   │   ├── profile.ts
│   │   │   ├── start.ts
│   │   │   ├── inventory.ts
│   │   │   └── ...
│   │   ├── battle/
│   │   │   ├── battle.ts
│   │   │   ├── arena.ts
│   │   │   ├── dungeon.ts
│   │   │   └── ...
│   │   ├── guild/
│   │   │   ├── create.ts
│   │   │   ├── war.ts
│   │   │   └── ...
│   │   ├── economy/
│   │   │   ├── shop.ts
│   │   │   ├── market.ts
│   │   │   └── ...
│   │   └── admin/
│   │       └── ...
│   │
│   ├── engine/                    — Core game engine
│   │   ├── battle/
│   │   │   ├── BattleEngine.ts    — Core battle logic
│   │   │   ├── TurnProcessor.ts
│   │   │   ├── DamageCalculator.ts
│   │   │   ├── StatusEffectManager.ts
│   │   │   ├── AIBehavior.ts
│   │   │   └── CinematicEngine.ts
│   │   ├── economy/
│   │   │   ├── EconomyEngine.ts
│   │   │   ├── MarketEngine.ts
│   │   │   └── TransactionManager.ts
│   │   ├── progression/
│   │   │   ├── LevelingEngine.ts
│   │   │   ├── PrestigeEngine.ts
│   │   │   └── TransformationEngine.ts
│   │   └── guild/
│   │       ├── GuildEngine.ts
│   │       └── GuildWarEngine.ts
│   │
│   ├── models/                    — MongoDB Mongoose schemas
│   │   ├── Player.ts
│   │   ├── Guild.ts
│   │   ├── Battle.ts
│   │   ├── Item.ts
│   │   ├── MarketListing.ts
│   │   └── ...
│   │
│   ├── services/                  — Business logic services (DI-injectable)
│   │   ├── PlayerService.ts
│   │   ├── BattleService.ts
│   │   ├── EconomyService.ts
│   │   ├── GuildService.ts
│   │   ├── QuestService.ts
│   │   ├── NotificationService.ts
│   │   └── ...
│   │
│   ├── workers/                   — BullMQ worker definitions
│   │   ├── BattleWorker.ts
│   │   ├── EconomyWorker.ts
│   │   ├── NotificationWorker.ts
│   │   ├── AnalyticsWorker.ts
│   │   └── CinematicWorker.ts
│   │
│   ├── cache/                     — Redis cache abstractions
│   │   ├── CacheClient.ts
│   │   ├── PlayerCache.ts
│   │   ├── BattleCache.ts
│   │   └── MarketCache.ts
│   │
│   ├── ui/                        — Embed and component builders
│   │   ├── embeds/
│   │   │   ├── ProfileEmbed.ts
│   │   │   ├── BattleEmbed.ts
│   │   │   ├── InventoryEmbed.ts
│   │   │   └── ...
│   │   └── components/            — Discord button/select builders
│   │       ├── BattleButtons.ts
│   │       ├── ShopButtons.ts
│   │       └── ...
│   │
│   ├── cinematic/                 — Cinematic render engine
│   │   ├── CanvasRenderer.ts
│   │   ├── AnimationCompositor.ts
│   │   ├── SpriteLibrary.ts
│   │   └── EffectLibrary.ts
│   │
│   ├── config/                    — Configuration
│   │   ├── constants.ts           — Game balance constants
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── environment.ts
│   │
│   ├── middleware/                — Express/REST middleware
│   │   ├── auth.ts
│   │   ├── rateLimiter.ts
│   │   └── errorHandler.ts
│   │
│   └── utils/                     — Shared utilities
│       ├── logger.ts
│       ├── randomSeed.ts
│       ├── formulae.ts            — All game math formulas
│       └── validators.ts
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
├── assets/                        — Game visual assets
│   ├── sprites/
│   │   ├── characters/
│   │   ├── enemies/
│   │   └── effects/
│   ├── backgrounds/
│   └── ui/
│
├── scripts/                       — Deployment and utility scripts
│   ├── deploy-commands.ts         — Register slash commands globally
│   ├── seed-items.ts              — Seed item catalog
│   └── migrate.ts                 — Database migrations
│
├── docs/                          — Documentation
│   ├── Book1-Game-Developer-Bible.md
│   ├── api/
│   └── architecture/
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── k8s/                           — Kubernetes manifests
│   ├── deployment-bot.yaml
│   ├── deployment-worker.yaml
│   └── services.yaml
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── package.json
├── tsconfig.json
├── .eslintrc.json
└── .env.example
```

---

## 18.3 Naming Conventions

```
FILES:
  Classes/Models:  PascalCase.ts      (e.g., BattleEngine.ts, PlayerService.ts)
  Commands:        kebab-case.ts       (e.g., guild-create.ts, dungeon-enter.ts)
  Utilities:       camelCase.ts        (e.g., formulae.ts, rateLimiter.ts)
  Constants:       UPPER_SNAKE_CASE   (within file: MAX_INVENTORY_SLOTS)
  Types/Interfaces: IPascalCase or PascalCase (e.g., IPlayer, BattleState)

VARIABLES:
  Classes: PascalCase              (const battleEngine = new BattleEngine())
  Functions: camelCase             (function calculateDamage())
  Constants: UPPER_SNAKE_CASE      (const MAX_LEVEL = 100)
  Booleans: isX / hasX / canX     (isDefeated, hasMana, canTransform)

DATABASE:
  Collection names: camelCase plural (players, marketListings, battleSessions)
  Field names: camelCase           (userId, currentHp, lastLoginAt)
  Index names: descriptive         (players_userId_unique, battles_createdAt_ttl)

REDIS KEYS:
  Format: scope:identifier:field   (player:123456789:session, battle:abc123:state)
  TTL constants: exported from cache/constants.ts
```

---

## 18.4 Code Quality Standards

### TypeScript Strictness
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### ESLint Rules (key selections)
```
- No unused variables (error)
- No floating promises (error — all async calls must be awaited or handled)
- Prefer const over let (error)
- No console.log in production code (warning — use logger)
- Explicit return types on functions (warning)
- No any type unless explicitly cast (error)
```

---

## 18.5 Error Handling

```
ERROR HIERARCHY:

GameError (base)
├── ValidationError    — Invalid input, missing parameters
├── AuthorizationError — Insufficient permissions
├── NotFoundError      — Player/item/guild not found
├── EconomyError       — Insufficient currency, transaction failure
├── BattleError        — Invalid battle action, state error
├── RateLimitError     — Command rate limit exceeded
└── SystemError        — Infrastructure failure (DB down, Redis down)

ERROR HANDLING RULES:
1. Never let unhandled promises crash the process
2. All Discord interactions must always receive a response (even on error)
3. User-facing errors: clean, friendly message in embed format
4. Internal errors: logged with full stack trace; user sees generic message
5. Economy errors: logged to economy_log collection before any rejection
6. Battle errors: battle state preserved in Redis; user notified of interruption

GLOBAL UNHANDLED REJECTION HANDLER:
  process.on('unhandledRejection', ...) — logs error, restarts failing component
```

---

## 18.6 Logging Standards

```
LOGGER: Pino (structured JSON)
LOG LEVELS: fatal | error | warn | info | debug | trace

LOG FORMAT:
  {
    "level": "info",
    "time": "2024-01-15T12:00:00.000Z",
    "service": "battle-worker",
    "userId": "123456789",
    "battleId": "abc123",
    "action": "turn_processed",
    "damage": 2840,
    "duration_ms": 45
  }

LOGGING RULES:
  - Always include: service name, timestamp, relevant IDs
  - Battle turns: info level, all damage data
  - Economy transactions: info level, all amounts and currency types
  - Errors: error level, full error object + context
  - Debug mode: verbose per-turn calculation breakdown
  - PII policy: Never log Discord tokens, user email, IP addresses in plain text

LOG DESTINATIONS:
  Development: stdout
  Production: stdout → collected by Loki → queryable in Grafana
```

---

## 18.7 Security Standards

```
SECURITY REQUIREMENTS:

1. SECRETS MANAGEMENT:
   - No secrets in codebase
   - All secrets via environment variables
   - Production: Kubernetes Secrets (encrypted at rest)

2. INPUT VALIDATION:
   - All command parameters validated before processing
   - Zod schemas for all command inputs
   - Parameter sanitization before DB queries

3. AUTHORIZATION:
   - Role checks before all admin/guild officer commands
   - User can only modify their own data (enforced server-side, not client)
   - Economy transactions: server-side balance check before deduction

4. RATE LIMITING:
   - Per-user command rate limits (Redis sliding window)
   - Global server rate limits
   - Economy command rate limits (prevent exploit attempts)

5. ANTI-CHEAT:
   - Server-side battle computation only
   - Battle seed logged for replay verification
   - Economy transaction audit trail
   - Suspicious pattern detection (identical results across bots, speed anomalies)

6. DATA INTEGRITY:
   - Economy transactions: MongoDB atomic sessions
   - No double-spend: Redis lock on economy operations (30-second TTL)
   - Inventory operations: Read → Validate → Write (atomic session)

7. DISCORD TOKEN:
   - Bot token stored in environment only
   - Token rotation plan: documented procedure for token refresh
   - Shard manager communicates over internal network only
```

---

## 18.8 Testing Strategy

```
TESTING PYRAMID:

UNIT TESTS (70% of test suite):
  Target: Game engine formulas, damage calculations, XP formulas, economy calculations
  Runner: Vitest
  Coverage Target: 90% of engine functions
  Examples:
    - DamageCalculator.test.ts: All damage formula edge cases
    - StatusEffectManager.test.ts: Status application, stacking, removal
    - EconomyEngine.test.ts: Transaction integrity, currency checks
    - LevelingEngine.test.ts: XP formulas, prestige math

INTEGRATION TESTS (20% of test suite):
  Target: Service layer interactions, DB operations, cache interactions
  Runner: Vitest with in-memory MongoDB (mongodb-memory-server)
  Examples:
    - BattleService.test.ts: Full battle session lifecycle
    - PlayerService.test.ts: Player creation, stat retrieval
    - MarketService.test.ts: Listing, buying, delisting flow

E2E TESTS (10% of test suite):
  Target: Full command flow including Discord interaction simulation
  Runner: Custom Discord interaction simulator
  Examples:
    - /start command → character created → profile viewable
    - /battle → turn flow → victory → rewards distributed
    - /market post → /market buy → item transferred

PERFORMANCE TESTS:
  Target: Battle engine throughput, cache hit rates, queue processing speed
  Tool: k6 (load testing)
  Threshold: 95th percentile battle turn processing < 200ms
```

---

## 18.9 CI/CD Pipeline

```
CI PIPELINE (GitHub Actions — runs on every PR):

  Job 1: Lint
    - ESLint check (zero warnings in production)
    - TypeScript type check

  Job 2: Unit Tests
    - Run full unit test suite
    - Coverage check (fail if < 85% on engine files)

  Job 3: Integration Tests
    - Spin up in-memory MongoDB
    - Run integration suite

  Job 4: Build
    - TypeScript compile check
    - Docker image build (verify no errors)

CD PIPELINE (GitHub Actions — on merge to main):

  Stage 1: Build & Push
    - Build Docker image
    - Push to container registry with SHA tag

  Stage 2: Deploy Staging
    - Apply k8s manifests to staging cluster
    - Run smoke tests against staging

  Stage 3: Deploy Production (manual trigger)
    - Apply k8s manifests to production cluster
    - Rolling update (zero downtime)
    - Monitor for 15 minutes post-deploy
    - Auto-rollback if error rate spikes

DEPLOYMENT TARGETS:
  Staging: Mirrors production config, 10% capacity
  Production: Full multi-instance deployment
  Canary (Phase 4+): 5% of traffic to new version before full rollout
```

---

## 18.10 Performance Targets

| Metric | Target | Max Acceptable |
|---|---|---|
| Command response time (P50) | < 200ms | 500ms |
| Command response time (P95) | < 500ms | 1,500ms |
| Battle turn processing time | < 150ms | 400ms |
| Cinematic render time | < 2,000ms | 3,500ms |
| DB query time (P95) | < 50ms | 200ms |
| Redis cache hit rate | > 85% | > 70% |
| Queue processing lag | < 500ms | 2,000ms |
| Uptime target | 99.9% | 99.5% |
| Shard restart time | < 5 seconds | 15 seconds |

---

# APPENDIX A — BALANCE PHILOSOPHY SUMMARY

> Balance is not equality. Balance is each choice feeling meaningful.

1. **No single stat should trivialize all content.** Every stat has soft caps with diminishing returns.
2. **No single class should win all PvP.** The rock-paper-scissors of class archetypes must hold.
3. **Time spent should compound with skill, not replace it.** A new player who understands the system can punch above their progression weight.
4. **The economy should self-regulate.** Gold sinks, daily caps, and decay mechanics prevent inflation spirals.
5. **Transformations should be epic, not mandatory.** Players who skip transformations should be viable through other builds.

---

# APPENDIX B — GLOSSARY

| Term | Definition |
|---|---|
| PR | Power Rating — composite combat effectiveness score |
| RP | Resonance Points — resource for transformation system |
| RAF | Resonance Ascension Framework — the transformation system |
| DoT | Damage over Time — status effects that deal damage each turn |
| HoT | Healing over Time — Regeneration type effects |
| AoE | Area of Effect — in raids, attacks hitting all party members |
| CBS | Cinematic Battle System — dynamic animation renderer |
| F2P | Free-to-Play — players who don't spend real money |
| Shard | A partitioned instance of the Discord bot handling a subset of guilds |
| BullMQ | Redis-backed queue library for background job processing |
| Soulbound | Item that cannot be traded or sold after equipping |
| Aura Core | Equipment slot providing percentage-based aura bonuses |
| Resonance | In-game energy concept; the source of transformation power |
| Apex | The highest tier of transformation (Stage 4) |
| World Boss | Weekly server-wide PvE mega-event |
| Guild War | Server-organized faction PvP event spanning a week |

---

# APPENDIX C — DOCUMENT HISTORY

| Version | Date | Author | Changes |
|---|---|---|---|
| 0.1 | — | Lead Designer | Initial draft, vision and core loop |
| 0.5 | — | Systems Team | Combat, economy, and progression systems |
| 0.9 | — | Technical Lead | Scalability and dev standards sections |
| 1.0 | July 2026 | Studio | First published version — Book 1 complete |

---

*End of Book 1 — Foundation & Systems Design*

---

> **Next: Book 2 — Content Bible (Classes, Story, Dungeons, Enemies, Lore)**
> **Next: Book 3 — Technical Architecture Bible (Code Contracts, API Spec, Schema Definitions)**
> **Next: Book 4 — Operations Bible (Deployment, Monitoring, Incident Response, Balance Tuning)**

---

*This document is the property of the Ascension Legends development studio. All game systems, names, terminology, and designs described herein are original works. Any resemblance to existing games or intellectual property is coincidental and unintentional.*
