# ASCENSION LEGENDS — Operations Runbook

> **Purpose:** Step-by-step operational procedures for the Ascension Legends live service. This is the engineer's handbook for day-to-day operations, deployments, and incident response.
>
> **Audience:** On-call engineers, SRE, DevOps.
>
> **Cross-reference:** For full context on each procedure, see Book 4 (Operations & Live-Service Bible).

---

## Table of Contents

1. [Quick Reference — Emergency Commands](#1-quick-reference--emergency-commands)
2. [Deployment Runbook](#2-deployment-runbook)
3. [Rollback Runbook](#3-rollback-runbook)
4. [Service Health Checks](#4-service-health-checks)
5. [Feature Flag Operations](#5-feature-flag-operations)
6. [Incident Triage Guide](#6-incident-triage-guide)
7. [Database Operations](#7-database-operations)
8. [Redis Operations](#8-redis-operations)
9. [Shard Operations](#9-shard-operations)
10. [Maintenance Window Procedures](#10-maintenance-window-procedures)
11. [On-Call Handoff Template](#11-on-call-handoff-template)

---

## 1 — Quick Reference — Emergency Commands

These commands are used during active incidents. Memorize or bookmark this section.

### Activate Feature Flags (Emergency)

```bash
# Full Emergency Lock (everything disabled)
kubectl exec -n production deploy/admin-api -- \
  node -e "require('./dist/flags').setFlag('emergency_lock', true)"

# Economy Lock only
kubectl exec -n production deploy/admin-api -- \
  node -e "require('./dist/flags').setFlag('economy_lock', true)"

# Marketplace Freeze only
kubectl exec -n production deploy/admin-api -- \
  node -e "require('./dist/flags').setFlag('marketplace_freeze', true)"

# Maintenance Mode (bot responds with maintenance message)
kubectl exec -n production deploy/admin-api -- \
  node -e "require('./dist/flags').setFlag('maintenance_mode', true)"

# Text-Only Battles (disables rendering)
kubectl exec -n production deploy/admin-api -- \
  node -e "require('./dist/flags').setFlag('text_only_battles', true)"

# Redis Degraded Mode (bypass Redis, use DB fallback)
kubectl exec -n production deploy/admin-api -- \
  node -e "require('./dist/flags').setFlag('redis_degraded_mode', true)"
```

### Check All Pod Status

```bash
# All production pods
kubectl get pods -n production

# Bot pods only
kubectl get pods -n production -l app=ascension-bot

# Render workers only
kubectl get pods -n production -l app=render-worker

# Admin API
kubectl get pods -n production -l app=admin-api
```

### Get Recent Logs

```bash
# Bot pod logs (last 200 lines)
kubectl logs -n production -l app=ascension-bot --tail=200

# Bot pod logs (follow live)
kubectl logs -n production -l app=ascension-bot -f

# Render worker logs
kubectl logs -n production -l app=render-worker --tail=100

# Admin API logs
kubectl logs -n production -l app=admin-api --tail=100
```

### Restart a Service

```bash
# Restart all bot pods (rolling restart — zero downtime if healthy)
kubectl rollout restart deploy/ascension-bot -n production

# Restart render workers
kubectl rollout restart deploy/render-worker -n production

# Restart admin API
kubectl rollout restart deploy/admin-api -n production
```

### Check Service Endpoints

```bash
# Admin API health check
curl -sf http://admin-api-svc.production.svc.cluster.local:5000/health && echo OK

# Render worker health check
curl -sf http://render-worker-svc.production.svc.cluster.local:3001/health && echo OK
```

---

## 2 — Deployment Runbook

### 2.1 Standard Deployment (Blue/Green)

**Pre-deployment checklist:**
```
□ CI passing on the target branch
□ QA sign-off received (staging smoke test passed)
□ Patch notes written (if player-facing changes)
□ No active P1/P2 incidents
□ On-call engineer available during deployment
□ Rollback plan confirmed
□ Deployment window: NOT peak hours (avoid 14:00–22:00 UTC)
```

**Step 1: Deploy Green environment**
```bash
# Tag the release
git tag v1.N.N
git push origin v1.N.N

# Deploy to Green (CI/CD handles this automatically on tag push)
# Or manually:
kubectl apply -f k8s/production/green/ -n production

# Wait for Green pods to be Ready
kubectl rollout status deploy/ascension-bot-green -n production
# Expected: "deployment ascension-bot-green successfully rolled out"
```

**Step 2: Route canary traffic (5%) to Green**
```bash
kubectl annotate ingress ascension-prod \
  nginx.ingress.kubernetes.io/canary="true" \
  nginx.ingress.kubernetes.io/canary-weight="5" \
  -n production
```

**Step 3: Monitor canary (30 min minimum)**

Open Grafana dashboard → Bot Health Overview. Watch:
- Error rate (canary vs. blue)
- P95 command latency (canary vs. blue)
- Any unexpected error patterns in logs

**Step 4: Promote to 100% (if canary passes)**
```bash
# Route 100% traffic to Green
kubectl annotate ingress ascension-prod \
  nginx.ingress.kubernetes.io/canary- \
  -n production

# Update main deployment pointer to Green
kubectl patch svc ascension-bot-svc -n production \
  -p '{"spec":{"selector":{"color":"green"}}}'
```

**Step 5: Keep Blue hot for 30 minutes, then decommission**
```bash
# After 30 minutes with no issues:
kubectl scale deploy/ascension-bot-blue --replicas=0 -n production
```

---

### 2.2 Hotfix Deployment

**Use ONLY for P1/P2 confirmed production issues. Abbreviated canary soak: 15 minutes.**

```bash
# 1. Create hotfix branch from production tag
git checkout -b hotfix/INC-YYYY-NNN v[last-production-tag]

# 2. Apply fix (minimum viable change only)
# ... code changes ...

# 3. Commit and push
git commit -m "hotfix(INC-YYYY-NNN): brief description"
git push origin hotfix/INC-YYYY-NNN

# 4. Create PR against main — get at least 1 reviewer approval

# 5. After merge, tag and deploy (abbreviated process)
git tag v1.N.N-hotfix.1
git push origin v1.N.N-hotfix.1

# 6. Deploy (same blue/green process, 15-minute canary soak)
# 7. After confirmation, back-merge to develop:
git checkout develop && git merge main
git push origin develop
```

---

## 3 — Rollback Runbook

**Decision authority:** On-call engineer can initiate rollback independently for clear incidents. Technical Director required for rollbacks involving database schema changes.

### 3.1 Standard Code Rollback (< 5 minutes)

```bash
# Step 1: Confirm rollback decision (note in #incidents channel)
# Step 2: Route all traffic back to Blue (stable) environment
kubectl annotate ingress ascension-prod \
  nginx.ingress.kubernetes.io/canary- \
  -n production

kubectl patch svc ascension-bot-svc -n production \
  -p '{"spec":{"selector":{"color":"blue"}}}'

# Step 3: Verify Blue pods are all healthy
kubectl get pods -n production -l app=ascension-bot,color=blue
# All should show Running / Ready

# Step 4: Scale down (bad) Green
kubectl scale deploy/ascension-bot-green --replicas=0 -n production

# Step 5: Verify bot is responding
# Run smoke test in test guild: /ping or similar

# Step 6: Post in #incidents: "Rollback complete. Stable on v[previous-version]."
# Step 7: Open post-mortem ticket immediately.
```

### 3.2 Rollback Verification

After rollback, verify:
```bash
# Check synthetic monitors (should all pass within 5 minutes)
curl -sf https://monitoring.ascension.internal/synthetic/status

# Manually test a command in the test guild
# Check error rate in Grafana (should be dropping back to baseline)
```

---

## 4 — Service Health Checks

Run this checklist before any deployment and after any incident resolution.

### Full Health Check

```bash
#!/bin/bash
echo "=== ASCENSION LEGENDS HEALTH CHECK ==="
echo ""

echo "[1/6] Bot pods..."
kubectl get pods -n production -l app=ascension-bot \
  --no-headers | awk '{print $1, $3, $4, $5}'

echo ""
echo "[2/6] Admin API..."
kubectl exec -n production deploy/admin-api -- \
  curl -sf http://localhost:5000/health && echo "PASS" || echo "FAIL"

echo ""
echo "[3/6] Render workers..."
kubectl get pods -n production -l app=render-worker \
  --no-headers | awk '{print $1, $3, $4, $5}'

echo ""
echo "[4/6] MongoDB (via admin-api check)..."
kubectl exec -n production deploy/admin-api -- \
  curl -sf http://localhost:5000/api/v1/status | grep -o '"db":"[^"]*"'

echo ""
echo "[5/6] Redis (via admin-api check)..."
kubectl exec -n production deploy/admin-api -- \
  curl -sf http://localhost:5000/api/v1/status | grep -o '"redis":"[^"]*"'

echo ""
echo "[6/6] BullMQ queue depths..."
kubectl exec -n production deploy/admin-api -- \
  node -e "require('./dist/queues').printQueueStatus()"

echo ""
echo "=== END HEALTH CHECK ==="
```

---

## 5 — Feature Flag Operations

### View Current Flag State

```bash
kubectl exec -n production deploy/admin-api -- \
  node -e "require('./dist/flags').printAllFlags()"
```

### Set a Flag

```bash
# Enable a flag
kubectl exec -n production deploy/admin-api -- \
  node -e "require('./dist/flags').setFlag('FLAG_NAME', true)"

# Disable a flag
kubectl exec -n production deploy/admin-api -- \
  node -e "require('./dist/flags').setFlag('FLAG_NAME', false)"
```

### Flag Reference

| Flag | Safe to toggle | Requires approval |
|------|---------------|-------------------|
| `double_xp_weekend` | Yes | Economy Analyst |
| `maintenance_mode` | Yes | On-call engineer |
| `text_only_battles` | Yes | On-call engineer |
| `marketplace_freeze` | Yes | On-call engineer |
| `economy_lock` | Yes | On-call engineer |
| `redis_degraded_mode` | Yes | On-call engineer |
| `emergency_lock` | Yes | On-call engineer (P1 only) |
| `season_N_content` | No | Game Director |
| `world_boss_event` | No | Game Director + Economy Analyst |

---

## 6 — Incident Triage Guide

### Step 1: What is failing?

```
Symptom: Bot not responding to commands
→ Check: kubectl get pods -n production -l app=ascension-bot
→ Check: Are shards connected? (Grafana → Shard Panel)
→ Check: discordstatus.com (is Discord down?)

Symptom: Commands responding with errors
→ Check: Error rate dashboard (Grafana → Command Performance)
→ Check: Which commands are failing? All or specific?
→ Check: Recent deployment? If yes → rollback candidate

Symptom: Battles not completing / renders failing
→ Check: kubectl get pods -n production -l app=render-worker
→ Check: BullMQ battle-render queue depth (Grafana → Queue Processing)
→ Action: Enable text_only_battles flag immediately

Symptom: Economy acting strangely
→ Check: Economy monitoring dashboard
→ Check: Recent drop table changes or patches?
→ Action: Enable economy_lock flag, page Economy Analyst immediately

Symptom: MongoDB errors in logs
→ Check: Atlas status page (status.mongodb.com)
→ Check: kubectl logs -l app=admin-api --tail=50 | grep -i "mongo"
→ Check: Atlas cluster health in Atlas UI

Symptom: Redis errors in logs
→ Check: Redis cluster health
→ Action: Enable redis_degraded_mode flag (prevents cascading failure)
```

### Step 2: Severity Assessment

| Symptom | Likely Severity |
|---------|-----------------|
| All commands failing, all guilds | P1 |
| Economy exploit confirmed | P1 |
| Security breach suspected | P1 |
| Renders failing, battles functional | P2 |
| Specific commands failing | P2 |
| Elevated error rate (< 10% affected) | P3 |
| Performance degradation, no errors | P3 |

### Step 3: Assign Roles and Open Incident Channel

```
/incident-YYYY-MM-DD-N [in Slack]
Assign:
  Incident Commander: [name]
  Technical Lead: [name]
  Communications Lead: [name]
```

---

## 7 — Database Operations

### Check MongoDB Status

```bash
# Via admin-api health endpoint
kubectl exec -n production deploy/admin-api -- \
  curl -sf http://localhost:5000/api/v1/status

# Direct replica set status (if you have mongo shell access)
mongosh $MONGODB_URI --eval "rs.status()"
```

### Check Atlas Backups

1. Log into MongoDB Atlas
2. Navigate to: Clusters → ascension-production → Backup
3. Verify last snapshot timestamp and status (should be < 4 hours ago)

### Emergency Snapshot (Before Risky Operation)

```bash
# Trigger manual Atlas snapshot via Atlas CLI
atlas backups snapshots create ascension-production \
  --clusterName ascension-production \
  --desc "Pre-operation-YYYY-MM-DD manual snapshot"
```

### PITR Restore (DR Level 1)

**This requires Technical Director approval. Do not proceed without sign-off.**

1. Note the exact restore point timestamp (UTC)
2. Open Atlas → Backup → Restore
3. Select "Point in Time" restore
4. Select target time (just before corruption)
5. Select restore destination: new cluster (not production — verify first)
6. After verification on isolated cluster, coordinate with Technical Director for production restore

---

## 8 — Redis Operations

### Check Redis Cluster Health

```bash
# Via a redis-cli pod (ensure redis-cli is available in cluster)
kubectl exec -n production deploy/redis-cli -- \
  redis-cli -h redis-cluster-svc --cluster check redis-cluster-svc:6379

# Check memory usage
kubectl exec -n production deploy/redis-cli -- \
  redis-cli -h redis-cluster-svc info memory | grep used_memory_human
```

### Check Cache Hit Rate

```bash
kubectl exec -n production deploy/redis-cli -- \
  redis-cli -h redis-cluster-svc info stats | grep -E "keyspace_hits|keyspace_misses"

# Hit rate = hits / (hits + misses)
# Target: > 85%
```

### Flush Cache (Non-Lock Keys Only — Emergency)

```bash
# WARNING: Only flush cache: namespace keys. NEVER flush lock: keys.
# This will temporarily increase DB load 3-5× as cache rebuilds.
kubectl exec -n production deploy/redis-cli -- \
  redis-cli -h redis-cluster-svc --scan --pattern "cache:*" | \
  xargs redis-cli -h redis-cluster-svc DEL
```

### Warm Cache After Redis Restore

```bash
# Run the cache warming script
kubectl exec -n production deploy/admin-api -- \
  node -e "require('./dist/scripts/warm-cache').warmCache()"
```

---

## 9 — Shard Operations

### Check Shard Status

```bash
# Bot pod logs show shard status at startup and on reconnect
kubectl logs -n production -l app=ascension-bot --tail=50 | \
  grep -E "shard|ready|reconnect"
```

### Force Shard Reconnect

```bash
# Restart specific bot pod (it will reconnect all its shards)
kubectl delete pod -n production [POD_NAME]
# Kubernetes will automatically reschedule it
```

### Shard Distribution Check

```bash
# Check which shards are handled by which pods
kubectl exec -n production -l app=ascension-bot -- \
  node -e "console.log(JSON.stringify(process.env.SHARD_LIST))"
```

---

## 10 — Maintenance Window Procedures

### Scheduled Maintenance

```bash
# Step 1: Announce maintenance (at least 2 hours in advance)
# Community Manager posts in #announcements

# Step 2: Enable maintenance mode 5 minutes before window
kubectl exec -n production deploy/admin-api -- \
  node -e "require('./dist/flags').setFlag('maintenance_mode', true)"

# Step 3: Pause BullMQ queues
kubectl exec -n production deploy/admin-api -- \
  node -e "require('./dist/queues').pauseAll()"

# Step 4: Perform maintenance work

# Step 5: Run health checks (Section 4)

# Step 6: Resume queues
kubectl exec -n production deploy/admin-api -- \
  node -e "require('./dist/queues').resumeAll()"

# Step 7: Disable maintenance mode
kubectl exec -n production deploy/admin-api -- \
  node -e "require('./dist/flags').setFlag('maintenance_mode', false)"

# Step 8: Verify bot responding
# Community Manager posts: "Maintenance complete. Ascension Legends is back online!"
```

---

## 11 — On-Call Handoff Template

Use this template for every on-call handoff (weekly rotation):

```
ON-CALL HANDOFF — [Date, UTC]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Outgoing: [Name]
Incoming: [Name]

CURRENT STATUS:  🟢 All Green  /  🟡 Degraded  /  🔴 Incident Active

ACTIVE INCIDENTS:
  [List any open incidents with severity and Slack channel link]
  OR: None

RECENT DEPLOYMENTS (last 7 days):
  [v1.N.N — Date — Description]

ACTIVE FEATURE FLAGS (non-default):
  [Flag name: true/false — Reason]
  OR: All defaults

KNOWN ISSUES / WATCH ITEMS:
  [Anything to keep an eye on this week]

SCHEDULED EVENTS THIS WEEK:
  [Events, deployments, maintenance windows]

OPEN P3/P4 TICKETS REQUIRING ATTENTION:
  [Ticket ID — description — priority]

NOTES FOR INCOMING:
  [Any context that would help the incoming engineer]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

*Runbook maintained by: Technical Director, DevOps/SRE*
*Review schedule: Monthly (or after any significant incident)*
*Version: 1.0.0*
