/**
 * Astro Orbit: the site owner's texts, in one file.
 *
 * Everything a visitor reads that is about you is here: the homepage, the
 * About page, the contact page, the page intros, the sign-off and the
 * newsletter. Your name, email, location and links are in site.config.ts.
 * The demo is filled in for a fictive designer, Alex Morgan; replace the
 * texts with your own.
 *
 * In the longer texts, `[text](url)` becomes a link and `**text**` bold
 * (see lib/rich.ts).
 */

/** Homepage. */
export const home = {
  /** The page title in the browser tab and in search results. */
  title: 'Astro Developer in Amsterdam',
  hero: {
    /** The headline's first line. */
    line1: 'An Astro developer',
    /** The second line: before the accent word, the accent word (violet),
     *  and after it. */
    line2: { before: 'building', accent: 'beautiful', after: 'websites.' },
    intro:
      "I'm Alex Morgan, an Astro developer in Amsterdam. I design and build fast, accessible websites for small businesses and independent makers.",
  },
  /** The section the droplet lands in. */
  reel: {
    title: 'Fast sites, built to last.',
    blurb: 'Design and Astro development in one pair of hands, from the first sketch to the last deploy.',
  },
  /** The card the droplet opens into; its words light up as you scroll.
   *  `accent` phrases are set in the brand colour. */
  statement: {
    label: 'What drives me',
    phrases: [
      { text: 'Making something' },
      { text: 'beautifully designed', accent: true },
      { text: 'and' },
      { text: 'technically solid', accent: true },
      { text: '— that’s the work I enjoy most.' },
    ],
    button: 'More about me',
  },
  projects: {
    title: 'Latest projects',
    blurb: 'A selection of websites I have designed and built.',
  },
  blog: {
    title: 'From the blog',
    blurb: 'Notes on Astro, design and what makes websites fast.',
  },
};

/** The About page. */
export const about = {
  description: 'About Alex Morgan, an Astro developer in Amsterdam, the Netherlands.',
  hero: {
    title: 'Alex Morgan',
    intro:
      "I'm Alex Morgan, an Astro developer in Amsterdam. I design and build websites for small businesses and independent makers.",
    /** The facts in the strip at the foot of the hero, up to four. */
    facts: [
      { label: 'Based in', value: 'Amsterdam, the Netherlands' },
      { label: 'Websites since', value: '2016' },
      { label: 'Astro since', value: '2021' },
      { label: 'Builds with', value: 'Claude Code' },
    ],
    /** Your photo in the hero: a file in src/assets/about/, imported in
     *  pages/about.astro. Without one, the hero shows your mark on the
     *  violet grid. */
    photoAlt: '',
  },
  /** The years. A year made of digits counts up as it comes into view. */
  timeline: {
    label: 'From the start to now',
    title: 'Design first, then websites',
    items: [
      {
        year: 'Studies',
        text: 'I studied graphic design in Amsterdam, then designed logos, posters and packaging at a small studio.',
      },
      { year: '2016', text: 'A friend asked me for a website for her bakery. I built it myself, and I’ve been building websites ever since.' },
      { year: '2021', text: 'I moved to Astro, because the websites I built had to load fast on a phone.' },
      {
        year: 'Now',
        text: 'I design and build every site myself, for type foundries, architects, conferences and the makers of developer tools.',
      },
    ],
  },
  craft: {
    title: 'Design and code,',
    accent: 'in one pair of hands',
    lead: 'I design and build every website myself.',
    text: 'One person from the first sketch to the last deploy means nothing gets lost between the design and the code, and every detail is a decision someone made on purpose.',
  },
  work: {
    label: 'Recent work',
    title: 'A few projects',
  },
  tools: {
    label: 'Tools',
    title: 'What I work with',
    text: 'I build my websites with Astro, TypeScript and Tailwind CSS, together with Claude Code.',
  },
};

/** The page intros. */
export const pages = {
  projects: {
    description: 'Websites by Alex Morgan, Astro developer in Amsterdam.',
    blurb: 'A selection of websites I have designed and built.',
    /** Under "Client" in a project's facts, for a project without a
     *  `client`: your own work, such as a free theme. Empty ('') leaves
     *  the slot out. */
    noClient: 'The Astro Community',
  },
  blog: {
    description: 'Notes on Astro, design and web performance, by Alex Morgan.',
    blurb: 'Notes on Astro, design and web performance: what I work on, and what I learn.',
  },
  contact: {
    description: 'Get in touch with Alex Morgan, Astro developer in Amsterdam.',
    /** The page title; the accent word is set in the accent colour. */
    title: 'Let’s talk Astro',
    accent: 'Astro',
    blurb: 'A new website, a redesign or a question about Astro? Send me a message, and I’ll get back to you.',
  },
};

/** The sign-off above the footer on most pages. */
export const signOff = {
  title: ['Let’s talk', 'Astro.'],
  text: 'A new website, a redesign or a question about Astro? Send me a message.',
  contactLabel: 'Start a conversation',
  /** Shown only when site.config.ts has a WhatsApp link. */
  whatsappLabel: 'WhatsApp me',
};

/** The signup under every post. `show: false` removes it. */
export const newsletter = {
  show: true,
  title: 'New posts by email',
  text: 'Get an email when I publish a new post about Astro, design or web performance.',
};

/** The line beside the copyright in the footer. */
export const footer = {
  tagline: 'Building beautiful & fast websites',
};
