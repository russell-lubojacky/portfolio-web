# 1. Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Build (content/generated/*.json is committed, so no career-brain access needed here)
FROM node:20-alpine AS build
WORKDIR /app
# NEXT_PUBLIC_* vars are inlined into the client bundle at build time, not read at
# container runtime — must be passed as a build arg, not just a compose environment entry.
ARG NEXT_PUBLIC_SITE_URL=http://localhost
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Caps the build's heap so an under-resourced host OOMs the build process cleanly
# instead of swapping the whole machine (and anything else running on it) into
# unresponsiveness — see the deploy-host memory incident this was added for.
ENV NODE_OPTIONS=--max-old-space-size=1024
RUN npm run build

# 3. Runtime — standalone Next.js server, no nginx needed
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
