# ASCENSION LEGENDS — Release Checklist

> **Purpose:** Gate checklist for every production release. No release proceeds unless all applicable items are checked by the required approvers.
>
> **Usage:** Create a copy of this checklist for each release. Fill in the release details and work through each section. Attach the completed checklist to the release ticket.
>
> **Cross-reference:** Book 4 Section 17 (Release Management) for full release workflow.

---

## Release Information

```
Release Version:  _______________
Release Type:     □ Major  □ Minor  □ Patch  □ Hotfix
Target Branch:    _______________
Target Date:      _______________  Target Time (UTC): _______________
Release Manager:  _______________
On-Call Engineer: _______________
```

---

## Section 1 — Pre-Development Gate

*Completed before development begins on this release.*

```
□ Release scope documented (what is in, what is out)
□ Patch notes draft started
□ Design documents updated (Books 1–3 if content changes)
□ Economy impact assessment complete (Economy Analyst, if economy changes)
□ Security review required? □ Yes → complete before merge  □ No
□ Feature flags identified: _______________ (list all flags for this release)
□ Database migrations required? □ Yes → up + down scripts planned  □ No
□ Dependencies on other services documented
```

Signed off by: _________________________ (Technical Director) Date: _____________

---

## Section 2 — Code Readiness Gate

*Completed before QA testing begins.*

```
CODE QUALITY
□ All planned features/fixes implemented and merged to staging branch
□ TypeScript: zero compilation errors in strict mode
□ ESLint: zero errors (warnings reviewed and accepted or fixed)
□ All TODO/FIXME comments in new code resolved or filed as tickets

TESTS
□ Unit tests: all passing (0 failures allowed)
□ Integration tests: all passing (0 failures allowed)
□ Code coverage: new code ≥ 80% coverage
□ Test written for every bug fix (regression prevention)

DATABASE
□ All new migrations: up and down scripts implemented and tested in dev
□ New indexes: documented in docs/Database-Schema.md
□ No N+1 queries (explain plan reviewed for new queries)
□ MongoDB queries reviewed for injection prevention

SECURITY (if applicable)
□ All new input: validated with Zod schema
□ All new routes: authentication enforced
□ All new admin routes: authorization enforced
□ No secrets in code (automated scanner passed in CI)
□ Error responses: no internal details leaked to client

DEPENDENCIES
□ No new HIGH or CRITICAL vulnerabilities (npm audit clean)
□ New dependencies reviewed and approved (Technical Director)
□ pnpm-lock.yaml committed and up to date

DOCUMENTATION
□ Patch notes updated with all player-facing changes
□ API documentation updated (if API changes)
□ README/replit.md updated if setup instructions changed
```

Signed off by: _________________________ (Lead Engineer) Date: _____________

---

## Section 3 — QA Gate

*Completed by QA team in staging environment.*

### 3.1 Functional Testing

```
□ All new features tested against acceptance criteria
□ All bug fixes verified resolved in staging
□ Regression suite: full pass (no new failures introduced)
□ Command testing:
  □ All new commands tested (see command test checklist — Book 4 §14.2)
  □ All modified commands re-tested
  □ No existing commands broken by this release (regression)
□ Battle system: not affected OR re-tested (§14.3)
□ Economy system: not affected OR re-tested (§14.4)
□ Marketplace: not affected OR re-tested (§14.5)
□ Guild system: not affected OR re-tested (§14.6)
□ Raid system: not affected OR re-tested (§14.7)
□ Rendering: not affected OR re-tested (§14.8)
```

### 3.2 Edge Case Testing

```
□ New player scenario: all new features work for a player with no character
□ Max-level player scenario: all new features work for Level 100+ players
□ Rate limiting: new commands respect rate limits correctly
□ Error handling: all error paths return correct user-facing messages
□ Concurrent operations: no race conditions in new features
□ Shard behavior: cross-shard scenarios work correctly (if applicable)
```

### 3.3 Performance Testing

```
□ New commands: P95 latency < 800 ms in isolation (staging)
□ New queries: explain plan reviewed, no full collection scans
□ Rendering: new render types complete within 15 s P95 (staging)
□ Load test: if major release, load test at 2× expected peak
  → Result: _______________________________________________
```

### 3.4 Database Migration Testing (if applicable)

```
□ Migration UP script tested in staging — result: ✓ success
□ Migration DOWN (rollback) script tested in staging — result: ✓ success
□ Data integrity verified after migration
□ Application works correctly with migrated schema
□ Rollback verified: can revert to previous version with previous schema
```

### 3.5 QA Sign-Off

```
QA Lead Signature: _________________________
Date: _________________________

Known acceptable issues entering production (list all, attach tickets):
1. _______________________________________________
2. _______________________________________________
(None is the goal)
```

---

## Section 4 — Economy Analyst Sign-Off (if economy changes)

```
□ Drop rate changes reviewed and simulation complete
□ Currency generation rate changes reviewed
□ New items or shops reviewed for economy impact
□ New events reviewed for economy impact (extra Gold generation?)
□ Simulation results: economy stable for projected 30 days post-release
□ Marketplace impact: price disruptions expected? Acceptable?

Economy Analyst Signature: _________________________
Date: _________________________
Notes: _______________________________________________
```

---

## Section 5 — Security Review Sign-Off (if security-adjacent changes)

```
□ Auth/authz changes reviewed
□ New routes/endpoints security-reviewed
□ New third-party integrations reviewed
□ Secret access changes reviewed
□ Audit logging verified for all new sensitive operations
□ SAST scan: no new HIGH or CRITICAL findings

Security Review By: _________________________
Date: _________________________
```

