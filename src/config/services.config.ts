/**
 * Services
 *
 * The four scroll-stacking cards on the homepage: Hans's craft, in his own
 * voice — design, build, optimise, maintain — not a studio's service list. Kept in config rather than a
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
    title: ['Web', 'Design'],
    theme: 'white',
    tags: ['UI Design', 'Typography', 'Motion', 'Accessibility'],
    desc: 'A site should look great. I design calm, considered interfaces where every detail matters, from the type to the smallest hover.',
  },
  {
    num: '02',
    title: ['Develop', 'with Astro'],
    theme: 'mid',
    tags: ['Astro', 'TypeScript', 'Tailwind CSS', 'Claude Code'],
    desc: 'I build every site myself with Astro, from the first sketch to the last line of code: lean, purposeful, and built to last. I work together with Claude Code.',
  },
  {
    num: '03',
    title: ['Optimise &', 'Get Found'],
    theme: 'ink',
    tags: ['Lighthouse', 'Core Web Vitals', 'Technical SEO', 'Structured Data'],
    desc: 'Fast pages and top Lighthouse scores, with the technical SEO and structured data that help Google and AI assistants find and understand every site.',
  },
  {
    num: '04',
    title: ['Maintain &', 'Share'],
    theme: 'shade',
    tags: ['GitHub', 'Open Source', 'Astro Themes', 'Blog'],
    desc: 'I keep what I build up to date on GitHub and share it openly, so the Astro community can use it too — and I write about it on my personal blog.',
  },
];
