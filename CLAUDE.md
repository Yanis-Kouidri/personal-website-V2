# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site ([kouidri.fr](https://www.kouidri.fr)) built with Astro in fully static output mode (no SSR). Content is multilingual (fr/en/ru/es) and sourced entirely from Markdown via Astro Content Collections — there is no CMS.

## Commands

Package manager/runtime is **Bun**. Do not use npm, yarn, or pnpm.

- `bun run dev` — start dev server (opens browser)
- `bun run build` — production build (also runs the CSP hash post-build step, see below)
- `bun run preview` — preview the production build
- `bun run typecheck` / `bun run typecheck:watch` — `astro check`
- `bun run lint` — ESLint (flat config, `eslint.config.mjs`)
- `bun run format` / `bun run format:fix` — Prettier check/write (`.astro` files use `prettier-plugin-astro`)
- `bun run test` — run the Vitest suite once
- `bun run test:watch` — Vitest watch mode
- Run a single test file: `bun run test astro-csp-hash.test.js` or `bunx vitest run src/content/skills-data.test.ts`

Husky + lint-staged run ESLint/Prettier on staged files at commit time (`lint-staged.config.js`).

## Architecture

### i18n / routing

- `astro.config.mjs` sets `defaultLocale: "fr"` with `prefixDefaultLocale: false`, and locales `fr, en, ru, es`. French pages live at `/`, other locales at `/en/`, `/ru/`, `/es/` (see `src/pages/{en,es,ru}/index.astro` vs `src/pages/index.astro` — each is a thin wrapper composing the same section components).
- Every page/component reads the active locale via `Astro.currentLocale ?? "fr"` and filters a content collection by `entry.data.locale === currentLocale` (see `src/layouts/Layout.astro`). Follow this pattern for any new localized component rather than duplicating components per locale.
- `LangSwitcher.astro` hardcodes the four locale links/flags; when adding a locale, update it, `astro.config.mjs`, `content.config.ts` glob patterns, and add the corresponding `src/content/<locale>/...` files.

### Content collections

- Defined in `src/content.config.ts`. Each collection (`projects`, `contacts`, `journey`, `footer`, `header`, `home`, `meta`, `phd`, `skills`) loads Markdown via `glob({ pattern: "{fr,en,ru,es}/<name>/**/[^_]*.md", base: "./src/content" })` and validates frontmatter with a Zod schema.
- Content files live at `src/content/<locale>/<collection>/*.md` and always require a `locale` field matching the directory. A single `raw_content_fr.md` exists as scratch/reference content — files prefixed with `_` are excluded from the glob pattern by convention.
- Page components (`src/components/*.astro`) fetch their own collection entries filtered by locale rather than receiving content as props — each section component is self-contained.
- `src/content/skills-data.ts` is a separate, non-Markdown, hardcoded TypeScript data source (skill categories/icons from `@lucide/astro`) — not part of the Content Collections system. It's tested directly in `skills-data.test.ts`.

### CSP header generation (`astro-csp-hash.js`)

Custom Astro integration (not from npm) that hooks into `astro:build:done`: it walks the built `dist/` HTML, extracts inline `<script>` bodies, computes `sha256-` hashes, and writes a full CSP directive string to `csp_header.caddy` at the repo root. This file is `import`ed by the `Caddyfile` at runtime. If you add inline scripts to a page, no manual CSP update is needed — it's regenerated on every build. The integration's core functions (`extractScriptHashes`, `collectHashesFromDir`, `buildCspDirectives`) are unit-tested in `astro-csp-hash.test.js` and covered by an integration test that runs an actual build.

### Deployment

`Containerfile` builds via Bun, then copies `dist/` plus the generated `csp_header.caddy` into a Caddy image (`Caddyfile`) that serves the static site on port 8080 with security headers, `/healthz` and `/ready` endpoints, and SPA-style fallback to `/index.html`.
