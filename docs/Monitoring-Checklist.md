# ASCENSION LEGENDS — Monitoring Checklist

> **Purpose:** Daily, weekly, and monthly monitoring tasks for the Ascension Legends live service. This is the operational health checklist — verify these items to catch problems before players do.
>
> **Cross-reference:** Book 4 Section 4 (Monitoring & Observability) for full dashboard and alert specifications.

---

## Daily Monitoring Checklist

Run every morning (08:00 UTC) by the on-call engineer or designated SRE.

### Infrastructure Health

```
□ [Grafana] Bot Health Overview dashboard — all panels green?
  → Active shard count equals expected total shards?
  → Shard heartbeat P95 < 250 ms?
  → No pod restarts in last 24 hours?
  → CPU < 70% per pod?
  → Memory < 80% per pod?

□ [Grafana] Infrastructure dashboard — MongoDB + Redis
  → MongoDB replication lag < 2 s?
  → MongoDB connection pool < 80% of max?
  → Redis memory < 75% of max?
  → Redis hit rate > 85%?
  → Redis cluster all nodes online?

□ [Atlas UI] MongoDB Atlas backup status
  → Last snapshot completed successfully?
  → Snapshot less than 6 hours old?
  → No Atlas alert emails overnight?

□ [Grafana] Queue Processing dashboard
  → All queue depths within normal range?
  → No DLQ items older than 15 minutes?
  → Worker concurrency at minimum levels?
```

### Application Health

```
□ [Grafana] Command Performance dashboard
  → Overall error rate < 0.5%?
  → P95 command response < 800 ms?
  → No single command with error rate > 5%?

□ [Grafana] Error Tracking dashboard
  → No unhandled exceptions in last 24 hours?
  → Admin API 5xx rate < 1%?
  → No unexpected error type spikes?

□ [Grafana] Battle System dashboard
  → Battle completion rate > 98%?
  → Render success rate > 98%?
  → Render queue depth within normal range?
  → No items in render DLQ > 5 minutes?
```

### Economy Health

```
□ [Economy Report] Daily economy report received at 06:00 UTC?
  → Gold net generation within expected range (±10%)?
  → No flagged anomalies (> 2σ deviation)?
  → Marketplace volume within normal range?
  → No suspicious account patterns flagged?
```

### Security

```
□ [SIEM / Grafana] Security alerts overnight
  → No brute force alerts?
  → No privilege escalation alerts?
  → No unusual API access patterns?
  → No Vault access anomalies?
```

**Sign-off:** _____________________________ Date: _____________ Time: _____________

---

## Weekly Monitoring Checklist

Run every Monday (09:00 UTC) by Senior Engineer or SRE.

### Performance Trends

```
□ [Grafana] P95 command latency trend (7-day)
  → Is it flat or improving? (flag if trending up > 10%)
  
□ [Grafana] Error rate trend (7-day)
  → Is it flat or improving? (flag if trending up > 0.2%)
  
□ [Grafana] Bot uptime 7-day rolling
  → Greater than 99.9%? (99.9% = max 10 min downtime/week)
  
□ [Grafana] Render success rate trend (7-day)
  → Is it flat or improving?
```

### Capacity Review

```
□ [Grafana] CPU utilization per service — are we approaching autoscale thresholds?
  → If > 60% sustained, review scaling policy

□ [Grafana] Memory utilization per pod — any memory creep (leak signs)?
  → If increasing week-over-week without load increase: investigate

□ [Atlas] MongoDB storage growth rate
  → Project storage exhaustion date (alert if < 60 days)

□ [Redis] Memory growth rate
  → Verify TTLs are working, no unbounded key growth

□ [K8s] Node utilization across cluster
  → Any nodes near capacity?
```

### Queue Health

```
□ [Grafana] Average job age per queue (7-day)
  → Are jobs processing within SLA on average?
  
□ [Grafana] Failed job rate per queue (7-day)
  → Any queues with sustained failure rate > 2%?
  
□ [DLQ] Dead Letter Queue review
  → Manually inspect any DLQ items that accumulated this week
  → Determine root cause, reprocess or discard
```

### MongoDB Operational Review

```
□ [Atlas] Performance Advisor — new index recommendations?
  → If high-impact recommendation: file ticket for next sprint
  
□ [Atlas] Slow queries this week (> 100 ms)
  → Any repeated slow queries? Investigate for missing index
  
□ [Atlas] Connection pool metrics peak for the week
  → Did we ever approach max connections? Plan ahead if yes
```

### Redis Operational Review

```
□ [Redis] Keyspace review — any new key patterns without TTL?
  → `redis-cli --scan --pattern "*"` and review unfamiliar patterns
  
□ [Redis] Slow log review
  → Any commands > 10 ms? Investigate for lock contention or large values
  
□ [Redis] Redlock contention metrics
  → High contention on battle locks = possible design issue
```

### Security Review

```
□ [Audit Log] Review admin actions this week
  → Any unexpected operations by any team member?
  → Any economy adjustments not in scheduled list?
  
□ [Auth] Review failed auth attempts to Admin API
  → Any IP showing repeated failures (brute force)?
  
□ [Deps] Check npm advisory for any new advisories on our dependencies
  → If new HIGH or CRITICAL: patch SLA clock starts today
```

### Economy Weekly Review

```
□ [Economy Report] Weekly economy report reviewed with Economy Analyst?
□ [Inflation Check] Gold supply growth rate < 5%?
□ [Sink Check] Gold sink ratio > 0.85?
□ [Marketplace] Marketplace sale rate 30–60%?
□ [Wealth] Gini coefficient < 0.60?
□ [Anomalies] Any economy patterns requiring balance patch discussion?
```

**Sign-off:** _____________________________ Date: _____________

