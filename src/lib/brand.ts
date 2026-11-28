/**
 * The brand colour's shades, from brandColor in theme.config.ts.
 *
 * The site uses one colour in eleven shades, 50 (palest) to 950 (deepest),
 * plus "ink", a near-black with a hint of the colour for text on a pale
 * ground. Lighter shades are the colour mixed with white, darker ones with
 * black. For the default violet the table below is used as it is, so the
 * theme looks exactly as it was designed (Tailwind's violet scale).
 *
 * BaseLayout writes the shades on :root as --orbit-50 ... --orbit-950 and
 * --orbit-ink; build-time code (share images) imports brandShades directly.
 */
import { brandColor } from '@/config/theme.config';

export type Shade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 | 'ink';
export type Shades = Record<Shade, string>;

const VIOLET: Shades = {
  50: '#f5f3ff',
  100: '#ede9fe',
  200: '#ddd6fe',
  300: '#c4b5fd',
  400: '#a78bfa',
  500: '#8b5cf6',
  600: '#7c3aed',
  700: '#6d28d9',
  800: '#5b21b6',
  900: '#4c1d95',
  950: '#2e1065',
  ink: '#1a1030',
};

/** How much white (positive) or black (negative) goes into each shade. */
const MIX: Record<Shade, number> = {
  50: 0.95,
  100: 0.9,
  200: 0.8,
  300: 0.62,
  400: 0.4,
  500: 0.2,
  600: 0,
  700: -0.15,
  800: -0.3,
  900: -0.45,
  950: -0.65,
  ink: -0.82,
};

function parse(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) throw new Error(`brandColor in theme.config.ts must be a hex code such as '#7c3aed', not '${hex}'`);
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

const toHex = (rgb: number[]) => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

/** The theme's own violet, which brandColor: 'default' also gives. */
export const DEFAULT_BRAND = VIOLET[600];

export function brandShades(hex: string = brandColor): Shades {
  const value = hex.trim().toLowerCase();
  if (value === 'default' || value === '' || value === VIOLET[600]) return { ...VIOLET };
  const rgb = parse(hex);
  const out = {} as Shades;
  for (const key of Object.keys(MIX) as Array<keyof typeof MIX>) {
    const m = MIX[key];
    const target = m >= 0 ? 255 : 0;
    const k = Math.abs(m);
    out[(isNaN(Number(key)) ? key : Number(key)) as Shade] = toHex(rgb.map((c) => c + (target - c) * k));
  }
  return out;
}

/*
 * Which shade does which job. A colour someone picks may be too light for
 * text on the light page or too dark for text on the dark one, so each job
 * starts at the shade the violet uses and steps darker or lighter until it
 * reaches the WCAG contrast that job needs (what Lighthouse checks):
 *
 *   text        accent text and links on the light page    4.5:1 on the page
 *   onDark      accent text on the dark page and cards     4.5:1 on the ink
 *   onInk       small text and marks on ink                4.5:1 on the ink
 *   markDark    lines, borders, outlines on the dark page  3:1 on the ink
 *   fill        a coloured ground under white text         4.5:1 with white
 *   fillHover   one step deeper, for hover
 *
 * The default violet passes all of them with the shades it was designed
 * with, so it keeps them unchanged.
 */
const LIGHT_PAGE = '#eef2f4'; // --ice-100
const DARK_PAGE = '#0e0e0e'; // --ink-950
const WHITE = '#ffffff';

const DARKER: Shade[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 'ink'];

export type Roles = Record<'text' | 'onDark' | 'onInk' | 'markDark' | 'fill' | 'fillHover', string>;

const DEFAULT_ROLES: Record<keyof Roles, Shade> = {
  text: 600,
  onDark: 500,
  onInk: 400,
  markDark: 600,
  fill: 600,
  fillHover: 700,
};

function luminance(hex: string): number {
  const [r, g, b] = parse(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** From `start`, the first shade towards `direction` that reaches `min`
 *  against `ground`; the last one if none does. */
function pick(s: Shades, start: Shade, direction: 1 | -1, ground: string, min: number): Shade {
  let i = DARKER.indexOf(start);
  while (i >= 0 && i < DARKER.length) {
    if (contrast(s[DARKER[i]], ground) >= min) return DARKER[i];
    i += direction;
  }
  return DARKER[direction === 1 ? DARKER.length - 1 : 0];
}

export function brandRoles(hex: string = brandColor): Roles {
  const s = brandShades(hex);
  const value = hex.trim().toLowerCase();
  if (value === 'default' || value === '' || value === VIOLET[600]) {
    return Object.fromEntries(Object.entries(DEFAULT_ROLES).map(([k, v]) => [k, s[v]])) as Roles;
  }
  const fill = pick(s, 600, 1, WHITE, 4.5);
  const fillIndex = DARKER.indexOf(fill);
  return {
    text: s[pick(s, 600, 1, LIGHT_PAGE, 4.5)],
    onDark: s[pick(s, 500, -1, DARK_PAGE, 4.5)],
    onInk: s[pick(s, 400, -1, DARK_PAGE, 4.5)],
    markDark: s[pick(s, 600, -1, DARK_PAGE, 3)],
    fill: s[fill],
    fillHover: s[DARKER[Math.min(fillIndex + 1, DARKER.length - 1)]],
  };
}

/**
 * The four stacked cards on the homepage (Services.astro): one shade deeper
 * per card, starting at the fill shade (white text at 4.5:1 or more), and in
 * dark mode one step deeper again. For the default violet: 600, 700, 800, 900
 * in light and 700, 800, 900, 950 in dark, the ramp the cards were designed with.
 */
export function brandCards(hex: string = brandColor): { light: string[]; dark: string[] } {
  const s = brandShades(hex);
  const fill = brandRoles(hex).fill;
  const start = DARKER.findIndex((k) => s[k] === fill);
  const at = (i: number) => s[DARKER[Math.min(i, DARKER.indexOf(950))]];
  return {
    light: [0, 1, 2, 3].map((n) => at(start + n)),
    dark: [1, 2, 3, 4].map((n) => at(start + n)),
  };
}

/** The shades and the roles as CSS custom properties, for :root. */
export function brandCss(hex: string = brandColor): string {
  const s = brandShades(hex);
  const r = brandRoles(hex);
  const cards = brandCards(hex);
  const kebab = (k: string) => k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
  return (
    ':root{' +
    [
      ...(Object.keys(s) as Shade[]).map((k) => `--orbit-${k}:${s[k]}`),
      ...(Object.keys(r) as Array<keyof Roles>).map((k) => `--orbit-${kebab(k)}:${r[k]}`),
      ...cards.light.map((c, i) => `--orbit-card-${i + 1}:${c}`),
    ].join(';') +
    '}' +
    '.dark{' +
    cards.dark.map((c, i) => `--orbit-card-${i + 1}:${c}`).join(';') +
    '}'
  );
}
