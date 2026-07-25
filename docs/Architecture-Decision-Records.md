# ASCENSION LEGENDS — Architecture Decision Records (ADR)

> This document records significant architectural decisions made for the ASCENSION LEGENDS project. Each ADR captures the context, the decision, the rationale, and the consequences. ADRs are numbered sequentially and are never deleted — superseded records are marked as such.

---

## Table of Contents

- [ADR-001 — Monorepo with pnpm Workspaces and Turborepo](#adr-001--monorepo-with-pnpm-workspaces-and-turborepo)
- [ADR-002 — discord.js v14 as the Sole Bot Framework](#adr-002--discordjs-v14-as-the-sole-bot-framework)
- [ADR-003 — MongoDB as Primary Database](#adr-003--mongodb-as-primary-database)
- [ADR-004 — Redis for Caching and Distributed Locking](#adr-004--redis-for-caching-and-distributed-locking)
- [ADR-005 — BullMQ for Background Job Processing](#adr-005--bullmq-for-background-job-processing)
- [ADR-006 — node-canvas for Server-Side Rendering](#adr-006--node-canvas-for-server-side-rendering)
- [ADR-007 — Deterministic Battle Engine with Seeded RNG](#adr-007--deterministic-battle-engine-with-seeded-rng)
- [ADR-008 — Service Ownership Model](#adr-008--service-ownership-model)
- [ADR-009 — Slash Commands Only (No Message Commands)](#adr-009--slash-commands-only-no-message-commands)
- [ADR-010 — Write-Through Cache for Economy Data](#adr-010--write-through-cache-for-economy-data)
- [ADR-011 — Render Engine as Isolated Microservice](#adr-011--render-engine-as-isolated-microservice)
- [ADR-012 — GIF as Default Battle Animation Format](#adr-012--gif-as-default-battle-animation-format)
- [ADR-013 — Redlock Algorithm for Distributed Locks](#adr-013--redlock-algorithm-for-distributed-locks)
- [ADR-014 — TypeScript Strict Mode Across All Packages](#adr-014--typescript-strict-mode-across-all-packages)
- [ADR-015 — Conventional Commits and Semantic Versioning](#adr-015--conventional-commits-and-semantic-versioning)
- [ADR-016 — OpenTelemetry for Distributed Tracing](#adr-016--opentelemetry-for-distributed-tracing)
- [ADR-017 — Pino for Structured Logging](#adr-017--pino-for-structured-logging)
- [ADR-018 — Character Stat Snapshot at Battle Start](#adr-018--character-stat-snapshot-at-battle-start)
- [ADR-019 — MongoDB Soft Deletes](#adr-019--mongodb-soft-deletes)
- [ADR-020 — Integer Representation for All Currency Values](#adr-020--integer-representation-for-all-currency-values)
- [ADR-021 — Kubernetes for Production Orchestration](#adr-021--kubernetes-for-production-orchestration)
- [ADR-022 — Prometheus + Grafana for Observability](#adr-022--prometheus--grafana-for-observability)
- [ADR-023 — Event-Driven Cache Invalidation](#adr-023--event-driven-cache-invalidation)
- [ADR-024 — Per-Service MongoDB Collection Ownership](#adr-024--per-service-mongodb-collection-ownership)
- [ADR-025 — Zod for Runtime Input Validation](#adr-025--zod-for-runtime-input-validation)

---

## ADR-001 — Monorepo with pnpm Workspaces and Turborepo

**Status:** Accepted  
**Date:** Project inception  
**Authors:** Architecture team  

### Context

ASCENSION LEGENDS consists of multiple runnable units (bot, admin API, workers, renderer) and shared libraries (engine, services, database models, cache utilities). We need a codebase structure that:
- Allows shared code without duplication
- Enables independent deployment of services
- Supports parallel builds
- Maintains clear dependency boundaries

Options considered:
1. Separate repositories per service (polyrepo)
2. Single repository with manual symlinking
3. Monorepo with pnpm workspaces + Turborepo

### Decision

Use a **pnpm workspace monorepo** with **Turborepo** for build orchestration.

### Rationale

- `pnpm` provides efficient disk usage via content-addressable storage (deduplicates packages across workspaces).
- Turborepo provides incremental builds with caching — only rebuilds packages that changed.
- Shared packages (`engine`, `database`, `services`) can be imported with workspace protocol (`@workspace/engine`) without publishing to npm.
- Atomic changes across multiple packages in a single PR.
- Polyrepo would require careful versioning and publishing discipline for every shared library change — too much overhead for a small team.

### Consequences

**Positive:**
- Single `git blame` and unified PR history.
- Shared TypeScript configuration via `tsconfig.base.json`.
- CI runs all affected packages when a shared package changes.
- Developer experience: change `packages/engine`, immediately see effects in `apps/bot`.

**Negative:**
- Larger repository clone size.
- Build system adds complexity (Turborepo config must be maintained).
- Git history grows faster.

**Mitigation:**
- Turborepo remote caching (cloud) reduces CI build times.
- Clear package boundaries prevent accidental coupling.

---

## ADR-002 — discord.js v14 as the Sole Bot Framework

**Status:** Accepted  
**Date:** Project inception  

### Context

Multiple Discord bot frameworks exist for Node.js:
- `discord.js` (v14) — official community library, most popular, full feature coverage
- `Oceanic.js` — lighter weight alternative
- `Eris` — older, battle-tested
- Direct Discord API calls via `undici` — maximum control
- `Sapphire Framework` — opinionated framework built on discord.js

### Decision

Use **discord.js v14** directly (without an opinionated framework wrapper like Sapphire).

### Rationale

- discord.js v14 has the most complete coverage of Discord's API surface.
- Largest community, most tutorials, most compatible libraries.
- v14 specifically supports the modern Interaction API (slash commands, components, modals) that ASCENSION LEGENDS requires.
- Avoiding framework wrappers (Sapphire) keeps us closer to the Discord API and avoids framework-specific abstractions that can be restrictive or add latency.
- The project's own command registry and middleware system provides the structure benefits of a framework without its constraints.

### Consequences

**Positive:**
- Full control over bot architecture.
- Can upgrade discord.js independently without framework dependency.
- Team learns transferable discord.js knowledge.

**Negative:**
- Must build own command routing, middleware, and component registry infrastructure.
- More boilerplate than Sapphire.

---

## ADR-003 — MongoDB as Primary Database

**Status:** Accepted  
**Date:** Project inception  

### Context

Game data for an MMORPG is highly varied and evolves rapidly. Requirements:
- Flexible schema (character builds, skill trees, item stats can vary greatly by class)
- Horizontal scaling for read replicas
- Aggregation capability for analytics and leaderboards
- Good Node.js driver ecosystem
- Rapid schema evolution during development

Options considered:
1. PostgreSQL — relational, strict schema, ACID
2. MongoDB — document-oriented, flexible schema
3. PostgreSQL + JSONB — hybrid approach
4. DynamoDB — managed NoSQL, AWS-specific

### Decision

Use **MongoDB 7.x** as the primary database.

### Rationale

- MMORPG entity structures (characters, inventory items, boss phases, quest objectives) are naturally document-shaped and vary significantly between instances.
- Schema flexibility enables rapid iteration without migrations during development.
- Aggregation pipeline is powerful enough for leaderboard computation, analytics, and complex queries.
- Mongoose (ODM) provides validation, middleware, and TypeScript typing with manageable overhead.
- MongoDB Atlas provides managed hosting with automated backups, global clusters, and monitoring.
- The team has MongoDB expertise.

### Consequences

**Positive:**
- Rapid schema iteration during development.
- Natural fit for game entity data.
- Aggregation pipelines for analytics.

**Negative:**
- No native multi-document ACID transactions (use sparingly via sessions).
- Schema flexibility requires discipline — validation enforced at application layer.
- Cannot do cross-collection joins as efficiently as relational databases.

**Mitigation:**
- Zod schemas validate all data before write.
- Economy operations use distributed Redis locks rather than DB transactions.
- Denormalization strategy documented to avoid complex joins.

---

## ADR-004 — Redis for Caching and Distributed Locking

**Status:** Accepted  
**Date:** Project inception  

### Context

The bot must respond to Discord interactions within 3 seconds (Discord's timeout). MongoDB queries can occasionally take 50–200ms. Under high load, many interactions read the same character data concurrently. Additionally, economy operations require atomicity across a distributed bot fleet.

### Decision

Use **Redis 7.x** for:
1. Application-level caching (character data, catalog data)
2. Distributed locking (economy operations)
3. Leaderboard storage (sorted sets)
4. Rate limiting (token bucket)
5. Session state (pending interactions)

### Rationale

- Sub-millisecond operation latency eliminates MongoDB read overhead on hot paths.
- Redis Sorted Sets provide native O(log N) leaderboard operations.
- Redis atomic Lua scripts enable correct token bucket rate limiting.
- Redlock algorithm (built on Redis) provides reliable distributed locking without a dedicated service.
- BullMQ (the job queue) is built on Redis — one infrastructure piece serves multiple roles.

### Consequences

**Positive:**
- Bot response times consistently under 200ms on cached paths.
- Economy operations safe across multiple bot shards.
- Leaderboards always fast regardless of player count.

**Negative:**
- Redis becomes a critical dependency — its failure impacts the entire system.
- Cache invalidation logic adds code complexity.
- Redis memory must be monitored and sized appropriately.

**Mitigation:**
- Redis Cluster (3 masters, 3 replicas) — no single point of failure.
- MongoDB is always the source of truth — Redis failure degrades performance but not correctness.
- Memory alerts at 70% utilization.

---

## ADR-005 — BullMQ for Background Job Processing

**Status:** Accepted  
**Date:** Project inception  

### Context

Several game operations must happen asynchronously:
- Battle animation rendering (3–30 seconds)
- Notifications (Discord API calls)
- Analytics event writing
- Economy compensation replays
- Scheduled resets (daily, weekly, season)

These cannot block the Discord interaction response path.

Options:
1. Node.js `setTimeout`/`setInterval` — not persistent, lost on restart
2. Custom cron + in-memory queue — not distributed
3. BullMQ (Redis-backed) — persistent, distributed, rich lifecycle
4. AWS SQS / RabbitMQ — external service dependency

### Decision

Use **BullMQ** for all background job processing.

### Rationale

- BullMQ is built on Redis, which we already use — no additional infrastructure.
- Persistent jobs survive process restarts.
- Rich job lifecycle (delay, retry, backoff, dead letter queue).
- Concurrency control per queue.
- Built-in rate limiting per queue.
- Bull Board provides a visual job monitor.
- Active maintenance and strong TypeScript types.

### Consequences

**Positive:**
- Jobs survive bot restarts.
- Controlled concurrency for CPU-bound render jobs.
- Dead letter queue for investigating failed jobs.
- Visual monitoring via Bull Board.

**Negative:**
- Redis must be available for job processing.
- BullMQ upgrade path must be managed carefully.

---

## ADR-006 — node-canvas for Server-Side Rendering

**Status:** Accepted  
**Date:** Design phase  

### Context

ASCENSION LEGENDS requires animated battle visualizations delivered as GIF/MP4 files. Discord cannot execute JavaScript — all rendering must happen server-side. Options:
1. **node-canvas** — Cairo-backed Canvas2D in Node.js
2. **Puppeteer/Playwright** — Headless browser, render HTML/CSS
3. **sharp** only — Image composition, no animation
4. **External service** — Send render requests to a third-party rendering API
5. **Python + Pillow** — Separate Python service

### Decision

Use **node-canvas** (Cairo-backed Canvas2D API) for frame rendering, with **sharp** for image optimization and **ffmpeg** for MP4 encoding.

### Rationale

- node-canvas provides the same Canvas2D API as browser `<canvas>` — familiar, well-documented, battle-tested.
- Cairo (the underlying C library) produces high-quality anti-aliased output.
- node-canvas is the standard choice for Discord bot battle animations in the community.
- Puppeteer would require a full Chromium installation (~150MB), is slower, and more resource-intensive.
- Keeping rendering in Node.js avoids a cross-language service boundary.
- ffmpeg is the industry standard for video encoding and offers excellent quality and compression.

### Consequences

**Positive:**
- Familiar Canvas2D API.
- High-quality output.
- Full control over rendering pipeline.
- Stays within Node.js ecosystem.

**Negative:**
- node-canvas requires native compilation (Cairo, Pango system libraries).
- Renderer container must use Debian (not Alpine) for library availability — larger image.
- Cairo-based rendering is single-threaded per context — use worker threads for parallelism.

**Mitigation:**
- Dedicated renderer Dockerfile with all required system libraries.
- Worker thread pool for parallel rendering.
- Asset preloading to minimize I/O during render.

---

## ADR-007 — Deterministic Battle Engine with Seeded RNG

**Status:** Accepted  
**Date:** Design phase  

### Context

The battle engine must:
1. Produce consistent, fair results that players trust.
2. Support replay and re-simulation for anti-cheat auditing.
3. Be reproducible for debugging (reproduce exact battle conditions).
4. Handle simultaneous battles across multiple bot processes without seed conflicts.

### Decision

The battle engine uses a **seeded pseudo-random number generator (PRNG)**, specifically **Xorshift128**, seeded from a hash of `battleId + sorted(participantIds)`. The engine is a pure function — no I/O, no external state.

### Rationale

- Same seed + same inputs = identical output, always. This enables:
  - Anti-cheat: Re-simulate any battle and compare to stored result.
  - Replay: Render animations from stored replay data.
  - Debugging: Reproduce any reported bug deterministically.
- Xorshift128 is fast, has good statistical properties, and is trivially seedable.
- Pure function design (no I/O) makes the engine independently testable and prevents database call overhead during simulation.
- Seeds derived from battleId guarantee uniqueness across all concurrent battles.

### Consequences

**Positive:**
- Anti-cheat capability: any battle result can be independently verified.
- Perfect replay fidelity.
- Engine unit tests are completely deterministic (no flaky tests).
- Engine can be run client-side in the future for preview/simulation features.

**Negative:**
- Engine cannot call external services (database, API) — all data must be passed in as snapshots.
- RNG sequence must never be broken (changing the order of RNG calls in the engine changes all outcomes — a "balance change" with unexpected scope).

**Mitigation:**
- Engine has dedicated unit tests that lock RNG call sequences.
- Golden file tests detect any unintended changes to battle outcomes.
- Engine versioned; stored battle records include engine version for compatible re-simulation.

---

## ADR-008 — Service Ownership Model

**Status:** Accepted  
**Date:** Design phase  

### Context

The project has ~20 MongoDB collections and ~20 services. Without clear ownership rules, developers will take shortcuts (direct cross-collection queries, shared mutation paths) that create hidden coupling, race conditions, and difficult-to-debug bugs.

### Decision

Each MongoDB collection has exactly **one owning service**. Only that service reads from or writes to that collection directly. All other services access the data exclusively through the owning service's public method interface.

### Rationale

- Enforces a clean service boundary architecture.
- Prevents distributed coupling — changing a collection schema only requires updating one service.
- Makes it easy to add caching, validation, and locking in one place (the owning service).
- Enables the owning service to be replaced (e.g., different DB backend) without affecting callers.

### Consequences

**Positive:**
- Clean architecture that scales as the team grows.
- Bug fixes in one service don't require auditing all services.
- Service-level caching is reliable (only one writer).

**Negative:**
- Sometimes requires additional service calls instead of a direct join query.
- May introduce latency for operations that span multiple collections.

**Mitigation:**
- Denormalization strategy: frequently read fields are stored denormalized (e.g., `discordId` on inventory documents) to avoid service calls for common lookups.
- Bulk operation patterns documented for high-performance cross-service queries.

---

## ADR-009 — Slash Commands Only (No Message Commands)

**Status:** Accepted  
**Date:** Design phase  

### Context

Discord deprecated message commands (prefix-based commands like `!battle`) in April 2022 and restricted them for verified bots. Slash commands (`/battle`) are the official, supported interaction model.

### Decision

All player-facing commands use **Discord Slash Commands** exclusively. No prefix-based message commands are implemented.

### Rationale

- Discord's own deprecation path for message commands.
- Slash commands have built-in autocomplete, option type validation, and permission management.
- Slash commands are discoverable (Discord shows available commands in the UI).
- `MessageContent` privileged intent is not required, reducing security surface.
- Context menus extend the command surface for power users without prefix commands.

### Consequences

**Positive:**
- No need for `MessageContent` privileged intent.
- Players discover commands through Discord's built-in help.
- Input validation at the Discord protocol level (option types).

**Negative:**
- Global slash command registration can take up to 1 hour to propagate.
- Guild-specific commands must be used during development for instant registration.

---

## ADR-010 — Write-Through Cache for Economy Data

**Status:** Accepted  
**Date:** Design phase  

### Context

Economy (gold/gems balances) is read very frequently (every shop interaction, trade check, battle reward) but must never have stale reads that cause overdrafts. Two caching strategies were considered:
1. **Cache-aside**: Read from cache; miss → read MongoDB; write to cache. On write: update MongoDB, invalidate cache.
2. **Write-through**: On write: update MongoDB AND update cache atomically (under distributed lock).

### Decision

Economy balance data uses **write-through caching**: the distributed lock is held across both the MongoDB write and the Redis cache update, ensuring cache is always consistent with the database.

### Rationale

- Economy operations are the most security-critical in the game — balance inconsistencies have real-world impact.
- Write-through eliminates the race condition window where cache is stale after a MongoDB write.
- With the distributed lock, only one writer can update a user's balance at a time anyway — the cache update adds negligible overhead.
- Reduces MongoDB read load (balance reads always hit cache).

### Consequences

**Positive:**
- Economy cache is always consistent with MongoDB.
- No overdraft risk from stale cache reads.

**Negative:**
- Economy operations are slightly slower (write to both MongoDB and Redis in the same lock).
- Lock contention is the bottleneck, not I/O.

**Mitigation:**
- Lock TTL is short (5 seconds) — contention window is minimal.
- Lock contention is monitored via Prometheus.

---

## ADR-011 — Render Engine as Isolated Microservice

**Status:** Accepted  
**Date:** Design phase  

### Context

Rendering battle animations (node-canvas + ffmpeg) is CPU and memory intensive. Running it in the main bot process would block the Node.js event loop and cause Discord interaction timeouts.

### Decision

The render engine runs in **dedicated worker processes** (Node.js worker threads within a separate `renderer` container), accessed via BullMQ job queue.

### Rationale

- Worker threads execute in a separate V8 context and do not block the main bot event loop.
- CPU-intensive operations (canvas drawing, GIF encoding) are isolated from the latency-sensitive bot interaction path.
- Worker pool can be scaled independently from the bot (more render workers during peak battle hours).
- BullMQ queue provides backpressure — if render workers are busy, jobs queue rather than crashing the bot.

### Consequences

**Positive:**
- Bot interaction latency is completely isolated from render performance.
- Render workers can be horizontally scaled independently.
- Render failures don't crash the bot.

**Negative:**
- Battle result is delivered in two phases: text response immediately, animation as a follow-up.
- Adds BullMQ complexity and cross-process communication.

**Mitigation:**
- Fast text response with "Animation rendering..." message on immediate reply.
- Follow-up message with animation posted to the same channel when render completes.
- Timeout handling: if render exceeds 60 seconds, post text-only battle summary.

---

## ADR-012 — GIF as Default Battle Animation Format

**Status:** Accepted  
**Date:** Design phase  

### Context

Discord embeds can display GIF, PNG, and video files. For battle animations, the primary format must:
1. Be natively displayed inline in Discord (no download required).
2. Be reasonably small (under Discord's 8MB free attachment limit).
3. Loop automatically.

Options:
1. **GIF** — universally supported inline in Discord, loops, limited to 256 colors, can be large.
2. **MP4** — better quality, smaller size, Discord shows a video player but it's slightly less seamless.
3. **WebP animated** — better quality/size than GIF, limited Discord support.
4. **PNG sprite sheet** — static, no animation.

### Decision

**GIF** is the default for all users. **MP4** is available as a premium feature.

### Rationale

- GIFs display inline in Discord with no click required — crucial for casual player engagement.
- GIF looping is native and automatic.
- 8MB is sufficient for a 10–20 second 800×450 battle at 12fps with 256-color dithering.
- MP4 offers dramatically better quality and smaller size but requires a click-to-play interaction in Discord — premium players who care about quality will accept this.
- WebP animated has inconsistent Discord support and is excluded.

### Consequences

**Positive:**
- Frictionless battle experience for all players (GIF just plays).
- Premium upsell: MP4 is a concrete differentiator.

**Negative:**
- GIF color limitation (256 colors) requires good dithering to look acceptable.
- GIF file sizes can be larger than MP4 for the same visual quality.

**Mitigation:**
- Color palette optimization per frame.
- Frame differencing (delta encoding) to reduce GIF size.
- Quality downscaling (640×360) if 800×450 exceeds 8MB.

---

## ADR-013 — Redlock Algorithm for Distributed Locks

**Status:** Accepted  
**Date:** Design phase  

### Context

Economy operations must be atomic across a distributed fleet of bot shards. Multiple shard processes may attempt to modify the same user's balance simultaneously.

Options:
1. **MongoDB transactions** — ACID, but adds latency and MongoDB cluster dependency for lock coordination.
2. **Single Redis node SETNX** — Simple, but single point of failure.
3. **Redlock** — Distributed lock across N Redis nodes (quorum-based).
4. **Etcd or Zookeeper** — Dedicated distributed coordination service.

### Decision

Use the **Redlock algorithm** via the `redlock` npm package, running against the Redis cluster.

### Rationale

- Redlock is designed specifically for Redis-based distributed locking with N nodes.
- Quorum-based: a lock is acquired only when ⌊N/2⌋+1 Redis nodes grant it — survives single node failures.
- We already have Redis — no additional service.
- The `redlock` package is well-maintained and has extensive documentation.
- Lock TTLs are short (2–10 seconds) — if a process dies holding a lock, it auto-expires quickly.

### Consequences

**Positive:**
- Reliable distributed locking using existing Redis infrastructure.
- Survives Redis node failures (quorum model).
- Short TTLs prevent deadlocks.

**Negative:**
- Redlock has known theoretical failure modes in edge cases (Martin Kleppmann critique). These are acceptable for a game application where occasional retry is acceptable.
- Lock contention adds latency to economy operations.

**Mitigation:**
- Monitor lock contention via Prometheus.
- Exponential backoff on lock acquisition failure.
- Economy operations designed to be idempotent where possible.

---

## ADR-014 — TypeScript Strict Mode Across All Packages

**Status:** Accepted  
**Date:** Project inception  

### Context

The codebase will be worked on by multiple developers over years. Type safety reduces the probability of runtime errors in production.

### Decision

All packages use TypeScript with `"strict": true` in `tsconfig.json`. No `any` types without explicit justification comment.

### Rationale

- Strict mode catches: null pointer errors, implicit any, exact optional property types, and more.
- Game logic (battle formulas, economy calculations) must be type-safe — incorrect types lead to game-breaking bugs.
- Consistent strict mode across all packages prevents type "escape hatches" in shared code.

### Consequences

**Positive:**
- Fewer runtime type errors in production.
- IDE autocomplete and refactoring works accurately.
- New developers onboard faster (types document intent).

**Negative:**
- More verbose code in some cases (explicit null checks, type assertions).
- Stricter compilation catches issues that require careful fixing.

---

## ADR-015 — Conventional Commits and Semantic Versioning

**Status:** Accepted  
**Date:** Project inception  

### Context

The project will have many contributors and needs a clear change history. Automated changelog generation and semantic version bumping would reduce release overhead.

### Decision

All commits must follow the **Conventional Commits** specification. Package versions follow **Semantic Versioning**. A CI check enforces commit message format on PRs.

### Rationale

- Conventional Commits enable automated changelog generation (`conventional-changelog`).
- Commit type prefixes (`feat:`, `fix:`, `perf:`) enable automated semantic version bumping.
- Clear commit history helps new developers understand the project's evolution.
- Enforced via CI — consistent across all contributors.

---

## ADR-016 — OpenTelemetry for Distributed Tracing

**Status:** Accepted  
**Date:** Design phase  

### Context

With multiple services (bot, workers, renderer, admin API), understanding request flows across service boundaries requires distributed tracing. Options:
1. **Jaeger** with OpenTelemetry SDK — open source, vendor-neutral
2. **Datadog APM** — full-featured, expensive at scale
3. **AWS X-Ray** — tight AWS integration, vendor lock-in
4. **Zipkin** — simpler, less maintained

### Decision

Use **OpenTelemetry SDK** (vendor-neutral) for instrumentation, with **Jaeger** as the trace backend in production.

### Rationale

- OpenTelemetry is the CNCF standard — vendor-neutral, future-proof.
- Can switch backends (Jaeger → Datadog → Honeycomb) without changing instrumentation code.
- Jaeger is open source, self-hosted, and well-supported.
- Strong Node.js support with auto-instrumentation for HTTP, MongoDB, and Redis.

### Consequences

**Positive:**
- Vendor-neutral — no lock-in.
- Auto-instrumentation reduces manual effort.
- Traces correlated with logs via trace IDs.

**Negative:**
- Adds tracing overhead (~1–5% CPU).
- Self-hosted Jaeger requires maintenance.

---

## ADR-017 — Pino for Structured Logging

**Status:** Accepted  
**Date:** Design phase  

### Context

A game bot generates high log volume. Logging must be:
- Fast (non-blocking)
- Structured (JSON for Loki/Elasticsearch)
- Flexible (different log levels per environment)

Options: Winston, Bunyan, Pino, console.log

### Decision

Use **Pino** for all application logging.

### Rationale

- Pino is the fastest Node.js JSON logger (benchmarked ~5× faster than Winston).
- Pino-pretty for human-readable development output.
- JSON output integrates directly with Grafana Loki.
- Minimal API surface — easy to adopt consistently.
- Child loggers for request context propagation.

---

## ADR-018 — Character Stat Snapshot at Battle Start

**Status:** Accepted  
**Date:** Design phase  

### Context

A battle simulation may take 500ms–2000ms. During this time, a character's equipped items or active skills could theoretically be changed in a concurrent interaction. If the battle engine reads live database state, it would produce inconsistent results.

### Decision

At battle initiation, a complete **immutable snapshot** of each participant's stats (base stats + equipment bonuses + skill list + transformation state) is taken and stored in the battle record. The engine operates exclusively on this snapshot.

### Rationale

- Prevents stat manipulation mid-battle.
- Guarantees deterministic simulation (same snapshot = same result).
- Simplifies engine design (pure function over immutable data).
- Stored snapshot enables replay and anti-cheat audit.

### Consequences

**Positive:**
- Cheating by equipping better items mid-battle is impossible.
- Full audit trail of what stats were active during each battle.

**Negative:**
- Player cannot benefit from a buff applied by another player mid-battle (acceptable: battles are fast).

---

## ADR-019 — MongoDB Soft Deletes

**Status:** Accepted  
**Date:** Design phase  

### Context

Deleting records (users, characters, guilds) is irreversible and may cause issues if deletion was in error or if records are needed for audit/analytics.

### Decision

All deletable entities use **soft delete** pattern: `deletedAt: Date | null`. Records with non-null `deletedAt` are excluded from normal queries. Hard deletion is never performed by application code — only by database administrators after a retention period.

### Rationale

- Enables account recovery for suspended/banned players.
- Preserves referential integrity for audit logs and analytics.
- Battle history references character IDs that may be "deleted" — soft delete ensures the referenced data still exists.
- Legal/regulatory compliance: some jurisdictions require data preservation for a period.

### Consequences

**Positive:**
- Account recovery possible.
- Analytics data integrity preserved.
- No orphaned foreign key equivalent issues.

**Negative:**
- All queries must include `{ deletedAt: null }` filter.
- Collection sizes grow; periodic archival required.

**Mitigation:**
- Mongoose middleware automatically excludes soft-deleted records from all standard queries.
- Cleanup worker archives records with `deletedAt` older than 2 years to cold storage.

---

## ADR-020 — Integer Representation for All Currency Values

**Status:** Accepted  
**Date:** Design phase  

### Context

Currency values (gold, gems, prices) involve arithmetic operations. Floating-point arithmetic in JavaScript (and most languages) introduces rounding errors: `0.1 + 0.2 !== 0.3`.

### Decision

All currency values are stored and computed as **integers** (representing the smallest indivisible unit). Gold is in gold coins (integer). There are no fractional gold values in the game design.

### Rationale

- Integer arithmetic in JavaScript is exact (no floating-point precision errors).
- MongoDB stores integers exactly.
- Economy integrity is paramount — rounding errors in balance calculations would be exploitable or unfair.
- Aligns with the game design (no fractional currency, per Book 1 economy rules).

### Consequences

**Positive:**
- No floating-point economy bugs.
- Balance comparisons and arithmetic are always exact.

**Negative:**
- Requires discipline: no division that produces fractions without explicit floor/ceil policy.

**Mitigation:**
- Marketplace fee calculations always use `Math.floor()` — documented as the standard rounding direction for fees.
- ESLint rule flags `parseFloat()` usage in economy-related files.

---

## ADR-021 — Kubernetes for Production Orchestration

**Status:** Accepted  
**Date:** DevOps phase  

### Context

The production system runs multiple services (bot, workers, renderer, admin API) that need:
- Automatic restart on failure
- Horizontal scaling
- Rolling deployments with zero downtime
- Resource limits and requests

Options: Bare VMs + PM2, Docker Swarm, Kubernetes, AWS ECS, Railway.

### Decision

Use **Kubernetes** for production container orchestration.

### Rationale

- Kubernetes is the industry standard for container orchestration.
- Native support for rolling deployments, HPA, pod disruption budgets.
- Kubernetes health checks (liveness, readiness probes) align with the system's health check design.
- Wide hosting provider support (GKE, EKS, AKS, DigitalOcean, self-hosted).
- Team can leverage existing Kubernetes knowledge.

### Consequences

**Positive:**
- Automatic pod restart on failure.
- HPA scales workers based on queue depth.
- Rolling deployments with zero downtime.

**Negative:**
- Significant operational complexity compared to PM2 or Docker Swarm.
- Requires Kubernetes expertise on the team.

**Mitigation:**
- Managed Kubernetes (GKE/EKS) reduces operational burden.
- Clear deployment documentation in `docs/Deployment-Guide.md`.

---

## ADR-022 — Prometheus + Grafana for Observability

**Status:** Accepted  
**Date:** DevOps phase  

### Context

The system needs metrics, dashboards, and alerting.

Options:
1. Prometheus + Grafana — open source, self-hosted, industry standard
2. Datadog — expensive at scale, vendor lock-in
3. New Relic — SaaS, cost concerns
4. CloudWatch — AWS-specific, limited flexibility

### Decision

Use **Prometheus** for metrics collection, **Grafana** for dashboards, and **Alertmanager** for alerting.

### Rationale

- Fully open source — no per-host costs.
- Prometheus is the standard in the Kubernetes ecosystem (native support via `kube-prometheus-stack`).
- Grafana has excellent dashboard tooling and supports Loki (log aggregation) in the same UI.
- Well-documented, large community, many existing dashboard templates.

---

## ADR-023 — Event-Driven Cache Invalidation

**Status:** Accepted  
**Date:** Design phase  

### Context

Redis cache must be kept consistent with MongoDB. Two approaches:
1. **Time-based TTL only**: Cache expires after N seconds. Risk: stale data during TTL window.
2. **Event-driven invalidation**: Services emit events when data changes; cache is explicitly invalidated.

### Decision

Use **event-driven invalidation** (via Node.js EventEmitter) for all service-owned cache namespaces, with TTLs as a safety net.

### Rationale

- Eliminates stale cache windows after writes.
- Economy, inventory, and character data can change rapidly — even a 30-second TTL window could allow stale reads.
- EventEmitter-based invalidation is synchronous within the same process; cross-process invalidation publishes to Redis Pub/Sub.
- TTLs remain as a backstop against event delivery failures.

### Consequences

**Positive:**
- Near-zero cache staleness after writes.
- Reduces unnecessary MongoDB reads from cache misses on data that hasn't changed.

**Negative:**
- Cache invalidation logic adds code to every service method that mutates data.
- Cross-process invalidation via Redis Pub/Sub adds a dependency on reliable Pub/Sub delivery.

---

## ADR-024 — Per-Service MongoDB Collection Ownership

**Status:** Accepted  
**Date:** Design phase  
*Note: This ADR formalizes the principle stated in ADR-008 with additional detail.*

### Context

See ADR-008.

### Additional Detail on Cross-Service Data Access Patterns

When Service A needs data owned by Service B, the preferred patterns in order of preference:

1. **Denormalization**: Store the needed field directly on Service A's document (e.g., `discordId` on all documents for user lookups).
2. **Service method call**: Call `ServiceB.getX(id)` — cacheable, validates input.
3. **Read-model pattern**: For high-read-volume cross-service queries, maintain a dedicated read projection updated by events. Example: `CharacterReadRepository` maintained by `ProfileService` for battle engine use.

Cross-service database queries (direct `db.collection('other')`) are forbidden and enforced via ESLint custom rule.

---

## ADR-025 — Zod for Runtime Input Validation

**Status:** Accepted  
**Date:** Design phase  

### Context

TypeScript provides compile-time type safety, but runtime inputs (Discord slash command options, API request bodies) come in as untyped data. Validation must be performed at runtime.

Options:
1. **Zod** — TypeScript-first schema validation with excellent type inference
2. **Joi** — mature, JavaScript-oriented
3. **class-validator** — decorator-based, requires class instances
4. **Manual validation** — verbose, error-prone

### Decision

Use **Zod** for all runtime input validation.

### Rationale

- Zod's TypeScript type inference is best-in-class — parsed value type is inferred from schema automatically.
- Single source of truth: Zod schema defines both the runtime validation AND the TypeScript type.
- Integrates cleanly with the middleware validation pattern.
- `z.infer<typeof schema>` eliminates need to maintain parallel type definitions.
- Active development and large community.

### Consequences

**Positive:**
- Runtime safety matches compile-time types.
- Validation errors are structured (field-level) — useful for error responses.

**Negative:**
- Adds Zod as a runtime dependency.
- Schema duplication risk (must keep Zod schema in sync with TypeScript interfaces).

**Mitigation:**
- Use `z.infer<>` for TypeScript types derived from Zod schemas — eliminates duplication.

---

*ADR Log maintained by the Architecture team. New ADRs proposed via PR — must include Status, Date, Context, Decision, Rationale, and Consequences sections.*
