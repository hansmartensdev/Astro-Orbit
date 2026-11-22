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
const fontCache = new Map<number, ArrayBuffer>();

function loadFont(weight: 400 | 600): ArrayBuffer {
  let data = fontCache.get(weight);
  if (!data) {
    const path = resolve(process.cwd(), `public/fonts/geist-latin-${weight}-normal.ttf`);
    // Copy out exactly the file's bytes. A Buffer's .buffer is the memory it
    // lives in, which on some Node versions starts with other data — Satori
    // then reads that as the font header ("Unsupported OpenType signature").
    const file = readFileSync(path);
    data = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;
    fontCache.set(weight, data);
  }
  return data;
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
