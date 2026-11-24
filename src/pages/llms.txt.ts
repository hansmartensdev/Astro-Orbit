/**
 * /llms.txt
 *
 * A short plain-text summary of the site for AI assistants and agents
 * (llmstxt.org): who it is by, where he is, and links to the pages, posts
 * and projects. Built from the site config and the content collections, so
 * it follows the site. Facts only, in the words the site itself uses.
 * Projects still on a placeholder (no picture yet) are left out, as they
 * are from the sitemap.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import siteConfig from '@/config/site.config';

export const GET: APIRoute = async () => {
  const base = siteConfig.url.replace(/\/$/, '');

  const posts = (await getCollection('blog', ({ data }) => data.draft !== true && data.locale === 'en')).sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
  );
  const projects = (await getCollection('work', ({ data }) => data.draft !== true))
    .filter(({ data }) => Boolean(data.pageHero ?? data.feature ?? data.cover))
    .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99));

  const lines = [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.description}`,
    '',
    `${siteConfig.name} is an Astro developer in ${siteConfig.location}. He designs, builds, optimises and maintains websites with Astro, including his own site and free, open-source Astro themes. He is not an agency and does not sell websites.`,
    '',
    '## Pages',
    '',
    `- [Home](${base}/): the homepage, with the 3D hero, projects, services and blog`,
    `- [About](${base}/about/): about ${siteConfig.name}`,
    `- [Projects](${base}/projects/): the projects`,
    `- [Blog](${base}/blog/): posts about Astro, building themes and what makes websites fast`,
    `- [Contact](${base}/contact/): contact form, email and WhatsApp`,
    '',
    // Left out while every project is still a placeholder.
    ...(projects.length
      ? [
          '## Projects',
          '',
          ...projects.map(({ id, data }) => `- [${data.title}](${base}/projects/${id}/): ${data.description}`),
          '',
        ]
      : []),
    '## Blog',
    '',
    ...posts.map(({ id, data }) => `- [${data.title}](${base}/blog/${id.replace(/^en\//, '')}/): ${data.description}`),
    '',
    '## Contact',
    '',
    `- Email: ${siteConfig.email}`,
    `- Location: ${siteConfig.location}`,
    ...siteConfig.socialLinks.map((link) => `- ${link}`),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
