/**
 * Open Graph image endpoint
 * Generates one link preview card per locale at build time
 * (/og/fr.jpg, /og/en.jpg, ...), referenced by og:image in the layout.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { LOCALES } from "../../i18n/locales";
import { renderOgImage } from "../../lib/og-image";

export const getStaticPaths = (() =>
  LOCALES.map((locale) => ({ params: { locale } }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const jpeg = await renderOgImage(params.locale ?? "fr");
  return new Response(new Uint8Array(jpeg), {
    headers: { "Content-Type": "image/jpeg" },
  });
};
