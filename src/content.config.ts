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

export const collections = {
	projects: projectsCollection,
	journey: journeyCollection,
};
