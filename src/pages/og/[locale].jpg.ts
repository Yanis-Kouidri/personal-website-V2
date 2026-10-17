/**
 * Open Graph image endpoint
 * Generates one link preview card per locale at build time
 * (/og/fr.jpg, /og/en.jpg, ...), referenced by og:image in the layout.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { getLocalizedEntry } from "../../i18n/content";
import { LOCALES } from "../../i18n/locales";
import { renderOgCard } from "../../lib/og-card";

export const getStaticPaths = (() =>
  LOCALES.map((locale) => ({ params: { locale } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const [home, phd] = await Promise.all([
    getLocalizedEntry("home", params.locale),
    getLocalizedEntry("phd", params.locale),
  ]);
  const jpeg = await renderOgCard({
    title: home.data.title,
    subtitle: home.data.subtitle,
    keywords: phd.data.keywords.slice(0, 4),
    ctaLabel: home.data.ctaLabel,
  });
  return new Response(new Uint8Array(jpeg), {
    headers: { "Content-Type": "image/jpeg" },
  });
};
