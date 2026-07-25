# ASCENSION LEGENDS — Book 3: Technical Architecture Bible

> **Cross-Reference Notice:** This document references **Book 1 (Foundation & Systems Design)** for game mechanics, battle rules, economy definitions, and progression systems, and **Book 2 (Content Bible)** for world lore, class definitions, monster data, dungeon layouts, and item catalogues. Details defined in those books are not duplicated here; instead, pointers are provided so developers can consult the canonical source.

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
   - 1.1 [High-Level Architecture Overview](#11-high-level-architecture-overview)
   - 1.2 [Component Diagram](#12-component-diagram)
   - 1.3 [Data Flow Diagram](#13-data-flow-diagram)
   - 1.4 [Service Boundaries](#14-service-boundaries)
   - 1.5 [Layered Architecture](#15-layered-architecture)
   - 1.6 [Dependency Graph](#16-dependency-graph)
   - 1.7 [Folder Structure](#17-folder-structure)
   - 1.8 [Package Organization](#18-package-organization)

2. [Discord Bot Architecture](#2-discord-bot-architecture)
   - 2.1 [discord.js v14 Architecture](#21-discordjs-v14-architecture)
   - 2.2 [Slash Commands](#22-slash-commands)
   - 2.3 [Buttons & Components](#23-buttons--components)
   - 2.4 [Select Menus](#24-select-menus)
   - 2.5 [Modals](#25-modals)
   - 2.6 [Autocomplete](#26-autocomplete)
   - 2.7 [Context Menus](#27-context-menus)
   - 2.8 [Gateway Events](#28-gateway-events)
   - 2.9 [Interaction Lifecycle](#29-interaction-lifecycle)
   - 2.10 [Sharding Strategy](#210-sharding-strategy)
   - 2.11 [Rate Limits](#211-rate-limits)
   - 2.12 [Permission System](#212-permission-system)

3. [Database Architecture — MongoDB](#3-database-architecture--mongodb)
   - 3.1 [Database Overview](#31-database-overview)
   - 3.2 [Users Collection](#32-users-collection)
   - 3.3 [Profiles Collection](#33-profiles-collection)
   - 3.4 [Characters Collection](#34-characters-collection)
   - 3.5 [Classes Collection](#35-classes-collection)
   - 3.6 [Inventory Collection](#36-inventory-collection)
   - 3.7 [Equipment Collection](#37-equipment-collection)
   - 3.8 [Skills Collection](#38-skills-collection)
   - 3.9 [Guilds Collection](#39-guilds-collection)
   - 3.10 [GuildMembers Collection](#310-guildmembers-collection)
   - 3.11 [Raids Collection](#311-raids-collection)
   - 3.12 [Bosses Collection](#312-bosses-collection)
   - 3.13 [Monsters Collection](#313-monsters-collection)
   - 3.14 [NPCs Collection](#314-npcs-collection)
   - 3.15 [Marketplace Collection](#315-marketplace-collection)
   - 3.16 [Trades Collection](#316-trades-collection)
   - 3.17 [Auctions Collection](#317-auctions-collection)
   - 3.18 [Economy Collection](#318-economy-collection)
   - 3.19 [Achievements Collection](#319-achievements-collection)
   - 3.20 [BattlePass Collection](#320-battlepass-collection)
   - 3.21 [Quests Collection](#321-quests-collection)
   - 3.22 [Story Collection](#322-story-collection)
   - 3.23 [Notifications Collection](#323-notifications-collection)
   - 3.24 [Mail Collection](#324-mail-collection)
   - 3.25 [Analytics Collection](#325-analytics-collection)
   - 3.26 [Moderation Collection](#326-moderation-collection)

4. [Redis Architecture](#4-redis-architecture)
   - 4.1 [Caching Strategy](#41-caching-strategy)
   - 4.2 [Distributed Locks](#42-distributed-locks)
   - 4.3 [Leaderboard Cache](#43-leaderboard-cache)
   - 4.4 [Session Cache](#44-session-cache)
   - 4.5 [Rate Limit Cache](#45-rate-limit-cache)
   - 4.6 [TTL Strategy](#46-ttl-strategy)
   - 4.7 [Cache Invalidation](#47-cache-invalidation)

5. [Service Layer](#5-service-layer)
   - 5.1 [BattleService](#51-battleservice)
   - 5.2 [ProfileService](#52-profileservice)
   - 5.3 [GuildService](#53-guildservice)
   - 5.4 [EconomyService](#54-economyservice)
   - 5.5 [MarketplaceService](#55-marketplaceservice)
   - 5.6 [InventoryService](#56-inventoryservice)
   - 5.7 [QuestService](#57-questservice)
   - 5.8 [TransformationService](#58-transformationservice)
   - 5.9 [RaidService](#59-raidservice)
   - 5.10 [WorldBossService](#510-worldbossservice)
   - 5.11 [SkillService](#511-skillservice)
   - 5.12 [StoryService](#512-storyservice)
   - 5.13 [AchievementService](#513-achievementservice)
   - 5.14 [NotificationService](#514-notificationservice)
   - 5.15 [ModerationService](#515-moderationservice)
   - 5.16 [AnalyticsService](#516-analyticsservice)
   - 5.17 [ImageRenderService](#517-imagerenderservice)
   - 5.18 [VideoRenderService](#518-videorenderservice)
   - 5.19 [AdminService](#519-adminservice)

6. [Battle Engine](#6-battle-engine)
   - 6.1 [Battle Scheduler](#61-battle-scheduler)
   - 6.2 [Turn Queue & Initiative](#62-turn-queue--initiative)
   - 6.3 [Action Queue](#63-action-queue)
   - 6.4 [Cooldown Manager](#64-cooldown-manager)
   - 6.5 [Status Manager](#65-status-manager)
   - 6.6 [Transformation Manager](#66-transformation-manager)
   - 6.7 [Ultimate Manager](#67-ultimate-manager)
   - 6.8 [Target Selection](#68-target-selection)
   - 6.9 [Damage Pipeline](#69-damage-pipeline)
   - 6.10 [Healing Pipeline](#610-healing-pipeline)
   - 6.11 [Death Handling](#611-death-handling)
   - 6.12 [Replay Generation](#612-replay-generation)
   - 6.13 [Deterministic Simulation](#613-deterministic-simulation)

7. [Render Engine](#7-render-engine)
   - 7.1 [Canvas Rendering Architecture](#71-canvas-rendering-architecture)
   - 7.2 [Sprite Layering System](#72-sprite-layering-system)
   - 7.3 [Battle Backgrounds](#73-battle-backgrounds)
   - 7.4 [Character Rendering](#74-character-rendering)
   - 7.5 [Particle System](#75-particle-system)
   - 7.6 [Damage Numbers](#76-damage-numbers)
   - 7.7 [Health Bars](#77-health-bars)
   - 7.8 [Animation Timeline](#78-animation-timeline)
   - 7.9 [Camera Movement](#79-camera-movement)
   - 7.10 [GIF Generation](#710-gif-generation)
   - 7.11 [MP4 Generation](#711-mp4-generation)
   - 7.12 [Render Optimization](#712-render-optimization)

8. [Asset Pipeline](#8-asset-pipeline)
   - 8.1 [Character Assets](#81-character-assets)
   - 8.2 [Arena Assets](#82-arena-assets)
   - 8.3 [Skill Effects](#83-skill-effects)
   - 8.4 [Icons & Portraits](#84-icons--portraits)
   - 8.5 [Animations](#85-animations)
   - 8.6 [Sound Effects](#86-sound-effects)
   - 8.7 [Versioning](#87-versioning)
   - 8.8 [Compression & Delivery](#88-compression--delivery)

9. [Internal APIs](#9-internal-apis)
   - 9.1 [API Design Principles](#91-api-design-principles)
   - 9.2 [Battle API](#92-battle-api)
   - 9.3 [Profile API](#93-profile-api)
   - 9.4 [Guild API](#94-guild-api)
   - 9.5 [Economy API](#95-economy-api)
   - 9.6 [Inventory API](#96-inventory-api)
   - 9.7 [Quest API](#97-quest-api)
   - 9.8 [Admin API](#98-admin-api)
   - 9.9 [Render API](#99-render-api)
   - 9.10 [Analytics API](#910-analytics-api)

10. [Security Architecture](#10-security-architecture)
    - 10.1 [Authentication](#101-authentication)
    - 10.2 [Authorization](#102-authorization)
    - 10.3 [Anti-Cheat System](#103-anti-cheat-system)
    - 10.4 [Economy Protection](#104-economy-protection)
    - 10.5 [Trade Validation](#105-trade-validation)
    - 10.6 [Marketplace Validation](#106-marketplace-validation)
    - 10.7 [Cooldown Enforcement](#107-cooldown-enforcement)
    - 10.8 [Audit Logs](#108-audit-logs)
    - 10.9 [Spam Prevention](#109-spam-prevention)

11. [Background Workers](#11-background-workers)
    - 11.1 [Worker Architecture](#111-worker-architecture)
    - 11.2 [Image Render Worker](#112-image-render-worker)
    - 11.3 [Video Render Worker](#113-video-render-worker)
    - 11.4 [Notification Worker](#114-notification-worker)
    - 11.5 [Economy Worker](#115-economy-worker)
    - 11.6 [Leaderboard Worker](#116-leaderboard-worker)
    - 11.7 [Daily Reset Worker](#117-daily-reset-worker)
    - 11.8 [Weekly Reset Worker](#118-weekly-reset-worker)
    - 11.9 [Season Reset Worker](#119-season-reset-worker)
    - 11.10 [Guild Processing Worker](#1110-guild-processing-worker)
    - 11.11 [Analytics Worker](#1111-analytics-worker)
    - 11.12 [Cleanup Worker](#1112-cleanup-worker)

12. [DevOps Architecture](#12-devops-architecture)
    - 12.1 [Docker Architecture](#121-docker-architecture)
    - 12.2 [GitHub Actions CI/CD](#122-github-actions-cicd)
    - 12.3 [Environment Management](#123-environment-management)
    - 12.4 [Secrets Management](#124-secrets-management)
    - 12.5 [Production Environment](#125-production-environment)
    - 12.6 [Staging Environment](#126-staging-environment)
    - 12.7 [Testing Environment](#127-testing-environment)
    - 12.8 [Monitoring Stack](#128-monitoring-stack)
    - 12.9 [Logging Architecture](#129-logging-architecture)
    - 12.10 [Backup Strategy](#1210-backup-strategy)
    - 12.11 [Disaster Recovery](#1211-disaster-recovery)

13. [Observability](#13-observability)
    - 13.1 [Metrics Architecture](#131-metrics-architecture)
    - 13.2 [Dashboards](#132-dashboards)
    - 13.3 [Distributed Tracing](#133-distributed-tracing)
    - 13.4 [Performance Monitoring](#134-performance-monitoring)
    - 13.5 [Alerting System](#135-alerting-system)
    - 13.6 [Health Checks](#136-health-checks)

14. [Testing Architecture](#14-testing-architecture)
    - 14.1 [Unit Testing](#141-unit-testing)
    - 14.2 [Integration Testing](#142-integration-testing)
    - 14.3 [Load Testing](#143-load-testing)
    - 14.4 [Battle Simulation Tests](#144-battle-simulation-tests)
    - 14.5 [Regression Tests](#145-regression-tests)
    - 14.6 [Security Testing](#146-security-testing)

15. [Implementation Roadmap](#15-implementation-roadmap)
    - 15.1 [Phase 1 — Foundation (Milestones 1–25)](#151-phase-1--foundation-milestones-125)
    - 15.2 [Phase 2 — Core Game (Milestones 26–60)](#152-phase-2--core-game-milestones-2660)
    - 15.3 [Phase 3 — Content & Economy (Milestones 61–85)](#153-phase-3--content--economy-milestones-6185)
    - 15.4 [Phase 4 — Polish & Launch (Milestones 86–105)](#154-phase-4--polish--launch-milestones-86105)

16. [Engineering Standards](#16-engineering-standards)
    - 16.1 [Naming Conventions](#161-naming-conventions)
    - 16.2 [Coding Standards](#162-coding-standards)
    - 16.3 [Branch Strategy](#163-branch-strategy)
    - 16.4 [Commit Message Format](#164-commit-message-format)
    - 16.5 [Pull Request Process](#165-pull-request-process)
    - 16.6 [Code Review Checklist](#166-code-review-checklist)
    - 16.7 [Documentation Standards](#167-documentation-standards)

---

## 1. System Architecture

### 1.1 High-Level Architecture Overview

ASCENSION LEGENDS is a Discord-native MMORPG delivered entirely through Discord's interaction API. There is no separate web client or mobile app for gameplay; all user-facing interactions are Discord slash commands, buttons, embeds, and media attachments. The system is composed of four primary layers:

```
┌──────────────────────────────────────────────────────────────────┐
│                        DISCORD GATEWAY                           │
│           (Sharded WebSocket connections to Discord API)         │
└────────────────────────┬─────────────────────────────────────────┘
                         │ Interaction events
┌────────────────────────▼─────────────────────────────────────────┐
│                     INTERACTION GATEWAY                          │
│    (discord.js v14 client, shard manager, command router)        │
└──┬──────────────┬──────────────────────────┬────────────────────-┘
   │              │                          │
   ▼              ▼                          ▼
┌──────┐   ┌────────────┐          ┌──────────────────┐
│ CMD  │   │ COMPONENT  │          │  EVENT HANDLER   │
│ROUTER│   │  HANDLER   │          │  (guild, member, │
│      │   │(btns,menus,│          │   message hooks) │
└──┬───┘   │  modals)   │          └────────┬─────────┘
   │       └─────┬──────┘                   │
   └─────────────┴──────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────────┐
│                      SERVICE LAYER                               │
│  BattleService │ ProfileService │ GuildService │ EconomyService  │
│  InventoryService │ QuestService │ RaidService │ StoryService    │
│  AchievementService │ MarketplaceService │ ModerationService     │
└──┬───────────────────┬──────────────────────────────────────────-┘
   │                   │
   ▼                   ▼
┌──────────┐   ┌───────────────┐
│ MongoDB  │   │ Redis Cluster │
│ (primary │   │ (cache, locks,│
│  data)   │   │  leaderboards)│
└──────────┘   └───────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────────┐
│                   WORKER / QUEUE LAYER                           │
│  BullMQ queues: render, notification, economy, analytics         │
└──┬───────────────────────────────────────────────────────────────┘
   │
┌──▼──────────────────────────────────────────────────────────────┐
│                   RENDER MICROSERVICE                           │
│  node-canvas / sharp / ffmpeg  →  GIF + MP4 output             │
└─────────────────────────────────────────────────────────────────┘
```

**Technology Choices:**

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Bot runtime | Node.js 20 LTS | discord.js v14 native environment |
| Bot framework | discord.js v14 | Official, full-featured, actively maintained |
| Primary database | MongoDB 7.x | Schema flexibility for MMORPG data, excellent aggregation |
| Caching / locks | Redis 7.x (cluster) | Sub-millisecond performance, native sorted sets for leaderboards |
| Job queue | BullMQ | Redis-backed, battle-tested, rich job lifecycle |
| Canvas rendering | node-canvas (Cairo) | Server-side Canvas2D API, high-quality output |
| GIF encoding | gifencoder / gif-encoder-2 | Pure JS, compatible with Node.js worker threads |
| Video encoding | ffmpeg (via fluent-ffmpeg) | Industry standard, GPU acceleration optional |
| Image optimization | sharp (libvips) | Fastest Node.js image processing |
| Process manager | PM2 | Cluster management, zero-downtime reload |
| Container orchestration | Docker Compose (dev) / Kubernetes (prod) | Standard containerisation |
| CI/CD | GitHub Actions | Native GitHub integration |
| Monitoring | Prometheus + Grafana | Open-source, industry standard |
| Logging | Pino + Loki | Structured JSON logging, fast |
| Tracing | OpenTelemetry + Jaeger | Vendor-neutral distributed tracing |

---

### 1.2 Component Diagram

```
                          ┌─────────────────────────────────┐
                          │         DISCORD PLATFORM         │
                          │  Gateway API │ REST API │ CDN    │
                          └────────────┬────────────────────-┘
                                       │ WSS + HTTPS
                          ┌────────────▼────────────────────┐
                          │        SHARD MANAGER            │
                          │  ShardingManager (discord.js)   │
                          │  Shard 0 ... Shard N            │
                          └────────────┬────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
          ┌─────────▼──────┐  ┌───────▼───────┐  ┌──────▼───────┐
          │  CMD REGISTRY  │  │  INTERACTION  │  │  EVENT BUS   │
          │  (deploy once) │  │   DISPATCHER  │  │  (internal   │
          │                │  │               │  │  EventEmitter)│
          └─────────┬──────┘  └───────┬───────┘  └──────┬───────┘
                    │                 │                  │
          ┌─────────▼─────────────────▼──────────────────▼───────┐
          │                   SERVICE LAYER                       │
          │                                                       │
          │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
          │  │ Battle   │  │ Profile  │  │ Guild    │            │
          │  │ Service  │  │ Service  │  │ Service  │            │
          │  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
          │       │              │              │                  │
          │  ┌────▼─────┐  ┌────▼─────┐  ┌────▼─────┐            │
          │  │ Economy  │  │Inventory │  │ Quest    │            │
          │  │ Service  │  │ Service  │  │ Service  │            │
          │  └────┬─────┘  └────┬─────┘  └────┬─────┘            │
          │       │              │              │                  │
          │  ┌────▼─────┐  ┌────▼─────┐  ┌────▼─────┐            │
          │  │ Raid     │  │Achievement│ │ Story    │            │
          │  │ Service  │  │ Service  │  │ Service  │            │
          │  └──────────┘  └──────────┘  └──────────┘            │
          └───────────────────┬───────────────────────────────────┘
                              │
              ┌───────────────┼────────────────┐
              │               │                │
    ┌─────────▼──────┐  ┌─────▼──────┐  ┌─────▼──────────┐
    │   MongoDB      │  │   Redis    │  │   BullMQ       │
    │   Cluster      │  │   Cluster  │  │   Queues       │
    │                │  │            │  │  render|notify │
    └────────────────┘  └────────────┘  └───────┬────────┘
                                                 │
                                        ┌────────▼────────┐
                                        │  WORKER POOL    │
                                        │  RenderWorker   │
                                        │  NotifWorker    │
                                        │  EconWorker     │
                                        │  AnalyticsWork  │
                                        └─────────────────┘
```

---

### 1.3 Data Flow Diagram

#### 1.3.1 Battle Command Flow

```
Player types /battle @opponent
       │
       ▼
Discord Gateway → Shard → InteractionDispatcher
       │
       ▼
CommandRouter.dispatch("battle")
       │
       ▼
BattleCommand.execute(interaction)
       │
       ├─→ Validate interaction (defer reply)
       │
       ├─→ ProfileService.getCharacter(userId)
       │         └─→ Redis cache check → MongoDB fallback
       │
       ├─→ ProfileService.getCharacter(targetUserId)
       │         └─→ Redis cache check → MongoDB fallback
       │
       ├─→ BattleService.createBattle(attacker, defender)
       │         ├─→ Validate eligibility (cooldowns, location)
       │         ├─→ BattleEngine.initialize(attacker, defender)
       │         │         └─→ RNG seeded with battleId (deterministic)
       │         ├─→ BattleEngine.simulate() → BattleResult
       │         └─→ MongoDB.battles.insertOne(battleRecord)
       │
       ├─→ renderQueue.add("battle-render", { battleId })
       │
       ├─→ interaction.editReply(pendingEmbed)
       │
       └─→ [Worker] RenderWorker processes job
                 ├─→ ImageRenderService.renderBattleFrames()
                 ├─→ VideoRenderService.encodeGIF()
                 └─→ Discord.webhook.send({ files: [gif], embeds: [...] })
```

#### 1.3.2 Economy Transaction Flow

```
Player uses /shop buy item_id:x quantity:1
       │
       ▼
ShopCommand.execute(interaction)
       │
       ├─→ EconomyService.getBalance(userId)
       │         └─→ Redis balance cache
       │
       ├─→ MarketplaceService.getItem(itemId)
       │         └─→ Redis item cache → MongoDB
       │
       ├─→ EconomyService.validateTransaction(userId, cost)
       │
       ├─→ REDIS DISTRIBUTED LOCK: lock:economy:{userId}
       │
       ├─→ EconomyService.debit(userId, amount)
       │         ├─→ MongoDB.economy.updateOne (atomic)
       │         └─→ Redis cache invalidate
       │
       ├─→ InventoryService.addItem(userId, itemId, quantity)
       │         ├─→ MongoDB.inventory.updateOne (atomic)
       │         └─→ Redis cache invalidate
       │
       ├─→ AuditLog.record(transactionRecord)
       │
       └─→ Lock released → interaction.editReply(successEmbed)
```

---

### 1.4 Service Boundaries

Each service owns its data and exposes a typed public interface. Services must never directly query another service's MongoDB collection — they call the owning service's method.

```
┌─────────────────────────────────────────────────────────────────┐
│ BOUNDARY RULES                                                  │
│                                                                 │
│  ✓ ServiceA calls ServiceB.publicMethod(params)                 │
│  ✗ ServiceA queries ServiceB's MongoDB collection directly      │
│  ✓ Services share Redis cache namespaces (read-only foreign ns) │
│  ✗ Services modify another service's Redis namespace            │
│  ✓ Workers consume jobs from queues                             │
│  ✗ Workers call services synchronously (only async via queue)   │
└─────────────────────────────────────────────────────────────────┘
```

**Service Ownership Matrix:**

| Collection | Owning Service |
|------------|----------------|
| users | ProfileService |
| profiles | ProfileService |
| characters | ProfileService |
| inventory | InventoryService |
| equipment | InventoryService |
| skills | SkillService |
| guilds | GuildService |
| guildMembers | GuildService |
| raids | RaidService |
| bosses | WorldBossService |
| monsters | BattleService (read), Admin (write) |
| npcs | StoryService |
| marketplace | MarketplaceService |
| trades | MarketplaceService |
| auctions | MarketplaceService |
| economy | EconomyService |
| achievements | AchievementService |
| battlePass | AchievementService |
| quests | QuestService |
| story | StoryService |
| notifications | NotificationService |
| mail | NotificationService |
| analytics | AnalyticsService |
| moderation | ModerationService |

---

### 1.5 Layered Architecture

```
┌─────────────────────────────────────────────────┐
│              PRESENTATION LAYER                 │
│  Discord Commands, Embeds, Buttons, Modals      │
│  EmbedBuilder, ActionRowBuilder helpers         │
└────────────────────┬────────────────────────────┘
                     │ calls
┌────────────────────▼────────────────────────────┐
│              APPLICATION LAYER                  │
│  Command handlers, Component handlers           │
│  Input validation, Response formatting          │
│  Interaction lifecycle management               │
└────────────────────┬────────────────────────────┘
                     │ calls
┌────────────────────▼────────────────────────────┐
│               SERVICE LAYER                     │
│  Business logic, Game rules (ref: Book 1)       │
│  Orchestration, Transaction management          │
│  Event emission                                 │
└────────────────────┬────────────────────────────┘
                     │ calls
┌────────────────────▼────────────────────────────┐
│              REPOSITORY LAYER                   │
│  MongoDB models (Mongoose/native driver)        │
│  Redis client wrappers                          │
│  Query builders, Aggregation pipelines          │
└────────────────────┬────────────────────────────┘
                     │ I/O
┌────────────────────▼────────────────────────────┐
│             INFRASTRUCTURE LAYER                │
│  MongoDB, Redis, BullMQ, Discord REST           │
│  File system (assets), S3-compatible storage    │
│  ffmpeg, node-canvas process bridges            │
└─────────────────────────────────────────────────┘
```

---

### 1.6 Dependency Graph

```
discord.js v14
    └─→ @discordjs/rest
    └─→ @discordjs/ws
    └─→ discord-api-types

bot-core (src/bot)
    └─→ command-registry
    └─→ interaction-dispatcher
    └─→ shard-manager

services/
    └─→ battle-service
        └─→ battle-engine
        └─→ skill-service
        └─→ profile-service (character stats)
        └─→ economy-service (rewards)
        └─→ render-service (dispatch)
    └─→ profile-service
        └─→ db/repositories/character
        └─→ redis/character-cache
    └─→ economy-service
        └─→ db/repositories/economy
        └─→ redis/economy-cache
        └─→ audit-log
    └─→ guild-service
        └─→ profile-service (member lookup)
        └─→ economy-service (guild bank)
    └─→ marketplace-service
        └─→ economy-service (payment)
        └─→ inventory-service (item transfer)
        └─→ economy-service.validateTrade()
    └─→ quest-service
        └─→ profile-service
        └─→ economy-service (rewards)
        └─→ achievement-service (unlock check)
    └─→ achievement-service
        └─→ notification-service (announcements)
    └─→ render-service
        └─→ bullmq.renderQueue
    └─→ notification-service
        └─→ discord.js webhook client
        └─→ bullmq.notifQueue

db/
    └─→ mongoose (primary ODM)
    └─→ mongodb native driver (aggregation pipelines)

redis/
    └─→ ioredis
    └─→ bullmq (built on ioredis)

workers/
    └─→ render-worker
        └─→ node-canvas
        └─→ sharp
        └─→ fluent-ffmpeg
    └─→ notification-worker
        └─→ discord.js REST
    └─→ economy-worker
    └─→ analytics-worker
```

---

### 1.7 Folder Structure

```
ascension-legends/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy-staging.yml
│   │   ├── deploy-production.yml
│   │   └── security-scan.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CODEOWNERS
│
├── apps/
│   ├── bot/                          # Main Discord bot
│   │   ├── src/
│   │   │   ├── commands/             # Slash command definitions
│   │   │   │   ├── battle/
│   │   │   │   │   ├── battle.command.ts
│   │   │   │   │   ├── battle.options.ts
│   │   │   │   │   └── battle.handler.ts
│   │   │   │   ├── profile/
│   │   │   │   ├── guild/
│   │   │   │   ├── shop/
│   │   │   │   ├── quest/
│   │   │   │   ├── raid/
│   │   │   │   ├── trade/
│   │   │   │   ├── inventory/
│   │   │   │   ├── leaderboard/
│   │   │   │   ├── story/
│   │   │   │   └── admin/
│   │   │   ├── components/           # Button/menu/modal handlers
│   │   │   │   ├── buttons/
│   │   │   │   ├── menus/
│   │   │   │   └── modals/
│   │   │   ├── events/               # Discord gateway event handlers
│   │   │   │   ├── ready.event.ts
│   │   │   │   ├── guildCreate.event.ts
│   │   │   │   └── interactionCreate.event.ts
│   │   │   ├── interactions/         # Interaction lifecycle middleware
│   │   │   │   ├── dispatcher.ts
│   │   │   │   ├── router.ts
│   │   │   │   └── middleware/
│   │   │   │       ├── defer.ts
│   │   │   │       ├── rateLimit.ts
│   │   │   │       └── permission.ts
│   │   │   ├── embeds/               # Embed builder helpers
│   │   │   │   ├── battle.embed.ts
│   │   │   │   ├── profile.embed.ts
│   │   │   │   ├── guild.embed.ts
│   │   │   │   └── shared/
│   │   │   ├── constants/
│   │   │   │   ├── colors.ts
│   │   │   │   ├── emojis.ts
│   │   │   │   └── cooldowns.ts
│   │   │   ├── utils/
│   │   │   │   ├── pagination.ts
│   │   │   │   ├── confirm.ts
│   │   │   │   └── formatters.ts
│   │   │   ├── client.ts             # discord.js Client setup
│   │   │   ├── shard.ts              # ShardingManager entry
│   │   │   └── index.ts              # Process entry point
│   │   ├── scripts/
│   │   │   ├── deploy-commands.ts
│   │   │   └── register-guilds.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── admin-api/                    # Internal REST API for admin dashboard
│       ├── src/
│       │   ├── routes/
│       │   ├── middleware/
│       │   └── app.ts
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── engine/                       # Battle engine (pure, no I/O)
│   │   ├── src/
│   │   │   ├── battle/
│   │   │   │   ├── BattleEngine.ts
│   │   │   │   ├── TurnQueue.ts
│   │   │   │   ├── ActionQueue.ts
│   │   │   │   ├── DamagePipeline.ts
│   │   │   │   ├── HealingPipeline.ts
│   │   │   │   ├── StatusManager.ts
│   │   │   │   ├── CooldownManager.ts
│   │   │   │   ├── TransformationManager.ts
│   │   │   │   ├── UltimateManager.ts
│   │   │   │   └── ReplayGenerator.ts
│   │   │   ├── skills/
│   │   │   │   ├── SkillProcessor.ts
│   │   │   │   └── SkillEffects.ts
│   │   │   └── types/
│   │   │       ├── battle.types.ts
│   │   │       └── skill.types.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── renderer/                     # Canvas/GIF/MP4 renderer
│   │   ├── src/
│   │   │   ├── canvas/
│   │   │   │   ├── BattleCanvas.ts
│   │   │   │   ├── SpriteLayer.ts
│   │   │   │   ├── ParticleSystem.ts
│   │   │   │   ├── DamageNumbers.ts
│   │   │   │   ├── HealthBar.ts
│   │   │   │   └── Camera.ts
│   │   │   ├── pipeline/
│   │   │   │   ├── GIFPipeline.ts
│   │   │   │   └── MP4Pipeline.ts
│   │   │   ├── assets/
│   │   │   │   ├── AssetLoader.ts
│   │   │   │   └── SpriteSheet.ts
│   │   │   └── types/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── database/                     # Database models and repositories
│   │   ├── src/
│   │   │   ├── models/
│   │   │   │   ├── User.model.ts
│   │   │   │   ├── Character.model.ts
│   │   │   │   ├── Inventory.model.ts
│   │   │   │   ├── Guild.model.ts
│   │   │   │   ├── Battle.model.ts
│   │   │   │   ├── Economy.model.ts
│   │   │   │   ├── Quest.model.ts
│   │   │   │   └── ...
│   │   │   ├── repositories/
│   │   │   │   ├── CharacterRepository.ts
│   │   │   │   ├── InventoryRepository.ts
│   │   │   │   └── ...
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── services/                     # Business logic services
│   │   ├── src/
│   │   │   ├── BattleService.ts
│   │   │   ├── ProfileService.ts
│   │   │   ├── GuildService.ts
│   │   │   ├── EconomyService.ts
│   │   │   ├── MarketplaceService.ts
│   │   │   ├── InventoryService.ts
│   │   │   ├── QuestService.ts
│   │   │   ├── TransformationService.ts
│   │   │   ├── RaidService.ts
│   │   │   ├── WorldBossService.ts
│   │   │   ├── SkillService.ts
│   │   │   ├── StoryService.ts
│   │   │   ├── AchievementService.ts
│   │   │   ├── NotificationService.ts
│   │   │   ├── ModerationService.ts
│   │   │   ├── AnalyticsService.ts
│   │   │   ├── ImageRenderService.ts
│   │   │   ├── VideoRenderService.ts
│   │   │   └── AdminService.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── cache/                        # Redis wrappers
│   │   ├── src/
│   │   │   ├── RedisClient.ts
│   │   │   ├── namespaces/
│   │   │   │   ├── character.cache.ts
│   │   │   │   ├── economy.cache.ts
│   │   │   │   ├── leaderboard.cache.ts
│   │   │   │   └── session.cache.ts
│   │   │   └── locks/
│   │   │       └── DistributedLock.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── workers/                      # BullMQ worker processes
│   │   ├── src/
│   │   │   ├── RenderWorker.ts
│   │   │   ├── NotificationWorker.ts
│   │   │   ├── EconomyWorker.ts
│   │   │   ├── LeaderboardWorker.ts
│   │   │   ├── AnalyticsWorker.ts
│   │   │   ├── DailyResetWorker.ts
│   │   │   ├── WeeklyResetWorker.ts
│   │   │   └── CleanupWorker.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared/                       # Shared types, constants, utilities
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── game.types.ts
│   │   │   │   ├── discord.types.ts
│   │   │   │   └── api.types.ts
│   │   │   ├── constants/
│   │   │   │   ├── game.constants.ts
│   │   │   │   └── error.codes.ts
│   │   │   └── utils/
│   │   │       ├── math.utils.ts
│   │   │       ├── rng.utils.ts
│   │   │       └── validation.utils.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── config/                       # Configuration management
│       ├── src/
│       │   ├── config.ts
│       │   └── schema.ts
│       └── package.json
│
├── assets/
│   ├── characters/
│   │   ├── sprites/
│   │   ├── portraits/
│   │   └── animations/
│   ├── backgrounds/
│   ├── skills/
│   │   ├── effects/
│   │   └── icons/
│   ├── items/
│   │   └── icons/
│   ├── ui/
│   │   ├── frames/
│   │   ├── bars/
│   │   └── overlays/
│   └── audio/
│       ├── sfx/
│       └── music/
│
├── docs/
│   ├── Book3-Technical-Architecture-Bible.md  ← this file
│   ├── Architecture-Decision-Records.md
│   ├── API-Specification.md
│   ├── Database-Schema.md
│   ├── Deployment-Guide.md
│   └── Engineering-Standards.md
│
├── infra/
│   ├── docker/
│   │   ├── bot.Dockerfile
│   │   ├── workers.Dockerfile
│   │   ├── renderer.Dockerfile
│   │   └── nginx.Dockerfile
│   ├── k8s/
│   │   ├── namespace.yaml
│   │   ├── deployments/
│   │   ├── services/
│   │   ├── configmaps/
│   │   └── hpa/
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── monitoring/
│       ├── prometheus/
│       ├── grafana/
│       └── alertmanager/
│
├── scripts/
│   ├── setup-dev.sh
│   ├── seed-database.sh
│   ├── migrate.sh
│   └── deploy.sh
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── load/
│   └── simulation/
│
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── jest.config.ts
├── turbo.json                        # Turborepo config
├── package.json                      # Root workspace
└── tsconfig.base.json
```

---

### 1.8 Package Organization

The project uses a **monorepo** structure managed by **pnpm workspaces** with **Turborepo** for build orchestration.

**Workspace Configuration (`package.json` root):**

```json
{
  "name": "ascension-legends",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "test": "turbo test",
    "lint": "turbo lint",
    "type-check": "turbo type-check",
    "deploy:commands": "pnpm --filter bot run deploy-commands"
  },
  "devDependencies": {
    "turbo": "^2.x",
    "typescript": "^5.x",
    "prettier": "^3.x",
    "eslint": "^8.x"
  }
}
```

**Turbo Pipeline (`turbo.json`):**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "cache": false
    },
    "lint": {},
    "type-check": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**Package Dependency Graph:**

```
apps/bot
  → packages/services
  → packages/database
  → packages/cache
  → packages/shared
  → packages/config

apps/admin-api
  → packages/services
  → packages/database
  → packages/shared

packages/services
  → packages/engine
  → packages/database
  → packages/cache
  → packages/shared

packages/engine
  → packages/shared

packages/renderer
  → packages/shared
  → packages/database (read-only: asset registry)

packages/workers
  → packages/renderer
  → packages/services
  → packages/database
  → packages/cache
  → packages/shared

packages/database
  → packages/shared

packages/cache
  → packages/shared
```

---

## 2. Discord Bot Architecture

### 2.1 discord.js v14 Architecture

The Discord bot is built on **discord.js v14** with the following key architectural decisions:

**Client Initialization:**

The `Client` is initialized with minimal required intents to reduce gateway traffic. Privileged intents (`GuildMembers`, `MessageContent`) are only enabled when absolutely required and documented with justification.

```
Required Intents:
  - Guilds          (guild data, channel access)
  - GuildMessages   (message events for legacy flow — minimize)
  - DirectMessages  (DM notifications)
  - GuildMembers    (PRIVILEGED — member join/leave events)

Gateway Partials:
  - Channel (for DM channels)
  - Message
  - Reaction
```

**Client Architecture:**

```
Client (discord.js)
  ├── CommandRegistry           (Map<string, CommandDefinition>)
  ├── ComponentRegistry         (Map<string, ComponentHandler>)
  ├── ModalRegistry             (Map<string, ModalHandler>)
  ├── AutocompleteRegistry      (Map<string, AutocompleteHandler>)
  ├── EventRegistry             (Map<string, EventHandler[]>)
  ├── MiddlewareChain           (ordered middleware array)
  ├── ServiceContainer          (dependency injection container)
  └── ShardClient               (IPC bridge to ShardingManager)
```

**Dependency Injection:**

Services are registered in a lightweight DI container (e.g., `tsyringe`) and injected into command handlers. This enables testability — handlers can be unit-tested with mocked services.

```
Container.register(BattleService)
Container.register(ProfileService)
Container.register(EconomyService)
// ...
Container.register(BattleCommand, {
  deps: [BattleService, ProfileService, EconomyService]
})
```

---

### 2.2 Slash Commands

**Command Registration Strategy:**

- Commands are registered **globally** for production. Guild-specific commands are used only for development/testing.
- Commands are deployed via a dedicated `deploy-commands` script run in CI, not at bot startup, to avoid Discord's rate limits on command registration.
- Command definitions are co-located with their handlers in the `commands/` directory.

**Command Structure:**

```
CommandDefinition {
  data: SlashCommandBuilder           // The Discord API definition
  execute: (interaction) => Promise<void>   // Handler
  autocomplete?: (interaction) => Promise<void>
  cooldown?: number                   // seconds
  guildOnly?: boolean
  requiredRoles?: string[]
  deferEphemeral?: boolean
  category: CommandCategory
}
```

**Command Categories and Commands:**

| Category | Commands |
|----------|----------|
| Battle | `/battle`, `/pvp`, `/duel`, `/arena` |
| Profile | `/profile`, `/stats`, `/class`, `/equip`, `/skills` |
| Inventory | `/inventory`, `/use`, `/discard`, `/inspect` |
| Shop | `/shop`, `/buy`, `/sell`, `/craft` |
| Guild | `/guild create`, `/guild invite`, `/guild leave`, `/guild info`, `/guild bank`, `/guild upgrade` |
| Quest | `/quest`, `/quest log`, `/quest turn-in` |
| Raid | `/raid start`, `/raid join`, `/raid status`, `/raid leave` |
| Trade | `/trade`, `/trade accept`, `/trade cancel` |
| Leaderboard | `/leaderboard`, `/rank` |
| Story | `/story`, `/dialogue`, `/explore` |
| Transformation | `/transform` |
| Achievements | `/achievements`, `/titles` |
| Economy | `/balance`, `/daily`, `/weekly` |
| Admin | `/admin user`, `/admin item`, `/admin economy`, `/admin ban` |

**Input Validation:**

All slash command inputs are validated at the command handler level before reaching services. Validation uses Zod schemas:

```
CommandInputSchema.battle = z.object({
  opponent: z.string().min(1),
  wager: z.number().int().min(0).max(MAX_WAGER).optional()
})
```

---

### 2.3 Buttons & Components

**Component ID Format:**

Component custom IDs follow a structured format to enable efficient routing:

```
{action}:{category}:{entityId}:{userId}:{extra}
```

Examples:
- `confirm:battle:abc123:userId123:` — Confirm battle challenge
- `page:inventory:userId123::2` — Inventory page 2
- `equip:item:sword_legendary_001:userId123:` — Equip item
- `cancel:trade:tradeId456:userId123:` — Cancel trade

**Component Registry:**

```
ComponentRegistry
  ├── buttons/
  │   ├── confirm.button.ts       // Generic confirmation
  │   ├── cancel.button.ts        // Generic cancel
  │   ├── page-next.button.ts     // Pagination next
  │   ├── page-prev.button.ts     // Pagination prev
  │   ├── battle-accept.button.ts
  │   ├── battle-decline.button.ts
  │   ├── trade-accept.button.ts
  │   ├── trade-counter.button.ts
  │   ├── equip.button.ts
  │   ├── use-item.button.ts
  │   ├── skill-select.button.ts
  │   └── transform.button.ts
  └── ...
```

**Component Timeout Management:**

Button interactions that expect a response (trade offers, battle challenges, confirmations) are stored in Redis with a TTL. On timeout, the original message is edited to show an expiry notice.

```
Redis key: pending:interaction:{interactionId}
TTL: 300 seconds (5 minutes, configurable per interaction type)
Value: { type, initiatorId, targetId, data, messageId, channelId }
```

**Button State Validation:**

Every button handler validates:
1. The `userId` in the custom ID matches `interaction.user.id` (or is the authorized target).
2. The referenced entity still exists and is in the expected state.
3. The interaction has not expired (Redis TTL check).

---

### 2.4 Select Menus

Select menus are used for multi-choice interactions where slash command options would be too limiting.

**Types Used:**
- `StringSelectMenuBuilder` — skill selection, item selection, class choice
- `UserSelectMenuBuilder` — raid member selection, trade target selection
- `RoleSelectMenuBuilder` — admin role configuration

**Menu Patterns:**

```
Skill Selection Menu:
  - placeholder: "Select a skill to use"
  - options: [{ label, description, value: skillId, emoji }]
  - min_values: 1, max_values: 1

Party Composition Menu (Raid):
  - placeholder: "Select party members (up to 4)"
  - options: available guildmates
  - min_values: 1, max_values: 4

Item Equip Slot Menu:
  - placeholder: "Select equipment slot"
  - options: [weapon, off-hand, helm, chest, legs, boots, ring, amulet]
```

---

### 2.5 Modals

Modals are used for free-text input that cannot be captured in slash command options.

**Modal Registry Entries:**

| Modal ID | Trigger | Fields |
|----------|---------|--------|
| `guild-create` | `/guild create` | Guild name, description, tag |
| `trade-offer` | `/trade` | Item IDs, quantities, gold amount |
| `auction-create` | `/auction create` | Start price, buyout price, duration |
| `report-user` | Context menu on user | Reason, evidence |
| `character-rename` | `/profile rename` | New character name |
| `mail-compose` | `/mail send` | Subject, body |
| `admin-broadcast` | `/admin broadcast` | Message content, scope |

**Modal Structure:**

```
ModalDefinition {
  customId: string
  title: string
  components: TextInputComponent[]
  onSubmit: (interaction: ModalSubmitInteraction) => Promise<void>
  validate: (values: Record<string, string>) => ValidationResult
}
```

---

### 2.6 Autocomplete

Autocomplete is used for item searches, player lookups, and skill selections to improve UX.

**Autocomplete Handlers:**

| Command Option | Data Source | Max Results |
|----------------|-------------|-------------|
| `/shop buy item_id` | Item name search (Redis-cached catalog) | 25 |
| `/trade item` | Player's inventory item names | 25 |
| `/equip item` | Player's unequipped items | 25 |
| `/use item` | Player's consumable items | 25 |
| `/battle @opponent` | Guild member names | 25 |
| `/admin item` | Full item catalog | 25 |

**Autocomplete Strategy:**

Autocomplete responses must be returned within **3 seconds**. Data is served from Redis-cached catalogs to meet this constraint. For per-user data (inventory search), a lightweight query is made to a Redis cache first, falling back to a limited MongoDB projection query.

**Autocomplete Response Builder:**

```
buildAutocompleteChoices(query, items, limit = 25):
  → fuzzy match query against item.name (Fuse.js or simple prefix match)
  → map to { name: string, value: string }
  → slice to limit
  → return ApplicationCommandOptionChoiceData[]
```

---

### 2.7 Context Menus

**User Context Menus:**
- `⚔️ Challenge to Battle` — Right-click a user to initiate a battle
- `🔍 View Profile` — Right-click a user to view their character profile
- `🤝 Send Trade Request` — Right-click a user to open a trade modal
- `🚩 Report Player` — Right-click a user to open report modal

**Message Context Menus:**
- `📋 Battle Replay` — Right-click a battle result message to replay it
- `📌 Pin to Guild Board` — Right-click a message to pin it to guild board

**Registration:**

Context menus are registered as `ContextMenuCommandBuilder` alongside slash commands in the same deploy script.

---

### 2.8 Gateway Events

**Event Handlers:**

| Event | Handler | Purpose |
|-------|---------|---------|
| `ready` | `ReadyHandler` | Log shard ready, initialize cron jobs |
| `interactionCreate` | `InteractionDispatcher` | Route all interactions |
| `guildCreate` | `GuildCreateHandler` | Initialize guild data, send welcome |
| `guildDelete` | `GuildDeleteHandler` | Mark guild data inactive |
| `guildMemberAdd` | `MemberJoinHandler` | Check for existing account, welcome DM |
| `guildMemberRemove` | `MemberLeaveHandler` | Mark member inactive in guild |
| `error` | `ErrorHandler` | Log and Prometheus increment |
| `shardError` | `ShardErrorHandler` | Per-shard error handling |
| `shardResume` | `ShardResumeHandler` | Re-initialize per-shard state |
| `warn` | `WarnHandler` | Structured log warning |

**Event Handler Structure:**

```
EventDefinition {
  event: keyof ClientEvents
  once?: boolean
  execute: (...args: ClientEvents[event]) => Promise<void>
}
```

---

### 2.9 Interaction Lifecycle

**Lifecycle Stages:**

```
1. Receive      discord.js fires interactionCreate
2. Identify     Dispatcher determines type (command/component/autocomplete/modal)
3. Authenticate Check user exists; create account if first-time
4. Rate-limit   Check Redis rate limit bucket for user+command
5. Defer        Call interaction.deferReply() within 3s deadline
6. Permission   Check role/guild permissions
7. Validate     Run input validation (Zod)
8. Execute      Call command/component handler
9. Respond      Edit deferred reply or follow-up
10. Audit       Log interaction to analytics (async, non-blocking)
```

**Middleware Chain:**

```typescript
// Middleware is applied in order; each calls next() to continue
type MiddlewareFn = (
  interaction: AnyInteraction,
  context: InteractionContext,
  next: () => Promise<void>
) => Promise<void>

middlewares = [
  authMiddleware,       // ensures user document exists
  rateLimitMiddleware,  // checks Redis rate bucket
  deferMiddleware,      // calls deferReply at earliest opportunity
  permissionMiddleware, // validates role requirements
  validationMiddleware, // Zod input validation
]
```

**Error Handling in Lifecycle:**

All unhandled errors in command execution are caught by a top-level try/catch in the dispatcher. The error is:
1. Logged with `pino` (structured, includes userId, commandName, guildId, shardId)
2. Tracked in Prometheus (`bot_interaction_errors_total` counter)
3. Responded to the user with a generic error embed (no stack trace)
4. Alerted via PagerDuty if it's a repeated pattern (via Alertmanager)

---

### 2.10 Sharding Strategy

Sharding is required when the bot reaches **2,500 guilds**. The architecture supports sharding from day one.

**ShardingManager Configuration:**

```
ShardingManager {
  file: './dist/client.js',
  totalShards: 'auto',          // Discord recommends 1 shard per 2500 guilds
  shardList: 'auto',
  respawn: true,
  mode: 'process',              // Separate OS processes per shard
}
```

**Cross-Shard Communication:**

Cross-shard operations (e.g., fetching a user who might be in a guild on a different shard) use the ShardingManager's `broadcastEval` mechanism:

```
ShardingManager.broadcastEval(
  client => client.guilds.cache.get(guildId),
  { context: { guildId } }
)
```

For performance-critical operations, cross-shard data is fetched from MongoDB/Redis directly rather than via Discord's in-memory cache.

**Shard Health Monitoring:**

Each shard emits heartbeat metrics to a Redis key: `shard:heartbeat:{shardId}` with a 30-second TTL. A health check worker monitors all expected shard IDs and alerts if any heartbeat is missing.

**Shard-Aware Rate Limiting:**

Rate limit buckets in Redis include the shard ID: `ratelimit:{shardId}:{userId}:{command}` to prevent cross-shard interference.

---

### 2.11 Rate Limits

**Discord API Rate Limits:**

The bot respects Discord's REST API rate limits via discord.js's built-in rate limit handler. Additionally:
- The REST client is configured with `rejectOnRateLimit` for non-critical paths and queue-based retry for critical paths.
- Global rate limits (50 requests/second) are tracked via Redis to prevent shard coordination issues.

**Internal Game Rate Limits:**

All game commands are rate-limited at the application layer, independent of Discord's limits.

| Command Category | Rate Limit | Window |
|-----------------|-----------|--------|
| Battle | 1 battle | Per cooldown (defined in Book 1) |
| Shop purchase | 20 purchases | 60 seconds |
| Trade creation | 5 trades | 60 seconds |
| Profile view | 30 views | 60 seconds |
| Leaderboard | 10 views | 60 seconds |
| Admin commands | 100 ops | 60 seconds |

**Rate Limit Implementation:**

Redis token bucket algorithm:
```
Key: ratelimit:{userId}:{commandCategory}
Algorithm: Token bucket
Storage: Redis string with TTL
Atomic: Lua script for atomicity
```

---

### 2.12 Permission System

**Permission Layers:**

```
Layer 1: Discord Permissions
  - Administrator role check for admin commands
  - Manage Guild permission for guild admin commands

Layer 2: Game Role Permissions
  - PLAYER         base role (all standard commands)
  - GUILD_OFFICER  guild management commands
  - GUILD_LEADER   full guild commands + bank management
  - MODERATOR      moderation commands + admin read
  - ADMIN          all commands + economy manipulation
  - SUPER_ADMIN    full system access

Layer 3: Character State Permissions
  - Cannot battle if currently in a raid
  - Cannot use shop during active trade
  - Cannot run dungeons while a battle is pending

Layer 4: Economy Permissions
  - Anti-cheat validation for transaction amounts
  - Marketplace item ownership verification
```

**Permission Check Flow:**

```
PermissionMiddleware.check(interaction, commandDef):
  1. Check Discord server permissions (if required)
  2. Load user gameRole from Redis cache
  3. Compare gameRole to command.requiredRole
  4. Check character state constraints
  5. Throw PermissionError or call next()
```

---

## 3. Database Architecture — MongoDB

### 3.1 Database Overview

**MongoDB Version:** 7.x  
**Driver:** Mongoose 8.x (ODM) + MongoDB native driver for complex aggregations  
**Topology:** Replica Set (3 nodes: 1 primary, 2 secondaries) in production  
**Authentication:** SCRAM-SHA-256  
**Encryption at Rest:** AES-256 via MongoDB's native WiredTiger encryption  
**Connection Pooling:** Mongoose pool size: 20 per service instance  

**Database Names:**

| Database | Purpose |
|----------|---------|
| `ascension_prod` | Production game data |
| `ascension_staging` | Staging environment |
| `ascension_dev` | Development data |
| `ascension_analytics` | Analytics data (separate DB for isolation) |

**General Schema Conventions:**

- All documents use `_id: ObjectId` (MongoDB default).
- All documents include `createdAt: Date` and `updatedAt: Date` (managed by Mongoose timestamps).
- Soft-delete pattern: documents use `deletedAt: Date | null` rather than hard deletion.
- All monetary values are stored as integers (smallest unit) to avoid floating point.
- Dates are stored as UTC timestamps.
- Enum-like fields use TypeScript string union types, validated at application layer.

---

### 3.2 Users Collection

**Purpose:** Core user authentication and account data, tied to Discord user IDs.

**Schema:**

```typescript
{
  _id: ObjectId,
  discordId: string,              // Discord Snowflake ID (unique)
  username: string,               // Discord username at registration
  discriminator: string,          // Discord discriminator (or "0" for new format)
  globalName: string | null,      // Discord global display name
  avatar: string | null,          // Discord CDN avatar hash
  
  // Account state
  accountStatus: 'active' | 'suspended' | 'banned' | 'inactive',
  banReason: string | null,
  bannedAt: Date | null,
  banExpiry: Date | null,         // null = permanent
  
  // Metadata
  registeredAt: Date,
  lastActiveAt: Date,
  lastGuildId: string | null,     // Most recent guild interaction
  
  // Flags
  isBeta: boolean,
  isPremium: boolean,             // Premium subscription status
  premiumTier: 0 | 1 | 2 | 3,
  premiumExpiry: Date | null,
  
  // Privacy
  isPublicProfile: boolean,
  optOutAnalytics: boolean,
  
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date | null,
}
```

**Relationships:**
- One-to-one with `profiles`
- One-to-many with `characters`

**Indexes:**

```javascript
{ discordId: 1 }                          // unique
{ accountStatus: 1, lastActiveAt: -1 }    // active user queries
{ isPremium: 1, premiumExpiry: 1 }        // premium expiry worker
{ bannedAt: 1 }                           // moderation queries
```

**Validation:**
- `discordId` must match `/^\d{17,19}$/`
- `premiumTier` must be 0–3
- `accountStatus` validated via enum

**Scaling Notes:**
- Expected collection size: ~10M documents at scale.
- `discordId` unique index is the primary lookup path. All user queries start with `discordId`.
- `lastActiveAt` is updated on every interaction; batch-write via Redis→MongoDB sync to reduce write amplification.

---

### 3.3 Profiles Collection

**Purpose:** Game-specific player profile data, separate from authentication. Stores display preferences, global stats, and social data.

**Schema:**

```typescript
{
  _id: ObjectId,
  userId: ObjectId,               // Ref: users._id
  discordId: string,              // Denormalized for fast lookup
  
  // Display
  displayName: string,            // Player-chosen name
  title: string | null,           // Currently equipped title (ref: Book 2 titles)
  bio: string | null,             // Max 200 chars
  profileColor: string,           // Hex color for embed accent
  
  // Global progression
  totalBattlesWon: number,
  totalBattlesLost: number,
  totalRaidsCompleted: number,
  totalDungeonsCompleted: number,
  totalQuestsCompleted: number,
  totalPlaytimeSecs: number,
  
  // Social
  friendIds: ObjectId[],          // Ref: users._id
  blockedIds: ObjectId[],         // Ref: users._id
  guildId: ObjectId | null,       // Ref: guilds._id
  
  // Season
  currentSeason: number,
  seasonPoints: number,
  
  // Battle Pass (ref: battlePass collection)
  battlePassActive: boolean,
  battlePassExpiry: Date | null,
  
  // Settings
  notifications: {
    battleChallenges: boolean,
    guildEvents: boolean,
    tradeRequests: boolean,
    systemMessages: boolean,
  },
  
  createdAt: Date,
  updatedAt: Date,
}
```

**Relationships:**
- One-to-one with `users`
- One-to-many with `characters`
- Many-to-one with `guilds`

**Indexes:**

```javascript
{ userId: 1 }                         // unique
{ discordId: 1 }                      // unique (fast lookup without user join)
{ guildId: 1 }                        // guild member queries
{ totalBattlesWon: -1 }               // global battle leaderboard
{ currentSeason: 1, seasonPoints: -1 }// season leaderboard
```

**Compound Indexes:**

```javascript
{ guildId: 1, totalBattlesWon: -1 }   // guild leaderboard
{ currentSeason: 1, guildId: 1, seasonPoints: -1 }  // season + guild
```

---

### 3.4 Characters Collection

**Purpose:** Character-level data including stats, level, class, and progression. A user may have multiple characters (if multi-character system is enabled per Book 1).

**Schema:**

```typescript
{
  _id: ObjectId,
  userId: ObjectId,               // Ref: users._id
  discordId: string,              // Denormalized
  profileId: ObjectId,            // Ref: profiles._id
  
  // Identity
  name: string,                   // Character name
  classId: string,                // Ref: classes (see Book 2)
  subclassId: string | null,      // Ref: subclasses
  isActive: boolean,              // Is this the currently selected character?
  
  // Core stats (ref: Book 1 stat definitions)
  level: number,                  // 1–100
  experience: number,
  experienceToNextLevel: number,
  
  // Base stats (see Book 1 for formula)
  stats: {
    hp: number,
    maxHp: number,
    mp: number,
    maxMp: number,
    attack: number,
    defense: number,
    magicAttack: number,
    magicDefense: number,
    speed: number,
    luck: number,
    critRate: number,
    critDamage: number,
    evasion: number,
    accuracy: number,
  },
  
  // Derived stats (computed, stored for performance)
  derivedStats: {
    effectiveAttack: number,
    effectiveDefense: number,
    battlePower: number,          // Overall power rating
  },
  
  // Progression
  skillPoints: number,
  statPoints: number,
  awakening: number,              // 0–5 awakening stars (ref: Book 1)
  
  // Location (ref: Book 2 world locations)
  locationId: string,             // Current continent/zone
  zoneId: string,
  
  // State
  currentHp: number,              // HP persisted between sessions
  currentMp: number,
  statusEffects: StatusEffect[],  // Active buffs/debuffs
  
  // Transformation (ref: Book 1 transformation system)
  transformationId: string | null,
  transformationExpiry: Date | null,
  
  // Equipment slots (ref: equipment collection)
  equippedItems: {
    weapon: ObjectId | null,
    offHand: ObjectId | null,
    helm: ObjectId | null,
    chest: ObjectId | null,
    legs: ObjectId | null,
    boots: ObjectId | null,
    ring1: ObjectId | null,
    ring2: ObjectId | null,
    amulet: ObjectId | null,
    relic: ObjectId | null,
  },
  
  // Active skills
  equippedSkills: {
    slot1: string | null,         // Skill ID (ref: skills)
    slot2: string | null,
    slot3: string | null,
    slot4: string | null,
    ultimate: string | null,
  },
  
  // Cooldowns
  cooldowns: {
    lastBattleAt: Date | null,
    lastDungeonAt: Date | null,
    lastRaidAt: Date | null,
    lastDailyAt: Date | null,
  },
  
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date | null,
}

type StatusEffect = {
  effectId: string,
  name: string,
  stacks: number,
  duration: number,               // Remaining turns
  appliedAt: Date,
  sourceCharacterId: ObjectId | null,
}
```

**Relationships:**
- Many-to-one with `users`
- Many-to-many with `skills` (via equippedSkills)
- One-to-many with `inventory` items
- References `equipment` documents

**Indexes:**

```javascript
{ userId: 1, isActive: 1 }            // Get active character for user
{ discordId: 1, isActive: 1 }         // Fast active character lookup
{ classId: 1, level: -1 }             // Class leaderboards
{ derivedStats.battlePower: -1 }      // Global power ranking
{ locationId: 1, zoneId: 1 }          // Zone population queries
{ 'cooldowns.lastBattleAt': 1 }       // Cooldown queries
```

**Compound Indexes:**

```javascript
{ level: -1, classId: 1 }             // Class+level ranking
{ userId: 1, deletedAt: 1 }           // User's characters (non-deleted)
```

**Validation:**
- `level` must be 1–100 (configurable MAX_LEVEL)
- `awakening` must be 0–5
- `equippedSkills` slots must reference owned, unlocked skill IDs
- Stats must satisfy minimum positive values

**Scaling Notes:**
- Hot document — updated on every battle, quest, and action.
- `currentHp`, `currentMp`, and `statusEffects` updated frequently; consider Redis-only persistence for active sessions with periodic flush.
- `derivedStats.battlePower` recomputed via background worker after any equipment/skill change.

---

### 3.5 Classes Collection

**Purpose:** Static class and subclass definitions. This is primarily a read-heavy, rarely-updated collection. Sourced from Book 2 class definitions.

**Schema:**

```typescript
{
  _id: ObjectId,
  classId: string,                // Unique identifier e.g. "warrior", "mage"
  name: string,
  description: string,
  lore: string,                   // Flavor text (ref: Book 2)
  
  // Visual
  portraitAssetId: string,        // Asset pipeline reference
  iconAssetId: string,
  colorHex: string,
  
  // Base stat modifiers (multipliers applied to base stats)
  statModifiers: {
    hp: number,
    attack: number,
    defense: number,
    magicAttack: number,
    magicDefense: number,
    speed: number,
  },
  
  // Growth rates per level (ref: Book 1 progression tables)
  growthRates: {
    hp: number,
    attack: number,
    // ... all stats
  },
  
  // Available skills (ref: skills collection)
  availableSkillIds: string[],
  startingSkillIds: string[],
  
  // Subclasses (unlocked at specific levels, ref: Book 2)
  subclasses: Subclass[],
  
  // Armor/weapon proficiencies
  weaponTypes: WeaponType[],
  armorTypes: ArmorType[],
  
  // Transformation (ref: Book 1 transformation system)
  transformationIds: string[],
  
  isPlayable: boolean,
  isHidden: boolean,
  unlockRequirements: UnlockRequirement | null,
  
  version: number,                // For cache invalidation
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**

```javascript
{ classId: 1 }                    // unique
{ isPlayable: 1 }                 // Available classes query
```

**Scaling Notes:**
- Small collection (~20–30 documents). Fully cached in Redis with long TTL (1 hour).
- Version field triggers cache invalidation when class data changes.

---

### 3.6 Inventory Collection

**Purpose:** Player item ownership. One document per owned item stack. Supports stacking for consumables and materials; unique items are quantity 1.

**Schema:**

```typescript
{
  _id: ObjectId,
  userId: ObjectId,               // Ref: users._id
  discordId: string,              // Denormalized
  characterId: ObjectId,          // Ref: characters._id (items may be char-specific)
  
  // Item reference
  itemId: string,                 // Static item ID (ref: Book 2 item catalog)
  
  // Item data snapshot (denormalized for display performance)
  itemName: string,
  itemType: ItemType,             // 'weapon' | 'armor' | 'consumable' | 'material' | 'cosmetic' | 'key'
  itemRarity: ItemRarity,         // 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
  
  // Ownership
  quantity: number,               // >= 1
  isEquipped: boolean,
  equippedSlot: EquipmentSlot | null,
  
  // For unique/crafted items with stats
  itemInstance: ItemInstance | null,  // null for standard items
  
  // Trade state
  isLocked: boolean,              // Locked during active trade/auction
  lockReason: string | null,
  lockExpiry: Date | null,
  
  // Source tracking
  acquiredFrom: AcquisitionSource, // 'drop' | 'craft' | 'purchase' | 'trade' | 'reward'
  acquiredAt: Date,
  
  createdAt: Date,
  updatedAt: Date,
}

type ItemInstance = {
  // For enchanted/crafted items with modified stats
  bonusStats: Partial<CharacterStats>,
  enchantmentLevel: number,
  enchantmentIds: string[],
  durability: number,
  maxDurability: number,
  isSoulbound: boolean,
}
```

**Relationships:**
- Many-to-one with `users`
- Many-to-one with `characters`
- Referenced by `equipment`, `trades`, `auctions`

**Indexes:**

```javascript
{ userId: 1, itemType: 1 }             // User's items by type
{ characterId: 1, isEquipped: 1 }      // Character's equipped items
{ userId: 1, itemId: 1 }               // Check if user has specific item
{ isLocked: 1, lockExpiry: 1 }         // Cleanup locked items
{ itemRarity: 1, itemType: 1 }         // Marketplace browsing
```

**Compound Indexes:**

```javascript
{ userId: 1, itemRarity: 1, itemType: 1 }   // Inventory filter
{ characterId: 1, itemType: 1, isEquipped: 1 }
```

**Validation:**
- `quantity` must be >= 1
- `isEquipped` and `equippedSlot` must be consistent
- Locked items cannot be traded or discarded until `lockExpiry`

**Scaling Notes:**
- High-volume collection. Use partial indexes on `isLocked` (only index `true`) to reduce index overhead.
- Item quantity updates use MongoDB `$inc` for atomicity.

---

### 3.7 Equipment Collection

**Purpose:** Tracks the currently equipped configuration of each character across all equipment slots. Acts as an index for fast equipment lookups.

**Schema:**

```typescript
{
  _id: ObjectId,
  characterId: ObjectId,          // Ref: characters._id (unique)
  userId: ObjectId,               // Ref: users._id (denormalized)
  
  slots: {
    weapon: EquippedSlotData | null,
    offHand: EquippedSlotData | null,
    helm: EquippedSlotData | null,
    chest: EquippedSlotData | null,
    legs: EquippedSlotData | null,
    boots: EquippedSlotData | null,
    ring1: EquippedSlotData | null,
    ring2: EquippedSlotData | null,
    amulet: EquippedSlotData | null,
    relic: EquippedSlotData | null,
  },
  
  // Computed aggregate stats from all equipment (cached here)
  aggregatedStats: Partial<CharacterStats>,
  
  // Set bonuses active
  activeSetBonuses: SetBonus[],
  
  lastComputedAt: Date,
  createdAt: Date,
  updatedAt: Date,
}

type EquippedSlotData = {
  inventoryId: ObjectId,          // Ref: inventory._id
  itemId: string,
  itemName: string,
  stats: Partial<CharacterStats>,
  enchantmentLevel: number,
}
```

**Indexes:**

```javascript
{ characterId: 1 }                // unique — one equipment document per character
{ userId: 1 }                     // user's equipment lookup
```

---

### 3.8 Skills Collection

**Purpose:** Static skill definitions. These are game-data documents, not per-player.

**Schema:**

```typescript
{
  _id: ObjectId,
  skillId: string,                // Unique e.g. "fireball_rank1"
  name: string,
  description: string,
  lore: string | null,
  
  // Classification
  type: 'active' | 'passive' | 'ultimate',
  element: Element | null,        // 'fire' | 'ice' | 'lightning' | 'dark' | 'light' | 'physical'
  targetType: 'single' | 'aoe' | 'self' | 'ally' | 'all_enemies',
  
  // Unlock
  classIds: string[],             // Classes that can learn this
  requiredLevel: number,
  requiredSkillId: string | null, // Prerequisite skill
  skillTreePosition: { x: number, y: number } | null,
  
  // Cost
  mpCost: number,
  hpCost: number,                 // e.g., blood magic
  cooldownTurns: number,
  
  // Effect (ref: Book 1 skill formula definitions)
  effectType: SkillEffectType,
  baseValue: number,
  scaling: {
    attackPercent: number,
    magicAttackPercent: number,
    hpPercent: number,
    levelScale: number,
  },
  
  // Status effects applied
  statusEffects: {
    effectId: string,
    chance: number,               // 0–1
    duration: number,             // turns
    stacks: number,
  }[],
  
  // Upgrade ranks (e.g., Fireball Rank 1 → Rank 5)
  maxRank: number,
  rankBonuses: RankBonus[],
  
  // Visual
  iconAssetId: string,
  animationAssetId: string,
  particleEffectId: string,
  sfxId: string,
  
  version: number,
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**

```javascript
{ skillId: 1 }                    // unique
{ classIds: 1, requiredLevel: 1 } // Skills available to a class at a level
{ type: 1 }                       // Active/passive/ultimate filter
{ element: 1 }                    // Element filter
```

**Scaling Notes:**
- Read-only in production. Fully cached in Redis with version-based invalidation.
- ~500–1000 skill definitions expected.

---

### 3.9 Guilds Collection

**Purpose:** Guild metadata, configuration, and aggregate stats.

**Schema:**

```typescript
{
  _id: ObjectId,
  guildDiscordId: string,         // DEPRECATED: use guildId for Discord guild
  
  // Identity
  name: string,                   // Max 32 chars
  tag: string,                    // 2-6 char tag e.g. "[ASCE]"
  description: string | null,
  iconUrl: string | null,
  bannerUrl: string | null,
  colorHex: string,
  
  // Leadership
  leaderId: ObjectId,             // Ref: users._id
  officerIds: ObjectId[],         // Ref: users._id[]
  
  // Guild level and XP (ref: Book 1 guild progression)
  level: number,                  // 1–30
  experience: number,
  
  // Bank
  bankGold: number,               // Integer, gold coins
  bankItems: GuildBankSlot[],
  
  // Stats
  memberCount: number,            // Denormalized counter
  maxMembers: number,             // Based on guild level
  totalWins: number,
  totalRaids: number,
  
  // Discord integration
  discordGuildId: string,         // The Discord server this guild operates in
  announcementChannelId: string | null,
  
  // Settings
  joinRequirements: {
    minLevel: number,
    minBattlePower: number,
    requireApplication: boolean,
  },
  isPublic: boolean,
  isRecruiting: boolean,
  
  // Season
  seasonRank: number,
  seasonPoints: number,
  
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date | null,
}

type GuildBankSlot = {
  inventoryId: ObjectId | null,   // Ref: inventory._id
  itemId: string,
  quantity: number,
  depositedBy: ObjectId,          // Ref: users._id
  depositedAt: Date,
}
```

**Indexes:**

```javascript
{ name: 1 }                       // unique (case insensitive)
{ tag: 1 }                        // unique (case insensitive)
{ leaderId: 1 }                   // Leader's guild lookup
{ discordGuildId: 1 }             // Discord server → game guild mapping
{ level: -1, seasonPoints: -1 }   // Guild leaderboard
{ isPublic: 1, isRecruiting: 1 }  // Guild discovery
```

---

### 3.10 GuildMembers Collection

**Purpose:** Membership records linking users to guilds. Separate from guilds collection to enable efficient member queries.

**Schema:**

```typescript
{
  _id: ObjectId,
  guildId: ObjectId,              // Ref: guilds._id
  userId: ObjectId,               // Ref: users._id
  discordId: string,              // Denormalized
  characterId: ObjectId,          // Primary character associated with membership
  
  // Role
  role: 'member' | 'officer' | 'leader',
  
  // Contribution
  weeklyContribution: number,
  totalContribution: number,
  
  // Status
  joinedAt: Date,
  lastActiveAt: Date,
  isActive: boolean,
  
  // Permissions (can override default role permissions)
  customPermissions: GuildPermission[],
  
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**

```javascript
{ guildId: 1, userId: 1 }         // unique (member in guild)
{ userId: 1 }                     // User's guild memberships
{ guildId: 1, role: 1 }           // Officers/leaders in guild
{ guildId: 1, weeklyContribution: -1 }  // Contribution leaderboard
{ guildId: 1, isActive: 1, lastActiveAt: -1 }  // Inactive member cleanup
```

---

### 3.11 Raids Collection

**Purpose:** Active and historical raid sessions. A raid is a multiplayer dungeon encounter (ref: Book 2 raid definitions).

**Schema:**

```typescript
{
  _id: ObjectId,
  raidId: string,                 // Human-readable ID e.g. "raid-2024-001"
  
  // Definition
  raidTemplateId: string,         // Ref: Book 2 raid definitions
  difficulty: 'normal' | 'hard' | 'extreme' | 'nightmare',
  
  // State
  status: 'forming' | 'active' | 'completed' | 'failed' | 'expired',
  
  // Party
  leaderId: ObjectId,             // Ref: users._id
  participants: RaidParticipant[],
  maxParticipants: number,        // 4, 8, 16, or 24 depending on raid type
  
  // Progress
  currentBossId: string | null,
  bossesDefeated: string[],
  totalBosses: number,
  
  // Battle state
  currentBattleId: ObjectId | null,
  
  // Timing
  startedAt: Date | null,
  completedAt: Date | null,
  expiresAt: Date,                // Auto-expire if not completed
  
  // Rewards (ref: Book 2 loot tables)
  rewardsDistributed: boolean,
  lootDrops: LootDrop[],
  
  // Discord
  discordGuildId: string,
  announcementMessageId: string | null,
  
  createdAt: Date,
  updatedAt: Date,
}

type RaidParticipant = {
  userId: ObjectId,
  characterId: ObjectId,
  role: 'leader' | 'tank' | 'dps' | 'healer' | 'support',
  isReady: boolean,
  joinedAt: Date,
  currentHp: number,
  isDead: boolean,
  damageDealt: number,
  healingDone: number,
}
```

**Indexes:**

```javascript
{ status: 1, createdAt: -1 }      // Active raids
{ leaderId: 1 }                   // User's raids
{ 'participants.userId': 1 }      // User in raid
{ discordGuildId: 1, status: 1 }  // Guild's active raids
{ expiresAt: 1 }                  // TTL cleanup
{ raidTemplateId: 1, difficulty: 1, completedAt: -1 } // Analytics
```

---

### 3.12 Bosses Collection

**Purpose:** Active world boss spawns and their current state.

**Schema:**

```typescript
{
  _id: ObjectId,
  bossTemplateId: string,         // Ref: Book 2 boss definitions
  
  // State
  status: 'spawning' | 'active' | 'defeated' | 'despawned',
  
  // Stats (snapshot from template, modified by spawn scaling)
  currentHp: number,
  maxHp: number,
  stats: BossStats,
  
  // Location
  locationId: string,             // Ref: Book 2 world map
  discordGuildId: string,         // Boss is per-server
  
  // Engagement
  attackers: BossAttacker[],
  
  // Phases (ref: Book 1 boss phase system)
  currentPhase: number,
  phases: BossPhase[],
  
  // Timing
  spawnedAt: Date,
  defeatedAt: Date | null,
  despawnAt: Date,                // Auto-despawn timer
  
  // Rewards
  rewardPool: RewardPool,
  rewardsDistributed: boolean,
  
  createdAt: Date,
  updatedAt: Date,
}

type BossAttacker = {
  userId: ObjectId,
  characterId: ObjectId,
  damageDealt: number,
  lastAttackAt: Date,
}
```

**Indexes:**

```javascript
{ status: 1, discordGuildId: 1 }  // Active bosses per server
{ bossTemplateId: 1, status: 1 }  // Boss type status
{ despawnAt: 1 }                  // Auto-despawn worker
{ 'attackers.userId': 1 }         // User's boss participation
```

---

### 3.13 Monsters Collection

**Purpose:** Static monster definitions. Used by battle engine for encounter generation. Content sourced from Book 2.

**Schema:**

```typescript
{
  _id: ObjectId,
  monsterId: string,              // Unique e.g. "goblin_warrior_01"
  name: string,
  description: string | null,
  lore: string | null,
  
  // Classification
  type: 'normal' | 'elite' | 'champion' | 'boss' | 'world_boss',
  element: Element | null,
  biome: string[],                // Where this monster spawns (ref: Book 2)
  
  // Base stats (scaled by encounter level)
  baseStats: MonsterStats,
  
  // Abilities
  skillIds: string[],             // Ref: skills collection
  specialMechanics: SpecialMechanic[],
  
  // Loot table (ref: Book 2)
  lootTableId: string,
  baseExpReward: number,
  baseGoldReward: number,
  
  // Visual
  spriteAssetId: string,
  portraitAssetId: string,
  
  version: number,
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**

```javascript
{ monsterId: 1 }                  // unique
{ type: 1, biome: 1 }             // Encounter generation
{ element: 1 }                    // Element-based queries
```

**Scaling Notes:**
- Read-only in production. Fully cached in Redis. ~500–2000 monster definitions.

---

### 3.14 NPCs Collection

**Purpose:** NPC definitions for story dialogue, shops, and quest givers. Sourced from Book 2.

**Schema:**

```typescript
{
  _id: ObjectId,
  npcId: string,
  name: string,
  title: string | null,
  description: string,
  
  // Type
  type: 'quest_giver' | 'merchant' | 'story' | 'trainer' | 'innkeeper',
  
  // Location (ref: Book 2)
  locationId: string,
  cityId: string,
  
  // Dialogue (ref: Book 2 story scripts)
  dialogueTrees: DialogueTree[],
  
  // Shop inventory (for merchant NPCs)
  shopInventory: ShopItem[] | null,
  shopRefreshIntervalHours: number | null,
  
  // Quest associations
  questIds: string[],             // Quests this NPC gives/completes
  
  // Visual
  portraitAssetId: string,
  
  version: number,
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**

```javascript
{ npcId: 1 }                      // unique
{ locationId: 1, type: 1 }        // Location NPCs by type
{ questIds: 1 }                   // NPCs for a quest
```

---

### 3.15 Marketplace Collection

**Purpose:** Active marketplace listings for player-to-player item sales.

**Schema:**

```typescript
{
  _id: ObjectId,
  
  // Seller
  sellerId: ObjectId,             // Ref: users._id
  sellerDiscordId: string,        // Denormalized
  
  // Item
  inventoryId: ObjectId,          // Ref: inventory._id
  itemId: string,
  itemName: string,
  itemType: ItemType,
  itemRarity: ItemRarity,
  quantity: number,
  itemSnapshot: ItemSnapshot,     // Full item data at time of listing
  
  // Pricing
  pricePerUnit: number,           // In gold coins (integer)
  totalPrice: number,             // pricePerUnit * quantity
  currency: 'gold' | 'premium',
  
  // Status
  status: 'active' | 'sold' | 'cancelled' | 'expired',
  
  // Timing
  listedAt: Date,
  expiresAt: Date,                // 7 days default
  soldAt: Date | null,
  
  // Buyer (filled when sold)
  buyerId: ObjectId | null,
  buyerDiscordId: string | null,
  
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**

```javascript
{ status: 1, itemType: 1, pricePerUnit: 1 }  // Marketplace browse
{ status: 1, itemId: 1, pricePerUnit: 1 }    // Specific item search
{ status: 1, itemRarity: 1, pricePerUnit: 1 } // Rarity filter
{ sellerId: 1, status: 1 }                   // Seller's listings
{ expiresAt: 1, status: 1 }                  // Expiry worker
```

**Compound Indexes:**

```javascript
{ status: 1, currency: 1, itemType: 1, pricePerUnit: 1 }  // Full browse
```

---

### 3.16 Trades Collection

**Purpose:** Direct player-to-player trade negotiations.

**Schema:**

```typescript
{
  _id: ObjectId,
  
  // Parties
  initiatorId: ObjectId,          // Ref: users._id
  receiverId: ObjectId,           // Ref: users._id
  
  // Offers (items + gold from each side)
  initiatorOffer: TradeOffer,
  receiverOffer: TradeOffer,
  
  // Status
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'cancelled' | 'completed' | 'expired',
  
  // Counters (if receiver modifies offer)
  counterHistory: TradeCounter[],
  
  // Discord
  discordGuildId: string,
  interactionMessageId: string | null,
  
  // Timing
  initiatedAt: Date,
  expiresAt: Date,                // 10 minutes
  completedAt: Date | null,
  
  createdAt: Date,
  updatedAt: Date,
}

type TradeOffer = {
  userId: ObjectId,
  items: { inventoryId: ObjectId, quantity: number }[],
  gold: number,
  isLocked: boolean,              // "ready" state
  lockedAt: Date | null,
}
```

**Indexes:**

```javascript
{ initiatorId: 1, status: 1 }     // User's outgoing trades
{ receiverId: 1, status: 1 }      // User's incoming trades
{ status: 1, expiresAt: 1 }       // Expiry cleanup
```

---

### 3.17 Auctions Collection

**Purpose:** Auction-style listings with bid history.

**Schema:**

```typescript
{
  _id: ObjectId,
  
  sellerId: ObjectId,
  sellerDiscordId: string,
  
  // Item
  inventoryId: ObjectId,
  itemId: string,
  itemName: string,
  itemRarity: ItemRarity,
  itemSnapshot: ItemSnapshot,
  
  // Pricing
  startingBid: number,
  currentBid: number,
  buyoutPrice: number | null,
  reservePrice: number | null,
  
  // Status
  status: 'active' | 'sold' | 'no_sale' | 'cancelled',
  
  // Bids
  bids: Bid[],
  highBidderId: ObjectId | null,
  highBidderDiscordId: string | null,
  
  // Timing
  startedAt: Date,
  endsAt: Date,
  
  createdAt: Date,
  updatedAt: Date,
}

type Bid = {
  bidderId: ObjectId,
  amount: number,
  bidAt: Date,
}
```

**Indexes:**

```javascript
{ status: 1, endsAt: 1 }          // Active auctions ending soon
{ itemId: 1, status: 1 }          // Auctions for a specific item
{ sellerId: 1 }                   // Seller's auctions
{ 'bids.bidderId': 1 }            // User's bid history
{ endsAt: 1, status: 1 }          // Auction resolution worker
```

---

### 3.18 Economy Collection

**Purpose:** Player wallet data — gold, premium currency, transaction history.

**Schema:**

```typescript
{
  _id: ObjectId,
  userId: ObjectId,               // Ref: users._id (unique)
  discordId: string,              // Denormalized
  
  // Balances (integers — gold in coins, gems in points)
  gold: number,                   // Standard in-game currency
  gems: number,                   // Premium currency
  seasonalTokens: number,         // Season-limited currency
  
  // Lifetime stats
  totalGoldEarned: number,
  totalGoldSpent: number,
  totalGemsEarned: number,
  totalGemsSpent: number,
  
  // Anti-cheat tracking
  lastGoldDelta: number,          // Last transaction amount
  lastTransactionAt: Date | null,
  suspiciousActivityScore: number, // 0–100; triggers review at 80+
  
  createdAt: Date,
  updatedAt: Date,
}
```

**Relationships:**
- One-to-one with `users`

**Indexes:**

```javascript
{ userId: 1 }                     // unique
{ discordId: 1 }                  // unique
{ gold: -1 }                      // Richest players leaderboard
{ suspiciousActivityScore: -1 }   // Anti-cheat review queue
```

**Validation:**
- `gold` must be >= 0 (never negative)
- `gems` must be >= 0
- All debits go through `EconomyService.debit()` which enforces atomicity and minimum balance checks.

**Scaling Notes:**
- Every economy operation acquires a distributed Redis lock on `lock:economy:{userId}`.
- Balances are mirrored in Redis for fast reads; MongoDB is the source of truth.

---

### 3.19 Achievements Collection

**Purpose:** Achievement definitions (static) and player progress tracking.

**Schema (Definition):**

```typescript
{
  _id: ObjectId,
  achievementId: string,
  name: string,
  description: string,
  category: AchievementCategory,  // 'combat' | 'social' | 'economy' | 'story' | 'exploration' | 'collection'
  
  // Requirements
  type: 'count' | 'one_time' | 'cumulative',
  requirement: {
    metric: string,               // e.g., 'battles_won', 'gold_earned'
    threshold: number,
  },
  
  // Reward
  rewardGold: number,
  rewardGems: number,
  rewardItemId: string | null,
  rewardTitleId: string | null,
  
  // Display
  iconAssetId: string,
  isSecret: boolean,
  points: number,                 // Achievement score contribution
  
  version: number,
  createdAt: Date,
  updatedAt: Date,
}
```

**Schema (Player Progress):**

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  discordId: string,
  
  achievements: {
    [achievementId: string]: {
      unlockedAt: Date | null,
      progress: number,
      isCompleted: boolean,
    }
  },
  
  totalPoints: number,
  completedCount: number,
  
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes (Player Progress):**

```javascript
{ userId: 1 }                     // unique
{ totalPoints: -1 }               // Achievement leaderboard
{ 'achievements.*.isCompleted': 1 } // Global unlock tracking
```

---

### 3.20 BattlePass Collection

**Purpose:** Season battle pass progression and rewards.

**Schema:**

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  discordId: string,
  
  // Season
  seasonId: number,
  
  // Tier progression
  currentTier: number,            // 1–100
  currentXP: number,
  xpToNextTier: number,
  
  // Premium
  hasPremiumPass: boolean,
  premiumPurchasedAt: Date | null,
  
  // Claimed rewards
  claimedRewards: {
    tier: number,
    rewardId: string,
    claimedAt: Date,
    isPremium: boolean,
  }[],
  
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**

```javascript
{ userId: 1, seasonId: 1 }        // unique per season
{ seasonId: 1, currentTier: -1 }  // Season tier leaderboard
```

---

### 3.21 Quests Collection

**Purpose:** Quest definitions (static) and per-player quest state.

**Schema (Definition):**

```typescript
{
  _id: ObjectId,
  questId: string,
  
  // Identity
  name: string,
  description: string,
  category: 'main' | 'side' | 'daily' | 'weekly' | 'guild' | 'event',
  chapter: number | null,         // Story chapter (ref: Book 2)
  
  // Requirements
  prerequisites: string[],        // Ref: questIds that must be completed first
  minLevel: number,
  
  // Objectives
  objectives: QuestObjective[],
  
  // NPC
  giverNpcId: string | null,
  completionNpcId: string | null,
  
  // Reward
  rewardXp: number,
  rewardGold: number,
  rewardItems: { itemId: string, quantity: number }[],
  rewardTitleId: string | null,
  rewardNextQuestId: string | null,
  
  // Timing (for daily/weekly)
  isRepeatable: boolean,
  repeatIntervalHours: number | null,
  
  isActive: boolean,
  version: number,
  createdAt: Date,
  updatedAt: Date,
}

type QuestObjective = {
  objectiveId: string,
  description: string,
  type: 'kill' | 'collect' | 'visit' | 'talk' | 'craft' | 'win_battle',
  targetId: string,               // Monster ID, item ID, location ID, etc.
  required: number,
  isOrdered: boolean,
}
```

**Schema (Player State):**

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  discordId: string,
  
  activeQuests: ActiveQuestEntry[],
  completedQuests: { questId: string, completedAt: Date }[],
  
  // Daily/weekly tracking
  lastDailyReset: Date,
  lastWeeklyReset: Date,
  
  createdAt: Date,
  updatedAt: Date,
}

type ActiveQuestEntry = {
  questId: string,
  progress: { [objectiveId: string]: number },
  acceptedAt: Date,
  expiresAt: Date | null,
}
```

**Indexes (Player State):**

```javascript
{ userId: 1 }                     // unique
{ 'activeQuests.questId': 1 }     // Quest participation queries
{ 'completedQuests.questId': 1 }  // Completed quest checks
```

---

### 3.22 Story Collection

**Purpose:** Player story progression — which chapters, scenes, and dialogues have been encountered.

**Schema:**

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  discordId: string,
  
  currentChapter: number,
  currentScene: string | null,
  
  // Chapter completion
  chaptersCompleted: number[],
  
  // Scene/dialogue state
  sceneHistory: {
    sceneId: string,
    viewedAt: Date,
    choices: { nodeId: string, choiceId: string }[],
  }[],
  
  // NPC relationship scores (ref: Book 2)
  npcRelationships: {
    [npcId: string]: number        // -100 to 100
  },
  
  // Flags for branching story (ref: Book 2 story flags)
  storyFlags: {
    [flagId: string]: boolean | number | string
  },
  
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**

```javascript
{ userId: 1 }                     // unique
{ currentChapter: 1 }             // Players on same chapter (analytics)
```

---

### 3.23 Notifications Collection

**Purpose:** Queued in-game notifications to be delivered to players.

**Schema:**

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  discordId: string,
  
  type: NotificationType,         // 'battle_challenge' | 'trade_offer' | 'guild_event' | 'system' | 'achievement' | 'raid_invite'
  title: string,
  message: string,
  
  // Optional action data
  actionType: string | null,
  actionData: Record<string, unknown> | null,
  
  // Delivery
  status: 'pending' | 'delivered' | 'failed' | 'dismissed',
  deliveredAt: Date | null,
  
  // TTL
  expiresAt: Date,
  
  // Priority
  priority: 'low' | 'normal' | 'high' | 'urgent',
  
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**

```javascript
{ userId: 1, status: 1, priority: -1 }  // User's pending notifications
{ status: 1, expiresAt: 1 }             // Cleanup expired
{ createdAt: -1 }                        // TTL index (MongoDB TTL)
```

**Scaling Notes:**
- TTL index on `expiresAt` automatically removes old notifications.

---

### 3.24 Mail Collection

**Purpose:** In-game mailbox for longer messages, item attachments, and system rewards.

**Schema:**

```typescript
{
  _id: ObjectId,
  
  // Sender
  senderType: 'player' | 'system' | 'gm',
  senderId: ObjectId | null,      // null for system mail
  senderDiscordId: string | null,
  senderName: string,             // Display name at time of send
  
  // Recipient
  recipientId: ObjectId,
  recipientDiscordId: string,
  
  // Content
  subject: string,
  body: string,
  
  // Attachments
  attachedItems: { itemId: string, quantity: number, assetData: unknown }[],
  attachedGold: number,
  
  // State
  isRead: boolean,
  readAt: Date | null,
  attachmentsClaimed: boolean,
  attachmentsClaimedAt: Date | null,
  
  // TTL
  expiresAt: Date,                // 30 days for player mail, 7 days for system
  
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**

```javascript
{ recipientId: 1, isRead: 1, createdAt: -1 }   // Inbox
{ recipientId: 1, attachmentsClaimed: 1 }       // Unclaimed items
{ expiresAt: 1 }                                // TTL index
```

---

### 3.25 Analytics Collection

**Purpose:** Game telemetry events for product analytics. Stored in a separate `ascension_analytics` database.

**Schema:**

```typescript
{
  _id: ObjectId,
  
  eventType: string,              // e.g., 'battle_started', 'item_purchased'
  eventVersion: number,           // Schema version for this event type
  
  // Who
  userId: ObjectId | null,
  discordId: string | null,
  guildId: string | null,
  shardId: number,
  
  // What
  properties: Record<string, unknown>,
  
  // Context
  commandName: string | null,
  interactionId: string | null,
  
  timestamp: Date,
  
  // Processing
  processed: boolean,             // Has been aggregated
  processedAt: Date | null,
}
```

**Indexes:**

```javascript
{ eventType: 1, timestamp: -1 }   // Event query by type
{ userId: 1, timestamp: -1 }      // User funnel analysis
{ guildId: 1, eventType: 1 }      // Guild analytics
{ processed: 1, timestamp: -1 }   // Analytics worker queue
{ timestamp: -1 }                 // TTL index (90-day retention)
```

---

### 3.26 Moderation Collection

**Purpose:** Moderation actions, ban records, and reports.

**Schema:**

```typescript
{
  _id: ObjectId,
  
  // Action
  actionType: 'warn' | 'mute' | 'ban' | 'unban' | 'item_removal' | 'economy_correction' | 'account_flag',
  
  // Target
  targetUserId: ObjectId,
  targetDiscordId: string,
  
  // Actor
  moderatorId: ObjectId | null,   // null = system auto-action
  moderatorDiscordId: string | null,
  
  // Detail
  reason: string,
  evidence: string | null,        // URL or description
  
  // Duration (for mutes/temporary bans)
  duration: number | null,        // seconds
  expiresAt: Date | null,
  
  // Status
  isActive: boolean,              // Is this action still in effect?
  revokedAt: Date | null,
  revokedBy: ObjectId | null,
  revokeReason: string | null,
  
  // Metadata
  ipAddress: string | null,       // Hashed
  guildId: string | null,
  
  createdAt: Date,
  updatedAt: Date,
}
```

**Indexes:**

```javascript
{ targetUserId: 1, actionType: 1, isActive: 1 }  // User's active actions
{ moderatorId: 1, createdAt: -1 }                // Moderator history
{ expiresAt: 1, isActive: 1 }                    // Expiry worker
{ createdAt: -1 }                                // Recent actions feed
```

---

## 4. Redis Architecture

### 4.1 Caching Strategy

Redis 7.x is deployed as a cluster (3 masters, 3 replicas) for high availability and horizontal scalability.

**Namespace Convention:**

All Redis keys follow the pattern `{namespace}:{entity}:{id}:{field}` to enable namespace-based batch invalidation and monitoring.

```
Namespaces:
  char:       Character data cache
  economy:    Economy/balance cache
  catalog:    Static game data (items, skills, classes)
  leaderboard: Leaderboard sorted sets
  session:    Interaction session data
  ratelimit:  Rate limiting buckets
  lock:       Distributed locks
  cooldown:   Game mechanic cooldowns
  pending:    Pending interaction state
```

**Cache Hierarchy:**

```
Hot path read:
  L1: Application memory (Node.js Map, 5-second TTL)
  L2: Redis cluster (sub-millisecond)
  L3: MongoDB (primary source of truth)

Write path:
  MongoDB (write-through or write-behind depending on data criticality)
  Redis invalidated or updated on write
```

**Cache-Aside Pattern (most data):**

```
function getData(id):
  1. Check Redis → if hit, return
  2. Query MongoDB
  3. Write to Redis with TTL
  4. Return data
```

**Write-Through Pattern (economy, character HP):**

```
function updateCritical(id, delta):
  1. Acquire distributed lock
  2. Write to MongoDB (primary)
  3. Update Redis cache
  4. Release lock
```

---

### 4.2 Distributed Locks

**Implementation:** Redlock algorithm (via `redlock` npm package).

**Lock Namespaces:**

| Lock Key | Purpose | TTL |
|----------|---------|-----|
| `lock:economy:{userId}` | Economy transactions | 5s |
| `lock:inventory:{userId}` | Inventory modifications | 5s |
| `lock:trade:{tradeId}` | Trade execution | 10s |
| `lock:auction:{auctionId}` | Auction bid | 5s |
| `lock:guild:bank:{guildId}` | Guild bank operations | 5s |
| `lock:boss:{bossId}` | World boss HP update | 2s |
| `lock:raid:{raidId}` | Raid state mutations | 5s |
| `lock:battle:{battleId}` | Battle state (rare) | 10s |

**Lock Acquisition Pattern:**

```
lock = Redlock.acquire([lockKey], ttl)
try:
  performOperation()
  lock.release()
catch:
  lock.release()
  throw
```

**Lock Failure Handling:**
- If lock cannot be acquired within 3 retries (100ms intervals), throw `ConcurrentModificationError`.
- The command handler returns a user-facing "Please try again" message.
- Lock contention is tracked via Prometheus metric `redis_lock_contention_total`.

---

### 4.3 Leaderboard Cache

Redis Sorted Sets power all leaderboard functionality.

**Leaderboard Keys:**

```
leaderboard:global:battles_won          ZADD userId score(battlesWon)
leaderboard:global:battle_power         ZADD userId score(battlePower)
leaderboard:global:gold                 ZADD userId score(gold)
leaderboard:global:season:{seasonId}    ZADD userId score(seasonPoints)
leaderboard:guild:{guildId}:season      ZADD userId score(seasonPoints)
leaderboard:guild:{guildId}:battles     ZADD userId score(battlesWon)
leaderboard:class:{classId}:level       ZADD userId score(level)
```

**Update Strategy:**
- Leaderboard sorted sets are updated after every relevant event (battle win, level up, gold change) via an event-driven mechanism.
- The `LeaderboardWorker` runs every 15 minutes to reconcile sorted sets with MongoDB as a consistency check.
- `ZRANGE ... REV WITHSCORES LIMIT` is used for paginated queries (max 100 per page).

**Anti-Fraud:**
- Leaderboard positions are validated against MongoDB before display. A score discrepancy > 10% triggers an anomaly flag.

---

### 4.4 Session Cache

**Active Session Storage:**

Discord interactions are stateful in short windows (pending trades, pending raid invites, battle confirmation). These are stored in Redis:

```
Key:   session:{sessionType}:{entityId}:{userId}
TTL:   Varies (see table below)
Value: JSON-serialized session data

Session Types:
  pending_battle    150s    Battle challenge awaiting acceptance
  pending_trade     600s    Trade offer negotiation
  pending_confirm   60s     Generic confirmation dialog
  raid_forming      300s    Raid forming state
  pagination        300s    Active paginated view state
```

**Session Data Structure:**

```typescript
{
  sessionId: string,
  type: SessionType,
  initiatorId: string,
  targetId: string | null,
  data: Record<string, unknown>,
  createdAt: number,              // Unix timestamp
  messageId: string,
  channelId: string,
}
```

---

### 4.5 Rate Limit Cache

**Token Bucket Implementation (Redis Lua):**

```lua
-- Rate limit check: returns remaining tokens or -1 if exhausted
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local requested = tonumber(ARGV[3])
local now = tonumber(ARGV[4])

local bucket = redis.call('HMGET', key, 'tokens', 'lastRefill')
local tokens = tonumber(bucket[1]) or capacity
local lastRefill = tonumber(bucket[2]) or now

local elapsed = now - lastRefill
local refill = elapsed * refillRate
tokens = math.min(capacity, tokens + refill)

if tokens < requested then
  return -1
end

tokens = tokens - requested
redis.call('HMSET', key, 'tokens', tokens, 'lastRefill', now)
redis.call('EXPIRE', key, 3600)
return math.floor(tokens)
```

---

### 4.6 TTL Strategy

| Cache Key Pattern | TTL | Rationale |
|------------------|-----|-----------|
| `char:{userId}` | 5 min | Frequently read, changes on every action |
| `char:stats:{charId}` | 2 min | Changes on equip/level |
| `economy:{userId}` | 1 min | Frequently updated |
| `catalog:items` | 60 min | Static, rarely changes |
| `catalog:skills` | 60 min | Static |
| `catalog:classes` | 60 min | Static |
| `catalog:monsters` | 30 min | Static |
| `leaderboard:*` | 5 min | Near-realtime OK |
| `session:*` | Per-type | Interaction state |
| `ratelimit:*` | 1 hr | Auto-expire if user goes inactive |
| `cooldown:*` | Until cooldown ends | Game mechanic |
| `pending:*` | Per-type (60–600s) | Interaction windows |

---

### 4.7 Cache Invalidation

**Event-Driven Invalidation:**

Services emit internal events that trigger cache invalidation:

```
character.equipItem      →  invalidate char:{userId}, char:stats:{charId}
character.levelUp        →  invalidate char:{userId}, leaderboard:class
economy.debit            →  invalidate economy:{userId}, leaderboard:global:gold
guild.memberJoin         →  invalidate guild:{guildId}:members
catalog.itemUpdated      →  invalidate catalog:items
```

**Pattern Deletion:**

For broad invalidations (e.g., a game update changes all class data), Redis `SCAN` with pattern matching is used rather than `KEYS` (which blocks):

```
SCAN 0 MATCH catalog:classes:* COUNT 100
DEL {matched keys}
```

**Version-Based Invalidation:**

Static catalog data (classes, skills, items) includes a `version` field in MongoDB. The cached value includes this version. On read, if the cached version differs from the latest known version (stored in a dedicated Redis key), the cache is refreshed.

---

## 5. Service Layer

### 5.1 BattleService

**Responsibilities:**
- Orchestrate PvP battles between players
- Orchestrate PvE battles (monster encounters, story battles)
- Validate battle eligibility (cooldowns, active battles, status effects)
- Invoke BattleEngine for deterministic simulation
- Calculate and distribute rewards
- Dispatch render jobs
- Record battle history
- Update player stats and leaderboards

**Dependencies:**
- `ProfileService` — load attacker/defender character data
- `SkillService` — resolve skill definitions
- `BattleEngine` — pure simulation (no I/O)
- `EconomyService` — distribute gold rewards
- `InventoryService` — distribute item drops
- `AchievementService` — check post-battle achievements
- `QuestService` — update quest progress
- `ImageRenderService` — dispatch render job
- `AnalyticsService` — log battle events
- `MongoDB.battles` — persist battle record

**Public Interface:**

```typescript
interface IBattleService {
  // PvP
  challengePlayer(attackerId: string, defenderId: string, options: BattleOptions): Promise<BattleChallenge>
  acceptChallenge(challengeId: string, defenderId: string): Promise<BattleResult>
  declineChallenge(challengeId: string, defenderId: string): Promise<void>
  
  // PvE
  startMonsterBattle(userId: string, monsterId: string, zoneId: string): Promise<BattleResult>
  
  // Dungeon
  startDungeonFloor(userId: string, dungeonId: string, floor: number): Promise<BattleResult>
  
  // Queries
  getBattleHistory(userId: string, pagination: Pagination): Promise<PaginatedResult<BattleRecord>>
  getActiveBattle(userId: string): Promise<BattleRecord | null>
  getBattleResult(battleId: string): Promise<BattleRecord>
  
  // Cooldowns
  getBattleCooldown(userId: string): Promise<CooldownInfo>
  canBattle(userId: string): Promise<boolean>
}
```

**Inputs:**
- `attackerId`: Discord user ID (string)
- `defenderId`: Discord user ID (string)
- `options`: `{ wager?: number, private?: boolean }`

**Outputs:**
- `BattleResult`: `{ winner, loser, rounds, replay, rewards, expGained, goldGained }`

**Failure Recovery:**
- If `BattleEngine.simulate()` throws, catch error, log with full battle seed and character snapshots, return error result
- If render job fails, deliver battle result without animation (text-only fallback)
- If reward distribution fails partially, log to dead letter queue for manual/automatic retry
- Battle record is written with `status: 'pending'` before simulation; updated to `'completed'` or `'error'` after

---

### 5.2 ProfileService

**Responsibilities:**
- User account creation and management
- Character creation, deletion, and selection
- Character stat computation (base + equipment + buffs)
- Level-up processing
- Stat allocation
- Avatar and display data management

**Dependencies:**
- `MongoDB.users`, `MongoDB.profiles`, `MongoDB.characters`
- `Redis` — character cache
- `EquipmentService` — aggregate equipment stats
- `SkillService` — validate equipped skills
- `AchievementService` — level-up achievement checks

**Public Interface:**

```typescript
interface IProfileService {
  // Account
  getOrCreateUser(discordId: string, userData: DiscordUserData): Promise<User>
  getUserByDiscordId(discordId: string): Promise<User | null>
  updateLastActive(discordId: string): Promise<void>
  
  // Characters
  getActiveCharacter(discordId: string): Promise<Character>
  getAllCharacters(discordId: string): Promise<Character[]>
  createCharacter(discordId: string, classId: string, name: string): Promise<Character>
  deleteCharacter(characterId: string, discordId: string): Promise<void>
  selectCharacter(characterId: string, discordId: string): Promise<Character>
  
  // Stats
  getCharacterStats(characterId: string): Promise<ComputedStats>
  allocateStatPoint(characterId: string, stat: StatType): Promise<Character>
  computeBattlePower(character: Character): number
  
  // Progression
  applyExperience(characterId: string, exp: number): Promise<LevelUpResult | null>
  
  // Profile display
  getProfileEmbed(discordId: string): Promise<ProfileEmbedData>
}
```

---

### 5.3 GuildService

**Responsibilities:**
- Guild creation, management, and deletion
- Member invitation, acceptance, removal
- Guild bank operations
- Guild level progression
- Guild event coordination
- Officer and permission management

**Dependencies:**
- `MongoDB.guilds`, `MongoDB.guildMembers`
- `ProfileService` — member character data
- `EconomyService` — guild bank gold operations
- `InventoryService` — guild bank item operations
- `NotificationService` — guild invitations and announcements
- `AchievementService` — guild achievement triggers

**Public Interface:**

```typescript
interface IGuildService {
  createGuild(leaderId: string, options: CreateGuildOptions): Promise<Guild>
  disbandGuild(guildId: string, leaderId: string): Promise<void>
  
  inviteMember(guildId: string, officerId: string, targetDiscordId: string): Promise<GuildInvite>
  acceptInvite(inviteId: string, userId: string): Promise<GuildMember>
  kickMember(guildId: string, officerId: string, memberId: string): Promise<void>
  leaveGuild(guildId: string, userId: string): Promise<void>
  
  promoteMember(guildId: string, leaderId: string, memberId: string): Promise<void>
  demoteMember(guildId: string, leaderId: string, officerId: string): Promise<void>
  
  getGuildInfo(guildId: string): Promise<GuildInfo>
  getGuildMembers(guildId: string, pagination: Pagination): Promise<PaginatedResult<GuildMemberInfo>>
  
  depositToBank(guildId: string, userId: string, gold: number): Promise<void>
  withdrawFromBank(guildId: string, officerId: string, gold: number, reason: string): Promise<void>
  
  applyExperience(guildId: string, exp: number): Promise<GuildLevelUpResult | null>
}
```

---

### 5.4 EconomyService

**Responsibilities:**
- Gold and premium currency balance management
- Transaction validation and processing
- Anti-fraud validation
- Reward distribution from all sources
- Economy health monitoring

**Dependencies:**
- `MongoDB.economy`
- `Redis` — balance cache, distributed lock
- `AuditLog` — all transactions logged
- `AnalyticsService` — economy events
- `ModerationService` — flag suspicious activity

**Public Interface:**

```typescript
interface IEconomyService {
  getBalance(userId: string): Promise<Balance>
  
  // Credit operations
  credit(userId: string, amount: number, currency: Currency, reason: TransactionReason): Promise<Transaction>
  creditBatch(credits: BatchCreditEntry[]): Promise<Transaction[]>
  
  // Debit operations
  debit(userId: string, amount: number, currency: Currency, reason: TransactionReason): Promise<Transaction>
  
  // Validation
  hasBalance(userId: string, amount: number, currency: Currency): Promise<boolean>
  validateTransaction(userId: string, amount: number, currency: Currency): Promise<ValidationResult>
  
  // Transfer
  transfer(fromId: string, toId: string, amount: number, currency: Currency, reason: string): Promise<Transfer>
  
  // Queries
  getTransactionHistory(userId: string, pagination: Pagination): Promise<PaginatedResult<Transaction>>
  
  // Admin
  adminCredit(userId: string, amount: number, reason: string, adminId: string): Promise<void>
  adminDebit(userId: string, amount: number, reason: string, adminId: string): Promise<void>
}
```

**Failure Recovery:**
- All economy operations are wrapped in distributed Redis locks.
- If a transaction partially completes (e.g., gold debited but item not awarded), a compensation event is written to a dead letter queue.
- The `EconomyWorker` processes compensation events and resolves inconsistencies within 5 minutes.

---

### 5.5 MarketplaceService

**Responsibilities:**
- Create, update, and cancel marketplace listings
- Process instant purchases
- Validate seller ownership and item availability
- Collect marketplace fees (ref: Book 1 economy rules)
- Auction management (bid, buyout, resolution)

**Dependencies:**
- `EconomyService` — payment processing
- `InventoryService` — item transfer
- `MongoDB.marketplace`, `MongoDB.auctions`
- `NotificationService` — sale notifications
- `AuditLog`

**Public Interface:**

```typescript
interface IMarketplaceService {
  createListing(sellerId: string, inventoryId: string, price: number, currency: Currency, quantity?: number): Promise<Listing>
  cancelListing(listingId: string, sellerId: string): Promise<void>
  purchaseListing(listingId: string, buyerId: string): Promise<Purchase>
  
  searchListings(query: MarketplaceQuery): Promise<PaginatedResult<Listing>>
  getListingById(listingId: string): Promise<Listing>
  getSellerListings(sellerId: string): Promise<Listing[]>
  
  createAuction(sellerId: string, inventoryId: string, options: AuctionOptions): Promise<Auction>
  placeBid(auctionId: string, bidderId: string, amount: number): Promise<Bid>
  buyoutAuction(auctionId: string, buyerId: string): Promise<AuctionResult>
  
  // Admin
  removeListingAdmin(listingId: string, adminId: string, reason: string): Promise<void>
}
```

---

### 5.6 InventoryService

**Responsibilities:**
- Item management for all players
- Equip/unequip items
- Use consumables
- Item stacking and splitting
- Item locking for trades/auctions
- Discard/destroy items

**Dependencies:**
- `MongoDB.inventory`, `MongoDB.equipment`
- `ProfileService` — validate class proficiency
- `Redis` — inventory cache

**Public Interface:**

```typescript
interface IInventoryService {
  getInventory(userId: string, filters?: InventoryFilter): Promise<PaginatedResult<InventoryItem>>
  getItem(inventoryId: string): Promise<InventoryItem>
  hasItem(userId: string, itemId: string, quantity?: number): Promise<boolean>
  
  addItem(userId: string, characterId: string, itemId: string, quantity: number, source: AcquisitionSource): Promise<InventoryItem>
  removeItem(inventoryId: string, quantity: number): Promise<void>
  transferItem(inventoryId: string, fromUserId: string, toUserId: string): Promise<InventoryItem>
  
  equipItem(characterId: string, inventoryId: string, slot: EquipmentSlot): Promise<EquipResult>
  unequipItem(characterId: string, slot: EquipmentSlot): Promise<InventoryItem>
  useItem(characterId: string, inventoryId: string): Promise<UseItemResult>
  
  lockItem(inventoryId: string, reason: string, duration?: number): Promise<void>
  unlockItem(inventoryId: string): Promise<void>
  
  getEquipment(characterId: string): Promise<EquipmentSlots>
}
```

---

### 5.7 QuestService

**Responsibilities:**
- Quest acceptance and state management
- Objective progress tracking
- Quest completion and reward distribution
- Daily/weekly quest reset
- Quest prerequisite validation

**Dependencies:**
- `MongoDB.quests`
- `ProfileService` — character level validation
- `EconomyService` — reward distribution
- `InventoryService` — item rewards
- `AchievementService` — quest achievements
- `StoryService` — story quest progression

**Public Interface:**

```typescript
interface IQuestService {
  getAvailableQuests(userId: string): Promise<Quest[]>
  getActiveQuests(userId: string): Promise<ActiveQuest[]>
  getCompletedQuests(userId: string): Promise<CompletedQuest[]>
  
  acceptQuest(userId: string, questId: string): Promise<ActiveQuest>
  abandonQuest(userId: string, questId: string): Promise<void>
  
  updateProgress(userId: string, metric: QuestMetric, value: number, context: QuestContext): Promise<QuestProgressUpdate>
  turnIn(userId: string, questId: string): Promise<QuestReward>
  
  // Internal — called by other services
  notifyBattleResult(userId: string, battleResult: BattleResult): Promise<void>
  notifyItemAcquired(userId: string, itemId: string): Promise<void>
  notifyLocationVisit(userId: string, locationId: string): Promise<void>
}
```

---

### 5.8 TransformationService

**Responsibilities:**
- Manage character transformation state (ref: Book 1 transformation system)
- Apply transformation stat modifiers
- Handle transformation timers and expiry
- Validate transformation unlock conditions
- Coordinate with BattleEngine for mid-battle transforms

**Dependencies:**
- `ProfileService` — character state
- `MongoDB.characters` — transformation field
- `Redis` — active transformation state

**Public Interface:**

```typescript
interface ITransformationService {
  getAvailableTransformations(characterId: string): Promise<Transformation[]>
  activateTransformation(characterId: string, transformationId: string): Promise<TransformationState>
  deactivateTransformation(characterId: string): Promise<void>
  getActiveTransformation(characterId: string): Promise<TransformationState | null>
  validateTransformationUnlock(characterId: string, transformationId: string): Promise<boolean>
  getTransformationModifiers(transformationId: string): Promise<StatModifiers>
}
```

---

### 5.9 RaidService

**Responsibilities:**
- Raid session creation and management
- Party formation and readiness checks
- Multi-phase raid boss coordination
- Per-player contribution tracking
- Loot distribution
- Raid history

**Dependencies:**
- `BattleService` — individual encounter simulation
- `ProfileService` — party member data
- `GuildService` — guild raid bonuses
- `EconomyService` — reward distribution
- `InventoryService` — loot drops
- `MongoDB.raids`
- `NotificationService` — raid invites

**Public Interface:**

```typescript
interface IRaidService {
  createRaid(leaderId: string, templateId: string, difficulty: Difficulty): Promise<Raid>
  joinRaid(raidId: string, userId: string, role: RaidRole): Promise<void>
  leaveRaid(raidId: string, userId: string): Promise<void>
  startRaid(raidId: string, leaderId: string): Promise<void>
  
  getRaidStatus(raidId: string): Promise<RaidStatus>
  getActiveRaid(userId: string): Promise<Raid | null>
  
  // Internal
  progressRaid(raidId: string, bossResult: BossEncounterResult): Promise<RaidProgressResult>
  completeRaid(raidId: string): Promise<RaidRewards>
  failRaid(raidId: string, reason: string): Promise<void>
}
```

---

### 5.10 WorldBossService

**Responsibilities:**
- World boss spawn scheduling and management
- Multi-player boss engagement coordination
- Real-time HP update coordination
- Damage contribution tracking
- Loot distribution based on contribution
- Boss phase transitions

**Dependencies:**
- `BattleService` — individual attack processing
- `MongoDB.bosses`
- `Redis` — boss HP state (high-frequency updates)
- `NotificationService` — spawn announcements

**Public Interface:**

```typescript
interface IWorldBossService {
  spawnBoss(templateId: string, locationId: string, guildId: string): Promise<BossInstance>
  despawnBoss(bossId: string, reason: 'defeated' | 'timeout'): Promise<void>
  
  attackBoss(bossId: string, userId: string, damage: number): Promise<BossAttackResult>
  getBossStatus(bossId: string): Promise<BossStatus>
  getActiveBosses(guildId: string): Promise<BossInstance[]>
  
  // Internal
  processPhaseTransition(bossId: string, newPhase: number): Promise<void>
  distributeLoot(bossId: string): Promise<LootDistribution>
}
```

---

### 5.11 SkillService

**Responsibilities:**
- Skill catalog management
- Player skill unlocking and upgrading
- Skill validation for battle use
- Skill tree traversal

**Dependencies:**
- `MongoDB.skills`
- `Redis` — skill catalog cache
- `ProfileService` — character level/class check

**Public Interface:**

```typescript
interface ISkillService {
  getSkillById(skillId: string): Promise<Skill>
  getSkillsByClass(classId: string, level?: number): Promise<Skill[]>
  
  getUnlockedSkills(characterId: string): Promise<UnlockedSkill[]>
  unlockSkill(characterId: string, skillId: string): Promise<UnlockedSkill>
  upgradeSkill(characterId: string, skillId: string): Promise<UnlockedSkill>
  
  equipSkill(characterId: string, skillId: string, slot: SkillSlot): Promise<void>
  unequipSkill(characterId: string, slot: SkillSlot): Promise<void>
  
  canUnlockSkill(characterId: string, skillId: string): Promise<UnlockCheckResult>
  validateEquippedSkills(characterId: string): Promise<ValidationResult>
}
```

---

### 5.12 StoryService

**Responsibilities:**
- Story chapter and scene progression
- Branching narrative state management
- NPC interaction and dialogue
- Story flag management
- Location/exploration management

**Dependencies:**
- `MongoDB.story`, `MongoDB.npcs`
- `ProfileService` — character level gating

**Public Interface:**

```typescript
interface IStoryService {
  getCurrentChapter(userId: string): Promise<ChapterInfo>
  advanceChapter(userId: string): Promise<ChapterInfo>
  
  getDialogue(userId: string, npcId: string): Promise<DialogueTree>
  makeDialogueChoice(userId: string, npcId: string, nodeId: string, choiceId: string): Promise<DialogueResult>
  
  exploreLocation(userId: string, locationId: string): Promise<ExploreResult>
  travelToLocation(userId: string, locationId: string): Promise<TravelResult>
  
  getStoryProgress(userId: string): Promise<StoryProgress>
  setStoryFlag(userId: string, flagId: string, value: boolean | number | string): Promise<void>
  
  getNpcRelationship(userId: string, npcId: string): Promise<number>
  adjustNpcRelationship(userId: string, npcId: string, delta: number): Promise<void>
}
```

---

### 5.13 AchievementService

**Responsibilities:**
- Track player achievement progress
- Unlock achievements and distribute rewards
- Manage titles earned through achievements
- Battle Pass XP management

**Dependencies:**
- `MongoDB.achievements`
- `EconomyService` — achievement rewards
- `InventoryService` — item rewards
- `NotificationService` — unlock announcements

**Public Interface:**

```typescript
interface IAchievementService {
  getPlayerAchievements(userId: string): Promise<PlayerAchievements>
  checkAndUnlock(userId: string, metric: AchievementMetric, value: number): Promise<UnlockedAchievement[]>
  claimReward(userId: string, achievementId: string): Promise<AchievementReward>
  
  // Battle Pass
  getBattlePass(userId: string, seasonId: number): Promise<BattlePassProgress>
  addBattlePassXP(userId: string, amount: number): Promise<BattlePassXPResult>
  claimBattlePassReward(userId: string, tier: number, isPremium: boolean): Promise<BattlePassReward>
  
  // Titles
  getEquippedTitle(userId: string): Promise<string | null>
  setTitle(userId: string, titleId: string): Promise<void>
  getAvailableTitles(userId: string): Promise<Title[]>
}
```

---

### 5.14 NotificationService

**Responsibilities:**
- Queue and deliver Discord DM/channel notifications
- In-game mail management
- Announcement broadcasting
- Webhook delivery for guild channels

**Dependencies:**
- `MongoDB.notifications`, `MongoDB.mail`
- `BullMQ.notifQueue` — async delivery
- `discord.js REST` — DM delivery

**Public Interface:**

```typescript
interface INotificationService {
  sendNotification(userId: string, notification: NotificationPayload): Promise<void>
  sendBulkNotification(userIds: string[], notification: NotificationPayload): Promise<void>
  
  sendMail(senderId: string | 'system', recipientId: string, mail: MailPayload): Promise<void>
  getInbox(userId: string): Promise<PaginatedResult<Mail>>
  claimMailAttachments(userId: string, mailId: string): Promise<MailAttachment[]>
  
  broadcastToGuild(guildId: string, message: string, channelId: string): Promise<void>
  broadcastGlobal(message: string, adminId: string): Promise<void>
  
  getPendingNotifications(userId: string): Promise<Notification[]>
  markRead(userId: string, notificationIds: string[]): Promise<void>
}
```

---

### 5.15 ModerationService

**Responsibilities:**
- Player report management
- Automated flag system
- Ban/mute/warn management
- Anti-cheat escalation
- Audit trail management

**Dependencies:**
- `MongoDB.moderation`, `MongoDB.users`
- `EconomyService` — economy corrections
- `InventoryService` — item removal
- `NotificationService` — ban notifications

**Public Interface:**

```typescript
interface IModerationService {
  // Reports
  createReport(reporterId: string, targetId: string, reason: string, evidence?: string): Promise<Report>
  getReports(filter: ReportFilter): Promise<PaginatedResult<Report>>
  resolveReport(reportId: string, moderatorId: string, action: ModerationAction): Promise<void>
  
  // Actions
  warnUser(targetId: string, moderatorId: string, reason: string): Promise<ModerationRecord>
  banUser(targetId: string, moderatorId: string, reason: string, durationSecs?: number): Promise<ModerationRecord>
  unbanUser(targetId: string, moderatorId: string, reason: string): Promise<void>
  
  // Query
  isUserBanned(userId: string): Promise<BanStatus>
  getUserModerationHistory(userId: string): Promise<ModerationRecord[]>
  
  // Auto-moderation
  flagSuspiciousActivity(userId: string, reason: string, data: unknown): Promise<void>
  getAnticheatFlags(userId: string): Promise<AnticheatFlag[]>
}
```

---

### 5.16 AnalyticsService

**Responsibilities:**
- Structured event tracking
- Funnel analysis data collection
- Economy health metrics
- Engagement metrics
- Batch analytics processing

**Dependencies:**
- `MongoDB.analytics` (separate DB)
- `BullMQ.analyticsQueue` — non-blocking event writes

**Public Interface:**

```typescript
interface IAnalyticsService {
  track(event: AnalyticsEvent): Promise<void>  // Fire-and-forget
  trackBatch(events: AnalyticsEvent[]): Promise<void>
  
  // Aggregations (admin/reporting use)
  getDailyActiveUsers(date: Date): Promise<number>
  getBattleStats(dateRange: DateRange): Promise<BattleStats>
  getEconomyHealth(dateRange: DateRange): Promise<EconomyHealthMetrics>
  getRetentionCurve(cohortDate: Date): Promise<RetentionData>
}
```

---

### 5.17 ImageRenderService

**Responsibilities:**
- Dispatch image render jobs to the render worker
- Manage render job lifecycle
- Cache rendered images
- Serve rendered assets

**Dependencies:**
- `BullMQ.renderQueue`
- `Redis` — render cache
- `packages/renderer` — render engine

**Public Interface:**

```typescript
interface IImageRenderService {
  renderBattleResult(battleId: string): Promise<RenderJobResult>
  renderProfileCard(userId: string): Promise<RenderJobResult>
  renderLeaderboard(type: string, entries: LeaderboardEntry[]): Promise<RenderJobResult>
  renderInventory(userId: string, items: InventoryItem[]): Promise<RenderJobResult>
  renderGuildCard(guildId: string): Promise<RenderJobResult>
  
  getRenderedAsset(renderJobId: string): Promise<RenderedAsset | null>
  waitForRender(jobId: string, timeoutMs?: number): Promise<RenderedAsset>
}
```

---

### 5.18 VideoRenderService

**Responsibilities:**
- Coordinate multi-frame battle animation rendering
- GIF and MP4 pipeline management
- Video quality configuration

**Dependencies:**
- `BullMQ.videoQueue`
- `packages/renderer` — render engine + ffmpeg pipeline

**Public Interface:**

```typescript
interface IVideoRenderService {
  renderBattleGIF(battleId: string, options?: GIFOptions): Promise<RenderJobResult>
  renderBattleMP4(battleId: string, options?: MP4Options): Promise<RenderJobResult>
  renderHighlightReel(battleIds: string[]): Promise<RenderJobResult>
}
```

---

### 5.19 AdminService

**Responsibilities:**
- Admin command execution with full audit trail
- User data inspection and modification
- Economy adjustments
- System configuration
- Content management (items, events)

**Dependencies:**
- All other services (admin orchestrator)
- `ModerationService`
- `AuditLog` — all admin actions

**Public Interface:**

```typescript
interface IAdminService {
  // User management
  getUserInfo(discordId: string): Promise<AdminUserInfo>
  adjustUserBalance(discordId: string, amount: number, currency: Currency, reason: string, adminId: string): Promise<void>
  grantItem(discordId: string, itemId: string, quantity: number, reason: string, adminId: string): Promise<void>
  removeItem(discordId: string, inventoryId: string, reason: string, adminId: string): Promise<void>
  resetCooldowns(discordId: string, adminId: string): Promise<void>
  
  // System
  broadcastMessage(message: string, scope: BroadcastScope, adminId: string): Promise<void>
  triggerBossSpawn(templateId: string, locationId: string, guildId: string, adminId: string): Promise<void>
  
  // Audit
  getAuditLog(filter: AuditFilter): Promise<PaginatedResult<AuditEntry>>
}
```

---

## 6. Battle Engine

### 6.1 Battle Scheduler

The BattleScheduler manages the lifecycle of all concurrent battles. It is a stateless orchestrator — all battle state is passed through, not stored in the scheduler.

**Responsibilities:**
- Receive battle initiation requests from BattleService
- Build initial `BattleContext` from character snapshots
- Hand off to `BattleEngine.simulate()`
- Return `BattleResult` to BattleService
- Track concurrent battle count per shard (Prometheus metric)

**BattleContext:**

```typescript
type BattleContext = {
  battleId: string,
  seed: number,                   // RNG seed (deterministic)
  type: 'pvp' | 'pve' | 'raid' | 'dungeon' | 'boss',
  participants: Participant[],
  environment: BattleEnvironment, // Arena type, weather, modifiers
  config: BattleConfig,           // Turn limits, rules
  startedAt: number,              // Unix ms timestamp
}

type Participant = {
  id: string,
  type: 'player' | 'monster' | 'boss' | 'npc',
  team: number,                   // 0 = attacker, 1 = defender (or more for raids)
  snapshot: CharacterSnapshot,    // Immutable copy of stats at battle start
  currentState: ParticipantState, // Mutable state during battle
}
```

---

### 6.2 Turn Queue & Initiative

**Initiative Calculation:**

Initiative determines turn order per round. Based on the Speed stat with a small RNG variance (ref: Book 1 formulas).

```
Initiative = (Speed * 1.5) + (Luck * 0.3) + RNG(0, Speed * 0.2)
```

Higher initiative acts first. On tie, PvP: alphabetical by Discord ID for fairness.

**Turn Queue Structure:**

```typescript
class TurnQueue {
  private queue: TurnEntry[]      // Sorted by initiative descending
  private round: number
  private maxRounds: number
  
  buildRound(participants: Participant[]): void
  getNextTurn(): TurnEntry | null
  insertDelayedAction(entry: TurnEntry, delay: number): void  // For summons/delayed skills
  removeParticipant(id: string): void  // On death
}
```

**Multi-Round Model:**
- Each round, all living participants act once in initiative order.
- Maximum rounds = 20 (configurable, ref: Book 1). If both sides still have HP after 20 rounds, the side with higher HP% wins.
- Status effects tick at the end of each round.
- Transformation activation counts as an action (consumed turn).

---

### 6.3 Action Queue

The Action Queue processes actions within a turn. A participant's turn may generate multiple sub-actions (e.g., a skill that hits multiple times, a passive that triggers on attack).

```typescript
class ActionQueue {
  private pending: Action[]
  
  // Called at start of participant's turn
  buildTurnActions(participant: Participant, choice: ActionChoice): Action[]
  
  // Sub-action injection (from passive triggers)
  injectAction(action: Action, position: 'before_current' | 'after_current' | 'end_of_round'): void
  
  processNextAction(context: BattleContext): ActionResult
}

type ActionChoice = {
  type: 'skill' | 'basic_attack' | 'defend' | 'item' | 'transform' | 'flee',
  skillId?: string,
  targetIds?: string[],
}
```

---

### 6.4 Cooldown Manager

Tracks skill cooldowns within a battle session (turn-based) and cross-session cooldowns (time-based).

**In-Battle Cooldowns:**

```typescript
class CooldownManager {
  private cooldowns: Map<string, number>  // skillId → remainingTurns
  
  isOnCooldown(participantId: string, skillId: string): boolean
  getCooldown(participantId: string, skillId: string): number
  consumeSkill(participantId: string, skillId: string): void  // Sets cooldown
  decrementAllCooldowns(participantId: string): void         // Called each round
}
```

**Cross-Session Cooldowns (Redis):**

```
Key:    cooldown:{userId}:{cooldownType}
Value:  Unix timestamp (when cooldown expires)
TTL:    Duration of cooldown

Cooldown Types:
  battle_pvp      → duration from Book 1
  battle_dungeon  → duration from Book 1
  daily_reward    → until next UTC midnight
  weekly_reward   → until next Monday UTC
  boss_attack     → configured per boss
```

---

### 6.5 Status Manager

Manages all status effects (buffs, debuffs, DoTs, HoTs) during battle.

**Status Effect Types (ref: Book 1):**

```typescript
type StatusEffect = {
  effectId: string,
  name: string,
  category: 'buff' | 'debuff' | 'dot' | 'hot' | 'control' | 'special',
  
  // Duration
  duration: number,               // Turns remaining
  isInfinite: boolean,
  
  // Stacking
  maxStacks: number,
  currentStacks: number,
  stackBehavior: 'replace' | 'stack' | 'refresh' | 'independent',
  
  // Effect
  statModifiers: Partial<StatModifiers>,  // Flat or percentage
  dotDamagePerTurn: number,
  hotHealPerTurn: number,
  
  // Control
  preventsAction: boolean,         // Stunned, frozen
  preventsSkill: boolean,          // Silenced
  preventsMovement: boolean,
  
  // Source
  sourceParticipantId: string,
  sourceSkillId: string,
}
```

**StatusManager Operations:**

```typescript
class StatusManager {
  applyEffect(targetId: string, effect: StatusEffect): ApplyResult
  removeEffect(targetId: string, effectId: string): void
  clearEffectsOfCategory(targetId: string, category: string): void
  tickEffects(targetId: string): TickResult[]  // Returns DoT/HoT deltas
  getActiveEffects(targetId: string): StatusEffect[]
  hasEffect(targetId: string, effectId: string): boolean
  computeStatModifiers(targetId: string): StatModifiers  // Aggregated from all effects
}
```

---

### 6.6 Transformation Manager

Handles player class transformations mid-battle (ref: Book 1 transformation system).

```typescript
class TransformationManager {
  canTransform(participant: Participant, transformationId: string): boolean
  activateTransformation(participant: Participant, transformationId: string, context: BattleContext): TransformResult
  deactivateTransformation(participant: Participant): void
  
  getTransformationModifiers(transformationId: string): StatModifiers
  getRemainingDuration(participantId: string): number  // Turns
  
  // Called each round to decrement duration
  tickTransformations(participants: Participant[]): void
}
```

**Transformation activation:**
- Replaces the participant's turn action
- Applies stat modifier snapshot to current battle state
- Visual cue queued for render engine
- Cannot activate another transformation until current expires

---

### 6.7 Ultimate Manager

Tracks ultimate ability charge and manages ultimate execution.

```typescript
class UltimateManager {
  // Charge tracking
  getCharge(participantId: string): number  // 0–100
  addCharge(participantId: string, amount: number): number
  
  // Ultimate ready when charge >= 100
  isUltimateReady(participantId: string): boolean
  
  // Execution
  executeUltimate(participant: Participant, context: BattleContext): UltimateResult
  
  // Charge gained on: dealing damage, taking damage, using skills
  // Rates defined in Book 1
}
```

**Charge Gain Rules (ref: Book 1):**
- Deal damage: +chargeGainOnAttack (class-dependent)
- Take damage: +chargeGainOnHit (class-dependent)
- Use skill: +chargeGainOnSkillUse
- Per round: +chargeGainPerRound

---

### 6.8 Target Selection

```typescript
class TargetSelector {
  resolveTargets(
    user: Participant,
    skill: Skill,
    allParticipants: Participant[],
    choice?: string[]            // Override for player-selected targets
  ): Participant[]
  
  // Target types (ref: Book 1)
  // single_enemy: closest or highest HP enemy
  // all_enemies: all living opponents
  // single_ally: lowest HP ally (for heals)
  // all_allies: all living allies
  // self: the skill user only
  // aoe_enemies: random N enemies
  // splash: primary target + adjacent
}
```

---

### 6.9 Damage Pipeline

The damage pipeline processes raw damage through multiple stages. Order is critical.

```
Stage 1: Base Damage Calculation
  base_damage = skill.baseValue + (attack * skill.scaling.attackPercent / 100)
  
Stage 2: Element Modifier
  element_mult = element_chart[attacker.element][target.element]  // from Book 1

Stage 3: Critical Hit
  is_crit = RNG() < attacker.critRate
  crit_mult = is_crit ? attacker.critDamage : 1.0

Stage 4: Defense Reduction
  effective_defense = target.defense * (1 + defense_buffs - defense_debuffs)
  damage_reduction = effective_defense / (effective_defense + DEFENSE_CONSTANT)
  post_defense = base_damage * element_mult * crit_mult * (1 - damage_reduction)

Stage 5: Status Effect Modifiers
  post_status = post_defense * (1 + damage_boost_effects) * (1 - damage_reduce_effects)

Stage 6: Minimum Damage Floor
  final_damage = max(post_status, MIN_DAMAGE)

Stage 7: Apply to HP
  target.currentHp -= final_damage
  target.currentHp = max(0, target.currentHp)
```

**Damage Event:**

```typescript
type DamageEvent = {
  sourceId: string,
  targetId: string,
  skillId: string,
  baseDamage: number,
  elementMultiplier: number,
  isCritical: boolean,
  critMultiplier: number,
  defenseReduction: number,
  statusModifier: number,
  finalDamage: number,
  remainingHp: number,
  killingBlow: boolean,
}
```

---

### 6.10 Healing Pipeline

```
Stage 1: Base Heal
  base_heal = skill.baseValue + (magicAttack * skill.scaling.magicAttackPercent / 100)

Stage 2: Healing Modifiers
  modified_heal = base_heal * (1 + healer.healingBonus) * target.healingReceiveBonus

Stage 3: Overheal Prevention
  actual_heal = min(modified_heal, target.maxHp - target.currentHp)

Stage 4: Apply
  target.currentHp += actual_heal
```

---

### 6.11 Death Handling

```typescript
class DeathHandler {
  processParticipantDeath(
    participant: Participant,
    killerEvent: DamageEvent,
    context: BattleContext
  ): DeathResult
  
  // On death:
  // 1. Remove participant from turn queue
  // 2. Clear most status effects (some persist: curses, marks)
  // 3. Check for "second chance" abilities or transformations
  // 4. Emit death event to quest/achievement systems
  // 5. Check if battle is over (all of one team dead)
}
```

**Revival Mechanics:**
- Some skills/items allow revival (ref: Book 1). The DeathHandler checks for equipped revival items before finalizing death.
- Revived participants re-enter the turn queue at the end of the current round with configured HP%.

---

### 6.12 Replay Generation

The BattleEngine generates a deterministic replay record alongside the battle result.

```typescript
type BattleReplay = {
  battleId: string,
  seed: number,
  participants: ParticipantSnapshot[],
  rounds: RoundRecord[],
  result: BattleResultSummary,
  version: string,                // Engine version — for replay compatibility
}

type RoundRecord = {
  roundNumber: number,
  turns: TurnRecord[],
}

type TurnRecord = {
  participantId: string,
  action: ActionRecord,
  results: ActionResult[],
  statusTicks: StatusTickRecord[],
  endState: ParticipantState,     // Snapshot after turn
}
```

The replay is stored as JSON in the `battles` collection. The render engine consumes the replay to produce animations frame-by-frame.

---

### 6.13 Deterministic Simulation

**RNG Strategy:**

All randomness in the battle engine uses a seeded pseudo-random number generator (PRNG) — specifically, **Xorshift128** for performance and reproducibility.

```
seed = hash(battleId + participantIds.sort().join())
RNG = new XorShift128(seed)
```

Every random decision (crit check, status effect proc, dodge roll, initiative variance) consumes from the same RNG sequence in a deterministic order. This guarantees:
- Given the same seed and participant snapshots, the simulation always produces identical results
- Replays can be faithfully reproduced
- Results can be verified independently (anti-cheat audit)

**Snapshot Immutability:**

At battle start, character stats are snapshotted. Ongoing changes to the MongoDB character document do not affect the running battle. The snapshot is stored in the battle record.

---

## 7. Render Engine

### 7.1 Canvas Rendering Architecture

The render engine runs in dedicated **worker processes** using Node.js worker threads. It never runs in the main bot process to avoid event loop blocking.

**Render Pipeline:**

```
RenderJob received by worker
  │
  ├─→ Load BattleReplay from MongoDB
  ├─→ AssetLoader.preload(all assets needed for this battle)
  │         ├─→ Character sprites (attacker + defender)
  │         ├─→ Background
  │         ├─→ Skill effect sprites
  │         └─→ UI elements
  │
  ├─→ For each frame in timeline:
  │     ├─→ Draw background layer
  │     ├─→ Draw character sprites (with animation state)
  │     ├─→ Draw skill effects / particles
  │     ├─→ Draw health bars
  │     ├─→ Draw damage numbers
  │     └─→ Draw UI overlays
  │
  ├─→ GIFPipeline.encode(frames[]) → buffer
  │     OR
  │     MP4Pipeline.encode(frames[]) → buffer
  │
  └─→ Upload buffer to Object Storage / Discord CDN
      Return asset URL
```

**Canvas Configuration:**

```
Battle Scene Canvas:
  Width:  800px
  Height: 450px
  FPS:    12 (GIF) / 24 (MP4)
  Format: RGBA

Color Space: sRGB
Anti-aliasing: enabled
Font rendering: Cairo (via node-canvas)
```

---

### 7.2 Sprite Layering System

Rendering uses a layer stack. Layers are rendered in order (painter's algorithm):

```
Layer 0: Background (static arena image)
Layer 1: Background effects (parallax, weather)
Layer 2: Shadow layer (character drop shadows)
Layer 3: Characters - behind effects
Layer 4: Ground-level skill effects (explosions, ice, etc.)
Layer 5: Character sprites (with animation offset)
Layer 6: Air-level skill effects (projectiles, beams)
Layer 7: Screen-level effects (flashes, screen shake)
Layer 8: Health bars and MP bars
Layer 9: Status effect icons
Layer 10: Damage numbers (floating)
Layer 11: UI overlay (round indicator, turn banner)
```

**Sprite Layer Class:**

```typescript
class SpriteLayer {
  draw(ctx: CanvasRenderingContext2D, frame: number): void
  
  // Transformations applied per-frame:
  x: number
  y: number
  rotation: number        // radians
  scaleX: number
  scaleY: number
  alpha: number           // 0–1
  
  // Animation state
  currentAnimation: string
  currentFrame: number
  loop: boolean
}
```

---

### 7.3 Battle Backgrounds

Each battle arena has a background asset set:

```
Arena Background Package:
  background.png         1600x900 base image
  parallax_far.png       Far-distance parallax layer
  parallax_near.png      Near-distance parallax layer
  overlay.png            Atmospheric overlay (fog, dust, etc.)
  thumbnail.png          256x144 preview
  config.json            Parallax speeds, weather, ambient light
```

Backgrounds are loaded from the asset pipeline (local filesystem or CDN) and cached in the worker's in-memory LRU cache.

---

### 7.4 Character Rendering

Each character is rendered from a sprite sheet:

```
Character Sprite Sheet Format:
  idle/              idle_0.png ... idle_7.png    (8 frames at 12fps)
  attack/            attack_0.png ... attack_11.png
  skill_{id}/        skill_0.png ... skill_7.png  (per skill animation)
  hurt/              hurt_0.png ... hurt_3.png
  death/             death_0.png ... death_7.png
  transform_{id}/    transform_0.png ... transform_15.png
  ultimate/          ultimate_0.png ... ultimate_19.png
  
Standard sprite size:  256x256px
Character base position:
  Attacker:  x=150, y=180 (left side, mirrored)
  Defender:  x=570, y=180 (right side)
```

**Transformation Visual:**
- On transformation activation, a special overlay animation plays (lightning, aura, etc.)
- The character sprite set switches to the transformation variant
- Particle aura is rendered persistently while transformed

---

### 7.5 Particle System

```typescript
class ParticleSystem {
  private particles: Particle[]
  
  emit(config: ParticleEmitterConfig): void
  update(deltaTime: number): void
  draw(ctx: CanvasRenderingContext2D): void
}

type Particle = {
  x: number, y: number,
  vx: number, vy: number,       // Velocity
  ax: number, ay: number,       // Acceleration (gravity, etc.)
  life: number,                 // 0–1 (decreasing)
  color: string,
  size: number,
  alpha: number,
  rotation: number,
  sprite?: HTMLImageElement,
}
```

**Emitter Presets:**
- `impact` — burst on hit (sparks, dust)
- `explosion` — radial burst (fire, magic)
- `trail` — projectile trail (arrow, energy ball)
- `aura` — continuous ambient particles (transformation aura)
- `heal` — rising sparkles
- `death` — dissolve effect

---

### 7.6 Damage Numbers

Floating damage numbers animate upward and fade out over 1.5 seconds.

```typescript
type DamageNumber = {
  value: number,
  type: 'damage' | 'crit' | 'heal' | 'miss' | 'block' | 'dot',
  x: number,
  y: number,
  spawnTime: number,
  duration: number,             // ms
  color: string,
  size: number,                 // Critical hits are larger
  trajectory: 'straight_up' | 'arc_left' | 'arc_right',
}
```

Color coding:
- Normal damage: white
- Critical damage: yellow/gold, larger font
- Healing: green
- DoT: orange/red
- Miss/dodge: gray italic

---

### 7.7 Health Bars

```
Health Bar Render Spec:
  Width:    160px
  Height:   16px
  Position: Centered above character sprite, y-offset: -10px from sprite top
  
  Background:   #1a1a1a (dark)
  HP fill:      gradient #ff4444 → #ff8844 (red to orange, based on HP%)
  MP fill:      #4488ff (blue)
  Transition:   Animated (eased over 3 frames) on HP change
  
  Thresholds:
    > 50% HP:   green fill #44ff88
    20-50% HP:  yellow fill #ffdd44
    < 20% HP:   red fill + pulsing glow
```

---

### 7.8 Animation Timeline

The animation timeline maps battle replay events to render frames.

```typescript
class AnimationTimeline {
  private keyframes: AnimationKeyframe[]
  private totalDurationMs: number
  private fps: number
  
  buildFromReplay(replay: BattleReplay): void
  getFrameState(frameNumber: number): FrameState
  getTotalFrames(): number
}

type AnimationKeyframe = {
  startFrame: number,
  endFrame: number,
  participant: string,
  animation: AnimationType,
  params: Record<string, unknown>,
}
```

**Timeline Events:**
- Round start → brief pause + round banner
- Attack action → attacker moves forward, plays attack animation
- Skill activation → skill effect plays at target
- Damage landing → target plays hurt animation, damage number spawns
- HP bar → animated decrease
- Death → death animation, fade out
- Transformation → full-screen transformation sequence
- Ultimate → cinematic slow-motion effect, screen flash
- Victory → winner pose animation

---

### 7.9 Camera Movement

```typescript
class Camera {
  x: number, y: number          // Viewport offset
  zoom: number                  // Scale factor
  
  // Animated movements
  shake(intensity: number, durationFrames: number): void
  zoomTo(target: number, durationFrames: number): void
  pan(dx: number, dy: number, durationFrames: number): void
  
  // Presets
  ultimateCinematic(): void     // Zoom in on attacker, dramatic pause
  impactShake(): void           // Short shake on big hit
  deathZoom(): void             // Slow zoom on dying character
}
```

---

### 7.10 GIF Generation

**GIF Output Spec:**

```
Format:         GIF89a
Dimensions:     800x450px
Color depth:    256 colors (dithered)
FPS:            12fps (83ms per frame)
Loop:           infinite
Max size target: 8MB (enforced via frame count limit or quality reduction)
Encoder:        gif-encoder-2 (streams frames into GIF buffer)
```

**GIF Pipeline:**

```typescript
class GIFPipeline {
  encode(frames: Buffer[], options: GIFOptions): Promise<Buffer>
  
  // Optimization passes:
  // 1. Color palette optimization per frame
  // 2. Frame differencing (only changed pixels)
  // 3. LZW compression level tuning
  // 4. Downscale to 640x360 if output > 8MB
}
```

---

### 7.11 MP4 Generation

**MP4 Output Spec:**

```
Format:         H.264 (libx264)
Dimensions:     800x450px
FPS:            24fps
Bitrate:        2Mbps target (VBR)
Audio:          AAC 128kbps (optional battle SFX track)
Container:      MP4 (moov at front for streaming)
Max duration:   30 seconds (beyond this, trim to highlights)
```

**ffmpeg Command Pattern:**

```
ffmpeg
  -framerate 24
  -i frame_%04d.png
  -i sfx_track.aac (optional)
  -c:v libx264
  -preset fast
  -crf 23
  -c:a aac
  -b:a 128k
  -movflags +faststart
  -shortest
  output.mp4
```

---

### 7.12 Render Optimization

**Worker Pool:**
- Maintain N render workers (N = CPU count - 1, minimum 2).
- Workers are Node.js worker threads, not child processes, for lower overhead.
- Each worker manages its own asset cache (LRU, max 256 assets, ~512MB).

**Asset Preloading:**
- When a battle is created, assets are preloaded speculatively into the worker cache.
- Common assets (UI elements, common skill effects) are pre-loaded at worker startup.

**Frame Caching:**
- If the same battle is rendered twice (e.g., replay request), cached frames are reused.
- Cache key: `render:{battleId}:{quality}:{format}`

**Memory Management:**
- Canvas contexts are reused between renders (pool of pre-allocated contexts).
- Frames are streamed to the GIF/MP4 encoder rather than buffered entirely in memory.
- Peak memory per render worker: ~256MB (monitored, alerts at 400MB).

---

## 8. Asset Pipeline

### 8.1 Character Assets

**Asset Requirements per Character/Class:**

```
Character/{classId}/
  sprites/
    {animationType}/
      {frame_index}.png         PNG, 256x256, RGBA
  portrait/
    portrait_base.png           PNG, 512x512, RGBA (for profile cards)
    portrait_thumb.png          PNG, 128x128, RGBA (for mentions, lists)
  icon/
    icon.png                    PNG, 64x64, RGBA (for UI elements)
  transformation/
    {transformationId}/
      sprites/...               Same structure as base sprites
      intro.png                 Transformation activation frame sequence
  config.json                   Animation metadata (frame counts, timing)
```

**Asset Spec:**

| Asset Type | Dimensions | Format | Max Size |
|-----------|-----------|--------|---------|
| Character sprite frame | 256×256 | PNG (RGBA) | 64KB |
| Portrait | 512×512 | PNG (RGBA) | 256KB |
| Portrait thumbnail | 128×128 | PNG (RGBA) | 32KB |
| Icon | 64×64 | PNG (RGBA) | 16KB |
| Transformation overlay | 512×512 | PNG (RGBA) | 128KB |

---

### 8.2 Arena Assets

```
Arenas/{arenaId}/
  background.png               1600x900 (2x for HiDPI renders, downscaled)
  parallax_far.png             1600x900 (looping horizontal)
  parallax_near.png            1600x900 (looping horizontal)
  overlay.png                  800x450 (full opacity blended)
  thumbnail.png                256x144 (for arena selection UI)
  config.json                  { parallaxSpeed, weather, ambientColor, ... }
```

---

### 8.3 Skill Effects

```
Skills/{skillId}/
  icon.png                     PNG, 64x64 RGBA
  effect/
    {frame_index}.png          Effect sprite sheet frames
  particle_config.json         Particle emitter config
  sfx.mp3                      (optional) Sound effect
```

**Skill Effect Categories:**
- Projectile (arrow, fireball, lightning bolt)
- Area (explosion, ice field, heal circle)
- Hit flash (impact spark, magic burst)
- Buff/debuff overlay (shield glow, poison cloud)
- Summon (summoning circle animation)

---

### 8.4 Icons & Portraits

```
Items/{itemId}/
  icon.png                     64x64 RGBA — inventory slot icon
  icon_large.png               128x128 RGBA — item detail view

NPCs/{npcId}/
  portrait.png                 256x256 RGBA — dialogue portrait
  icon.png                     64x64 RGBA — map/list icon

Achievements/{achievementId}/
  icon_locked.png              64x64 RGBA — grayed out version
  icon_unlocked.png            64x64 RGBA — full color version
```

---

### 8.5 Animations

**Animation Metadata Format (`config.json`):**

```json
{
  "animations": {
    "idle": {
      "frames": 8,
      "fps": 8,
      "loop": true
    },
    "attack": {
      "frames": 12,
      "fps": 12,
      "loop": false,
      "hitFrame": 7
    },
    "hurt": {
      "frames": 4,
      "fps": 12,
      "loop": false
    },
    "death": {
      "frames": 8,
      "fps": 8,
      "loop": false
    }
  },
  "defaultAnimation": "idle",
  "pivot": { "x": 128, "y": 220 }
}
```

---

### 8.6 Sound Effects

Sound effects are included in MP4 renders only (GIFs are silent).

```
Audio/{sfxId}.mp3
  Format:   MP3, 44100Hz, Stereo or Mono
  Duration: < 5 seconds for skill SFX
  Level:    Normalized to -14 LUFS

Audio/music/{trackId}.mp3
  Format:   MP3, 44100Hz, Stereo
  Duration: 30–120 seconds
  Level:    Normalized to -16 LUFS (background, lower than SFX)
```

**Audio Timeline (MP4):**

```
Battle SFX are mixed at render time based on the animation timeline.
Each TurnRecord maps to SFX events:
  attack_land   → impact.mp3 at hitFrame
  skill_{id}    → skills/{skillId}/sfx.mp3 at effect start
  critical_hit  → critical.mp3
  death         → death.mp3
  ultimate      → ultimate_{classId}.mp3
```

---

### 8.7 Versioning

**Asset Version Registry:**

An `asset_manifest.json` at the root of the asset storage tracks version numbers for all assets:

```json
{
  "version": "1.4.2",
  "characters": {
    "warrior": "1.2.0",
    "mage": "1.0.3"
  },
  "arenas": {
    "fire_arena": "1.1.0"
  },
  "skills": {
    "fireball_rank1": "1.0.0"
  }
}
```

Workers check the manifest version against their in-memory cache version. If the manifest version is newer, assets are reloaded from storage.

The manifest is updated as part of the CI/CD pipeline when assets are changed.

---

### 8.8 Compression & Delivery

**Asset Storage:**
- Assets are stored in S3-compatible object storage (e.g., MinIO self-hosted, or AWS S3 in production).
- A CDN (CloudFront or Cloudflare) sits in front of S3 for global delivery.
- Workers download assets on first use and cache locally (with cache invalidation via manifest version).

**Compression:**
- PNG assets are compressed with `pngquant` (lossy 8-bit palette) for non-portrait assets, reducing size by ~50%.
- Portrait and background PNGs use lossless `zopfli` for quality-critical assets.
- MP3 audio compressed at 128kbps.

**Size Targets:**

| Asset Category | Uncompressed Budget | Compressed Target |
|---------------|-------------------|-----------------|
| Full character set (1 class) | ~10MB | ~4MB |
| Arena background set | ~5MB | ~2MB |
| Skill effect set (1 skill) | ~2MB | ~800KB |
| Item icons (all) | ~50MB | ~15MB |

---

## 9. Internal APIs

### 9.1 API Design Principles

The admin REST API (Express.js) serves an internal admin dashboard. It is **not** exposed to the public internet — access is restricted by mTLS or IP allowlist.

All endpoints follow RESTful conventions:
- Resources are nouns (plural)
- HTTP verbs express actions
- JSON request/response bodies
- ISO 8601 date strings
- Pagination via `?page=&limit=` query params
- Error responses follow RFC 7807 (Problem Details)

**Standard Response Envelope:**

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "uuid",
    "timestamp": "ISO8601"
  }
}
```

**Standard Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "User with discordId 123456 not found",
    "details": {}
  },
  "meta": {
    "requestId": "uuid",
    "timestamp": "ISO8601"
  }
}
```

---

### 9.2 Battle API

**Endpoints:**

```
GET  /api/battles
  Query: userId?, dateFrom?, dateTo?, type?, page, limit
  Response: PaginatedResult<BattleRecord>

GET  /api/battles/:battleId
  Response: BattleRecord (full)

GET  /api/battles/:battleId/replay
  Response: BattleReplay (full JSON replay data)

GET  /api/battles/:battleId/gif
  Response: { url: string } (CDN URL of rendered GIF)

POST /api/battles/trigger
  Body: { attackerId, defenderId, type }
  Response: BattleResult
  (Admin only — force a battle for testing)

DELETE /api/battles/:battleId
  (Admin only — delete a corrupted battle record)
```

**Example Response — GET /api/battles/:battleId:**

```json
{
  "success": true,
  "data": {
    "battleId": "battle_01J...",
    "type": "pvp",
    "status": "completed",
    "attackerId": "disc_123456",
    "defenderId": "disc_789012",
    "winnerId": "disc_123456",
    "rounds": 8,
    "startedAt": "2025-01-01T12:00:00Z",
    "completedAt": "2025-01-01T12:00:05Z",
    "rewards": {
      "attackerGold": 1250,
      "attackerExp": 340,
      "defenderExp": 170
    },
    "replayId": "replay_01J..."
  }
}
```

---

### 9.3 Profile API

```
GET  /api/users/:discordId
  Response: UserProfile (full)

GET  /api/users/:discordId/character
  Response: Character (active character with computed stats)

GET  /api/users/:discordId/characters
  Response: Character[]

PATCH /api/users/:discordId
  Body: { accountStatus?, isPremium?, premiumTier? }
  (Admin only)

GET  /api/users/:discordId/history
  Query: type (battle|quest|economy), page, limit
  Response: PaginatedResult<ActivityRecord>

DELETE /api/users/:discordId/cooldowns
  (Admin only — reset all cooldowns)
```

**Example — GET /api/users/:discordId:**

```json
{
  "success": true,
  "data": {
    "discordId": "123456789012345678",
    "username": "HeroPlayer#0001",
    "displayName": "HeroPlayer",
    "accountStatus": "active",
    "isPremium": true,
    "premiumTier": 2,
    "activeCharacter": {
      "characterId": "char_01J...",
      "name": "Aethon",
      "class": "warrior",
      "level": 45,
      "battlePower": 12450
    },
    "registeredAt": "2024-01-15T09:30:00Z",
    "lastActiveAt": "2025-01-01T11:58:00Z"
  }
}
```

---

### 9.4 Guild API

```
GET  /api/guilds
  Query: page, limit, sortBy (level|members|wins)
  Response: PaginatedResult<GuildSummary>

GET  /api/guilds/:guildId
  Response: GuildInfo (full)

GET  /api/guilds/:guildId/members
  Query: page, limit
  Response: PaginatedResult<GuildMemberInfo>

POST /api/guilds/:guildId/bank/grant
  Body: { gold?, itemId?, quantity?, reason, adminId }
  (Admin only)

DELETE /api/guilds/:guildId
  Body: { reason, adminId }
  (Admin only — dissolve guild)
```

---

### 9.5 Economy API

```
GET  /api/economy/user/:discordId
  Response: EconomyBalance + TransactionHistory (paginated)

POST /api/economy/user/:discordId/credit
  Body: { amount, currency, reason, adminId }
  Response: Transaction

POST /api/economy/user/:discordId/debit
  Body: { amount, currency, reason, adminId }
  Response: Transaction

GET  /api/economy/health
  Response: EconomyHealthMetrics (money supply, velocity, etc.)

GET  /api/economy/leaderboard
  Query: currency, limit (max 100)
  Response: LeaderboardEntry[]
```

**Example — POST /api/economy/user/:discordId/credit:**

Request body:
```json
{
  "amount": 5000,
  "currency": "gold",
  "reason": "Bug compensation - ticket #4521",
  "adminId": "admin_disc_000001"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "transactionId": "txn_01J...",
    "userId": "disc_123456",
    "type": "credit",
    "amount": 5000,
    "currency": "gold",
    "balanceBefore": 10250,
    "balanceAfter": 15250,
    "reason": "Bug compensation - ticket #4521",
    "performedBy": "admin_disc_000001",
    "timestamp": "2025-01-01T12:00:00Z"
  }
}
```

---

### 9.6 Inventory API

```
GET  /api/inventory/:discordId
  Query: type?, rarity?, page, limit
  Response: PaginatedResult<InventoryItem>

GET  /api/inventory/:discordId/equipment
  Response: EquipmentSlots

POST /api/inventory/:discordId/grant
  Body: { itemId, quantity, reason, adminId }
  Response: InventoryItem

DELETE /api/inventory/:discordId/:inventoryId
  Body: { reason, adminId }
  (Admin only)
```

---

### 9.7 Quest API

```
GET  /api/quests
  Response: Quest[] (all definitions)

GET  /api/quests/:questId
  Response: Quest (full definition)

GET  /api/quests/user/:discordId
  Response: { active: ActiveQuest[], completed: CompletedQuest[] }

POST /api/quests/user/:discordId/complete
  Body: { questId, adminId }
  (Admin only — force complete)
```

---

### 9.8 Admin API

```
GET  /api/admin/audit-log
  Query: adminId?, targetId?, actionType?, dateFrom?, dateTo?, page, limit
  Response: PaginatedResult<AuditEntry>

POST /api/admin/broadcast
  Body: { message, scope (global|guild), guildId?, adminId }
  Response: { delivered: number }

POST /api/admin/boss/spawn
  Body: { templateId, locationId, guildId, adminId }
  Response: BossInstance

GET  /api/admin/stats
  Response: SystemStats (DAU, battles/hour, economy velocity, etc.)

GET  /api/admin/moderation/queue
  Response: PaginatedResult<Report>

POST /api/admin/moderation/action
  Body: { reportId?, targetDiscordId, action, reason, duration?, adminId }
  Response: ModerationRecord
```

---

### 9.9 Render API

```
POST /api/render/battle/:battleId
  Body: { format: 'gif' | 'mp4', quality?: 'low' | 'medium' | 'high' }
  Response: { jobId: string }

GET  /api/render/job/:jobId
  Response: { status: 'pending' | 'processing' | 'completed' | 'failed', url?: string }

POST /api/render/profile/:discordId
  Response: { jobId: string }

POST /api/render/leaderboard
  Body: { type, entries: LeaderboardEntry[] }
  Response: { jobId: string }
```

---

### 9.10 Analytics API

```
GET  /api/analytics/dau
  Query: dateFrom, dateTo
  Response: DailyActiveUsersSeries

GET  /api/analytics/battles
  Query: dateFrom, dateTo, type?
  Response: BattleStatsSeries

GET  /api/analytics/economy
  Query: dateFrom, dateTo
  Response: EconomyHealthSeries

GET  /api/analytics/retention
  Query: cohortDate
  Response: RetentionCurve

GET  /api/analytics/funnel
  Query: funnelId, dateFrom, dateTo
  Response: FunnelData
```

---

## 10. Security Architecture

### 10.1 Authentication

**Bot Process Authentication:**
- The Discord bot authenticates with Discord using a Bot Token stored as an environment secret.
- The token is never logged, exposed in error messages, or committed to source control.
- Token rotation is documented in the Deployment Guide.

**Admin API Authentication:**
- mTLS (Mutual TLS): Only clients presenting a valid certificate issued by the internal CA can connect.
- Additionally, API key authentication (Bearer token) is required per request.
- API keys are rotated every 90 days.

---

### 10.2 Authorization

**Role-Based Access Control (RBAC):**

```
Roles hierarchy (each role inherits lower roles):

SUPER_ADMIN
  └─ ADMIN
      └─ MODERATOR
          └─ GUILD_LEADER
              └─ GUILD_OFFICER
                  └─ PLAYER
```

**Permission Matrix:**

| Action | PLAYER | OFFICER | LEADER | MOD | ADMIN | SUPER_ADMIN |
|--------|--------|---------|--------|-----|-------|-------------|
| Battle (PvP) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| View profile | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Guild invite | ✗ | ✓ | ✓ | ✗ | ✓ | ✓ |
| Guild bank | ✗ | ✓ | ✓ | ✗ | ✓ | ✓ |
| Moderate | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ |
| Economy adjust | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |
| Grant items | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |
| System config | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

---

### 10.3 Anti-Cheat System

**Detection Layers:**

**Layer 1 — Input Validation:**
- All slash command inputs are validated against Zod schemas before processing.
- Minimum/maximum value checks on all numeric inputs (wager, quantity, price).
- String inputs sanitized (no injection, length limits).

**Layer 2 — Rate Limiting:**
- Per-command rate limits (Redis token bucket — see Section 2.11).
- Abnormally high command rates trigger automatic temporary mute and admin alert.

**Layer 3 — Battle Result Validation:**
- All battle results are re-computed from the stored seed and participant snapshots.
- Any discrepancy between stored result and re-computation flags the battle.
- Flagged battles are queued for human review.

**Layer 4 — Economy Anomaly Detection:**

```
Triggers for suspiciousActivityScore increment:
  +10: Gold gain > 5× daily average in single transaction
  +20: Rapid repeated purchases (>20/min)
  +30: Circular trades (A→B→A within 10 minutes with gold delta = 0)
  +50: Balance increase without corresponding credit transaction
  
Threshold actions:
  Score 50+:  Alert to moderation queue
  Score 80+:  Auto-freeze economy (read-only) + alert
  Score 100:  Auto-suspend account + urgent alert
```

**Layer 5 — Deterministic Simulation Audit:**
- A background worker periodically picks a sample of completed battles (5% random sample) and re-simulates them.
- Re-simulated results are compared to stored results.
- Mismatches indicate either a bug or manipulation.

---

### 10.4 Economy Protection

- All economy operations are atomic (MongoDB + Redis transactions with distributed locks).
- Balances can never go below zero (validated before debit).
- Economy operations are append-only in audit log — no record is ever deleted.
- Total money supply is tracked and monitored for unexpected changes.
- Gold injection (admin grants) requires dual approval (two admin Discord IDs logged).
- Marketplace fees (configurable %) are collected to act as a currency sink.

---

### 10.5 Trade Validation

Before executing a trade:
1. Both parties must have acknowledged (locked) their offers.
2. All offered items are verified as owned (not locked in another trade/auction).
3. Inventory locks are acquired for all items from both parties.
4. Gold balance verified for both parties.
5. Circular trade detection (same items traded back within 5 minutes = flagged).
6. Soulbound items cannot be traded (enforced at InventoryService layer).
7. Full transaction is atomic — all-or-nothing.

---

### 10.6 Marketplace Validation

1. Seller must own the item at listing time.
2. Quantity must match available quantity.
3. Item is locked in seller's inventory immediately on listing.
4. Price must be within `[MIN_PRICE, MAX_PRICE]` (configurable, prevents price manipulation).
5. On purchase: buyer's balance check → seller lock verify → atomic transfer.
6. Duplicate item checking: same user cannot list the same unique item twice.
7. Admin can remove any listing with logged reason.

---

### 10.7 Cooldown Enforcement

All cooldowns are enforced server-side via Redis:
1. Before any cooldown-gated action, check Redis key `cooldown:{userId}:{type}`.
2. If key exists and hasn't expired → reject with "cooldown remaining" message.
3. After successful action → set Redis key with exact TTL.
4. Client cannot bypass cooldowns — the bot has no "trust client" model.
5. Cooldown manipulation attempts (if somehow possible) are logged.

---

### 10.8 Audit Logs

All sensitive operations are logged to a dedicated audit log collection:

```typescript
type AuditEntry = {
  _id: ObjectId,
  timestamp: Date,
  action: AuditAction,
  actorType: 'player' | 'admin' | 'system',
  actorId: string,
  targetId: string | null,
  details: Record<string, unknown>,
  ipHash: string | null,
  shardId: number,
  requestId: string,
}
```

**Audited Actions:**
- All economy transactions (credit, debit, transfer)
- All admin commands
- Account bans/unbans/warnings
- Trade and marketplace completions
- Item grants and removals
- Role changes
- Configuration changes
- Authentication failures

**Audit Log Retention:** 2 years minimum, stored in cold storage after 90 days.

---

### 10.9 Spam Prevention

- **Discord-level:** discord.js defers all replies and uses `editReply` to prevent duplicate response race conditions.
- **Application-level:** Redis idempotency keys for critical operations (trade, purchase): `idempotent:{operationType}:{interactionId}` with 60-second TTL. If a duplicate request arrives within 60 seconds, return the cached result.
- **Interaction replay prevention:** Each Discord interaction ID is stored in Redis (TTL: 30s) and checked before processing. Replayed interactions (Discord resends on network issues) are discarded.
- **Message flooding:** If a user sends > 10 commands per 10 seconds, temporarily ignore with a polite reply.

---

## 11. Background Workers

### 11.1 Worker Architecture

Workers are powered by **BullMQ** (Redis-backed job queue). Each worker type runs as a separate Node.js process (or Kubernetes pod), consuming jobs from its dedicated queue.

**Queue Configuration:**

```typescript
queues = {
  render:       new Queue('render', { connection: redis }),
  video:        new Queue('video', { connection: redis }),
  notification: new Queue('notification', { connection: redis }),
  economy:      new Queue('economy', { connection: redis }),
  analytics:    new Queue('analytics', { connection: redis }),
  cleanup:      new Queue('cleanup', { connection: redis }),
  scheduled:    new Queue('scheduled', { connection: redis }),
}
```

**Worker Concurrency:**

| Worker | Concurrency | Reason |
|--------|-------------|--------|
| RenderWorker | 4 | CPU-bound, limited by vCPUs |
| VideoWorker | 2 | Memory-intensive |
| NotificationWorker | 20 | I/O-bound (Discord API calls) |
| EconomyWorker | 10 | DB-bound, idempotent |
| AnalyticsWorker | 5 | DB writes |
| CleanupWorker | 2 | Low priority |

**Job Retry Policy:**

```
Default retry:    3 attempts
Backoff:          exponential (1s, 4s, 16s)
Dead letter queue: jobs failing after 3 attempts → DLQ for review
Max job age:      24 hours (stale jobs removed)
```

---

### 11.2 Image Render Worker

**Queue:** `render`  
**Priority:** High  
**Concurrency:** 4 per worker pod  

**Job Payload:**

```typescript
type RenderJobPayload = {
  type: 'battle_result' | 'profile_card' | 'leaderboard' | 'guild_card',
  entityId: string,              // battleId, discordId, etc.
  options: RenderOptions,
  requestedBy: string,           // discordId
  webhookUrl?: string,           // Optional: post result to webhook when done
}
```

**Job Flow:**

```
1. Receive job
2. Load entity data from MongoDB
3. Preload required assets
4. BattleCanvas.render(data) → frame buffers
5. GIFPipeline.encode(frames) → buffer
6. Upload to object storage
7. Update render job status in Redis
8. Emit 'render:complete' event (if webhookUrl provided, POST to it)
9. Mark job complete
```

---

### 11.3 Video Render Worker

**Queue:** `video`  
**Priority:** Normal  
**Concurrency:** 2 per worker pod  

Similar to Image Render Worker but:
- Uses `MP4Pipeline.encode()` via ffmpeg subprocess
- Higher memory requirement (~512MB per job)
- Longer processing time (5–30 seconds depending on battle length)
- Includes optional audio mixing

---

### 11.4 Notification Worker

**Queue:** `notification`  
**Priority:** High  
**Concurrency:** 20  

**Job Types:**

| Job Type | Action | Retry? |
|----------|--------|--------|
| `send_dm` | Discord REST: create DM channel + send message | Yes (3) |
| `send_channel` | Discord REST: send to guild channel | Yes (3) |
| `send_webhook` | POST to Discord webhook URL | Yes (3) |
| `bulk_dm` | Batch DM to multiple users | Split into individual jobs |

**Rate Limit Awareness:**
- Discord DM creation: 50/day per user (cached)
- Channel messages: 5/second global
- Worker respects Discord's API rate limit headers and backs off gracefully

---

### 11.5 Economy Worker

**Queue:** `economy`  
**Priority:** Normal  
**Concurrency:** 10  

**Job Types:**
- `daily_reward_batch`: Process all unclaimed daily rewards
- `compensation_replay`: Retry failed economy transactions from DLQ
- `marketplace_fee_collection`: Collect expired listing fees
- `auction_resolution`: Process ended auctions (award items, refund losers)
- `subscription_renewal`: Process premium subscription renewals

**Idempotency:** Every economy job carries an idempotency key. Duplicate jobs are detected and skipped.

---

### 11.6 Leaderboard Worker

**Queue:** `scheduled` (cron)  
**Schedule:** Every 15 minutes  

**Actions:**
1. Pull top 1000 entries from MongoDB for each leaderboard type.
2. Compare against Redis sorted sets.
3. Batch `ZADD` to update stale entries.
4. Log reconciliation delta count (Prometheus metric).

This worker acts as a consistency checkpoint — real-time updates are still done event-driven.

---

### 11.7 Daily Reset Worker

**Queue:** `scheduled` (cron)  
**Schedule:** 00:00 UTC daily  

**Actions (in order):**
1. Reset `dailyQuests` completion flags for all players.
2. Reset `dailyContribution` in GuildMembers.
3. Process and send daily reward eligibility notifications.
4. Update `currentSeason` fields if a new day.
5. Rotate daily shop inventory for NPC merchants.
6. Clear expired rate limit keys (Redis housekeeping).
7. Archive yesterday's battle records to cold storage (optional, configurable).
8. Update DAU metric (Prometheus).

---

### 11.8 Weekly Reset Worker

**Queue:** `scheduled` (cron)  
**Schedule:** 00:00 UTC every Monday  

**Actions:**
1. Reset `weeklyQuests` completion flags.
2. Reset `weeklyContribution` in GuildMembers.
3. Process weekly reward eligibility.
4. Update weekly leaderboard archives.
5. Process guild war results (if guild wars system is active).
6. Rotate weekly shop inventory.
7. Send weekly summary notifications to active players.

---

### 11.9 Season Reset Worker

**Queue:** `scheduled` (cron)  
**Schedule:** End of season (configurable date, admin-triggered)  

**Actions:**
1. Archive season leaderboards (snapshot to MongoDB `season_archives` collection).
2. Distribute season end rewards to top-ranked players.
3. Reset `seasonPoints` for all profiles.
4. Increment `currentSeason` global counter.
5. Issue new season BattlePass entries.
6. Send season end announcements to all active guilds.
7. Clear seasonal token balances (if not carried over per design).

---

### 11.10 Guild Processing Worker

**Queue:** `scheduled` (cron)  
**Schedule:** Every hour  

**Actions:**
1. Identify inactive guilds (no members active in 30 days).
2. Send inactivity warning to guild leader.
3. Mark guilds inactive after 60 days of inactivity.
4. Process pending guild invitations (expire after 48 hours).
5. Recalculate `memberCount` from GuildMembers (consistency check).
6. Update guild leaderboard in Redis.

---

### 11.11 Analytics Worker

**Queue:** `analytics`  
**Priority:** Low  
**Concurrency:** 5  

**Actions:**
- Consume raw analytics events from queue.
- Batch-write events to `ascension_analytics` MongoDB database.
- Run hourly aggregation pipelines (DAU, event counts, funnel metrics).
- Write aggregated metrics to `analytics_aggregates` collection.
- Emit Prometheus metrics for real-time dashboards.

---

### 11.12 Cleanup Worker

**Queue:** `scheduled` (cron)  
**Schedule:** Every 6 hours  

**Actions:**
1. Delete expired notifications (past `expiresAt`).
2. Delete expired mail (past `expiresAt`).
3. Unlock expired inventory locks.
4. Cancel expired trades and auctions (refund gold to bidders).
5. Clear expired session data from Redis.
6. Remove stale render job results from Redis.
7. Garbage collect temporary render frame files from disk.
8. Log cleanup summary (items cleaned per type).

---

## 12. DevOps Architecture

### 12.1 Docker Architecture

**Service Containers:**

| Container | Base Image | Purpose |
|-----------|-----------|---------|
| `bot` | `node:20-alpine` | Discord bot (all shards) |
| `workers` | `node:20-alpine` | BullMQ workers |
| `renderer` | `node:20-bookworm` (Debian for Cairo) | Render worker (needs Cairo/ffmpeg) |
| `admin-api` | `node:20-alpine` | Internal admin REST API |
| `mongodb` | `mongo:7` | MongoDB primary (dev only — use Atlas in prod) |
| `redis` | `redis:7-alpine` | Redis (dev — use Redis Cloud in prod) |
| `nginx` | `nginx:alpine` | Reverse proxy / TLS termination |

**Renderer Note:** The renderer container uses Debian because `node-canvas` requires Cairo system libraries (`libcairo2-dev`, `libpango1.0-dev`, `libjpeg-dev`, `libgif-dev`). Alpine does not provide these easily. This container is larger (~400MB) — acceptable for a worker process.

**Docker Compose (Development):**

```yaml
version: "3.9"
services:
  bot:
    build: { context: ., dockerfile: infra/docker/bot.Dockerfile }
    environment:
      - DISCORD_TOKEN
      - MONGODB_URI
      - REDIS_URL
      - NODE_ENV=development
    depends_on: [mongodb, redis]
    volumes:
      - ./apps/bot/src:/app/src:ro  # hot reload in dev

  workers:
    build: { context: ., dockerfile: infra/docker/workers.Dockerfile }
    environment:
      - MONGODB_URI
      - REDIS_URL
      - NODE_ENV=development
    depends_on: [mongodb, redis]

  renderer:
    build: { context: ., dockerfile: infra/docker/renderer.Dockerfile }
    environment:
      - REDIS_URL
      - MONGODB_URI
      - ASSETS_PATH=/assets
    volumes:
      - ./assets:/assets:ro
    depends_on: [redis]

  admin-api:
    build: { context: ., dockerfile: infra/docker/admin.Dockerfile }
    ports: ["3001:3001"]
    environment:
      - MONGODB_URI
      - REDIS_URL
      - ADMIN_API_KEY
    depends_on: [mongodb, redis]

  mongodb:
    image: mongo:7
    ports: ["27017:27017"]
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    volumes:
      - redis_data:/data

volumes:
  mongodb_data:
  redis_data:
```

---

### 12.2 GitHub Actions CI/CD

**Workflow Files:**

```
.github/workflows/
  ci.yml              — Runs on every PR: lint, typecheck, unit tests
  deploy-staging.yml  — Runs on merge to `develop`: deploy to staging
  deploy-prod.yml     — Runs on merge to `main`: deploy to production
  security-scan.yml   — Runs weekly: dependency audit, SAST scan
```

**CI Pipeline (`ci.yml`):**

```yaml
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - checkout
      - setup node 20
      - pnpm install --frozen-lockfile
      - pnpm lint
      - pnpm type-check
      - pnpm test:unit
      - pnpm test:integration (against test MongoDB + Redis)
      - pnpm build (verify build succeeds)

  security:
    runs-on: ubuntu-latest
    steps:
      - pnpm audit
      - Run SAST scanner (CodeQL or Semgrep)
```

**Deploy Pipeline (`deploy-prod.yml`):**

```yaml
jobs:
  deploy:
    environment: production
    steps:
      - checkout
      - Build Docker images (multi-stage, cached layers)
      - Push images to container registry (GHCR or AWS ECR)
      - Tag images with git SHA and 'production' tag
      - kubectl set image deployment/bot bot={image}:{sha}
      - kubectl rollout status deployment/bot --timeout=5m
      - kubectl set image deployment/workers workers={image}:{sha}
      - kubectl set image deployment/renderer renderer={image}:{sha}
      - Run smoke tests against production
      - Notify #deployments Discord channel
```

---

### 12.3 Environment Management

**Environment Hierarchy:**

```
environments/
  development/    — Local developer machine
  test/           — Automated test environment (ephemeral)
  staging/        — Pre-production mirror
  production/     — Live environment
```

**Environment Variables:**

```
# Discord
DISCORD_TOKEN                   Bot token
DISCORD_CLIENT_ID               Application ID
DISCORD_CLIENT_SECRET           Application secret

# Database
MONGODB_URI                     Connection string (includes auth)
MONGODB_DB_NAME                 ascension_prod | ascension_staging | ascension_dev

# Redis
REDIS_URL                       redis://user:pass@host:port
REDIS_CLUSTER_NODES             Comma-separated for cluster mode

# Storage
S3_ENDPOINT                     Object storage endpoint
S3_BUCKET                       Bucket name
S3_ACCESS_KEY_ID
S3_SECRET_ACCESS_KEY

# Application
NODE_ENV                        development | test | staging | production
LOG_LEVEL                       debug | info | warn | error
MAX_SHARDS                      auto | number
PORT                            Admin API port (default 3001)

# Feature flags
FEATURE_RAIDS_ENABLED           true | false
FEATURE_GUILDS_ENABLED          true | false
FEATURE_AUCTIONS_ENABLED        true | false

# Render
ASSETS_PATH                     /app/assets (or CDN prefix)
RENDER_MAX_WORKERS              4
RENDER_TIMEOUT_MS               30000

# Security
ADMIN_API_KEY                   Admin API authentication key
INTERNAL_CA_CERT_PATH           mTLS CA certificate path

# Monitoring
PROMETHEUS_PORT                 9090
SENTRY_DSN                      Error tracking DSN (optional)
OTEL_EXPORTER_OTLP_ENDPOINT     OpenTelemetry collector endpoint
```

---

### 12.4 Secrets Management

- All secrets are stored in **GitHub Actions Secrets** (for CI/CD) and **Kubernetes Secrets** (for runtime).
- Secrets are never committed to source control.
- `.env.example` contains all keys with placeholder values and documentation comments.
- In production, secrets are managed via **HashiCorp Vault** or cloud-native secret manager (AWS Secrets Manager / GCP Secret Manager).
- Secrets are injected at pod startup via Kubernetes ExternalSecrets operator (if using external vault) or directly as Kubernetes Secrets.
- Secret rotation policy:
  - `DISCORD_TOKEN`: Rotated immediately if compromised; planned rotation every 6 months
  - `ADMIN_API_KEY`: Rotated every 90 days
  - DB passwords: Rotated every 90 days
  - Redis passwords: Rotated every 90 days

---

### 12.5 Production Environment

**Infrastructure (Kubernetes cluster on AWS/GCP):**

```
Namespace: ascension-prod

Deployments:
  bot           replicas: 2 (1 per shard group)
  workers       replicas: 3
  renderer      replicas: 2
  admin-api     replicas: 2

HPA (Horizontal Pod Autoscaler):
  workers:      min 2, max 8 (CPU > 70% trigger)
  renderer:     min 1, max 4 (queue depth > 10 trigger)

Services:
  admin-api     ClusterIP (internal only)
  renderer      ClusterIP (internal only)

PodDisruptionBudgets:
  bot:          minAvailable: 1
  workers:      minAvailable: 2

Resource Requests/Limits:
  bot:    request: 256Mi/250m  limit: 512Mi/1000m
  workers: request: 256Mi/250m  limit: 1Gi/2000m
  renderer: request: 512Mi/500m  limit: 2Gi/4000m
```

**Database (Production):**
- MongoDB: Atlas M30+ cluster with 3-node replica set, automated backups, VPC peering
- Redis: Redis Cloud Pro (or ElastiCache cluster mode) — 3 shards, 3 replicas

---

### 12.6 Staging Environment

Staging mirrors production with reduced resources:
- Same container images (built from `develop` branch)
- Separate MongoDB and Redis instances (no data sharing with prod)
- Separate Discord application (staging bot token)
- Accessible only to internal team members
- Smoke tests run automatically after deployment

---

### 12.7 Testing Environment

- Ephemeral — spun up per CI run via Docker Compose
- Uses in-memory MongoDB (via `mongodb-memory-server`) for unit tests
- Uses real Redis (test container) for integration tests
- Torn down after test run

---

### 12.8 Monitoring Stack

**Stack:** Prometheus + Grafana + Alertmanager

**Metrics Collection:**
- All services expose a `/metrics` endpoint in Prometheus format.
- Prometheus scrapes every 15 seconds.
- Metrics are stored for 30 days in Prometheus; longer retention via Thanos or VictoriaMetrics.

**Key Metrics:**

```
# Bot Metrics
bot_interactions_total{type, command, shard, status}
bot_interaction_duration_ms{command, p50, p95, p99}
bot_interaction_errors_total{command, error_code}
bot_shard_latency_ms{shard}
bot_shard_guilds{shard}
bot_ready_shards_total

# Battle Metrics
battle_started_total{type}
battle_completed_total{type, winner_type}
battle_duration_ms{type, p50, p99}
battle_engine_simulation_ms{p50, p99}

# Economy Metrics
economy_transactions_total{type, currency}
economy_transaction_amount_sum{type, currency}
economy_balance_total{currency}  // Total money supply

# Worker Metrics
worker_jobs_total{queue, status}
worker_job_duration_ms{queue, p50, p99}
worker_queue_depth{queue}
worker_failed_jobs_total{queue}

# Render Metrics
render_jobs_total{type, format, status}
render_duration_ms{type, format, p50, p99}
render_gif_size_bytes{p50, p95}

# Database Metrics
mongodb_operation_duration_ms{collection, operation, p50, p99}
mongodb_active_connections
redis_command_duration_ms{command, p50, p99}
redis_memory_used_bytes
redis_hit_rate{namespace}

# System Metrics
nodejs_heap_used_bytes
nodejs_event_loop_lag_ms
process_cpu_seconds_total
```

---

### 12.9 Logging Architecture

**Logging Library:** Pino (structured JSON logging)

**Log Schema:**

```json
{
  "timestamp": "ISO8601",
  "level": "info",
  "service": "bot",
  "shardId": 0,
  "requestId": "uuid",
  "userId": "discordId or null",
  "guildId": "guildId or null",
  "command": "battle",
  "msg": "Battle completed",
  "duration": 234,
  "battleId": "battle_01J...",
  "error": null
}
```

**Log Levels:**
- `error`: Service errors requiring investigation
- `warn`: Recoverable issues, rate limit approaching
- `info`: Significant events (battle started, user registered, shard ready)
- `debug`: Detailed flow (only in development)

**Log Aggregation:**
- Pino writes JSON to stdout.
- Kubernetes captures stdout/stderr.
- **Promtail** (Loki agent) tails pod logs and ships to **Grafana Loki**.
- Grafana dashboards query Loki for log search, error tracking, and correlated metric+log views.
- Error-level logs are additionally forwarded to Sentry for error aggregation.

**Sensitive Data:**
- `discordId` is logged (non-sensitive, public identifier).
- `gold amounts` are logged in aggregate for economy events, not in every transaction.
- Passwords, tokens, and PII (email, IP) are **never** logged.
- IP addresses are hashed with SHA-256 before storage.

---

### 12.10 Backup Strategy

**MongoDB Backups:**
- MongoDB Atlas: Continuous backup with point-in-time recovery (5-minute granularity), retained 7 days.
- Daily snapshot backups retained 30 days.
- Weekly full backup retained 1 year.
- Backups are encrypted at rest and stored in geographically separate region.

**Redis Backups:**
- RDB snapshots every 1 hour.
- AOF (Append-Only File) enabled for near-zero data loss on failure.
- Backups retained 7 days.

**Asset Storage Backups:**
- S3/Object storage: Enable versioning + cross-region replication.
- Critical assets (character sprites, arena backgrounds) backed up to secondary provider.

**Backup Verification:**
- Monthly automated restore test from backup to a test cluster.
- Verify data integrity (document counts, sample queries).
- Alert if restore test fails.

---

### 12.11 Disaster Recovery

**Recovery Time Objectives:**

| Scenario | RTO Target | RPO Target |
|----------|-----------|-----------|
| Bot process crash | < 2 minutes (K8s restart) | 0 (stateless) |
| Worker crash | < 2 minutes | 0 (jobs re-queued) |
| Redis failure (single node) | < 30 seconds (replica promotion) | < 1 minute |
| MongoDB node failure | < 30 seconds (replica promotion) | < 1 minute |
| Full MongoDB cluster failure | < 2 hours (restore from backup) | < 1 hour |
| Full data center outage | < 4 hours (failover to DR region) | < 1 hour |

**Runbook:** A detailed disaster recovery runbook is maintained in `docs/runbooks/disaster-recovery.md`.

**Game State on Recovery:**
- Active battles in progress: Lost. Players refunded any wager. Message sent to notify them.
- Active raids: Restored from last checkpoint (every boss transition creates a checkpoint).
- Economy: Restored from MongoDB (source of truth). Any Redis-only pending transactions replayed.
- Notifications in queue: Re-queued on BullMQ startup.

---

## 13. Observability

### 13.1 Metrics Architecture

Metrics follow the RED method:
- **R**ate: requests/transactions per second
- **E**rrors: error rate per command/service
- **D**uration: p50, p95, p99 latency

And the USE method for resources:
- **U**tilization: CPU, memory, connection pool
- **S**aturation: queue depth, connection wait time
- **E**rrors: system errors, OOM, crashes

All Prometheus metrics use standard histogram buckets for durations: `[5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000]` ms.

---

### 13.2 Dashboards

**Grafana Dashboard Catalog:**

| Dashboard | Purpose |
|-----------|---------|
| Overview | High-level system health: active users, battles/min, error rate |
| Bot Performance | Per-command latency, error rates, shard health |
| Battle Engine | Simulation times, battle type distribution, win rates |
| Economy Health | Money supply, transaction volume, velocity, sinks/faucets |
| Worker Status | Queue depths, job durations, error rates per queue |
| Render Pipeline | Job times, file sizes, success rates |
| Database | Query times, slow queries, connection pool, replication lag |
| Redis | Cache hit rates, memory usage, lock contention |
| Player Analytics | DAU, retention, session length, feature adoption |
| Error Tracker | Error rate trends, top errors, new error detection |

---

### 13.3 Distributed Tracing

**Implementation:** OpenTelemetry SDK + Jaeger backend

Every Discord interaction creates a root trace span:

```
trace: interactionCreate
  └─ span: CommandRouter.dispatch
      └─ span: BattleCommand.execute
          ├─ span: ProfileService.getCharacter (attacker)
          │     └─ span: MongoDB.find (characters)
          ├─ span: ProfileService.getCharacter (defender)
          ├─ span: BattleEngine.simulate
          │     ├─ span: TurnQueue.buildRound
          │     └─ span: DamagePipeline.process (× rounds)
          ├─ span: EconomyService.credit (reward)
          │     └─ span: MongoDB.updateOne (economy)
          └─ span: renderQueue.add
```

Trace IDs are included in all log entries for correlation.

---

### 13.4 Performance Monitoring

**SLOs (Service Level Objectives):**

| Metric | SLO |
|--------|-----|
| Interaction response time (p99) | < 3000ms |
| Battle simulation time (p99) | < 2000ms |
| Economy transaction time (p99) | < 500ms |
| MongoDB query time (p95) | < 100ms |
| Redis operation time (p95) | < 10ms |
| Render job completion (p95) | < 30s |
| Worker job success rate | > 99.5% |
| Bot uptime | > 99.9% |

**SLO Burn Rate Alerts:**
- 1% error budget consumed in 1 hour → page on-call
- 5% error budget consumed in 6 hours → page on-call
- 10% error budget consumed → incident escalation

---

### 13.5 Alerting System

**Alert Routing (Alertmanager):**

| Severity | Routing | Response Time |
|----------|---------|--------------|
| `critical` | PagerDuty (immediate) | 15 minutes |
| `high` | Discord #alerts channel + PagerDuty | 1 hour |
| `medium` | Discord #alerts channel | 4 hours |
| `low` | Grafana annotation only | Next business day |

**Alert Rules (sample):**

```yaml
groups:
  - name: bot
    rules:
      - alert: HighInteractionErrorRate
        expr: rate(bot_interaction_errors_total[5m]) > 0.05
        for: 2m
        severity: high
        
      - alert: ShardDown
        expr: bot_ready_shards_total < bot_expected_shards_total
        for: 1m
        severity: critical
        
      - alert: HighBattleSimulationTime
        expr: histogram_quantile(0.99, battle_duration_ms) > 5000
        for: 5m
        severity: medium
        
      - alert: EconomyAnomalyDetected
        expr: increase(economy_suspicious_activity_total[5m]) > 10
        for: 1m
        severity: high
        
      - alert: RenderQueueBacklog
        expr: worker_queue_depth{queue="render"} > 50
        for: 5m
        severity: medium
```

---

### 13.6 Health Checks

**Liveness Probe:** Simple HTTP GET `/health` — returns 200 if process is running.

**Readiness Probe:** HTTP GET `/health/ready` — returns 200 only if:
- MongoDB connection is healthy
- Redis connection is healthy
- All required shard connections established (bot process only)
- BullMQ queues are reachable

**Health Check Response:**

```json
{
  "status": "healthy",
  "timestamp": "ISO8601",
  "version": "1.4.2",
  "checks": {
    "mongodb": { "status": "healthy", "latencyMs": 3 },
    "redis": { "status": "healthy", "latencyMs": 1 },
    "shards": { "status": "healthy", "ready": 8, "total": 8 },
    "queues": { "status": "healthy" }
  }
}
```

---

## 14. Testing Architecture

### 14.1 Unit Testing

**Framework:** Jest + ts-jest

**Target:** packages/engine, packages/services (with mocked dependencies)

**Unit Test Conventions:**
- Test files co-located: `src/BattleEngine.ts` → `src/BattleEngine.test.ts`
- 100% coverage target for `packages/engine` (pure, deterministic)
- 80% coverage target for `packages/services`
- All external dependencies (MongoDB, Redis, discord.js) are mocked

**Battle Engine Unit Tests:**

```
BattleEngine
  ✓ produces deterministic results from same seed
  ✓ applies damage pipeline correctly (5 stages)
  ✓ handles critical hits (mocked RNG)
  ✓ enforces maximum rounds
  ✓ processes status effects (DoT, HoT, control)
  ✓ handles participant death and revival
  ✓ generates valid replay record
  ✓ transformation activation mid-battle
  ✓ ultimate charge accumulation
  ✓ element type chart multipliers (ref: Book 1)

DamagePipeline
  ✓ base damage calculation per formula
  ✓ element multiplier applied
  ✓ defense reduction (asymptotic formula)
  ✓ minimum damage floor enforced
  ✓ never produces negative HP

StatusManager
  ✓ stack behavior modes (replace, refresh, stack)
  ✓ DoT ticks per round
  ✓ control effect prevents action
  ✓ effect expiry after duration

EconomyService (mocked DB)
  ✓ debit fails if balance < amount
  ✓ credit increases balance
  ✓ transfer is atomic (both succeed or both fail)
  ✓ suspicious activity score incremented correctly
```

---

### 14.2 Integration Testing

**Framework:** Jest + Supertest (admin API) + real MongoDB/Redis (test containers)

**Scope:**
- Full service → repository → database round-trips
- Cross-service operations (battle with economy rewards)
- Race condition testing (concurrent economy operations)

**Test Database:**
- `mongodb-memory-server` for fast ephemeral MongoDB
- Redis test container (or `ioredis-mock` for most tests)

**Integration Test Cases:**

```
EconomyService + MongoDB
  ✓ Concurrent debits do not overdraft (distributed lock test)
  ✓ Transaction rollback on partial failure
  ✓ Audit log written for all operations

BattleService + ProfileService + EconomyService
  ✓ Complete PvP battle flow: character load → simulate → rewards
  ✓ Battle history written correctly
  ✓ Cooldown set after battle
  ✓ XP correctly applied to character

MarketplaceService + InventoryService + EconomyService
  ✓ Listing creation locks item
  ✓ Purchase deducts buyer gold, transfers item
  ✓ Cancel unlocks item
  ✓ Expired listings cleaned up
```

---

### 14.3 Load Testing

**Framework:** k6 (open source) or Artillery

**Scenarios:**

```
Scenario: High-frequency battle commands
  - 1000 virtual users
  - Each: POST /battle command simulation
  - Duration: 10 minutes
  - Acceptance: p99 latency < 3000ms, error rate < 1%

Scenario: Economy stress
  - 500 concurrent users buying/selling
  - Duration: 5 minutes
  - Validate: No balance inconsistencies
  - Acceptance: Zero overdrafts, zero race conditions

Scenario: Render queue saturation
  - 200 battle completions/minute
  - Validate: Render queue drains within 5 minutes
  - Acceptance: No render job loss

Scenario: World boss attack flood
  - 200 simultaneous attack commands
  - Validate: HP updates consistently
  - Acceptance: Total damage sum matches individual attacks sum
```

---

### 14.4 Battle Simulation Tests

**Purpose:** Validate battle engine correctness at the game-design level (cross-reference with Book 1 rules).

**Test Suite — `tests/simulation/`:**

```
Simulation: Balanced 1v1 (equal stats)
  → Expected win rate should be ~50/50 over 10,000 battles (within 5% tolerance)

Simulation: Speed advantage
  → Higher speed character should win more often at significant speed gap
  → Quantify win rate delta per 10% speed advantage

Simulation: Tank vs Glass Cannon
  → High-defense slow character vs high-attack fast character
  → Verify neither is definitively broken

Simulation: Skill interactions
  → Test all cross-skill combinations for crashes
  → Test all element matchups produce expected multipliers
  → Test all status effects trigger at documented proc rates

Simulation: Edge cases
  → Both participants die on same action (simultaneous death)
  → Revival triggers correctly at 0 HP
  → Max round limit triggers correctly
  → Overflow protection (extremely high damage values)
```

---

### 14.5 Regression Tests

**Trigger:** Every PR that touches `packages/engine`.

**Golden File Testing:**
- 100 "golden battles" with fixed seeds and character configurations are stored.
- After any engine change, all 100 battles are re-simulated.
- If any result changes, the test fails — the developer must explicitly confirm the change is intentional and update the golden files.

This prevents accidental balance changes from code modifications.

---

### 14.6 Security Testing

**Automated (CI):**
- `pnpm audit` — known vulnerability check on all dependencies
- CodeQL / Semgrep — SAST for common vulnerability patterns
- Snyk — dependency vulnerability monitoring (continuous)

**Manual (Quarterly):**
- Penetration test of admin API endpoints
- Rate limit bypass attempts
- Economy manipulation edge cases (documented attack vectors)
- Session fixation/replay attack testing

**Economy Security Test Cases:**

```
✓ Concurrent debit of same account cannot overdraft
✓ Trade with self is rejected
✓ Trade of items not owned by user is rejected
✓ Marketplace price cannot be set to negative
✓ Admin gold grant requires valid adminId in audit log
✓ Suspended user cannot execute economy operations
✓ Integer overflow in gold calculations is handled
✓ Replay of completed interaction ID is rejected
```

---

## 15. Implementation Roadmap

### 15.1 Phase 1 — Foundation (Milestones 1–25)

**Milestone 1 — Repository & Tooling Setup**
- Objective: Initialize monorepo with pnpm workspaces, Turborepo, ESLint, Prettier, TypeScript.
- Dependencies: None.
- Complexity: Low.
- Completion Criteria: `pnpm build` succeeds, all packages typecheck.

**Milestone 2 — Discord Bot Skeleton**
- Objective: Initialize discord.js v14 client with basic shard manager and event dispatcher.
- Dependencies: Milestone 1.
- Complexity: Low.
- Completion Criteria: Bot comes online in Discord, responds to a `/ping` command.

**Milestone 3 — MongoDB Connection & Models**
- Objective: Mongoose connection, environment config, User and Profile models.
- Dependencies: Milestone 1.
- Complexity: Low.
- Completion Criteria: User created on first interaction, profile loaded on command.

**Milestone 4 — Redis Integration**
- Objective: ioredis connection, RedisClient wrapper, basic cache utilities.
- Dependencies: Milestone 1.
- Complexity: Low.
- Completion Criteria: Character data cached and retrieved from Redis.

**Milestone 5 — Command Registry**
- Objective: Slash command registry, deploy script, basic command routing.
- Dependencies: Milestone 2.
- Complexity: Low.
- Completion Criteria: Commands registered globally in Discord, routing dispatches to handlers.

**Milestone 6 — Component Registry**
- Objective: Button, select menu, and modal handler registry.
- Dependencies: Milestone 5.
- Complexity: Low.
- Completion Criteria: A test button click is routed to correct handler.

**Milestone 7 — Interaction Middleware**
- Objective: Auth, rate limit, defer, permission, validation middleware chain.
- Dependencies: Milestones 3, 4, 5.
- Complexity: Medium.
- Completion Criteria: All commands pass through middleware; auth creates users; rate limits enforced.

**Milestone 8 — ProfileService Foundation**
- Objective: User creation, character creation (with class selection), character retrieval, active character selection.
- Dependencies: Milestones 3, 4.
- Complexity: Medium.
- Completion Criteria: User can run `/start` to create character, `/profile` shows their stats.

**Milestone 9 — Character Classes Data**
- Objective: Seed MongoDB with all class definitions from Book 2.
- Dependencies: Milestone 3.
- Complexity: Low.
- Completion Criteria: All classes queryable with correct stat modifiers and skill lists.

**Milestone 10 — Skills Data**
- Objective: Seed MongoDB with all skill definitions from Book 2.
- Dependencies: Milestone 3.
- Complexity: Low.
- Completion Criteria: All skills queryable with correct effects and formulas.

**Milestone 11 — Monsters & NPCs Data**
- Objective: Seed MongoDB with monster and NPC definitions from Book 2.
- Dependencies: Milestone 3.
- Complexity: Low.
- Completion Criteria: All monsters queryable with correct stats and loot tables.

**Milestone 12 — Items & Equipment Data**
- Objective: Seed MongoDB with all item definitions from Book 2 (weapons, armor, consumables, crafting materials).
- Dependencies: Milestone 3.
- Complexity: Medium (large data set).
- Completion Criteria: Full item catalog queryable.

**Milestone 13 — EconomyService**
- Objective: Gold/gems balance management, credit/debit, distributed lock, audit log.
- Dependencies: Milestones 3, 4.
- Complexity: High (distributed lock + audit).
- Completion Criteria: Concurrent debit test passes without overdraft; audit log written.

**Milestone 14 — InventoryService**
- Objective: Item ownership management, add/remove/transfer, equip/unequip, locking.
- Dependencies: Milestones 12, 13.
- Complexity: High.
- Completion Criteria: Items correctly owned, locked, and transferred between users.

**Milestone 15 — SkillService**
- Objective: Skill catalog, unlock, upgrade, equip/unequip skill slots.
- Dependencies: Milestone 10.
- Complexity: Medium.
- Completion Criteria: Player can unlock and equip skills to their character.

**Milestone 16 — Battle Engine Core**
- Objective: TurnQueue, basic DamagePipeline, initiative, round system, result determination.
- Dependencies: None (pure package).
- Complexity: High.
- Completion Criteria: All unit tests pass; determinism tests pass (same seed = same result).

**Milestone 17 — Battle Engine — Skills & Status Effects**
- Objective: SkillProcessor, StatusManager, CooldownManager integration.
- Dependencies: Milestone 16.
- Complexity: High.
- Completion Criteria: All skill types process correctly; status effects tick; cooldowns enforced.

**Milestone 18 — Battle Engine — Transformations & Ultimates**
- Objective: TransformationManager, UltimateManager, charge system.
- Dependencies: Milestone 17.
- Complexity: High.
- Completion Criteria: Transformation activation changes stats; ultimates execute at 100 charge.

**Milestone 19 — Battle Engine — Replay Generation**
- Objective: Complete BattleReplay record generated from every simulation.
- Dependencies: Milestone 18.
- Complexity: Medium.
- Completion Criteria: Replay record stored; replay simulation test passes.

**Milestone 20 — BattleService — PvP Flow**
- Objective: Challenge, accept, simulate, reward distribution, cooldown set.
- Dependencies: Milestones 13, 14, 16, 19.
- Complexity: High.
- Completion Criteria: Full PvP battle command (`/battle @user`) works end-to-end.

**Milestone 21 — BattleService — PvE Flow**
- Objective: Monster encounter, dungeon floor battles.
- Dependencies: Milestone 20.
- Complexity: Medium.
- Completion Criteria: `/explore` triggers monster battles; loot drops correctly.

**Milestone 22 — Rate Limiting (Redis Token Bucket)**
- Objective: Redis Lua script rate limiter deployed to all game commands.
- Dependencies: Milestone 4.
- Complexity: Medium.
- Completion Criteria: Rapid command spam returns cooldown message; timer resets correctly.

**Milestone 23 — Anti-Cheat Foundation**
- Objective: Economy anomaly score, battle result validation, replay audit.
- Dependencies: Milestones 13, 20.
- Complexity: High.
- Completion Criteria: Suspicious transactions flagged; battle replays pass audit check.

**Milestone 24 — Admin API Skeleton**
- Objective: Express.js app, mTLS + API key auth, basic CRUD for user/economy.
- Dependencies: Milestones 3, 13.
- Complexity: Medium.
- Completion Criteria: Admin can view user data and adjust balances via REST API.

**Milestone 25 — CI/CD Pipeline**
- Objective: GitHub Actions workflows for lint, typecheck, unit tests, Docker build.
- Dependencies: Milestones 1–24.
- Complexity: Medium.
- Completion Criteria: All PRs run CI; green build required before merge.

---

### 15.2 Phase 2 — Core Game (Milestones 26–60)

**Milestone 26 — Render Engine: Canvas Setup**
- Objective: Worker threads, node-canvas initialization, asset loader, sprite layer system.
- Complexity: High.
- Completion Criteria: A test frame renders correctly (background + two characters).

**Milestone 27 — Render Engine: Animation Timeline**
- Objective: Build animation timeline from BattleReplay; keyframe system.
- Dependencies: Milestone 26.
- Complexity: High.
- Completion Criteria: Timeline generates correct frames from a test replay.

**Milestone 28 — Render Engine: Particle System**
- Objective: ParticleSystem, emitter presets (impact, explosion, trail, aura).
- Dependencies: Milestone 27.
- Complexity: High.
- Completion Criteria: Particle effects render at correct positions/timings.

**Milestone 29 — Render Engine: Damage Numbers & Health Bars**
- Objective: DamageNumbers floating animation; HealthBar progressive update.
- Dependencies: Milestone 27.
- Complexity: Medium.
- Completion Criteria: Damage numbers float up; HP bars animate on damage.

**Milestone 30 — GIF Pipeline**
- Objective: GIFPipeline encodes canvas frames to GIF buffer, within size limits.
- Dependencies: Milestones 26–29.
- Complexity: Medium.
- Completion Criteria: Test battle produces valid GIF under 8MB.

**Milestone 31 — BullMQ Render Queue Integration**
- Objective: BattleService enqueues render job; RenderWorker processes it; result posted to Discord.
- Dependencies: Milestones 20, 30.
- Complexity: Medium.
- Completion Criteria: Battle command produces animated GIF result in Discord.

**Milestone 32 — MP4 Pipeline**
- Objective: ffmpeg pipeline, audio mixing, MP4 output.
- Dependencies: Milestone 30.
- Complexity: High.
- Completion Criteria: Battle replay produces valid MP4 with SFX.

**Milestone 33 — Profile Command**
- Objective: `/profile` command renders profile card image (stats, class, equipment).
- Dependencies: Milestone 26, ProfileService.
- Complexity: Medium.
- Completion Criteria: Beautiful profile card renders with all stats.

**Milestone 34 — Inventory Command**
- Objective: `/inventory` paginated display with filters by type/rarity.
- Dependencies: InventoryService.
- Complexity: Medium.
- Completion Criteria: Inventory displays correctly with pagination buttons.

**Milestone 35 — Equipment Command**
- Objective: `/equip`, `/unequip` commands; equipment slot UI.
- Dependencies: InventoryService.
- Complexity: Medium.
- Completion Criteria: Player can equip/unequip items; stats update correctly.

**Milestone 36 — Shop Command**
- Objective: `/shop` with NPC merchant browsing, `/buy` with pagination.
- Dependencies: MarketplaceService, InventoryService, EconomyService.
- Complexity: Medium.
- Completion Criteria: Player can browse shop and purchase items.

**Milestone 37 — Daily/Weekly Reward Command**
- Objective: `/daily`, `/weekly` with cooldown enforcement.
- Dependencies: EconomyService, Redis cooldowns.
- Complexity: Low.
- Completion Criteria: Rewards claimed once per window; cooldown message shown on retry.

**Milestone 38 — GuildService Foundation**
- Objective: Guild creation, invite system, member management.
- Dependencies: ProfileService, EconomyService.
- Complexity: High.
- Completion Criteria: Player can create, join, and leave guilds.

**Milestone 39 — Guild Commands**
- Objective: Full `/guild` command suite: create, invite, kick, promote, info, members.
- Dependencies: Milestone 38.
- Complexity: Medium.
- Completion Criteria: All guild commands functional.

**Milestone 40 — Guild Bank**
- Objective: Guild bank deposit/withdrawal with distributed locks.
- Dependencies: Milestone 38, EconomyService.
- Complexity: Medium.
- Completion Criteria: Guild leader can manage bank; officer withdrawals logged.

**Milestone 41 — QuestService**
- Objective: Quest acceptance, progress tracking, completion, reward distribution.
- Dependencies: ProfileService, EconomyService, InventoryService.
- Complexity: High.
- Completion Criteria: Full quest lifecycle functional for story and daily quests.

**Milestone 42 — Quest Commands**
- Objective: `/quest`, `/quest log`, `/quest turn-in` commands with NPC dialogue integration.
- Dependencies: Milestone 41.
- Complexity: Medium.
- Completion Criteria: Player can accept, complete, and turn in quests.

**Milestone 43 — StoryService**
- Objective: Chapter progression, scene state, NPC dialogue with branching choices.
- Dependencies: MongoDB.story, MongoDB.npcs.
- Complexity: High.
- Completion Criteria: Player can progress story chapters; dialogue branches persist.

**Milestone 44 — Story Commands**
- Objective: `/story`, `/dialogue`, `/explore` commands.
- Dependencies: Milestone 43.
- Complexity: Medium.
- Completion Criteria: Full story flow accessible via Discord.

**Milestone 45 — AchievementService**
- Objective: Achievement definitions, progress tracking, unlock + reward system.
- Dependencies: EconomyService, InventoryService, NotificationService.
- Complexity: High.
- Completion Criteria: Achievements unlock correctly; rewards distributed.

**Milestone 46 — Achievement Commands**
- Objective: `/achievements` paginated display; title equipping.
- Dependencies: Milestone 45.
- Complexity: Low.
- Completion Criteria: Achievements viewable; unlocked titles equippable.

**Milestone 47 — LeaderboardService & Command**
- Objective: Redis sorted set leaderboards; `/leaderboard` command with multiple types.
- Dependencies: Redis, ProfileService.
- Complexity: Medium.
- Completion Criteria: Global and guild leaderboards render correctly.

**Milestone 48 — NotificationService**
- Objective: DM notifications, guild announcements, BullMQ notification queue.
- Dependencies: discord.js REST, BullMQ.
- Complexity: Medium.
- Completion Criteria: Battle challenges sent as DMs; guild events announced.

**Milestone 49 — MarketplaceService**
- Objective: Listing creation, browsing, purchase, cancellation, fee collection.
- Dependencies: InventoryService, EconomyService.
- Complexity: High.
- Completion Criteria: Full P2P marketplace functional.

**Milestone 50 — Marketplace Commands**
- Objective: `/shop list`, `/shop buy`, `/shop search`, `/shop cancel` (player marketplace).
- Dependencies: Milestone 49.
- Complexity: Medium.
- Completion Criteria: Players can list and purchase on marketplace.

**Milestone 51 — Trade System**
- Objective: Direct P2P trade with offer/counter/accept flow.
- Dependencies: InventoryService, EconomyService.
- Complexity: High.
- Completion Criteria: Full trade flow with timeout and lock-step locking.

**Milestone 52 — Auction System**
- Objective: Timed auction with bid history, buyout, resolution worker.
- Dependencies: MarketplaceService, EconomyService.
- Complexity: High.
- Completion Criteria: Auctions start, receive bids, resolve correctly.

**Milestone 53 — RaidService Foundation**
- Objective: Raid creation, party formation, readiness check, multi-phase boss combat.
- Dependencies: BattleService, ProfileService, GuildService.
- Complexity: Very High.
- Completion Criteria: 4-player raid completes successfully with loot distribution.

**Milestone 54 — Raid Commands**
- Objective: Full `/raid` command suite.
- Dependencies: Milestone 53.
- Complexity: Medium.
- Completion Criteria: Players can form and run raids via Discord.

**Milestone 55 — WorldBossService**
- Objective: Boss spawn, multi-player attack coordination, phase transitions, loot.
- Dependencies: BattleService, Redis (boss HP), NotificationService.
- Complexity: Very High.
- Completion Criteria: World boss spawns, takes damage from multiple players, distributes loot.

**Milestone 56 — World Boss Commands**
- Objective: Boss announcement, attack commands, HP display.
- Dependencies: Milestone 55.
- Complexity: Medium.
- Completion Criteria: Guild members can attack world boss together.

**Milestone 57 — TransformationService**
- Objective: Transformation unlock, activation, stat modification, expiry.
- Dependencies: ProfileService, BattleEngine.
- Complexity: High.
- Completion Criteria: Player can transform in battle; stats scale correctly.

**Milestone 58 — BattlePass System**
- Objective: Tier progression, XP sources, free/premium reward track.
- Dependencies: AchievementService, EconomyService.
- Complexity: High.
- Completion Criteria: Battle Pass advances through tiers; rewards claimable.

**Milestone 59 — ModerationService**
- Objective: Report system, ban/warn, auto-flag integration.
- Dependencies: MongoDB.moderation, NotificationService.
- Complexity: Medium.
- Completion Criteria: Users can report; mods can ban/warn; bans enforced.

**Milestone 60 — AnalyticsService**
- Objective: Event tracking for all major game events; analytics worker processing.
- Dependencies: BullMQ, MongoDB analytics DB.
- Complexity: Medium.
- Completion Criteria: Events tracked; basic dashboards populated.

---

### 15.3 Phase 3 — Content & Economy (Milestones 61–85)

**Milestone 61 — Asset Pipeline: Character Sprites**
- Objective: All character class sprites in correct format, loaded by render engine.
- Complexity: Content/Art (medium technical).
- Completion Criteria: All classes render correctly in battle animations.

**Milestone 62 — Asset Pipeline: Arena Backgrounds**
- Objective: All arena backgrounds loaded; parallax working.
- Complexity: Content/Art (low technical).
- Completion Criteria: Arenas render with correct background per location.

**Milestone 63 — Asset Pipeline: Skill Effects**
- Objective: All skill effect animations and particle configs in pipeline.
- Complexity: Content/Art (high technical).
- Completion Criteria: All skills display correct visual effects in battles.

**Milestone 64 — Dungeon System**
- Objective: Multi-floor dungeon progression, floor boss, trap mechanics.
- Dependencies: BattleService, QuestService.
- Complexity: High.
- Completion Criteria: Player can enter and complete a full dungeon.

**Milestone 65 — PvP Arena System**
- Objective: Structured PvP with ranking, seasons, matchmaking by battle power.
- Dependencies: BattleService, LeaderboardService.
- Complexity: High.
- Completion Criteria: Arena matches with ranking points functional.

**Milestone 66 — Crafting System**
- Objective: Recipe discovery, material consumption, item crafting.
- Dependencies: InventoryService, EconomyService.
- Complexity: Medium.
- Completion Criteria: Player can craft items from materials using recipes.

**Milestone 67 — Enchanting System**
- Objective: Equipment enchantment with gold/material cost and stat bonus.
- Dependencies: InventoryService.
- Complexity: Medium.
- Completion Criteria: Player can enchant items; stats increase; failure chance implemented.

**Milestone 68 — Guild Wars System**
- Objective: Guild vs guild PvP battles, weekly results, guild points.
- Dependencies: GuildService, BattleService.
- Complexity: Very High.
- Completion Criteria: Guilds can declare war; battles contribute to weekly score.

**Milestone 69 — Seasonal Content System**
- Objective: Season framework (start/end dates), seasonal quests, seasonal items.
- Dependencies: QuestService, AchievementService.
- Complexity: High.
- Completion Criteria: Season start/end triggers correctly; seasonal content activates.

**Milestone 70 — Event System**
- Objective: Time-limited events with unique bosses, quests, and rewards.
- Dependencies: WorldBossService, QuestService.
- Complexity: High.
- Completion Criteria: Admin can schedule events; events activate automatically.

**Milestone 71 — Pet System**
- Objective: Pet ownership, bonding, passive stat bonuses (ref: Book 2).
- Dependencies: InventoryService, ProfileService.
- Complexity: Medium.
- Completion Criteria: Players can own and bond with pets; bonuses apply.

**Milestone 72 — Mount System**
- Objective: Mount collection, speed bonuses, visual display (ref: Book 2).
- Dependencies: InventoryService, ProfileService.
- Complexity: Medium.
- Completion Criteria: Mounts equippable; speed stat modified.

**Milestone 73 — Cosmetic System**
- Objective: Cosmetic skins for characters, skills, and UI themes.
- Dependencies: InventoryService, Render Engine.
- Complexity: High.
- Completion Criteria: Character skin overrides render engine asset selection.

**Milestone 74 — Mail System**
- Objective: In-game mailbox, system mail for rewards, player-to-player mail.
- Dependencies: NotificationService, InventoryService.
- Complexity: Medium.
- Completion Criteria: Mail delivered, attachments claimable.

**Milestone 75 — Daily Reset Worker**
- Objective: Full daily reset pipeline with all reset actions.
- Dependencies: All services.
- Complexity: Medium.
- Completion Criteria: Daily reset runs at midnight UTC without errors.

**Milestone 76 — Weekly Reset Worker**
- Objective: Full weekly reset pipeline.
- Dependencies: All services.
- Complexity: Medium.
- Completion Criteria: Weekly reset runs every Monday midnight UTC.

**Milestone 77 — Season Reset Worker**
- Objective: Full season reset pipeline.
- Dependencies: All services.
- Complexity: High.
- Completion Criteria: Season end distributes rewards and resets correctly.

**Milestone 78 — Economy Workers: Compensation & Cleanup**
- Objective: DLQ compensation replay; expired listing cleanup; auction resolution.
- Dependencies: EconomyService, MarketplaceService.
- Complexity: Medium.
- Completion Criteria: Failed transactions replayed; expired listings refunded.

**Milestone 79 — World Map & Travel System**
- Objective: Continent/city navigation; unlocking new locations via story.
- Dependencies: StoryService.
- Complexity: Medium.
- Completion Criteria: Players can navigate the world map; locked areas shown.

**Milestone 80 — NPC Shop Dynamic Inventory**
- Objective: NPC merchant inventories rotate on schedule; rare items appear in events.
- Dependencies: Workers (daily reset), StoryService.
- Complexity: Medium.
- Completion Criteria: Shop inventory changes daily; event items appear during events.

**Milestone 81 — Autocomplete Integration**
- Objective: Autocomplete for all item, skill, and user lookups.
- Dependencies: Redis catalog cache.
- Complexity: Medium.
- Completion Criteria: All search fields have autocomplete within 3 seconds.

**Milestone 82 — Context Menu Commands**
- Objective: All user/message context menus implemented.
- Dependencies: CommandRegistry.
- Complexity: Low.
- Completion Criteria: Right-click commands functional.

**Milestone 83 — Admin Dashboard Integration**
- Objective: Admin API fully integrated with moderation service; all admin commands.
- Dependencies: AdminService, all other services.
- Complexity: Medium.
- Completion Criteria: Full admin operation suite available.

**Milestone 84 — Sharding Production Config**
- Objective: ShardingManager configured for production scale; cross-shard operations tested.
- Dependencies: All bot code.
- Complexity: High.
- Completion Criteria: Bot runs with 8+ shards without cross-shard data issues.

**Milestone 85 — Performance Optimization Pass**
- Objective: Profile hot paths; optimize MongoDB indexes; tune Redis TTLs; validate SLOs.
- Dependencies: All services.
- Complexity: High.
- Completion Criteria: All SLO targets met under load test conditions.

---

### 15.4 Phase 4 — Polish & Launch (Milestones 86–105)

**Milestone 86 — Full Observability Stack**
- Objective: All Prometheus metrics, Grafana dashboards, Alertmanager rules deployed.
- Complexity: Medium.
- Completion Criteria: All dashboards populated; alert routing tested.

**Milestone 87 — Distributed Tracing**
- Objective: OpenTelemetry SDK integrated; traces flowing to Jaeger.
- Complexity: Medium.
- Completion Criteria: Full interaction traces visible; slow paths identifiable.

**Milestone 88 — Log Aggregation (Loki)**
- Objective: Structured logs flowing to Grafana Loki; log search queries working.
- Complexity: Medium.
- Completion Criteria: Errors searchable in Loki; correlated with traces.

**Milestone 89 — Security Hardening**
- Objective: mTLS for admin API; secret rotation implemented; SAST scan clean.
- Complexity: High.
- Completion Criteria: Security review passed; no critical/high vulnerabilities.

**Milestone 90 — Load Test: Full Scale**
- Objective: 10,000 concurrent user simulation; all SLOs verified.
- Dependencies: Milestones 85, 86.
- Complexity: High.
- Completion Criteria: p99 latency < 3000ms; zero data loss; zero balance errors.

**Milestone 91 — Backup & Recovery Test**
- Objective: Full disaster recovery drill; restore from backup verified.
- Complexity: Medium.
- Completion Criteria: DB restored successfully; data integrity confirmed.

**Milestone 92 — Beta Launch Configuration**
- Objective: Staging environment fully operational; beta invite system.
- Complexity: Medium.
- Completion Criteria: Invited beta users can play; feedback collected.

**Milestone 93 — Beta Bug Fix Sprint**
- Objective: Address critical and high issues from beta.
- Complexity: Varies.
- Completion Criteria: No P1 bugs open.

**Milestone 94 — Balance Tuning**
- Objective: Adjust battle formulas, economy values based on beta data (ref: Book 1 tuning guidelines).
- Complexity: Medium.
- Completion Criteria: Win rates, economy metrics within target ranges.

**Milestone 95 — MP4 Production Integration**
- Objective: MP4 video renders available for premium users; storage and CDN tuned.
- Complexity: Medium.
- Completion Criteria: Premium users receive MP4 battle replays.

**Milestone 96 — Premium Subscription System**
- Objective: Premium tier benefits applied (Battle Pass, MP4 renders, extra characters).
- Dependencies: EconomyService, AchievementService.
- Complexity: High.
- Completion Criteria: Premium features gated correctly; subscription tracked.

**Milestone 97 — In-App Purchase Integration**
- Objective: Gem purchase flow (via external payment processor integration).
- Complexity: High (external dependency).
- Completion Criteria: Players can purchase gems; gems credited automatically.

**Milestone 98 — Analytics Dashboard**
- Objective: Product analytics dashboard for game designers (DAU, retention, economy health).
- Complexity: Medium.
- Completion Criteria: Game designers can view all key metrics in Grafana.

**Milestone 99 — Final Content Pass**
- Objective: All Book 2 content fully seeded and functional (all classes, skills, dungeons, raids, bosses, items).
- Complexity: High (content volume).
- Completion Criteria: 100% of Book 2 content accessible in game.

**Milestone 100 — Documentation Update**
- Objective: All docs updated to reflect final implementation; API docs complete.
- Complexity: Medium.
- Completion Criteria: Docs reviewed by engineering team; no inconsistencies.

**Milestone 101 — Runbook Completion**
- Objective: All operational runbooks written (incident response, disaster recovery, deployment, rollback).
- Complexity: Medium.
- Completion Criteria: On-call engineer can execute any procedure from runbook.

**Milestone 102 — Production Deployment**
- Objective: Deploy to production Kubernetes cluster; DNS configured; monitoring live.
- Complexity: High.
- Completion Criteria: Bot online in production Discord environment; all health checks green.

**Milestone 103 — Soft Launch (Invite Only)**
- Objective: Open to first 500 real users; monitor closely.
- Complexity: Operations.
- Completion Criteria: Stable for 48 hours with real users; no P1 incidents.

**Milestone 104 — Public Launch**
- Objective: Remove invite restrictions; announce launch.
- Complexity: Operations.
- Completion Criteria: Bot handling full public traffic; all SLOs met.

**Milestone 105 — Post-Launch Stabilization**
- Objective: Address post-launch issues; performance tuning at real scale.
- Complexity: Varies.
- Completion Criteria: All P1/P2 issues resolved; metrics stable for 1 week.

---

## 16. Engineering Standards

> **See also:** `docs/Engineering-Standards.md` for the full, standalone reference document.

### 16.1 Naming Conventions

**Files and Directories:**

| Artifact | Convention | Example |
|----------|-----------|---------|
| TypeScript file | `camelCase.ts` | `battleService.ts` |
| Command file | `{name}.command.ts` | `battle.command.ts` |
| Service file | `{Name}Service.ts` | `BattleService.ts` |
| Model file | `{Name}.model.ts` | `Character.model.ts` |
| Test file | `{name}.test.ts` | `battleEngine.test.ts` |
| Worker file | `{Name}Worker.ts` | `RenderWorker.ts` |
| Constant file | `{name}.constants.ts` | `game.constants.ts` |
| Type file | `{name}.types.ts` | `battle.types.ts` |
| Directory | `kebab-case/` | `battle-engine/` |

**Code Identifiers:**

| Element | Convention | Example |
|---------|-----------|---------|
| Class | PascalCase | `BattleEngine` |
| Interface | PascalCase, prefix I | `IBattleService` |
| Type alias | PascalCase | `BattleResult` |
| Enum | PascalCase | `BattleStatus` |
| Enum member | UPPER_SNAKE | `BATTLE_STATUS.COMPLETED` |
| Function/method | camelCase | `simulateBattle()` |
| Variable | camelCase | `activeBattle` |
| Constant | UPPER_SNAKE | `MAX_BATTLE_ROUNDS` |
| Private field | _camelCase | `_cache` |
| MongoDB collection | camelCase (plural) | `characters`, `guildMembers` |
| Redis key | `namespace:entity:id` | `char:stats:userId123` |
| BullMQ queue | `kebab-case` | `render-queue` |

---

### 16.2 Coding Standards

**TypeScript:**
- Strict mode enabled (`"strict": true` in tsconfig).
- No `any` without explicit `// eslint-disable-next-line @typescript-eslint/no-explicit-any` and justification comment.
- No non-null assertions (`!`) without safety proof.
- All functions have explicit return types.
- Prefer `const` over `let`; no `var`.
- Prefer named exports over default exports (for better tree-shaking and refactoring).
- All public service methods are `async`; return `Promise<T>` explicitly.

**Error Handling:**
- Custom error classes extend `Error` with `code` property.
- All async functions caught at the dispatcher level.
- Never `throw` strings — always `throw new Error(...)` or custom error.
- Errors include context (userId, commandName) for debugging.

**Imports:**
- No circular imports.
- External packages first, internal packages second (ESLint enforced).
- Use path aliases (`@/services/BattleService`) over relative paths `../../`.

**Comments:**
- JSDoc for all public service methods.
- Inline comments for complex algorithms (damage formula steps, RNG usage).
- No obvious comments (`// increment counter` before `i++`).
- Reference Book 1 or Book 2 in comments where formulas come from: `// Damage formula: see Book 1, Section 4.2`.

---

### 16.3 Branch Strategy

**Branch model:** GitHub Flow (simplified trunk-based for fast iteration)

```
main              → Production branch. Only PR merges. Protected.
develop           → Staging branch. Feature PRs merge here first.
feature/{ticket}  → Feature branches, short-lived (<2 weeks).
fix/{ticket}      → Bug fix branches.
hotfix/{ticket}   → Emergency production fixes (merge directly to main).
release/{version} → Release preparation branch (created from develop).
```

**Branch Protection Rules (main):**
- Require 2 approving reviews.
- Require CI to pass (lint, typecheck, unit tests, integration tests).
- No direct pushes — PRs only.
- Stale review dismissal on new commits.

**Branch Protection Rules (develop):**
- Require 1 approving review.
- Require CI to pass.
- No direct pushes — PRs only.

---

### 16.4 Commit Message Format

**Format:** Conventional Commits (https://www.conventionalcommits.org)

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

| Type | Usage |
|------|-------|
| `feat` | New feature |
| `fix` | Bug fix |
| `perf` | Performance improvement |
| `refactor` | Code restructuring (no behavior change) |
| `test` | Add or update tests |
| `docs` | Documentation only |
| `build` | Build system, CI, dependencies |
| `chore` | Maintenance (deps upgrade, etc.) |
| `revert` | Revert a previous commit |

**Examples:**

```
feat(battle): add ultimate charge system

Implements UltimateManager with charge tracking per participant.
Charge gains on attack, on hit, and per round (rates per Book 1 Section 5.3).

Closes #142

---

fix(economy): prevent overdraft on concurrent debit

Added distributed Redis lock before every debit operation.
Previously, concurrent requests could both pass balance check and both succeed.

Fixes #218

---

perf(renderer): implement canvas context pooling

Reuses pre-allocated Canvas contexts across render jobs, reducing
GC pressure by ~40% under load (measured in load test ML-89).
```

---

### 16.5 Pull Request Process

**PR Template Fields:**
- Summary: What does this PR do?
- Type: Feature | Fix | Refactor | Performance | Docs | Build
- Related issue(s): `Fixes #NNN`
- Changes: Bullet list of changes
- Testing: How was this tested?
- Book 1/2 references: If applicable, which sections were consulted?
- Screenshots: Required for UI changes (embed previews)
- Deployment notes: Any migration steps, config changes, or deploy-order requirements?
- Checklist (see Code Review Checklist)

**PR Size Limit:**
- PRs should touch < 500 lines (excluding generated files and seed data).
- Large PRs must be broken into a stack of smaller PRs.
- Exceptions: seed data, generated files, documentation.

---

### 16.6 Code Review Checklist

**Reviewer Checklist:**

```
Correctness
  □ Does the code do what the PR description says?
  □ Are edge cases handled (null, empty, zero, max)?
  □ Is error handling correct and complete?
  □ Are all new functions/methods tested?

Architecture
  □ Does this follow the service ownership rules (no cross-collection queries)?
  □ Are new MongoDB collections indexed appropriately?
  □ Is Redis used correctly (correct TTLs, correct namespace)?
  □ Does any new economy operation use a distributed lock?
  □ Is the change consistent with Book 1 and Book 2 rules?

Performance
  □ Are there any N+1 query patterns?
  □ Is new data properly cached?
  □ Are bulk operations used where individual operations would be inefficient?

Security
  □ Is all input validated before reaching the service layer?
  □ Are economy operations atomic?
  □ Is any sensitive data logged?
  □ Is new functionality properly rate-limited?

Standards
  □ Are naming conventions followed?
  □ Are all public methods documented (JSDoc)?
  □ Are there no `any` types without justification?
  □ Are commits in conventional commit format?
```

---

### 16.7 Documentation Standards

**Every new service/module must include:**
- JSDoc on the class describing its purpose.
- JSDoc on every public method: `@param`, `@returns`, `@throws`.
- Reference to Book 1 or Book 2 for any game-logic formulas.
- A brief Markdown section added to this Bible if the module introduces a new major concept.

**JSDoc Example:**

```typescript
/**
 * Executes the damage pipeline for a single attack action.
 * 
 * Applies the formula defined in Book 1, Section 4.2:
 * base → element modifier → crit → defense reduction → status modifiers → floor.
 * 
 * @param event - The attack event containing source, target, and skill data
 * @param context - The current battle context with all participant states
 * @returns DamageEvent with all intermediate values and final damage applied
 * @throws BattleEngineError if target or source participant not found in context
 */
processDamage(event: AttackEvent, context: BattleContext): DamageEvent
```

**Documentation Updates:**
- Any API endpoint change must be reflected in `docs/API-Specification.md`.
- Any schema change must be reflected in `docs/Database-Schema.md`.
- Any Architecture Decision Record must be logged in `docs/Architecture-Decision-Records.md`.
- Any infrastructure change must be reflected in `docs/Deployment-Guide.md`.

---

*End of Book 3 — Technical Architecture Bible*

*Document Version: 1.0.0*  
*Status: COMPLETE — For implementation use*  
*Cross-references: Book 1 (Foundation & Systems Design), Book 2 (Content Bible)*
