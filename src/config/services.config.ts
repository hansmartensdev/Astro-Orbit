/**
 * Services
 *
 * The four scroll-stacking cards on the homepage. Kept in config rather than a
 * content collection: there are four of them, they have no bodies, no dates and
 * no pages of their own — the shape is structural, not editorial.
 */

export interface Service {
  num: string;
  /** Heading is set on two lines, exactly as designed. */
  title: [string, string];
  tags: string[];
  desc: string;
  /** Card colourway. */
  theme: 'white' | 'mid' | 'ink' | 'shade';
}

export const services: Service[] = [
  {
    num: '01',
    title: ['Astro', 'Websites'],
    theme: 'white',
    tags: ['Astro', 'TypeScript', 'Tailwind CSS', 'Static & Hybrid'],
    desc: 'Original websites built from scratch in Astro: static-first, accessible, and fast on every device. No page builders, no themes stretched to fit.',
  },
  {
    num: '02',
    title: ['Speed &', 'SEO'],
    theme: 'mid',
    tags: ['Core Web Vitals', 'Technical SEO', 'Structured Data', 'Accessibility'],
    desc: 'A slow site costs visitors and rankings. I find what holds yours back and fix it, so pages load instantly and search engines understand them.',
  },
  {
    num: '03',
    title: ['Headless', 'CMS'],
    theme: 'ink',
    tags: ['Content Collections', 'Headless CMS', 'Markdown & MDX', 'Editor Training'],
    desc: 'Content you can edit yourself, without touching code. I connect Astro to a CMS that suits your team and keep the site just as fast.',
  },
  {
    num: '04',
    title: ['Care &', 'Hosting'],
    theme: 'shade',
    tags: ['Deployment', 'Updates', 'Monitoring', 'Support'],
    desc: 'Launch is the start, not the end. I deploy, host and look after your site, with updates, backups and a real person to call.',
  },
];
