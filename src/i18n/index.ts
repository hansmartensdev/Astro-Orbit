/**
 * The site's language and the theme's words in it.
 *
 * Every file in this folder named after a language code (en.ts, nl.ts) is a
 * dictionary, loaded here on its own: adding a language is adding its file.
 * `language` in config/theme.config.ts picks the one the site uses.
 */
import { language } from '@/config/theme.config';
import type { Dictionary } from './en';

export type { Dictionary };

const files = import.meta.glob<{ default: Dictionary }>(['./*.ts', '!./index.ts'], { eager: true });

export const dictionaries: Record<string, Dictionary> = Object.fromEntries(
  Object.entries(files).map(([path, mod]) => [path.slice(2, -3), mod.default])
);

/** The languages the theme has a dictionary for. */
export const languages = Object.keys(dictionaries);

/** A language's dictionary. Stops the build when the language has none. */
export function getDictionary(code: string = language): Dictionary {
  const dictionary = dictionaries[code];
  if (!dictionary) {
    throw new Error(
      `theme.config.ts sets language = '${code}', but there's no src/i18n/${code}.ts. ` +
        `The theme has ${languages.join(', ')}. Copy src/i18n/en.ts to src/i18n/${code}.ts and translate it.`
    );
  }
  return dictionary;
}

/** The site's language code, for <html lang>, dates and the RSS feed. */
export const lang: string = language;

/** The theme's words in the site's language. */
export const t: Dictionary = getDictionary();

/**
 * A date as the site's language writes it: "November 26, 2026", "26 november
 * 2026". In UTC: a post dated 2026-11-26 is midnight UTC, and a build west
 * of Greenwich would otherwise write the day before.
 */
export function formatDate(date: Date, code: string = lang): string {
  return new Intl.DateTimeFormat(code, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date);
}

/** Text in capitals, by the rules of the site's language. */
export const upper = (text: string, code: string = lang) => text.toLocaleUpperCase(code);

// Chinese and Japanese are written without spaces between words, so counting
// the spaces says nothing about their length. Their characters are counted
// instead, at about 400 a minute; words in other scripts at 220 a minute.
const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu;

/** Minutes to read a text, at least one. */
export function readingMinutes(text: string): number {
  const characters = text.match(CJK)?.length ?? 0;
  const words = text.replace(CJK, ' ').split(/\s+/).filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
  return Math.max(1, Math.round(words / 220 + characters / 400));
}

/**
 * The calls Velocity's components make, so they can be copied from Velocity
 * unchanged:
 *
 *   const t = useTranslations(getLocale(Astro));
 *   t('a11y.slideStatus', { n: 2, total: 5 });
 *
 * The keys are in the `ui` section of each dictionary. A key that isn't
 * there comes back as it is, as in Velocity.
 */
export function getLocale(_astro?: unknown): string {
  return lang;
}

export function useTranslations(code: string = lang) {
  const ui = getDictionary(code).ui as Record<string, unknown>;
  return (key: string, params: Record<string, string | number> = {}): string => {
    const found = key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], ui);
    if (typeof found !== 'string') return key;
    return found.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match));
  };
}
