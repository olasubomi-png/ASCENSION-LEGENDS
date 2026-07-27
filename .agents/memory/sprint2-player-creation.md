---
name: Sprint 2 Player Creation
description: Architecture decisions and quirks for the /start + /profile player creation system
---

# Sprint 2 — Player Creation System

## Key Decisions

**PR formula normalises percentage stats:**
`critRate`, `critDamage`, `accuracy`, `evasion` are stored as integer percentages (5 = 5%).
The Book 1 §3.4 Power Rating formula divides them by 100 before applying multipliers:
`(critRate / 100) × 200`, etc. Level-1 characters land in Bronze tier (~1500–2400 PR).
**Why:** Without the /100, a Level-1 character would have Silver-tier PR (26k+), breaking the progression ladder.
**How to apply:** Any future stat that is stored as an integer percent must be divided by 100 in `statsCalculator.ts` before being used in the PR formula.

**Class stats scale (Book 1 §4.2):**
- Vanguard: HP 700, ATK 85, DEF 110, SPD 55
- Invoker: HP 425, ATK 40, DEF 35, MATK 135, SPD 70
- Wanderer: HP 500, ATK 105, DEF 55, SPD 120, LCK 20

**Canvas rendering:**
`node-canvas` is an optional peer dep — not installed in Replit sandbox. `ProfileCardRenderer.tryLoadCanvas()` catches the import error and returns `Buffer.alloc(0)`. The `/profile` command detects the empty buffer and falls back to a rich embed. In production with native deps installed, the PNG card renders automatically.

**Registration flow:**
`/start` → shows `character_name` Modal → `characterNameModal` handler validates name → sends class-select buttons → `classSelectButton` handler (`select_class:{classId}:{characterName}`) → `RegistrationService.register()` → welcome embed.
Button custom ID: `select_class:{classId}:{characterName}` (name is after the second colon, may be recovered with `parts.slice(2).join(':')`).

**Env mock in tests:**
`src/tests/services/registration.service.test.ts` mocks `../../config/index.js` and `../../utils/logger.js` at the top (before imports) because `loadEnv()` throws at module init time if env vars are absent.

**InventoryService.createInventory:**
Not part of `IInventoryService` interface (which is the public-facing API). It's an extra method called only by `RegistrationService`. If the interface is extended in future, add it there.

**Service references on AscensionClient:**
`client.registrationService`, `client.characterService`, `client.economyService`, `client.profileService` are optional (`?`) properties. Command handlers must guard with `if (!service)` before using them.
