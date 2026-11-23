/**
 * Services
 *
 * The four scroll-stacking cards on the homepage: Hans's craft, in his own
 * voice: design, development, optimisation, maintenance. Not a studio's
 * service list. Kept in config rather than a
 * content collection: there are four of them, they have no bodies, no dates and
 * no pages of their own — the shape is structural, not editorial.
 */

export interface Service {
  num: string;
  /** The heading: one line, or two when given two parts. */
  title: [string] | [string, string];
  /** A Lucide icon (lucide.dev/icons), drawn large above the title on
   *  desktop. */
  icon: string;
  tags: string[];
  /** One or more paragraphs. */
  desc: string | string[];
  /** Card colourway. */
  theme: 'white' | 'mid' | 'ink' | 'shade';
}

export const services: Service[] = [
  {
    num: '01',
    title: ['Web', 'Design'],
    icon: 'pen-tool',
    theme: 'white',
    tags: ['UI Design', 'Typography', 'Motion', 'Accessibility'],
    desc: 'A site should look great. I design calm, considered interfaces where every detail matters, from the type to the smallest hover.',
  },
  {
    num: '02',
    title: ['Web', 'Development'],
    icon: 'code-xml',
    theme: 'mid',
    tags: ['Astro', 'TypeScript', 'Tailwind CSS', 'Claude Code'],
    desc: 'I build every site myself with Astro, from the first sketch to the last line of code: lean, purposeful, and built to last. I work together with Claude Code.',
  },
  {
    num: '03',
    title: ['Optimisation'],
    icon: 'gauge',
    theme: 'ink',
    tags: ['Lighthouse', 'Core Web Vitals', 'Technical SEO', 'Structured Data'],
    desc: 'Fast pages and top Lighthouse scores, with the technical SEO and structured data that help Google and AI assistants find and understand every site.',
  },
  {
    num: '04',
    title: ['Maintenance'],
    icon: 'wrench',
    theme: 'shade',
    tags: ['Astro Updates', 'Security', 'GitHub Issues', 'Feature Requests'],
    desc: [
      "I maintain what I've built: my own website, my free Astro theme Astro Rocket and its demo website. I solve the issues people report on GitHub, even when one takes a lot of time to get right. I keep everything secure and up to date with each new version of Astro.",
      'Maintenance also means adding what people ask for. A user from Indonesia emailed me to ask how to use Umami, a cookieless analytics service, with Astro Rocket. I built it into the theme with Claude Code, so now every site on Astro Rocket can use it.',
    ],
  },
];
