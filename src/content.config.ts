import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Blog collection with Content Layer API
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(100),
      description: z.string().max(200),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      author: z.string().default('Hans Martens'),
      image: image().optional(),
      imageAlt: z.string().optional(),
      /** One of three categories, for filtering the blog once there are enough
       *  posts to filter: Astro (building with Astro), Themes (the free themes,
       *  and how they're made) or Performance (speed, Lighthouse, SEO). */
      category: z.enum(['Astro', 'Themes', 'Performance']).optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      /** Set false to hide the table of contents on this post. */
      toc: z.boolean().default(true),
      /** The cover's icon: any Lucide name (lucide.dev/icons), or "claude" or "astro" for those logos. Without it,
       *  one is picked from the tags. See generateBlogCover in lib/og.ts. */
      icon: z.string().optional(),
      /** A word or two under the icon on the post's card image (CardArt), e.g.
       *  "lighthouse". Without it the card image shows the icon alone. */
      cardWord: z.string().optional(),
      locale: z.enum(['en', 'es', 'fr']).default('en'),
    }),
});

// Pages collection for static pages
const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updatedAt: z.coerce.date().optional(),
    locale: z.enum(['en', 'es', 'fr']).default('en'),
  }),
});

// Authors collection
const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      bio: z.string(),
      avatar: image().optional(),
      social: z
        .object({
          twitter: z.string().optional(),
          github: z.string().optional(),
          linkedin: z.string().optional(),
        })
        .optional(),
    }),
});

// FAQs collection (for JSON-LD FAQ schema)
const faqs = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/faqs' }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    category: z.string().optional(),
    order: z.number().default(0),
    locale: z.enum(['en', 'es', 'fr']).default('en'),
  }),
});

// Work collection — the studio's projects.
//
// This replaces the hand-maintained `projects` array the homepage grid used to
// read from, so a project is now one file that feeds the homepage grid, the
// /work index and its own case-study page.
const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      /** Project name, set at display size over the card. */
      title: z.string().max(60),
      /** The small mono label in the corner of the card, e.g. "WEB + BRAND". */
      discipline: z.string().max(40),
      /** One line, used for cards, listings and meta description. */
      description: z.string().max(200),
      client: z.string().optional(),
      year: z.number().int().optional(),
      services: z.array(z.string()).default([]),
      /** Live site, if the work is public. */
      url: z.url().optional(),
      /**
       * The resting card image — a photograph or brand shot rather than a
       * screen. The mockup in `cover` is what the card reveals on hover.
       * Without a feature, the cover simply sits there and nothing swaps.
       */
      feature: image().optional(),
      /** Optional: the card picture for phones, composed for the phone
       *  card's nearly square shape (about 1.28:1), with room for the label
       *  top right and the title at the bottom. Without it, phones crop the
       *  middle out of the wide picture. */
      featureMobile: image().optional(),
      /** Optional: the project page's own hero picture, composed for a
       *  desktop screen's shape (16:10) and large enough for a sharp
       *  screen. Without it the hero uses `feature`, which is shaped for
       *  the card and gets cropped and enlarged there. */
      pageHero: image().optional(),
      /** Set false for a hero without a picture: the title on the plain ink
       *  ground. The card on the projects page keeps its picture. */
      heroImage: z.boolean().default(true),
      /** Optional: a short screen recording, shown first beside "Why I
       *  built it". It plays muted and on a loop, loads only when the reader
       *  is near it, and stays on its still (`poster`) under reduced motion.
       *  Paths are under /public. */
      video: z
        .object({ src: z.string(), poster: z.string(), alt: z.string(), width: z.number(), height: z.number() })
        .optional(),
      /** The device mockup. Revealed on hover when a `feature` is set. */
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** Further captures, shown down the case-study page. */
      gallery: z
        .array(
          z.object({
            src: image(),
            alt: z.string().optional(),
            /** A thin border, for a capture whose edge is the page colour. */
            frame: z.boolean().optional(),
            /** Which part of the case study it sits in: 1 (Why I built it)
             *  or 2 (What I built). Without it, the pictures are shared out
             *  half and half. */
            band: z.union([z.literal(1), z.literal(2)]).optional(),
          }),
        )
        .default([]),
      /** Caption for the striped placeholder standing in for the capture. */
      placeholder: z.string().optional(),
      /** The two halves of a case study, when they have been written. */
      challenge: z.string().optional(),
      solution: z.string().optional(),
      technologies: z.array(z.string()).default([]),
      features: z.array(z.string()).default([]),
      /** e.g. a partnership credit, shown by the project title. */
      badge: z.string().optional(),
      /**
       * The project has a hand-built story page at pages/work/<id>.astro.
       * The generic [...slug] template skips it; the grid still links to it.
       */
      story: z.boolean().default(false),
      /**
       * The id of the story page this project is told inside of, e.g. the six
       * AKH builds inside `akh-digital`. A project with a parent keeps its own
       * case-study page but leaves the grids, and its "next" door leads back
       * to the parent.
       */
      parent: z.string().optional(),
      /** Lower sorts first — the homepage grid takes the first several. */
      order: z.number().default(99),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

export const collections = {
  blog,
  pages,
  authors,
  faqs,
  work,
};
