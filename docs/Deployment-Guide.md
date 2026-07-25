# ASCENSION LEGENDS — Deployment Guide

> **Scope:** End-to-end operational runbook for deploying, maintaining, and rolling back the ASCENSION LEGENDS platform. Covers local development, Docker, Kubernetes, CI/CD, secrets management, database operations, and incident procedures.

---

## Table of Contents

1. [Environment Overview](#1-environment-overview)
2. [Prerequisites](#2-prerequisites)
3. [Local Development Setup](#3-local-development-setup)
4. [Environment Variables & Secrets](#4-environment-variables--secrets)
5. [Docker](#5-docker)
6. [Kubernetes Manifests](#6-kubernetes-manifests)
7. [CI/CD Pipeline](#7-cicd-pipeline)
8. [Database Operations](#8-database-operations)
9. [Secrets Management](#9-secrets-management)
10. [Scaling & Resource Allocation](#10-scaling--resource-allocation)
11. [Health Checks & Readiness](#11-health-checks--readiness)
12. [Rollback Procedures](#12-rollback-procedures)
13. [Incident Response Runbook](#13-incident-response-runbook)
14. [Maintenance Windows](#14-maintenance-windows)
15. [Checklist: First Production Deploy](#15-checklist-first-production-deploy)

---

## 1. Environment Overview

Three environments are maintained:

| Environment | Purpose | Infrastructure |
|-------------|---------|----------------|
| `local` | Developer machines | Docker Compose |
| `staging` | Pre-production QA | Kubernetes (single-region) |
| `production` | Live game | Kubernetes (multi-region, HA) |

### Service Inventory

| Service | Image | Min Replicas (prod) |
|---------|-------|----------------------|
| `bot` | `ascension/bot` | 2 (per shard group) |
| `admin-api` | `ascension/admin-api` | 2 |
| `render-worker` | `ascension/render-worker` | 4 |
| `notification-worker` | `ascension/notification-worker` | 2 |
| `economy-worker` | `ascension/economy-worker` | 2 |
| `quest-worker` | `ascension/quest-worker` | 2 |
| `leaderboard-worker` | `ascension/leaderboard-worker` | 1 |
| `analytics-worker` | `ascension/analytics-worker` | 1 |
| MongoDB (Atlas) | Managed | N/A |
| Redis Cluster (Upstash/self-hosted) | Managed | N/A |

---

## 2. Prerequisites

### Required Tools

```bash
# Core
node >= 20.0.0
pnpm >= 9.0.0
docker >= 24.0.0
docker-compose >= 2.20.0
kubectl >= 1.28.0
helm >= 3.12.0

# Secrets
# doppler CLI or equivalent secrets manager

# Validation
curl
jq
```

### Check versions:

```bash
node --version
pnpm --version
docker --version
kubectl version --client
helm version
```

---

## 3. Local Development Setup

### 3.1 Clone and install

```bash
git clone https://github.com/olasubomi-png/ASCENSION-LEGENDS.git
cd ASCENSION-LEGENDS
pnpm install
```

### 3.2 Start infrastructure (MongoDB + Redis)

```bash
docker compose -f docker/compose.infra.yml up -d
```

This starts:
- MongoDB on `localhost:27017`
- Redis on `localhost:6379`

Wait for health checks:
```bash
docker compose -f docker/compose.infra.yml ps
# Both should show "healthy"
```

### 3.3 Copy and configure environment

```bash
cp .env.example .env.local
# Edit .env.local with your Discord bot token, etc.
```

See Section 4 for the full variable reference.

### 3.4 Seed development data

```bash
pnpm --filter @workspace/database run seed:dev
```

### 3.5 Run all services

```bash
pnpm run dev
# Turborepo starts all packages and services in dependency order
```

Services started:
- Bot: connects to Discord (requires real token)
- Admin API: `http://localhost:3001`

### 3.6 Verify

```bash
curl http://localhost:3001/health
# Expected: {"status":"alive","timestamp":"..."}
```

---

## 4. Environment Variables & Secrets

### 4.1 Variable reference

All services read from environment variables. The table below lists every variable, which service uses it, and whether it is a secret.

| Variable | Services | Secret | Description |
|----------|----------|--------|-------------|
| `NODE_ENV` | all | no | `development`, `staging`, `production` |
| `LOG_LEVEL` | all | no | `trace`, `debug`, `info`, `warn`, `error` |
| `DISCORD_BOT_TOKEN` | bot | **yes** | Discord bot token |
| `DISCORD_CLIENT_ID` | bot | no | Discord application client ID |
| `DISCORD_CLIENT_SECRET` | bot | **yes** | Discord OAuth client secret |
| `DISCORD_PUBLIC_KEY` | bot | no | Discord interactions public key |
| `MONGODB_URI` | all services | **yes** | Full MongoDB connection string incl. credentials |
| `MONGODB_DB_NAME` | all services | no | Database name (`ascension_prod`, etc.) |
| `REDIS_URL` | all services | **yes** | Redis connection URL |
| `REDIS_PASSWORD` | all services | **yes** | Redis AUTH password |
| `ADMIN_API_KEY` | admin-api, bot | **yes** | Internal API key for admin-api |
| `SESSION_SECRET` | admin-api | **yes** | Express session secret (≥32 chars) |
| `INTERNAL_CA_CERT_PATH` | admin-api | no | Path to internal CA cert for mTLS |
| `INTERNAL_CLIENT_CERT_PATH` | bot | no | Path to client cert |
| `INTERNAL_CLIENT_KEY_PATH` | bot | no | Path to client key |
| `ASSET_BUCKET_URL` | render-worker, bot | no | Base URL for asset CDN/S3 bucket |
| `ASSET_BUCKET_SECRET` | render-worker | **yes** | S3-compatible storage secret key |
| `ASSET_BUCKET_KEY_ID` | render-worker | **yes** | S3-compatible storage key ID |
| `CDN_BASE_URL` | render-worker, bot | no | Public CDN URL for rendered assets |
| `RENDER_OUTPUT_PATH` | render-worker | no | Local path for render temp files |
| `FFMPEG_PATH` | render-worker | no | Path to ffmpeg binary (default: auto-detect) |
| `BOT_SHARD_COUNT` | bot | no | Total shard count |
| `BOT_SHARD_IDS` | bot | no | Comma-separated shard IDs for this instance |
| `ADMIN_DISCORD_IDS` | admin-api | no | Comma-separated admin Discord IDs |
| `PORT` | admin-api | no | HTTP port (default: 3001) |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | all | no | OpenTelemetry collector endpoint |
| `OTEL_SERVICE_NAME` | all | no | Set per-service: `ascension-bot`, etc. |
| `SENTRY_DSN` | all | **yes** | Sentry error tracking DSN |
| `PROMETHEUS_METRICS_PORT` | all | no | Prometheus scrape port (default: 9090) |

### 4.2 `.env.example`

```dotenv
# General
NODE_ENV=development
LOG_LEVEL=debug

# Discord
DISCORD_BOT_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_PUBLIC_KEY=

# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=ascension_dev

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Admin API
ADMIN_API_KEY=dev_api_key_change_me
SESSION_SECRET=dev_session_secret_change_me_min_32_chars

# Assets / CDN
ASSET_BUCKET_URL=http://localhost:9000/ascension-assets
ASSET_BUCKET_KEY_ID=local_dev_key
ASSET_BUCKET_SECRET=local_dev_secret
CDN_BASE_URL=http://localhost:9000/ascension-assets
RENDER_OUTPUT_PATH=/tmp/ascension-renders

# Sharding (bot)
BOT_SHARD_COUNT=1
BOT_SHARD_IDS=0

# Admin IDs (comma-separated)
ADMIN_DISCORD_IDS=your_discord_id_here

# Observability
OTEL_SERVICE_NAME=ascension-bot
SENTRY_DSN=
```

---

## 5. Docker

### 5.1 `docker/compose.infra.yml` — Infrastructure only

```yaml
version: "3.9"
services:
  mongodb:
    image: mongo:7.0
    container_name: ascension-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: ascension_dev
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7.2-alpine
    container_name: ascension-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --save 60 1 --loglevel warning
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  minio:
    image: minio/minio:latest
    container_name: ascension-minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: local_dev_key
      MINIO_ROOT_PASSWORD: local_dev_secret
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

volumes:
  mongo_data:
  redis_data:
  minio_data:
```

### 5.2 Bot Dockerfile

```dockerfile
# docker/Dockerfile.bot
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/bot/package.json ./apps/bot/
COPY packages/*/package.json ./packages/
# (repeat for all workspace packages)
RUN pnpm install --frozen-lockfile --prod

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter @workspace/bot build

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 ascension && \
    adduser --system --uid 1001 botuser
COPY --from=builder --chown=botuser:ascension /app/apps/bot/dist ./dist
COPY --from=deps --chown=botuser:ascension /app/node_modules ./node_modules
USER botuser
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD node -e "require('./dist/health').check()" || exit 1
```

### 5.3 Admin API Dockerfile

```dockerfile
# docker/Dockerfile.admin-api
FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/admin-api/package.json ./apps/admin-api/
COPY packages/*/package.json ./packages/
RUN pnpm install --frozen-lockfile --prod

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter @workspace/admin-api build

FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 ascension && \
    adduser --system --uid 1001 apiuser
COPY --from=builder --chown=apiuser:ascension /app/apps/admin-api/dist ./dist
COPY --from=deps --chown=apiuser:ascension /app/node_modules ./node_modules
USER apiuser
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/index.js"]
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1
```

### 5.4 Render Worker Dockerfile

```dockerfile
# docker/Dockerfile.render-worker
FROM node:20-bullseye AS base
# Requires ffmpeg, canvas native deps — use Debian, not Alpine
WORKDIR /app
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/renderer/package.json ./packages/renderer/
COPY packages/workers/package.json ./packages/workers/
COPY packages/*/package.json ./packages/
RUN pnpm install --frozen-lockfile --prod

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter @workspace/render-worker build

FROM node:20-bullseye AS runner
WORKDIR /app
RUN apt-get update && apt-get install -y ffmpeg libcairo2 libpango-1.0-0 libgif7 && \
    rm -rf /var/lib/apt/lists/*
RUN addgroup --system --gid 1001 ascension && \
    adduser --system --uid 1001 renderuser
COPY --from=builder --chown=renderuser:ascension /app/packages/render-worker/dist ./dist
COPY --from=deps --chown=renderuser:ascension /app/node_modules ./node_modules
USER renderuser
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
```

### 5.5 Build and push images

```bash
# Set image registry
REGISTRY=your-registry.io/ascension

# Build all images
docker build -f docker/Dockerfile.bot -t $REGISTRY/bot:$GIT_SHA .
docker build -f docker/Dockerfile.admin-api -t $REGISTRY/admin-api:$GIT_SHA .
docker build -f docker/Dockerfile.render-worker -t $REGISTRY/render-worker:$GIT_SHA .

# Push
docker push $REGISTRY/bot:$GIT_SHA
docker push $REGISTRY/admin-api:$GIT_SHA
docker push $REGISTRY/render-worker:$GIT_SHA

# Tag as latest if on main branch
docker tag $REGISTRY/bot:$GIT_SHA $REGISTRY/bot:latest
docker push $REGISTRY/bot:latest
```

---

## 6. Kubernetes Manifests

All manifests live in `k8s/`. Namespace is `ascension`.

### 6.1 Namespace

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ascension
  labels:
    name: ascension
```

### 6.2 Bot Deployment

```yaml
# k8s/bot/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ascension-bot
  namespace: ascension
  labels:
    app: ascension-bot
    component: bot
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ascension-bot
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: ascension-bot
        component: bot
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "9090"
    spec:
      terminationGracePeriodSeconds: 30
      containers:
        - name: bot
          image: your-registry.io/ascension/bot:latest
          imagePullPolicy: Always
          envFrom:
            - secretRef:
                name: ascension-secrets
            - configMapRef:
                name: ascension-config
          resources:
            requests:
              cpu: "500m"
              memory: "512Mi"
            limits:
              cpu: "2000m"
              memory: "1Gi"
          livenessProbe:
            exec:
              command: ["node", "-e", "require('./dist/health').check()"]
            initialDelaySeconds: 15
            periodSeconds: 30
            failureThreshold: 3
          readinessProbe:
            exec:
              command: ["node", "-e", "require('./dist/health').ready()"]
            initialDelaySeconds: 10
            periodSeconds: 10
          lifecycle:
            preStop:
              exec:
                command: ["node", "-e", "require('./dist/graceful').shutdown()"]
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchLabels:
                    app: ascension-bot
                topologyKey: kubernetes.io/hostname
```

### 6.3 Admin API Deployment + Service

```yaml
# k8s/admin-api/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ascension-admin-api
  namespace: ascension
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ascension-admin-api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: ascension-admin-api
    spec:
      containers:
        - name: admin-api
          image: your-registry.io/ascension/admin-api:latest
          imagePullPolicy: Always
          ports:
            - containerPort: 3001
              name: http
            - containerPort: 9090
              name: metrics
          envFrom:
            - secretRef:
                name: ascension-secrets
            - configMapRef:
                name: ascension-config
          resources:
            requests:
              cpu: "250m"
              memory: "256Mi"
            limits:
              cpu: "1000m"
              memory: "512Mi"
          livenessProbe:
            httpGet:
              path: /health
              port: 3001
            initialDelaySeconds: 10
            periodSeconds: 15
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 3001
            initialDelaySeconds: 5
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: ascension-admin-api
  namespace: ascension
spec:
  selector:
    app: ascension-admin-api
  ports:
    - name: http
      port: 80
      targetPort: 3001
    - name: metrics
      port: 9090
      targetPort: 9090
  type: ClusterIP
```

### 6.4 Render Worker Deployment

```yaml
# k8s/render-worker/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ascension-render-worker
  namespace: ascension
spec:
  replicas: 4
  selector:
    matchLabels:
      app: ascension-render-worker
  template:
    metadata:
      labels:
        app: ascension-render-worker
    spec:
      containers:
        - name: render-worker
          image: your-registry.io/ascension/render-worker:latest
          imagePullPolicy: Always
          envFrom:
            - secretRef:
                name: ascension-secrets
            - configMapRef:
                name: ascension-config
          resources:
            requests:
              cpu: "1000m"
              memory: "1Gi"
            limits:
              cpu: "4000m"
              memory: "4Gi"
          volumeMounts:
            - name: render-tmp
              mountPath: /tmp/ascension-renders
      volumes:
        - name: render-tmp
          emptyDir:
            sizeLimit: 5Gi
```

### 6.5 ConfigMap

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ascension-config
  namespace: ascension
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  MONGODB_DB_NAME: "ascension_prod"
  CDN_BASE_URL: "https://cdn.ascension-legends.com"
  RENDER_OUTPUT_PATH: "/tmp/ascension-renders"
  BOT_SHARD_COUNT: "8"
  PROMETHEUS_METRICS_PORT: "9090"
  OTEL_SERVICE_NAME: "ascension"
```

### 6.6 HorizontalPodAutoscaler — Render Worker

```yaml
# k8s/render-worker/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ascension-render-worker-hpa
  namespace: ascension
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ascension-render-worker
  minReplicas: 4
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: External
      external:
        metric:
          name: bullmq_queue_depth
          selector:
            matchLabels:
              queue: render
        target:
          type: AverageValue
          averageValue: "50"
```

### 6.7 Deploy all manifests

```bash
# Apply namespace first
kubectl apply -f k8s/namespace.yaml

# Apply config and secrets
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml  # Created by CI, not stored in git

# Apply deployments
kubectl apply -f k8s/bot/
kubectl apply -f k8s/admin-api/
kubectl apply -f k8s/render-worker/
kubectl apply -f k8s/workers/

# Verify rollout
kubectl rollout status deployment/ascension-bot -n ascension
kubectl rollout status deployment/ascension-admin-api -n ascension
kubectl rollout status deployment/ascension-render-worker -n ascension
```

---

## 7. CI/CD Pipeline

### 7.1 Pipeline overview (GitHub Actions)

```
Push to PR branch
  → Lint (ESLint + Prettier)
  → Type-check (tsc --noEmit)
  → Unit tests (vitest)
  → Integration tests (Docker Compose test env)
  → Build Docker images (not pushed)

Merge to main
  → All PR checks (above)
  → Build + push Docker images (tagged with SHA + latest)
  → Deploy to staging automatically
  → Run smoke tests against staging
  → Notify team (hold for manual prod approval)

Manual production deploy
  → Trigger workflow_dispatch with image SHA
  → Deploy to production Kubernetes
  → Run smoke tests
  → Alert on failure, auto-rollback
```

### 7.2 `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run lint
      - run: pnpm run typecheck

  test:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:7.0
        ports: ["27017:27017"]
        options: --health-cmd "mongosh --eval \"db.adminCommand('ping')\"" --health-interval 10s --health-timeout 5s --health-retries 5
      redis:
        image: redis:7.2-alpine
        ports: ["6379:6379"]
        options: --health-cmd "redis-cli ping" --health-interval 10s --health-timeout 5s --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build
      - name: Run tests
        run: pnpm run test:ci
        env:
          MONGODB_URI: mongodb://localhost:27017
          MONGODB_DB_NAME: ascension_test
          REDIS_URL: redis://localhost:6379
          NODE_ENV: test

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      - name: Login to registry
        uses: docker/login-action@v3
        with:
          registry: ${{ secrets.REGISTRY_URL }}
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_PASSWORD }}
      - name: Build and push bot
        uses: docker/build-push-action@v5
        with:
          context: .
          file: docker/Dockerfile.bot
          push: true
          tags: |
            ${{ secrets.REGISTRY_URL }}/ascension/bot:${{ github.sha }}
            ${{ secrets.REGISTRY_URL }}/ascension/bot:latest
          cache-from: type=registry,ref=${{ secrets.REGISTRY_URL }}/ascension/bot:cache
          cache-to: type=registry,ref=${{ secrets.REGISTRY_URL }}/ascension/bot:cache,mode=max
      # (repeat for admin-api, render-worker, workers)

  deploy-staging:
    runs-on: ubuntu-latest
    needs: [build]
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - name: Configure kubectl
        run: |
          echo "${{ secrets.KUBE_CONFIG_STAGING }}" | base64 -d > ~/.kube/config
      - name: Update image tags
        run: |
          kubectl set image deployment/ascension-bot \
            bot=${{ secrets.REGISTRY_URL }}/ascension/bot:${{ github.sha }} \
            -n ascension
          kubectl set image deployment/ascension-admin-api \
            admin-api=${{ secrets.REGISTRY_URL }}/ascension/admin-api:${{ github.sha }} \
            -n ascension
          # (repeat for all services)
      - name: Wait for rollout
        run: |
          kubectl rollout status deployment/ascension-bot -n ascension --timeout=300s
          kubectl rollout status deployment/ascension-admin-api -n ascension --timeout=300s
      - name: Smoke tests
        run: pnpm --filter @workspace/smoke-tests run test:staging
```

### 7.3 Production deploy workflow

```yaml
name: Deploy Production

on:
  workflow_dispatch:
    inputs:
      image_sha:
        description: 'Git SHA of the image to deploy'
        required: true
      confirm:
        description: 'Type DEPLOY to confirm'
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    if: ${{ github.event.inputs.confirm == 'DEPLOY' }}
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.inputs.image_sha }}
      - name: Configure kubectl
        run: |
          echo "${{ secrets.KUBE_CONFIG_PRODUCTION }}" | base64 -d > ~/.kube/config
      - name: Record current image for rollback
        run: |
          kubectl get deployment/ascension-bot -n ascension \
            -o jsonpath='{.spec.template.spec.containers[0].image}' > /tmp/prev_bot_image.txt
      - name: Deploy all services
        run: |
          IMAGE_SHA=${{ github.event.inputs.image_sha }}
          REGISTRY=${{ secrets.REGISTRY_URL }}/ascension
          kubectl set image deployment/ascension-bot \
            bot=$REGISTRY/bot:$IMAGE_SHA -n ascension
          kubectl set image deployment/ascension-admin-api \
            admin-api=$REGISTRY/admin-api:$IMAGE_SHA -n ascension
          kubectl set image deployment/ascension-render-worker \
            render-worker=$REGISTRY/render-worker:$IMAGE_SHA -n ascension
      - name: Wait for rollout
        run: |
          kubectl rollout status deployment/ascension-bot -n ascension --timeout=600s
          kubectl rollout status deployment/ascension-admin-api -n ascension --timeout=600s
          kubectl rollout status deployment/ascension-render-worker -n ascension --timeout=600s
      - name: Smoke tests
        run: pnpm --filter @workspace/smoke-tests run test:production
      - name: Rollback on failure
        if: failure()
        run: |
          PREV=$(cat /tmp/prev_bot_image.txt)
          kubectl set image deployment/ascension-bot bot=$PREV -n ascension
          kubectl rollout status deployment/ascension-bot -n ascension --timeout=300s
          echo "::error::Deploy failed — rolled back to $PREV"
```

---

## 8. Database Operations

### 8.1 Creating indexes

Indexes are managed through migration scripts, not Mongoose `index()` decorators. This prevents index creation on startup in production (which can cause performance issues).

```bash
# Run index creation script
pnpm --filter @workspace/database run indexes:apply --env production

# Dry run (shows what would be created)
pnpm --filter @workspace/database run indexes:apply --env production --dry-run
```

### 8.2 MongoDB Atlas configuration (production)

- **Tier:** M30+ (minimum for production workloads)
- **Region:** Primary matching your Kubernetes cluster region
- **Replica Set:** Always enabled (3-node minimum)
- **Backup:** Continuous cloud backups enabled
- **VPC Peering:** Must be configured to your Kubernetes cluster's VPC
- **IP Allowlist:** Only the K8s node CIDR and management bastion

### 8.3 Running migrations

```bash
# Apply all pending migrations
pnpm --filter @workspace/database run migrate:up --env production

# Check migration status
pnpm --filter @workspace/database run migrate:status --env production

# Rollback last migration
pnpm --filter @workspace/database run migrate:down --env production
```

### 8.4 Seeding / resetting staging

```bash
# Reset staging database (DANGEROUS — drops all data)
pnpm --filter @workspace/database run seed:staging --confirm
```

### 8.5 Database backup & restore

```bash
# Manual backup (production)
mongodump --uri "$MONGODB_URI" --db ascension_prod --out ./backup/$(date +%Y%m%d_%H%M%S)

# Restore from backup
mongorestore --uri "$MONGODB_URI" --db ascension_prod ./backup/20250101_120000/ascension_prod/

# Atlas provides point-in-time restore via the Atlas UI — prefer this for production incidents
```

---

## 9. Secrets Management

**Secrets are never stored in Git.** The repository stores only `.env.example` with empty values.

### 9.1 Production secrets storage

Production secrets are stored in a dedicated secrets manager (Doppler, HashiCorp Vault, or AWS Secrets Manager). The CI/CD pipeline fetches secrets at deploy time and injects them as Kubernetes Secrets.

```bash
# Create Kubernetes secret from Doppler (example)
doppler secrets download --no-file --format env-no-quotes --project ascension --config production | \
  kubectl create secret generic ascension-secrets \
    --namespace ascension \
    --from-env-file=/dev/stdin \
    --dry-run=client -o yaml | kubectl apply -f -
```

### 9.2 Rotating secrets

When rotating a secret (e.g., after a breach):

1. Generate new secret value
2. Update in secrets manager
3. Re-create the Kubernetes secret:
   ```bash
   kubectl delete secret ascension-secrets -n ascension
   # Re-run secret creation command above
   ```
4. Roll all affected deployments:
   ```bash
   kubectl rollout restart deployment/ascension-bot -n ascension
   kubectl rollout restart deployment/ascension-admin-api -n ascension
   ```
5. Verify the old secret is invalid (test the old value manually)
6. Document rotation in the security log

### 9.3 Adding a new secret

1. Add the variable to `.env.example` with an empty value
2. Document it in Section 4.1 of this guide
3. Add it to the secrets manager
4. Update the `k8s/configmap.yaml` (if non-secret) or verify it is in the secrets sync
5. Update relevant service environment handling in `packages/config`

---

## 10. Scaling & Resource Allocation

### 10.1 Baseline resource guidelines

| Service | CPU Request | CPU Limit | Memory Request | Memory Limit |
|---------|-------------|-----------|----------------|--------------|
| bot (per pod) | 500m | 2000m | 512Mi | 1Gi |
| admin-api | 250m | 1000m | 256Mi | 512Mi |
| render-worker | 1000m | 4000m | 1Gi | 4Gi |
| notification-worker | 200m | 500m | 256Mi | 512Mi |
| economy-worker | 250m | 500m | 256Mi | 512Mi |
| quest-worker | 200m | 500m | 256Mi | 512Mi |
| leaderboard-worker | 200m | 500m | 256Mi | 512Mi |

### 10.2 Bot sharding

- **Formula:** 1 shard per 2,500 Discord servers (guilds). Adjust based on Discord's recommendation.
- **Deployment:** Each bot pod handles a slice of shards. Update `BOT_SHARD_IDS` and `BOT_SHARD_COUNT` per pod via a StatefulSet.
- **Scaling trigger:** When shard count exceeds 8, re-evaluate pod count and shard distribution.

### 10.3 Render worker scaling

- Primary scaling metric: `bullmq_queue_depth` for the `render` queue.
- HPA is configured (see Section 6.6). Monitor queue depth at peak hours.
- Each render worker handles one GIF job at a time; set concurrency in the worker config.

---

## 11. Health Checks & Readiness

### 11.1 Admin API endpoints

| Path | Type | Succeeds when |
|------|------|---------------|
| `GET /health` | Liveness | Process is alive |
| `GET /health/ready` | Readiness | MongoDB, Redis, and BullMQ connections are healthy |
| `GET /metrics` | Prometheus | Always |

### 11.2 Bot health check

The bot exposes an internal HTTP server on `PORT+1` (e.g., 3002) for health checks only.

```
GET /health         → 200 if all shards are connected
GET /health/ready   → 200 if at least 80% of shards are READY
```

### 11.3 Manual health check

```bash
# Admin API
curl -f https://admin-api.staging.ascension-internal.com/health/ready | jq

# Bot via internal service
kubectl exec -it deployment/ascension-bot -n ascension -- \
  curl -f http://localhost:3002/health | jq

# Redis connectivity
kubectl exec -it deployment/ascension-bot -n ascension -- \
  node -e "const r = require('./dist/redis'); r.ping().then(console.log)"

# MongoDB connectivity
kubectl exec -it deployment/ascension-admin-api -n ascension -- \
  node -e "const m = require('./dist/mongodb'); m.ping().then(console.log)"
```

---

## 12. Rollback Procedures

### 12.1 Kubernetes rollback (recommended)

```bash
# View rollout history
kubectl rollout history deployment/ascension-bot -n ascension

# Rollback to previous revision
kubectl rollout undo deployment/ascension-bot -n ascension

# Rollback to a specific revision
kubectl rollout undo deployment/ascension-bot -n ascension --to-revision=3

# Monitor rollback
kubectl rollout status deployment/ascension-bot -n ascension

# Verify pods are healthy
kubectl get pods -n ascension -l app=ascension-bot
kubectl logs -n ascension -l app=ascension-bot --tail=50
```

### 12.2 Image pin rollback (explicit)

When you know the specific image SHA to revert to:

```bash
REGISTRY=your-registry.io/ascension
SAFE_SHA=<previous-known-good-sha>

kubectl set image deployment/ascension-bot \
  bot=$REGISTRY/bot:$SAFE_SHA -n ascension

kubectl set image deployment/ascension-admin-api \
  admin-api=$REGISTRY/admin-api:$SAFE_SHA -n ascension

kubectl set image deployment/ascension-render-worker \
  render-worker=$REGISTRY/render-worker:$SAFE_SHA -n ascension

# Wait for all rollbacks
kubectl rollout status deployment/ascension-bot -n ascension
kubectl rollout status deployment/ascension-admin-api -n ascension
kubectl rollout status deployment/ascension-render-worker -n ascension
```

### 12.3 Database rollback

> ⚠️ **Database rollbacks are destructive and require careful coordination.**

1. **Stop all writes first:**
   ```bash
   kubectl scale deployment/ascension-bot --replicas=0 -n ascension
   kubectl scale deployment/ascension-economy-worker --replicas=0 -n ascension
   ```

2. **Run the down migration:**
   ```bash
   pnpm --filter @workspace/database run migrate:down --env production --steps 1
   ```

3. **Verify data integrity** before restarting services.

4. **Restart services** with the rolled-back image.

### 12.4 Rollback decision matrix

| Scenario | Action |
|----------|--------|
| Bot crashes on startup | Kubernetes rollback |
| Economy bug causing wrong gold amounts | Stop workers → migrate:down → rollback code |
| Render worker crashes | Kubernetes rollback (no DB impact) |
| Redis cache corruption | Flush affected keys, restart services |
| Schema migration broke queries | migrate:down → rollback code → fix migration |

---

## 13. Incident Response Runbook

### Severity levels

| Level | Definition | Response Time | Examples |
|-------|-----------|---------------|---------|
| SEV1 | Full outage — bot unresponsive on all servers | 15 min | Bot crashes, DB unreachable |
| SEV2 | Major feature broken for all users | 30 min | Battle system down, economy frozen |
| SEV3 | Partial degradation or elevated errors | 2 hours | Renders slow, some commands failing |
| SEV4 | Minor issue, workaround available | Next business day | Display bug, slow query |

---

### SEV1 Response Checklist

```
□ Page on-call engineer (PagerDuty / Discord alert)
□ Check Kubernetes pod status:
    kubectl get pods -n ascension
□ Check recent deployments (was something just deployed?):
    kubectl rollout history deployment/ascension-bot -n ascension
□ Check error logs:
    kubectl logs -n ascension -l app=ascension-bot --tail=100
□ Check MongoDB Atlas status dashboard
□ Check Redis Upstash status dashboard
□ If recent deploy → rollback immediately (Section 12.1)
□ If infrastructure issue → investigate infra
□ Communicate in #ops-incidents channel every 15 minutes
□ Declare resolution when error rate returns to baseline
□ Write postmortem within 48 hours
```

---

### Common Issues & Fixes

**Bot disconnects / shards go offline**
```bash
# Restart bot pods
kubectl rollout restart deployment/ascension-bot -n ascension
# Monitor shard reconnection in logs
kubectl logs -f -n ascension -l app=ascension-bot
```

**Redis connection refused**
```bash
# Check if Redis is reachable
kubectl exec -it deployment/ascension-bot -n ascension -- redis-cli -u $REDIS_URL ping
# If cluster issue — check Redis/Upstash dashboard
# Temporarily switch to read-through mode if cache is unavailable:
# Set CACHE_BYPASS=true in configmap → restart deployments
```

**Render queue backed up (depth > 500)**
```bash
# Scale up render workers immediately
kubectl scale deployment/ascension-render-worker --replicas=12 -n ascension
# Monitor queue drain
kubectl exec -it deployment/ascension-render-worker -n ascension -- \
  node -e "const q = require('./dist/queue'); q.getDepth().then(console.log)"
```

**Economy inconsistency detected**
```bash
# Freeze all economy operations (disable relevant commands via feature flag)
# This is a feature flag in Redis:
kubectl exec -it deployment/ascension-bot -n ascension -- \
  redis-cli -u $REDIS_URL SET flag:economy_enabled 0 EX 3600
# Investigate inconsistency — check audit_log and economy_ledger
# Fix data manually via admin API
# Re-enable after fix:
kubectl exec -it deployment/ascension-bot -n ascension -- \
  redis-cli -u $REDIS_URL DEL flag:economy_enabled
```

---

## 14. Maintenance Windows

Scheduled maintenance should be communicated 24 hours in advance via:
1. Bot announcement to all Discord servers
2. Status page update

### Pre-maintenance checklist

```
□ Announce via bot: /admin broadcast "Maintenance in 1 hour. Back at HH:MM UTC"
□ Drain all BullMQ queues (wait for in-flight jobs to complete)
□ Scale down non-essential workers to 0 replicas
□ Put bot in maintenance mode (responds to commands with maintenance message)
□ Perform maintenance
□ Verify health checks pass
□ Scale workers back up
□ Disable maintenance mode on bot
□ Post announcement: "Maintenance complete"
□ Monitor error rates for 15 minutes
```

### Enabling maintenance mode

```bash
# Set flag in Redis
redis-cli -u $REDIS_URL SET flag:maintenance_mode 1

# Bot reads this flag and responds to all commands with the maintenance message
# Remove when done:
redis-cli -u $REDIS_URL DEL flag:maintenance_mode
```

---

## 15. Checklist: First Production Deploy

Use this checklist the very first time deploying to production.

```
Infrastructure
□ Kubernetes cluster provisioned and kubectl configured
□ ascension namespace created
□ MongoDB Atlas cluster provisioned (M30+), VPC peered
□ Redis cluster provisioned, VPC peered
□ Container registry created and credentials configured
□ CDN / object storage bucket created and configured
□ mTLS certificates issued and stored in K8s secrets
□ Internal CA cert stored

Secrets
□ All secrets from Section 4.1 added to secrets manager
□ Kubernetes secret created from secrets manager
□ ADMIN_DISCORD_IDS populated with actual admin IDs

Application
□ All Docker images built and pushed with version tag
□ k8s/configmap.yaml updated with production values
□ k8s/secrets.yaml created (not committed to git)
□ All manifests applied: kubectl apply -f k8s/

Discord
□ Bot application created in Discord Developer Portal
□ DISCORD_BOT_TOKEN configured
□ DISCORD_CLIENT_ID configured
□ Slash commands registered: pnpm --filter @workspace/bot run commands:register --env production
□ Bot invited to test Discord server with correct permissions

Database
□ Indexes created: pnpm --filter @workspace/database run indexes:apply --env production
□ Initial seed data applied if required

Verification
□ All pods running: kubectl get pods -n ascension
□ Health checks passing: curl /health/ready on admin-api
□ Bot connected and responding to /ping
□ Test battle executed and GIF rendered
□ Economy credit/debit working via admin API
□ Render worker processing jobs from queue
□ Prometheus metrics visible at /metrics
□ Grafana dashboard configured
□ Alerts configured in Grafana / PagerDuty

Post-Deploy
□ Announce launch in Discord
□ Monitor error rates for 1 hour
□ Verify no unexpected Mongo/Redis load
□ Document any issues found
```

---

*Deployment Guide v1.0.0 — Last updated 2025-01-01*
