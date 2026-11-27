/**
 * Project page hero: the picture's arrival.
 *
 * The label, title and line arrive through [data-reveal] (reveal.ts). The
 * picture arrives the way the homepage hero's panel does (hero.ts): on a
 * wide screen, where it is a card under the title, it rises from slightly
 * below and smaller; on a phone, where it fills the hero, it fades in and
 * settles from slightly larger. Its glow follows. The motion itself is CSS
 * (`.case__hero.is-in` in the project page's styles); this script only
 * decides when, by adding `.is-in` once the picture has loaded, so the
 * arrival never plays over an empty frame. A slow picture is not waited on
 * for more than 2.5s.
 */
const MAX_WAIT = 2500;

export function initCase(reduced: boolean): VoidFunction {
  const hero = document.querySelector<HTMLElement>('.case__hero');
  if (!hero || hero.classList.contains('is-in')) return () => {};

  let frame = 0;
  let done = false;
  const arrive = () => {
    if (done) return;
    done = true;
    frame = requestAnimationFrame(() => hero.classList.add('is-in'));
  };

  if (reduced) {
    hero.classList.add('is-in');
    return () => {};
  }

  const img = hero.querySelector<HTMLImageElement>('img.case__hero-img');
  if (!img || (img.complete && img.naturalWidth > 0)) arrive();
  else img.decode().then(arrive, arrive);
  const timer = window.setTimeout(arrive, MAX_WAIT);

  return () => {
    window.clearTimeout(timer);
    cancelAnimationFrame(frame);
  };
}
