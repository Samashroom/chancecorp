import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import remarkResolveContentImages from './remark-resolve-content-images.js';
import rehypeExtractHeadings from './rehype-extract-headings.js';

export const markdown = {
  remarkPlugins: [remarkResolveContentImages],
  rehypePlugins: [rehypeExtractHeadings],
};

const destinations = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/destinations" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    rating: z.number(),
  }),
});


export const collections = {
  destinations: destinations,
};