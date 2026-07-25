# ASCENSION LEGENDS — API Specification

> **Scope:** This document specifies the internal REST API exposed by `apps/admin-api`. It is not a public API — access is restricted to internal tools, admin dashboard, and authorized operational scripts. All game interactions go through Discord slash commands, not this API.

---

## Table of Contents

1. [API Overview](#1-api-overview)
2. [Authentication](#2-authentication)
3. [Common Conventions](#3-common-conventions)
4. [Error Codes Reference](#4-error-codes-reference)
5. [Users & Profiles](#5-users--profiles)
6. [Characters](#6-characters)
7. [Economy](#7-economy)
8. [Inventory](#8-inventory)
9. [Guilds](#9-guilds)
10. [Battles](#10-battles)
11. [Marketplace](#11-marketplace)
12. [Quests](#12-quests)
13. [Raids & Bosses](#13-raids--bosses)
14. [Moderation](#14-moderation)
15. [Analytics](#15-analytics)
16. [Render](#16-render)
17. [Admin Operations](#17-admin-operations)
18. [Health & Status](#18-health--status)

---

## 1. API Overview

**Base URL (production):** `https://admin-api.ascension-internal.com`  
**Base URL (staging):** `https://admin-api.staging.ascension-internal.com`  
**Base URL (local):** `http://localhost:3001`  

**Protocol:** HTTPS (TLS 1.3 minimum)  
**Authentication:** mTLS + Bearer API key (see Section 2)  
**Content-Type:** `application/json`  
**Character Encoding:** UTF-8  
**API Version:** `v1` (all endpoints prefixed `/api/v1/`)  

---

## 2. Authentication

All requests to the admin API require two authentication factors:

### 2.1 mTLS

The client must present a valid TLS certificate issued by the internal Certificate Authority. The server verifies the certificate against the CA bundle at startup.

```
Required headers: (implicit — handled by TLS handshake)
Client cert path: Configured per deployment in K8s secret
CA cert path:     INTERNAL_CA_CERT_PATH environment variable
```

### 2.2 Bearer API Key

In addition to mTLS, every request must include a valid API key:

```
Authorization: Bearer <api-key>
```

API keys are stored as hashed values in the environment configuration. Keys are rotated every 90 days.

### 2.3 Admin Identity Header

For operations that modify game state (economy adjustments, bans, etc.), the admin's Discord ID must be provided:

```
X-Admin-Discord-Id: <discord-snowflake-id>
```

This field is validated against a list of authorized admin Discord IDs and is written to the audit log for every mutating operation.

---

## 3. Common Conventions

### 3.1 Pagination

All list endpoints support pagination via query parameters:

```
GET /api/v1/users?page=1&limit=50

Response includes:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 12345,
    "totalPages": 247,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Defaults:** `page=1`, `limit=20`  
**Maximum limit:** 100

### 3.2 Date Filtering

Date range filters use ISO 8601 format:

```
GET /api/v1/battles?dateFrom=2025-01-01T00:00:00Z&dateTo=2025-01-31T23:59:59Z
```

### 3.3 Sorting

Sortable endpoints accept `sortBy` and `sortOrder` parameters:

```
GET /api/v1/users?sortBy=lastActiveAt&sortOrder=desc
```

### 3.4 Response Envelope

All responses are wrapped in a standard envelope:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "pagination": { ... },
  "meta": {
    "requestId": "req_01JXYZ...",
    "timestamp": "2025-01-01T12:00:00.000Z",
    "version": "1.0.0"
  }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with discordId '123456789' not found",
    "field": null,
    "details": {}
  },
  "meta": {
    "requestId": "req_01JXYZ...",
    "timestamp": "2025-01-01T12:00:00.000Z"
  }
}
```

### 3.5 HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | Success (GET, PATCH) |
| 201 | Created (POST that creates a resource) |
| 204 | No Content (DELETE) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid API key) |
| 403 | Forbidden (valid key but insufficient permission) |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 422 | Unprocessable Entity (business logic rejection) |
| 429 | Too Many Requests (rate limit) |
| 500 | Internal Server Error |

---

## 4. Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request body or params failed validation |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Authenticated but not permitted |
| `USER_NOT_FOUND` | 404 | User with given discordId does not exist |
| `CHARACTER_NOT_FOUND` | 404 | Character not found |
| `GUILD_NOT_FOUND` | 404 | Guild not found |
| `ITEM_NOT_FOUND` | 404 | Item not found in catalog or inventory |
| `BATTLE_NOT_FOUND` | 404 | Battle record not found |
| `INSUFFICIENT_BALANCE` | 422 | Debit would result in negative balance |
| `ITEM_LOCKED` | 422 | Item is locked in active trade/auction |
| `USER_ALREADY_BANNED` | 409 | Ban action on already-banned user |
| `USER_NOT_BANNED` | 422 | Unban action on user who is not banned |
| `INVALID_CURRENCY` | 400 | Currency value not 'gold' or 'gems' |
| `COOLDOWN_ACTIVE` | 422 | Cannot perform action during cooldown |
| `RENDER_JOB_NOT_FOUND` | 404 | Render job ID does not exist |
| `RENDER_JOB_FAILED` | 500 | Render job encountered an error |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests from this client |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## 5. Users & Profiles

### GET /api/v1/users

List all users with optional filtering.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 20, max: 100) |
| `status` | string | Filter by accountStatus (`active`, `banned`, `suspended`) |
| `isPremium` | boolean | Filter premium users |
| `discordId` | string | Exact match on discordId |
| `username` | string | Partial match on username |
| `sortBy` | string | `registeredAt`, `lastActiveAt`, `username` |
| `sortOrder` | string | `asc`, `desc` |

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "discordId": "123456789012345678",
      "username": "HeroPlayer",
      "globalName": "HeroPlayer",
      "accountStatus": "active",
      "isPremium": true,
      "premiumTier": 2,
      "registeredAt": "2024-01-15T09:30:00.000Z",
      "lastActiveAt": "2025-01-01T11:58:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 45230, "totalPages": 2262, "hasNext": true, "hasPrev": false }
}
```

---

### GET /api/v1/users/:discordId

Retrieve full user and profile data.

**Path Parameters:**
- `discordId` (string, required): Discord Snowflake ID

**Response 200:**
```json
{
  "success": true,
  "data": {
    "discordId": "123456789012345678",
    "username": "HeroPlayer",
    "globalName": "HeroPlayer",
    "avatar": "a_abc123def456",
    "accountStatus": "active",
    "isPremium": true,
    "premiumTier": 2,
    "premiumExpiry": "2025-06-01T00:00:00.000Z",
    "isBeta": false,
    "registeredAt": "2024-01-15T09:30:00.000Z",
    "lastActiveAt": "2025-01-01T11:58:00.000Z",
    "profile": {
      "displayName": "HeroPlayer",
      "title": "Dragon Slayer",
      "bio": "First to slay the Eternal Drake.",
      "totalBattlesWon": 1250,
      "totalBattlesLost": 340,
      "totalRaidsCompleted": 87,
      "seasonPoints": 4520,
      "guildId": "guild_01J..."
    },
    "activeCharacter": {
      "characterId": "char_01J...",
      "name": "Aethon",
      "classId": "warrior",
      "level": 67,
      "battlePower": 28450
    }
  }
}
```

**Response 404:**
```json
{
  "success": false,
  "error": { "code": "USER_NOT_FOUND", "message": "User '123456789012345678' not found" }
}
```

---

### PATCH /api/v1/users/:discordId

Update user account settings (admin only).

**Request Body:**
```json
{
  "accountStatus": "active",
  "isPremium": true,
  "premiumTier": 2,
  "premiumExpiry": "2025-12-31T23:59:59Z"
}
```

All fields optional. Only provided fields are updated.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "discordId": "123456789012345678",
    "accountStatus": "active",
    "isPremium": true,
    "premiumTier": 2,
    "updatedAt": "2025-01-01T12:00:00.000Z"
  }
}
```

---

### GET /api/v1/users/:discordId/activity

Retrieve paginated activity history for a user.

**Query Parameters:**
- `type`: `battle`, `economy`, `quest`, `guild`, `all` (default: `all`)
- `dateFrom`, `dateTo`: ISO 8601 date range
- `page`, `limit`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "eventType": "battle_completed",
      "description": "Won PvP battle against @OpponentPlayer",
      "timestamp": "2025-01-01T11:55:00.000Z",
      "metadata": { "battleId": "battle_01J...", "goldGained": 850, "expGained": 340 }
    }
  ],
  "pagination": { ... }
}
```

---

### DELETE /api/v1/users/:discordId/cooldowns

Reset all game cooldowns for a user (admin operation).

**Headers required:** `X-Admin-Discord-Id`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "clearedCooldowns": ["battle_pvp", "battle_dungeon", "daily_reward"],
    "performedBy": "admin_disc_000001",
    "timestamp": "2025-01-01T12:00:00.000Z"
  }
}
```

---

## 6. Characters

### GET /api/v1/characters/:characterId

Retrieve full character data including computed stats.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "characterId": "char_01J...",
    "userId": "user_01J...",
    "discordId": "123456789012345678",
    "name": "Aethon",
    "classId": "warrior",
    "subclassId": "berserker",
    "level": 67,
    "experience": 2450000,
    "awakening": 3,
    "isActive": true,
    "stats": {
      "hp": 8450,
      "maxHp": 8450,
      "mp": 1200,
      "maxMp": 1200,
      "attack": 3240,
      "defense": 2180,
      "magicAttack": 1050,
      "magicDefense": 1480,
      "speed": 1840,
      "luck": 720,
      "critRate": 0.22,
      "critDamage": 1.85,
      "evasion": 0.08,
      "accuracy": 0.95
    },
    "derivedStats": {
      "effectiveAttack": 4120,
      "effectiveDefense": 2950,
      "battlePower": 28450
    },
    "equippedSkills": {
      "slot1": "shield_bash",
      "slot2": "war_cry",
      "slot3": "blade_storm",
      "slot4": "iron_skin",
      "ultimate": "berserk_rampage"
    },
    "locationId": "continent_azura",
    "zoneId": "ironpeak_mountains",
    "cooldowns": {
      "lastBattleAt": "2025-01-01T11:50:00.000Z",
      "lastDungeonAt": "2025-01-01T08:00:00.000Z"
    }
  }
}
```

---

### GET /api/v1/users/:discordId/characters

List all characters for a user.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "characterId": "char_01J...",
      "name": "Aethon",
      "classId": "warrior",
      "level": 67,
      "battlePower": 28450,
      "isActive": true
    },
    {
      "characterId": "char_02J...",
      "name": "Lyra",
      "classId": "mage",
      "level": 42,
      "battlePower": 15200,
      "isActive": false
    }
  ]
}
```

---

## 7. Economy

### GET /api/v1/economy/users/:discordId

Get current balance for a user.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "discordId": "123456789012345678",
    "gold": 125400,
    "gems": 850,
    "seasonalTokens": 320,
    "totalGoldEarned": 4520000,
    "totalGoldSpent": 4394600,
    "suspiciousActivityScore": 0,
    "lastTransactionAt": "2025-01-01T11:55:00.000Z"
  }
}
```

---

### GET /api/v1/economy/users/:discordId/transactions

Paginated transaction history.

**Query Parameters:**
- `currency`: `gold`, `gems`, `all` (default: `all`)
- `type`: `credit`, `debit`, `transfer`, `all`
- `dateFrom`, `dateTo`
- `page`, `limit`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "transactionId": "txn_01J...",
      "type": "credit",
      "amount": 1250,
      "currency": "gold",
      "reason": "battle_reward",
      "balanceAfter": 125400,
      "timestamp": "2025-01-01T11:55:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

### POST /api/v1/economy/users/:discordId/credit

Credit gold or gems to a user (admin operation).

**Headers required:** `X-Admin-Discord-Id`

**Request Body:**
```json
{
  "amount": 5000,
  "currency": "gold",
  "reason": "Bug compensation — ticket #4521"
}
```

**Validation:**
- `amount`: integer, 1 ≤ amount ≤ 10,000,000
- `currency`: `"gold"` or `"gems"`
- `reason`: string, 10–500 characters

**Response 201:**
```json
{
  "success": true,
  "data": {
    "transactionId": "txn_01J...",
    "discordId": "123456789012345678",
    "type": "credit",
    "amount": 5000,
    "currency": "gold",
    "balanceBefore": 120400,
    "balanceAfter": 125400,
    "reason": "Bug compensation — ticket #4521",
    "performedBy": "admin_disc_000001",
    "timestamp": "2025-01-01T12:00:00.000Z"
  }
}
```

**Response 422:**
```json
{
  "success": false,
  "error": { "code": "VALIDATION_ERROR", "message": "Amount must be a positive integer", "field": "amount" }
}
```

---

### POST /api/v1/economy/users/:discordId/debit

Debit gold or gems from a user (admin operation).

**Headers required:** `X-Admin-Discord-Id`

**Request Body:**
```json
{
  "amount": 5000,
  "currency": "gold",
  "reason": "Economy correction — excess gold from exploit"
}
```

**Response 201:** Same structure as credit.

**Response 422 (insufficient funds):**
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "User balance (2500 gold) is less than requested debit (5000 gold)"
  }
}
```

---

### GET /api/v1/economy/health

Economy health metrics for the entire game.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalGoldSupply": 8450000000,
    "totalGemsSupply": 2340000,
    "goldCreatedLast24h": 125000000,
    "goldDestroyedLast24h": 118000000,
    "netGoldInflation24h": 7000000,
    "averagePlayerGold": 28450,
    "medianPlayerGold": 12300,
    "top100PlayerGoldShare": 0.34,
    "marketplaceVolumeGold24h": 45000000,
    "suspiciousActivityFlags24h": 12,
    "autoFrozenAccounts": 2,
    "timestamp": "2025-01-01T12:00:00.000Z"
  }
}
```

---

### GET /api/v1/economy/leaderboard

Top players by gold balance.

**Query Parameters:**
- `currency`: `gold` or `gems` (default: `gold`)
- `limit`: 1–100 (default: 50)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "discordId": "111111111111111111",
      "displayName": "WealthyPlayer",
      "gold": 45000000,
      "lastActiveAt": "2025-01-01T10:00:00.000Z"
    }
  ]
}
```

---

## 8. Inventory

### GET /api/v1/inventory/users/:discordId

Get paginated inventory for a user.

**Query Parameters:**
- `type`: `weapon`, `armor`, `consumable`, `material`, `cosmetic`, `key`, `all`
- `rarity`: `common`, `uncommon`, `rare`, `epic`, `legendary`, `mythic`, `all`
- `isEquipped`: `true`, `false`, `all`
- `page`, `limit`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "inventoryId": "inv_01J...",
      "itemId": "sword_legendary_001",
      "itemName": "Blade of the Eternal Storm",
      "itemType": "weapon",
      "itemRarity": "legendary",
      "quantity": 1,
      "isEquipped": true,
      "equippedSlot": "weapon",
      "isLocked": false,
      "acquiredFrom": "dungeon_drop",
      "acquiredAt": "2025-01-01T08:15:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

### GET /api/v1/inventory/users/:discordId/equipment

Get currently equipped items for the active character.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "characterId": "char_01J...",
    "slots": {
      "weapon": {
        "inventoryId": "inv_01J...",
        "itemId": "sword_legendary_001",
        "itemName": "Blade of the Eternal Storm",
        "stats": { "attack": 880, "critRate": 0.08 },
        "enchantmentLevel": 5
      },
      "offHand": null,
      "helm": { "inventoryId": "inv_02J...", "itemName": "Ironpeak Warhelm", ... },
      "chest": null,
      "legs": null,
      "boots": null,
      "ring1": null,
      "ring2": null,
      "amulet": null,
      "relic": null
    },
    "aggregatedStats": {
      "attack": 1240,
      "defense": 680,
      "critRate": 0.12
    },
    "activeSetBonuses": []
  }
}
```

---

### POST /api/v1/inventory/users/:discordId/grant

Grant an item to a user (admin operation).

**Headers required:** `X-Admin-Discord-Id`

**Request Body:**
```json
{
  "itemId": "sword_legendary_001",
  "quantity": 1,
  "reason": "Content creator reward — stream event"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "inventoryId": "inv_01J...",
    "itemId": "sword_legendary_001",
    "itemName": "Blade of the Eternal Storm",
    "quantity": 1,
    "grantedTo": "123456789012345678",
    "performedBy": "admin_disc_000001",
    "reason": "Content creator reward — stream event",
    "timestamp": "2025-01-01T12:00:00.000Z"
  }
}
```

---

### DELETE /api/v1/inventory/:inventoryId

Remove an item from a player's inventory (admin operation).

**Headers required:** `X-Admin-Discord-Id`

**Request Body:**
```json
{
  "reason": "Item exploited via dupe bug — exploit fix #872"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "inventoryId": "inv_01J...",
    "removedFrom": "123456789012345678",
    "itemId": "sword_legendary_001",
    "performedBy": "admin_disc_000001",
    "reason": "Item exploited via dupe bug — exploit fix #872",
    "timestamp": "2025-01-01T12:00:00.000Z"
  }
}
```

---

## 9. Guilds

### GET /api/v1/guilds

List guilds with filtering.

**Query Parameters:**
- `page`, `limit`
- `sortBy`: `level`, `memberCount`, `seasonPoints`, `createdAt`
- `sortOrder`: `asc`, `desc`
- `name`: partial name search
- `discordGuildId`: filter by Discord server

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "guildId": "guild_01J...",
      "name": "Ascension Vanguard",
      "tag": "[ASCE]",
      "level": 28,
      "memberCount": 42,
      "maxMembers": 50,
      "seasonPoints": 18450,
      "leaderId": "user_01J...",
      "leaderDiscordId": "111111111111111111",
      "createdAt": "2024-02-01T00:00:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

### GET /api/v1/guilds/:guildId

Get full guild information.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "guildId": "guild_01J...",
    "name": "Ascension Vanguard",
    "tag": "[ASCE]",
    "description": "Elite raiders of Ethoria.",
    "level": 28,
    "experience": 4500000,
    "memberCount": 42,
    "maxMembers": 50,
    "bankGold": 2500000,
    "seasonPoints": 18450,
    "totalWins": 3450,
    "totalRaids": 892,
    "joinRequirements": {
      "minLevel": 50,
      "minBattlePower": 15000,
      "requireApplication": true
    },
    "isPublic": true,
    "isRecruiting": true,
    "leaderId": "user_01J...",
    "officerCount": 4,
    "discordGuildId": "987654321098765432",
    "createdAt": "2024-02-01T00:00:00.000Z"
  }
}
```

---

### GET /api/v1/guilds/:guildId/members

Paginated member list for a guild.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "userId": "user_01J...",
      "discordId": "123456789012345678",
      "displayName": "HeroPlayer",
      "role": "officer",
      "characterName": "Aethon",
      "characterClass": "warrior",
      "characterLevel": 67,
      "battlePower": 28450,
      "weeklyContribution": 4500,
      "joinedAt": "2024-02-15T10:00:00.000Z",
      "lastActiveAt": "2025-01-01T11:58:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

### POST /api/v1/guilds/:guildId/bank/grant

Grant gold or items to the guild bank (admin operation).

**Headers required:** `X-Admin-Discord-Id`

**Request Body:**
```json
{
  "gold": 100000,
  "reason": "Guild achievement reward — first server clear"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "guildId": "guild_01J...",
    "goldGranted": 100000,
    "bankGoldAfter": 2600000,
    "performedBy": "admin_disc_000001",
    "reason": "Guild achievement reward — first server clear",
    "timestamp": "2025-01-01T12:00:00.000Z"
  }
}
```

---

### DELETE /api/v1/guilds/:guildId

Dissolve a guild (admin operation).

**Headers required:** `X-Admin-Discord-Id`

**Request Body:**
```json
{
  "reason": "Guild leadership requested dissolution"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "guildId": "guild_01J...",
    "membersNotified": 42,
    "performedBy": "admin_disc_000001",
    "timestamp": "2025-01-01T12:00:00.000Z"
  }
}
```

---

## 10. Battles

### GET /api/v1/battles

List battles with filtering.

**Query Parameters:**
- `userId`: filter by participant discordId
- `type`: `pvp`, `pve`, `raid`, `dungeon`, `boss`
- `status`: `pending`, `completed`, `failed`, `error`
- `dateFrom`, `dateTo`
- `page`, `limit`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "battleId": "battle_01J...",
      "type": "pvp",
      "status": "completed",
      "attackerDiscordId": "123456789012345678",
      "attackerName": "Aethon",
      "defenderDiscordId": "987654321098765432",
      "defenderName": "Shadowstrike",
      "winnerDiscordId": "123456789012345678",
      "rounds": 8,
      "completedAt": "2025-01-01T11:55:10.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

### GET /api/v1/battles/:battleId

Get full battle record.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "battleId": "battle_01J...",
    "type": "pvp",
    "status": "completed",
    "seed": 1234567890,
    "engineVersion": "1.4.2",
    "attacker": {
      "discordId": "123456789012345678",
      "characterName": "Aethon",
      "classId": "warrior",
      "level": 67,
      "battlePower": 28450,
      "snapshotStats": { ... }
    },
    "defender": {
      "discordId": "987654321098765432",
      "characterName": "Shadowstrike",
      "classId": "rogue",
      "level": 65,
      "battlePower": 26800,
      "snapshotStats": { ... }
    },
    "winnerId": "123456789012345678",
    "rounds": 8,
    "rewards": {
      "attackerGold": 1250,
      "attackerExp": 340,
      "defenderGold": 125,
      "defenderExp": 170,
      "itemDrops": []
    },
    "gifUrl": "https://cdn.ascension-legends.com/battles/battle_01J....gif",
    "mp4Url": null,
    "startedAt": "2025-01-01T11:55:00.000Z",
    "completedAt": "2025-01-01T11:55:10.000Z"
  }
}
```

---

### GET /api/v1/battles/:battleId/replay

Get full replay JSON for a battle (large payload).

**Response 200:**
```json
{
  "success": true,
  "data": {
    "battleId": "battle_01J...",
    "seed": 1234567890,
    "engineVersion": "1.4.2",
    "participants": [ ... ],
    "rounds": [
      {
        "roundNumber": 1,
        "turns": [
          {
            "participantId": "char_01J...",
            "action": {
              "type": "skill",
              "skillId": "blade_storm",
              "targetIds": ["char_02J..."]
            },
            "results": [
              {
                "type": "damage",
                "targetId": "char_02J...",
                "baseDamage": 3240,
                "finalDamage": 4120,
                "isCritical": true,
                "remainingHp": 6450
              }
            ],
            "endState": { "hp": 8450, "mp": 1050, "statusEffects": [] }
          }
        ]
      }
    ],
    "result": { "winnerId": "char_01J...", "endRound": 8, "reason": "opponent_hp_zero" }
  }
}
```

---

## 11. Marketplace

### GET /api/v1/marketplace/listings

List active marketplace listings.

**Query Parameters:**
- `itemId`, `itemType`, `itemRarity`
- `sellerId`: filter by seller discordId
- `status`: `active`, `sold`, `cancelled`, `expired`, `all`
- `priceMin`, `priceMax`
- `currency`: `gold`, `gems`
- `page`, `limit`
- `sortBy`: `pricePerUnit`, `listedAt`
- `sortOrder`: `asc`, `desc`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "listingId": "listing_01J...",
      "sellerDiscordId": "123456789012345678",
      "sellerDisplayName": "HeroPlayer",
      "itemId": "sword_epic_042",
      "itemName": "Stormcaller Blade",
      "itemRarity": "epic",
      "quantity": 1,
      "pricePerUnit": 45000,
      "currency": "gold",
      "listedAt": "2025-01-01T08:00:00.000Z",
      "expiresAt": "2025-01-08T08:00:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

### DELETE /api/v1/marketplace/listings/:listingId

Remove a listing (admin operation).

**Headers required:** `X-Admin-Discord-Id`

**Request Body:**
```json
{
  "reason": "Listing exploits pricing algorithm — investigation #4521"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "listingId": "listing_01J...",
    "removedBy": "admin_disc_000001",
    "sellerRefunded": true,
    "goldRefunded": 0,
    "itemReturned": true,
    "timestamp": "2025-01-01T12:00:00.000Z"
  }
}
```

---

## 12. Quests

### GET /api/v1/quests

List all quest definitions.

**Query Parameters:**
- `category`: `main`, `side`, `daily`, `weekly`, `guild`, `event`, `all`
- `chapter`: filter by story chapter number
- `isActive`: `true`, `false`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "questId": "main_001_ch1",
      "name": "The First Step",
      "category": "main",
      "chapter": 1,
      "minLevel": 1,
      "rewardXp": 500,
      "rewardGold": 200,
      "isActive": true
    }
  ]
}
```

