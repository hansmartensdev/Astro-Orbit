/**
 * Blog covers
 * URL: /covers/<post slug>.png
 *
 * One 1200x630 cover per post, drawn at build time in the house style (see
 * generateBlogCover in src/lib/og.ts). A post's share preview, its header
 * image and its cards on /blog and the homepage all point here, unless the
 * post sets an `image` of its own.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import sharp from 'sharp';
import { generateBlogCover } from '@/lib/og';
import { toneFor } from '@/lib/post-tone';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true
  );
  return posts
    .filter((post) => post.data.locale === 'en')
    .map((post) => {
      const slug = post.id.replace(/^en\//, '');
      return {
        params: { slug },
        props: {
          slug,
          title: post.data.title,
          icon: post.data.icon,
          tags: post.data.tags,
          tone: toneFor(post.data.category),
        },
      };
    });
};

export const GET: APIRoute = async ({ props }) => {
  const { slug, title, icon, tags, tone } = props as {
    slug: string;
    title: string;
    icon?: string;
    tags: string[];
    tone: ReturnType<typeof toneFor>;
  };

  // A cover is never worth a failed deploy: fall back to a plain ink card.
  let png: Buffer;
  try {
    png = await generateBlogCover({ title, slug, icon, tags, tone });
  } catch (error) {
    console.warn(`[covers] could not draw the cover for "${title}", using a plain card:`, error);
    png = await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#0c1016' } })
      .png()
      .toBuffer();
  }

  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
