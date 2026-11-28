import { t } from '@/i18n';
import { home, about, pages } from '@/config/theme.config';
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
import { postSlug, inSiteLanguage } from '@/lib/posts';

export const GET: APIRoute = async () => {
  const base = siteConfig.url.replace(/\/$/, '');

  const posts = (await getCollection('blog', (post) => post.data.draft !== true && inSiteLanguage(post))).sort(
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
    '## Pages',
    '',
    `- [${t.nav.home}](${base}/): ${home.hero.intro}`,
    `- [${t.nav.about}](${base}/about/): ${about.description}`,
    `- [${t.nav.projects}](${base}/projects/): ${pages.projects.description}`,
    `- [${t.nav.blog}](${base}/blog/): ${pages.blog.description}`,
    `- [${t.nav.contact}](${base}/contact/): ${pages.contact.description}`,
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
    ...posts.map(({ id, data }) => `- [${data.title}](${base}/blog/${postSlug(id)}/): ${data.description}`),
    '',
    '## Contact',
    '',
    `- ${t.contact.email}: ${siteConfig.email}`,
    `- ${t.contact.basedIn}: ${siteConfig.location}`,
    ...siteConfig.socialLinks.map((link) => `- ${link}`),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
