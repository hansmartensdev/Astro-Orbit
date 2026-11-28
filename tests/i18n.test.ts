import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { dictionaries, formatDate, readingMinutes, upper, useTranslations } from '@/i18n';
import en from '@/i18n/en';
import { postLanguage, postSlug } from '@/lib/posts';

/** Every line in a dictionary, as path → kind (text, list or function). */
function shape(value: unknown, path = ''): Record<string, string> {
  if (typeof value === 'function') return { [path]: 'function' };
  if (Array.isArray(value)) return { [path]: `list of ${value.length}` };
  if (value && typeof value === 'object') {
    return Object.assign({}, ...Object.entries(value).map(([key, v]) => shape(v, path ? `${path}.${key}` : key)));
  }
  return { [path]: typeof value };
}

describe('dictionaries', () => {
  it('include English, Spanish, French and Dutch', () => {
    expect(Object.keys(dictionaries)).toEqual(expect.arrayContaining(['en', 'es', 'fr', 'nl']));
  });

  // The type check catches a missing line too, but only in a typed editor
  // or `pnpm check`; this runs with the tests, whatever the file's type.
  for (const [code, dictionary] of Object.entries(dictionaries)) {
    it(`${code} has the same lines as English`, () => {
      expect(shape(dictionary)).toEqual(shape(en));
    });

    it(`${code} has no empty lines`, () => {
      const empty = Object.entries(shape(dictionary)).filter(([path]) => {
        const value = path.split('.').reduce<unknown>((v, key) => (v as Record<string, unknown>)[key], dictionary);
        return value === '';
      });
      expect(empty).toEqual([]);
    });

    it(`${code} keeps the values in its sentences`, () => {
      expect(dictionary.blog.minRead(7)).toContain('7');
      expect(dictionary.blog.shareOn('LinkedIn')).toContain('LinkedIn');
      expect(dictionary.projects.seeAll(12)).toContain('12');
      expect(dictionary.projects.seeProject('Lumen')).toContain('Lumen');
      expect(dictionary.footer.home('am/', 'Alex Morgan')).toContain('Alex Morgan');
      expect(dictionary.footer.rss('Alex Morgan')).toContain('Alex Morgan');
      expect(dictionary.privacy.updated('1 May')).toContain('1 May');
      expect(dictionary.newsletter.mailSubject('example.com')).toContain('example.com');
      expect(dictionary.newsletter.mailIntro('example.com')).toContain('example.com');
    });

    it(`${code} has a privacy page`, () => {
      expect(existsSync(`src/i18n/privacy/${code}.astro`)).toBe(true);
    });
  }
});

describe('French', () => {
  it('drops the e of "de" before a vowel', () => {
    expect(dictionaries.fr.footer.rss('Alex Morgan')).toBe("Flux RSS d'Alex Morgan");
    expect(dictionaries.fr.footer.rss('Jean Dupont')).toBe('Flux RSS de Jean Dupont');
  });
});

describe('useTranslations', () => {
  it("reads the components' labels and fills in values", () => {
    const t = useTranslations('nl');
    expect(t('a11y.slideStatus', { n: 2, total: 5 })).toBe('Dia 2 van 5');
    expect(t('a11y.close')).toBe('Sluiten');
  });

  it('gives back a key it has no label for', () => {
    expect(useTranslations('en')('a11y.nothing')).toBe('a11y.nothing');
  });
});

describe('dates, capitals and reading time', () => {
  it('writes a date the way each language does, on the day itself', () => {
    const day = new Date('2026-11-26');
    expect(formatDate(day, 'en')).toBe('November 26, 2026');
    expect(formatDate(day, 'nl')).toBe('26 november 2026');
    expect(formatDate(day, 'fr')).toBe('26 novembre 2026');
    expect(formatDate(day, 'es')).toBe('26 de noviembre de 2026');
  });

  it('puts text in capitals by the language’s rules', () => {
    expect(upper('istanbul', 'tr')).toBe('İSTANBUL');
    expect(upper('über', 'en')).toBe('ÜBER');
  });

  it('counts at least one minute', () => {
    expect(readingMinutes('')).toBe(1);
    expect(readingMinutes('word '.repeat(660))).toBe(3);
  });
});

describe('posts in language folders', () => {
  it('reads the language from the folder and leaves it out of the address', () => {
    expect(postLanguage('nl/hallo')).toBe('nl');
    expect(postSlug('nl/hallo')).toBe('hallo');
    expect(postSlug('getting-started')).toBe('getting-started');
  });
});
