/**
 * Posts live in a folder named after their language: src/content/blog/en/,
 * src/content/blog/nl/. The site shows the folder for its language
 * (theme.config language), and a post's address leaves the folder out:
 * src/content/blog/en/getting-started.mdx is /blog/getting-started/.
 */
import { lang } from '@/i18n';

/** The language folder a post is in. */
export const postLanguage = (id: string) => (id.includes('/') ? id.slice(0, id.indexOf('/')) : lang);

/** A post's slug: its file name, without the language folder. */
export const postSlug = (id: string) => (id.includes('/') ? id.slice(id.indexOf('/') + 1) : id);

let warned = false;

/**
 * Whether a post is in the site's language. Says once in the build log when
 * the site's folder is empty while another folder has posts, so a blog that
 * shows nothing says why.
 */
export function inSiteLanguage(post: { id: string }, all?: { id: string }[]): boolean {
  if (all && !warned && !all.some((p) => postLanguage(p.id) === lang) && all.length > 0) {
    warned = true;
    const folders = [...new Set(all.map((p) => postLanguage(p.id)))].join(', ');
    console.warn(
      `[blog] The site's language is '${lang}', but there are no posts in src/content/blog/${lang}/ ` +
        `(there are in: ${folders}). Move them there, or the blog stays empty.`
    );
  }
  return postLanguage(post.id) === lang;
}
