# Bun 1.2.16+631e67484
FROM oven/bun@sha256:14beb61b5209e743341a80ff2b05e2eac0ccb794b03902e67735f85f731c2b52 AS builder

WORKDIR /app

COPY bun.lock package.json ./

RUN bun install --frozen-lockfile

ENV IS_BUILD=1

COPY components.json middleware.ts next.config.ts postcss.config.mjs tsconfig.json ./

COPY src/ src/

RUN bunx next build

# Bun 1.2.16+631e67484
FROM oven/bun@sha256:14beb61b5209e743341a80ff2b05e2eac0ccb794b03902e67735f85f731c2b52

ENV NODE_ENV=production

EXPOSE 3000

COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static
COPY migrations.sql .

CMD ["bun", "server.js"]
