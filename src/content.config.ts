import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const postsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './posts' }),
  schema: z.object({
    title: z.string().max(200),
    date: z.coerce.date(),
    description: z.string().max(320).optional(),
    tags: z.array(z.string()).max(10).default([]),
    draft: z.boolean().default(false),
    canonicalUrl: z.string().url().optional(),
    slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  posts: postsCollection,
};
