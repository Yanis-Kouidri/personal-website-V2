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

export const collections = {
	projects: projectsCollection,
};
