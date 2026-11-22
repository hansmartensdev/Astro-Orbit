import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import satori from 'satori';
import { html } from 'satori-html';
import sharp from 'sharp';
import siteConfig from '@/config/site.config';

export interface OGImageOptions {
  title: string;
  description?: string;
  type?: 'website' | 'article';
}

// Geist, the site's own face, as static instances (Satori reads TTF/OTF, not
// WOFF2 or variable fonts). Made from @fontsource-variable/geist (SIL OFL).
//
// Read fresh for every image, as a standalone ArrayBuffer holding exactly the
// file's bytes. On Vercel a cached, shared copy reached Satori as other data
// ("Unsupported OpenType signature") and failed the build; a Buffer's .buffer
// is the memory it lives in, not the file, and need not stay put. 64 KB per
// image is nothing next to that.
function loadFont(weight: 400 | 600): ArrayBuffer {
  const file = readFileSync(resolve(process.cwd(), `public/fonts/geist-latin-${weight}-normal.ttf`));
  const copy = new Uint8Array(file.byteLength);
  copy.set(file);
  return copy.buffer;
}

/** Ink, ice and the violet accent, as plain values: Satori cannot read CSS variables. */
const INK = '#0c1016';
const ICE = '#eef2f4';
const VIOLET = '#7c3aed';
const VIOLET_ON_INK = '#8b5cf6';

/**
 * satori-html escapes interpolated text (& → &amp;) but hands the parsed tree
 * to Satori without decoding it again, so an ampersand in a title would be
 * drawn as "&amp;". Undo the escaping on every text node.
 */
type Node = string | { props?: { children?: Node | Node[] } } | null | undefined;
function decodeText<T extends Node>(node: T): T {
  if (typeof node === 'string') {
    return node
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&') as T;
  }
  const children = node?.props?.children;
  if (node?.props && children !== undefined) {
    node.props.children = Array.isArray(children) ? children.map(decodeText) : decodeText(children);
  }
  return node;
}

export async function generateOGImage(options: OGImageOptions): Promise<Buffer> {
  const { title, description } = options;

  const truncatedDescription = description
    ? description.length > 130
      ? description.slice(0, 127) + '…'
      : description
    : '';
  const titleSize = title.length > 56 ? 56 : title.length > 34 ? 64 : 76;

  // A share card in the site's terms: ink, a violet glow rising from the
  // bottom-right corner (the droplet's colour), the hm/ tile and name, the
  // page's title and line, and the domain under a short violet rule.
  // Note: every div needs an explicit display for Satori.
  const markup = html`
    <div style="height: 100%; width: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 64px 76px 60px; font-family: 'Geist'; background-color: ${INK}; background-image: radial-gradient(circle at 100% 100%, rgba(124, 58, 237, 0.55) 0%, rgba(124, 58, 237, 0.18) 38%, rgba(124, 58, 237, 0) 68%);">
      <div style="display: flex; align-items: center; gap: 18px;">
        <div style="display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: ${VIOLET}; border-radius: 14px;">
          <span style="font-size: 23px; font-weight: 600; color: #ffffff; letter-spacing: -0.04em;">${siteConfig.mark}</span>
        </div>
        <span style="font-size: 30px; font-weight: 600; color: ${ICE}; letter-spacing: -0.02em;">${siteConfig.name}</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 22px;">
        <div style="display: flex; font-size: ${titleSize}px; font-weight: 600; color: #ffffff; line-height: 1.08; letter-spacing: -0.035em; max-width: 1020px;">${title}</div>
        <div style="display: ${truncatedDescription ? 'flex' : 'none'}; font-size: 27px; color: #aebcc4; line-height: 1.45; max-width: 900px;">${truncatedDescription}</div>
      </div>
      <div style="display: flex; align-items: center; gap: 18px;">
        <div style="display: flex; width: 44px; height: 4px; border-radius: 4px; background: ${VIOLET_ON_INK};"></div>
        <span style="font-size: 23px; color: #8b97a1;">${new URL(siteConfig.url).hostname}</span>
      </div>
    </div>
  `;

  // Generate SVG with satori
  decodeText(markup as unknown as Node);
  // @ts-expect-error satori-html VNode is compatible with satori
  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Geist', data: loadFont(400), weight: 400, style: 'normal' },
      { name: 'Geist', data: loadFont(600), weight: 600, style: 'normal' },
    ],
  });

  // Convert SVG to PNG
  return Buffer.from(
    await sharp(Buffer.from(svg)).resize(1200).png().toBuffer()
  );
}

