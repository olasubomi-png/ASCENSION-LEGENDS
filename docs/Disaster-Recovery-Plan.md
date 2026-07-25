# ASCENSION LEGENDS — Disaster Recovery Plan

> **Classification:** Internal — Restricted distribution. All team leads must have access.
>
> **Purpose:** Defines procedures for recovering Ascension Legends from catastrophic system failures. This document is tested annually (full DR drill) and updated after every DR-level event.
>
> **Cross-reference:** Book 4 Section 15 (Disaster Recovery) for full procedures and philosophy.

---

## Quick Reference — DR Level Activation

| DR Level | When to Activate | Who Can Declare |
|----------|-----------------|-----------------|
| DR Level 1 | Data corruption confirmed | Technical Director |
| DR Level 2 | Complete database loss or multi-region cloud outage | Technical Director |
| DR Level 3 | Security breach confirmed | Technical Director + Game Director |
| Emergency Lock | Immediate threat requiring all writes stopped | Technical Director OR two Senior Engineers |

**Emergency Lock command:**
```bash
kubectl exec -n production deploy/admin-api -- \
  node -e "require('./dist/flags').setFlag('emergency_lock', true)"
```

---

## Table of Contents

1. [DR Overview and Objectives](#1-dr-overview-and-objectives)
2. [Disaster Classification](#2-disaster-classification)
3. [DR Level 1 — Data Corruption](#3-dr-level-1--data-corruption)
4. [DR Level 2 — Complete Database Loss or Multi-Region Outage](#4-dr-level-2--complete-database-loss-or-multi-region-outage)
5. [DR Level 3 — Security Breach](#5-dr-level-3--security-breach)
6. [Discord Outage Response](#6-discord-outage-response)
7. [Cloud Provider Outage Response](#7-cloud-provider-outage-response)
8. [DR Communication Templates](#8-dr-communication-templates)
9. [DR Recovery Verification Checklist](#9-dr-recovery-verification-checklist)
10. [DR Compensation Policy](#10-dr-compensation-policy)
11. [Annual DR Drill Procedure](#11-annual-dr-drill-procedure)
12. [Infrastructure Recovery Reference](#12-infrastructure-recovery-reference)

---

## 1 — DR Overview and Objectives

### Recovery Objectives

| Objective | Target | Notes |
|-----------|--------|-------|
| RPO (Recovery Point Objective) | < 1 minute | Via continuous Atlas backup |
| RTO (Recovery Time Objective) | < 4 hours | For partial restore; < 8 hours for full cluster |
| MTTR for DR Level 1 | < 2 hours | |
| MTTR for DR Level 2 | < 8 hours | |
| MTTR for DR Level 3 | < 12 hours (service) | Forensics may extend |

### DR Principles

1. **Player data is the first priority.** We restore data integrity before restoring service availability. A game that is down is recoverable; a game with corrupted player data is not.

2. **No DR action without explicit sign-off.** Every DR step that could alter data requires Technical Director approval. This prevents well-intentioned but incorrect recovery actions.

3. **Make no changes to corrupted systems without forensic snapshot.** Before any recovery attempt: snapshot the current state. You may need to analyze the corruption after recovery.

4. **Communicate proactively.** Players learn about DR events from us, not from watching the bot be unresponsive.

### DR Team Roles

| Role | Person | Backup |
|------|--------|--------|
| DR Commander | Technical Director | Game Director |
| Technical Lead | Lead Backend Engineer | Senior Backend Engineer |
| Database Lead | Database Engineer | Lead Backend Engineer |
| Infrastructure Lead | DevOps/SRE | Lead Backend Engineer |
| Communications Lead | Community Lead | Community Manager |

---

## 2 — Disaster Classification

### Decision Flow

```
INCIDENT DETECTED
       │
       ▼
Is player data at risk or confirmed corrupted?
  YES → DR Level 1 or higher (determine scope)
  NO  → Standard Incident Response (Book 4, Section 5)
       │
       ▼ (if player data at risk)
What is the scope?
  Partial corruption, recoverable via PITR → DR Level 1
  Total database loss or cloud failure     → DR Level 2
  Security breach confirmed               → DR Level 3
```

### DR Level Indicators

**DR Level 1 (Data Corruption):**
- Audit log shows bulk writes with unexpected values
- Players reporting wrong balances / missing items / wrong character state
- Monitoring shows unusual write patterns to a specific collection
- Post-deploy integrity check fails

**DR Level 2 (Total Loss / Multi-Region):**
- MongoDB Atlas showing all nodes unavailable for > 15 minutes (not transient)
- Atlas support confirms cluster unrecoverable
- Cloud provider status shows multi-region failure affecting primary infrastructure

**DR Level 3 (Security Breach):**
- Unauthorized admin API access confirmed in audit logs
- Unexpected economy grants from non-standard source
- Vault audit log shows secret reads from unknown actor
- External notification of breach (e.g., attacker contact)
- Security scanner alerts on active exfiltration patterns

---

## 3 — DR Level 1 — Data Corruption

### 3.1 Immediate Actions (First 10 Minutes)

```
STEP 1: Stop all writes to affected area
□ If corruption is collection-specific:
  Activate feature flag to disable affected feature (e.g., economy_lock for economy corruption)
□ If scope unclear or widespread:
  Activate emergency_lock (all writes stopped)

kubectl exec -n production deploy/admin-api -- \
  node -e "require('./dist/flags').setFlag('emergency_lock', true)"

STEP 2: Take immediate Atlas snapshot
Log into MongoDB Atlas → Clusters → ascension-production → Backup → Take Snapshot Now
Description: "Pre-recovery-YYYY-MM-DD corruption snapshot"
→ This preserves the corrupted state for forensics

STEP 3: Page DR team
□ Technical Director (DR Commander)
□ Database Engineer (Database Lead)
□ Lead Backend Engineer (Technical Lead)
□ Community Lead (Communications Lead)

STEP 4: Open DR incident channel in Slack
#dr-YYYY-MM-DD (private channel, DR team only)
All communications coordinated here.
```

### 3.2 Corruption Assessment (10–30 Minutes)

```
ASSESS SCOPE
□ Which collections are affected?
□ What is the time range of corruption? (exact UTC timestamps from audit log)
□ How many documents are affected? Estimate count.
□ Is corruption still ongoing? (writes stopped, so no — but confirm)
□ What is the corruption pattern? (null fields? wrong values? missing documents?)
□ Can we identify the corruption start timestamp precisely?
```

### 3.3 Recovery Path Selection

```
RECOVERY PATH DECISION (Technical Director + Database Engineer)

Path A — PITR Restore (preferred):
  Use when:
  - Corruption start time identified precisely
  - Corruption is < 24 hours old
  - Restoration to pre-corruption state is acceptable (some data loss accepted)
  
  Proceed to → Section 3.4

Path B — Selective Document Repair:
  Use when:
  - Corruption is limited to known, identifiable documents
  - PITR would lose more data than targeted repair
  - We can write a deterministic script to identify and fix corrupted docs
  
  Proceed to → Section 3.5

Path C — Hybrid (PITR + selective forward-replay):
  Use when:
  - Corruption is in one collection, other collections have clean activity
  - We can restore one collection from PITR and keep others
  
  Technical Director + Database Engineer define hybrid plan.
```

### 3.4 Path A — PITR Restore

```
WARNING: All actions in this section require Technical Director approval.
Do NOT proceed with any restore without explicit approval.

STEP 1: Identify restore point
□ Choose timestamp just before earliest confirmed corruption
□ Document chosen restore point: _______________UTC
□ Technical Director approves restore point

STEP 2: Restore to isolated cluster (verification step)
In MongoDB Atlas:
  → Backup → Restore → Point in Time
  → Target: NEW isolated cluster (NOT production)
  → Time: [approved restore point]
  → Estimated duration: 30 min – 2 hours depending on data size

STEP 3: Verify restored data on isolated cluster
□ Connect application to isolated cluster (read-only mode)
□ Spot-check: sample 20 player accounts for data integrity
□ Verify record counts match pre-corruption expectations
□ Run economy integrity check on isolated cluster
□ Technical Director reviews and approves the restored state

STEP 4: Assess what data will be lost
□ Identify all writes between restore point and now
□ For each write category:
  → Player progression: can we replay? or accept as lost?
  → Economy transactions: audit log has these — can replay some
  → Battle results: losable (replayable by players)
  → Support tickets: separate system, not affected

STEP 5: Plan and communicate data loss (if any)
□ Economy Analyst quantifies impact
□ Compensation package planned (see Section 10)
□ Communications Lead prepares player announcement

STEP 6: Execute production restore (Technical Director signs off)
□ Put bot in maintenance mode
□ Atlas: restore production cluster from approved restore point
□ Monitor restore progress (Atlas UI shows progress %)
□ Estimated completion: _______________

STEP 7: Post-restore verification (Section 9)
□ Economy integrity check on production
□ Player data spot-check
□ Synthetic monitors

STEP 8: Graduated service restoration (Section 9)
```

### 3.5 Path B — Selective Document Repair

```
WARNING: Repair scripts must be reviewed by TWO engineers and the Technical Director before execution.

STEP 1: Write the repair script
□ Script identifies corrupted documents (by pattern, not by assumption)
□ Script logs every document it will modify (dry-run mode)
□ Script applies atomic updates (not multi-step)
□ Script is idempotent (safe to re-run)

STEP 2: Validate on a copy
□ Copy the affected collection to a test collection
□ Run script against test collection
□ Verify: corrupted docs repaired, clean docs untouched
□ Record before/after counts and checksums

STEP 3: Technical Director review
□ Share dry-run output (list of documents to be modified)
□ Technical Director approves execution

STEP 4: Execute on production
□ Run script with writes enabled
□ Monitor write operations in Atlas metrics
□ Log all modified document IDs

STEP 5: Verify repair
□ Run script in dry-run mode again — should find 0 corrupted documents
□ Spot-check repaired documents
□ Economy integrity check (if economy affected)

STEP 6: Restore service (Section 9 verification + graduated restoration)
```

---

## 4 — DR Level 2 — Complete Database Loss or Multi-Region Outage

### 4.1 Immediate Actions

```
STEP 1: Confirm this is not transient
□ Wait 5 minutes after detection before declaring DR Level 2
□ Check Atlas status page: status.mongodb.com
□ Check cloud provider status page
□ Verify: is this our cluster only, or Atlas-wide?

STEP 2: Declare DR Level 2 (Technical Director only)
□ Activate emergency_lock (if not already active)
□ Page full DR team
□ Open DR incident channel
□ Post to status page: "Ascension Legends is experiencing a major technical incident.
  Game services are temporarily offline. We are working to restore service.
  Updates will be posted here every 30 minutes."
□ Post to Discord #announcements: same message

STEP 3: Open Atlas support case (if Atlas outage)
Priority: Critical
Subject: "Production cluster completely unavailable — ASCENSION LEGENDS"
Include: cluster name, region, impact description, contact info
```

### 4.2 Activate Fallback Region

```
□ Identify available unaffected region
□ Redirect DNS / load balancer to fallback region
□ Verify bot pods in fallback region are starting (may need scale-up)
□ Verify fallback region's MongoDB replica is accessible
  mongosh [fallback-replica-uri] --eval "rs.status()"
□ If fallback DB is accessible: consider read-only mode service restoration
  (players can view profile, leaderboard, etc. — no writes)
```

### 4.3 Database Restoration

```
IF Atlas cluster recoverable (Atlas support ETA given):
□ Monitor Atlas support case
□ Keep players updated every 30 minutes
□ Wait for Atlas recovery (their SLA: typically 2–4 hours for major incidents)

IF Atlas cluster NOT recoverable (permanent loss):
□ Use most recent backup (daily snapshot or continuous)
□ Identify latest clean backup: _______________UTC
□ Initiate Atlas cluster restore from backup
□ ETA for full restore: 2–8 hours

PARALLEL: Infrastructure Recovery (if cloud provider failure)
□ DevOps/SRE: use Terraform to provision equivalent infrastructure in alternate cloud provider
□ Target: < 2 hours to have infrastructure running
□ Deploy application from container registry to new infrastructure
□ Point DNS to new infrastructure (TTL propagation: up to 5 minutes with low TTL)
```

### 4.4 Validate Restored Database

```
□ Verify total record counts in major collections against last known-good count
  Target: characters, guilds, users collections within 1% of expected
□ Economy integrity check: spot-check 50 player balances
□ Run application smoke test against restored database (staging-like verification)
□ Technical Director approves restored state for service restoration
```

### 4.5 Graduated Service Restoration

```
RESTORATION SEQUENCE (do NOT skip steps or combine)

□ Phase 1: Admin API read-only access
  → Enable Admin API, read-only mode
  → Internal team verifies data looks correct

□ Phase 2: Bot read-only commands
  → Enable bot, disable all write operations
  → Allow: /profile, /leaderboard, /status
  → Players can see their character but not play

□ Phase 3: Core game commands
  → Enable battles, quests, story
  → Monitor for 30 minutes: error rate < 1%, no economy anomalies

□ Phase 4: Economy
  → Enable Gold transactions, shops
  → Economy Analyst monitors in real-time for 30 minutes

□ Phase 5: Marketplace
  → Enable marketplace
  → Monitor listing creation, purchase rates

□ Phase 6: Full service
  → All features enabled
  → Standard monitoring resumes
  → Status page updated to "All systems operational"
```

---

## 5 — DR Level 3 — Security Breach

### 5.1 Immediate Containment (First 15 Minutes)

```
CONTAIN FIRST, INVESTIGATE SECOND. Do NOT investigate before containing.

□ IMMEDIATE: Activate emergency_lock (all game writes stopped)
□ IMMEDIATE: Revoke all active admin API sessions
  kubectl exec -n production deploy/admin-api -- \
    node -e "require('./dist/auth').revokeAllSessions()"
□ IMMEDIATE: Rotate ALL production secrets (see Section 5.2)
□ IMMEDIATE: Block attacker's known IP addresses
  (Add to WAF blocklist + Kubernetes NetworkPolicy if cluster breach)
□ IMMEDIATE: Preserve all logs — do NOT delete or modify ANYTHING
□ IMMEDIATE: If breach is ACTIVE (attacker still connected):
  → Isolate affected systems from network (break glass procedure)
  → Contact cloud provider security team
□ PAGE: Technical Director, Game Director (both required for DR Level 3)
```

### 5.2 Emergency Secret Rotation

```
PRIORITY ORDER FOR SECRET ROTATION (highest risk first):

1. Discord bot token (prevents attacker from controlling the bot)
   → Regenerate in Discord Developer Portal
   → Update Kubernetes secret
   → Restart bot pods

2. Admin API JWT signing key (invalidates all existing sessions)
   → Generate new 256-bit key
   → Update in Vault
   → Update Kubernetes secret
   → Restart Admin API pods

3. MongoDB credentials (prevents database access)
   → Rotate Atlas user password
   → Update in Vault
   → Update Kubernetes secret
   → Restart all database-connected services

4. Redis auth password
   → Rotate Redis AUTH password
   → Update in Vault
   → Update Kubernetes secret
   → Restart Redis clients

5. All other secrets
   → Rotate per normal procedure (can be done in next 24 hours)
```

### 5.3 Forensic Investigation

```
DO NOT MODIFY PRODUCTION SYSTEMS until forensics baseline is captured.

□ Clone affected system state for analysis:
  → Snapshot MongoDB Atlas cluster (even if corrupted)
  → Export Vault audit log
  → Export Kubernetes audit log
  → Export application logs (last 7 days minimum)
  → Export WAF access logs
  → Export cloud provider audit trail

□ Establish attack timeline:
  → First unauthorized action timestamp
  → Last unauthorized action timestamp
  → All actions taken by attacker during window

□ Identify breach vector:
  → How did attacker gain access? (credential theft? vulnerability? insider?)
  → Which credentials were used?
  → Was it a known vulnerability?

□ Assess player data impact:
  → Which player data was accessible to attacker?
  → Was any player data exfiltrated?
  → Were any economy operations performed by attacker?
  → Were any account modifications made?
```

### 5.4 Player Impact Assessment

```
□ List all player accounts with any modifications during breach window
□ For each affected account:
  → What data was modified?
  → Was economy data affected?
  → Were items or currency added/removed?
□ Determine: was any personal player information accessed?
  → Discord IDs: likely yes (public-ish, but still a breach)
  → Any PII beyond Discord ID: document specifically
□ Economy Analyst: quantify all economy impacts during breach window
```

### 5.5 Breach Notification

```
NOTIFICATION REQUIREMENTS (if player data was accessed):

□ Prepare breach notification with:
  → What happened (factual, no speculation)
  → When it happened (date range)
  → What data was potentially accessed
  → What we have done to secure the breach
  → What players should do (if anything — typically: nothing for Discord ID exposure)
  → Contact for questions

□ Notification timeline:
  → Internal notification: within 1 hour of confirmed breach
  → Affected player notification: within 72 hours of confirmed breach
  → Public statement: within 72 hours of confirmed breach
  → Regulatory notification (GDPR if EU player data): within 72 hours

□ Channels for notification:
  → Discord DM to affected players (if Discord ID known)
  → Discord #announcements for general public statement
  → Status page
  → Social media (Twitter/X)
```

### 5.6 System Hardening Post-Breach

```
(Do NOT restore service until these are complete)

□ Vulnerability patched that allowed initial access
□ All secrets rotated (Section 5.2 complete)
□ All sessions invalidated and users re-authenticated
□ Network access controls reviewed and tightened
□ All admin accounts reviewed: remove any unauthorized accounts
□ MFA verified on all remaining admin accounts
□ Kubernetes RBAC reviewed: remove any unexpected role bindings
□ WAF rules updated to block identified attack patterns
□ Enhanced monitoring activated for 30 days post-breach
□ Penetration test scheduled (within 30 days of breach resolution)
□ Technical Director + Security review: is it safe to restore service?
```

---

## 6 — Discord Outage Response

```
DISCORD OUTAGE RESPONSE (NOT a DR Level 1/2/3 — just an extended incident)

□ Verify outage is Discord-wide (discordstatus.com)
□ Do NOT restart or redeploy anything (don't create chaos on top of chaos)
□ Bot shards will enter a reconnect loop — this is normal
□ Communications Lead posts:
  "Discord is currently experiencing an outage that is affecting
  Ascension Legends. This is Discord's infrastructure issue, not ours.
  Follow @Discord for updates on their status. We'll let you know
  when service is restored. Your progress and items are safe. 🛡️"
□ Post to status page: "Affected by Discord outage — monitoring"
□ Monitor discordstatus.com every 15 minutes
□ When Discord restores:
  → Verify shards reconnect (watch logs for READY events)
  → Clear any expired interaction queues (interactions > 3 s old)
  → Post: "Discord is back online. Ascension Legends is fully restored! ⚔️"
□ No post-mortem required (external cause) unless our code made it worse
```

---

## 7 — Cloud Provider Outage Response

```
CLOUD PROVIDER OUTAGE (affects us even if Discord is fine)

SINGLE REGION FAILURE:
□ Verify: is traffic auto-failing over to secondary region?
  (DNS health checks should handle this automatically)
□ Verify: secondary region bot pods are starting and healthy
□ If auto-failover not working: manually reroute traffic
  (Update DNS or load balancer to point to secondary region)
□ Communicate: "We've experienced infrastructure issues in one region
  and are operating from backup infrastructure. Service may be
  intermittently degraded while we stabilize."
□ Monitor: secondary region scaling to handle additional load

MULTI-REGION FAILURE (all regions affected):
□ Declare DR Level 2 if MongoDB is inaccessible
□ If cloud provider is down but our data is safe:
  → Provision equivalent infrastructure with alternate provider
  → Use Terraform IaC: terraform apply -var="provider=alternate"
  → Update DNS to point to alternate provider
  → Target: < 4 hours to alternative infrastructure
□ Communicate every 30 minutes until resolved
```

---

## 8 — DR Communication Templates

### Template 1 — Initial Incident Notification (All DR Levels)

```
🔴 ASCENSION LEGENDS — TECHNICAL INCIDENT

We are currently experiencing a significant technical issue affecting 
Ascension Legends. Our team is actively investigating and working to 
restore full service.

⚔️ Player progress and items are safe.
⏱️ We expect to provide an update within 30 minutes.

Thank you for your patience, heroes of Aethon.

— The Ascension Legends Team
```

### Template 2 — Status Update (During DR)

```
🟡 UPDATE — [TIME UTC]

We're continuing to work on the technical issue affecting Ascension Legends.

Current status: [Brief factual description, e.g., "Database restoration in progress"]
Expected resolution: [Time estimate if available, or "Unknown — we'll update in 30 minutes"]

We appreciate your patience. Your progress is safe.
```

### Template 3 — Resolution Notification

```
✅ ASCENSION LEGENDS IS RESTORED

Ascension Legends is now fully operational. Here's what happened:

📋 WHAT OCCURRED:
[Clear, honest explanation of the incident]

🔧 WHAT WE DID:
[What actions we took to resolve it]

🛡️ WHAT WE'RE DOING TO PREVENT THIS:
[Preventative measures]

[If data loss occurred:]
⚠️ DATA IMPACT:
[Honest description of any data lost, who was affected, what we're doing about it]

[Compensation package, if applicable:]
🎁 AS AN APOLOGY:
[Description of compensation being given to all players]

Thank you for your patience and continued support. We take incidents like 
this seriously and are committed to the reliability of Aethon.

— The Ascension Legends Team
```

### Template 4 — Security Breach Notification (Player-Facing)

```
IMPORTANT SECURITY NOTICE — [DATE]

We are writing to inform you of a security incident that affected 
Ascension Legends between [DATE] and [DATE].

WHAT HAPPENED:
[Clear, non-technical description]

WHAT DATA WAS INVOLVED:
[Specific data that was accessed or potentially exposed]

WHAT WE HAVE DONE:
- Secured the vulnerability immediately upon discovery
- Rotated all system credentials
- Enhanced security monitoring
- Reported to relevant authorities as required by law

WHAT YOU SHOULD DO:
[Specific player actions, if any — or "No action is required on your part"]

We sincerely apologize for this incident. The security of your account 
is our responsibility, and we take this very seriously.

If you have questions, please contact: support@ascension-legends.internal

— The Ascension Legends Security Team
```

---

## 9 — DR Recovery Verification Checklist

Complete this checklist before declaring any DR resolved and restoring full service.

```
DATA INTEGRITY
□ MongoDB: connection successful from all services
□ MongoDB: record counts in major collections within expected range
  Characters: expected ___, actual ___
  Guilds: expected ___, actual ___
  Economy transactions: expected ___, actual ___
□ Economy integrity check: 20 random accounts spot-checked — all balances reasonable?
□ No duplicate records in any collection (check _id uniqueness)
□ All indexes present and not corrupted

ECONOMY
□ Total Gold supply within expected range
□ Total Crystal supply within expected range
□ No accounts with negative balances (enforced as impossible, but verify)
□ No accounts with impossible balances (> 10× highest-ever legitimate balance)
□ Economy Analyst sign-off: □ Approved

APPLICATION
□ All synthetic monitors: PASSING for 10+ consecutive minutes
□ Bot responds to commands in test guild
□ Command error rate: back to baseline (< 0.5%)
□ Command P95 latency: back to baseline (< 800 ms)
□ Battle system: battle completes end-to-end in test
□ Rendering: render completes in test battle
□ Admin API: health check passing
□ BullMQ: all queues processing normally, no DLQ backlog

SECURITY (if DR Level 3)
□ All secrets rotated
□ All admin sessions invalidated and re-authenticated
□ Vulnerability patched
□ WAF rules updated
□ Security monitoring enhanced
□ Technical Director security sign-off: □ Approved

FEATURE FLAGS
□ Emergency lock: false
□ Economy lock: false (unless intentional)
□ Maintenance mode: false
□ All other flags: in correct state for current operations

COMMUNICATIONS
□ Player-facing resolution notification posted
□ Status page updated to "All Systems Operational"
□ Internal stakeholders notified of resolution

FOLLOW-UP
□ Post-mortem ticket created with severity and expected resolution: ___
□ Incident timeline documented
□ All DR team roles debriefed

DECLARATION
DR declared resolved by: _________________________ (Technical Director)
Date/Time: _______________ UTC
```

---

## 10 — DR Compensation Policy

Compensation is given as an apology and as recognition of player trust. It is never admitting legal liability.

### Compensation Tiers

| Duration of Service Disruption | Data Loss | Compensation Package |
|-------------------------------|----------|---------------------|
| < 30 minutes | None | No compensation required |
| 30 min – 2 hours | None | Small thank-you: 500 Gold + 1-day XP boost |
| 2–4 hours | None | Standard: 3-day Double XP + 1,000 Gold + seasonal cosmetic |
| 4–8 hours | None | Large: 7-day Double XP + 2,500 Gold + rare cosmetic |
| > 8 hours | None | Economy Analyst determines (emergency review required) |
| Any duration | Yes | Restore lost items/currency directly + above tier + additional compensation |

### Compensation Delivery

- Compensation is delivered via automated in-game mail to all active players (played in last 30 days)
- Compensation scripts must be reviewed by Economy Analyst before execution
- Compensation is logged in the audit trail
- Players who can demonstrate specific data loss via support ticket receive direct restoration on top of general compensation

### Documentation

All DR compensation is documented in the incident post-mortem and in the economy log.

---

## 11 — Annual DR Drill Procedure

**Target:** Complete annually, in Q1 (before any major new season).

### DR Level 1 Drill

**Duration:** Half-day
**Participants:** Technical Director, Database Engineer, Lead Backend Engineer, Communications Lead

```
DRILL SCENARIO: "The Phantom Corruption"

1. Database Engineer introduces artificial corruption to staging DB
   (Modify 100 character documents to have null Gold balance)
2. Technical Director "discovers" the corruption (monitoring alert is simulated)
3. DR Level 1 procedure executed against staging environment
4. Team follows the procedure from Step 1 through service restoration
5. Timer recorded for each step
6. Communications Lead drafts and sends (to internal Slack, not real players) the player communication

PASS CRITERIA:
□ Corruption scope correctly identified within 15 minutes
□ PITR restore or selective repair plan chosen and executed correctly
□ Economy integrity check passes post-recovery
□ Total drill time: < 2 hours
□ Communications draft reviewed and approved as appropriate
```

### DR Level 2 Drill

**Duration:** Full day
**Participants:** All DR team members

```
DRILL SCENARIO: "The Great Outage"

1. DevOps/SRE simulates complete database unavailability in staging
   (Point staging app to non-existent DB URI)
2. Technical Director declares DR Level 2 (simulated)
3. Full team executes DR Level 2 procedure against staging/test environment
4. Includes: fallback region activation, backup restoration, graduated service restoration
5. Communications Lead sends all templates (to internal Slack)

PASS CRITERIA:
□ Alternative infrastructure plan executable within 2 hours (even if not deployed in drill)
□ Service restoration sequence completed in correct order
□ RTO measured against target: < 8 hours (simulated)
□ Post-drill retrospective: what did we learn?
```

### Drill Results Logging

```
ANNUAL DR DRILL RECORD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date: _______________
Participants: _______________
Scenarios tested: □ Level 1  □ Level 2  □ Both

Level 1 results:
  Scope identification time: ___ minutes (target: < 15)
  Total recovery time: ___ minutes (target: < 120)
  Pass: □ Yes  □ No — Issues: _______________

Level 2 results:
  Fallback activation time: ___ minutes (target: < 30)
  Total recovery time: ___ hours (target: < 8)
  Pass: □ Yes  □ No — Issues: _______________

Action items from drill:
  1. _______________
  2. _______________

DR Plan updated based on drill: □ Yes  □ No
Technical Director signature: _________________________
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 12 — Infrastructure Recovery Reference

### Container Registry

All production Docker images are stored in the container registry. In a recovery scenario, identify the last known-good image tag:

```bash
# List recent production images
docker pull registry.ascension.internal/ascension-bot:v[VERSION]
docker pull registry.ascension.internal/admin-api:v[VERSION]
docker pull registry.ascension.internal/render-worker:v[VERSION]

# Deploy specific version
kubectl set image deploy/ascension-bot \
  bot=registry.ascension.internal/ascension-bot:v[VERSION] \
  -n production
```

### Terraform Recovery (New Infrastructure)

```bash
# Initialize Terraform (IaC repository)
cd infrastructure/
terraform init

# Plan recovery infrastructure
terraform plan -var="environment=production-recovery" \
               -var="region=us-east-recovery"

# Apply (requires Technical Director approval)
terraform apply
```

### DNS Failover (Manual)

If automatic DNS health check failover fails, manually update DNS:
1. Log into DNS provider control panel
2. Update A/CNAME records for production endpoints to point to recovery IP
3. Set TTL to 60 seconds for rapid propagation
4. Verify propagation: `dig @8.8.8.8 api.ascension-legends.com`

### Kubernetes Recovery from etcd Backup

If Kubernetes control plane is lost:
```bash
# Restore etcd from backup (this restores all K8s state)
ETCDCTL_API=3 etcdctl snapshot restore etcd-backup-YYYYMMDD.db \
  --name m1 \
  --initial-cluster m1=https://HOST:2380 \
  --initial-cluster-token etcd-cluster-1 \
  --initial-advertise-peer-urls https://HOST:2380 \
  --data-dir /var/lib/etcd

# Consult Kubernetes documentation for full etcd recovery procedure
# This is a DR Level 2+ scenario — DevOps lead executes
```

---

*Disaster Recovery Plan maintained by: Technical Director, DevOps/SRE*
*Review schedule: Annually, or after any DR-level event*
*Next scheduled DR drill: Q1 of Year 1*
*Version: 1.0.0*