---

### GET /api/v1/quests/users/:discordId

Get quest state for a user.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "activeQuests": [
      {
        "questId": "side_042",
        "name": "Goblin Infestation",
        "progress": { "kill_goblins": 7, "kill_goblin_king": 0 },
        "required": { "kill_goblins": 10, "kill_goblin_king": 1 },
        "acceptedAt": "2025-01-01T10:00:00.000Z",
        "expiresAt": null
      }
    ],
    "completedQuestCount": 147,
    "dailyQuestsCompletedToday": 2,
    "weeklyQuestsCompletedThisWeek": 4
  }
}
```

---

### POST /api/v1/quests/users/:discordId/complete

Force-complete a quest (admin operation, for testing or compensation).

**Headers required:** `X-Admin-Discord-Id`

**Request Body:**
```json
{
  "questId": "side_042",
  "reason": "Quest bugged — rewards granted manually"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "questId": "side_042",
    "rewardsDistributed": true,
    "goldAwarded": 500,
    "expAwarded": 250,
    "performedBy": "admin_disc_000001",
    "timestamp": "2025-01-01T12:00:00.000Z"
  }
}
```

---

## 13. Raids & Bosses

### GET /api/v1/raids

List raids with filtering.

**Query Parameters:**
- `status`: `forming`, `active`, `completed`, `failed`, `expired`
- `leaderId`: filter by leader discordId
- `raidTemplateId`
- `discordGuildId`
- `dateFrom`, `dateTo`
- `page`, `limit`

---

### GET /api/v1/raids/:raidId

Get full raid details and participant status.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "raidId": "raid_01J...",
    "raidTemplateId": "raid_dragon_lair",
    "difficulty": "extreme",
    "status": "completed",
    "participants": [
      {
        "discordId": "123456789012345678",
        "characterName": "Aethon",
        "role": "tank",
        "damageDealt": 145000,
        "healingDone": 0,
        "isDead": false
      }
    ],
    "bossesDefeated": ["wyrmguard", "ashdrake", "eternal_dragon"],
    "completedAt": "2025-01-01T09:45:00.000Z",
    "rewardsDistributed": true
  }
}
```

