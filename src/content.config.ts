import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const destinations = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/destinations" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    rating: z.number(),
  }),
});

const ambassadors = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/ambassadors" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
  }),
});

const ads = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/ads" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    link: z.string(),
  }),
});

export const collections = {
  destinations: destinations,
  ambassadors: ambassadors,
  ads: ads,
};