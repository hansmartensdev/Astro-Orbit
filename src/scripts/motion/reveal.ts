/**
 * [data-reveal]: arrivals for any element, on any page.
 *
 * The motion itself is CSS (southwell.css, "Reveals"): one ease-out curve,
 * cubic-bezier(0.16, 1, 0.3, 1), no spring and no bounce. The opacity
 * settles in 0.8s while the movement glides on for 1.1s, so an element
 * arrives rather than appears. This script only decides *when*, by adding
 * `.is-in`. The same system as Astro Rocket's.
 *
 *   data-reveal            the element rises 64px and fades in, as one unit.
 *                          Put it on the card, not on the things inside it.
 *   data-reveal="rise"     masked rise: slides up from 112% inside a parent
 *                          that clips (.rv-mask)
 *   data-reveal-delay      seconds to hold after entering view, for a row
 *                          of cards that should arrive one after another
 *
 * On load, what is already on screen arrives as one wave in document order,
 * 80ms apart. Everything else arrives once it is 15% in view (tall elements
 * as soon as they enter). Reveals are one-way: an element is unobserved the
 * moment it has arrived and never replays.
 */

const WAVE_START = 250;
const WAVE_STEP = 80;

export function initReveal(reduced: boolean): VoidFunction {
  const elements = [...document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)')];

  if (reduced) {
    for (const el of elements) el.classList.add('is-in');
    return () => {};
  }

  const reveal = (el: HTMLElement, extraMs = 0) => {
    const delay = Number(el.dataset.revealDelay ?? 0) || 0;
    el.style.transitionDelay = `${delay * 1000 + extraMs}ms`;
    el.classList.add('is-in');
  };

  // A rising word starts translated out of its mask, and IntersectionObserver
  // clips by overflow, so the word itself never intersects. Watch the mask.
  const targetOf = (el: HTMLElement) => (el.dataset.reveal === 'rise' ? (el.parentElement ?? el) : el);
  const byTarget = new Map<Element, HTMLElement[]>();
  for (const el of elements) {
    const t = targetOf(el);
    byTarget.set(t, [...(byTarget.get(t) ?? []), el]);
  }

  const onScroll = (threshold: number, margin: string) =>
    new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          for (const el of byTarget.get(entry.target) ?? []) reveal(el);
        }
      },
      { threshold, rootMargin: margin }
    );
  const short = onScroll(0.15, '0px 0px -15% 0px');
  const tall = onScroll(0, '0px 0px -15% 0px');

  // First pass: what's on screen now arrives as one wave; the rest waits for
  // the scroll. Sizes come from the observer's own entries, so nothing here
  // forces a layout read.
  let wave = 0;
  const firstPass = new IntersectionObserver(
    (entries) => {
      entries.sort((a, b) =>
        a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      );
      for (const entry of entries) {
        firstPass.unobserve(entry.target);
        const els = byTarget.get(entry.target) ?? [];
        if (entry.isIntersecting) {
          const offset = WAVE_START + wave++ * WAVE_STEP;
          for (const el of els) reveal(el, offset);
        } else {
          const rootH = entry.rootBounds?.height ?? window.innerHeight;
          (entry.boundingClientRect.height > rootH * 0.85 ? tall : short).observe(entry.target);
        }
      }
    },
    { threshold: 0, rootMargin: '0px 0px -25% 0px' }
  );
  for (const target of byTarget.keys()) firstPass.observe(target);

  // The last lines of a page can never climb 15% up the viewport: the page
  // ends first. Once the reader reaches the bottom, whatever is still
  // waiting and on screen arrives.
  const atEnd = () => {
    if (window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 4) return;
    for (const [target, els] of byTarget) {
      if (els.every((el) => el.classList.contains('is-in'))) continue;
      // Measured in its waiting state, 64px below where it will rest.
      if (target.getBoundingClientRect().top < window.innerHeight + 80) {
        short.unobserve(target);
        tall.unobserve(target);
        for (const el of els) reveal(el);
      }
    }
  };
  window.addEventListener('scroll', atEnd, { passive: true });

  return () => {
    firstPass.disconnect();
    short.disconnect();
    tall.disconnect();
    window.removeEventListener('scroll', atEnd);
  };
}