---

### GET /api/v1/bosses/active

List all currently active world bosses across all Discord servers.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "bossId": "boss_instance_01J...",
      "bossTemplateId": "world_boss_titan_rex",
      "bossName": "Titan Rex",
      "discordGuildId": "987654321098765432",
      "status": "active",
      "currentHp": 4500000,
      "maxHp": 10000000,
      "hpPercent": 45,
      "phase": 2,
      "attackerCount": 34,
      "spawnedAt": "2025-01-01T10:00:00.000Z",
      "despawnAt": "2025-01-02T10:00:00.000Z"
    }
  ]
}
```

---

### POST /api/v1/bosses/spawn

Trigger a world boss spawn (admin operation).

**Headers required:** `X-Admin-Discord-Id`

**Request Body:**
```json
{
  "bossTemplateId": "world_boss_titan_rex",
  "locationId": "continent_azura",
  "discordGuildId": "987654321098765432",
  "customHpMultiplier": 1.5
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "bossId": "boss_instance_01J...",
    "bossName": "Titan Rex",
    "currentHp": 15000000,
    "maxHp": 15000000,
    "spawnedAt": "2025-01-01T12:00:00.000Z",
    "despawnAt": "2025-01-02T12:00:00.000Z",
    "announcementSent": true
  }
}
```

---

## 14. Moderation

### GET /api/v1/moderation/reports

List player reports.

**Query Parameters:**
- `status`: `pending`, `resolved`, `dismissed`
- `targetId`: filter by reported user discordId
- `reporterId`: filter by reporter discordId
- `dateFrom`, `dateTo`
- `page`, `limit`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "reportId": "report_01J...",
      "reporterDiscordId": "111111111111111111",
      "targetDiscordId": "222222222222222222",
      "reason": "Suspected economy manipulation",
      "evidence": "Trade ID: trade_01J..., circular pattern within 5 minutes",
      "status": "pending",
      "createdAt": "2025-01-01T10:00:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

### POST /api/v1/moderation/actions

Apply a moderation action.

**Headers required:** `X-Admin-Discord-Id`

**Request Body:**
```json
{
  "targetDiscordId": "222222222222222222",
  "action": "ban",
  "reason": "Confirmed economy exploit — circular trading with bot accounts",
  "durationSeconds": null,
  "relatedReportId": "report_01J..."
}
```

**Valid actions:** `warn`, `ban`, `unban`, `mute`, `economy_freeze`, `account_flag`

**Response 201:**
```json
{
  "success": true,
  "data": {
    "moderationId": "mod_01J...",
    "targetDiscordId": "222222222222222222",
    "action": "ban",
    "isPermanent": true,
    "notificationSent": true,
    "performedBy": "admin_disc_000001",
    "timestamp": "2025-01-01T12:00:00.000Z"
  }
}
```

---

### GET /api/v1/moderation/users/:discordId/history

Get moderation history for a user.

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "moderationId": "mod_01J...",
      "action": "warn",
      "reason": "Inappropriate language in trade messages",
      "performedBy": "admin_disc_000001",
      "isActive": false,
      "createdAt": "2024-12-01T10:00:00.000Z"
    }
  ]
}
```

