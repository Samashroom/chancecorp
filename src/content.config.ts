import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';


const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    infobox: z.record(z.string()).optional(),
  }),
});


export const collections = {
  news: news,
};