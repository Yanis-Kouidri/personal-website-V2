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
- `bun run optimize:svg` — losslessly optimize every SVG under `public/` with svgo (run after adding a logo)
- Run a single test file: `bun run test astro-csp-hash.test.js` or `bunx vitest run src/content/skills-data.test.ts`

Husky + lint-staged run ESLint/Prettier on staged files at commit time (`lint-staged.config.js`).

## Architecture

### i18n / routing

- `src/i18n/locales.ts` is the single source of truth for languages: `LOCALES` (`fr, en, ru, es`), `DEFAULT_LOCALE` (`fr`, served without prefix) and `LANGUAGES` (native label, Open Graph locale). `astro.config.mjs` (routing, sitemap), `content.config.ts`, the layout SEO tags and the language switchers all read it. To add a language: add it there, add its flag in `src/components/Flag.astro`, create `src/content/<locale>/...` (every collection) and `src/pages/<locale>/{index,404}.astro`, and update the 404 regex in the `Caddyfile`.
- French pages live at `/`, other locales at `/en/`, `/ru/`, `/es/`. Each `src/pages/**/index.astro` / `404.astro` is a thin wrapper composing the same section components.
- Components load localized content with `getLocalizedEntry(collection, Astro.currentLocale)` / `getLocalizedEntries(...)` from `src/i18n/content.ts`; a missing translation fails the build. Use `toLocale(Astro.currentLocale)` when a typed `Locale` is needed (links, flags). Do not duplicate components per locale.
- `LangSwitcher.astro` (desktop dropdown) and the burger menu in `Header.astro` (mobile) both loop over `LOCALES`.

### Content collections

- Defined in `src/content.config.ts`. Each collection (`projects`, `projectsSection`, `contacts`, `notFound`, `journey`, `footer`, `header`, `home`, `meta`, `phd`, `skills`) uses the shared `localizedLoader(name)` (glob `{<locales>}/<name>/**/[^_]*.md` under `src/content`) and validates frontmatter with a Zod schema; `locale` is an enum of `LOCALES`.
- Content files live at `src/content/<locale>/<collection>/*.md` and declare the `locale` of their directory (checked by `src/content/content-locales.test.ts`, which also checks every collection exists in every locale). Files prefixed with `_` are excluded by convention (drafts, notes).
- Page components (`src/components/*.astro`) fetch their own collection entries rather than receiving content as props — each section component is self-contained.
- Social/contact `icon` values are an enum of `src/components/icon-names.ts`; `src/components/icons.ts` maps each name to its component.
- `src/content/skills-data.ts` is a separate, non-Markdown, hardcoded TypeScript data source (skill categories, icons, logos) — not part of the Content Collections system; category names come from the localized `skills.md` (`categoryLabels`). It's tested in `skills-data.test.ts`.
- Open Graph cards (`/og/<locale>.jpg`) are generated at build time by `src/pages/og/[locale].jpg.ts`, which feeds localized texts to `renderOgCard()` in `src/lib/og-card.ts` (Satori + sharp, no Astro imports). `og-card.test.ts` checks the card layout on the rendered pixels.

### CSP header generation (`astro-csp-hash.js`)

Custom Astro integration (not from npm) that hooks into `astro:build:done`: it walks the built `dist/` HTML, extracts inline `<script>` bodies, computes `sha256-` hashes, and writes a full CSP directive string to `csp_header.caddy` at the repo root. This file is `import`ed by the `Caddyfile` at runtime. If you add inline scripts to a page, no manual CSP update is needed — it's regenerated on every build. The integration's core functions (`extractScriptHashes`, `collectHashesFromDir`, `buildCspDirectives`) are unit-tested in `astro-csp-hash.test.js` and covered by an integration test that runs an actual build.

### Deployment

`Containerfile` builds via Bun, then copies `dist/` plus the generated `csp_header.caddy` into a Caddy image (`Caddyfile`) that serves the static site on port 8080 with security headers, `/healthz` and `/ready` endpoints, and a localized 404 page (real 404 status) via `handle_errors`.
