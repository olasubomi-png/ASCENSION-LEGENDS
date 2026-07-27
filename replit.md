# Ascension Legends

A high-fidelity Discord MMORPG bot — depth, social architecture, and visual ambition.

## Run & Operate

- `pnpm --filter @workspace/discord-bot run dev` — run the Discord bot in dev mode (tsx watch)
- `pnpm --filter @workspace/discord-bot run build` — TypeScript compile
- `pnpm --filter @workspace/discord-bot run typecheck` — type check without emitting
- `pnpm --filter @workspace/discord-bot run lint` — ESLint
- `pnpm --filter @workspace/discord-bot run lint:fix` — ESLint with auto-fix
- `pnpm --filter @workspace/discord-bot run test` — Jest unit tests
- `pnpm --filter @workspace/discord-bot run test:coverage` — Jest with coverage report
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 22 LTS, TypeScript 5.9 (strict)
- Discord: discord.js v14 (Slash Commands only)
- Database: MongoDB 7.x + Mongoose
- Cache / Locks: Redis 7.x + ioredis + Redlock
- Background Jobs: BullMQ
- Rendering: node-canvas + sharp (placeholder — native deps excluded in Replit)
- Video: FFmpeg (placeholder)
- Logging: Winston
- Validation: Zod v3
- IDs: ULID with entity prefixes (user_, char_, wlt_, etc.)
- Testing: Jest + ts-jest
- Linting: ESLint (flat config) + Prettier

## Where things live

- `artifacts/discord-bot/` — Discord bot (main deliverable)
  - `src/commands/` — Slash commands (/ping, /start, /profile, /help)
  - `src/events/` — Discord.js event handlers
  - `src/client/` — AscensionClient, command/event loaders, command deployer
  - `src/database/` — MongoDB + Redis connection modules
  - `src/models/` — Mongoose schema definitions (User, Wallet, Guild)
  - `src/repositories/` — Data access layer
  - `src/services/` — Business logic (PlayerService, EconomyService, GuildService + placeholders)
  - `src/cache/` — CacheService (Redis-backed)
  - `src/workers/` — BullMQ worker processes (RenderWorker)
  - `src/jobs/` — Queue definitions (render, battle, notification)
  - `src/utils/` — Logger, ULID, health check, format helpers
  - `src/types/` — TypeScript type definitions
  - `src/interfaces/` — Service & repository contracts
  - `src/constants/` — Game, Discord, cache, job constants
  - `src/tests/` — Jest unit tests
- `artifacts/api-server/` — Internal Admin API (Express 5)
- `lib/` — Shared libraries
- `docs/` — Game design bibles, architecture docs, ADRs

## Architecture decisions

- ADR-007: Deterministic battle engine — seeded Xorshift128 RNG, pure function, version-tracked
- ADR-008: One service per MongoDB collection; cross-service access only via public methods
- ADR-010: Write-through cache on economy data (Redis, short TTL)
- ADR-011: Rendering isolation via BullMQ workers (canvas/ffmpeg never blocks event loop)
- ADR-013: Redlock algorithm for atomic economy operations

## Required environment variables (discord-bot)

See `artifacts/discord-bot/.env.example` for full list. Key required vars:

- `DISCORD_TOKEN` — Bot token from Discord Developer Portal
- `DISCORD_CLIENT_ID` — Application ID
- `MONGODB_URI` — MongoDB connection string (e.g. `mongodb://localhost:27017/ascension_legends`)
- `REDIS_HOST` / `REDIS_PORT` — Redis connection details

## Current status

Architecture foundation and the deterministic Sprint 3 battle engine are implemented. The battle engine is pure and replayable with seeded Xorshift128 randomness, initiative, damage/affinity, criticals, dodge, block/parry/counter, shields, healing, statuses, combos, ultimate gauge, and structured replay events. Battle persistence, queue workers, and Discord battle commands remain follow-up integrations. Slash commands are otherwise placeholder (/ping is fully functional; /start, /profile, /help are stubs).

## User preferences

- Read all docs in `docs/` folder before writing code — they are the single source of truth
- Prefer Book1-4 when docs conflict
- No gameplay implementation until architecture is solid
- Use dependency injection, async architecture, services, repositories
- Winston for logging (not Pino, despite some doc references)
- Node.js 22 LTS (not 20, despite some doc references)
