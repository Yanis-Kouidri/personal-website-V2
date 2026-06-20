import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projectsCollection = defineCollection({
  loader: glob({
    pattern: "{fr,en,ru}/projects/**/[^_]*.md",
    base: "./src/content",
  }),
  schema: z.object({
    locale: z.string(),
    sectionTitle: z.string().optional(),
    title: z.string().optional(),
    technologies: z.array(z.string()).optional(),
    githubUrl: z.url().optional(),
    date: z.string().optional(),
    imagePath: z.string().optional(),
  }),
});

const contactsCollection = defineCollection({
  loader: glob({
    pattern: "{fr,en,ru}/contacts/**/[^_]*.md",
    base: "./src/content",
  }),
  schema: z.object({
    locale: z.string(),
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
  loader: glob({
    pattern: "{fr,en,ru}/journey/**/[^_]*.md",
    base: "./src/content",
  }),
  schema: z.object({
    locale: z.string(),
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
  loader: glob({
    pattern: "{fr,en,ru}/phd/**/[^_]*.md",
    base: "./src/content",
  }),
  schema: z.object({
    locale: z.string(),
    title: z.string(),
    projectCode: z.string(),
    subtitle: z.string(),
    period: z.string(),
    description: z.string(),
    collaborationText: z.string(),
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
  loader: glob({
    pattern: "{fr,en,ru}/skills/**/[^_]*.md",
    base: "./src/content",
  }),
  schema: z.object({
    locale: z.string(),
    sectionTitle: z.string(),
    title: z.string(),
  }),
});

const homeCollection = defineCollection({
  loader: glob({
    pattern: "{fr,en,ru}/home/**/[^_]*.md",
    base: "./src/content",
  }),
  schema: z.object({
    locale: z.string(),
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
  loader: glob({
    pattern: "{fr,en,ru}/header/**/[^_]*.md",
    base: "./src/content",
  }),
  schema: z.object({
    locale: z.string(),
    brandName: z.string(),
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
  loader: glob({
    pattern: "{fr,en,ru}/meta/**/[^_]*.md",
    base: "./src/content",
  }),
  schema: z.object({
    locale: z.string(),
    title: z.string(),
    description: z.string(),
  }),
});

const footerCollection = defineCollection({
  loader: glob({
    pattern: "{fr,en,ru}/footer/**/[^_]*.md",
    base: "./src/content",
  }),
  schema: z.object({
    locale: z.string(),
    authorName: z.string(),
  }),
});

export const collections = {
  projects: projectsCollection,
  contacts: contactsCollection,
  journey: journeyCollection,
  footer: footerCollection,
  header: headerCollection,
  home: homeCollection,
  meta: metaCollection,
  phd: phdCollection,
  skills: skillsCollection,
};
