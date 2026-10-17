import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { LOCALES } from "./i18n/locales";

/**
 * Every collection is localized: entries live in
 * src/content/<locale>/<collection>/*.md (files starting with "_" are
 * ignored) and declare their locale in the frontmatter.
 */
const localizedLoader = (collection: string) =>
  glob({
    pattern: `{${LOCALES.join(",")}}/${collection}/**/[^_]*.md`,
    base: "./src/content",
  });

const locale = z.enum(LOCALES);

const projectsCollection = defineCollection({
  loader: localizedLoader("projects"),
  schema: ({ image }) =>
    z.object({
      locale,
      title: z.string(),
      technologies: z.array(z.string()).min(1),
      githubUrl: z.url(),
      date: z.number().int(),
      image: image(),
    }),
});

const projectsSectionCollection = defineCollection({
  loader: localizedLoader("projectsSection"),
  schema: z.object({
    locale,
    sectionTitle: z.string(),
    sourceCodeLabel: z.string(),
  }),
});

const contactsCollection = defineCollection({
  loader: localizedLoader("contacts"),
  schema: z.object({
    locale,
    sectionTitle: z.string(),
    message: z.string(),
    links: z.array(
      z.object({
        href: z.string(),
        icon: z.string(),
        label: z.string(),
      }),
    ),
  }),
});

const journeyCollection = defineCollection({
  loader: localizedLoader("journey"),
  schema: z.object({
    locale,
    sectionTitle: z.string(),
    title: z.string(),
    items: z
      .array(
        z.object({
          title: z.string(),
          organization: z.string(),
          location: z.string(),
          period: z.string(),
          description: z.string().optional(),
          details: z.array(z.string()).optional(),
          type: z.enum(["academic", "professional", "international"]),
        }),
      )
      .optional(),
  }),
});

const phdCollection = defineCollection({
  loader: localizedLoader("phd"),
  schema: z.object({
    locale,
    title: z.string(),
    overviewLabel: z.string(),
    projectCode: z.string(),
    subtitle: z.string(),
    period: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    sidebarDetails: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    ),
  }),
});

const skillsCollection = defineCollection({
  loader: localizedLoader("skills"),
  schema: z.object({
    locale,
    sectionTitle: z.string(),
    title: z.string(),
    categoryLabels: z.record(z.string(), z.string()),
  }),
});

const homeCollection = defineCollection({
  loader: localizedLoader("home"),
  schema: z.object({
    locale,
    title: z.string(),
    subtitle: z.string(),
    ctaLabel: z.string(),
    ctaHref: z.string(),
    imageAlt: z.string(),
    socialLinks: z.array(
      z.object({
        href: z.string(),
        icon: z.string(),
        label: z.string(),
      }),
    ),
  }),
});

const headerCollection = defineCollection({
  loader: localizedLoader("header"),
  schema: z.object({
    locale,
    brandName: z.string(),
    menuToggleLabel: z.string(),
    langSwitcherLabel: z.string(),
    navLinks: z.array(
      z.object({
        href: z.string(),
        label: z.string(),
      }),
    ),
    contactLink: z.object({
      href: z.string(),
      label: z.string(),
    }),
  }),
});

const metaCollection = defineCollection({
  loader: localizedLoader("meta"),
  schema: z.object({
    locale,
    title: z.string(),
    description: z.string(),
  }),
});

const footerCollection = defineCollection({
  loader: localizedLoader("footer"),
  schema: z.object({
    locale,
    authorName: z.string(),
  }),
});

const notFoundCollection = defineCollection({
  loader: localizedLoader("notFound"),
  schema: z.object({
    locale,
    metaTitle: z.string(),
    title: z.string(),
    message: z.string(),
    backLabel: z.string(),
  }),
});

export const collections = {
  projects: projectsCollection,
  projectsSection: projectsSectionCollection,
  contacts: contactsCollection,
  journey: journeyCollection,
  footer: footerCollection,
  header: headerCollection,
  home: homeCollection,
  meta: metaCollection,
  notFound: notFoundCollection,
  phd: phdCollection,
  skills: skillsCollection,
};