---

## Section 6 — Staging Verification

*Final verification in staging immediately before production deployment.*

```
□ Release candidate deployed to staging
□ Full synthetic monitor suite: all passing
□ Smoke test: core commands working in QA guild
  □ Character commands: ✓
  □ Battle: ✓
  □ Economy: ✓
  □ Guild: ✓
  □ Marketplace: ✓
  □ Admin API /health: ✓
□ Render smoke test: sample battle render completes < 15 s
□ Feature flags for this release: all in correct initial state for production
□ Database migrations (if any): executed in staging, verified successful
□ No active alerts in staging monitoring
```

---

## Section 7 — Communications Ready

```
□ Patch notes: finalized and approved by Game Director
□ Patch notes: scheduled for posting at release time
  → Channel(s): _____________________________________________
□ Community announcement: drafted (if major release)
□ On-call engineer: briefed on release contents and known risks
□ Support team: briefed on new features and expected player questions
□ Community managers: briefed and on standby for release day
□ Status page: ready to post maintenance window (if applicable)
□ Rollback announcement template: prepared (just in case)
```

---

## Section 8 — Deployment Readiness

```
□ Deployment window confirmed: _______________ UTC
  (Must be outside peak hours: 14:00–22:00 UTC unless emergency)
□ Blue environment: healthy and confirmed as stable baseline
□ Rollback plan confirmed:
  → If code rollback: Blue version ___ ready, procedure documented
  → If DB migration rollback required: Technical Director approval chain confirmed
□ On-call engineer: on standby during deployment window
□ Technical Director: available during deployment
□ Feature flags: deployment checklist for flag sequence documented
□ Maintenance window (if needed): duration ___  Message prepared: ✓
```

---

## Section 9 — Production Deployment

*Execute during the deployment window.*

```
DEPLOYMENT STEPS (check as you go)

□ T−30 min: Status page maintenance window posted (if applicable)
□ T−10 min: Final health check — Blue environment all green
□ T−00:00: Deploy Green environment
□ T+05 min: Green pods all Ready
□ T+05 min: Route 5% traffic to Green (canary)
□ T+05 min: Open Grafana — Bot Health + Command Performance dashboards
□ T+35 min: Canary soak complete (30 min minimum; 15 min for hotfix)
  → Error rate canary vs blue: ___  Pass? □ Yes □ No
  → P95 latency canary vs blue: ___  Pass? □ Yes □ No
  → Any unexpected error patterns: □ None □ YES → ABORT (see rollback)
□ T+35 min: Promote Green to 100% traffic
□ T+35 min: Execute database migrations (if any, in this order)
□ T+40 min: Enable new feature flags (in order): _______________
□ T+40 min: Smoke test on production test guild
  □ Core commands: ✓
  □ New features: ✓
  □ Rendering: ✓
□ T+45 min: Post patch notes and/or community announcement
□ T+45 min: Close maintenance window on status page (if applicable)
□ T+60 min: Blue kept hot for 30 minutes (rollback standby)
□ T+90 min: Blue decommissioned
□ T+90 min: Deployment declared COMPLETE in release ticket
```

**Deployment complete signed by:** _________________________ Date: _________ Time: _________

---

## Section 10 — Post-Deployment Monitoring (First 24 Hours)

```
T+1 hour:
□ Error rate: back to baseline (< 0.5%)
□ P95 latency: back to baseline (< 800 ms)
□ All synthetic monitors: passing
□ Economy: first 30 minutes of data looks normal (if economy changes)
□ Support channel: no unexpected flood of player reports

T+4 hours:
□ Battle completion rate: > 98%
□ Render success rate: > 98%
□ No P1/P2 incidents
□ Economy: no anomaly alerts

T+24 hours:
□ Uptime for deployment day: ≥ 99.9%
□ Error rate average for first 24 hours: < 0.5%
□ No P1 incidents (if P2 or below: documented)
□ D1 retention of users active on release day: monitored (will be reviewed in 7-day retrospective)
□ Release formally declared STABLE
```

**Stability sign-off:** _________________________ (Technical Director) Date: _____________

---

## Section 11 — Rollback Decision Log

*Complete this section if rollback was executed during or after deployment.*

```
Rollback executed: □ Yes  □ No

If Yes:
Rollback time: _______________
Reason for rollback: _______________________________________________
Version rolled back to: _______________
Time from rollback decision to completion: _______________ (target: < 5 min)
Player impact: _______________________________________________
Post-mortem ticket created: _______________

Rollback signed off by: _________________________ Date: _____________
```

---

## Hotfix Release Checklist (Abbreviated)

Use this abbreviated checklist for P1/P2 hotfixes when time is critical.

```
HOTFIX CHECKLIST (target: deploy within 60 minutes of decision)

□ Root cause identified and confirmed
□ Fix is minimum viable (no scope creep)
□ Fix reviewed by at least 1 additional engineer
□ Unit test for the bug added
□ CI passing (core tests at minimum)
□ No data migration required (or: data migration reviewed by TD)
□ On-call + TD approval to deploy
□ Canary soak: 15 minutes minimum
□ Canary pass criteria verified (same as standard, abbreviated time)
□ Production deployed
□ Incident communication posted (resolve message)
□ Post-mortem ticket created
□ Back-merge to develop scheduled
```

---

*Release Checklist maintained by: Technical Director*
*Review schedule: Quarterly*
*Version: 1.0.0*
