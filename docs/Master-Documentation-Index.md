# ASCENSION LEGENDS — Master Documentation Index

> **Purpose:** Single authoritative index of every document in the Ascension Legends documentation suite. Use this as the entry point for all documentation navigation.
>
> **Last updated:** See git log for latest revision date.

---

## Core Design & Architecture (The Four Books)

| Document | Path | Contents | Audience |
|----------|------|----------|---------|
| **Book 1 — Game Developer Bible** | `docs/Book1-Game-Developer-Bible.md` | Game vision, core loop, character stats, economy design, battle system, skill/transformation systems, Discord commands reference, scalability architecture | All team members |
| **Book 2 — Content Bible** | `docs/Book2-Content-Bible.md` | World of Aethon lore, the ten continents, faction guide, class content detail, story structure, narrative voice, content calendar | Design, Art, Writing |
| **Book 3 — Technical Architecture Bible** | `docs/Book3-Technical-Architecture-Bible.md` | Full system architecture, service topology, data models, infrastructure decisions, coding standards, API design, performance targets | Engineering |
| **Book 4 — Operations & Live-Service Bible** | `docs/Book4-Operations-Live-Service-Bible.md` | Live service philosophy, deployment strategy, server operations, monitoring, incident response, backups, security operations, economy operations, balance workflow, season management, events, community, support, QA, disaster recovery, analytics, release management, future expansions, team structure, pre-launch checklist | All team members, operations-focused |

---

## Technical Reference

| Document | Path | Contents | Audience |
|----------|------|----------|---------|
| **API Specification** | `docs/API-Specification.md` | Internal Admin API endpoints, authentication, request/response schemas, error codes | Engineering, Support |
| **Database Schema** | `docs/Database-Schema.md` | MongoDB collection schemas, index definitions, relationships, migration history | Engineering, Database |
| **Architecture Decision Records** | `docs/Architecture-Decision-Records.md` | ADR-001 through ADR-022: every significant architectural decision with context and rationale | Engineering |
| **Engineering Standards** | `docs/Engineering-Standards.md` | Code style, TypeScript conventions, testing requirements, PR process, commit format | Engineering |

---

## Operations Reference

| Document | Path | Contents | Audience |
|----------|------|----------|---------|
| **Runbook** | `docs/Runbook.md` | Step-by-step operational procedures: deployments, rollbacks, health checks, feature flags, incident triage, database/Redis/shard operations, maintenance windows, on-call handoff | SRE, On-call engineers |
| **Monitoring Checklist** | `docs/Monitoring-Checklist.md` | Daily, weekly, and monthly monitoring tasks; alert threshold reference card; Grafana dashboard URLs | SRE, On-call engineers |
| **Release Checklist** | `docs/Release-Checklist.md` | Gate-by-gate release checklist for every production deployment; hotfix abbreviated checklist | Engineering, QA, Technical Director |
| **Disaster Recovery Plan** | `docs/Disaster-Recovery-Plan.md` | DR Level 1/2/3 procedures, communication templates, recovery verification, compensation policy, annual drill procedure | All engineers, DR team |

---

## Policies & Security

| Document | Path | Contents | Audience |
|----------|------|----------|---------|
| **Security Policy** | `docs/Security-Policy.md` | Access control policy, authentication requirements, secrets management, code security standards, data protection, audit logging, vulnerability management, player data privacy, responsible disclosure | All team members with system access |

---

## Project Management

| Document | Path | Contents | Audience |
|----------|------|----------|---------|
| **Changelog** | `docs/CHANGELOG.md` | Version history, release notes archive | All team |
| **Roadmap** | `docs/ROADMAP.md` | Product roadmap: features, seasons, expansions by timeline | All team, Game Director |
| **Deployment Guide** | `docs/Deployment-Guide.md` | Infrastructure setup, environment configuration, first-deploy walkthrough | Engineering, DevOps |

---

## Quick Navigation by Role

### New Team Member (Any Role)
1. Book 1 — Game Developer Bible (start here, all of it)
2. Book 2 — Content Bible (skim for world/lore context)
3. Your role-specific section below

### Engineer (New)
1. Book 3 — Technical Architecture Bible
2. `docs/Engineering-Standards.md`
3. `docs/Architecture-Decision-Records.md`
4. `docs/Database-Schema.md`
5. `docs/API-Specification.md`

### On-Call Engineer
1. Book 4 Sections 4 (Monitoring), 5 (Incident Response), 15 (Disaster Recovery)
2. `docs/Runbook.md` ← keep this open during shifts
3. `docs/Monitoring-Checklist.md`
4. `docs/Disaster-Recovery-Plan.md`

### SRE / DevOps
1. Book 3 (architecture) + Book 4 Sections 2 (Deployment), 3 (Server Ops), 4 (Monitoring)
2. `docs/Runbook.md`
3. `docs/Monitoring-Checklist.md`
4. `docs/Deployment-Guide.md`