---

### GET /api/v1/moderation/anticheat/flags

Get anti-cheat flagged accounts.

**Query Parameters:**
- `minScore`: minimum suspiciousActivityScore (default: 50)
- `status`: `pending_review`, `cleared`, `actioned`, `all`
- `page`, `limit`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "discordId": "333333333333333333",
      "displayName": "SuspiciousPlayer",
      "suspiciousActivityScore": 85,
      "flags": [
        { "type": "rapid_gold_gain", "detail": "Gained 500000 gold in 5 minutes", "timestamp": "..." },
        { "type": "circular_trade", "detail": "Traded items back and forth with account 444...", "timestamp": "..." }
      ],
      "status": "pending_review",
      "flaggedAt": "2025-01-01T09:00:00.000Z"
    }
  ]
}
```

---

## 15. Analytics

### GET /api/v1/analytics/dau

Daily Active Users time series.

**Query Parameters:**
- `dateFrom` (required): ISO 8601 start date
- `dateTo` (required): ISO 8601 end date

**Response 200:**
```json
{
  "success": true,
  "data": {
    "series": [
      { "date": "2025-01-01", "dau": 45230, "newUsers": 1240, "returningUsers": 43990 },
      { "date": "2025-01-02", "dau": 42100, "newUsers": 890, "returningUsers": 41210 }
    ],
    "totalDays": 2,
    "averageDau": 43665,
    "peakDau": 45230
  }
}
```

---

### GET /api/v1/analytics/battles

Battle statistics time series.

**Query Parameters:**
- `dateFrom`, `dateTo` (required)
- `type`: `pvp`, `pve`, `raid`, `dungeon`, `boss`, `all`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "series": [
      {
        "date": "2025-01-01",
        "totalBattles": 125400,
        "pvpBattles": 45200,
        "pveBattles": 62100,
        "raidBattles": 8900,
        "dungeonBattles": 9200,
        "avgRoundsPerBattle": 7.4,
        "avgSimulationMs": 142
      }
    ]
  }
}
```

