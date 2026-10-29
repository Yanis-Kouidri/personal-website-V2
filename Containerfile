FROM docker.io/oven/bun:1.4.4-alpine@sha256:4cf82f5686b196504fe119db3fcd9185b191f82ece82c40680e597228ec6070a AS build
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