// ---------------------------------------------------------------------------
// Blog covers
//
// Every post gets a cover in one house style: ink, a violet glow, a large
// outline Lucide icon, the title in Geist and the hm/ mark. What changes per
// post is seeded from its slug, so a cover is unique and the same on every
// build: where the main glow sits and where its fainter partner sits. The
// icon is the post's `icon` frontmatter (any lucide.dev name), or one picked
// from its tags. The same image is the post's share preview, its header
// image and its card on the blog and the homepage.
// ---------------------------------------------------------------------------

/** Where a post's cover lives. One place, so pages and cards agree. */
export const coverPath = (slug: string) => `/covers/${slug}.png`;

/** A tag (lower-cased) to an icon, for posts without their own `icon`. */
// The first rule a post's tags match wins, so the most specific topics come
// first: nearly every post here is tagged Astro, so Astro is the last resort
// before the default, and a passing "Tailwind CSS" tag does not make a post
// about open source a design post.
const TAG_ICONS: [RegExp, string][] = [
  [/security|cve|vulnerab/, 'shield-check'],
  [/open.?source|github|boilerplate|starter|theme/, 'git-branch'],
  [/\bai\b|claude|llm|assistant/, 'sparkles'],
  [/cloudflare|edge|hosting|deploy/, 'cloud'],
  [/seo|search|google/, 'search'],
  [/accessib|a11y/, 'accessibility'],
  [/css|design|style|typograph/, 'paintbrush'],
  [/perform|speed|vitals|lighthouse/, 'gauge'],
  [/javascript|typescript|react|next/, 'code-xml'],
  [/astro/, 'rocket'],
]
const DEFAULT_ICON = 'pen-line';

let lucide: Record<string, { body: string }> | null = null;
export function lucideBody(name: string): string | undefined {
  if (!lucide) {
    const path = resolve(process.cwd(), 'node_modules/@iconify-json/lucide/icons.json');
    lucide = JSON.parse(readFileSync(path, 'utf8')).icons;
  }
  return lucide?.[name]?.body;
}

/** The icon a post's cover uses: its own, else one from its tags. */
export function coverIcon(icon: string | undefined, tags: string[] = []): string {
  if (icon && lucideBody(icon)) return icon;
  if (icon) console.warn(`[covers] unknown Lucide icon "${icon}", picking one from the tags`);
  const joined = tags.join(' ').toLowerCase();
  return TAG_ICONS.find(([re]) => re.test(joined))?.[1] ?? DEFAULT_ICON;
}

const seedOf = (s: string) => {
  let h = 2166136261;
  for (const ch of s) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const GLOW_AT = ['0% 0%', '100% 0%', '100% 100%', '0% 100%', '50% 0%', '50% 100%'];

export async function generateBlogCover(options: {
  title: string;
  slug: string;
  icon?: string;
  tags?: string[];
}): Promise<Buffer> {
  const { title, slug, tags = [] } = options;
  const seed = seedOf(slug);
  const glow = GLOW_AT[seed % GLOW_AT.length];
  const glow2 = GLOW_AT[(seed >>> 7) % GLOW_AT.length];
  const body = lucideBody(coverIcon(options.icon, tags))!
    .replace(/currentColor/g, '#c4b5fd')
    .replace(/stroke-width="2"/g, 'stroke-width="1.25"');
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 24 24">${body}</svg>`;
  const iconSrc = `data:image/svg+xml;base64,${Buffer.from(iconSvg).toString('base64')}`;
  const titleSize = title.length > 70 ? 50 : title.length > 46 ? 58 : 66;

  const markup = html`
    <div style="display: flex; flex-direction: column; justify-content: space-between; width: 100%; height: 100%; padding: 64px 72px; font-family: 'Geist'; background-color: ${INK}; background-image: radial-gradient(circle at ${glow}, rgba(124, 58, 237, 0.6) 0%, rgba(124, 58, 237, 0) 60%), radial-gradient(circle at ${glow2}, rgba(167, 139, 250, 0.22) 0%, rgba(167, 139, 250, 0) 45%);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <span style="font-size: 26px; font-weight: 600; color: ${ICE}; letter-spacing: -0.04em;">${siteConfig.mark}</span>
        <img src="${iconSrc}" style="width: 220px; height: 220px;" />
      </div>
      <div style="display: flex; font-size: ${titleSize}px; font-weight: 600; color: #ffffff; line-height: 1.05; letter-spacing: -0.035em; max-width: 920px;">${title.toLowerCase()}</div>
    </div>
  `;

  decodeText(markup as unknown as Node);
  // @ts-expect-error satori-html VNode is compatible with satori
  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Geist', data: loadFont(400), weight: 400, style: 'normal' },
      { name: 'Geist', data: loadFont(600), weight: 600, style: 'normal' },
    ],
  });
  return Buffer.from(await sharp(Buffer.from(svg)).png().toBuffer());
}
