FROM docker.io/oven/bun:1.3.10-alpine AS build
WORKDIR /usr/src/app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
ENV NODE_ENV=production
RUN bun run build

FROM docker.io/library/caddy:2.11.1-alpine as release

COPY --from=build /usr/src/app/dist /usr/share/caddy
