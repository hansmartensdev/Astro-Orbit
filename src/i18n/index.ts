/**
 * The labels inside Velocity's design-system components (src/components/ui).
 *
 * The components come from Velocity unchanged and ask for their labels as
 *
 *   const t = useTranslations(getLocale(Astro));
 *   t('a11y.slideStatus', { n: 2, total: 5 });
 *
 * This site is in English only, so these are the English labels. {name} is
 * filled in by the component. A key that isn't here comes back as it is.
 */
const ui = {
  a11y: {
    togglePassword: 'Toggle password visibility',
    loading: 'Loading',
    close: 'Close',
    dismiss: 'Dismiss',
    previous: 'Previous',
    next: 'Next',
    error: 'Error',
    slideLabel: '{n} of {total}',
    slideStatus: 'Slide {n} of {total}',
    goToSlide: 'Go to slide {n}',
    slides: 'Slides',
    carousel: 'carousel',
    slide: 'slide',
  },
  media: {
    photo: 'Photo',
    placeholder: 'Image placeholder: {name}',
    play: 'Play video: {title}',
    playsFrom: 'Plays from {provider}',
  },
};

export function getLocale(_astro?: unknown): string {
  return 'en';
}

export function useTranslations(_locale: string = 'en') {
  return (key: string, params: Record<string, string | number> = {}): string => {
    const found = key
      .split('.')
      .reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], ui);
    if (typeof found !== 'string') return key;
    return found.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match));
  };
}
