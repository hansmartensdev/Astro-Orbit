/**
 * Project-specific content, merged into src/content.config.ts.
 *
 * Add collections here rather than in content.config.ts, which upgrades replace.
 * Upgrades never overwrite this file.
 *
 *   siteCollections  your own collections, by name
 *   blogFields       extra frontmatter fields for Velocity's blog
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defaultLocale, locales } from '../i18n/locales.mjs';

/** Case studies, in src/content/projects/<locale>/<slug>.mdx, served at /work/<slug>. */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: () =>
    z.object({
      title: z.string().max(100),
      /** One sentence for cards, search results and the meta description. */
      description: z.string().max(200),
      client: z.string(),
      year: z.string(),
      /** What you did on it, e.g. ['Product design', 'Front-end']. */
      role: z.array(z.string()).default([]),
      /** Photo file name in src/assets/photos/, without the extension. Shows a placeholder until it exists. */
      cover: z.string().optional(),
      coverAlt: z.string().default(''),
      /** A live link to the project, if there is one. */
      url: z.url().optional(),
      featured: z.boolean().default(false),
      /** Lower comes first. */
      order: z.number().default(0),
      draft: z.boolean().default(false),
      locale: z.enum(locales).default(defaultLocale),
    }),
});

export const siteCollections = { projects };
