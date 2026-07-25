# ASCENSION LEGENDS — Engineering Standards

> **Scope:** Canonical reference for naming conventions, coding standards, Git workflow, pull request process, code review guidelines, and testing requirements. All contributors — human and automated — are expected to follow these standards. Exceptions require explicit justification in the PR description.

---

## Table of Contents

1. [Language & Runtime](#1-language--runtime)
2. [Naming Conventions](#2-naming-conventions)
3. [TypeScript Standards](#3-typescript-standards)
4. [Code Style](#4-code-style)
5. [File & Directory Structure](#5-file--directory-structure)
6. [Error Handling](#6-error-handling)
7. [Logging](#7-logging)
8. [Testing Standards](#8-testing-standards)
9. [Git Workflow](#9-git-workflow)
10. [Commit Message Standards](#10-commit-message-standards)
11. [Pull Request Process](#11-pull-request-process)
12. [Code Review Standards](#12-code-review-standards)
13. [Security Standards](#13-security-standards)
14. [Performance Guidelines](#14-performance-guidelines)
15. [Documentation Standards](#15-documentation-standards)
16. [Dependency Management](#16-dependency-management)
17. [Observability Requirements](#17-observability-requirements)

---

## 1. Language & Runtime

| Requirement | Specification |
|-------------|---------------|
| Language | TypeScript 5.x — strict mode required |
| Runtime | Node.js 20 LTS |
| Package manager | pnpm 9.x |
| Module system | ESM (`"type": "module"` in package.json) |
| Target | ES2022 for all packages |

All new code **must** be written in TypeScript. Plain JavaScript files (`.js`) are not permitted in `apps/` or `packages/` except for tooling configuration files that explicitly cannot be TypeScript (e.g., some PostCSS configs).

---

## 2. Naming Conventions

### 2.1 Variables & functions

| Type | Convention | Example |
|------|-----------|---------|
| Variables | `camelCase` | `battleResult`, `playerGold` |
| Functions | `camelCase` | `simulateBattle()`, `getWalletBalance()` |
| Async functions | `camelCase` (no `Async` suffix) | `fetchCharacter()` not `fetchCharacterAsync()` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_SHARD_COUNT`, `DEFAULT_COOLDOWN_MS` |
| Private class members | `_camelCase` prefix | `_initialized`, `_connectionPool` |
| Boolean variables | `is` / `has` / `can` prefix | `isActive`, `hasGuild`, `canAttack` |

```typescript
// ✅ Good
const MAX_BATTLE_ROUNDS = 20;
const isPlayerBanned = await checkBan(discordId);
async function simulateBattle(seed: number): Promise<BattleResult> { ... }

// ❌ Bad
const maxBattleRounds = 20;
const banned = await checkBan(discordId);
async function simulateBattleAsync(seed: number) { ... }
```

### 2.2 Types & interfaces

| Type | Convention | Example |
|------|-----------|---------|
| Interfaces | `PascalCase` | `BattleResult`, `CharacterStats` |
| Type aliases | `PascalCase` | `CurrencyType`, `BattleOutcome` |
| Enums | `PascalCase` | `AccountStatus`, `ItemRarity` |
| Enum values | `SCREAMING_SNAKE_CASE` | `AccountStatus.BANNED` |
| Generic type params | Single uppercase letter or descriptive PascalCase | `T`, `TResult`, `TEntity` |

```typescript
// ✅ Good
interface CharacterSnapshot {
  characterId: string;
  stats: BaseStats;
}

type CurrencyType = 'gold' | 'gems' | 'seasonal_tokens';

enum AccountStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
  SUSPENDED = 'suspended',
}

// ❌ Bad
interface characterSnapshot { ... }
type currencyType = 'gold' | 'gems';
enum accountStatus { active, banned }
```

### 2.3 Files & directories

| Type | Convention | Example |
|------|-----------|---------|
| Source files | `kebab-case.ts` | `battle-engine.ts`, `wallet-service.ts` |
| Test files | `<name>.test.ts` | `battle-engine.test.ts` |
| Type definition files | `<name>.types.ts` | `battle.types.ts` |
| Index files | `index.ts` only | `index.ts` |
| Configuration files | `kebab-case.config.ts` | `vitest.config.ts` |
| Directories | `kebab-case` | `battle-engine/`, `render-worker/` |

### 2.4 Database identifiers

| Identifier | Convention | Example |
|------------|-----------|---------|
| MongoDB collection names | `snake_case` (plural) | `characters`, `economy_ledger` |
| Document field names | `camelCase` | `discordId`, `battlePower` |
| Application-level IDs | ULID with prefix | `char_01J...`, `battle_01J...` |
| Redis keys | `namespace:entity_type:entity_id` | `cache:wallet:123456789` |

### 2.5 API routes

```
/api/v{n}/{resource-noun-plural}/{id?}/{sub-resource?}

Examples:
GET  /api/v1/users
GET  /api/v1/users/:discordId
POST /api/v1/users/:discordId/characters
GET  /api/v1/battles/:battleId/replay
```

- Resource names are **plural nouns** (`users`, not `user`)
- IDs are path parameters, not query parameters
- Use HTTP verbs semantically — `GET` for reads, `POST` for creation, `PATCH` for partial updates, `DELETE` for removal

---

## 3. TypeScript Standards

### 3.1 Strict mode

All `tsconfig.json` files must include:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

### 3.2 Forbidden patterns

```typescript
// ❌ Never use `any` — use `unknown` instead
function processData(data: any): any { ... }

// ✅ Use unknown and narrow the type
function processData(data: unknown): ProcessedData {
  if (!isValidData(data)) throw new ValidationError('Invalid data');
  return transform(data);
}

// ❌ Never use non-null assertion unless genuinely impossible to be null
const userId = user!.id;

// ✅ Assert properly or handle null
if (!user) throw new AppError('USER_NOT_FOUND');
const userId = user.id;

// ❌ No @ts-ignore
// @ts-ignore
const result = weirdFunction();

// ✅ Use @ts-expect-error only when unavoidable, with a comment explaining why
// @ts-expect-error: external library has incorrect types for this overload
const result = weirdFunction();

// ❌ No implicit return types on exported functions
export function getBattlePower(stats: BaseStats) { ... }

// ✅ Explicit return types on all exported functions
export function getBattlePower(stats: BaseStats): number { ... }
```

### 3.3 Type imports

```typescript
// ✅ Use `import type` for type-only imports (enforced by ESLint)
import type { BattleResult, CharacterSnapshot } from './battle.types.js';
import { simulateBattle } from './battle-engine.js';
```

### 3.4 Runtime validation

All external data (Discord interaction payloads, HTTP request bodies, MongoDB documents at boundaries) must be validated with Zod before use:

```typescript
import { z } from 'zod';

const CreditRequestSchema = z.object({
  amount: z.number().int().min(1).max(10_000_000),
  currency: z.enum(['gold', 'gems']),
  reason: z.string().min(10).max(500),
});

// Validate at the boundary — throw if invalid
const parsed = CreditRequestSchema.parse(req.body);
```

---

## 4. Code Style

### 4.1 Formatting

Formatting is enforced by **Prettier**. No manual formatting debates — Prettier's output is law.

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "trailingComma": "all",
  "arrowParens": "always"
}
```

Run before committing:
```bash
pnpm run format        # fix in place
pnpm run format:check  # CI check
```

### 4.2 Linting

ESLint with `@typescript-eslint`. Key rules enforced:

| Rule | Setting |
|------|---------|
| `@typescript-eslint/no-explicit-any` | error |
| `@typescript-eslint/no-floating-promises` | error |
| `@typescript-eslint/consistent-type-imports` | error |
| `@typescript-eslint/explicit-module-boundary-types` | error |
| `no-console` | error (use pino logger) |
| `no-unused-vars` | error |
| `prefer-const` | error |
| `eqeqeq` | error (no `==`) |

### 4.3 Import order

Enforce with `eslint-plugin-import` or `eslint-plugin-simple-import-sort`:

```typescript
// 1. Node built-ins
import path from 'node:path';
import { Worker } from 'node:worker_threads';

// 2. External packages
import { z } from 'zod';
import pino from 'pino';

// 3. Internal packages (workspace)
import type { BattleResult } from '@workspace/engine';
import { WalletService } from '@workspace/services';

// 4. Relative imports
import { simulateBattle } from './battle-engine.js';
import type { BattleConfig } from './battle.types.js';
```

Note: all relative imports **must** include the `.js` extension (required for ESM).

### 4.4 Function length & complexity

- Functions should do **one thing**. If a function has more than ~50 lines, it probably needs to be split.
- Cyclomatic complexity limit: **10** (enforced by ESLint).
- Maximum nesting depth: **4 levels**.

```typescript
// ❌ Deep nesting is a code smell
async function processReward(battle: Battle): Promise<void> {
  if (battle.status === 'completed') {
    if (battle.winnerId) {
      const winner = await getUser(battle.winnerId);
      if (winner) {
        if (winner.accountStatus === 'active') {
          await creditGold(winner.discordId, battle.rewards.attackerGold);
        }
      }
    }
  }
}

// ✅ Extract and early-return
async function processReward(battle: Battle): Promise<void> {
  if (battle.status !== 'completed' || !battle.winnerId) return;

  const winner = await getUser(battle.winnerId);
  if (!winner || winner.accountStatus !== 'active') return;

  await creditGold(winner.discordId, battle.rewards.attackerGold);
}
```

---

## 5. File & Directory Structure

### 5.1 Package structure

Every package follows this layout:

```
packages/<package-name>/
  src/
    index.ts          ← Public exports only
    <feature>/
      <feature>.ts
      <feature>.types.ts
      <feature>.test.ts
  package.json
  tsconfig.json
  tsconfig.build.json
  vitest.config.ts
```

### 5.2 Barrel exports

`index.ts` exports only the **public surface** of the package. Internal implementation files are not re-exported.

```typescript
// packages/engine/src/index.ts

// ✅ Export the public API
export { simulateBattle } from './battle-engine/battle-engine.js';
export type { BattleResult, BattleReplay } from './battle-engine/battle.types.js';

// ❌ Do not export internal helpers
// export { buildDamageFormula } from './battle-engine/damage-formula.js';
```

### 5.3 Separation of concerns

| File type | Contents |
|-----------|----------|
| `*.service.ts` | Business logic only; no HTTP, no Discord |
| `*.handler.ts` | Discord command handlers; calls services |
| `*.router.ts` | Express route definitions; calls services |
| `*.worker.ts` | BullMQ worker; calls services |
| `*.repository.ts` | MongoDB query layer; no business logic |
| `*.types.ts` | Type and interface definitions only |
| `*.schema.ts` | Zod schemas for validation |
| `*.config.ts` | Configuration and constants |

---

## 6. Error Handling

### 6.1 Error hierarchy

All application errors extend `AppError`:

```typescript
// packages/shared/src/errors/app-error.ts
export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true,
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super('NOT_FOUND', `${resource} '${id}' not found`, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public readonly field?: string) {
    super('VALIDATION_ERROR', message, 400);
  }
}

export class InsufficientBalanceError extends AppError {
  constructor(currency: string, balance: number, requested: number) {
    super(
      'INSUFFICIENT_BALANCE',
      `Balance (${balance} ${currency}) is less than requested (${requested} ${currency})`,
      422,
    );
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super('CONFLICT', message, 409);
  }
}
```

### 6.2 Error handling rules

1. **Always handle or propagate.** No swallowed errors, no empty `catch` blocks.
2. **Use operational errors for expected failures** (`AppError` subclasses). These are handled gracefully.
3. **Let unexpected errors propagate** to the top-level handler, which logs them and returns 500.
4. **Never expose internal error details** to Discord users or API consumers.

```typescript
// ✅ Service layer — throw operational errors
async function debitGold(discordId: string, amount: number): Promise<void> {
  const wallet = await walletRepository.findByDiscordId(discordId);
  if (!wallet) throw new NotFoundError('Wallet', discordId);
  if (wallet.gold < amount) throw new InsufficientBalanceError('gold', wallet.gold, amount);
  await walletRepository.debit(discordId, amount);
}

// ✅ Handler layer — catch and convert to user message
try {
  await debitGold(discordId, cost);
} catch (error) {
  if (error instanceof InsufficientBalanceError) {
    return interaction.reply({ content: '❌ Not enough gold!', ephemeral: true });
  }
  throw error; // let unexpected errors bubble
}
```

### 6.3 Async error handling

All async operations in BullMQ workers, cron jobs, and event handlers must be wrapped:

```typescript
// ✅ Worker jobs — errors are caught by BullMQ and retried/DLQ'd
worker.on('failed', (job, error) => {
  logger.error({ jobId: job?.id, error }, 'Job failed');
});

// ✅ Top-level awaits in scripts
process.on('unhandledRejection', (reason) => {
  logger.fatal({ reason }, 'Unhandled rejection — exiting');
  process.exit(1);
});
```

---

## 7. Logging

### 7.1 Logger setup

All services use **Pino**. `console.log` is forbidden (enforced by ESLint).

```typescript
// packages/shared/src/logger/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
});

// In services/workers — use child loggers for context
export function createLogger(service: string) {
  return logger.child({ service });
}
```

### 7.2 Log levels

| Level | When to use |
|-------|------------|
| `trace` | Very detailed step-by-step (dev only) |
| `debug` | Diagnostic detail useful during development |
| `info` | Normal operational events (startup, job completion) |
| `warn` | Unexpected but recoverable situations |
| `error` | Errors that affect a single operation |
| `fatal` | Errors that require process shutdown |

### 7.3 Log content rules

```typescript
// ✅ Structured logs with context — NEVER string interpolation
logger.info({ discordId, battleId, durationMs }, 'Battle simulation completed');
logger.error({ error, discordId, jobId }, 'Render job failed');

// ❌ No string interpolation
logger.info(`Battle ${battleId} completed for user ${discordId}`);

// ❌ Never log secrets or PII
logger.debug({ token: discordToken }); // BANNED
logger.info({ user }); // BANNED if user contains email/address/IP

// ✅ Log safe identifiers only
logger.info({ discordId, characterId });
```

### 7.4 Required log events

Every service must log:

| Event | Level | Required fields |
|-------|-------|----------------|
| Service start | `info` | `service`, `version`, `port` (if HTTP) |
| Service shutdown | `info` | `service`, `reason` |
| Database connected | `info` | `service`, `dbName` |
| Database disconnected | `warn` | `service`, `reason` |
| Queue worker started | `info` | `queue`, `concurrency` |
| Job completed | `info` | `jobId`, `queue`, `durationMs` |
| Job failed (retryable) | `warn` | `jobId`, `queue`, `error`, `attemptsMade` |
| Job failed (DLQ) | `error` | `jobId`, `queue`, `error` |

---

## 8. Testing Standards

### 8.1 Test framework

All tests use **Vitest**.

```bash
pnpm run test          # run all tests
pnpm run test:watch    # watch mode
pnpm run test:ci       # run once, fail fast, coverage
pnpm run test:coverage # coverage report
```

### 8.2 Coverage requirements

| Metric | Minimum |
|--------|---------|
| Line coverage | 80% |
| Branch coverage | 75% |
| Function coverage | 85% |
| Statement coverage | 80% |

CI fails if any threshold is not met. Critical packages (engine, services, workers) must maintain **90%+** line coverage.

### 8.3 Test structure

```typescript
// battle-engine.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { simulateBattle } from './battle-engine.js';
import { createMockCharacter } from '../test-utils/mock-factories.js';

describe('simulateBattle', () => {
  describe('given two balanced characters', () => {
    it('should return a winner', () => {
      const attacker = createMockCharacter({ battlePower: 10000 });
      const defender = createMockCharacter({ battlePower: 10000 });

      const result = simulateBattle(attacker, defender, { seed: 42 });

      expect(result.winnerId).toBeDefined();
      expect(['attacker', 'defender']).toContain(result.winnerType);
    });

    it('should be deterministic with the same seed', () => {
      const attacker = createMockCharacter({ battlePower: 10000 });
      const defender = createMockCharacter({ battlePower: 10000 });

      const result1 = simulateBattle(attacker, defender, { seed: 42 });
      const result2 = simulateBattle(attacker, defender, { seed: 42 });

      expect(result1.winnerId).toEqual(result2.winnerId);
      expect(result1.rounds).toEqual(result2.rounds);
    });

    it('should produce different results with different seeds', () => {
      // ...
    });
  });

  describe('given a significantly stronger attacker', () => {
    it('should favor the attacker winning', () => {
      // ...
    });
  });
});
```

### 8.4 Test categories

| Category | File pattern | Purpose |
|----------|-------------|---------|
| Unit | `*.test.ts` | Test isolated functions with mocks |
| Integration | `*.integration.test.ts` | Test against real DB/Redis (test containers) |
| E2E | `*.e2e.test.ts` | End-to-end Discord command flow |
| Smoke | `*.smoke.test.ts` | Post-deploy health verification |

### 8.5 Mocking rules

```typescript
// ✅ Use vi.mock for module-level mocking
vi.mock('../repositories/wallet-repository.js', () => ({
  WalletRepository: vi.fn().mockImplementation(() => ({
    findByDiscordId: vi.fn().mockResolvedValue(mockWallet),
    debit: vi.fn().mockResolvedValue(undefined),
  })),
}));

// ✅ Use mock factories — never inline ad-hoc objects
const wallet = createMockWallet({ gold: 5000 });

// ❌ No hardcoded test objects scattered everywhere
const wallet = { _id: 'abc', gold: 5000, gems: 100, ... };
```

All mock factories live in `packages/shared/src/test-utils/`.

### 8.6 Test data isolation

- Each test is self-contained. Tests must not depend on run order.
- Integration tests must clean up after themselves:
  ```typescript
  afterEach(async () => {
    await db.collection('wallets').deleteMany({ _id: { $in: createdIds } });
  });
  ```
- Never use production data in tests, even staging data.

---

## 9. Git Workflow

### 9.1 Branch naming

```
<type>/<short-description>

Types:
  feat/     — new feature
  fix/      — bug fix
  chore/    — tooling, dependency updates, refactors with no behavior change
  docs/     — documentation only
  test/     — tests only
  perf/     — performance improvement
  hotfix/   — urgent production fix (branched from main)

Examples:
  feat/guild-raid-system
  fix/render-worker-memory-leak
  chore/upgrade-discord-js-14.14
  hotfix/economy-debit-negative-balance
```

### 9.2 Branch lifetime

- Feature branches are short-lived (≤ 5 business days).
- Long-lived branches signal scope creep — break the work into smaller PRs.
- Delete branches after merging.

### 9.3 Protected branches

| Branch | Protection |
|--------|-----------|
| `main` | Requires 1 approving review, all CI checks green, no direct pushes |
| `hotfix/*` | Fast-track: 1 approving review, critical checks only |

### 9.4 Merge strategy

- **Squash and merge** for all feature/fix/chore PRs. The squash commit message must follow the commit format (Section 10).
- **Merge commit** for hotfixes that need the full commit history preserved.
- Rebase is permitted locally to keep branches clean but never force-push to `main`.

---

## 10. Commit Message Standards

All commits follow [Conventional Commits](https://www.conventionalcommits.org/).

### 10.1 Format

```
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

### 10.2 Types

| Type | When |
|------|------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `perf` | Performance improvement, no API change |
| `refactor` | Code restructuring, no behavior change |
| `test` | Adding or fixing tests |
| `docs` | Documentation only |
| `chore` | Build scripts, dependency updates, config |
| `ci` | CI/CD configuration changes |
| `revert` | Reverting a previous commit |

### 10.3 Scopes

Use the service/package name as scope:

```
feat(bot): add /guild leaderboard command
fix(engine): correct crit damage multiplier cap
perf(render): cache sprite sheets in worker memory
chore(deps): upgrade discord.js to 14.14.0
docs(api): add marketplace transaction endpoints
```

### 10.4 Rules

- Subject line: **50 characters max**, imperative mood, no period at the end.
- Body: wrap at 72 characters. Explain **what** and **why**, not how.
- Breaking changes: add `BREAKING CHANGE:` in the footer, or append `!` after the type:
  ```
  feat(engine)!: change BattleResult shape to include rounds array

  BREAKING CHANGE: BattleResult.roundSummary renamed to BattleResult.rounds
  and is now an array of RoundDetail objects.
  ```

### 10.5 Examples

```
feat(bot): add /trade confirm command with timeout

Adds a confirmation step before executing trades. If either party
does not confirm within 60 seconds, the trade is automatically
cancelled and items returned.

Closes #142

---

fix(economy): prevent negative balance on concurrent debits

Two concurrent debit requests could both pass the balance check
before either completed, resulting in a negative balance. Fixed by
acquiring a Redlock distributed lock before checking balance.

Fixes #521

---

chore(deps): upgrade pnpm to 9.4.0
```

---

## 11. Pull Request Process

### 11.1 PR size guidelines

| Lines changed | Classification | Notes |
|---------------|---------------|-------|
| < 200 | Small | Ideal. Should be reviewed same day. |
| 200–500 | Medium | Acceptable for well-scoped features. |
| 500–1000 | Large | Requires justification in description. Consider splitting. |
| > 1000 | Too large | Must be split unless the entire diff is generated code. |

Generated code (e.g., migration files, test fixtures, OpenAPI codegen output) does not count toward the line limit.

### 11.2 PR description template

```markdown
## Summary
<!-- One paragraph explaining what this PR does and why. -->

## Changes
<!-- Bullet points covering the key changes. -->
- 
- 

## Testing
<!-- How was this tested? What test cases were added/updated? -->
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manually tested in local environment

## Breaking Changes
<!-- Does this change any public APIs, DB schemas, or BullMQ job shapes? -->
None / Yes: <describe>

## Deployment Notes
<!-- Any special steps needed when deploying? Migrations, config changes, etc. -->
None / Yes: <describe>

## Screenshots
<!-- For Discord UI changes, attach before/after screenshots of the embed output. -->
```

### 11.3 PR lifecycle

```
1. Open PR (draft if still in progress)
2. CI runs automatically
3. Request review from at least 1 team member
4. Address review comments
5. Receive approval
6. Merge via squash (maintainer merges)
7. CI deploys to staging automatically
8. Author monitors staging for 15 minutes
```

### 11.4 Hotfix PRs

Hotfixes bypass the normal staging gate when severity requires immediate production deployment:

1. Branch from `main` as `hotfix/<description>`
2. Fix the issue with targeted minimal change
3. PR with `[HOTFIX]` prefix in title
4. Request review from **on-call engineer only** (single approver)
5. Merge when approved — CI deploys to production
6. Follow up with a proper test-covered fix within 24 hours

---

## 12. Code Review Standards

### 12.1 Reviewer responsibilities

The reviewer is responsible for:

- **Correctness:** Does the code do what it claims?
- **Safety:** Are there race conditions, security issues, or data integrity risks?
- **Test coverage:** Are edge cases covered?
- **Standards compliance:** Does it follow these engineering standards?
- **Readability:** Would a teammate be able to understand this in 6 months?

The reviewer is **not** responsible for:

- Formatting (Prettier handles this)
- Trivial style preferences
- Rewriting code that works correctly but in a different style

### 12.2 Review comment conventions

Use prefixes to indicate priority:

| Prefix | Meaning |
|--------|---------|
| `[blocker]` | Must be fixed before merge |
| `[suggestion]` | Would improve the code but not required |
| `[question]` | Asking for clarification |
| `[nit]` | Minor style/naming issue — author's discretion |
| `[praise]` | Positive feedback |

```
[blocker] This debit can go negative if two requests arrive simultaneously.
You need a distributed lock here — see how wallets.ts handles this.

[suggestion] Consider extracting this into a helper function so it can be
unit tested independently.

[nit] `getCharcterStats` is misspelled — should be `getCharacterStats`.
```

### 12.3 Approval rules

- **1 approval required** for most PRs (enforced by GitHub branch protection).
- **2 approvals required** for:
  - Changes to the battle engine (correctness is critical)
  - Changes to the economy/wallet service
  - Changes to authentication/security code
  - Changes to CI/CD pipelines
  - Database schema migrations

### 12.4 Review SLA

| PR size | Expected first review |
|---------|----------------------|
| Small | Same business day |
| Medium | Within 1 business day |
| Large | Within 2 business days |

If a PR is blocking critical work, tag it `[urgent]` in the title and ping the reviewer directly.

---

## 13. Security Standards

### 13.1 Input validation

All input from external sources (Discord interactions, HTTP request bodies, Redis/DB reads at service boundaries) must be validated with Zod before use. No raw access to `req.body` fields without validation.

### 13.2 Secrets

- Never hardcode secrets, tokens, or API keys in source code.
- Never log secrets (enforced by the logging rules in Section 7).
- Never commit `.env` files — only `.env.example` with empty values is committed.
- Use environment variables for all configuration that differs between environments.
- Rotate secrets immediately if accidentally exposed.

### 13.3 Economy security

- All economy operations (debit, credit, transfer) must acquire a Redlock distributed lock on the wallet before reading the balance.
- Balance checks and writes must occur within the same lock scope.
- The `economy_ledger` collection is append-only. No UPDATE or DELETE operations.
- All admin economy operations must include a reason string and be written to `audit_log`.

### 13.4 Privilege checks

All admin API endpoints must:
1. Verify the `Authorization: Bearer` API key
2. Verify the `X-Admin-Discord-Id` header is in `ADMIN_DISCORD_IDS`
3. Write to `audit_log` before executing the operation

Discord command handlers must verify that the calling user has the required permissions before executing privileged actions.

### 13.5 Rate limiting

All Discord commands are rate-limited per user. Do not remove rate limit checks. When adding new commands, apply appropriate rate limits using the existing rate limiter utility.

---

## 14. Performance Guidelines

### 14.1 Database queries

```typescript
// ✅ Use projection — never fetch the entire document if you need a subset
const { gold, gems } = await db.collection('wallets').findOne(
  { discordId },
  { projection: { gold: 1, gems: 1, _id: 0 } }
);

// ❌ Don't fetch the whole document to read one field
const wallet = await db.collection('wallets').findOne({ discordId });
const gold = wallet?.gold;

// ✅ Use indexes — always check that the query field is indexed before shipping
// ✅ Use .explain('executionStats') in development to verify index usage

// ❌ No unbounded queries — always provide a limit
const all = await db.collection('battles').find({}).toArray();  // BANNED

// ✅ Always limit
const battles = await db.collection('battles').find({}).limit(100).toArray();
```

### 14.2 Cache usage

All reads to MongoDB for player-facing data must go through the Redis cache layer using the write-through pattern:

```typescript
async function getWallet(discordId: string): Promise<Wallet> {
  const cached = await redis.get(`cache:wallet:${discordId}`);
  if (cached) return JSON.parse(cached) as Wallet;

  const wallet = await walletRepository.findByDiscordId(discordId);
  if (!wallet) throw new NotFoundError('Wallet', discordId);

  await redis.set(`cache:wallet:${discordId}`, JSON.stringify(wallet), 'EX', 300);
  return wallet;
}
```

Cache must be invalidated **synchronously** within the same operation that updates the database.

### 14.3 Battle engine

The battle engine is a **pure function**. It must:
- Accept a seed + character snapshots, return a `BattleResult`
- Make zero I/O calls (no DB, no Redis, no network)
- Complete in ≤ 500ms for any valid input
- Be side-effect free (no mutation of inputs)

Performance regression test: the engine test suite includes a benchmark. If median simulation time exceeds 500ms, the CI job fails.

### 14.4 Render worker

- Target: GIF render completes in ≤ 15 seconds for a standard 10-round battle.
- Sprite sheets and common assets must be pre-loaded into worker memory on startup, not re-read per job.
- Never block the main event loop in the render worker. Use `worker_threads` for CPU-intensive canvas operations.

---

## 15. Documentation Standards

### 15.1 When to write documentation

| Change | Documentation required |
|--------|----------------------|
| New public package API | JSDoc on all exported functions and types |
| New Discord command | Entry in the command reference doc |
| New database collection | Entry in `docs/Database-Schema.md` |
| New API endpoint | Entry in `docs/API-Specification.md` |
| New ADR | Entry in `docs/Architecture-Decision-Records.md` |
| New config variable | Entry in `docs/Deployment-Guide.md` Section 4 |

### 15.2 JSDoc requirements

All exported functions in packages must have JSDoc:

```typescript
/**
 * Simulates a battle between two characters deterministically.
 *
 * The simulation is pure — no I/O is performed. Results are fully
 * determined by the seed and character snapshots.
 *
 * @param attacker - Frozen snapshot of the attacking character's stats
 * @param defender - Frozen snapshot of the defending character's stats
 * @param options - Simulation options including the RNG seed
 * @returns Full battle result including replay and rewards
 * @throws {ValidationError} If character snapshots are missing required fields
 *
 * @example
 * const result = simulateBattle(attackerSnapshot, defenderSnapshot, { seed: 12345 });
 * console.log(result.winnerType); // "attacker"
 */
export function simulateBattle(
  attacker: CharacterSnapshot,
  defender: CharacterSnapshot,
  options: SimulationOptions,
): BattleResult { ... }
```

### 15.3 README requirements

Each package must have a `README.md` covering:
1. Purpose (one paragraph)
2. Installation / usage
3. Key exports
4. How to run tests

---

## 16. Dependency Management

### 16.1 Adding dependencies

Before adding any new dependency:

1. **Check if it's already available.** Search `pnpm-lock.yaml` first.
2. **Evaluate size and maintenance.** Check npm download counts and last publish date.
3. **Check for license compatibility.** MIT, Apache 2.0, and BSD are acceptable. GPL is not.
4. **Prefer the workspace package** for shared functionality — add to `packages/shared` rather than duplicating across apps.

```bash
# Add to a specific workspace package
pnpm --filter @workspace/engine add zod
pnpm --filter @workspace/engine add -D vitest

# Add to root (tooling only)
pnpm add -D -w prettier
```

### 16.2 Updating dependencies

- **Minor/patch updates:** Can be done in a `chore(deps):` PR, no review of the dependency's changelog required.
- **Major updates:** Require reading the migration guide and verifying the update in a dedicated PR.
- `discord.js` major versions require special care — test all command handlers before merging.

### 16.3 Security patches

Dependabot is enabled. Security PRs for high/critical vulnerabilities must be merged within:
- **Critical (CVSS ≥ 9.0):** 24 hours
- **High (CVSS 7.0–8.9):** 72 hours
- **Medium:** Next scheduled maintenance

---

## 17. Observability Requirements

### 17.1 Required metrics per service

Every service must export:

| Metric | Type | Description |
|--------|------|-------------|
| `<service>_up` | Gauge | 1 if service is healthy, 0 otherwise |
| `<service>_startup_duration_ms` | Histogram | Time to become ready |
| `<service>_errors_total` | Counter | Errors by type/code |

**Bot specific:**
| Metric | Type |
|--------|------|
| `bot_interactions_total` | Counter (labels: command, status) |
| `bot_interaction_duration_ms` | Histogram (label: command) |
| `bot_shard_status` | Gauge (label: shard_id) |

**Economy specific:**
| Metric | Type |
|--------|------|
| `economy_transactions_total` | Counter (labels: currency, type) |
| `economy_transaction_amount` | Histogram (labels: currency, type) |

**Render specific:**
| Metric | Type |
|--------|------|
| `render_jobs_total` | Counter (labels: format, status) |
| `render_duration_ms` | Histogram (label: format) |
| `render_queue_depth` | Gauge |

### 17.2 Tracing

All service-to-service calls and database operations must create OpenTelemetry spans. Use the shared tracing utility from `@workspace/shared`:

```typescript
import { withSpan } from '@workspace/shared/tracing';

async function simulateBattleWithSpan(seed: number): Promise<BattleResult> {
  return withSpan('battle.simulate', async (span) => {
    span.setAttributes({ 'battle.seed': seed });
    const result = simulateBattle(/* ... */);
    span.setAttributes({ 'battle.winner_type': result.winnerType });
    return result;
  });
}
```

### 17.3 Alerting thresholds

| Metric | Warning threshold | Critical threshold |
|--------|-------------------|-------------------|
| Bot command error rate | > 1% over 5 min | > 5% over 5 min |
| Render queue depth | > 100 | > 500 |
| Render p99 duration | > 20s | > 45s |
| MongoDB p99 latency | > 100ms | > 500ms |
| Redis p99 latency | > 20ms | > 100ms |
| Economy error rate | > 0.1% over 1 min | > 1% over 1 min |

---

*Engineering Standards v1.0.0 — Last updated 2025-01-01. Submit amendments via PR to `docs/Engineering-Standards.md`.*
