/**
 * Services
 *
 * The four scroll-stacking cards on the homepage: Hans's craft, in his own
 * voice: web design, development, optimisation and maintenance. Not a studio's
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
  /** One or more paragraphs. A paragraph may hold a link written as
   *  [text](url), Markdown style; everything else is plain text. */
  desc: string | string[];
  /** Optional: a link under the text, e.g. to a blog post on the subject. */
  link?: { href: string; label: string };
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
    desc: [
      'Web design is how a website looks and feels: the layout, the colours, the images, and the way visitors find their way around.',
      'I design my own websites and my free Astro themes. I pay attention to the details: the typography, the brand colour, the space between elements, and what happens when you hover over a button. Every design works on every screen, from a desktop monitor to a phone, and stays usable for everyone, including visitors who use a screen reader.',
    ],
  },
  {
    num: '02',
    title: ['Web', 'Development'],
    icon: 'code-xml',
    theme: 'mid',
    tags: ['Astro', 'TypeScript', 'Tailwind CSS', 'Claude Code'],
    desc: [
      "Web development is building the website: turning the design into the code that runs in the visitor's browser.",
      'I build my websites and themes with Astro, from the first sketch to the last line of code, together with [Claude Code](https://www.anthropic.com/claude-code). Astro sends finished pages to the browser, with only the JavaScript a page needs, so my sites load fast. Most pages are plain files with no server or database behind them, which leaves little that can break or be attacked, and keeps them easy to maintain for years.',
    ],
  },
  {
    num: '03',
    title: ['Web', 'Optimisation'],
    icon: 'gauge',
    link: { href: '/blog/lighthouse-score-explained', label: 'The Lighthouse score explained' },
    theme: 'ink',
    tags: ['Lighthouse', 'Core Web Vitals', 'Technical SEO', 'Structured Data'],
    desc: [
      'Optimisation is making a website fast, easy to find, and usable for everyone.',
      'I test my websites with Lighthouse while I build them, and fix what the report shows together with Claude Code. This website went from a mobile score of 59 at the start of the build to 98. After a change, I often test again to see that the score stays high. Technical SEO and structured data help Google and AI assistants find and understand every page.',
    ],
  },
  {
    num: '04',
    title: ['Web', 'Maintenance'],
    icon: 'wrench',
    theme: 'shade',
    tags: ['Astro Updates', 'Security', 'GitHub Issues', 'Feature Requests'],
    desc: [
      "I maintain what I've built: my own website, my free Astro theme Astro Rocket and its demo website. I solve the issues people report on GitHub, even when one takes a lot of time to get right. I keep everything secure and up to date with each new version of Astro.",
      'Maintenance also means adding what people ask for. A user from Indonesia emailed me to ask how to use Umami, a cookieless analytics service, with Astro Rocket. I built it into the theme with Claude Code, so now every site on Astro Rocket can use it.',
    ],
  },
];
