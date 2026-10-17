/**
 * Locale-aware access to the content collections.
 * Components pass Astro.currentLocale; it falls back to the default locale.
 */
import {
  type CollectionEntry,
  type CollectionKey,
  getCollection,
} from "astro:content";
import { toLocale } from "./locales";

/** All entries of a collection for a locale */
export function getLocalizedEntries<C extends CollectionKey>(
  collection: C,
  locale: string | undefined,
): Promise<CollectionEntry<C>[]> {
  const target = toLocale(locale);
  return getCollection(
    collection,
    (entry: CollectionEntry<C>) => entry.data.locale === target,
  );
}

/** The single entry of a collection for a locale; fails the build if missing */
export async function getLocalizedEntry<C extends CollectionKey>(
  collection: C,
  locale: string | undefined,
): Promise<CollectionEntry<C>> {
  const [entry] = await getLocalizedEntries(collection, locale);
  if (!entry) {
    throw new Error(
      `Missing "${collection}" content for locale "${toLocale(locale)}"`,
    );
  }
  return entry;
}
