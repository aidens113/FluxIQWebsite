# The site is a static export served by the repository's dependency-free Node
# server, so the image has two stages: one runs `pnpm build`, and the runtime
# stage holds only out/ and scripts/static-hosting/. Response headers come from
# scripts/static-hosting/policy.mjs, the same source as the generated .htaccess
# and _headers. See docs/architecture/deployment.md.
#
#   docker build -t fluxiq-website .
#   docker run --rm -p 3000:3000 fluxiq-website

FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0
# Corepack installs the pnpm version pinned by `packageManager` in package.json.
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0
# Copied as root-owned and world-readable: the server only reads them, so the
# unprivileged runtime user cannot modify what it serves.
COPY --from=build /app/out ./out
COPY --from=build /app/scripts/static-hosting ./scripts/static-hosting
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:${PORT}/" || exit 1
# The server handles SIGTERM itself, so `docker stop` shuts it down cleanly.
CMD ["node", "scripts/static-hosting/start.mjs"]
