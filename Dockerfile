# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.22.1
FROM node:${NODE_VERSION}-trixie-slim AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_DEBUG_MODE=false
ARG NEXT_PUBLIC_APP_VERSION
ENV NEXT_PUBLIC_DEBUG_MODE=$NEXT_PUBLIC_DEBUG_MODE
ENV NEXT_PUBLIC_APP_VERSION=$NEXT_PUBLIC_APP_VERSION
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build

FROM gcr.io/distroless/cc-debian13:nonroot@sha256:3ee00291cf386ec52a552e6a858d555debd74776eb4bfa53fa3df2cd6677515e AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# ビルドと本番で同じ Node.js を使い、distroless 側の更新時期に依存しない。
COPY --from=base /usr/local/bin/node /nodejs/bin/node
COPY --from=builder --chown=65532:65532 /app/public ./public
COPY --from=builder --chown=65532:65532 /app/.next/standalone ./
COPY --from=builder --chown=65532:65532 /app/.next/static ./.next/static

USER 65532:65532

ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

ENTRYPOINT ["/nodejs/bin/node"]
CMD ["server.js"]