---

## Monthly Monitoring Checklist

Run first Monday of each month, in conjunction with the Monthly Economy Review.

### Uptime Review

```
□ Monthly uptime calculated and recorded
  Target: > 99.9% (< 44 minutes downtime/month)
  
□ All incidents this month reviewed
  → Incident count: ___  P1: ___  P2: ___  P3: ___
  → MTTR for P1: ___  Target: < 30 min
  → MTTR for P2: ___  Target: < 2 hours
  
□ Post-mortems: all P1 incidents have a published post-mortem?
```

### Capacity Planning

```
□ DAU trend vs. infrastructure capacity
  → Current DAU: ___  Peak DAU: ___
  → Projected 90-day DAU: ___
  → Current infrastructure capacity (max sustainable): ___
  → Headroom: ___ months before scaling required
  
□ MongoDB storage projection
  → Current size: ___  Monthly growth: ___
  → Projected exhaustion: ___ (alert if < 90 days)
  
□ Redis memory projection
  → Current usage: ___/___  Monthly growth: ___
  → Projected exhaustion: ___ (alert if < 60 days)
  
□ Shard count review
  → Current guild count: ___  Shards: ___  Guilds per shard: ___
  → If guilds/shard > 1,500: plan shard count increase
```

### Database Maintenance

```
□ Index review: run db.collection.aggregate([{$indexStats:{}}]) on major collections
  → Identify indexes with 0 usage in the past month
  → File ticket to drop unused indexes in next maintenance window
  
□ Collection statistics review
  → Any unexpected collection size spikes?
  → Review TTL index effectiveness (confirm docs are being deleted)
  
□ MongoDB Atlas billing review
  → Storage, compute, data transfer within budget?
```

### Backup Verification

```
□ Monthly backup restoration test completed?
  → Restore latest daily snapshot to isolated environment
  → Verify record counts match expected
  → Verify application can connect and query correctly
  → Document: test date, restore point, result
  
□ Backup retention policy compliance
  → Verify old snapshots being purged per policy
  → Verify monthly snapshot archived to offsite
```

### Security Monthly Review

```
□ Access control review: all team member access still appropriate?
□ Secret rotation: any secrets due for rotation this month?
□ Dependency audit: no unresolved HIGH/CRITICAL vulnerabilities?
□ Audit log anomaly review: any unusual patterns over the past month?
□ WAF log review: any new attack patterns we should block?
```

### Economy Monthly Review

```
□ Monthly economy meeting held (first Wednesday)?
□ 30-day Gold supply growth: ___% (target: < 5%)
□ 30-day Gold sink ratio: ___ (target: 0.85–1.00)
□ Wealth distribution Gini: ___ (target: < 0.60)
□ New player economy performance: on target?
□ Veteran player economy performance: on target?
□ Balance changes required this month? (assign owner + deadline)
```

### KPI Review

```
□ Monthly KPI report compiled and distributed?
□ DAU: ___ (target: growth or maintained)
□ WAU: ___ 
□ MAU: ___
□ D7 Retention: ___% (target: > 30%)
□ D30 Retention: ___% (target: > 15%)
□ Battle participation rate: ___% (target: > 60% of DAU)
□ Error rate (monthly average): ___% (target: < 0.5%)
□ Bot uptime: ___% (target: > 99.9%)
```

**Sign-off (Technical Director):** _____________________________ Date: _____________
**Sign-off (Game Director):** _____________________________ Date: _____________

---

## Alert Thresholds Reference Card

Keep this card open during on-call shifts.

| Metric | Warning | Critical (Page) |
|--------|---------|-----------------|
| Bot error rate | > 0.5% | > 2% |
| Command P95 latency | > 600 ms | > 1,200 ms |
| Shard heartbeat P95 | > 350 ms | > 750 ms |
| Shards connected | < 95% of total | < 80% of total |
| Render success rate | < 99% | < 95% |
| Render P95 | > 12 s | > 20 s |
| Battle-render DLQ | Any item > 5 min | Any item > 10 min |
| MongoDB replication lag | > 1 s | > 5 s |
| MongoDB connections | > 70% of max | > 85% of max |
| Redis memory | > 70% of max | > 85% of max |
| Redis hit rate | < 88% | < 80% |
| Pod CPU | > 75% for 5 min | > 90% for 5 min |
| Pod memory | > 80% of limit | > 90% of limit |
| Pod restarts | Any restart | 3+ restarts in 10 min |
| Admin API 5xx rate | > 0.5% | > 2% |
| Gold supply growth (daily) | > 5% | > 10% |
| Economy DLQ depth | Any item > 10 min | Any item > 20 min |

---

## Grafana Dashboard URLs

> **Note:** Replace `monitoring.ascension.internal` with actual internal Grafana URL.

| Dashboard | URL |
|-----------|-----|
| Bot Health Overview | `http://monitoring.ascension.internal/d/bot-health` |
| Guild Activity | `http://monitoring.ascension.internal/d/guild-activity` |
| Battle System | `http://monitoring.ascension.internal/d/battle-system` |
| Command Performance | `http://monitoring.ascension.internal/d/commands` |
| Error Tracking | `http://monitoring.ascension.internal/d/errors` |
| API Performance | `http://monitoring.ascension.internal/d/api-perf` |
| Infrastructure | `http://monitoring.ascension.internal/d/infra` |
| Queue Processing | `http://monitoring.ascension.internal/d/queues` |
| Media Rendering | `http://monitoring.ascension.internal/d/rendering` |
| Economy | `http://monitoring.ascension.internal/d/economy` |

---

*Monitoring Checklist maintained by: DevOps / SRE*
*Review schedule: Quarterly (update thresholds based on baseline data)*
*Version: 1.0.0*
