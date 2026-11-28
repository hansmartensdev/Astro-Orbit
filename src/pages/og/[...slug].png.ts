import { t } from '@/i18n';
import { home, about, pages } from '@/config/theme.config';
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import sharp from 'sharp';
import { generateOGImage } from '@/lib/og';
import siteConfig from '@/config/site.config';

// Define static pages that need OG images
// One per page the SEO component points at (/og/<path>.png). Every page that
// renders without its own `image` needs an entry here or below, or its link
// preview is a 404. Blog posts are not here: their cover is their preview
// (src/pages/covers/[slug].png.ts).
const STATIC_PAGES = [
  // The texts from theme.config.ts and the site's dictionary.
  { slug: 'index', title: `${home.hero.line1} ${home.hero.line2.before} ${home.hero.line2.accent} ${home.hero.line2.after}`, description: siteConfig.description },
  { slug: 'about', title: t.nav.about, description: about.description },
  { slug: 'projects', title: t.projects.title, description: pages.projects.blurb },
  { slug: 'blog', title: t.blog.title, description: pages.blog.blurb },
  { slug: 'contact', title: pages.contact.title, description: pages.contact.blurb },
];

export const getStaticPaths: GetStaticPaths = async () => {
  // Case studies: /og/projects/<id>.png, used while a project has no picture of
  // its own to share.
  const projects = await getCollection('work', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true
  );
  const workPaths = projects.map((project) => ({
    params: { slug: `projects/${project.id}` },
    props: {
      title: project.data.title,
      description: project.data.description,
      type: 'website' as const,
    },
  }));

  // Generate paths for static pages
  const staticPaths = STATIC_PAGES.map((page) => ({
    params: { slug: page.slug },
    props: {
      title: page.title,
      description: page.description,
      type: 'website' as const,
    },
  }));

  return [...staticPaths, ...workPaths];
};

export const GET: APIRoute = async ({ props }) => {
  const { title, description, type } = props as {
    title: string;
    description?: string;
    type: 'website' | 'article';
  };

  // A link preview is never worth a failed deploy: if one cannot be drawn,
  // say so in the build log and ship a plain ink card for that page instead.
  let png: Buffer;
  try {
    png = await generateOGImage({ title, description, type });
  } catch (error) {
    console.warn(`[og] could not draw the share image for "${title}", using a plain card:`, error);
    png = await sharp({
      create: { width: 1200, height: 630, channels: 3, background: '#0c1016' },
    })
      .png()
      .toBuffer();
  }

  // Convert Buffer to Uint8Array for Response compatibility
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
