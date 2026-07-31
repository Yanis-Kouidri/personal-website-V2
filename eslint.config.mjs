import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import astroPlugin from "eslint-plugin-astro";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default defineConfig([
  {
    ignores: ["dist/", ".astro/"],
  },
  {
    files: ["**/*.{js,ts,astro}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      astroPlugin.configs.recommended,
      prettierConfig,
    ],
  },
  {
    files: ["*.config.{js,mjs,cjs,ts}", "astro-csp-hash.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["**/*.{js,ts,astro}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.{ts,astro}"],
    rules: {
      "no-undef": "off",
    },
  },
]);
