import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOGImage } from '@/lib/og';
import siteConfig from '@/config/site.config';

// Define static pages that need OG images
// One per page the SEO component points at (/og/<path>.png). Every page that
// renders without its own `image` needs an entry here or below, or its link
// preview is a 404.
const STATIC_PAGES = [
  { slug: 'index', title: 'An Astro developer for fast & beautiful websites.', description: siteConfig.description },
  { slug: 'about', title: 'About', description: `Who ${siteConfig.name} is, and what drives the work.` },
  { slug: 'work', title: 'Selected work', description: 'Websites designed and built from scratch: fast, accessible and original.' },
  { slug: 'blog', title: 'Blog', description: 'Notes on Astro, web performance and building fast websites.' },
  { slug: 'contact', title: 'Contact', description: `Start a project with ${siteConfig.name}, or just say hello.` },
];

export const getStaticPaths: GetStaticPaths = async () => {
  // Get all blog posts
  const blogPosts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  // Generate paths for blog posts
  const blogPaths = blogPosts.map((post) => ({
    params: { slug: `blog/${post.id}` },
    props: {
      title: post.data.title,
      description: post.data.description,
      type: 'article' as const,
    },
  }));

  // Case studies: /og/work/<id>.png, used while a project has no picture of
  // its own to share.
  const projects = await getCollection('work', ({ data }) =>
    import.meta.env.PROD ? data.draft !== true : true
  );
  const workPaths = projects.map((project) => ({
    params: { slug: `work/${project.id}` },
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

  return [...staticPaths, ...workPaths, ...blogPaths];
};

export const GET: APIRoute = async ({ props }) => {
  const { title, description, type } = props as {
    title: string;
    description?: string;
    type: 'website' | 'article';
  };

  const png = await generateOGImage({
    title,
    description,
    type,
  });

  // Convert Buffer to Uint8Array for Response compatibility
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
