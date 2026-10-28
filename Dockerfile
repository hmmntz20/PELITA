# Base image Node.js 20 LTS
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Stage instalasi dependensi
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Stage build kode aplikasi & generate Prisma Client
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Target 1: Kontainer Aplikasi Web (pelita-web)
FROM base AS web
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["npm", "run", "start"]

# Target 2: Kontainer Background Worker (pelita-worker)
FROM base AS worker
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
CMD ["npx", "tsx", "src/worker/index.ts"]