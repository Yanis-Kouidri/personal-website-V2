/**
 * Single source of truth for the site languages.
 * Used by astro.config.mjs (routing, sitemap), the content collections, the
 * SEO metadata and the language switchers. To add a language: add it here,
 * add its flag in src/components/Flag.astro, create src/content/<locale>/...
 * and update the 404 regex in the Caddyfile.
 */

export const LOCALES = ["fr", "en", "ru", "es"] as const;

export type Locale = (typeof LOCALES)[number];

/** Served at the site root, without a /<locale>/ prefix */
export const DEFAULT_LOCALE: Locale = "fr";

export const LANGUAGES: Record<
  Locale,
  {
    /** Name of the language in that language, shown in the switchers */
    label: string;
    /** Open Graph locale (language_TERRITORY) */
    ogLocale: string;
  }
> = {
  fr: { label: "Français", ogLocale: "fr_FR" },
  en: { label: "English", ogLocale: "en_US" },
  ru: { label: "Русский", ogLocale: "ru_RU" },
  es: { label: "Español", ogLocale: "es_ES" },
};

/** Narrows Astro.currentLocale (a plain string) to a known locale */
export function toLocale(locale: string | undefined): Locale {
  return LOCALES.find((known) => known === locale) ?? DEFAULT_LOCALE;
}
