# ASCENSION LEGENDS — DEVELOPMENT ROADMAP

> This roadmap outlines the full development lifecycle of Ascension Legends from internal pre-alpha through global public release and beyond.  
> All phases are subject to revision based on playtesting, community feedback, and live-service data.

---

## Table of Contents

- [Overview](#overview)
- [Phase 1 — Foundation](#phase-1--foundation)
- [Phase 2 — Combat](#phase-2--combat)
- [Phase 3 — Story](#phase-3--story)
- [Phase 4 — Guilds](#phase-4--guilds)
- [Phase 5 — Raids](#phase-5--raids)
- [Phase 6 — PvP](#phase-6--pvp)
- [Phase 7 — Seasons](#phase-7--seasons)
- [Phase 8 — Mobile Companion](#phase-8--mobile-companion)
- [Phase 9 — Creator Tools](#phase-9--creator-tools)
- [Phase 10 — Global Release](#phase-10--global-release)
- [Post-Launch Vision](#post-launch-vision)

---

## Overview

```
Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5
Foundation   Combat      Story       Guilds      Raids

Phase 6 ──► Phase 7 ──► Phase 8 ──► Phase 9 ──► Phase 10
PvP         Seasons     Mobile      Creator     Global
```

| Phase | Name | Status | Estimated Duration |
|-------|------|--------|--------------------|
| 1 | Foundation | 🔴 In Development | 3 months |
| 2 | Combat | 🔴 Pending | 2 months |
| 3 | Story | 🔴 Pending | 3 months |
| 4 | Guilds | 🔴 Pending | 2 months |
| 5 | Raids | 🔴 Pending | 2 months |
| 6 | PvP | 🔴 Pending | 2 months |
| 7 | Seasons | 🔴 Pending | Ongoing |
| 8 | Mobile Companion | 🔴 Pending | 4 months |
| 9 | Creator Tools | 🔴 Pending | 3 months |
| 10 | Global Release | 🔴 Pending | TBD |

---

## Phase 1 — Foundation

**Goal:** Establish a playable core experience with a real player loop.

### Deliverables

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 1.1 | Discord Bot Framework | Slash commands, embed system, event bus, rate limit handling | Critical |
| 1.2 | Character Creation | Select class (5 starter), name character, assign stats | Critical |
| 1.3 | Basic Combat Engine | Turn-based combat with Book 1 formulas implemented | Critical |
| 1.4 | Progression System | Levels 1–50, EXP gain, stat growth | Critical |
| 1.5 | Economy Foundation | Coin drops, basic shop, inventory system | High |
| 1.6 | 5 Starter Classes | Shadowblade, Stormcaller, Ironwarden, Soulweaver, Beastmaster | Critical |
| 1.7 | Starter Region | Verdantia Continent — starting zones only | High |
| 1.8 | Basic Dungeons | 5 starter dungeons with static boss encounters | High |
| 1.9 | Tutorial System | Onboarding quest chain (Chapters 1–5) | High |
| 1.10 | Database Architecture | Player data, character state, item storage | Critical |

### Success Criteria
- 100 internal playtesters complete Levels 1–20 without critical bugs
- Combat resolves correctly across all starter classes
- Discord embed system renders cleanly on mobile and desktop

---

## Phase 2 — Combat

**Goal:** Expand the combat system to its full designed depth.

### Deliverables

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 2.1 | Full 50-Class Roster | All classes from Book 2 implemented | Critical |
| 2.2 | Skill System | 1,000 skills fully coded with animations | Critical |
| 2.3 | Transformation System | All 5 transformation stages per class | Critical |
| 2.4 | Status Effects | Full status effect library from Book 1 | High |
| 2.5 | Combo System | Multi-skill chain combos and counters | High |
| 2.6 | Cinematic Battle Engine | Discord embed battle animations | High |
| 2.7 | Elite Monster AI | Dynamic AI personalities for elite encounters | Medium |
| 2.8 | Equipment System | Full gear slots, stats, upgrade system | Critical |
| 2.9 | Consumables in Combat | Potions, scrolls, runes usable mid-fight | Medium |
| 2.10 | Combat Replay System | Summary of battle with key moments | Low |

### Success Criteria
- All 50 classes playable and balanced within ±15% of each other on DPS benchmarks
- Zero game-breaking exploit paths in transformation system
- Cinematic battle embeds render in under 2 seconds

---

## Phase 3 — Story

**Goal:** Deliver the full narrative campaign and world exploration.

### Deliverables

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 3.1 | Story Mode Acts 1–5 | Chapters 1–50 fully implemented | Critical |
| 3.2 | Cutscene System | Dialogue embeds with character portraits | High |
| 3.3 | Story Mode Acts 6–10 | Chapters 51–100 implemented | High |
| 3.4 | World Map Navigation | 10 continents accessible with travel system | Critical |
| 3.5 | 100 Cities/Villages | All locations from Book 2 accessible | High |
| 3.6 | Special Realms | Sky Kingdom, Spirit Realm, Shadow Realm, Ocean Kingdom live | High |
| 3.7 | NPC Interaction System | Full NPC dialogue trees | Medium |
| 3.8 | Side Quest System | 200+ side quests available | Medium |
| 3.9 | World Boss Spawns | 20 World Bosses with schedule | High |
| 3.10 | Hidden Content System | Secret areas, hidden quests, easter eggs | Low |

### Success Criteria
- Story completion rate above 60% for Acts 1–3
- Player-reported immersion score above 4/5 in surveys
- Zero story-blocking bugs in main quest chain

---

## Phase 4 — Guilds

**Goal:** Enable social play through a full guild system.

### Deliverables

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 4.1 | Guild Creation | Found a guild, set banner, recruit members | Critical |
| 4.2 | Guild Ranks & Roles | Leader, Officer, Member, Initiate hierarchy | Critical |
| 4.3 | Guild Hall | Upgradeable shared space with bonuses | High |
| 4.4 | Guild Quests | Cooperative weekly/monthly objectives | High |
| 4.5 | Guild Treasury | Shared resources and crafting pool | Medium |
| 4.6 | Faction Alignment | Guilds pledge to one of 20 factions | High |
| 4.7 | Guild Wars | Scheduled guild vs. guild PvP battles | High |
| 4.8 | Guild Leaderboard | Global rankings by power and achievement | Medium |
| 4.9 | Guild Chat System | Dedicated Discord channel integration | Critical |
| 4.10 | Alliance System | Guilds form alliances for raid cooperation | Medium |

### Success Criteria
- 80% of active players join a guild within 2 weeks of feature launch
- Guild wars run without desync or timeout issues
- Alliance negotiation system functions without exploits

---

## Phase 5 — Raids

**Goal:** Deliver endgame cooperative content for organized groups.

### Deliverables

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 5.1 | Raid Matchmaking | Form raid parties (10–30 players) | Critical |
| 5.2 | Raid Bosses | 40 raid bosses from Book 2 implemented | Critical |
| 5.3 | Raid Phases | Multi-phase boss encounters with mechanics | High |
| 5.4 | Raid Loot System | Exclusive drops, need/greed rolls | Critical |
| 5.5 | Raid Leaderboards | Clear time rankings per boss | Medium |
| 5.6 | Hardcore Mode | Single-wipe raid variants | Medium |
| 5.7 | Raid Achievements | Exclusive titles for first clears | High |
| 5.8 | Raid Commander NPC | Pre-raid briefing dialogue system | Low |
| 5.9 | World Boss Events | Coordinated server-wide boss events | High |
| 5.10 | Dungeon Variants | Hard and Legendary dungeon difficulties | Medium |

### Success Criteria
- First world boss cleared by top guild within 48 hours of launch
- Raid participation rate above 40% of max-level players
- Zero loot distribution exploits

---

## Phase 6 — PvP

**Goal:** Build a robust competitive PvP ecosystem.

### Deliverables

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 6.1 | Ranked Arena | 1v1 ELO-based competitive ladder | Critical |
| 6.2 | Team PvP | 3v3 and 5v5 team battle modes | High |
| 6.3 | Battle Royale Mode | Server-wide last-player-standing event | Medium |
| 6.4 | PvP Seasons | Ranked season resets with rewards | High |
| 6.5 | Anti-Cheat Layer | Exploit detection and auto-reporting | Critical |
| 6.6 | PvP Spectator Mode | Watch live matches via Discord embeds | Medium |
| 6.7 | Guild War Ranking | Faction-level PvP territorial rankings | High |
| 6.8 | PvP Rewards Shop | Exclusive cosmetics via PvP currency | High |
| 6.9 | Tournament System | Scheduled brackets with prizes | Medium |
| 6.10 | PvP Balance Patch Cadence | Bi-weekly balance updates | Critical |

### Success Criteria
- Ranked queue wait time under 60 seconds at peak hours
- Class win-rate spread within 5% across all brackets
- Zero unresolved game-breaking PvP exploits at season start

---

## Phase 7 — Seasons

**Goal:** Launch the live-service seasonal content model.

### Deliverables

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 7.1 | Season 1 Story | New seasonal narrative arc | Critical |
| 7.2 | Battle Pass System | Free and premium tiers, 100 levels | Critical |
| 7.3 | Seasonal Boss | Unique boss only during season | High |
| 7.4 | Seasonal Cosmetics | Exclusive skins, auras, frames | High |
| 7.5 | Season Shop | Limited-time item rotation | High |
| 7.6 | Seasonal Events | 4+ live events per season | Medium |
| 7.7 | Season Ranked Reset | PvP ladder resets with new season | Critical |
| 7.8 | Season Achievements | Season-specific achievement set | Medium |
| 7.9 | Cross-Promotion Events | Collaboration event framework (original IPs only) | Low |
| 7.10 | Season Recap System | End-of-season stats and awards | Medium |

### Season Cadence
- **Season Length:** 12 weeks
- **Pre-Season Teaser:** Week -2
- **Season Launch:** Week 0
- **Mid-Season Update:** Week 6
- **Season End Celebration:** Week 11–12
- **Inter-Season Break:** 2 weeks

---

## Phase 8 — Mobile Companion

**Goal:** Deliver a mobile companion app for passive engagement.

### Deliverables

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 8.1 | React Native App | iOS and Android companion app | Critical |
| 8.2 | Character Dashboard | View stats, equipment, inventory | High |
| 8.3 | Passive Training | Set training while AFK | High |
| 8.4 | Push Notifications | Guild alerts, raid invites, world boss spawns | High |
| 8.5 | Shop Access | Browse and purchase from mobile | Medium |
| 8.6 | Guild Chat | Mobile guild communication | Medium |
| 8.7 | Achievement Tracking | View and claim achievements | Medium |
| 8.8 | Seasonal Event Access | Participate in events from mobile | Medium |
| 8.9 | Account Linking | Link Discord account to mobile | Critical |
| 8.10 | Offline Progression | Passive resource generation | Low |

---

## Phase 9 — Creator Tools

**Goal:** Empower the community to create and share content.

### Deliverables

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 9.1 | Custom Dungeon Builder | Design personal dungeons (limited slots) | High |
| 9.2 | Guild Story Tool | Create guild-level story arcs | Medium |
| 9.3 | Cosmetic Submission | Community cosmetic design contest | Medium |
| 9.4 | Lore Expansion Portal | Approved fan lore submissions | Low |
| 9.5 | Streamer Mode | Spectator-friendly battle overlay | High |
| 9.6 | Replay Export | Export battles as shareable embeds | Medium |
| 9.7 | Developer Dashboard | Public stats, leaderboards API | Medium |
| 9.8 | Mod Support (Limited) | Approved custom content framework | Low |
| 9.9 | Content Creator Partner Program | Verified creator perks | Medium |
| 9.10 | Fan Art Integration | Community art featured in-game | Low |

---

## Phase 10 — Global Release

**Goal:** Full public launch with localization and international server support.

### Deliverables

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 10.1 | Localization | English, Japanese, Korean, Portuguese, Spanish, French, German | Critical |
| 10.2 | Regional Servers | NA, EU, SEA, BR, JP/KR server clusters | Critical |
| 10.3 | Global Leaderboards | Cross-region competitive rankings | High |
| 10.4 | Launch Marketing | Global trailer, influencer push, Discord blast | Critical |
| 10.5 | Day-1 Server Stability | Load testing, fallback systems | Critical |
| 10.6 | Payment Localization | Regional currency support for premium content | High |
| 10.7 | Support Infrastructure | 24/7 live support, ticket system | High |
| 10.8 | Anti-Bot Measures | Advanced bot detection in Discord context | Critical |
| 10.9 | GDPR / Privacy Compliance | Full compliance across all regions | Critical |
| 10.10 | Post-Launch Monitoring | Real-time telemetry and incident response | Critical |

---

## Post-Launch Vision

After global release, Ascension Legends enters its live-service lifecycle:

### Year 1 Post-Launch
- Season 1–4 complete
- First major expansion: **The Abyss Awakens** (new continent + 5 new classes)
- 1v1 World Championship tournament
- Companion app v2.0

### Year 2 Post-Launch
- Season 5–8 complete
- Second major expansion: **Era of Ascendants** (new story arc, 10 new classes)
- Cross-platform Discord + browser hybrid system
- Creator economy launch

### Year 3+ Post-Launch
- Full console/PC companion client
- Player-owned guild servers
- Procedural content generation layer
- Annual World Championship series

---

*Last updated: Book 2 Content Bible Release*  
*Maintained by: Ascension Legends Core Design Team*