---

### GET /api/v1/analytics/economy

Economy health time series.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "series": [
      {
        "date": "2025-01-01",
        "goldCreated": 125000000,
        "goldDestroyed": 118000000,
        "netInflation": 7000000,
        "marketplaceVolume": 45000000,
        "avgTransactionSize": 2450,
        "uniqueTraders": 12400
      }
    ]
  }
}
```

---

### GET /api/v1/analytics/retention

Player retention cohort analysis.

**Query Parameters:**
- `cohortDate` (required): ISO 8601 date (cohort = players who registered on this date)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "cohortDate": "2025-01-01",
    "cohortSize": 1240,
    "retention": [
      { "day": 0, "retained": 1240, "rate": 1.0 },
      { "day": 1, "retained": 890, "rate": 0.718 },
      { "day": 7, "retained": 540, "rate": 0.435 },
      { "day": 30, "retained": 280, "rate": 0.226 }
    ]
  }
}
```

---

## 16. Render

### POST /api/v1/render/battle/:battleId

Trigger a render job for a battle.

**Request Body:**
```json
{
  "format": "gif",
  "quality": "high"
}
```

**Valid formats:** `gif`, `mp4`  
**Valid quality:** `low`, `medium`, `high` (default: `medium`)

**Response 202:**
```json
{
  "success": true,
  "data": {
    "jobId": "rjob_01J...",
    "battleId": "battle_01J...",
    "format": "gif",
    "status": "queued",
    "estimatedCompletionMs": 15000
  }
}
```

