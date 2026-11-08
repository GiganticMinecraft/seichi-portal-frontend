# syntax=docker/dockerfile:1

ARG NODE_VERSION=26.13.0
FROM node:${NODE_VERSION}-trixie-slim AS base
WORKDIR /app
# Node.js 25 以降の公式イメージには corepack が同梱されないため、pnpm を npm で入れる。
# バージョンは package.json の packageManager / mise.toml と Renovate が揃える。
ARG PNPM_VERSION=12.9.0
RUN npm install -g pnpm@${PNPM_VERSION}
# Node.js 26 の node バイナリは libatomic に依存するが distroless/cc には含まれない。
# アーキテクチャごとのディレクトリ名 (x86_64-linux-gnu / aarch64-linux-gnu) の差を
# ここで吸収し、実行イメージへ持ち込む。
RUN mkdir -p /nodejs/lib && cp -L /usr/lib/*-linux-gnu/libatomic.so.1 /nodejs/lib/

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

FROM gcr.io/distroless/cc-debian13:nonroot@sha256:08476c244888bfb425bae1ae4dd7c17f093e972aab8426883d97f3c6f280f7c1 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# ビルドと本番で同じ Node.js を使い、distroless 側の更新時期に依存しない。
COPY --from=base /usr/local/bin/node /nodejs/bin/node
COPY --from=base /nodejs/lib/libatomic.so.1 /usr/lib/libatomic.so.1
COPY --from=builder --chown=65532:65532 /app/public ./public
COPY --from=builder --chown=65532:65532 /app/.next/standalone ./
COPY --from=builder --chown=65532:65532 /app/.next/static ./.next/static

USER 65532:65532

ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

ENTRYPOINT ["/nodejs/bin/node"]
CMD ["server.js"]
