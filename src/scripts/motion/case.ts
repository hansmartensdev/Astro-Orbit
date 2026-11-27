/**
 * Project page hero: the picture's arrival.
 *
 * The picture is the only thing in the hero that moves: the label, title
 * and line stand still. It is unveiled from the bottom up while it settles
 * from slightly larger, and its glow follows. The motion itself is CSS
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