---

### GET /api/v1/render/jobs/:jobId

Check status of a render job.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "jobId": "rjob_01J...",
    "status": "completed",
    "url": "https://cdn.ascension-legends.com/renders/battle_01J....gif",
    "fileSizeBytes": 4250000,
    "renderDurationMs": 8420,
    "completedAt": "2025-01-01T12:00:08.000Z"
  }
}
```

**Possible statuses:** `queued`, `processing`, `completed`, `failed`

**Response 200 (failed):**
```json
{
  "success": true,
  "data": {
    "jobId": "rjob_01J...",
    "status": "failed",
    "error": "Asset not found: character sprite warrior/attack/0.png",
    "failedAt": "2025-01-01T12:00:03.000Z"
  }
}
```

---

### POST /api/v1/render/profile/:discordId

Trigger a profile card render.

**Response 202:**
```json
{
  "success": true,
  "data": {
    "jobId": "rjob_02J...",
    "status": "queued"
  }
}
```

---

## 17. Admin Operations

### POST /api/v1/admin/broadcast

Send a broadcast message to players.

**Headers required:** `X-Admin-Discord-Id`

**Request Body:**
```json
{
  "message": "⚔️ **WORLD EVENT STARTING!** The Eternal Dragon has awakened. Battle begins in 1 hour!",
  "scope": "guild",
  "discordGuildId": "987654321098765432",
  "channelId": "123456789012345678"
}
```

**Valid scopes:** `guild` (specific guild), `global` (all active guilds)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "scope": "guild",
    "messagesQueued": 1,
    "estimatedDeliveryMs": 2000,
    "performedBy": "admin_disc_000001",
    "timestamp": "2025-01-01T12:00:00.000Z"
  }
}
```

