# Ascension Legends — Discord Bot

> A high-fidelity Discord MMORPG — depth, social architecture, and visual ambition.

---

## Overview

Ascension Legends is a feature-rich Discord bot that transforms servers into a living MMORPG world. Players create characters, engage in deterministic PvP/PvE battles, build guilds, complete quests, and progress through skill trees — all with professional-grade visual output rendered directly into Discord.

**Current status:** Architecture foundation — commands are placeholder; gameplay is not yet implemented.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 22 LTS |
| Discord | discord.js v14 (Slash Commands only) |
| Database | MongoDB 7.x + Mongoose |
| Cache / Locks | Redis 7.x + Redlock |
| Background Jobs | BullMQ |
| Rendering | node-canvas + sharp |
| Video | FFmpeg (GIF / MP4) |
| Logging | Winston |
| Validation | Zod v3 |
| IDs | ULID with entity prefixes |
| Testing | Jest + ts-jest |
| Linting | ESLint (flat config) + Prettier |

---

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 9+
- Docker & Docker Compose (for local MongoDB + Redis)
- A Discord Application with a bot token

### 1. Clone & install

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Fill in DISCORD_TOKEN, DISCORD_CLIENT_ID, MONGODB_URI, etc.
```

### 3. Start infrastructure

```bash
docker compose up -d mongodb redis
```

### 4. Run in development

```bash
pnpm --filter @workspace/discord-bot run dev
```

---

## Commands

| Command | Description | Status |
|---------|-------------|--------|
| `/ping` | Bot latency & connection status | ✅ Live |
| `/start` | Begin your journey | 🚧 Placeholder |
| `/profile [user]` | View player profile card | 🚧 Placeholder |
| `/help` | Show available commands | 🚧 Placeholder |

---

## Project Structure

```
src/
├── commands/          # Slash command definitions
├── events/            # Discord.js event handlers
├── buttons/           # Button interaction handlers
├── selectMenus/       # Select menu handlers
├── modals/            # Modal submit handlers
├── autocomplete/      # Autocomplete handlers
├── client/            # AscensionClient, loaders, deployer
├── database/          # MongoDB + Redis connection modules
├── models/            # Mongoose document models
├── repositories/      # Data access layer
├── services/
│   ├── battle/        # PvP/PvE engine (ADR-007)
│   ├── economy/       # Currency + ledger (ADR-010, ADR-013)
│   ├── guild/         # Guild management
│   ├── inventory/     # Item ownership
│   ├── player/        # Player profiles
│   ├── skills/        # Skill trees
│   ├── transformations/ # Class evolutions
│   ├── quests/        # Quest progression
│   └── world/         # Zones + world events
├── renderer/          # Canvas image generation
├── video/             # FFmpeg GIF/MP4 rendering
├── workers/           # BullMQ worker processes
├── jobs/              # Queue definitions
├── cache/             # Redis cache service
├── config/            # Env loader (Zod-validated)
├── constants/         # Game, Discord, cache, job constants
├── middleware/        # Cooldown tracker
├── utils/             # Logger, ULID, async helpers, format, health
├── validators/        # Zod validators (player, economy)
├── types/             # TypeScript type definitions
├── interfaces/        # Service & repository contracts
├── assets/            # Static assets (fonts, images)
├── locales/           # i18n strings (future)
└── tests/             # Jest unit tests
```

---

## Architecture Decisions (key ADRs)

| ADR | Decision |
|-----|----------|
| ADR-007 | Deterministic battle engine — seeded Xorshift128 RNG |
| ADR-008 | Service ownership — one service per MongoDB collection |
| ADR-010 | Write-through cache on economy data |
| ADR-011 | Rendering isolation via BullMQ workers |
| ADR-013 | Redlock for atomic economy operations |

See `docs/Architecture-Decision-Records.md` for the full list.

---

## Development Scripts

```bash
pnpm run dev          # tsx watch — hot reload
pnpm run build        # TypeScript compile
pnpm run typecheck    # Type check without emitting
pnpm run lint         # ESLint
pnpm run lint:fix     # ESLint with auto-fix
pnpm run format       # Prettier write
pnpm run format:check # Prettier check (CI)
pnpm run test         # Jest
pnpm run test:coverage # Jest with coverage
```

---

## Docker

```bash
# Full stack (bot + MongoDB + Redis)
docker compose up -d

# Bot only (external DB/Redis)
docker compose up -d bot
```

---

## Health Check

The bot exposes an HTTP health endpoint at `GET /health` (port configured via `PORT` env var, default `3001`):

```json
{
  "status": "ok",
  "uptime": 42.5,
  "timestamp": "2026-07-25T00:00:00.000Z",
  "services": {
    "mongodb": "up",
    "redis": "up",
    "discord": "up"
  }
}
```

---

## Contributing

1. Branch from `develop`
2. Follow Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
3. Run `pnpm run lint` and `pnpm run test` before opening a PR
4. All PRs require CI to pass

---

## License

MIT
