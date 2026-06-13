import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projectsCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/projects" }),
	schema: z.object({
		title: z.string(),
		technologies: z.array(z.string()),
		githubUrl: z.url(),
		date: z.string(),
		imagePath: z.string(),
	}),
});

const contactsCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/contacts" }),
	schema: z.object({
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
	loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/journey" }),
	schema: z.object({
		title: z.string(),
		// Validation of the array directly via frontmatter attributes
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
	loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/phd" }),
	schema: z.object({
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
	loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/skills" }),
	schema: z.object({
		title: z.string(),
	}),
});

const homeCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/home" }),
	schema: z.object({
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
	loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/header" }),
	schema: z.object({
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

const footerCollection = defineCollection({
	loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/footer" }),
	schema: z.object({
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
	phd: phdCollection,
	skills: skillsCollection,
};
