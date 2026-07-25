# ASCENSION LEGENDS — Security Policy

> **Classification:** Internal — Do not share externally without Technical Director approval.
>
> **Purpose:** Defines security standards, access controls, incident response procedures, and compliance requirements for Ascension Legends. All team members with system access must read and acknowledge this policy.
>
> **Cross-reference:** Book 4 Section 7 (Security Operations) for operational detail.

---

## Table of Contents

1. [Security Principles](#1-security-principles)
2. [Access Control Policy](#2-access-control-policy)
3. [Authentication Requirements](#3-authentication-requirements)
4. [Secrets Management Policy](#4-secrets-management-policy)
5. [Code Security Standards](#5-code-security-standards)
6. [Data Protection Policy](#6-data-protection-policy)
7. [Network Security](#7-network-security)
8. [Dependency Management](#8-dependency-management)
9. [Audit and Logging Policy](#9-audit-and-logging-policy)
10. [Vulnerability Management](#10-vulnerability-management)
11. [Security Incident Response](#11-security-incident-response)
12. [Player Data Privacy](#12-player-data-privacy)
13. [Responsible Disclosure](#13-responsible-disclosure)
14. [Compliance Checklist](#14-compliance-checklist)
15. [Acknowledgment](#15-acknowledgment)

---

## 1 — Security Principles

The Ascension Legends security posture is built on four foundational principles:

### 1.1 Principle of Least Privilege
Every person, service, and process has access only to the resources it needs — nothing more. Access is denied by default and granted explicitly. When in doubt, grant less and expand later.

### 1.2 Defense in Depth
No single security control is sufficient. We layer controls: WAF at the edge, authentication at the API, authorization at the route level, validation at the input layer, and audit logging at every sensitive operation. Assume any single layer can fail.

### 1.3 Assume Breach
Design systems assuming an attacker has already gotten past the outer layer. Sensitive operations require multiple controls. Lateral movement must be limited. Blast radius must be contained.

### 1.4 Security is Everyone's Job
Security is not solely the responsibility of the Technical Director or any designated security person. Every engineer is responsible for the security of the code they write. Every community manager is responsible for not exposing internal information. Every support agent is responsible for identity verification.

---

## 2 — Access Control Policy

### 2.1 Role-Based Access Control (RBAC)

All system access is role-based. Roles are defined in Book 4, Section 7.2. Key rules:
- Roles are assigned by the Technical Director
- Role assignments are reviewed quarterly
- Any role change requires Technical Director approval
- No role may be self-assigned

### 2.2 Production Access

Production environment access is restricted to:
- Technical Director
- Senior Engineers
- On-call Engineers (during their rotation only)
- DevOps/SRE team members

**Production access rules:**
- All production access is logged (who, what, when, from where)
- Direct database access to production requires a documented reason
- No developer should have standing (permanent) write access to production player data without a specific, time-limited reason
- Production access via kubectl requires Kubernetes RBAC (not cluster-admin for routine operations)

### 2.3 Access Onboarding

New team members receive access in stages:
1. Development environment access: granted on Day 1
2. Staging environment access: granted after security policy acknowledgment (Section 15)
3. QA environment access: granted based on role
4. Production access: granted only when required by role, after 30-day team onboarding

### 2.4 Access Offboarding

When a team member departs:
1. All access revoked on the last day of employment (before end of business)
2. All secrets the individual had access to are rotated within 24 hours
3. Review audit logs for 30 days prior to departure for unusual activity
4. Remove from all shared accounts, mailing lists, Discord servers (internal team)

---

## 3 — Authentication Requirements

### 3.1 Admin Panel Authentication

All Admin API access requires:
- Valid JWT token (short-lived: 1-hour expiry)
- Token issued via Discord OAuth2 flow (no password-based auth)
- Multi-Factor Authentication (MFA) enabled on Discord account
- Session logged in audit trail

### 3.2 Internal Service Authentication

Service-to-service calls (bot → admin-api, admin-api → render-worker) use:
- Static API keys (not JWT) rotated quarterly
- Keys passed via HTTP headers, never in URLs
- Keys stored as Kubernetes secrets, never in code

### 3.3 Database Authentication

- MongoDB Atlas: username/password per service account, TLS enforced, stored in Vault
- Redis: AUTH password, TLS enforced, stored in Vault
- No unauthenticated database connections permitted

### 3.4 MFA Requirements

MFA is **mandatory** for:
- All team members with any system access
- Discord accounts associated with bot tokens
- HashiCorp Vault access
- MongoDB Atlas access
- Kubernetes cluster access (via kubeconfig + MFA)
- Cloud provider console access

---

## 4 — Secrets Management Policy

### 4.1 Prohibited Secret Storage Locations

**NEVER store secrets in:**
- Source code (any file, in any form — hardcoded, commented out, or otherwise)
- `.env` files committed to git
- Kubernetes ConfigMaps (use Secrets instead)
- Container image layers
- Log files or monitoring systems
- Slack, Discord, email, or any messaging platform
- GitHub Issues, PRs, or commit messages
- Documentation files (including this document)

Violation of this rule requires immediate secret rotation, regardless of whether the exposure was intentional.

### 4.2 Approved Secret Storage

All secrets must be stored in **HashiCorp Vault** (or Kubernetes Secrets for runtime injection, backed by Vault). The approval chain:
1. New secret identified
2. Technical Director approves the secret's purpose
3. Secret generated (not human-chosen for high-entropy values)
4. Stored in Vault under the appropriate path
5. Access policy created (only required services/people can read)
6. Injected into runtime (Kubernetes Secret → environment variable)

### 4.3 Secret Rotation

Rotation schedule per secret type — see Book 4, Section 7.4. Additional rules:
- Any secret suspected of exposure is rotated **immediately** (do not wait for the next rotation cycle)
- Secret rotation is tested before the old secret is invalidated (avoid outages from premature rotation)
- Rotation events are logged in the audit trail

### 4.4 Git History Scanning

An automated secret scanner (e.g., gitleaks, truffleHog) runs on every git push in CI. If a potential secret is detected:
1. Push is blocked
2. Engineering team is alerted
3. If confirmed: immediately rotate the potentially-exposed secret
4. Review git history to confirm exact exposure window

---

## 5 — Code Security Standards

### 5.1 Input Validation

All user-provided input (Discord command parameters, API request bodies) must be validated using **Zod schemas** before processing. Rules:
- No raw string concatenation in database queries or system calls
- Validate type, format, length, and allowed values at every entry point
- Reject unknown fields (strip unknown properties in Zod schemas)
- Log validation failures (may indicate probing/attack)

### 5.2 Dependency Security

- All production dependencies are reviewed before addition (Book 4, Section 8 Dependency Management)
- `npm audit` runs in CI and blocks on high/critical vulnerabilities
- Dependencies with no patch available are reviewed by Technical Director before continued use
- No dependencies with known active exploit chains, regardless of patch availability
- Lock files (`pnpm-lock.yaml`) must be committed and checked in CI

### 5.3 Code Review Security Checklist

Every PR touching security-sensitive areas must be reviewed against:
```
□ No secrets or credentials in the code
□ All user input validated (Zod schema or equivalent)
□ No SQL/NoSQL injection vectors
□ Authentication enforced on all routes (no accidental public exposure)
□ Authorization enforced (user can only act on their own resources)
□ Sensitive operations logged in audit trail
□ Error messages do not leak internal structure (generic errors to client)
□ Rate limiting applied to user-facing endpoints
```

### 5.4 TypeScript Security Rules

- TypeScript strict mode is mandatory (enforced by tsconfig)
- No `any` types in security-sensitive code (auth, economy, admin)
- Explicit return types on all exported functions
- No `eval()`, `new Function()`, or dynamic code execution
- No `innerHTML`, `dangerouslySetInnerHTML` (if any web UI exists)

### 5.5 Error Handling

- Internal error details (stack traces, query contents, file paths) must NEVER reach player-facing responses
- All errors are logged internally with full context
- External errors return: error code, generic message, request ID (for support lookup)
- Example:
  ```json
  // ✅ CORRECT — generic, not leaking internals
  { "error": "INTERNAL_ERROR", "message": "Something went wrong.", "requestId": "req_01J..." }

  // ❌ WRONG — leaks internal structure
  { "error": "MongoServerError: ...", "stack": "...", "query": "{ userId: ... }" }
  ```

---

## 6 — Data Protection Policy

### 6.1 Data Classification

| Classification | Examples | Handling |
|---------------|---------|---------|
| **Public** | In-game usernames, guild names, public leaderboards | May be displayed publicly |
| **Internal** | Game balance data, analytics aggregates, team communications | Internal only, do not share externally |
| **Confidential** | Player account details, economy transaction history, Discord IDs | Access controlled, encrypted at rest |
| **Restricted** | Auth tokens, credentials, personal information beyond Discord ID | Vault only, strict access, never logged |

### 6.2 Data at Rest

- All MongoDB Atlas data: encrypted at rest (AES-256) — handled by Atlas
- All Redis data: encrypted at rest — handled by cloud provider
- All backup snapshots: encrypted at rest — verified in Atlas settings
- Kubernetes secrets: encrypted at rest using KMS encryption
- No player data stored on engineer workstations (no local data exports without Technical Director approval)

### 6.3 Data in Transit

- All external traffic: TLS 1.2+ required, TLS 1.3 preferred
- All service-to-service traffic: TLS enforced (internal mTLS for Kubernetes services)
- No plaintext HTTP for any connection carrying credentials or player data
- Certificate management: automated via cert-manager (Kubernetes), with auto-renewal

### 6.4 Data Minimization

- Collect only the data needed to operate the game
- Discord ID is the primary player identifier — we do not collect email, phone, or real name
- Analytics events are purged after 90 days (raw) — see retention policy (Book 4, Section 6.7)
- Support tickets purged after 3 years

### 6.5 Player Data Access

- No team member may look up a specific player's data out of personal curiosity — all access must be for operational or support purposes
- All player data lookups by support/engineering are logged in the audit trail
- Players may request their own data (data export) — fulfilled within 30 days

---

## 7 — Network Security

### 7.1 Network Segmentation

```
NETWORK ZONES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PUBLIC ZONE      → Bot (Discord Gateway connections, Discord API calls)
                   Admin API (internal tool access, admin panel)

INTERNAL ZONE    → Bot ↔ Admin API ↔ Render Worker
                   (no direct internet access for internal services)

DATA ZONE        → MongoDB Atlas, Redis Cluster
                   (accessible only from Internal Zone)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7.2 Firewall Rules

- Default deny all inbound traffic
- Allow only: HTTPS (443) inbound to Admin API (from authorized IP ranges only)
- Discord Gateway connections: outbound only, on standard ports
- MongoDB Atlas: access via Atlas IP allowlist (Kubernetes cluster egress IP only)
- Redis: access within Kubernetes cluster only (no external access)

### 7.3 WAF (Web Application Firewall)

The Admin API is protected by a WAF with rules for:
- SQL injection detection
- XSS attempt detection
- Automated scanner blocking
- Rate limiting by IP (burst: 100 req/10s, sustained: 200 req/min)
- Geographic blocking (if applicable — reviewed per region)

### 7.4 DDoS Protection

- Cloud provider DDoS protection (Layer 3/4) enabled for all production infrastructure
- WAF rate limiting for Layer 7 protection
- If DDoS detected: activate WAF aggressive mode, alert on-call, consider IP blocking

---

## 8 — Dependency Management

### 8.1 Dependency Review Process

Before adding any new npm package:
1. Review package popularity (downloads/week), maintenance activity (last commit), and known issues
2. Check npm audit score
3. Review package source code for red flags (obfuscated code, unexpected network calls)
4. Verify license compatibility (MIT, Apache 2.0, BSD preferred — avoid GPL for commercial use)
5. Obtain Technical Director approval for packages with > 50 transitive dependencies or security-adjacent functionality

### 8.2 Automated Dependency Scanning

- `pnpm audit` runs in CI on every PR — blocks on HIGH and CRITICAL vulnerabilities
- Dependabot or equivalent configured to auto-PR dependency updates weekly
- Security advisories from npm advisory database subscribed via notification

### 8.3 Patching SLA

| Vulnerability Severity | Patch SLA |
|------------------------|---------|
| Critical | 24 hours |
| High | 7 days |
| Medium | 30 days |
| Low | Next regular release |

---

## 9 — Audit and Logging Policy

### 9.1 What Must Be Logged

Every operation in the following categories must generate an audit log entry:
- Admin API authentication (success and failure)
- Admin API write operations (POST, PUT, PATCH, DELETE)
- Economy write operations (currency grants, transfers, corrections)
- Player account actions (suspend, unsuspend, delete)
- Feature flag changes
- Deployment actions (rollback, scale, restart)
- Secret access (Vault audit log)
- Moderation actions (ban, mute, warn)
- Support account recovery
- Emergency Lock Mode activation/deactivation

### 9.2 What Must NOT Be Logged

- Plaintext passwords (which we don't use — but explicitly called out)
- Auth tokens or session tokens (log the token ID, not the token value)
- Full credit card or payment details (handled by payment provider)
- Discord DM content (we do not intercept DMs)
- Any data classified as Restricted (Section 6.1)

### 9.3 Log Retention

| Log Type | Hot Storage | Cold Archive | Total Retention |
|----------|------------|--------------|-----------------|
| Audit logs | 1 year | 2 additional years | 3 years |
| Application logs | 30 days | 60 additional days | 90 days |
| Security alerts | 1 year | 2 additional years | 3 years |
| Access logs (HTTP) | 30 days | 30 additional days | 60 days |

### 9.4 Log Integrity

- Audit logs are append-only — no modifications or deletions
- Logs are streamed to external SIEM (cannot be deleted from production systems)
- Log integrity checksums computed daily and verified weekly

---

## 10 — Vulnerability Management

### 10.1 Vulnerability Sources

We monitor vulnerabilities from:
- npm advisory database (automated via CI)
- GitHub Security Advisories
- Node.js security releases (subscribe to nodejs-sec mailing list)
- Discord.js security advisories
- MongoDB driver advisories
- CISA Known Exploited Vulnerabilities catalog

### 10.2 Penetration Testing

- Annual external penetration test by qualified third party
- Scope: Admin API, Discord bot command injection surface, Kubernetes cluster
- Report delivered to Technical Director within 14 days of test completion
- All critical and high findings remediated before next launch/major release
- Results are confidential — never shared externally

### 10.3 Internal Security Review

- Security review of any new major feature before production deployment
- Checklist: Code security standards (Section 5), data protection (Section 6), access control (Section 2)
- Technical Director signs off on security reviews for major features

---

## 11 — Security Incident Response

For full incident response procedures, see Book 4, Section 7.7 (Compromised Account Response) and Section 15.5 (DR Level 3 — Security Breach).

### 11.1 Reporting a Security Issue (Internal)

If you discover a potential security vulnerability:
1. Do NOT fix it silently and deploy — report it first
2. Do NOT discuss it in public channels (Discord, GitHub Issues)
3. Contact the Technical Director directly (Slack DM or secure channel)
4. Document: what you found, how you found it, potential impact, steps to reproduce
5. Technical Director will assess and respond within 1 hour for critical issues

### 11.2 Security Alert Tiers

| Alert | Definition | Response Time |
|-------|-----------|--------------|
| Critical | Active breach, data at risk, exploit being used in production | Immediate (call TD directly) |
| High | Potential breach, significant vulnerability confirmed | 1 hour |
| Medium | Vulnerability confirmed, no current exploitation | 24 hours |
| Low | Theoretical vulnerability, low impact | Next business day |

---

## 12 — Player Data Privacy

### 12.1 What Data We Collect

From players, we collect and store:
- Discord user ID (public Discord data)
- Discord username/display name (public Discord data)
- Game progress data (character level, items, economy balances, battle history)
- Game interaction data (command history, event participation)
- Support tickets (if submitted by player)

We do **not** collect:
- Real name
- Email address (unless voluntarily provided in a support ticket)
- Physical location beyond Discord's regional server determination
- Payment information (handled by Discord/payment provider)
- IP addresses (not logged for players, only for security anomaly detection on admin access)

### 12.2 Data Subject Rights

Players have the right to:
- **Access:** Request a copy of their data (fulfilled within 30 days via support ticket)
- **Deletion:** Request deletion of their account and data (fulfilled within 30 days; some aggregated analytics may be retained)
- **Correction:** Request correction of inaccurate data
- **Portability:** Receive their data in a machine-readable format

### 12.3 GDPR Compliance

For EU players:
- Data processing lawful basis: Legitimate interest (operating the game), Contract (game terms of service)
- Data controller: Studio entity
- No transfer of EU player data to non-adequate third-party countries without appropriate safeguards
- Data breach notification: Affected EU players notified within 72 hours of confirmed breach discovery

### 12.4 COPPA Compliance

Ascension Legends is a game intended for users 13+ (Discord minimum age). We:
- Do not knowingly collect data from users under 13
- Rely on Discord's age verification as our primary control
- If underage user is discovered: immediately suspend account and delete associated data

---

## 13 — Responsible Disclosure

### 13.1 Bug Bounty (Future Program)

A formal bug bounty program is planned for Year 2. Until then, responsible disclosure is handled as follows:

**If you discover a security vulnerability:**
1. Contact: security@ascension-legends.internal (or Technical Director directly)
2. Include: description, reproduction steps, potential impact
3. Do NOT exploit the vulnerability beyond what is needed to demonstrate it
4. Do NOT share the vulnerability publicly until we confirm a fix is deployed

**We commit to:**
- Acknowledge receipt within 24 hours
- Provide a status update within 7 days
- Notify you when the issue is resolved
- Reward responsible disclosure at our discretion (in-game rewards at minimum)

### 13.2 Hall of Thanks

Players and researchers who responsibly disclose security issues receive recognition in the game's Security Hall of Thanks (in-game acknowledgment), with their consent.

---

## 14 — Compliance Checklist

Annual compliance review — Technical Director and Security designee:

```
DATA PROTECTION
□ Player data inventory current and accurate
□ Data retention policies enforced via automated scripts
□ Data subject rights process tested and documented
□ Privacy policy current and accurate (website/support server)

ACCESS CONTROL
□ All access roles reviewed and correct (quarterly review)
□ All departed team members' access revoked
□ MFA enforced for all team members with system access
□ Production access log reviewed for anomalies

SECRETS
□ All secrets in Vault (none in code/files)
□ All secrets rotated per policy
□ Vault audit log reviewed

VULNERABILITIES
□ Annual penetration test completed
□ All critical/high findings remediated
□ Dependency audit: no unresolved high/critical
□ Security policy reviewed and updated

LOGGING & AUDIT
□ Audit logs verified intact and complete
□ Log retention policy enforced
□ SIEM alerts tuned and responding correctly

INCIDENT PREPAREDNESS
□ DR drill completed (annual)
□ All SOPs reviewed and updated
□ Team trained on security incident response
```

---

## 15 — Acknowledgment

All team members with system access must acknowledge this policy. Acknowledgment is recorded in the HR system.

```
SECURITY POLICY ACKNOWLEDGMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
I, [Full Name], confirm that I have read and understood the
Ascension Legends Security Policy. I agree to:

□ Comply with all policies in this document
□ Report any suspected security incident immediately
□ Never share credentials or system access with unauthorized parties
□ Never store secrets outside of approved systems
□ Complete security training as required by the studio

Signed: ________________________
Date: __________________________
Role: __________________________
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

*Security Policy maintained by: Technical Director*
*Review schedule: Annually, or after any security incident*
*Next review: Before Season 1 Launch*
*Version: 1.0.0*
