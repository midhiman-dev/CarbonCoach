# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package configurations
COPY package*.json ./
COPY tsconfig.base.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/
COPY services/api/package.json ./services/api/

# Install all dependencies (including devDependencies required for build)
RUN npm ci

# Copy full source
COPY . .

# Build all workspaces
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Run as non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S expressjs -u 1001

# Copy package configs for production install
COPY package*.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/
COPY services/api/package.json ./services/api/

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled outputs from builder
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json

COPY --from=builder /app/apps/web/dist ./apps/web/dist
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json

COPY --from=builder /app/services/api/dist ./services/api/dist
COPY --from=builder /app/services/api/package.json ./services/api/package.json

# Ensure correct permissions
RUN chown -R expressjs:nodejs /app

USER expressjs

EXPOSE 8080

# Run compiled JS server
CMD ["npm", "start", "--workspace", "services/api"]
