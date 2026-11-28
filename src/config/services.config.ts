/**
 * What I do
 *
 * The four cards on the homepage that stack as you scroll (Services.astro):
 * the owner's services, or anything else in four parts. Each card is one shade deeper of the brand colour
 * (lib/brand.ts). Set show to false to leave the section off the homepage.
 */

export interface ServiceCard {
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
}

export const services = {
  // Off the homepage in the demo; true puts the four cards on it.
  show: false,
  title: 'Services',
  blurb: 'I design, build, optimise and maintain websites with Astro.',
  cards: [
    {
      num: '01',
      title: ['Web', 'Design'],
      icon: 'layout-template',
      tags: ['UI Design', 'Typography', 'Motion', 'Accessibility'],
      desc: [
        'Web design is how a website looks and feels: the layout, the colours, the images, and the way visitors find their way around.',
        'I design every website I build. I pay attention to the details: the typography, the brand colour, the space between elements, and what happens when you hover over a button. Every design works on every screen, from a desktop monitor to a phone, and stays usable for everyone, including visitors who use a screen reader.',
      ],
    },
    {
      num: '02',
      title: ['Web', 'Development'],
      icon: 'code-xml',
      tags: ['Astro', 'TypeScript', 'Tailwind CSS', 'Claude Code'],
      desc: [
        'Web development is building the website: turning the design into the code that runs in the visitor’s browser.',
        'I build my websites with Astro, from the first sketch to the last line of code, together with [Claude Code](https://www.anthropic.com/claude-code). Astro sends finished pages to the browser, with only the JavaScript a page needs, so my sites load fast. Most pages are plain files with no server or database behind them, which leaves little that can break or be attacked, and keeps them easy to maintain for years.',
      ],
    },
    {
      num: '03',
      title: ['Web', 'Optimisation'],
      icon: 'gauge',
      tags: ['Lighthouse', 'Core Web Vitals', 'Technical SEO', 'Structured Data'],
      desc: [
        'Optimisation is making a website fast, easy to find, and usable for everyone.',
        'I test my websites with Lighthouse while I build them, and fix what the report shows together with Claude Code. After a change, I test again to see that the score stays high. Technical SEO and structured data help Google and AI assistants find and understand every page.',
      ],
    },
    {
      num: '04',
      title: ['Web', 'Maintenance'],
      icon: 'wrench',
      tags: ['Astro Updates', 'Security', 'GitHub Issues', 'Feature Requests'],
      desc: [
        'I maintain what I’ve built. I solve the issues people report, even when one takes a lot of time to get right. I keep everything secure and up to date with each new version of Astro.',
        'Maintenance also means adding what people ask for, so a website keeps doing what its owner needs.',
      ],
    },
  ] as ServiceCard[],
};
