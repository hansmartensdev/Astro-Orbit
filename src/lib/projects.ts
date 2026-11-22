/**
 * Project helpers: the one place that knows how case studies map to URLs.
 *
 * Projects live in src/content/projects/<locale>/<slug>.mdx and are served at
 * /work/<slug> (default locale) or /<locale>/work/<slug>.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLocale, type Locale } from '@/i18n/config';
import { localizeRoute } from '@/i18n/paths';

export type Project = CollectionEntry<'projects'>;

/** 'en/project-one' → 'project-one' */
export const getProjectSlug = (entry: Project) => entry.id.split('/').slice(1).join('/');

export const getProjectUrl = (entry: Project) =>
  `${localizeRoute('work', entry.data.locale)}/${getProjectSlug(entry)}`;

/** Published projects for a locale (drafts are included in dev), in `order`. */
export async function getProjects(locale: Locale | string = defaultLocale): Promise<Project[]> {
  const entries = await getCollection(
    'projects',
    (entry) => entry.data.locale === locale && (import.meta.env.PROD ? !entry.data.draft : true),
  );
  return entries.sort((a, b) => a.data.order - b.data.order);
}