---

### GET /api/v1/admin/audit-log

Retrieve audit log entries.

**Query Parameters:**
- `adminId`: filter by performer discordId
- `targetId`: filter by target discordId
- `actionType`: filter by action type
- `dateFrom`, `dateTo`
- `page`, `limit`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "auditId": "audit_01J...",
      "action": "economy_credit",
      "actorType": "admin",
      "actorDiscordId": "admin_disc_000001",
      "targetDiscordId": "123456789012345678",
      "details": {
        "amount": 5000,
        "currency": "gold",
        "reason": "Bug compensation — ticket #4521"
      },
      "timestamp": "2025-01-01T12:00:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

---

### GET /api/v1/admin/system-stats

Real-time system statistics.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "bot": {
      "shardsOnline": 8,
      "shardsTotal": 8,
      "guildsServed": 12450,
      "interactionsLastHour": 84500
    },
    "players": {
      "dau": 45230,
      "activeLast1h": 8420,
      "activeBattles": 234,
      "activeRaids": 12
    },
    "workers": {
      "renderQueueDepth": 8,
      "notifQueueDepth": 34,
      "failedJobsLast1h": 2
    },
    "database": {
      "mongodbLatencyMs": 4,
      "redisLatencyMs": 1,
      "mongodbConnections": 45
    },
    "timestamp": "2025-01-01T12:00:00.000Z"
  }
}
```

---

## 18. Health & Status

### GET /health

Liveness probe. Returns 200 if the process is running.

**Response 200:**
```json
{
  "status": "alive",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

---

### GET /health/ready

Readiness probe. Returns 200 only if all dependencies are healthy.

**Response 200 (healthy):**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T12:00:00.000Z",
  "version": "1.4.2",
  "checks": {
    "mongodb": { "status": "healthy", "latencyMs": 3, "replicaSetStatus": "primary" },
    "redis": { "status": "healthy", "latencyMs": 1, "cluster": true },
    "queues": { "status": "healthy", "queueCount": 6 }
  }
}
```

**Response 503 (unhealthy):**
```json
{
  "status": "unhealthy",
  "timestamp": "2025-01-01T12:00:00.000Z",
  "checks": {
    "mongodb": { "status": "unhealthy", "error": "Connection timeout after 5000ms" },
    "redis": { "status": "healthy", "latencyMs": 1 },
    "queues": { "status": "healthy" }
  }
}
```

---

### GET /metrics

Prometheus metrics endpoint (restricted to monitoring network).

Returns text format Prometheus metrics.

```
# HELP bot_interactions_total Total Discord interactions processed
# TYPE bot_interactions_total counter
bot_interactions_total{type="command",command="battle",shard="0",status="success"} 45230
...
```

---

*API Specification v1.0.0 — All endpoints subject to change; breaking changes require version bump.*
