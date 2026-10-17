// @ts-check

import { defineConfig } from "astro/config";
import astroCspHash from "./astro-csp-hash.js";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.kouidri.fr",
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en", "ru", "es"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    astroCspHash(),
    sitemap({
      // Localized 404 pages are built as regular routes (e.g. /en/404/)
      filter: (page) => !new URL(page).pathname.endsWith("/404/"),
    }),
  ],
});
