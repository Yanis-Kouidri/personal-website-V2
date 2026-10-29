FROM docker.io/oven/bun:1.4.3-alpine@sha256:629e17411f1f129dbec3af78d5af9c9f2a937435c80349437206c6b0b7422373 AS build
WORKDIR /usr/src/app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
ENV NODE_ENV=production
RUN bun run build

FROM docker.io/library/caddy:2.11.7-alpine@sha256:d8542f48d34a9cf4e4c11a478865229840e87e4c96ea3f439101f31a5d35f75f AS release

# Alpine fixes ship before the upstream image is rebuilt: apply them at build
# time so the Trivy scan does not block on already patched packages.
RUN apk upgrade --no-cache

COPY --from=build /usr/src/app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /usr/src/app/csp_header.caddy /etc/caddy/csp_header.caddy


USER 1000

EXPOSE 8080