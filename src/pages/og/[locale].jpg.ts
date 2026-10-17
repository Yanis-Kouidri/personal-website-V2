/**
 * Open Graph image endpoint
 * Generates one link preview card per locale at build time
 * (/og/fr.jpg, /og/en.jpg, ...), referenced by og:image in the layout.
 */
import type { APIRoute, GetStaticPaths } from "astro";
import { i18n } from "astro:config/server";
import { renderOgImage } from "../../lib/og-image";

export const getStaticPaths = (() =>
  (i18n?.locales ?? []).map((locale) => ({
    params: { locale: typeof locale === "string" ? locale : locale.path },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const jpeg = await renderOgImage(params.locale ?? "fr");
  return new Response(new Uint8Array(jpeg), {
    headers: { "Content-Type": "image/jpeg" },
  });
};
