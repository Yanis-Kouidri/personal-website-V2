// @ts-check

import { defineConfig } from "astro/config";
import astroCspHash from "./astro-csp-hash.js";

import sitemap from "@astrojs/sitemap";
import { DEFAULT_LOCALE, LOCALES } from "./src/i18n/locales.ts";

// https://astro.build/config
export default defineConfig({
  site: "https://www.kouidri.fr",
  build: {
    // The CSP only allows same-origin stylesheets (style-src 'self'), so
    // small stylesheets must not be inlined into <style> tags
    inlineStylesheets: "never",
  },
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: [...LOCALES],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    astroCspHash(),
    sitemap({
      // Localized 404 pages are built as regular routes (e.g. /en/404/)
      filter: (page) => !new URL(page).pathname.endsWith("/404/"),
      // Adds xhtml:link hreflang alternates between the localized pages
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: Object.fromEntries(LOCALES.map((locale) => [locale, locale])),
      },
    }),
  ],
});
