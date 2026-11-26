import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import satori from 'satori';
import { html } from 'satori-html';
import sharp from 'sharp';
import siteConfig from '@/config/site.config';
import { brandRoles, brandShades } from '@/lib/brand';

export interface OGImageOptions {
  title: string;
  description?: string;
  type?: 'website' | 'article';
}

// The theme's own faces: Outfit for titles and the mark, Archivo for running
// text. Satori reads TTF, OTF and WOFF but not WOFF2 or variable fonts, so
// these are the static WOFF instances from @fontsource/outfit and
// @fontsource/archivo (SIL OFL), not the variable files the site loads.
//
// Read fresh for every image, as a standalone ArrayBuffer holding exactly the
// file's bytes. On Vercel a cached, shared copy reached Satori as other data
// ("Unsupported OpenType signature") and failed the build; a Buffer's .buffer
// is the memory it lives in, not the file, and need not stay put.
function loadFont(family: 'outfit' | 'archivo', weight: 400 | 600): ArrayBuffer {
  const file = readFileSync(
    resolve(process.cwd(), `node_modules/@fontsource/${family}/files/${family}-latin-${weight}-normal.woff`)
  );
  const copy = new Uint8Array(file.byteLength);
  copy.set(file);
  return copy.buffer;
}

/** The fonts every image registers: Outfit for titles, Archivo for text. */
const fonts = () => [
  { name: 'Outfit', data: loadFont('outfit', 600), weight: 600 as const, style: 'normal' as const },
  { name: 'Archivo', data: loadFont('archivo', 400), weight: 400 as const, style: 'normal' as const },
];

/** Ink, ice and the violet accent, as plain values: Satori cannot read CSS variables. */
const BRAND = brandShades();
const ROLES = brandRoles();
const INK = BRAND.ink; // a deep violet ground for covers and share cards, as the dark footer
const ICE = '#eef2f4';
const VIOLET = ROLES.fill; // under the white mark
const VIOLET_ON_INK = ROLES.onDark;
/** A brand shade with transparency, for the glows (satori takes rgba()). */
const tint = (hex: string, alpha: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

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
    <div style="box-sizing: border-box; height: 100%; width: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 64px 76px 60px; font-family: 'Archivo'; background-color: ${INK}; background-image: radial-gradient(circle at 100% 100%, ${tint(BRAND[600], 0.55)} 0%, ${tint(BRAND[600], 0.18)} 38%, ${tint(BRAND[600], 0)} 68%);">
      <div style="display: flex; align-items: center; gap: 18px;">
        <div style="display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: ${VIOLET}; border-radius: 14px;">
          <span style="font-family: 'Outfit'; font-size: 23px; font-weight: 600; color: #ffffff; letter-spacing: -0.04em;">${siteConfig.mark}</span>
        </div>
        <span style="font-family: 'Outfit'; font-size: 30px; font-weight: 600; color: ${ICE}; letter-spacing: -0.02em;">${siteConfig.name}</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 22px;">
        <div style="display: flex; font-family: 'Outfit'; font-size: ${titleSize}px; font-weight: 600; color: #ffffff; line-height: 1.08; letter-spacing: -0.035em; max-width: 1020px;">${title}</div>
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
    fonts: fonts(),
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
// outline Lucide icon, the title in Outfit and the hm/ mark. What changes per
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

/**
 * Brand marks that Lucide doesn't carry, for a post about that product, in
 * a 24x24 box like Lucide's. Filled shapes, not strokes, and drawn a little
 * inside the box so they sit at the same visual size as a Lucide icon.
 * claude: the Claude logo (simple-icons), for posts about Claude.
 * astro: the Astro logo (simple-icons, CC0), for posts about Astro.
 */
const BRAND_ICONS: Record<string, string> = {
  astro: `<g transform="translate(2.4 2.4) scale(0.8)"><path fill="currentColor" d="M8.358 20.162c-1.186-1.07-1.532-3.316-1.038-4.944c.856 1.026 2.043 1.352 3.272 1.535c1.897.283 3.76.177 5.522-.678c.202-.098.388-.229.608-.36c.166.473.209.95.151 1.437c-.14 1.185-.738 2.1-1.688 2.794c-.38.277-.782.525-1.175.787c-1.205.804-1.531 1.747-1.078 3.119l.044.148a3.16 3.16 0 0 1-1.407-1.188a3.3 3.3 0 0 1-.544-1.815c-.004-.32-.004-.642-.048-.958c-.106-.769-.472-1.113-1.161-1.133c-.707-.02-1.267.411-1.415 1.09c-.012.053-.028.104-.045.165zm-5.961-4.445s3.24-1.575 6.49-1.575l2.451-7.565c.092-.366.36-.614.662-.614s.57.248.662.614l2.45 7.565c3.85 0 6.491 1.575 6.491 1.575L16.088.727C15.93.285 15.663 0 15.303 0H8.697c-.36 0-.615.285-.784.727z"/></g>`,
  claude: `<g transform="translate(2.4 2.4) scale(0.8)"><path fill="currentColor" d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/></g>`,
};

/** An icon's SVG body: a brand mark above, else any Lucide icon by name. */
export function lucideBody(name: string): string | undefined {
  if (BRAND_ICONS[name]) return BRAND_ICONS[name];
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
    .replace(/currentColor/g, BRAND[300])
    .replace(/stroke-width="2"/g, 'stroke-width="1.25"');
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 24 24">${body}</svg>`;
  const iconSrc = `data:image/svg+xml;base64,${Buffer.from(iconSvg).toString('base64')}`;
  const titleSize = title.length > 70 ? 50 : title.length > 46 ? 58 : 66;

  const markup = html`
    <div style="box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; width: 100%; height: 100%; padding: 64px 72px; font-family: 'Outfit'; background-color: ${INK}; background-image: radial-gradient(circle at ${glow}, ${tint(BRAND[600], 0.6)} 0%, ${tint(BRAND[600], 0)} 60%), radial-gradient(circle at ${glow2}, ${tint(BRAND[400], 0.22)} 0%, ${tint(BRAND[400], 0)} 45%);">
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
    fonts: fonts(),
  });
  return Buffer.from(await sharp(Buffer.from(svg)).png().toBuffer());
}
