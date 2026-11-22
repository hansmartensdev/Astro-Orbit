/**
 * Services
 *
 * The four scroll-stacking cards on the homepage: Hans's craft, in his own
 * voice — what he does and cares about, not a studio's service list. Kept in config rather than a
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
    title: ['Built with', 'Astro'],
    theme: 'mid',
    tags: ['Astro', 'TypeScript', 'Tailwind CSS', 'Hand-built'],
    desc: 'Astro matches how I think about the web: lean, purposeful, and built to last. I build every site myself, from the first sketch to the last line of code.',
  },
  {
    num: '03',
    title: ['Fast &', 'Found'],
    theme: 'ink',
    tags: ['Core Web Vitals', 'Technical SEO', 'Structured Data', 'AI Search'],
    desc: 'A site should load fast and get found, by Google and by AI assistants. Speed and findability are part of every build, not an afterthought.',
  },
  {
    num: '04',
    title: ['Writing &', 'Sharing'],
    theme: 'shade',
    tags: ['Astro', 'Themes', 'Performance', 'Blog'],
    desc: 'On the blog I write about building themes, Astro, and what makes websites fast: what I learn, shared as I go.',
  },
];
