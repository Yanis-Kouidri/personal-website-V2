/**
 * Icon names usable in the content frontmatter (`icon:` of social and
 * contact links). Kept free of component imports so the content schemas can
 * use it; src/components/icons.ts maps each name to its component.
 */
export const ICON_NAMES = [
  "Bitcoin",
  "BookMarked",
  "FileText",
  "Github",
  "GraduationCap",
  "Linkedin",
  "Mail",
] as const;

export type IconName = (typeof ICON_NAMES)[number];
