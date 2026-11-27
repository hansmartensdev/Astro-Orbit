/**
 * A blog post's colour, by its category (Hans's choice): Performance posts
 * are emerald, every other post the brand violet. Violet stays the site's
 * colour; the second one only colours a post's card art, its hero and its
 * share cover, so the blog gets some variety and a new post picks up its
 * colour by itself.
 *
 * Emerald is close to the opposite of the violet on the colour wheel, and
 * its deep shade carries the white icon and word as well as the violet does.
 */
export type PostTone = 'violet' | 'emerald';

export const toneFor = (category?: string): PostTone =>
  category === 'Performance' ? 'emerald' : 'violet';

/** The emerald shades, as plain values for the share covers (Satori cannot
 *  read CSS variables). The same values are the `.tone-emerald` class in
 *  styles/global.css. */
export const EMERALD = {
  50: '#ecfdf5',
  200: '#a7f3d0',
  300: '#6ee7b7',
  400: '#34d399',
  600: '#059669',
  fill: '#047857',
  ink: '#022c22',
} as const;
