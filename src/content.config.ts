import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({
    pattern: '**/index.{md,mdx}',
    base: './src/content/blog',
    generateId: ({ entry }) =>
      entry.replace(/\/index\.(md|mdx)$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, ''),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
    slug: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
