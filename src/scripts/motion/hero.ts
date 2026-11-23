/**
 * Hero entrance — one sequence, four beats.
 *
 * The panel settles in from slightly below and smaller; each headline line
 * rises out of its mask; the foot follows. Like Astro Rocket's hero, it is
 * the one place where parts arrive in turn, and it rides the site's one
 * curve, cubic-bezier(0.16, 1, 0.3, 1): a clean ease-out, no spring (see
 * src/scripts/motion/reveal.ts). The headline never fades, only rises, so
 * it is painted at full opacity from the first frame.
 */
import { animate, type AnimationSequence } from 'motion';

/** The site's one reveal curve. */
const EASE = [0.16, 1, 0.3, 1] as const;

export function initHero(reduced: boolean): VoidFunction {
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!hero) return () => {};

  const panel = hero.querySelector<HTMLElement>('.hero__render');
  const words = hero.querySelectorAll<HTMLElement>('.hero__word');
  const foot = hero.querySelector<HTMLElement>('.hero__foot');
  const parts = [panel, ...words, foot].filter((el): el is HTMLElement => Boolean(el));

  if (reduced) {
    for (const el of parts) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }
    return () => {};
  }

  const sequence: AnimationSequence = [];
  if (panel) {
    sequence.push([
      panel,
      { opacity: [0, 1], y: [34, 0], scale: [0.97, 1] },
      { duration: 1.1, ease: EASE, at: 0.1 },
    ]);
  }
  words.forEach((word, i) => {
    sequence.push([
      word,
      { y: ['112%', '0%'] },
      { duration: 1.0, ease: EASE, at: i === 0 ? 0.35 : 0.45 },
    ]);
  });
  if (foot) {
    sequence.push([
      foot,
      { opacity: [0, 1], y: [24, 0] },
      { duration: 1.0, ease: EASE, at: 0.6 },
    ]);
  }

  const controls = animate(sequence);

  return () => controls.stop();
}
