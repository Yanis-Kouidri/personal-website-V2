/** Components behind the icon names of the content (see icon-names.ts) */
import {
  Bitcoin,
  BookBookmark,
  FileText,
  GraduationCap,
  Mail,
} from "@lucide/astro";
import { Github } from "simple-icons-astro";
import type { IconName } from "./icon-names";
import LinkedinIcon from "./LinkedinIcon.astro";

export const ICONS = {
  Bitcoin,
  BookBookmark,
  FileText,
  Github,
  GraduationCap,
  Linkedin: LinkedinIcon,
  Mail,
} satisfies Record<IconName, unknown>;
