# ASCENSION LEGENDS
## Operations & Live-Service Bible — Book 4
### Internal Document | Studio Version 1.0 | Classification: CONFIDENTIAL

---

> *"A world is not launched. It is tended."*
>
> This document is the authoritative operational reference for Ascension Legends post-launch. Every engineer, SRE, community manager, QA analyst, economy designer, and release manager who touches the live service must read and apply this bible. It is a living document — updated with every major season, incident, and operational evolution.
>
> **Books 1–3 are prerequisites.** This document assumes full familiarity with the Game Developer Bible (Book 1), the Content Bible (Book 2), and the Technical Architecture Bible (Book 3).

---

# TABLE OF CONTENTS

1. [Live-Service Philosophy](#1--live-service-philosophy)
2. [Deployment Strategy](#2--deployment-strategy)
3. [Server Operations](#3--server-operations)
4. [Monitoring & Observability](#4--monitoring--observability)
5. [Incident Response](#5--incident-response)
6. [Backups & Data Integrity](#6--backups--data-integrity)
7. [Security Operations](#7--security-operations)
8. [Economy Operations](#8--economy-operations)
9. [Balance Patch Workflow](#9--balance-patch-workflow)
10. [Season Management](#10--season-management)
11. [Events Operations](#11--events-operations)
12. [Community Management](#12--community-management)
13. [Customer Support](#13--customer-support)
14. [Quality Assurance](#14--quality-assurance)
15. [Disaster Recovery](#15--disaster-recovery)
16. [Analytics & KPIs](#16--analytics--kpis)
17. [Release Management](#17--release-management)
18. [Future Expansions](#18--future-expansions)
19. [Team Structure & Org Design](#19--team-structure--org-design)
20. [Final Pre-Launch Checklist](#20--final-pre-launch-checklist)

---

# 1 — LIVE-SERVICE PHILOSOPHY

## 1.1 Long-Term Vision

Ascension Legends is not a product with an end-state. It is a living world — Aethon — that breathes, evolves, and surprises players on a continuous cadence. Our five-year vision establishes the trajectory:

| Year | Milestone |
|------|-----------|
| Y1 | Stable launch with all 10 continents accessible, 50 classes, complete guild system, and 3 raid tiers |
| Y2 | First major expansion: new continent, 10 new classes, competitive tournament circuit, companion web app |
| Y3 | PvP arena seasons fully institutionalized, cross-server guild wars, public creator API |
| Y4 | Mobile companion app GA, creator economy tools, third-party tournament organizer program |
| Y5 | Platform maturity — Ascension Legends as a recognized Discord gaming institution with annual championship events |

The operational mandate for every team member is to **protect the world**. Every decision — a patch, a hotfix, a content drop, an economy tweak — must be evaluated against whether it makes Aethon feel more alive or less.

## 1.2 Player-First Principles

These principles are non-negotiable. They govern every operational decision:

### Principle 1 — Earned Progress Is Sacred
Player progression data is the most valuable asset we steward. A player's Level 74 Shadowblade with 340 hours of investment is irreplaceable. Our systems, backups, and rollback procedures exist first and foremost to protect this data. **No operation that risks data loss is ever "low risk."**

### Principle 2 — Transparency Over Spin
When something goes wrong — a rollback, an economy correction, a missed content date — we tell players what happened, why it happened, and what we did to fix it. We do not hide incidents behind vague system messages. Players who trust us stay. Players who feel deceived leave and do not return.

### Principle 3 — Respect Player Time
Every minute of unplanned downtime costs real player time. Maintenance windows are scheduled during low-traffic hours. Hotfixes are batched where possible. We do not deploy during peak hours unless it is a critical security or economy exploit fix.

### Principle 4 — The Economy Is the Game
Ascension Legends' long-term health is inseparable from its economy. Inflation, deflation, currency sinks, and drop-rate calibration are not minor tuning variables — they are core gameplay. The Economy Analyst role exists precisely because this requires dedicated, expert attention.

### Principle 5 — Community Is Infrastructure
The Discord servers, the moderators, the community events, the Q&A sessions — these are not marketing. They are functional infrastructure that turns individual players into a community. Community disintegration is a service outage.

## 1.3 Live-Service Goals

**Year 1 Operational Targets:**

| Metric | Target |
|--------|--------|
| Bot Uptime (monthly) | ≥ 99.9% |
| P95 Command Response Time | ≤ 800 ms |
| Critical Incident MTTD (Mean Time to Detect) | ≤ 5 minutes |
| Critical Incident MTTR (Mean Time to Resolve) | ≤ 30 minutes |
| Planned Downtime per Month | ≤ 60 minutes |
| Player Data Loss Incidents | 0 |
| Unresolved P1 Bug Age | ≤ 24 hours |
| Economy Exploit MTTR | ≤ 15 minutes |

**Year 2+ targets will be set during the Y1 post-mortem season review.**

## 1.4 Community Growth Strategy

### Phase 1 — Launch Cohort (Months 1–3)
The launch cohort defines the game's culture. These are the players who will become community leaders, veteran advisors, and organic ambassadors. They must feel special, heard, and rewarded for being early.

**Operations during Phase 1:**
- Weekly developer Q&A sessions (text-based in community Discord)
- Daily "Lore Drop" posts from the Content team
- Bug-report-to-response SLA of 48 hours for all visible forum reports
- Monthly "State of Aethon" developer letter signed by the Game Director
- Early Adopter cosmetic rewards that remain exclusive forever

### Phase 2 — Growth Period (Months 4–12)
The game must grow beyond its launch cohort without alienating them.

**Operations during Phase 2:**
- Referral rewards program: existing players who invite friends receive Gold (⚙️) and limited cosmetics
- Content creator program launch: Stardust (✨) stipends and early access for qualifying creators
- Ambassador program: top community contributors receive in-game titles and direct developer channel access
- Monthly player surveys with published response summaries
- Server Partnership program: major Discord communities that deploy Ascension Legends receive custom guild perks

### Phase 3 — Maturity (Year 2+)
At scale, community management becomes a product in itself.

**Operations during Phase 3:**
- Official tournament organization tools for community-run events
- Yearly in-person or virtual developer summit
- Public roadmap with community voting on minor feature prioritization
- Formal content creator guild: verified creators get dedicated support channel and custom cosmetic drops

## 1.5 Sustainable Content Delivery

The most dangerous promise a live-service game can make is "constant content." Instead, Ascension Legends uses a **cadenced content model**:

```
CADENCE MODEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WEEKLY  →  Events (Double XP, mini-challenges)
MONTHLY →  Balance patch, economy review, QoL fixes
QUARTERLY → Season launch OR major content drop
ANNUAL  →  Expansion OR landmark story chapter
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

This cadence is published to players as the "Aethon Content Calendar." Missing a cadenced delivery is an incident — it must be communicated proactively and accompanied by a make-good.

**Content Pipeline Rule:** Every content item must be 100% complete and QA-passed **14 days before** its scheduled delivery date. No "we'll finish it during maintenance" content ships.

---

# 2 — DEPLOYMENT STRATEGY

## 2.1 Environment Architecture

Ascension Legends maintains five distinct environments. Each is isolated, purpose-built, and governed by strict promotion gates.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ENVIRONMENT PIPELINE                              │
│                                                                     │
│  DEVELOPER  →  TESTING  →  QA/STAGING  →  CANARY  →  PRODUCTION    │
│                                                                     │
│  (Local)       (CI)         (Shared)      (5% traffic)  (Full)     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.1.1 Developer Environment
- **Purpose:** Individual engineer local development
- **Data:** Seeded synthetic data — never real player data
- **Infrastructure:** Docker Compose (local MongoDB, Redis, bot instance)
- **Bot Token:** Dedicated development bot application
- **Promotion Gate:** Passing all local unit tests and linter

### 2.1.2 Testing Environment (CI)
- **Purpose:** Automated test execution on every pull request
- **Infrastructure:** Ephemeral Kubernetes pods spun up per PR, torn down on merge
- **Data:** Fresh synthetic dataset per CI run
- **Bot Token:** CI bot application with test guild
- **Promotion Gate:**
  - All unit tests pass (target: 100% pass rate)
  - All integration tests pass
  - TypeScript strict-mode compilation clean
  - No high-severity security advisories (npm audit)
  - Code coverage ≥ 80% for new code

### 2.1.3 QA / Staging Environment
- **Purpose:** Manual QA, exploratory testing, content preview
- **Infrastructure:** Permanent Kubernetes cluster, scaled to ~10% of production capacity
- **Data:** Anonymized snapshot of production data (refreshed weekly)
- **Bot Token:** QA bot application with QA guild
- **Access:** QA team, senior engineers, game designers, and invited beta testers
- **Promotion Gate:**
  - QA sign-off from at least 2 QA engineers
  - Game designer sign-off for content changes
  - Economy Analyst sign-off for economy changes
  - Security review complete for auth/security changes

### 2.1.4 Canary Environment
- **Purpose:** Production traffic testing at reduced blast radius
- **Infrastructure:** Production cluster, receives 5% of live traffic via weighted routing
- **Data:** Live production data
- **Bot Token:** Production bot (canary shards only)
- **Promotion Gate:**
  - Canary error rate ≤ production baseline error rate + 0.1%
  - Canary P95 latency ≤ production P95 + 100 ms
  - Minimum canary soak time: 30 minutes for hotfixes, 2 hours for patches, 4 hours for major releases
  - On-call engineer monitoring throughout canary window

### 2.1.5 Production Environment
- **Purpose:** Live player-facing service
- **Infrastructure:** Full Kubernetes cluster (see Section 3 for sizing)
- **Data:** Live player data
- **Promotion Gate:** Canary soak complete, on-call sign-off, no active P1/P2 incidents

## 2.2 Blue/Green Deployment

Ascension Legends uses blue/green deployment for all production releases. At any time, one deployment color (e.g., Blue) is active, while the other (Green) is idle or warming up.

```
BLUE/GREEN DEPLOYMENT FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1: Green environment deployed with new version
Step 2: Green health checks run (all pods Ready)
Step 3: Green receives canary traffic (5%)
Step 4: Canary soak period (30 min – 4 hours)
Step 5: Traffic shifted 100% to Green
Step 6: Blue environment kept hot for 30 minutes (rollback standby)
Step 7: Blue decommissioned (or becomes next Green target)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Discord Shard Considerations:** Discord shards cannot be hot-swapped mid-session without disconnecting connected guilds. The shard handoff protocol:
1. New shards (Green) connect with `IDENTIFY` to Discord Gateway
2. Old shards (Blue) send `DISCONNECT` only after Green shards are fully `READY`
3. Maximum allowed gap between Green READY and Blue DISCONNECT: 60 seconds
4. If Green shards fail READY within 120 seconds, abort and remain on Blue

## 2.3 Canary Deployment

Canary deployment uses Kubernetes weighted routing to direct a percentage of incoming bot interactions to the new version:

```yaml
# Conceptual canary routing configuration
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/canary: "true"
    nginx.ingress.kubernetes.io/canary-weight: "5"
```

**Canary Soak Criteria (all must be true to promote):**

| Check | Pass Condition |
|-------|---------------|
| Error rate | Canary ≤ prod + 0.1% |
| P95 latency (commands) | Canary ≤ prod + 100 ms |
| P95 latency (API) | Canary ≤ prod + 150 ms |
| Battle completion rate | Canary ≥ prod - 0.5% |
| Render success rate | Canary ≥ prod - 1% |
| MongoDB error rate | Canary ≤ prod + 0.05% |
| Redis error rate | Canary ≤ prod + 0.05% |

**Automatic Canary Abort:** If any of the above checks fail for more than 3 consecutive minutes during the soak period, the deployment pipeline automatically routes all traffic back to the Blue (stable) environment and pages the on-call engineer.

## 2.4 Rollback Strategy

Rollback is a first-class operation, not an emergency measure. Engineers must be as comfortable executing a rollback as they are deploying a new version.

### Rollback Decision Tree

```
INCIDENT DETECTED
       │
       ▼
Is it a data corruption issue?
  │YES → Invoke Disaster Recovery Plan (Section 15)
  │      Do NOT simply roll back code
  │NO
       ▼
Is the issue in the new deployment?
  │YES → Initiate rollback procedure
  │NO  → Investigate — may be infrastructure, upstream, or data issue
       ▼
Is rollback possible without data migration reversal?
  │YES → Execute standard rollback (see below)
  │NO  → Engage Technical Director — requires schema rollback plan
```

### Standard Rollback Procedure

```bash
# SOP: Standard Code Rollback
# Time target: < 5 minutes from decision to completion

# 1. Confirm rollback decision (on-call + 1 senior engineer or TD sign-off)
# 2. Execute traffic shift back to Blue environment
kubectl patch ingress ascension-prod \
  --type=json \
  -p='[{"op":"remove","path":"/metadata/annotations/nginx.ingress.kubernetes.io~1canary"}]'

# 3. Verify Blue shards are healthy
kubectl get pods -l app=ascension-bot,color=blue -n production

# 4. Confirm Discord shard reconnect if applicable
# (Monitor #ops-alerts channel for shard READY events)

# 5. Declare rollback complete in #incidents channel
# 6. Open post-mortem ticket immediately
```

### Database Migration Rollbacks
- All database migrations MUST be written with an `up` and a `down` script
- Destructive schema changes (column drops, collection renames) require 3-version deprecation cycle:
  - Version N: add new column/collection, keep old
  - Version N+1: migrate data, dual-write
  - Version N+2: remove old column/collection
- Emergency schema rollbacks require explicit Technical Director approval and are coordinated with DBA

## 2.5 Environment Management

### Secrets Management
All environment secrets (Discord bot tokens, MongoDB connection strings, Redis credentials, signing keys) are managed via **Kubernetes Secrets** backed by a secrets manager (HashiCorp Vault or cloud-native equivalent). Rules:
- No secrets in source code, configuration files, or container images
- Secrets are rotated quarterly or immediately upon suspected compromise
- Staging secrets are completely separate from production secrets — never share credentials across environments
- The Engineering team maintains a `SECRETS_INVENTORY.md` (internal, never committed to git) listing all secret names and their rotation schedule

### Environment Configuration
Each environment uses the same Docker image. Environment-specific configuration is injected at runtime via environment variables. The source of truth for environment configuration is the Infrastructure-as-Code repository (Terraform/Helm charts), maintained separately from the application repository.

**Required Environment Variables per Service:**

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Runtime environment | `production` |
| `DISCORD_TOKEN` | Discord bot token | (secret) |
| `DISCORD_CLIENT_ID` | Discord application ID | `1234567890` |
| `MONGODB_URI` | MongoDB Atlas connection string | (secret) |
| `REDIS_URL` | Redis cluster connection | (secret) |
| `PORT` | HTTP server port | `5000` |
| `SHARD_COUNT` | Total number of shards | `16` |
| `SHARD_LIST` | Shards this pod manages | `0,1,2,3` |
| `RENDER_WORKER_URL` | Internal render service URL | `http://render-svc:3001` |
| `ADMIN_API_URL` | Internal admin API URL | `http://admin-api-svc:5000` |
| `LOG_LEVEL` | Pino log level | `info` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OpenTelemetry collector | `http://otel:4318` |

---

# 3 — SERVER OPERATIONS

## 3.1 Discord Shard Management

Ascension Legends uses discord.js v14 auto-sharding at scale. Shards are the fundamental unit of Discord gateway connection management.

### 3.1.1 Shard Sizing Model

Discord recommends a maximum of **2,500 guilds per shard**. We target **1,500 guilds per shard** for headroom:

| Guild Count | Recommended Shards | Ascension Legends Shards |
|-------------|-------------------|--------------------------|
| 0 – 2,500 | 1 | 2 (minimum for redundancy) |
| 2,500 – 15,000 | 4 | 6 |
| 15,000 – 75,000 | 10 | 16 |
| 75,000 – 150,000 | 25 | 32 |
| 150,000 – 300,000 | 50 | 64 |
| 300,000+ | Auto-calculated | Auto-calculated (+ 20% headroom) |

### 3.1.2 Shard Pod Layout

Each Kubernetes Pod runs a shard group (4 shards per pod):

```
┌─────────────────────────────────────────────────────────────┐
│  KUBERNETES NODE (8 vCPU, 32 GB RAM)                       │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Bot Pod 0    │  │ Bot Pod 1    │  │ Bot Pod 2    │     │
│  │ Shards 0–3   │  │ Shards 4–7   │  │ Shards 8–11  │     │
│  │ 2 vCPU       │  │ 2 vCPU       │  │ 2 vCPU       │     │
│  │ 8 GB RAM     │  │ 8 GB RAM     │  │ 8 GB RAM     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 3.1.3 Shard Health Monitoring

Each shard reports heartbeat status to the ShardManager. Shard health is monitored via:

- **Heartbeat latency:** Target < 250 ms. Alert at > 500 ms. Page at > 1,000 ms or missed heartbeat.
- **Guild count drift:** If a shard's guild count deviates > 15% from expected, investigate.
- **Reconnect rate:** > 3 reconnects in 5 minutes on any shard triggers an alert.
- **READY event latency:** Time from IDENTIFY to READY should be < 30 seconds. > 60 seconds pages on-call.

### 3.1.4 Shard Communication

Inter-shard communication uses **Redis Pub/Sub** (not direct IPC) to allow shards to run in separate Kubernetes pods:

```
CROSS-SHARD COMMUNICATION CHANNELS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
shard:broadcast       — global announcements
shard:guild:{id}      — per-guild messages (routed to owning shard)
shard:user:{id}       — per-user messages
shard:battle:{id}     — battle state updates
shard:raid:{id}       — raid coordination
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 3.2 Regional Deployment

Ascension Legends targets a global player base. Regional deployment reduces Discord Gateway latency and database query round-trip times.

### 3.2.1 Initial Regions

| Region | Location | Primary Market | Discord Gateway |
|--------|----------|----------------|-----------------|
| `us-east` | Virginia, USA | North America East | us-east.discord.gg |
| `us-west` | Oregon, USA | North America West + Pacific | us-west.discord.gg |
| `eu-west` | Dublin, Ireland | Europe + Africa | eu-west.discord.gg |
| `ap-southeast` | Singapore | Southeast Asia + Oceania | ap-southeast.discord.gg |

### 3.2.2 Regional Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  GLOBAL CONTROL PLANE                                               │
│  • Shard assignment registry (Redis Global)                        │
│  • Admin API (global, multi-region active-active)                  │
│  • MongoDB Atlas Global Cluster (multi-region write distribution)   │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────────┐
          │                │                    │
    ┌─────▼──────┐  ┌──────▼─────┐  ┌──────────▼────┐
    │  us-east   │  │  eu-west   │  │  ap-southeast │
    │  Shard Pod │  │  Shard Pod │  │  Shard Pod    │
    │  Render    │  │  Render    │  │  Render       │
    │  Workers   │  │  Workers   │  │  Workers      │
    └────────────┘  └────────────┘  └───────────────┘
```

**Data Residency:** Player data is stored globally (MongoDB Atlas Global Cluster) with **local read preference** — queries are served from the nearest replica. Writes are always routed to the primary region (`us-east`). This will be reviewed for EU GDPR compliance (see Section 7).

## 3.3 Scaling Policy

### 3.3.1 Horizontal Pod Autoscaling (HPA)

Bot pods and worker pods scale based on CPU utilization and custom metrics:

**Bot Pods:**
```
Min replicas: 4
Max replicas: 32
Scale-up trigger: CPU > 70% for 60 seconds
Scale-down trigger: CPU < 30% for 300 seconds
Custom metric: shard_queue_depth > 50 commands
```

**Render Workers:**
```
Min replicas: 2
Max replicas: 16
Scale-up trigger: BullMQ queue depth > 20 jobs
Scale-down trigger: BullMQ queue depth < 5 jobs for 120 seconds
```

**API Server:**
```
Min replicas: 3
Max replicas: 12
Scale-up trigger: CPU > 65% for 60 seconds, OR requests/sec > 500
Scale-down trigger: CPU < 25% for 300 seconds
```

### 3.3.2 Cluster Autoscaling (Node-Level)

Kubernetes Cluster Autoscaler adds/removes nodes when pod scheduling is constrained:

- **Scale-up:** Node added when pods are Pending > 2 minutes due to resource constraints
- **Scale-down:** Node removed when utilization < 30% for 10 minutes and all pods can fit elsewhere
- **Protected nodes:** At least 2 nodes per region are never scaled down (minimum baseline)

### 3.3.3 Discord Rate Limit Aware Scaling

Discord imposes rate limits on global commands, message sends, and gateway identifies. Our autoscaler must respect these limits:

| Rate Limit | Limit | Operations Response |
|------------|-------|---------------------|
| IDENTIFY per day (per bot token) | 1,000 | Never scale shards beyond token limit |
| Global slash command rate | 50/second per application | Queue commands, batch updates |
| Message send | 5/second per channel | Rate-limit wrapper in all message code |
| Webhook send | 30/minute per webhook | Webhook pool with rotation |

## 3.4 Redis Cluster Management

Redis serves three distinct roles in Ascension Legends:
1. **Cache** — character stats, leaderboards, session data
2. **Distributed Locks** — battle engine, economy transactions (Redlock)
3. **Pub/Sub** — inter-shard communication, event bus

### 3.4.1 Redis Cluster Topology

```
┌──────────────────────────────────────────────────────────────────┐
│  REDIS CLUSTER (6 nodes minimum for production)                 │
│                                                                  │
│  Primary 1 (slots 0–5460)     → Replica 1A, 1B                  │
│  Primary 2 (slots 5461–10922) → Replica 2A, 2B                  │
│  Primary 3 (slots 10923–16383) → Replica 3A, 3B                  │
└──────────────────────────────────────────────────────────────────┘
```

**Sizing:** Each Redis node: 8 vCPU, 32 GB RAM. Total cluster RAM: 192 GB (usable ~100 GB with replication).

### 3.4.2 Redis Key Namespacing

```
NAMESPACE CONVENTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cache:char:{ulid}             — character stat snapshot (5-min TTL)
cache:lb:global:xp            — global XP leaderboard (1-min TTL)
cache:lb:guild:{id}:xp        — per-guild leaderboard (2-min TTL)
lock:battle:{ulid}            — battle lock (30-sec TTL, auto-extended)
lock:economy:transfer:{ulid}  — economy transfer lock (5-sec TTL)
session:user:{discord_id}     — admin session (24-hr TTL)
pubsub:shard:broadcast        — shard broadcast channel
event:world_boss:{id}         — world boss state (event duration TTL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3.4.3 Redis Operational Procedures

**Daily:**
- Review Redis memory usage — alert if > 70% cluster memory
- Review keyspace hit rate — alert if cache hit rate < 85%
- Review slow log — investigate queries > 10 ms

**Weekly:**
- Review TTL distributions — identify any keys with no TTL (potential memory leak)
- Review Redlock contention — high contention on battle locks may indicate bug
- Cluster node health check — verify replication lag < 10 ms

**Monthly:**
- Review Redis configuration for any version-recommended settings updates
- Test failover: manually promote a replica to primary and verify recovery
- Review keyspace growth trends and project capacity needs

## 3.5 MongoDB Cluster Management

MongoDB serves as the primary persistent data store for all player data, guild data, economy records, and battle history.

### 3.5.1 MongoDB Atlas Configuration

**Production Cluster:**
- Tier: M60 (or equivalent) — 16 vCPU, 128 GB RAM per node
- Replica Set: 3 nodes (1 primary + 2 secondaries)
- Global Cluster: Sharded across 4 regions (see Section 3.2)
- Oplog Window: Minimum 24 hours
- Point-in-Time Recovery: Enabled, 35-day retention

**Collection Sharding Strategy:**

| Collection | Shard Key | Rationale |
|------------|-----------|-----------|
| `characters` | `{ guild_id: 1, _id: 1 }` | Guild-local queries dominate |
| `battles` | `{ started_at: 1, _id: 1 }` | Time-range queries for history |
| `economy_transactions` | `{ user_id: 1, created_at: 1 }` | Per-user ledger queries |
| `guild_wars` | `{ season_id: 1, _id: 1 }` | Season-scoped queries |
| `marketplace_listings` | `{ item_type: 1, price: 1 }` | Browse and sort queries |

### 3.5.2 Index Management

Indexes are treated as part of the schema and reviewed in every schema migration. Rules:
- Every query in the codebase must have a corresponding index documented in `docs/Database-Schema.md`
- Indexes are created with `{ background: true }` in production (Atlas handles this automatically)
- Unused indexes are removed quarterly (identified via `$indexStats` aggregation)
- Compound indexes are preferred over multiple single-field indexes for query patterns that always filter on multiple fields together

### 3.5.3 MongoDB Operational Procedures

**Daily:**
- Atlas Performance Advisor: review and act on recommended index suggestions
- Atlas Metrics: verify no replication lag > 2 seconds
- Slow query log: investigate any operation > 100 ms in production
- Check Atlas backup status: confirm latest snapshot completed successfully

**Weekly:**
- Review collection growth rates against capacity plan
- Run `db.stats()` on major collections; verify no unexpected bloat
- Review connection pool metrics — alert if connections > 80% of max pool size
- Test read from secondary: confirm read preference `secondaryPreferred` is working for analytics queries

**Monthly:**
- Full Atlas health review
- Test point-in-time restore to staging (see Section 6)
- Review and rotate MongoDB Atlas user credentials
- Validate all collection indexes are being used (drop unused)

## 3.6 Worker Scaling

BullMQ workers process background jobs: battle rendering, media generation, economy processing, notification dispatch, and analytics aggregation.

### 3.6.1 Worker Queue Definitions

| Queue | Purpose | Target Throughput | SLA |
|-------|---------|-------------------|-----|
| `battle-render` | Generate battle GIF/MP4 | 50 renders/min | < 15 seconds |
| `economy-process` | Async economy transactions | 500 tx/min | < 5 seconds |
| `notification-dispatch` | DM/webhook notifications | 1,000/min | < 10 seconds |
| `analytics-ingest` | Game event analytics | 10,000 events/min | < 60 seconds |
| `media-generate` | On-demand card renders | 200/min | < 20 seconds |
| `leaderboard-refresh` | Leaderboard recalculation | Scheduled (1/min) | < 30 seconds |
| `season-score` | Season ranking updates | 100/min during events | < 10 seconds |

### 3.6.2 Worker Dead Letter Queue (DLQ)

All queues have a Dead Letter Queue. Jobs that fail after 3 retries are moved to the DLQ for manual investigation. DLQ monitoring rules:
- Any item in DLQ older than 15 minutes triggers an alert
- `battle-render` DLQ items older than 5 minutes trigger an alert (player is waiting)
- DLQ items are never automatically purged — they require manual review and resolution

---

# 4 — MONITORING & OBSERVABILITY

## 4.1 Observability Stack

```
OBSERVABILITY ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Metrics    →  Prometheus → Grafana Dashboards
Traces     →  OpenTelemetry → Jaeger / Tempo
Logs       →  Pino (JSON) → Loki → Grafana
Alerts     →  Alertmanager → PagerDuty → On-call
Uptime     →  Synthetic monitors (Grafana Synthetic Monitoring)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 4.2 Dashboard Catalog

### Dashboard 1 — Bot Health Overview
**Audience:** On-call engineers, SRE
**Refresh:** 15 seconds

| Panel | Metric | Alert Threshold |
|-------|--------|-----------------|
| Bot Uptime | `bot_uptime_seconds` | Alert if uptime < 99.9% (30-day rolling) |
| Active Shards | `discord_shards_connected` | Alert if < total expected shards |
| Shard Heartbeat P95 | `discord_heartbeat_latency_ms{quantile="0.95"}` | Alert if > 500 ms |
| Commands/Minute | `discord_commands_total` rate(1m) | — (trend only) |
| Command Error Rate | `discord_command_errors_total / discord_commands_total` | Alert if > 1% |
| Reconnect Rate | `discord_shard_reconnects_total` rate(5m) | Alert if > 3/shard/5min |
| Memory Usage | `process_resident_memory_bytes` per pod | Alert if > 80% of limit |
| CPU Usage | `container_cpu_usage_seconds_total` | Alert if > 85% for 5 min |

### Dashboard 2 — Guild Activity
**Audience:** Game Director, Community Lead, Economy Analyst
**Refresh:** 5 minutes

| Panel | Metric | Notes |
|-------|--------|-------|
| Active Guilds (24h) | Guilds with ≥ 1 command in 24h | Churn indicator |
| New Guild Installs | `bot_guild_joins_total` | Growth indicator |
| Guild Uninstalls | `bot_guild_leaves_total` | Churn alarm if > joins |
| Guild Size Distribution | Histogram of member counts | Content sizing guide |
| Top Commands per Guild | By guild type | Feature usage |
| Guild War Participation | Active guild wars vs. total eligible guilds | Engagement health |
| New Player Registrations | `game_character_creates_total` | Growth |
| Player Retention (D7, D30) | Cohort analysis | Funnel health |

### Dashboard 3 — Battle System
**Audience:** SRE, Game Engineers
**Refresh:** 30 seconds

| Panel | Metric | Alert Threshold |
|-------|--------|-----------------|
| Battles Started/Min | `game_battles_started_total` rate | — |
| Battle Completion Rate | Completed / Started | Alert if < 98% |
| Battle Duration P95 | `game_battle_duration_ms{quantile="0.95"}` | Alert if > 5 min |
| Render Queue Depth | `bullmq_queue_depth{queue="battle-render"}` | Alert if > 30 |
| Render Time P95 | `game_render_duration_ms{quantile="0.95"}` | Alert if > 20 s |
| Render Failure Rate | Failed / Total | Alert if > 2% |
| Battle Lock Contention | `redlock_lock_retries_total{lock_type="battle"}` | Alert if > 50/min |
| Abandoned Battles | Battles started but not completed after 10 min | Alert if > 1% |

### Dashboard 4 — Command Performance
**Audience:** On-call engineers
**Refresh:** 15 seconds

| Panel | Metric | Alert Threshold |
|-------|--------|-----------------|
| Total Commands/Min | Rate across all commands | Spike detection |
| P50 / P95 / P99 Response Time | By command name | P95 > 800 ms = alert |
| Slowest Commands (Top 10) | By P95 latency | Optimization target |
| Error Rate by Command | Errors / total per command | > 5% = alert |
| Discord API Timeout Rate | `discord_api_timeouts_total` | > 1% = alert |
| Command Queue Lag | Time from receive to execute | > 2 s = alert |

### Dashboard 5 — Error Tracking
**Audience:** Engineers, on-call
**Refresh:** 30 seconds

| Panel | Metric | Alert Threshold |
|-------|--------|-----------------|
| Error Rate (all services) | `errors_total / requests_total` | > 0.5% = alert |
| Unhandled Exceptions | `process_uncaught_exceptions_total` | Any = alert |
| 5xx Rate (Admin API) | HTTP 5xx / total requests | > 1% = alert |
| MongoDB Driver Errors | `mongodb_driver_errors_total` | > 10/min = alert |
| Redis Connection Errors | `redis_connection_errors_total` | Any = alert |
| BullMQ Failed Jobs | `bullmq_job_failures_total` rate | > 5/min = alert |
| Top 10 Error Types | By error code/message | Triage guide |

### Dashboard 6 — API Performance (Admin API)
**Audience:** Backend engineers
**Refresh:** 30 seconds

| Panel | Metric | Alert Threshold |
|-------|--------|-----------------|
| Requests/Min | HTTP requests rate | — |
| P95 Latency by Route | Per endpoint | > 500 ms = alert |
| Error Rate by Route | 4xx and 5xx per endpoint | 5xx > 1% = alert |
| Auth Failure Rate | 401/403 rate | Spike = possible attack |
| Request Size Distribution | Bytes per request | Spike = possible attack |
| Concurrent Connections | Active connections | > 80% of max = alert |

### Dashboard 7 — Infrastructure (Redis, MongoDB, CPU, Memory)
**Audience:** SRE, DBAs
**Refresh:** 30 seconds

**Redis Panels:**
| Panel | Alert Threshold |
|-------|-----------------|
| Memory Used / Max | > 75% = warning, > 85% = alert |
| Hit Rate | < 85% = alert |
| Commands/Sec | Spike detection |
| Replication Lag | > 50 ms = alert |
| Connected Clients | > 80% of max = alert |
| Slow Commands (> 10 ms) | Any slow commands = investigation |

**MongoDB Panels:**
| Panel | Alert Threshold |
|-------|-----------------|
| Op Rate (reads/writes/commands) | — (trend) |
| Replication Lag | > 2 s = alert |
| Queue Length (read/write) | > 100 = alert |
| Connections Used | > 80% of max = alert |
| Cache Hit Rate (WiredTiger) | < 80% = alert |
| Atlas Disk I/O | > 70% = alert |

**Node/Container:**
| Panel | Alert Threshold |
|-------|-----------------|
| CPU per node | > 85% = alert |
| Memory per pod | > 80% = alert |
| Network I/O | Spike > 2× baseline = alert |
| Pod restart count | Any restart in 5 min = alert |

### Dashboard 8 — Queue Processing
**Audience:** SRE, engineers
**Refresh:** 15 seconds

| Panel | Alert Threshold |
|-------|-----------------|
| Queue depth per queue | Queue-specific thresholds (see Section 3.6.1) |
| Job throughput/min | Below SLA = alert |
| Failed job rate | > 2% = alert |
| DLQ depth per queue | Any item > 5 min = alert |
| Worker concurrency | Below min = alert |
| Job age (P95) | Exceeds SLA = alert |

### Dashboard 9 — Media Rendering
**Audience:** Engineers, SRE
**Refresh:** 30 seconds

| Panel | Alert Threshold |
|-------|-----------------|
| Render requests/min | — |
| Render success rate | < 98% = alert |
| Render P95 duration | > 15 s = alert |
| Render P99 duration | > 30 s = alert |
| Canvas render errors | > 1% = alert |
| GIF output size P95 | > 8 MB = investigate |
| MP4 encode time P95 | > 20 s = alert |
| render-worker pod health | Any pod down = alert |

## 4.3 Alerting Tiers

```
ALERT SEVERITY MODEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
P1 — CRITICAL  Players cannot play; data at risk; security breach
               → Immediate page (PagerDuty, phone call)
               → MTTR target: < 30 minutes
               → All hands: on-call + Tech Director + Game Director

P2 — HIGH      Significant feature degraded; > 10% of commands failing
               → PagerDuty alert (push notification)
               → MTTR target: < 2 hours
               → On-call engineer required to acknowledge

P3 — MEDIUM    Degraded performance; elevated errors; no player impact yet
               → Slack alert in #ops-alerts
               → Response target: within 4 hours (business hours)
               → On-call engineer reviews and creates ticket

P4 — LOW       Trending toward a threshold; cosmetic issues; informational
               → Slack alert in #ops-info
               → Response target: next business day
               → Standard engineering backlog
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 4.4 Synthetic Monitoring

Synthetic monitors run every 5 minutes to verify end-to-end functionality:

| Monitor | What It Tests | Alert Threshold |
|---------|--------------|-----------------|
| Admin API `/health` | Service alive | Response > 2s or non-200 = P2 |
| Admin API `/api/v1/status` | DB + Redis connectivity | Non-200 = P1 |
| Discord Bot Ping | Shard heartbeat latency | > 500 ms = P3 |
| Render Worker health | Worker responds to health probe | Down > 2 min = P2 |
| MongoDB Atlas | Atlas monitoring API check | Atlas alert = P2 |

## 4.5 Distributed Tracing

All service-to-service calls are traced using OpenTelemetry:

```
TRACE PROPAGATION PATH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Discord Command Received
  │  trace_id generated
  │
  ├→ Bot Handler (span: command.handler)
  │    ├→ MongoDB query (span: db.find)
  │    ├→ Redis cache check (span: cache.get)
  │    └→ BullMQ job enqueue (span: queue.publish)
  │
  └→ Worker (span: job.process)
       ├→ Battle Engine (span: battle.compute)
       └→ Render Worker HTTP call (span: http.post /render)
            └→ canvas render (span: render.gif)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Traces are retained for 7 days. P99 latency outliers are sampled and retained for 30 days for analysis.

---

# 5 — INCIDENT RESPONSE

## 5.1 Incident Severity Definitions

| Severity | Definition | Examples |
|----------|-----------|---------|
| P1 | Complete service outage or data at risk | Bot offline, DB down, economy exploit, security breach |
| P2 | Major feature unavailable | Battles broken, rendering failed, login failing |
| P3 | Feature degraded | Slow commands, elevated errors (< 10% affected) |
| P4 | Minor issue, no player impact | Cosmetic bug, non-critical warning in logs |

## 5.2 Incident Command Structure

Every P1 and P2 incident must have three roles clearly assigned:

| Role | Responsibility |
|------|---------------|
| **Incident Commander (IC)** | Owns the incident. Coordinates response. Communicates status. NOT doing technical work. |
| **Technical Lead (TL)** | Leads technical investigation and remediation |
| **Communications Lead (CL)** | Drafts and posts player-facing communications |

For P1s: Game Director or Technical Director serves as IC. On-call engineer is TL. Community Lead is CL.
For P2s: Senior on-call engineer is IC and TL. Community Manager is CL.

## 5.3 SOP — Bot Outage (P1)

**Trigger:** Bot offline in > 5% of active guilds, or all shards disconnected.

```
BOT OUTAGE RESPONSE SOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
T+0:00  Alert fires. PagerDuty pages on-call engineer.
T+0:05  On-call acknowledges. Opens #incident-YYYYMMDD-N Slack channel.
        Assigns IC, TL, CL roles.
T+0:10  TL checks:
        □ Shard pod status: kubectl get pods -n production -l app=ascension-bot
        □ Recent deployment: kubectl rollout history deploy/ascension-bot
        □ Discord status page: discordstatus.com
        □ Pod logs: kubectl logs -l app=ascension-bot --tail=200
T+0:10  CL posts status: "We're aware of an issue affecting Ascension Legends
        and are investigating. Updates to follow."
        Post to: Official support server, status page, bot DM if possible.
T+0:15  Decision point:
        IF Discord API outage → see SOP 5.6 (Discord API Outage)
        IF recent deployment → initiate rollback (Section 2.4)
        IF infrastructure issue → escalate to SRE / cloud provider
T+0:30  IC provides 15-minute update to stakeholders.
        CL posts update to players with ETA if known.
T+X:XX  Resolution:
        □ Verify all shards READY
        □ Run synthetic monitors — confirm passing
        □ CL posts resolution message with explanation
        □ IC declares incident resolved
        □ Post-mortem scheduled within 48 hours
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 5.4 SOP — Database Outage (P1)

**Trigger:** MongoDB Atlas alerts, MongoDB driver errors > 50% of requests, or Atlas status shows outage.

```
DATABASE OUTAGE RESPONSE SOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
T+0:00  Alert fires. PagerDuty pages on-call.
T+0:05  On-call acknowledges. Opens incident channel.
T+0:07  TL checks:
        □ Atlas Status page (status.mongodb.com)
        □ Atlas Cluster health in Atlas UI
        □ Verify primary election status (may be in progress)
        □ Check bot pod logs for driver errors
T+0:10  CL posts: Maintenance/issue notice. Do NOT say "database".
        "We're experiencing technical difficulties. Game commands
        temporarily unavailable. Working to restore quickly."
T+0:15  Decision point:
        IF Atlas-side outage → open Atlas support ticket (Priority: Critical)
                             → monitor Atlas status, keep players updated
        IF primary failover in progress → wait (max 30 sec election)
                                       → if > 60 sec, check replica set status
        IF all nodes unavailable → invoke Disaster Recovery (Section 15)
T+0:30  IC provides 15-minute update. CL posts update to players.
T+X:XX  Resolution:
        □ Verify Atlas cluster health green
        □ Run MongoDB connectivity test from bot pods
        □ Verify synthetic monitors pass
        □ CL posts resolution with explanation
        □ Post-mortem within 24 hours
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 5.5 SOP — Redis Outage (P1)

**Trigger:** Redis connection errors > 10% of operations, Redlock acquisition failures, or cluster partitioning.

```
REDIS OUTAGE RESPONSE SOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
T+0:00  Alert fires.
T+0:05  On-call acknowledges. Opens incident channel.
T+0:07  TL checks:
        □ Redis cluster nodes: redis-cli --cluster check <host>:6379
        □ Pod-to-Redis connectivity from bot pod
        □ Memory usage (OOM possible if > 90%)
        □ Check for network partition (nodes can see each other?)
T+0:10  Immediate mitigation:
        □ Activate "Redis Degraded Mode" feature flag:
          This disables: caching (all reads go to MongoDB), 
          distributed locking (falls back to optimistic concurrency),
          inter-shard pub/sub (shards operate independently)
        □ Redis Degraded Mode increases DB load by ~3×. Verify MongoDB can sustain.
T+0:15  CL posts: General performance advisory notice.
T+0:20  Decision point:
        IF memory OOM → flush volatile keys (cache only, NOT locks)
                     → increase Redis cluster memory
        IF node failure → Redis auto-failover should promote replica (< 30 s)
                       → if auto-failover fails, manually promote replica
        IF cluster partition → identify partition, isolate affected nodes
T+X:XX  Resolution:
        □ Deactivate Redis Degraded Mode feature flag
        □ Warm cache (run cache-warming script)
        □ Verify Redlock working (test lock acquisition)
        □ CL posts resolution
        □ Post-mortem within 48 hours
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 5.6 SOP — Discord API Outage (P2/P1)

**Trigger:** Discord status page shows outage, or > 30% of Discord API calls failing.

```
DISCORD API OUTAGE RESPONSE SOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
T+0:00  Alert fires or Discord status page incident detected.
T+0:05  On-call acknowledges.
T+0:07  TL verifies:
        □ discordstatus.com — confirm active incident
        □ Shard heartbeat latency (elevated = gateway issue)
        □ API call failure type (429 rate limit vs 5xx server error)
        □ Check discord.js GitHub for known issues
T+0:10  Key decision: Is this Ascension Legends-specific or Discord-wide?
        IF Discord-wide → nothing we can do. Communicate clearly.
                        → Do NOT attempt restarts/deployments
                        → Monitor Discord status for resolution ETA
        IF Ascension-specific rate limit → reduce command throughput
                                        → implement temporary command queue
T+0:10  CL posts: "Discord is currently experiencing issues that are
        affecting Ascension Legends. We're monitoring the situation.
        Follow @Discord on Twitter/X for their status updates."
        Do NOT take blame for Discord's outage.
T+X:XX  Resolution:
        □ Discord status green
        □ Verify bot reconnects properly after gateway resumes
        □ Clear any queued interactions that expired (> 3 s timeout)
        □ CL posts resolution
        □ No post-mortem required unless our code made the impact worse
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 5.7 SOP — Media Renderer Failure (P2)

**Trigger:** Render success rate < 95% for > 5 minutes, or render worker pods all unavailable.

```
MEDIA RENDERER FAILURE SOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
T+0:00  Alert fires.
T+0:05  On-call acknowledges.
T+0:07  TL checks:
        □ Render worker pod status: kubectl get pods -l app=render-worker
        □ Render worker logs: kubectl logs -l app=render-worker --tail=100
        □ node-canvas native dependency status (canvas module errors common)
        □ BullMQ battle-render queue DLQ depth
T+0:10  Immediate mitigation:
        □ Activate "Text-Only Battle Mode" feature flag:
          Battles execute normally but deliver text-based results
          instead of animated GIF/MP4. Performance and outcome unaffected.
        □ This removes the rendering bottleneck while maintaining gameplay.
T+0:10  CL posts: "Battle animations are temporarily unavailable.
        Battles are still fully functional — results will be text-based
        until we restore animations. We're working on a fix!"
T+0:20  Decision point:
        IF pod crash-loop → check OOMKilled (increase memory limit)
                        → check dependency error (native module rebuild)
        IF render job bug → identify bad job pattern, add to DLQ, skip or fix
        IF external asset failure → verify CDN/asset URLs accessible
T+X:XX  Resolution:
        □ Deactivate Text-Only Battle Mode
        □ Drain render DLQ (reprocess or discard stuck jobs)
        □ Verify render success rate > 99% for 5 minutes
        □ CL posts restoration of battle animations
        □ Post-mortem within 48 hours
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 5.8 SOP — Marketplace Bug (P2)

**Trigger:** Marketplace commands returning incorrect data, items duplicated, or prices corrupted.

```
MARKETPLACE BUG SOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
T+0:00  Alert fires or player report received and verified.
T+0:05  On-call acknowledges.
T+0:07  Immediate:
        □ Activate "Marketplace Freeze" feature flag:
          All marketplace BUY, SELL, and LIST commands disabled.
          BROWSE still available.
          Message: "The Marketplace is temporarily closed for
          maintenance. Your listings and Gold are safe."
        □ This freezes the economy state before more damage occurs.
T+0:10  TL investigates:
        □ Identify affected transactions (time range, players, items)
        □ Determine scope: isolated or systemic?
        □ Identify root cause: code bug? data corruption? lock failure?
T+0:20  Economy Analyst notified. Begins impact assessment:
        □ Total Gold transferred incorrectly
        □ Items duplicated or lost
        □ Players affected count
T+0:30  Decision: rollback transactions? forward-compensate? or manual correction?
        □ All corrections require Economy Analyst + Technical Director sign-off
        □ Affected players notified individually by Support team
T+X:XX  Resolution:
        □ All economy corrections applied and verified
        □ Deactivate Marketplace Freeze
        □ CL posts explanation and apology
        □ Affected players receive compensation (Support SOP)
        □ Post-mortem within 24 hours
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 5.9 SOP — Economy Exploit (P1)

**Trigger:** Unusual currency generation patterns detected, player report of duplication glitch, rapid wealth accumulation by one or more accounts.

```
ECONOMY EXPLOIT RESPONSE SOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
T+0:00  Exploit detected (monitoring alert or player report).
T+0:02  IMMEDIATE: Activate "Economy Lock" mode:
        □ All currency transfers disabled
        □ Marketplace frozen
        □ Crafting frozen
        □ Raid token redemptions frozen
        □ Gold sinks (shops) still operational — sinks only
        Note: This is the most aggressive response. Use it immediately.
        The cost of delayed action far exceeds 15 minutes of economy freeze.
T+0:05  On-call pages Technical Director and Economy Analyst.
        Open P1 incident channel.
T+0:10  CL posts: "Ascension Legends economy is undergoing emergency
        maintenance. Your items and currencies are safe. Updates to follow."
        Do NOT say "exploit" or "bug" publicly.
T+0:15  Investigation:
        □ Economy Analyst pulls affected account list
        □ Quantify: total currency generated illegitimately
        □ Identify exploit vector
        □ Determine if exploit is still viable (may need code fix before unlock)
T+0:30  Fix deployed (or exploit path blocked via feature flag)
T+0:45  Economy Analyst + Technical Director agree on remediation plan:
        □ Clawback illegitimate currency from affected accounts
        □ Restore impacted legitimate players if collateral damage
        □ Consider reset of items purchased with exploited currency
T+1:00  Graduated unlock (most restrictive first):
        1. Shops (sinks) — already on
        2. Crafting
        3. Raid token redemptions
        4. Marketplace
        5. Full currency transfers
T+X:XX  Resolution:
        □ Full economy operational
        □ Affected accounts receive notices (Support SOP)
        □ Economy Analyst writes impact report
        □ CL posts: transparent explanation + preventative measures taken
        □ Post-mortem within 12 hours (this is always a critical learning)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 5.10 SOP — Data Corruption (P1)

See Section 15 (Disaster Recovery) for full procedures. Immediate steps:
1. Stop all writes to the affected collection immediately
2. Take an immediate MongoDB Atlas snapshot
3. Notify Technical Director — do not proceed without explicit approval
4. Begin forensic analysis of the corruption scope before any recovery attempt

## 5.11 SOP — Unexpected Downtime

**Trigger:** Unscheduled maintenance required for any P1 incident.

```
UNSCHEDULED DOWNTIME SOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
T−0:05  (before expected downtime if there is warning)
        CL posts: "⚠️ Ascension Legends will be temporarily offline
        in approximately 5 minutes for emergency maintenance.
        Expected duration: [best estimate]. We'll update you as
        soon as we're back online."

T+0:00  Bot enters "maintenance mode":
        □ All commands return: "Ascension Legends is currently
          undergoing emergency maintenance. We'll be back soon! 🛡️"
        □ Admin API locked to read-only (maintenance mode header)
        □ All BullMQ queues paused (no new jobs processed)

[Maintenance work proceeds]

T+X:XX  Pre-restoration checklist:
        □ Verify fix is in place
        □ Run smoke tests (synthetic monitors)
        □ Economy integrity check (if applicable)
        □ Data integrity check (if applicable)

T+X:XX  Restoration:
        □ Deactivate maintenance mode
        □ Resume BullMQ queues
        □ Verify bot responds to commands
        CL posts: "✅ Ascension Legends is back online!
        [Brief explanation of what happened and what was fixed]
        Thank you for your patience, heroes. ⚔️"

T+X:XX  Compensation package (if downtime > 30 minutes):
        □ Economy Analyst determines appropriate make-good
        □ Standard: bonus XP weekend + Gold drop bonus
        □ Applied via automated script, not manual grants
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 5.12 Recovery Checklist

After every P1/P2 incident resolution, before declaring "all clear":

```
POST-INCIDENT RECOVERY CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ All synthetic monitors passing for 10+ consecutive minutes
□ Bot responding to commands in test guild
□ Error rate back to baseline (< 0.5%)
□ P95 command latency back to baseline (< 800 ms)
□ Economy integrity verified (no unexpected balances)
□ All feature flags in correct state (no degraded modes left on)
□ BullMQ DLQ reviewed (no stuck jobs)
□ MongoDB replication lag < 2 seconds
□ Redis cluster fully healthy
□ Player-facing communication posted (resolution)
□ Stakeholders notified (internal)
□ Post-mortem ticket created and assigned
□ Incident channel archived
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 5.13 Post-Mortem Process

Every P1 incident and selected P2 incidents require a written post-mortem. Post-mortems are **blameless** — they focus on systems, processes, and decisions, not individual failure.

**Post-Mortem Template:**
```
INCIDENT POST-MORTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Incident ID: INC-YYYY-NNN
Severity: P1 / P2
Date: YYYY-MM-DD
Duration: X hours Y minutes
Incident Commander: [name]
Technical Lead: [name]

SUMMARY
[2–3 sentence description of what happened and the impact]

TIMELINE
[Minute-by-minute timeline from first detection to resolution]

ROOT CAUSE
[Technical root cause. What condition caused the incident?]

CONTRIBUTING FACTORS
[Factors that made the incident worse or harder to detect]

DETECTION
[How was this detected? Was the alert adequate?]

IMPACT
[Players affected, duration, features affected, economic impact]

RESOLUTION
[What fixed the issue?]

ACTION ITEMS
| Action | Owner | Due Date | Priority |
|--------|-------|----------|----------|
| [Preventative measure] | [Team] | YYYY-MM-DD | P1/P2/P3 |

LESSONS LEARNED
[What did we learn? What do we want to do differently?]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Post-mortems are published internally within 48 hours. A player-facing summary is posted to the support Discord within 72 hours.

---

# 6 — BACKUPS & DATA INTEGRITY

## 6.1 Backup Architecture

```
BACKUP ARCHITECTURE OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MongoDB Atlas       → Continuous backup (oplog), snapshots 6x/day
Game Assets         → Object storage (CDN), versioned, replicated 3 regions
Configuration       → Git (IaC repo), encrypted secrets in Vault
Kubernetes State    → etcd backup every 1 hour, retained 7 days
Application Code    → GitHub (primary), Replit (secondary mirror)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 6.2 Database Backup Policy

### MongoDB Atlas Backups

| Backup Type | Frequency | Retention |
|-------------|-----------|-----------|
| Continuous oplog backup | Real-time | 35 days point-in-time |
| Snapshot (automated) | Every 4 hours | 7 days |
| Daily snapshot | Daily (03:00 UTC) | 30 days |
| Weekly snapshot | Sunday 02:00 UTC | 52 weeks |
| Monthly snapshot | 1st of month, 01:00 UTC | 12 months |
| Annual snapshot | January 1, 00:00 UTC | Indefinite |

**Offsite Replication:** Monthly snapshots are exported to a separate cloud provider (e.g., if primary is AWS, export to GCS) for geographic resilience. This is our "nuclear backup" — the option if the primary cloud provider has a catastrophic failure.

### Point-in-Time Recovery (PITR)

Atlas PITR allows restore to any second within the 35-day window. Use PITR when:
- Accidental mass deletion of player data
- Corrupted write that propagated before detection
- Replay of transactions to verify economy integrity

**PITR RTO/RPO:**
- RPO (Recovery Point Objective): 1 second (continuous backup)
- RTO (Recovery Time Objective): < 4 hours for partial collection restore, < 8 hours for full cluster restore

## 6.3 Asset Backups

Game assets (sprite sheets, audio files, background art, card templates, UI assets) are stored in object storage (S3-compatible CDN).

| Asset Type | Storage | Versioning | Retention |
|------------|---------|------------|-----------|
| Character sprites | CDN (primary) | Versioned per release | Indefinite |
| Battle backgrounds | CDN (primary) | Versioned per season | 3 years |
| Card templates | CDN (primary) + Git LFS | Every change | Indefinite |
| Audio files | CDN (primary) | Versioned per release | Indefinite |
| UI assets | CDN + embedded in Docker image | Per release tag | 3 years |

**CDN Replication:** All production CDN assets are replicated to at least 3 geographic regions. CDN provider SLA: 99.99% availability.

## 6.4 Media Backups

Player-generated media (battle replay GIFs, profile card renders) are ephemeral by default — they are regenerated on demand. However:
- Battle replay data (the deterministic seed and state that recreates a battle) is stored in MongoDB for 90 days
- Profile card templates are stored; the rendered output is cached for 24 hours then discarded
- No permanent storage of player-generated media is required

## 6.5 Configuration Backups

| Config Type | Storage | Backup Frequency |
|-------------|---------|-----------------|
| Kubernetes manifests (Helm charts) | Git (IaC repo) | Every commit |
| Application config | Git (app repo) | Every commit |
| Secrets (values) | HashiCorp Vault | Vault snapshots daily |
| Vault snapshot | Object storage (encrypted) | Daily, 30-day retention |
| DNS configuration | IaC repo + DNS provider export | Weekly |
| Monitoring alerts (Grafana) | Git (IaC repo) | Every commit |
| MongoDB indexes | Documented in `docs/Database-Schema.md` | Per schema change |

## 6.6 Recovery Testing

**Recovery testing is mandatory.** An untested backup is not a backup.

| Test | Frequency | Executor | Pass Criteria |
|------|-----------|----------|---------------|
| MongoDB PITR restore to staging | Monthly | DBA | Full restore completes, data verified via checksums |
| MongoDB snapshot restore | Quarterly | DBA | Restore to isolated env, application connects and queries correctly |
| Redis backup restore | Monthly | SRE | Redis rebuilds from RDB, cache warm, no errors |
| Asset CDN integrity check | Weekly | Automated | All assets return 200, checksums match manifest |
| Vault snapshot restore | Quarterly | Security | Secrets accessible from restored vault |
| Kubernetes etcd restore | Semi-annual | SRE | Cluster recovers from simulated control-plane failure |
| Full disaster recovery drill | Annual | All teams | Full DR plan executed, RTO/RPO targets met |

Recovery tests are scheduled, documented, and their results logged in the `docs/Recovery-Test-Log.md` (maintained internally).

## 6.7 Retention Policy Summary

| Data Type | Retention Period | Deletion Method |
|-----------|----------------|-----------------|
| Player account data | Account lifetime + 2 years after deletion request | Soft delete → hard delete after 90 days |
| Battle history | 90 days (detail), 1 year (summary) | Automated TTL collection |
| Economy transaction log | 2 years (legal compliance) | Automated archive after 6 months |
| Audit logs | 1 year | Automated archive |
| Backup snapshots | Per policy above | Automated Atlas/storage lifecycle policy |
| Analytics events (raw) | 90 days | Automated TTL |
| Analytics events (aggregated) | Indefinite | Never deleted |
| Player reports / support tickets | 3 years | Manual purge after legal review |

---

# 7 — SECURITY OPERATIONS

## 7.1 Security Monitoring

The Security Operations Center (SecOps, initially shared with SRE) monitors for:

### 7.1.1 Application-Level Threats

| Threat Signal | Detection Method | Response |
|--------------|-----------------|----------|
| Admin API brute force | Auth failure rate > 10/min per IP | IP block, security alert |
| Privilege escalation attempt | Unexpected `admin_action` events | Immediate account suspension, security alert |
| Command flood (bot spam) | > 30 commands/minute per user | Rate limit, 1-hour cooldown |
| Economy exploit pattern | Currency balance delta > 3σ above baseline | Economy Lock SOP (5.9) |
| Account takeover attempt | Login from new IP + failed MFA | Force MFA re-auth, security alert |
| Slash command injection | Malformed input detected by Zod validators | Log, block, alert if pattern |

### 7.1.2 Infrastructure-Level Threats

| Threat Signal | Detection Method | Response |
|--------------|-----------------|----------|
| Unauthorized API access | 401/403 spike from unexpected IPs | IP block, security alert |
| DDoS against Admin API | Request rate > 10× baseline | CDN WAF activation, IP block |
| Container image anomaly | Unexpected process in pod | Kill pod, alert, forensics |
| Kubernetes API anomaly | Unexpected kubectl actions | Audit log alert, access review |
| Secret access anomaly | Vault access from unexpected service | Immediate secret rotation |

## 7.2 Access Control

### 7.2.1 Role Definitions

```
ACCESS CONTROL MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Role              │ Admin API │ MongoDB │ Redis │ K8s │ Vault
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Game Director     │ Read-only │ No      │ No    │ No  │ No
Technical Director│ Full      │ Full    │ Full  │ Full│ Read
Senior Engineer   │ Full      │ Full    │ Full  │ Full│ No
Engineer          │ Staging   │ Staging │ Staging│ Dev│ No
QA Engineer       │ QA only   │ QA only │ No    │ No  │ No
Community Manager │ CM panel  │ No      │ No    │ No  │ No
Support Agent     │ Support   │ No      │ No    │ No  │ No
Economy Analyst   │ Economy   │ Read    │ No    │ No  │ No
On-Call Engineer  │ Full+prod │ Full    │ Full  │ Full│ Emergency
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7.2.2 Principle of Least Privilege

- Every service account has the minimum permissions required to function
- No shared credentials — every service uses its own credentials
- Production credentials are never shared with humans — engineers interact with production via kubectl/ops tooling with audit logging
- All human access to production is logged and audited
- No permanent `cluster-admin` rights for any engineer — escalation requires approval workflow

### 7.2.3 Access Review

- Quarterly access review of all roles: verify every person's access is still appropriate
- Access is removed immediately upon team departure (offboarding SOP)
- Service account credentials are rotated quarterly
- Production access requires mandatory 2FA/MFA

## 7.3 Admin Panel Permissions

The Admin API (`apps/admin-api`) enforces role-based access at the route level:

```typescript
// Conceptual permission structure
const ADMIN_PERMISSIONS = {
  'economy:read':      ['support', 'economy-analyst', 'engineer', 'director'],
  'economy:write':     ['economy-analyst', 'engineer', 'technical-director'],
  'economy:freeze':    ['engineer', 'technical-director'],
  'player:read':       ['support', 'community', 'engineer', 'director'],
  'player:suspend':    ['community', 'support-lead', 'engineer'],
  'player:delete':     ['technical-director'],
  'guild:read':        ['support', 'community', 'engineer'],
  'guild:modify':      ['community-lead', 'engineer'],
  'system:deploy':     ['engineer', 'technical-director'],
  'system:rollback':   ['engineer', 'technical-director'],
  'feature-flags:write': ['engineer', 'technical-director'],
  'audit-log:read':    ['security', 'technical-director'],
};
```

## 7.4 Secrets Management

All secrets follow the Vault lifecycle:

```
SECRET LIFECYCLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. GENERATION  → Generated by Vault or approved tool
2. STORAGE     → Stored in Vault (never in code, files, or env manually)
3. INJECTION   → Injected into Kubernetes secrets at deploy time
4. ROTATION    → Rotated on schedule OR immediately on suspected compromise
5. EXPIRY      → Old secret invalidated after rotation confirmed
6. AUDIT       → All secret access logged in Vault audit log
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Rotation Schedule:**

| Secret Type | Normal Rotation | Forced Rotation Trigger |
|-------------|-----------------|------------------------|
| Discord bot tokens | Annually | Suspected compromise, team departure |
| MongoDB credentials | Quarterly | Suspected compromise |
| Redis auth | Quarterly | Suspected compromise |
| JWT signing keys | Monthly | Suspected compromise |
| API keys (third-party) | Per vendor policy | Suspected compromise |
| Vault root token | Never used after init | — |

## 7.5 Audit Logging

Every sensitive action is written to an append-only audit log:

```json
{
  "timestamp": "2025-01-15T14:23:01.442Z",
  "actor": { "type": "admin", "id": "usr_01J...", "ip": "x.x.x.x" },
  "action": "economy.manual_grant",
  "resource": { "type": "player", "id": "usr_01J...", "guild": "gld_01J..." },
  "payload": { "currency": "gold", "amount": 1000, "reason": "compensation-INC-2025-042" },
  "result": "success",
  "request_id": "req_01J..."
}
```

Audit logs are:
- Written to a separate, write-only MongoDB collection (`audit_events`)
- Streamed to external SIEM (Security Information and Event Management) system
- Retained for 1 year in hot storage, 3 years in cold archive
- Never modified — corrections are new entries, not edits
- Reviewed weekly by Security for anomaly detection

## 7.6 Emergency Lock Mode

Emergency Lock Mode disables all player-facing functionality immediately. It is the nuclear option — used only when the integrity of the entire game is at risk (security breach, catastrophic exploit, corrupted state that could spread).

```
EMERGENCY LOCK MODE ACTIVATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Authorization: Technical Director OR two Senior Engineers
Activation: Feature flag `emergency_lock = true` (instant effect)

What it disables:
□ ALL game commands return maintenance message
□ ALL economy operations frozen
□ ALL marketplace operations frozen
□ ALL battle start commands blocked
□ Admin API locked to read-only for non-TD roles

What remains operational:
□ Bot still responds (maintenance message)
□ Admin API read access for investigation
□ Monitoring and alerting
□ Internal ops tooling

Deactivation: Technical Director sign-off required
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 7.7 Compromised Account Response

**Player account compromise:**
1. Suspend account immediately (disable all commands for that Discord ID)
2. Freeze economy for that account (prevent currency drain)
3. Open support ticket (high priority)
4. Contact player via registered email or alternate contact if available
5. Verify identity before restoring access
6. Review economy transactions from last 24 hours — reverse fraudulent ones
7. Generate new secure session

**Staff account compromise:**
1. Immediately revoke all access (remove from all permission groups)
2. Rotate all secrets that the account had access to
3. Review all audit log entries for that account over last 30 days
4. Determine scope of compromise (read-only vs. write access? Production vs. staging?)
5. If production data accessed: notify Technical Director, consider breach disclosure
6. Forensics investigation
7. HR/legal notified

## 7.8 Abuse Reporting

Players can report abuse via `/report` command or the support form. Reports are triaged as:

| Report Type | Priority | SLA | Handler |
|-------------|---------|-----|---------|
| Harassment/threats | P1 | 1 hour | Community Lead + Moderation |
| Exploit/cheating | P1 | 15 min | Security + Engineering |
| Bug report | P3 | 48 hours | QA |
| Inappropriate content | P2 | 4 hours | Moderation |
| Account recovery | P2 | 24 hours | Support |

All reports are logged, assigned, and tracked. No report is ever closed without a resolution or explicit decision.

---

# 8 — ECONOMY OPERATIONS

## 8.1 Economy Philosophy

The Ascension Legends economy is a closed-loop system with six currencies (Gold ⚙️, Crystals 💎, Guild Coins 🏛️, Raid Tokens ⚔️, Arena Tokens 🥊, Stardust ✨). Each serves a distinct purpose:

```
CURRENCY ROLE MAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Gold ⚙️         Primary circulation; daily quests, battles, market
Crystals 💎     Mid-tier; crafting, dungeons, prestige items
Guild Coins 🏛️  Guild-bound; guild shop, war rewards
Raid Tokens ⚔️  Raid-bound; high-tier equipment exchanges
Arena Tokens 🥊 PvP-bound; competitive cosmetics, ranked rewards
Stardust ✨     Premium real-money; cosmetics ONLY — no P2W
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**The Cardinal Rule:** Stardust (premium currency) must **never** provide a power advantage. It is cosmetic-only. Any proposal to gate gameplay power behind Stardust requires Game Director + Economy Analyst veto review.

## 8.2 Inflation Monitoring

Inflation occurs when total currency supply grows faster than currency sinks (places currency is spent and destroyed). We monitor money supply daily.

### Key Inflation Metrics

| Metric | Formula | Health Range | Alert Threshold |
|--------|---------|-------------|-----------------|
| Daily Gold Supply Growth | (Gold generated today) / (Gold yesterday) | 0.98–1.05 | > 1.10 |
| Gold Velocity | Total Gold transferred / Total Gold supply | 0.05–0.20 | > 0.30 |
| Gold Sink Ratio | Gold destroyed / Gold generated | 0.85–1.00 | < 0.80 |
| Marketplace Average Price Growth | 7-day MA price change | -2% to +3% | > +5%/week |
| Wealth Concentration (Gini coefficient) | — | < 0.60 | > 0.70 |
| New Player Gold Rate | Gold/hour for players < Level 10 | Calibrated | Significant drift |

### Inflation Response Ladder

| Severity | Indicators | Response |
|----------|-----------|---------|
| Green | Sink ratio 0.85–1.00, supply growth < 5% | No action |
| Yellow | Sink ratio 0.80–0.85, supply growth 5–10% | Economy review, consider event sink |
| Orange | Sink ratio < 0.80, supply growth > 10% | Emergency Economy Meeting, sink event activated |
| Red | Supply growth > 20%, marketplace prices spiking | Gold generation rate reduction (patch), emergency sink event |

## 8.3 Currency Balancing

### Gold ⚙️ Calibration Targets

At steady state, a daily active player should:
- Earn: 500–1,500 Gold/day from normal play
- Spend: 400–1,200 Gold/day on upgrades, marketplace, and crafting
- Retain: Net positive to reward daily play, but not so much that Gold becomes meaningless

### Calibration Formula

```
DAILY PLAYER GOLD BALANCE CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Target: Average Earn Rate × 1.1 ≤ Average Sink Rate × 1.25
(10% more income than spending, 25% sink headroom)

If Earn Rate grows > 15%:
  → Review recent drops: new event? exploited source?
  → Adjust drop tables via patch or feature flag (not emergency)

If Sink Rate drops > 15%:
  → Review sink costs: has meta shifted? Are shops unused?
  → Consider temporary sale/event to drain excess
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 8.4 Marketplace Monitoring

The Marketplace is the primary price-discovery mechanism. Monitoring ensures it remains fair and functional.

### Marketplace Health Dashboard

| Metric | Check | Alert |
|--------|-------|-------|
| Listing volume (24h) | Listings created | Drop > 30% from 7-day avg |
| Sale rate (% of listings sold) | Sales / Listings | < 30% = illiquid market |
| Price volatility by category | % change in avg price | > 20% in 24h = investigate |
| Outlier listings (price > 10× avg) | Count | > 5% of listings = price manipulation |
| Bot-pattern listings | Listings from same account in tight intervals | > 20 within 5 min = flag account |

### Anti-Manipulation Rules

- **Price floor enforcement:** No item can be listed below its base vendor price (system enforced)
- **Quantity limits:** Maximum 10 active listings per item type per player
- **Listing duration:** Maximum 7 days; expired listings return to player inventory
- **Transaction tax:** All Gold marketplace transactions have a 5% sink (automatically deducted)

## 8.5 Drop Rate Adjustments

Drop rates are defined in the item drop table configuration. Adjustments follow a formal process:

```
DROP RATE ADJUSTMENT PROCESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. PROPOSAL
   □ Game Designer submits Drop Rate Adjustment Request (DRAR)
   □ Includes: current rate, proposed rate, rationale, expected impact

2. ECONOMY ANALYSIS (Economy Analyst)
   □ Simulate impact on item supply
   □ Simulate impact on marketplace prices
   □ Simulate impact on Gold velocity
   □ Approve or request revision

3. GAME DESIGN REVIEW (Game Director)
   □ Verify alignment with game balance goals
   □ Approve or request revision

4. QA VALIDATION
   □ Verify new rates in staging
   □ Confirm rates applied correctly

5. DEPLOYMENT
   □ Deployed as part of regular patch cycle
   □ Never deployed as emergency hotfix unless exploit-related

6. POST-DEPLOYMENT MONITORING
   □ Economy Analyst monitors for 7 days
   □ Confirms impact matches simulation
   □ Files adjustment report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 8.6 Reward Balancing

Player rewards (daily quest payouts, battle victory rewards, raid completion drops) are reviewed monthly. The Economy Analyst maintains a **Reward Calibration Sheet** tracking:

- Average Gold earned per quest tier by player level range
- Battle reward distribution by outcome (win/loss/draw)
- Raid completion rewards vs. difficulty rating
- Time-per-reward ratios (is it worth playing that content?)

Rewards that no player is engaging with (< 5% uptake) are either improved or removed in the next monthly patch.

## 8.7 Daily Economy Reports

Generated automatically every day at 06:00 UTC. Delivered to:
- Economy Analyst (primary recipient)
- Game Director (summary)
- Technical Director (flagged anomalies only)

**Daily Report Contents:**
- 24-hour Gold generated / destroyed / net
- 24-hour Crystals generated / destroyed / net
- 24-hour marketplace volume and revenue
- New character registrations
- Daily Active Users (DAU)
- Top earning content (what generated the most Gold)
- Top sinking content (what consumed the most Gold)
- Any flagged anomalies (> 2σ deviations)

## 8.8 Weekly Economy Reports

Generated every Monday at 08:00 UTC. Covers the prior 7 days.

**Weekly Report Contents:**
- All daily metrics aggregated
- 7-day trend charts for all currencies
- Marketplace price trends by item category
- New player economy performance (Levels 1–20)
- Mid-tier player economy performance (Levels 21–60)
- Veteran player economy performance (Levels 61–100+)
- Wealth distribution analysis (percentile breakdown)
- Upcoming events impact forecast

## 8.9 Monthly Economy Reviews

Held the first Wednesday of each month. Attendees: Economy Analyst, Game Director, Technical Director, Lead Game Designer.

**Monthly Review Agenda:**
1. Economy KPI scorecard (30 min)
2. Inflation/deflation status and trend (20 min)
3. Marketplace health review (20 min)
4. Currency sink/source audit (15 min)
5. Upcoming balance changes (20 min)
6. Player feedback on economy (10 min)
7. Action items (5 min)

Outputs: Economy Health Report (archived), action items with owners and deadlines.

---

# 9 — BALANCE PATCH WORKFLOW

## 9.1 Balance Philosophy

Balance in Ascension Legends is not about making all 50 classes equal — it is about making all classes **viable and distinct**. A perfectly balanced game where every choice is equivalent is a boring game. The goal is:

1. **No class is unplayable** — every class can complete all content
2. **No class is dominant** — no single class should be the universally correct choice for all content
3. **Every class has a niche** — some content rewards Shadowblade more than Stormcaller, and that's intentional
4. **Changes are predictable** — players understand why something changed and can plan around it

## 9.2 Skill Adjustment Process

```
SKILL ADJUSTMENT WORKFLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATA COLLECTION
  □ Win-rate data by class, content type, player bracket
  □ Skill usage frequency (which skills do players actually use?)
  □ Player feedback/complaints (community channels, support tickets)
  □ Internal QA playtesting notes
  ↓
ANALYSIS
  □ Identify outliers (class win-rate > 55% in any context)
  □ Identify underperformers (class win-rate < 45% in any context)
  □ Identify unused skills (< 10% of players using it at max level)
  ↓
ADJUSTMENT PROPOSAL (Game Designer)
  □ Specific numeric change (e.g., "Shadowstrike: damage 120% → 110%")
  □ Rationale: what problem does this solve?
  □ Expected outcome: what should the win-rate become?
  ↓
PEER REVIEW (2nd Game Designer + Lead)
  □ Independent assessment of proposed change
  □ Consideration of combo effects (does this break any synergies?)
  ↓
SIMULATION (Economy Analyst + Game Designer)
  □ Statistical simulation of PvP win-rates with change applied
  □ Verify no unintended class becomes dominant
  ↓
QA PLAYTESTING
  □ Internal playtest sessions with proposed changes
  □ Focus on edge cases (max-stat builds, specific content)
  ↓
PATCH NOTES DRAFT
  □ Written for players — clear, honest, with rationale
  ↓
DEPLOYMENT (Monthly patch cycle)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Emergency skill nerfs (a bug causing unintended damage or an exploit) bypass the standard workflow but still require: Technical Director approval, minimal-scope change, and a full workflow follow-up in the next patch.

## 9.3 Class Balancing

Classes are balanced at the macro level (overall viability) quarterly. Intra-class skill balance is monthly.

**Class Balance Data Requirements (minimum before any class-level change):**
- Minimum 10,000 data points per class per content type
- Data stratified by player bracket (Beginner/Intermediate/Veteran)
- At least 30 days of data post any previous change to the same class

**Class Balance Thresholds:**

| Metric | Healthy Range | Review Trigger | Emergency Trigger |
|--------|--------------|----------------|-------------------|
| PvP Win Rate | 45%–55% | Outside 42%–58% | Outside 35%–65% |
| Raid Clear Rate | 30%–70% | Outside 25%–75% | < 15% or > 85% |
| Arena Placement Median | ± 10% of average | ± 15% | ± 25% |
| Usage Rate | > 2% of players | < 1% for 60 days | < 0.5% for 30 days |

## 9.4 Equipment Balancing

Equipment changes are the most impactful balance lever — changing an item affects every class that can equip it.

**Equipment Change Rules:**
- No equipment change may affect more than 3 classes simultaneously without a full balance review
- Legendary item changes require Game Director sign-off
- Artifact relic changes require Game Director + Community Lead sign-off (community expectations are highest for these items)
- Equipment changes must be communicated in patch notes at least 7 days before taking effect (give players time to adapt loadouts)

## 9.5 Transformation Balancing

The 5-stage Ascension Resonance System is the game's prestige mechanic. Transformations are powerful — they are meant to be. The balance target is **fun and dramatic**, not numerically tight.

**Transformation Balance Guidelines:**
- Transformation buffs are approximately 40–80% power increase over base form
- Stage 5 transformation (pinnacle) should feel like winning the game — maintain the power fantasy
- Transformations must NOT be required to clear base content — they are a reward, not a requirement
- Balance reviews for transformations are semi-annual, not monthly

## 9.6 PvP Balancing

PvP is balanced separately from PvE. Some skills may have different modifiers in PvP:

**PvP Balance Framework:**
- PvP modifier system allows a skill to deal 100% damage in PvE and 75% in PvP independently
- This allows buffing underperforming PvP classes without making them overpowered in PvE
- The Power Rating (PR) matchmaking system accounts for PvP-specific skill modifiers

**PvP Season Balance Reviews:** Conducted at the end of every PvP season (monthly). Focus: arena tier distribution, class representation by tier, tournament meta analysis.

## 9.7 Raid Balancing

Raids have four difficulty tiers. Balance targets:

| Tier | Target Clear Rate | Target Average Attempts |
|------|-----------------|------------------------|
| Normal | 80% of qualifying groups | ≤ 3 |
| Hard | 50% of qualifying groups | ≤ 5 |
| Heroic | 20% of qualifying groups | ≤ 10 |
| Mythic | 5% of top-PR groups | Variable (prestige challenge) |

Raids are re-evaluated 2 weeks after release (data collection) and again at 6 weeks. Difficulty adjustments require Game Director approval.

## 9.8 Approval Workflow Summary

```
BALANCE CHANGE APPROVAL MATRIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Change Type                      │ Required Approvals
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Minor skill tuning (< ±10%)      │ Lead Game Designer
Major skill tuning (≥ ±10%)      │ Lead Game Designer + Game Director
Class-level rework               │ Game Director + Economy Analyst
Equipment stat change            │ Lead Game Designer + Game Director (if Legendary)
Transformation change            │ Game Director
PvP modifier change              │ Lead Game Designer
Raid difficulty change           │ Game Director
Economy drop rate change         │ Economy Analyst + Game Director
Emergency nerf (exploit)         │ Technical Director (immediate) + full review next patch
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

# 10 — SEASON MANAGEMENT

## 10.1 Season Structure

Each season of Ascension Legends is a discrete chapter in the world of Aethon. Seasons are the primary content cadence driver.

**Season Length:** 3 months (quarterly cycle)
**Season Content:** Story chapter, new events, Battle Pass, rank reset, seasonal cosmetics

## 10.2 Season Launch Checklist

A season launch is a production deployment with additional game-layer complexity. The launch checklist:

**T−14 Days (Two Weeks Before Launch)**
```
□ All season content QA-complete (story, new events, Battle Pass rewards)
□ Season economy simulation run and approved by Economy Analyst
□ New drop tables reviewed and approved
□ Any new commands fully tested in staging
□ Patch notes written and reviewed by: Lead Game Designer, Community Lead, Game Director
□ Marketing assets delivered to Community team
□ Community calendar updated with season events
□ Server announcement graphics ready
□ Teaser campaign begins (lore drops in community channels)
```

**T−7 Days (One Week Before Launch)**
```
□ Final staging smoke test passed
□ Season economy reset script tested in staging (verified idempotent)
□ Rank reset script tested in staging
□ Battle Pass claim system tested in staging
□ Rollback plan documented (can we undo the season launch?)
□ On-call schedule confirmed for launch day and week 1
□ Support team briefed on season content and expected questions
□ All external assets on CDN, verified accessible globally
□ Feature flags confirmed (season features behind flags, enabled at launch)
```

**T−1 Day (Day Before Launch)**
```
□ Code freeze: no non-critical deployments
□ Database pre-seeding complete (season event data, story content)
□ Final canary deployment verified healthy
□ Launch day communication drafted and scheduled
□ On-call engineer confirmed and briefed
□ Technical Director on standby for launch day
```

**Launch Day (T+0)**
```
07:00 UTC  Final health check — all systems green
08:00 UTC  Scheduled maintenance window begins
           Bot enters maintenance mode
08:05 UTC  Season reset scripts executed:
           □ Rank leaderboard reset
           □ Arena tokens partial reset (50% retained)
           □ New season initialized in database
           □ Battle Pass activated for all players
           □ Season event calendar activated
08:45 UTC  New code deployed via blue/green
           Feature flags for season content enabled
08:50 UTC  QA smoke test on production (test guild)
09:00 UTC  Maintenance mode lifted
           Bot returns to service
09:01 UTC  Community announcement posted: "Season [N] — [Season Name] is LIVE!"
09:30 UTC  Developer Q&A session in support Discord (planned, 1 hour)
```

## 10.3 Season Roadmap

Each season is planned 6 months in advance with a public roadmap:

```
SEASON ROADMAP STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MONTH 1 (Launch Month)
  Week 1: Season launch + Story Chapter opening
  Week 2: First Major Event (World Boss or Guild War)
  Week 3: QoL patch + balance adjustment
  Week 4: Community event (player-choice mini-event)

MONTH 2 (Engagement Month)
  Week 5: Mid-season story update
  Week 6: PvP Tournament begins
  Week 7: Balance patch + content additions
  Week 8: Double XP weekend + Economy event

MONTH 3 (Finale Month)
  Week 9: Story finale chapter releases
  Week 10: Guild War Championship
  Week 11: Season finale event (special rewards)
  Week 12: Season close + preview of next season
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 10.4 Battle Pass

The Battle Pass is the primary premium content delivery mechanism. It uses Stardust (✨) to unlock and offers 100 tiers of rewards over the season.

**Battle Pass Operations:**
- Premium track costs 1,500 Stardust (✨) — cosmetics only
- Free track is available to all players: XP boosts, Gold, Crystals
- Battle Pass tiers are earned through XP (all normal gameplay counts)
- Tier reward distribution reviewed by Economy Analyst before each season
- No Battle Pass rewards may be power-equivalent to non-premium item equivalents
- Past Battle Pass rewards never return — exclusivity is guaranteed

**Battle Pass Monitoring:**
- Track tier completion rates across player base (are players reaching tier 100?)
- Monitor free vs premium activation rates
- Flag if completion rate < 30% at season midpoint (content may be too grindy)

## 10.5 Rank Reset

Competitive ranks (Arena, Guild War) reset at the start of each season:

**Arena Rank Reset:**
- Players retain 50% of their previous season's rank points as a "soft reset"
- Top 100 players from previous season receive permanent "Season [N] Champion" title
- Rank distribution is re-seeded to ensure healthy match distribution

**Guild War Season:**
- Guild War rank fully resets
- Top 10 guilds receive exclusive guild banners and Gold bonus
- Winning guild's name inscribed in the "Hall of Conquest" (permanent in-game record)

## 10.6 Season Rewards

End-of-season rewards are distributed automatically via the Season Close script:
- Script runs 1 hour before the next season launches
- Rewards are delivered to player inventory (mail system if inventory full)
- All reward grants are logged in the audit log
- Economy Analyst reviews total reward distribution before season close

## 10.7 Season Story

Each season tells a chapter of Aethon's ongoing narrative. Story operations:
- New story content (dialogue, cinematics, NPC interactions) is gated behind a seasonal feature flag
- Story chapters unlock weekly within the season (not all at once — pacing is critical)
- Story data is seeded to production database as part of season launch script
- Story content is QA'd by both QA engineers AND narrative team members

## 10.8 Season Testing

The complete season experience is tested end-to-end in staging:

```
SEASON TEST PLAYTHROUGH CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Complete Season Story (all chapters, all paths)
□ Earn Battle Pass tiers 1 through 100 (fast-forwarded in staging)
□ Complete all new events (one full run)
□ Trigger rank reset and verify new rank distribution
□ Verify season rewards distributed correctly
□ Test: new player starting season mid-way
□ Test: returning player (existing character, existing season progress)
□ Economy: verify no new gold sources unaccounted for
□ Performance: no season content causes bot slowdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 10.9 Season Archive

At season close, a snapshot of season state is archived:
- Final leaderboard rankings (all brackets)
- Top 100 player profiles at season close
- Economy state at season close (supply levels, prices)
- Aggregate statistics (total battles, commands, new players)
- Season story content archived for lore continuity
- Season retrospective document written by Game Director

---

# 11 — EVENTS OPERATIONS

## 11.1 Events Philosophy

Events are Ascension Legends' heartbeat. Between major content releases, events keep the community alive, give players reasons to return, and create shared moments that become stories players tell each other.

**Event Categories:**
1. **Recurring Events** — predictable cadence (Double XP weekends, daily challenges)
2. **Seasonal Events** — tied to real-world or in-world calendar (holidays, anniversaries)
3. **Story Events** — tied to narrative chapters (world bosses, faction wars)
4. **Community Events** — driven by player behavior or developer choice
5. **Championship Events** — competitive, high-stakes (tournaments, championships)

## 11.2 World Boss Events

World Boss events deploy a special raid-tier enemy to the world of Aethon, requiring coordinated guild participation.

**Operational Plan: World Boss Event**

```
PRE-EVENT (T−48 hours)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Boss data seeded to production database (behind feature flag)
□ Boss drop table reviewed by Economy Analyst
□ Lore announcement posted (mysterious environmental changes in world)
□ Community managers briefed on event mechanics
□ Render workers: verify boss render assets on CDN
□ Stress test: simulate 1,000 simultaneous boss encounters in staging

EVENT LAUNCH (T+0)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Feature flag enabled: world_boss_event = true
□ In-game announcement via bot broadcast to all guilds
□ Discord announcement in all partner communities
□ Boss HP bar visible in global leaderboard (community milestone)

DURING EVENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Monitor boss encounter rate (alert if < 50 encounters/hour)
□ Monitor render queue for boss battles (alert if backing up)
□ Update global HP bar hourly (bot auto-posts milestone updates)
□ Community managers engage: sharing player wins, reposting screenshots
□ Economy Analyst: monitor loot drop rates in real-time

POST-EVENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Boss defeated (global milestone complete)
□ Story completion announcement posted
□ Top damage dealers recognized publicly (with permission)
□ Rewards distributed (confirmed via Economy Analyst)
□ Feature flag disabled
□ Event retrospective filed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 11.3 Guild War Seasons

Guild Wars are the competitive backbone of Ascension Legends. Guilds fight weekly battles for territory, resources, and glory.

**Guild War Season Operations:**

| Week | Activity | Ops Focus |
|------|---------|-----------|
| Season Open | Guild registration, initial seeding | System test, verify registration limit |
| Weeks 1–10 | Weekly war cycles | Monitor match scheduling, result processing |
| Playoff Week | Top guilds bracket | Increased monitoring, manual moderation standby |
| Championship | Final 8 guilds | Full team on standby, live commentary available |
| Season Close | Rankings finalized, rewards distributed | Economy review, reward script |

**Guild War Integrity:**
- Automated detection of suspicious win patterns (unusual win rates against specific opponents)
- Manual review process for reported cheating or match manipulation
- Guild War results are final — no "he-said/she-said" rollbacks without hard evidence

## 11.4 PvP Tournaments

Seasonal PvP tournaments follow a bracket format. Operations:

```
TOURNAMENT OPERATIONAL CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRE-TOURNAMENT
□ Registration period opens (2 weeks before tournament)
□ Participant eligibility verified (min PR, account age, no active suspensions)
□ Bracket generated (seeded by Arena rank)
□ Bracket announced to all participants via DM + community post

DURING TOURNAMENT
□ Match schedule posted (participants have 48-hour window to complete each round)
□ On-call Community Manager monitors for disputes
□ Results logged and bracket updated in real-time
□ Bot posts round results to community channels automatically

POST-TOURNAMENT
□ Final results announced
□ Rewards distributed (automated)
□ Tournament archive created (bracket, results, top players)
□ Player feedback collected
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 11.5 Holiday Events

Holiday events are planned 3 months in advance and tied to major cultural moments (New Year, summer festivals, etc.). For Aethon's in-world calendar, we also create lore-based seasonal festivals (Harvest of the Six, Solstice of Luminara, etc.).

**Holiday Event Pipeline:**
- Content completed 6 weeks before event date
- Economy Analyst reviews all event rewards 4 weeks before
- QA complete 2 weeks before
- Announcement 1 week before
- Event runs for 1–2 weeks (not longer — scarcity drives engagement)
- Exclusive cosmetics from holiday events are never re-issued (same rule as Battle Pass)

## 11.6 Double XP Weekends

The simplest, most beloved event type. Occurs monthly (typically last weekend of the month).

**Double XP Weekend Operations:**
- Activated via feature flag `double_xp_weekend = true` (Friday 17:00 UTC)
- Deactivated via feature flag `double_xp_weekend = false` (Monday 05:00 UTC)
- Announcement posted Thursday in community Discord
- Monitor XP generation rates during event (watch for abuse/automation)
- Economy Analyst monitors if accelerated XP causes unexpected economy effects
- Feature flag can be reverted immediately if any issue detected

## 11.7 Treasure Hunts

Treasure Hunts are community-wide puzzle events where players collectively solve riddles hidden in the game world.

**Treasure Hunt Operations:**
- Puzzles designed by Content team at least 30 days in advance
- Puzzle solution seeded to database (behind feature flag)
- QA team verifies the puzzle is solvable and rewards trigger correctly
- Community Manager monitors progress; hints released if 48 hours pass without progress
- Treasure Hunt never ends without being solved — the team has a "break glass" final hint if needed

## 11.8 Community Challenges

Community challenges are player-driven goals: "Collectively complete 1 million battles this week!"

**Operations:**
- Counter hosted in Redis (real-time progress)
- Progress displayed via bot command `/event progress`
- Milestone announcements posted automatically at 25%, 50%, 75%, 100%
- Reward distributed automatically when target reached
- Economy Analyst approves reward value before activation

## 11.9 Developer Livestreams

Quarterly developer livestreams build community connection and drive excitement for upcoming content.

**Livestream Operations:**
- Platform: YouTube Live / Twitch (both simultaneously via streaming software)
- Duration: 60–90 minutes
- Topics: Season preview, Q&A, game development behind-the-scenes
- Technical requirements: dedicated streaming PC, hardware backup for internet, pre-recorded segments for technical demos
- Community Manager moderates chat (separate from speakers)
- Bot integration: viewers can vote on minor upcoming content decisions via Discord poll synced to stream
- VOD published within 24 hours
- Written summary posted for players who could not watch

---

# 12 — COMMUNITY MANAGEMENT

## 12.1 Community Structure

```
ASCENSION LEGENDS COMMUNITY ECOSYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Official Support Server (hub)
  ├── #announcements       (read-only, major news)
  ├── #patch-notes         (read-only, every patch)
  ├── #general             (moderated discussion)
  ├── #help                (player support — monitored by support agents)
  ├── #bug-reports         (triaged by QA)
  ├── #suggestions         (reviewed monthly by design team)
  ├── #events              (current event info)
  ├── #leaderboards        (automated leaderboard posts)
  ├── #creator-lounge      (verified content creators only)
  ├── #ambassador-hall     (community ambassadors only)
  └── #developer-corner    (dev Q&A, occasional AMAs)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 12.2 Discord Moderation

**Moderation Team Structure:**
- Community Lead (1): Oversight, policy, escalations
- Senior Moderators (4): Policy enforcement, appeals, event support
- Moderators (10): Front-line moderation, daily presence
- Junior Moderators (15): Support coverage, training in progress

**Moderation Principles:**
- All moderation decisions must be documentable: "I can explain this in three sentences"
- Consistency over speed: a slower decision applied consistently is better than a fast, arbitrary one
- Moderation is not punishment — it is protection of the community environment
- No moderator bans a player from a community they are personally involved in (conflict of interest)

**Moderation Ladder:**

| Offense | First Occurrence | Repeat | Severe |
|---------|-----------------|--------|--------|
| Mild rule violation | Warning (DM) | 24h mute | 7-day ban |
| Harassment (mild) | Warning + 1h mute | 24h ban | 30-day ban |
| Harassment (severe) | 7-day ban | 30-day ban | Permanent ban |
| Slurs / hate speech | Immediate ban | — | — |
| NSFW content | Immediate ban | — | — |
| Exploit advertising | Immediate ban + report to engineering | — | — |
| Threats | Immediate ban + law enforcement referral if credible | — | — |

## 12.3 Player Reports

All player reports are processed through a structured system:

```
PLAYER REPORT FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Player submits /report [player] [reason]
         │
         ▼
Report logged to support database
         │
         ▼
Automated triage: severity classification
         │
    ┌────┴────┐
    │ HIGH    │ P1/P2: Exploitation, security, threats
    │         │ → Immediate alert to Community Lead
    │         │ → Security/Engineering if exploit
    │ NORMAL  │ P3/P4: Behavior, content, disputes
    │         │ → Added to moderation queue
    └────┬────┘
         │
         ▼
Moderator reviews (within SLA)
         │
         ▼
Action taken + documented
         │
         ▼
Reporter notified of outcome (generic: "We reviewed and took appropriate action")
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 12.4 Appeals Process

Players may appeal moderation decisions via the support form:

- Appeals reviewed within 48 hours
- Appeal reviewers must not be the original moderator
- If appeal is upheld: action reversed, original moderator receives coaching
- If appeal is denied: player informed with brief explanation (no full disclosure of other evidence)
- A decision that has been appealed once cannot be appealed again for the same incident

## 12.5 Community Announcements

**Announcement Priority Tiers:**

| Tier | Examples | Channel | Advance Notice |
|------|---------|---------|----------------|
| Critical | Emergency downtime, economy freeze | #announcements + DM | Immediately (no advance) |
| Major | Season launch, new content | #announcements | 1 week |
| Standard | Patch notes, events | #announcements, #patch-notes | 2–3 days |
| Minor | QoL changes, small events | #general pinned | 24 hours |

All announcements follow the **ASAR format:**
- **A**ttention: Lead with what matters ("Season 3 is now live!")
- **S**ummary: Brief what changed and why
- **A**ction: What does the player do? (optional but preferred)
- **R**esource: Link to more detail (patch notes, guide)

## 12.6 Feedback Collection

Player feedback is a product input, not just community sentiment. It is collected through:

1. **`/feedback` command** — in-game text submission
2. **#suggestions channel** — public, community-visible
3. **Monthly surveys** — structured, 5-question max, published results
4. **Post-ban appeal forms** — inadvertent source of product friction data
5. **Content creator sessions** — quarterly calls with top creators

**Feedback Processing:**
- All feedback goes into a feedback database, tagged by theme
- Monthly: Community Lead summarizes top themes for design team
- Design team formally responds to top 5 community suggestions each month in #developer-corner

## 12.7 Polls

Community polls are used for minor content decisions:
- Poll format: Discord poll in #general (open 72 hours)
- Results are advisory, not binding (we are transparent about this)
- We never poll players on safety, security, or legal issues
- Poll topics: event preferences, cosmetic options, community names, minor feature choices

## 12.8 Developer Q&A Sessions

Monthly text-based Q&A sessions in #developer-corner:
- Duration: 2 hours, scheduled Tuesday 18:00 UTC
- Participants: Game Director (always), guests from design/engineering
- Format: Moderated — community managers filter questions, developers type responses
- All Q&A sessions are archived in a searchable document
- Questions are pre-submitted (48-hour window) to allow thoughtful answers

## 12.9 Content Creator Program

**Eligibility:**
- Minimum 1,000 subscribers/followers on any major platform
- Regular Ascension Legends content (minimum 2 posts/month)
- Good standing (no active moderation actions)
- Application via creator form

**Benefits:**
- Early access to new seasons (1 week ahead of public)
- Monthly Stardust (✨) stipend (cosmetics — no in-game power)
- `[Creator]` role in support Discord
- Dedicated support channel
- Direct line to Community Lead for bugs or questions

**Obligations:**
- Label sponsored or early-access content clearly
- Maintain Ascension Legends code of conduct in content
- Cannot share early-access information before embargo lifts

## 12.10 Ambassador Program

Ambassadors are the top community members — not necessarily content creators, but highly engaged, helpful, and positive players.

**Ambassador Selection:**
- Nominated by community managers or self-nominated
- Game Director final approval
- Maximum 20 ambassadors active at any time

**Benefits:**
- `[Ambassador]` in-game title (permanent, even if program ends)
- Direct feedback channel to design team
- Early access to community events
- Name in credits (annual)

---

# 13 — CUSTOMER SUPPORT

## 13.1 Support Philosophy

Support is not a cost center — it is the direct, human face of Ascension Legends. Every support interaction is an opportunity to turn a frustrated player into a loyal one.

**Support Principles:**
- Respond, don't deflect: give a real answer, not "check the FAQ"
- Err on the side of the player when facts are uncertain (but not when it's clearly abuse)
- Be human: use names, acknowledge frustration, thank them for playing
- Resolve, don't patch: if the player's issue is a bug, file the bug ticket too

## 13.2 Support Ticket Workflow

```
TICKET LIFECYCLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUBMISSION (player)
  ↓
AUTO-TRIAGE (system)
  → Category classification
  → Severity assignment
  → SLA clock starts
  ↓
AGENT ASSIGNMENT (Support Lead)
  ↓
INVESTIGATION (agent)
  → Check relevant systems
  → Review economy/audit logs if needed
  → Consult Engineering if technical
  ↓
RESOLUTION
  → Action taken
  → Player notified
  ↓
FEEDBACK (player)
  → Optional satisfaction rating
  ↓
CLOSED
  → 30-day re-open window
  ↓
ARCHIVED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 13.3 Bug Reports

Bug reports from support are triaged to QA:
- Support agent creates a bug ticket with full reproduction steps (obtained from player)
- Ticket severity assessed by QA
- Player notified that the bug is filed and being tracked
- When bug is fixed, player is notified (automated when ticket closes)
- Players who report P1/P2 bugs receive a small Gold/Crystal thank-you reward

## 13.4 Exploit Reports

Exploit reports are treated as security incidents:
- Immediately escalated to Security/Engineering team
- Player rewarded for responsible disclosure (if they report via proper channel and do not exploit)
- Exploit patched before public disclosure
- Player informed when patch is live

**Bug Bounty Program (Year 2):** A formal bug bounty will be considered in Year 2 for critical economy and security exploits. This rewards responsible disclosure with Stardust or cash equivalent.

## 13.5 Account Recovery

Account recovery is requested when a player loses access to their Discord account:
- Player submits recovery request with: original Discord username, character name, approximate last login date, any in-game achievements or items they remember
- Support verifies identity via cross-referencing game records (no personal data request beyond Discord info)
- If verified: account linked to new Discord ID, original Discord ID blocked
- If unverifiable: account cannot be transferred (prevents impersonation)

**Account Recovery SLA:** 48 hours (standard), 24 hours (account suspected compromised)

## 13.6 Refund Policy

Ascension Legends purchases Stardust (✨). Stardust refunds:
- Refunds within 14 days of purchase: available if Stardust is unspent
- Refunds for spent Stardust: available only if a technical error caused the purchase (bug in purchase flow)
- No refunds for regret purchases (player changed their mind)
- All refunds processed through the original payment platform
- Refund decisions by Support Lead only (not front-line agents)

**Fraudulent Chargebacks:** Player accounts associated with fraudulent chargebacks are suspended pending investigation. Stardust purchased via chargeback is removed from the account.

## 13.7 Appeal Policy

Players may appeal:
- In-game suspensions
- Marketplace restrictions
- Economy corrections

Appeals are processed within 48 hours. If upheld, the action is reversed and the player is compensated for the inconvenience. Denied appeals are final (no second appeal for same incident).

## 13.8 Support SLAs

| Ticket Category | Response SLA | Resolution SLA |
|----------------|-------------|----------------|
| Security / Exploit | 15 minutes | 2 hours |
| Account access | 4 hours | 24 hours |
| Economy correction | 4 hours | 48 hours |
| Technical bug | 24 hours | 7 days (depends on engineering) |
| General inquiry | 24 hours | 72 hours |
| Cosmetic issue | 48 hours | 7 days |
| Feedback/suggestion | 72 hours (acknowledged) | N/A |

---

# 14 — QUALITY ASSURANCE

## 14.1 QA Philosophy

QA is not a gate at the end of a process — it is a continuous discipline embedded throughout development. The QA team is involved from design review through post-launch monitoring.

**QA Stages:**
1. **Design Review** — QA reviews feature specs for testability and edge cases
2. **Development Testing** — Engineers write unit/integration tests as part of development (not after)
3. **Functional QA** — QA team tests new features in staging
4. **Regression Testing** — QA verifies existing features are unaffected
5. **Performance Testing** — Load and stress testing before major releases
6. **Production Monitoring** — QA monitors production signals post-release

## 14.2 Testing Procedures — New Commands

Every new Discord slash command must pass:

```
NEW COMMAND TEST CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FUNCTIONAL TESTS
□ Command responds to all valid input combinations
□ Command handles all invalid inputs (Zod validation passes)
□ Command returns expected output for happy path
□ Command defers response correctly (> 3-second operations)
□ Command ephemeral vs. public behavior correct
□ Command works for new players (no character created)
□ Command works at max character level
□ Command permission checks correct (admin commands gated)

EDGE CASES
□ User runs command while already in another command state
□ Database query returns empty result
□ Rate limit hit during command (handles gracefully)
□ Discord interaction timeout (command takes > 15 minutes)
□ Bot restarts mid-command (stateless resume)

PERFORMANCE
□ P95 response time < 800 ms (standalone, no upstream issues)
□ No N+1 queries (explain plan reviewed for all MongoDB queries)
□ Redis cache used where appropriate

LOCALIZATION
□ All text passes spell-check
□ No hardcoded player-facing strings (all in message templates)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 14.3 Testing Procedures — Battle System

```
BATTLE SYSTEM TEST CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMBAT CORRECTNESS
□ Damage formulas verified against design spec (Books 1–2)
□ All status effects apply, stack, and expire correctly
□ All skill effects trigger at correct times
□ Elemental affinities apply damage modifiers correctly
□ Critical hit mechanics correct
□ Dodge/miss mechanics correct

BATTLE FLOW
□ Battle begins correctly (challenger/opponent selection)
□ Turn order determined correctly by speed stat
□ Victory/loss conditions trigger correctly
□ XP and Gold rewards calculated correctly
□ Equipment durability system works correctly (if applicable)

TRANSFORMATION SYSTEM
□ All 5 stages activate at correct HP thresholds
□ Stage buffs applied correctly
□ Stage animations trigger in render output
□ Transformation can be performed mid-battle

EDGE CASES
□ Both players die simultaneously (tie condition)
□ Battle with a player who just deleted their character
□ Player offline during async battle conclusion
□ Battle lock held across a server restart
□ Concurrent battles for same player (should be blocked)

RENDERING
□ Battle GIF renders for all tested class combinations
□ Battle MP4 renders correctly
□ All sprite frames present for all tested classes
□ File size within acceptable range (GIF < 8 MB, MP4 < 20 MB)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 14.4 Testing Procedures — Economy System

```
ECONOMY SYSTEM TEST CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRANSACTION INTEGRITY
□ Gold transfer is atomic (cannot partially complete)
□ Negative balance prevention enforced
□ Concurrent transfers for same account handled correctly (no race conditions)
□ All transactions appear in audit log

MARKETPLACE
□ Listing creation correctly deducts item from inventory
□ Listing expiry correctly returns item
□ Purchase correctly transfers item and Gold
□ 5% marketplace tax correctly deducted and destroyed
□ Outlier price detection flags correctly

CRAFTING
□ Correct materials consumed on successful craft
□ Materials NOT consumed on failed craft (if applicable to design)
□ Crafted item appears in inventory correctly

DROP TABLES
□ All drop rates sum to ≤ 100% per table
□ Item drop rates match configuration (verify with sampling)
□ No items that can be obtained from drops that should not be obtainable

CURRENCY SINKS
□ All shop purchases deduct correct amount
□ Deducted Gold is destroyed (not transferred to NPC)
□ Sink operations logged
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 14.5 Testing Procedures — Marketplace

See Economy System (14.4) for marketplace tests. Additional:
- Marketplace search returns correct results (sorted, filtered correctly)
- Marketplace pagination works for large result sets
- Listing limit enforcement (max 10 per item type per player)
- Expired listing cleanup runs on schedule

## 14.6 Testing Procedures — Guild Systems

```
GUILD SYSTEM TEST CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GUILD MANAGEMENT
□ Guild creation requires correct Gold cost
□ Guild name uniqueness enforced
□ Max member limit enforced
□ Role assignment (Leader, Officer, Member) works correctly
□ Leader transfer works correctly
□ Guild dissolution distributes or destroys Guild Coins correctly

GUILD PROGRESSION
□ Guild XP accumulates from member activities
□ Guild level increases at correct thresholds
□ Guild perk unlocks at correct levels

GUILD WAR
□ War declaration requires correct conditions (level, member count)
□ War scheduling and match cycle correct
□ Guild War matchmaking fair (similar Guild levels/PR)
□ War results calculated and applied correctly
□ Guild War Coins distributed correctly at war end

CROSS-SHARD GUILD
□ Guild members on different shards can see each other in roster
□ Guild chat works cross-shard
□ Guild war contributions tracked cross-shard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 14.7 Testing Procedures — Raids

```
RAID SYSTEM TEST CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RAID SETUP
□ Raid lobby creation requires correct conditions (min PR, group size)
□ Max group size enforced
□ Raid begins when all players ready (or host starts)

RAID COMBAT
□ Boss mechanics trigger at correct HP thresholds
□ Multiple players' damage dealt and recorded correctly
□ Contribution tracking for loot distribution correct
□ Raid timer enforced (if applicable to difficulty)

REWARDS
□ Raid Tokens distributed proportional to contribution
□ Item drops from loot table correct
□ Weekly raid lockout enforced (if applicable)

FAILURE CONDITIONS
□ Raid party wipes (boss resets correctly)
□ Player disconnects mid-raid (handled gracefully)
□ Group leader leaves (lead transfers or raid ends)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 14.8 Testing Procedures — Media Generation

See Battle System (14.3) render section. Additional:
- Profile card renders for all character levels
- Profile card renders for all class/transformation states
- Leaderboard card renders at 100, 1,000, 10,000 entries
- Render worker handles concurrent requests without degradation

## 14.9 Regression Testing

A regression suite runs on every PR and before every production deployment:

**Core Regression Suite:**
- All unit tests (full pass required)
- All integration tests (full pass required)
- Happy-path smoke test for every major command group (automated)
- Economy integrity check (no unexpected balance changes after deployment)
- Render sanity check (sample renders produce valid output)

**Extended Regression (pre-major-release):**
- Full end-to-end test playthrough (automated where possible, manual for story)
- Load test at 2× expected peak load
- Chaos test (random pod termination during load test)
- Full accessibility review of any new UI elements

## 14.10 Stress Testing

**Load Profile Targets:**

| Scenario | Target Load | Pass Criteria |
|----------|------------|--------------|
| Normal operation | 100 commands/sec | P95 < 800 ms, < 0.5% errors |
| Peak (event launch) | 500 commands/sec | P95 < 1.5 s, < 1% errors |
| Stress (burst) | 1,000 commands/sec | System stable, no data loss, graceful degradation |
| Soak test | 200 commands/sec for 1 hour | No memory leaks, no error rate drift |

Stress tests are run in a dedicated load-testing environment, never in production or staging (they would disrupt other tests).

---

# 15 — DISASTER RECOVERY

## 15.1 Disaster Recovery Philosophy

Disaster Recovery (DR) is not about preventing disasters — it is about surviving them with minimal harm to players. The DR plan assumes the worst: complete data center failure, total database loss, or catastrophic security breach. We plan for it so it does not break us.

**DR Objectives:**
- **RPO (Recovery Point Objective):** Maximum 1 hour of data loss acceptable (target: < 1 minute via continuous backup)
- **RTO (Recovery Time Objective):** Service restored within 4 hours of disaster declaration
- **Priority Order in recovery:** (1) Player data integrity, (2) Economy integrity, (3) Service availability

## 15.2 Disaster Classification

| Disaster Type | Definition | DR Level |
|--------------|-----------|---------|
| Partial service degradation | One service unavailable, others operational | Standard Incident (Section 5) |
| Full service outage | All player-facing features unavailable | Full Incident Response (Section 5) |
| Primary database failure | MongoDB primary unavailable | Standard Incident + DB SOP |
| Data corruption | Confirmed corruption in production data | DR Level 1 |
| Full database loss | All MongoDB data unrecoverable | DR Level 2 |
| Multi-region outage | Cloud provider failure affecting > 1 region | DR Level 2 |
| Security breach | Confirmed unauthorized access to production | DR Level 3 |

## 15.3 DR Level 1 — Partial Data Loss (Data Corruption)

**Scenario:** A code bug or hardware failure corrupts data in one or more collections.

```
DR LEVEL 1 PROCEDURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1: STOP THE BLEEDING
□ Activate Emergency Lock Mode (all writes stopped)
□ Take immediate Atlas snapshot (captures current corrupted state for forensics)
□ Notify: Technical Director, Economy Analyst (if economy-related)

STEP 2: ASSESS SCOPE
□ Identify: Which collections? Which documents? Time range of corruption?
□ Can we identify the exact corruption start time?
□ Is the corruption still spreading?

STEP 3: CHOOSE RECOVERY PATH
PATH A — PITR Restore (preferred if corruption < 1 hour old):
  □ Identify clean restore point (just before corruption began)
  □ Restore to isolated cluster (not production — forensics only first)
  □ Verify restored data is clean
  □ Plan for what data is lost between restore point and now
  □ Technical Director approves restore
  □ Execute PITR restore to production
  □ Verify data integrity post-restore

PATH B — Selective Document Repair (if corruption is limited):
  □ Script to identify and repair corrupted documents
  □ Script reviewed by 2 engineers before execution
  □ Script tested on isolated copy first
  □ Technical Director approves execution
  □ Apply repair script
  □ Verify repaired data

STEP 4: VERIFY & RESTORE SERVICE
□ Economy integrity check
□ Synthetic monitors pass
□ Deactivate Emergency Lock Mode
□ CL posts player communication

STEP 5: POST-MORTEM
□ Within 12 hours
□ Root cause identified
□ Prevention measures implemented
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 15.4 DR Level 2 — Complete Database Loss or Multi-Region Outage

**Scenario:** MongoDB Atlas cluster completely unavailable or destroyed, or cloud provider catastrophic failure.

```
DR LEVEL 2 PROCEDURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1: DECLARE DISASTER (Technical Director only)
□ Confirm this is not a temporary Atlas outage (wait max 15 min for Atlas recovery)
□ Activate Emergency Lock Mode
□ Notify entire team
□ Post to status page: "Major technical incident — game offline"

STEP 2: ACTIVATE FALLBACK REGION
□ If multi-region outage: identify unaffected region
□ Redirect all traffic to unaffected region
□ Verify bot pods in fallback region are healthy
□ Confirm fallback region's MongoDB replica is accessible

STEP 3: DATABASE RESTORATION FROM BACKUP
□ Identify most recent clean backup (Daily snapshot or continuous PITR)
□ Initiate Atlas cluster restoration from backup
□ ETA for full restore: 2–8 hours depending on data volume
□ Monitor restore progress in Atlas UI

STEP 4: PARALLEL — INFRASTRUCTURE RECOVERY
□ If cloud provider failure: stand up equivalent infrastructure in alternate provider
□ Use Terraform IaC to spin up new cluster (target: < 2 hours for infrastructure)
□ Restore application deployments from container registry

STEP 5: VALIDATE RESTORED DATABASE
□ Verify record counts against last known-good counts
□ Run economy integrity check
□ Verify player data sample (random 100 accounts)
□ Technical Director approves restored state

STEP 6: CONTROLLED RECOVERY SEQUENCE
□ Enable Admin API (internal access only) — verify health
□ Enable read-only bot commands — verify health
□ Enable full bot commands — verify health
□ Enable economy — Economy Analyst verifies integrity
□ Enable marketplace — Economy Analyst verifies
□ Full service restored

STEP 7: PLAYER COMMUNICATION
□ Honest explanation of what happened
□ Data loss disclosure if any (required by player trust principles)
□ Compensation announcement (see DR compensation policy)

DR COMPENSATION POLICY
□ < 1 hour data loss: 3-day Double XP + Gold package
□ 1–4 hours data loss: 7-day Double XP + large Gold + rare item
□ > 4 hours data loss: Emergency Economy Analyst review for proportional compensation
□ Any player who can document data loss: direct restoration via Support
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 15.5 DR Level 3 — Security Breach

**Scenario:** Unauthorized access to production systems confirmed.

```
DR LEVEL 3 PROCEDURE — SECURITY BREACH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1: CONTAIN IMMEDIATELY
□ Activate Emergency Lock Mode
□ Revoke all active admin sessions
□ Rotate ALL production secrets (emergency rotation procedure)
□ Block attacker's known IP addresses at WAF/firewall
□ Preserve all logs (do NOT delete anything — evidence)
□ Disconnect compromised systems from network if breach is active

STEP 2: ESCALATE IMMEDIATELY
□ Technical Director + Game Director on call
□ If personal player data accessed: legal/privacy counsel engaged
□ If law enforcement warranted (extortion, CSAM, credible threats): engage immediately

STEP 3: FORENSICS
□ Forensics team (internal or contracted) begins analysis
□ Establish: timeline of access, what was accessed, how they got in
□ Do NOT make changes to production until forensics has a snapshot
□ Clone affected systems for analysis (do not modify originals)

STEP 4: ASSESS PLAYER IMPACT
□ Was player data accessed (Discord IDs, usernames, in-game data)?
□ Was economy data manipulated?
□ Was any personally identifiable information exposed?

STEP 5: BREACH DISCLOSURE (if player data accessed)
□ Prepare breach notification (legal review required)
□ Notify affected players via DM + email if available
□ Post public statement (transparency required)
□ Timeline: within 72 hours of confirmed breach

STEP 6: HARDENING
□ Patch the vulnerability exploited
□ Security audit of all adjacent systems
□ All secrets rotated (even if not confirmed compromised)
□ Enhanced monitoring activated
□ Penetration test scheduled

STEP 7: RESTORE SERVICE
□ Only after: vulnerability patched, forensics complete, Director approval
□ Graduated restoration as in DR Level 2 Step 6

POST-MORTEM: Within 24 hours (Security post-mortems are highest priority)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 15.6 Discord Outage DR

Discord outages are outside our control. DR response:
- Bot enters passive mode (no commands possible)
- Update status page and all owned social media (Twitter/X, Reddit if applicable)
- Monitor discordstatus.com
- Do not make any code changes during Discord outage (no moving targets)
- When Discord restores: verify bot reconnects to all shards before lifting status advisory

## 15.7 Rollback Procedures (Code)

See Section 2.4 for standard code rollbacks. For DR scenarios requiring code rollback:
- Identify the last known-good container image tag
- Verify image exists in container registry
- Execute rollback (Section 2.4 procedure)
- Verify health post-rollback before opening to players

## 15.8 DR Communication Plan

| Phase | Audience | Channel | Tone |
|-------|---------|---------|------|
| During incident | Internal team | Slack incident channel | Urgent, factual |
| During incident | Players | Status page + #announcements | Calm, honest, no speculation |
| Resolution | Players | Full communication | Transparent, complete, apologetic where warranted |
| Post-resolution | Internal | Post-mortem | Analytical, blameless |
| Post-resolution | Players | Summary | Honest, preventative measures |

---

# 16 — ANALYTICS & KPIs

## 16.1 Analytics Infrastructure

```
ANALYTICS PIPELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Game Events
  │ (emitted by all services, structured JSON)
  ↓
BullMQ analytics-ingest queue
  ↓
Analytics Worker
  │ → Raw events stored (90 days): MongoDB `analytics_events` collection
  │ → Aggregated metrics computed hourly: MongoDB `analytics_aggregated`
  ↓
Grafana (dashboards) + Internal Analytics API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Event Schema:**
```json
{
  "event": "battle.completed",
  "timestamp": "2025-06-15T14:23:00.000Z",
  "guild_id": "gld_01J...",
  "user_id": "usr_01J...",
  "character_level": 45,
  "character_class": "shadowblade",
  "outcome": "victory",
  "duration_seconds": 23,
  "xp_earned": 450,
  "gold_earned": 120
}
```

## 16.2 Core KPIs

### Engagement KPIs

| KPI | Definition | Formula | Target |
|-----|-----------|---------|--------|
| DAU | Daily Active Users | Unique users issuing ≥ 1 command per day | Month 1: 10,000 |
| WAU | Weekly Active Users | Unique users active in any 7-day window | Month 1: 25,000 |
| MAU | Monthly Active Users | Unique users active in any 30-day window | Month 1: 50,000 |
| DAU/MAU | Stickiness ratio | DAU / MAU | > 20% healthy |
| New Users/Day | Acquisition | New character creations per day | Growth dependent |
| Active Guilds | Guild engagement | Guilds with ≥ 3 active members in 7 days | > 60% of installed guilds |

### Retention KPIs

| KPI | Definition | Target |
|-----|-----------|--------|
| D1 Retention | % of Day-0 users who play on Day 1 | > 50% |
| D7 Retention | % of Day-0 users who play in Day 7 window | > 30% |
| D30 Retention | % of Day-0 users who play in Day 30 window | > 15% |
| D90 Retention | % of Day-0 users who play in Day 90 window | > 8% |
| Churned User Rate | Users who played last month but not this | < 10%/month |

### Session KPIs

| KPI | Definition | Target |
|-----|-----------|--------|
| Session Length | Time between first and last command per day per user | 20–45 minutes |
| Commands per Session | Average commands in a session | > 10 |
| Session Frequency | Sessions per user per week | > 3 |

### Feature Engagement KPIs

| KPI | Definition | Target |
|-----|-----------|--------|
| Battle Participation Rate | DAU who completed ≥ 1 battle | > 60% |
| Guild Participation Rate | DAU who completed ≥ 1 guild activity | > 40% |
| PvP Participation Rate | WAU who completed ≥ 1 PvP battle | > 30% |
| Raid Completion Rate | Eligible players who completed ≥ 1 raid/week | > 20% |
| Story Completion Rate | % of active players who completed story chapter by end of season | > 70% |
| Marketplace Participation | DAU who listed or purchased on marketplace | > 25% |

### Economy KPIs

| KPI | Definition | Target |
|-----|-----------|--------|
| Gold Velocity | Gold transacted / Gold supply | 0.05–0.20 |
| Gold Sink Ratio | Gold destroyed / Gold generated | 0.85–1.00 |
| Marketplace Volume | Total Gold value transacted daily | Trend up |
| Battle Completion Rate | Battles completed / battles started | > 98% |
| Stardust Spend Rate | Stardust activated / Stardust distributed | > 60% in 30 days |

### Technical KPIs

| KPI | Definition | Target |
|-----|-----------|--------|
| Bot Uptime | Monthly uptime | ≥ 99.9% |
| Command Response P95 | 95th percentile command response time | ≤ 800 ms |
| Render Success Rate | Renders completed successfully / total | ≥ 98% |
| Error Rate | Errors / total commands | ≤ 0.5% |
| Media Render Success | Successful renders / render attempts | ≥ 98% |
| Battle Completion Rate | Bot-side: battles that conclude without error | ≥ 99% |

## 16.3 KPI Reporting Cadence

| Report | Frequency | Audience | Distribution |
|--------|-----------|---------|--------------|
| Daily Dashboard | Daily, auto | Economy Analyst, SRE | Grafana |
| Weekly KPI Summary | Monday 09:00 | All team leads | Slack + email |
| Monthly Business Review | First Monday, 10:00 | Director-level + leads | Meeting + doc |
| Quarterly Review | Quarterly | Full team | All-hands meeting |
| Season Report | End of season | All team | Archived doc |

## 16.4 Cohort Analysis

Player cohorts are tracked by their start date (month of first play). Cohort analysis answers: "How does our game retain different groups of players over time?"

```
COHORT TRACKING METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
For each monthly cohort:
  D1, D7, D30, D60, D90, D180, D365 retention
  Average commands in first 7 days (onboarding engagement)
  Class distribution chosen by cohort
  Content progression speed (level reached per week)
  Economy participation (first marketplace listing/purchase)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 16.5 Economy Velocity

**Economy Velocity** measures how fast currency is circulating through the system:

```
VELOCITY = Total Gold Transacted in Period / Average Gold Supply in Period

Healthy range: 0.05 – 0.20 (5–20% of supply circulates per day)
< 0.05 = Hoarding — players not engaging with economy
> 0.20 = Hyperactivity — may indicate velocity exploit or event spike
```

Monitor velocity per currency independently. Unusual velocity spikes by currency type (e.g., only Guild Coins spiking) can indicate a specific exploit or event interaction.

## 16.6 Marketplace Activity KPIs

| Metric | Definition | Healthy |
|--------|-----------|---------|
| Listing Volume | Listings created per day | Increasing trend |
| Sale Rate | % of listings that sell | 30%–60% |
| Price Discovery | Variance in prices for same item | < 20% variance = healthy market |
| Marketplace Tax Collected | Gold destroyed via 5% tax per day | Increasing (healthy sink) |
| Top 10 Items by Volume | Most traded items | Should diversify over time |

---

# 17 — RELEASE MANAGEMENT

## 17.1 Version Numbering

Ascension Legends uses **Semantic Versioning (MAJOR.MINOR.PATCH)**:

```
VERSION SCHEMA: MAJOR.MINOR.PATCH[-prerelease]

MAJOR  — Breaking changes to game data schema, fundamental system overhaul,
         or expansion release (e.g., 2.0.0 = Year 2 Expansion)
MINOR  — New features, new content, new classes, new season launch
         (e.g., 1.3.0 = Season 3 launch)
PATCH  — Bug fixes, balance changes, QoL improvements
         (e.g., 1.3.4 = 4th patch in Season 3)

Pre-release suffixes:
  1.3.0-alpha.1 → Internal testing build
  1.3.0-beta.1  → QA/staging build
  1.3.0-rc.1    → Release candidate (final staging)
  1.3.0         → Production release
```

## 17.2 Release Branches

Git branching model:

```
BRANCH STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
main           → Production-ready code, protected branch
                 (requires PR + CI + at least 1 senior engineer approval)

staging        → QA/staging environment code
                 (auto-deployed to QA environment on merge)

develop        → Integration branch, daily builds
                 (engineers merge feature branches here first)

feature/*      → Individual feature work
hotfix/*       → Emergency production fixes (branches from main)
release/N.N.N  → Release preparation (branched from develop)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**PR Rules:**
- All PRs require at least 1 approval (2 for production-impacting changes)
- No self-merges — you cannot approve your own PR
- CI must be passing (all tests green) before merge
- Changelog entry required for all non-trivial changes

## 17.3 Hotfix Process

Hotfixes are emergency code changes that must bypass the normal release cycle:

```
HOTFIX PROCESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRIGGER: P1/P2 incident confirmed, code change required

1. Branch from main: git checkout -b hotfix/INC-YYYY-NNN main
2. Minimum viable fix ONLY — no unrelated changes
3. Write unit test for the bug (prevent regression)
4. Get at minimum 1 additional engineer review (Technical Director if possible)
5. CI must pass (abbreviated CI for hotfixes — core tests only)
6. Deploy via standard canary process (abbreviated soak: 15 min for P1)
7. Monitor for 30 minutes post-deploy
8. Back-merge to develop: git merge hotfix/INC-YYYY-NNN develop
9. Tag the hotfix release: git tag v1.N.N
10. Close hotfix branch
11. Schedule proper fix for next regular release (if hotfix was a workaround)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 17.4 Patch Notes

Every production release is accompanied by patch notes. Patch notes are a player-facing document and are written by the Lead Game Designer with input from Engineering.

**Patch Notes Format:**

```markdown
# Patch [VERSION] — [Date]

## Summary
[2–3 sentence summary of this patch's focus]

## New Features
- [Feature name]: [Description — what it does and why it was added]

## Balance Changes
### [Class/Skill]
- [Change]: [Old value → New value] — [Brief rationale]

## Bug Fixes
- Fixed: [Description of the bug that was fixed]
- Fixed: [Issue that was causing [X] to [Y]]

## Economy Adjustments
- [Drop table change]: [What changed and why]
- [Currency sink change]: [What changed]

## Performance Improvements
- [Area]: [What improved and expected impact]

## Known Issues
- [Active issue]: [Status and workaround if any]
```

Patch notes are published simultaneously to:
- #patch-notes in the support Discord
- GitHub Releases page
- Official website (when live)

## 17.5 Feature Flags

Feature flags allow deploying code to production without activating features. This decouples deployment from release.

**Feature Flag Inventory (maintained in internal config service):**

| Flag | Description | Default |
|------|------------|---------|
| `emergency_lock` | Full emergency lock | false |
| `economy_lock` | Economy transactions disabled | false |
| `marketplace_freeze` | Marketplace write ops disabled | false |
| `redis_degraded_mode` | Redis bypass mode | false |
| `text_only_battles` | Render bypass, text battles | false |
| `double_xp_weekend` | 2× XP multiplier | false |
| `season_N_content` | Season N story/events gated | false |
| `world_boss_event` | World boss event active | false |
| `maintenance_mode` | All commands return maintenance message | false |
| `creator_program` | Creator-specific features | false |
| `new_command_beta` | Beta-testing a new command | false |

Feature flags must be documented, reviewed quarterly, and cleaned up when no longer needed. Stale feature flags are a security and operational risk.

## 17.6 Beta Testing

Before major releases, a beta testing phase is offered to the community:

**Beta Process:**
- Beta applications open 2 weeks before planned beta start
- 100–500 players selected (mix of experience levels)
- Beta runs in the QA environment with production-like data
- Beta players must sign a content embargo agreement
- Feedback collected via structured form (not just Discord chat)
- Beta feedback reviewed by design team within 48 hours
- Critical beta feedback can delay release (requires Game Director approval)
- Beta players receive an exclusive cosmetic reward for participation

## 17.7 Public Testing (Open Beta / PTR)

For major feature changes (new systems, major balance overhauls), a Public Test Realm (PTR) may be deployed:
- PTR is announced 1 week before opening
- Players opt in via `/opt-in PTR` command
- PTR data is separate from production — no earned items carry over
- PTR runs for 1–2 weeks
- Summary of changes and community feedback published before PTR closes

## 17.8 Stable Releases

A release is considered stable when:
- All synthetic monitors have been green for 24 hours post-deployment
- Error rate has returned to baseline (< 0.5%) for 24 hours
- No P1/P2 incidents in first 48 hours
- Economy Analyst confirms no unexpected economy effects
- Support ticket volume within normal range (no spike from release)

Stable declaration is made by the Technical Director and logged.

---

# 18 — FUTURE EXPANSIONS

## 18.1 Expansion Philosophy

Expansions are major content additions that expand the game world, introduce new systems, or open new chapters of the Aethon narrative. Expansions are not just content drops — they are game evolutions.

**Expansion Cadence:** One major expansion per year, aligned with the Year 2+ roadmap.

**Expansion vs. Season:**
| | Season | Expansion |
|---|---|---|
| Duration | 3 months | Ongoing (permanent) |
| New content | Story chapter, events | New continent, classes, systems |
| Price | Free (Battle Pass optional) | Free (story) or paid (new classes optional) |
| Impact on existing play | Minor balance changes | May restructure entire meta |

## 18.2 Expansion Packs

**Year 2 Expansion: "The Fracture Revisited"**
- Theme: Exploring the ancient cause of The Fracture (the 90,000-year-old continental split)
- New content: 1 new continent (The Ruins Continent, previously inaccessible), 10 new classes, new Frequency (proposed: Crystallis), new raid tier
- Technical: New shard count review, new MongoDB collections for continent data, new render assets
- Economy: New expansion-exclusive currencies reviewed by Economy Analyst before approval

**Expansion Approval Process:**
1. Concept document (Game Director) → approved by studio leadership
2. Technical feasibility review (Technical Director) → architecture impact assessment
3. Economy pre-mortem (Economy Analyst) → simulate expansion economy impact
4. Content scoping (full design team) → deliverable list with timeline
5. Executive greenlight → development begins

## 18.3 New Continents

Each new continent requires:
- Full lore documentation (Book 2 update)
- New encounter tables for that continent
- New NPC roster
- New ambient event set
- New drop tables (Economy Analyst review required)
- New render backgrounds and assets
- Performance testing at full scale

## 18.4 New Classes

New classes require:
- Class design document (Book 1 update): stats, skills, transformation path
- Balance simulation vs. existing 50 classes before implementation
- Full skill tree implementation + QA
- Character sprite set (all 5 transformation stages)
- Character card template
- Battle animation frames
- Story justification: where does this class fit in the world of Aethon?

## 18.5 New Transformations

New transformation paths (beyond the existing 5 stages):
- Lore justification required (tied to world events or new Frequency)
- Balance review: transformations must not break existing PvP meta
- Visual requirement: unique sprite set for each new stage
- Mechanics review: each stage must feel meaningfully different

## 18.6 Cross-Platform Companion App

**Year 3 target: Web companion app**
- Technology: React web app (Vite), hosted separately from bot infrastructure
- Authentication: Discord OAuth2
- Features: Character viewer, marketplace browser, leaderboards, friend tracking, event calendar
- Data: Read-only access to production database via Admin API (new read-only endpoints)
- No game commands via companion app — Discord is the game's primary interface

**Year 4 target: Mobile companion app**
- Technology: React Native / Expo
- Features: Same as web app + push notifications for events, battle outcomes, guild messages

## 18.7 Official Website

Year 2 target: public-facing marketing website (separate from the Discord ecosystem)
- Purpose: discoverability, press, content creator resources, support redirect
- Content: Game overview, lore primer, class showcase, how to start, FAQ, news blog
- No in-game data — static marketing content only initially
- SEO-optimized for "Discord MMORPG" and related terms

## 18.8 Public API

Year 3 target: limited public API for community developers
- Endpoints: leaderboard (global + guild), public character profile lookup, event calendar
- Rate limited: 100 requests/hour per API key
- API key registration via Discord OAuth2 (verified player only)
- Separate API gateway from internal Admin API
- Developer documentation published openly

## 18.9 Creator Tools

Year 3 target: tools for community content creators
- Bot export: exportable match history in JSON format for creators to build tools on top of
- Creator dashboard: web UI showing creator referral stats, player reach
- Mod kit: approved sprite packs and art assets for fan art (clear license)

---

# 19 — TEAM STRUCTURE & ORG DESIGN

## 19.1 Org Philosophy

Ascension Legends is built by a small, skilled, cross-functional team. We prioritize depth of ownership over breadth of headcount. Every person on the team owns their domain from concept to production.

```
ASCENSION LEGENDS ORG CHART (Launch)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STUDIO LEADERSHIP
  └── Game Director (1)
      └── Technical Director (1)

GAME DESIGN (reports to Game Director)
  ├── Lead Game Designer (1)
  ├── Systems Designers (2)
  ├── Narrative Designer / Writer (1)
  └── Economy Analyst (1)

ENGINEERING (reports to Technical Director)
  ├── Lead Backend Engineer (1) ← also serves as principal architect
  ├── Backend Engineers (2)     ← Discord bot, API, worker systems
  ├── Database Engineer (1)     ← MongoDB, Redis, schema, migrations
  └── DevOps / SRE (1)         ← Kubernetes, CI/CD, monitoring, on-call

ART (reports to Game Director)
  ├── Lead UI Artist (1)
  ├── Character Artist / Animator (1)
  └── Concept Artist (1)

OPERATIONS (reports to Game Director)
  ├── Community Lead (1)
  ├── Community Managers (2)
  ├── Senior Moderators (4) ← volunteer/contract
  └── Support Lead (1)
      └── Support Agents (3) ← part-time / contract

QA (reports to Technical Director)
  └── QA Lead (1)
      └── QA Engineers (2)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total core team: ~25 people (mix of full-time, part-time, contract)
```

## 19.2 Role Definitions

### Game Director
**Primary responsibility:** Game vision, player experience, final decisions on all content and operations.
**Key powers:** Veto any content, approve any major change, public face of the game.
**On-call:** Always accessible during P1 incidents, mandatory for DR Level 2+.

### Technical Director
**Primary responsibility:** Architecture integrity, engineering team leadership, all production systems.
**Key powers:** Emergency Lock Mode authority, DR Level 2+ declaration authority, secret rotation approval.
**On-call:** Mandatory for P1 incidents, available for P2 escalation.

### Lead Backend Engineer
**Primary responsibility:** Core game systems implementation (battle engine, economy, Discord bot).
**Key powers:** Architecture decisions within scope, PR approval, hotfix execution.
**On-call:** Participates in engineering on-call rotation.

### Backend Engineers
**Primary responsibility:** Feature implementation across bot, API, and worker services.
**Key powers:** PR approval (cannot self-merge), staging deployments.
**On-call:** Engineering on-call rotation.

### Database Engineer
**Primary responsibility:** MongoDB schema, Redis configuration, query optimization, backup management, migrations.
**Key powers:** Schema migration approval, DR Level 1 restoration execution.

### DevOps / SRE
**Primary responsibility:** Kubernetes cluster, CI/CD pipeline, monitoring/alerting, deployment tooling.
**Key powers:** Production deployments, rollbacks, scaling operations.
**On-call:** Primary on-call for infrastructure issues.

### Lead Game Designer
**Primary responsibility:** Game balance, feature design documents, patch note authorship.
**Key powers:** Balance change approval (within limits — see Section 9.8).

### Systems Designers
**Primary responsibility:** Combat system, economy system, progression system design and iteration.

### Economy Analyst
**Primary responsibility:** Economy monitoring, balance analysis, marketplace health, inflation control.
**Key powers:** Economy Lock recommendation (Technical Director executes), drop rate change approval.

### QA Lead
**Primary responsibility:** Test planning, QA team management, release sign-off.
**Key powers:** Release block (can hold a release from production deployment pending QA resolution).

### QA Engineers
**Primary responsibility:** Functional testing, regression testing, bug documentation.

### Community Lead
**Primary responsibility:** Community strategy, moderation team management, content creator program, events.
**Key powers:** Incident communications lead, moderation policy authority.

### Community Managers
**Primary responsibility:** Day-to-day Discord management, player interaction, event coordination.

### Support Lead
**Primary responsibility:** Support ticket system, agent training, escalation handling, refund policy.

### Support Agents
**Primary responsibility:** Front-line ticket resolution, player communication.

## 19.3 On-Call Rotation

**Engineering On-Call:**
- Primary on-call: 1 engineer per week
- Secondary on-call: 1 engineer per week (backup pager)
- On-call hours: 24/7 for P1/P2, business hours response for P3/P4
- On-call engineers receive compensatory time off after intensive incident weeks

**Community On-Call:**
- Community on-call: 1 community manager + 1 senior moderator per day
- Primary purpose: P1 player communication during incidents

**Escalation Chain:**
1. On-call Engineer
2. Technical Director
3. Game Director
4. (External: Legal/PR for breach scenarios)

## 19.4 Hiring Roadmap

**Year 1 (Post-Launch, growth-dependent):**
- Additional Backend Engineer (as DAU scales)
- Additional Community Manager (as server size scales)
- Additional Support Agent (as ticket volume scales)
- Part-time Animator (as asset demand grows)

**Year 2:**
- Dedicated Security Engineer (as attack surface grows)
- Data Analyst (own the analytics pipeline)
- Producer / Project Manager (coordinate growing team)
- Platform Engineer (public API, creator tools)

---

# 20 — FINAL PRE-LAUNCH CHECKLIST

This is the single authoritative list for production readiness. No launch occurs unless every item is checked. The Technical Director, Game Director, and QA Lead each sign off on this document before the launch window opens.

## 20.1 Documentation

```
□ Book 1 (Game Developer Bible) — final and reviewed
□ Book 2 (Content Bible) — final and reviewed
□ Book 3 (Technical Architecture Bible) — final and reviewed
□ Book 4 (Operations Bible) — final and reviewed (this document)
□ docs/Runbook.md — complete and rehearsed
□ docs/Security-Policy.md — final and approved by Technical Director
□ docs/Monitoring-Checklist.md — complete and configured
□ docs/Release-Checklist.md — complete and rehearsed
□ docs/Disaster-Recovery-Plan.md — complete and tested
□ docs/Database-Schema.md — matches production schema exactly
□ docs/API-Specification.md — matches production API exactly
□ Patch notes for v1.0.0 — written and approved
□ Player onboarding guide — written and in support Discord
□ FAQ document — written and in support Discord
□ Moderation policy — written and in support Discord
```

## 20.2 Infrastructure

```
□ Kubernetes cluster provisioned in all target regions (us-east, us-west, eu-west, ap-southeast)
□ All node pools sized correctly for expected launch load
□ MongoDB Atlas cluster: M60+, 3-node replica set, global cluster configured
□ Redis cluster: 6-node, 3 primaries, 3 replicas, configured and health-checked
□ CDN: all game assets uploaded, globally replicated, accessibility verified
□ CI/CD pipeline: all environments (dev → test → staging → canary → prod) verified end-to-end
□ Secrets: all production secrets stored in Vault, injected correctly, never in code
□ Network: VPC configured, firewalls in place, only required ports open
□ TLS: all services using valid certificates, auto-renewal configured
□ DNS: all domains pointing to correct endpoints, TTL configured
□ Load balancer: health checks configured for all services
□ Autoscaling: HPA and cluster autoscaler configured and tested
```

## 20.3 Security

```
□ Penetration test completed (last 90 days)
□ Dependency audit: no high or critical vulnerabilities (npm audit)
□ SAST scan: no critical or high findings unresolved
□ Secret scan: confirmed no secrets in git history or code
□ All admin accounts have MFA enabled
□ All production access logs to audit trail
□ Rate limiting configured on all public-facing APIs and bot commands
□ Discord token scope review: bot uses only required intents
□ CORS configured correctly for Admin API (deny all non-internal origins)
□ Input validation: Zod schemas on all user-provided data
□ SQL injection: N/A (MongoDB), but NoSQL injection prevention reviewed
□ Audit log: verified writing correctly for all sensitive operations
□ Emergency Lock Mode: tested and verified working
□ All SOPs from Section 5 (Incident Response) rehearsed by team
```

## 20.4 Testing

```
□ All unit tests passing (100%)
□ All integration tests passing (100%)
□ All end-to-end tests passing (full playthrough from new player to Level 50+)
□ Performance test at 2× expected peak load: all metrics within targets
□ Stress test (burst): system remains stable, no data loss
□ Soak test (1 hour at sustained load): no memory leaks, no error rate drift
□ Battle rendering: verified for all 50 classes (sample matrix testing)
□ Economy simulation: launch economy state simulated and approved by Economy Analyst
□ Disaster recovery drill completed: DR Level 1 and Level 2 scenarios executed
□ Rollback tested: rollback from canary to stable verified < 5 minutes
□ Blue/green deployment tested end-to-end
□ Feature flags: all launch flags tested in staging
□ Regression suite: full regression passed on release candidate build
□ QA sign-off: QA Lead signature on this document
```

## 20.5 Performance

```
□ P95 command response time < 800 ms under normal load
□ P95 battle render time < 15 seconds under normal load
□ P95 Admin API response time < 500 ms under normal load
□ MongoDB query P95 < 50 ms for all critical queries
□ Redis operation P95 < 5 ms
□ No N+1 query patterns in command handlers (explain plan reviewed)
□ Memory usage per pod < 80% of limit under normal load
□ CPU usage per pod < 70% of limit under normal load
□ Bot pod startup time < 30 seconds (READY event)
□ Render worker startup time < 60 seconds
```

## 20.6 Scaling

```
□ HPA configured for all scalable services
□ Cluster autoscaler configured
□ Load test verified autoscaling triggers at correct thresholds
□ Autoscaling confirmed not to over-scale (cost check)
□ Redis cluster shard sizing verified for launch player projections
□ MongoDB Atlas cluster can handle projected write load
□ Discord shard count correct for projected guild count + 30% headroom
□ CDN caching configured for asset delivery at scale
□ BullMQ worker concurrency tuned for target job throughput
```

## 20.7 Economy

```
□ All starting Gold balances verified (new player gets correct starting Gold)
□ All drop tables reviewed and approved by Economy Analyst
□ All currency sink costs reviewed and approved
□ Marketplace launch state (initial listings seeded? Or blank?)
□ Economy simulation: first 30 days projected, no runaway inflation
□ Battle Pass pricing (Stardust) reviewed and approved
□ No pay-to-win items in any shop (audit complete)
□ Economy monitoring dashboards live and alerting correctly
□ Economy Analyst briefed on all launch content and expected player behavior
□ Daily economy report schedule confirmed (06:00 UTC)
```

## 20.8 Community

```
□ Support Discord fully set up (all channels, all roles, all bots)
□ Moderation team trained and briefed on launch content
□ Support team trained and staffed for launch week
□ Community Lead available during launch week (no PTO)
□ Content calendar for first 4 weeks confirmed and content ready
□ Launch announcement ready (scheduled)
□ Press kit prepared (screenshots, description, logo, contact)
□ Partner Discord list confirmed (outreach complete)
□ Content creator outreach complete (early access invites sent)
□ FAQ document live in support Discord
□ Onboarding guide live in support Discord
□ Bot description, invite page, and status page all live
```

## 20.9 Deployment

```
□ Release candidate (v1.0.0-rc.1) deployed to staging — health check: PASS
□ All staging synthetic monitors: PASS
□ Blue/green environments verified
□ Canary routing verified
□ All feature flags for v1.0.0 in correct initial state
□ Database migration scripts: up scripts tested, down scripts tested
□ Rollback procedure rehearsed (time: < 5 minutes confirmed)
□ Launch maintenance window scheduled (low-traffic UTC time)
□ On-call engineer confirmed for launch day
□ Technical Director on standby for launch day
□ Game Director on standby for launch day
□ Post-launch monitoring window: 72 hours heightened vigilance confirmed
```

## 20.10 Marketing

```
□ Launch announcement ready for all channels
□ Social media accounts (Twitter/X, Reddit) active and monitored
□ Server listing submissions (top.gg, discord.bots.gg) ready
□ Content creator embargo lift timed with launch
□ Referral/invite rewards ready (if applicable at launch)
□ Press outreach completed (gaming Discord-focused outlets)
```

## 20.11 Launch Day Protocol

```
LAUNCH DAY TIMELINE (times in UTC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
T−12:00  Code freeze: no deployments
T−06:00  Final staging health check
T−02:00  All team leads confirm ready-to-launch
T−01:00  Final go/no-go call: Game Director + Technical Director
T−00:30  Launch thread opens in #operations
T−00:05  Final synthetic monitor check: all GREEN required

T+00:00  LAUNCH BEGINS
  □ Maintenance window opens
  □ Bot maintenance mode: ON
  □ v1.0.0 deployed (blue/green)
  □ Canary traffic: 5%
  □ Canary soak: 30 minutes

T+00:30  Canary check: all metrics within targets?
  YES → Promote to 100%
  NO  → Hold or rollback (Technical Director decision)

T+01:00  Full traffic on v1.0.0
  □ Bot maintenance mode: OFF
  □ All synthetic monitors: PASS
  □ First player commands monitored manually

T+01:01  LAUNCH ANNOUNCED
  □ Community announcement posted
  □ Social media announcement posted
  □ Partner Discord announcements posted
  □ Content embargo lifted for creators

T+02:00  First hour post-launch health check (all team leads)

T+08:00  First day status report (all team leads to Game Director)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 20.12 Post-Launch Week 1

```
WEEK 1 OPERATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Day 1 (Launch Day)
  □ Heightened monitoring: SRE reviewing dashboards every 30 minutes
  □ Community managers active in Discord 20 hours (rotating shifts)
  □ Economy Analyst: real-time economy monitoring all day
  □ Support Lead: managing ticket triage, not tickets (agents handle)

Day 2
  □ First post-launch report drafted (D1 retention, DAU, error rate, economy)
  □ Bug triage: all Day 1 bug reports reviewed and prioritized
  □ Community check-in: top feedback themes identified

Day 3
  □ Hotfix decision point: any bugs requiring urgent patch?
  □ Economy 48-hour check: inflation indicators?

Day 5
  □ First weekly KPI report (partial week)
  □ Community pulse: player sentiment check

Day 7
  □ Week 1 retrospective (internal, all team leads)
  □ Week 1 player update: "State of Aethon — Week 1" published
  □ Plan confirmed for Week 2 content drop (first event)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 20.13 Post-Launch Month 1

```
MONTH 1 OPERATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Week 2 (Days 8–14)
  □ First live event deployed (Double XP or mini-event)
  □ First balance patch (based on live data from Week 1)
  □ Community survey #1 sent

Week 3 (Days 15–21)
  □ First major player milestone celebrated (e.g., 1 million battles)
  □ Survey results reviewed, top feedback addressed in dev Q&A
  □ Month 1 economy review (early, informal)

Week 4 (Days 22–28)
  □ Month 1 KPI report compiled and reviewed
  □ Month 1 economy review (formal)
  □ Season 1 roadmap published (if not already)
  □ Referral program evaluation: working as intended?

Month-End
  □ Month 1 all-hands review: what worked, what didn't
  □ Formal D30 retention report
  □ Economy health: 30-day report published internally
  □ Support: 30-day ticket analysis
  □ QA: 30-day bug report analysis
  □ Roadmap adjustment based on player behavior data
  □ Formal "State of Aethon — Month 1" published to community
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

# APPENDIX A — TERMINOLOGY CROSS-REFERENCE

This appendix ensures terminology consistency across all four Books.

| Term | Definition | Book 1 Ref | Book 2 Ref | Book 3 Ref | Book 4 Ref |
|------|-----------|-----------|-----------|-----------|-----------|
| Ascendance Energy (AE) | Fundamental force of Aethon | §1.1 | §2.1 | — | §1.1 |
| Aethon | The game world | §1.1 | Throughout | — | Throughout |
| Power Rating (PR) | Combat effectiveness composite score | §4.2 | — | — | §9.6, §10.5 |
| ULID | Universally Unique Lexicographically Sortable Identifier | — | — | §3.1 | §7.5 |
| Gold (⚙️) | Primary everyday currency | §5.1 | §3.2 | — | §8.1 |
| Crystals (💎) | Mid-tier gameplay currency | §5.1 | §3.2 | — | §8.1 |
| Stardust (✨) | Premium currency, cosmetics only | §5.1 | §3.2 | — | §8.1, §10.4 |
| Ascension Rite | Prestige mechanic at Level 100 | §3.3 | — | — | §10.5 |
| Cinematic Battle System | GIF/MP4 battle animation | §15.1 | — | §6.2 | §5.7, §14.3 |
| Redlock | Distributed locking algorithm | — | — | §4.3 | §3.4, §5.5 |
| The Fracture | Planetary collapse 90,000 years ago | §1.3 | §1.1 | — | §18.2 |
| Resonance System | 5-stage transformation system | §13.1 | §4.1 | — | §9.5 |
| Compact of the Six | Ancient treaty between Weavers | §2.1 | §1.2 | — | — |

---

# APPENDIX B — FEATURE FLAG QUICK REFERENCE

| Flag | Effect | Activate When |
|------|--------|--------------|
| `emergency_lock` | ALL features disabled | DR Level 2+, security breach |
| `economy_lock` | All economy writes disabled | Economy exploit |
| `marketplace_freeze` | Marketplace writes disabled | Marketplace bug |
| `redis_degraded_mode` | Redis bypassed (DB fallback) | Redis outage |
| `text_only_battles` | No render, text results | Renderer failure |
| `maintenance_mode` | All commands → maintenance message | Planned/unplanned maintenance |
| `double_xp_weekend` | 2× XP multiplier | Scheduled event |

---

# APPENDIX C — ESCALATION CONTACT MATRIX

| Scenario | Primary Contact | Secondary | When to Escalate |
|---------|----------------|-----------|-----------------|
| Production bug | On-call Engineer | Technical Director | P2+ or if unsure |
| Bot outage | On-call Engineer | Technical Director | Immediately |
| Database issue | On-call Engineer + Database Engineer | Technical Director | Any DB error in prod |
| Security breach | Technical Director | Game Director | Confirmed breach |
| Economy exploit | Economy Analyst + Technical Director | Game Director | Immediately |
| Community crisis | Community Lead | Game Director | PR risk or legal risk |
| Legal question | Game Director | External counsel | Any legal situation |

---

*End of Book 4 — Operations & Live-Service Bible*
*Document maintained by: Technical Director, Game Director*
*Next review date: Before Season 1 Launch*
*Version: 1.0.0*