### Game Designer / Systems Designer
1. Book 1 + Book 2 (complete)
2. Book 4 Sections 8 (Economy Operations), 9 (Balance Patch Workflow), 10 (Season Management), 11 (Events)

### Economy Analyst
1. Book 1 (economy sections)
2. Book 4 Section 8 (Economy Operations) — primary reference
3. Book 4 Section 9 (Balance Patch Workflow)

### Community Lead / Community Manager
1. Book 4 Sections 12 (Community Management), 13 (Customer Support), 11 (Events)

### QA Engineer
1. Book 4 Section 14 (Quality Assurance) — primary reference
2. `docs/Release-Checklist.md`
3. `docs/Engineering-Standards.md` (testing section)

### Support Agent
1. Book 4 Section 13 (Customer Support)
2. `docs/Security-Policy.md` (data protection and player data sections)

---

## Terminology Quick Reference

| Term | Definition | Source |
|------|-----------|--------|
| Aethon | The game world of Ascension Legends | Book 1 §1.1, Book 2 |
| Ascendance Energy (AE) | Fundamental force of Aethon, manifests in six Frequencies | Book 1 §1.1 |
| Frequencies | The six AE types: Ignara, Terris, Aeryn, Aquaris, Umbris, Luminara | Book 1 §2.1 |
| The Fracture | Planetary resonance collapse 90,000 years ago | Book 1 §1.3, Book 2 §1.1 |
| Resonance Points | High-AE concentration locations for training/dungeons/boss spawns | Book 1 §2.2 |
| Ascension Rite | Prestige mechanic: Level 100 reset for permanent bonuses | Book 1 §3.3 |
| Power Rating (PR) | Composite combat effectiveness score for matchmaking | Book 1 §4.2 |
| Cinematic Battle System | Server-side canvas renderer producing animated battle GIF/MP4 | Book 3 §6.2 |
| Gold (⚙️) | Primary everyday currency | Book 1 §5.1 |
| Crystals (💎) | Mid-tier gameplay-earned currency | Book 1 §5.1 |
| Guild Coins (🏛️) | Guild participation currency | Book 1 §5.1 |
| Raid Tokens (⚔️) | Raid completion currency | Book 1 §5.1 |
| Arena Tokens (🥊) | PvP-specific currency | Book 1 §5.1 |
| Stardust (✨) | Premium real-money currency — cosmetics only, never P2W | Book 1 §5.1 |
| ULID | Universally Unique Lexicographically Sortable Identifier (used for all IDs) | Book 3 §3.1 |
| Compact of the Six | Ancient agreement between the Weavers/creator-beings | Book 1 §2.1, Book 2 §1.2 |
| The Ten Continents | Verdantia, Ferrath, Glacivast, Elorath, Terrath, Crystalara, Sylvaris, Volcanis, The Ruins, Pelagas | Book 2 |
| Redlock | Distributed locking algorithm (Redis-based) used for battle/economy locks | Book 3 §4.3 |
| Emergency Lock Mode | Feature flag that disables all game writes immediately | Book 4 §7.6 |
| Economy Lock | Feature flag disabling all economy transactions | Book 4 §5.9 |
| RPO | Recovery Point Objective — maximum acceptable data loss duration | Book 4 §15.1 |
| RTO | Recovery Time Objective — maximum time to restore service | Book 4 §15.1 |
| MTTD | Mean Time to Detect — average time to detect an incident | Book 4 §1.3 |
| MTTR | Mean Time to Resolve — average time to resolve an incident | Book 4 §1.3 |
| P1/P2/P3/P4 | Incident severity levels (P1 = Critical, P4 = Low) | Book 4 §5.1 |
| DR Level 1/2/3 | Disaster Recovery severity levels | Book 4 §15.2 |
| Battle Pass | Premium seasonal content unlock (Stardust-based, cosmetics only) | Book 4 §10.4 |
| Season | 3-month content cycle with story, events, and rank reset | Book 4 §10.1 |

---

## Document Consistency Notes

The following decisions are consistent across all four books and must remain consistent in all future updates:

1. **Stardust is cosmetics-only.** Any proposal to gate gameplay power behind Stardust contradicts this principle across all documents.
2. **ULID format for all IDs.** IDs follow the pattern `type_01J...` (e.g., `char_01J...`, `usr_01J...`, `gld_01J...`).
3. **Conventional Commits.** All git commits follow `type(scope): description` format.
4. **TypeScript Strict Mode.** All code compiles in strict mode — no exceptions.
5. **MongoDB as primary DB, Redis for cache/locks/pub-sub.** Architecture decisions ADR-002 and ADR-003 are foundational and not reversible without an ADR.
6. **Discord.js v14, slash commands only.** ADR-009 prohibits message commands — not to be reversed.
7. **Semantic versioning MAJOR.MINOR.PATCH.** All releases use this scheme.
8. **Content cadence:** Weekly events, monthly patches, quarterly seasons, annual expansions.

---

*Master Documentation Index maintained by: Technical Director*
*Update whenever any new document is added or major document is restructured*
*Version: 1.0.0*
