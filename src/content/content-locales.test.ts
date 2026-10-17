import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { LOCALES } from "../i18n/locales";

const CONTENT_DIR = import.meta.dirname;

/** Markdown files of a locale directory, ignoring "_" drafts */
function markdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(fullPath);
    return entry.name.endsWith(".md") && !entry.name.startsWith("_")
      ? [fullPath]
      : [];
  });
}

const frontmatterLocale = (file: string) =>
  fs.readFileSync(file, "utf8").match(/^locale:\s*"?([\w-]+)"?\s*$/m)?.[1];

describe("localized content", () => {
  it.each(LOCALES)(
    "les fichiers de %s/ déclarent la bonne locale",
    (locale) => {
      const files = markdownFiles(path.join(CONTENT_DIR, locale));
      expect(files.length).toBeGreaterThan(0);
      for (const file of files) {
        expect(frontmatterLocale(file), path.relative(CONTENT_DIR, file)).toBe(
          locale,
        );
      }
    },
  );

  it("chaque collection existe dans toutes les langues", () => {
    const collectionsOf = (locale: string) =>
      fs
        .readdirSync(path.join(CONTENT_DIR, locale), { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort();
    const reference = collectionsOf(LOCALES[0]);
    for (const locale of LOCALES) {
      expect(collectionsOf(locale), locale).toEqual(reference);
    }
  });
});
