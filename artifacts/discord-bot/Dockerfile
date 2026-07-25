# ─── Build Stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

# Install system dependencies for canvas & ffmpeg
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    librsvg-dev \
    pixman-dev

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package manifests
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build TypeScript
RUN pnpm run build

# ─── Production Stage ─────────────────────────────────────────────────────────
FROM node:22-alpine AS production

# Install runtime system deps
RUN apk add --no-cache \
    ffmpeg \
    cairo \
    jpeg \
    pango \
    giflib \
    librsvg \
    pixman \
    tini

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package manifests
COPY package.json pnpm-lock.yaml* ./

# Install production-only deps
RUN pnpm install --frozen-lockfile --prod

# Copy built output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/assets ./src/assets
COPY --from=builder /app/src/locales ./src/locales

# Non-root user for security
RUN addgroup -g 1001 -S ascension && adduser -u 1001 -S ascension -G ascension
USER ascension

# Health check (uses internal HTTP health endpoint)
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget -qO- http://localhost:${PORT:-3001}/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "--enable-source-maps", "dist/index.js"]
