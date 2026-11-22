/**
 * Site copy — English (default locale).
 *
 * This file is yours: upgrades never overwrite it. Put page copy here and use
 * it with `const t = useTranslations(locale); t('home.hero.title')`.
 * Any key from src/i18n/ui.ts can also be overridden here.
 *
 * Anything marked as a placeholder is a fact only you can supply.
 * `pnpm check:agent` lists every one that is left.
 */
const en = {
  site: {
    tagline: 'Independent designer and front-end developer.',
  },

  nav: {
    work: 'Work',
    about: 'About',
    writing: 'Writing',
    contact: 'Contact',
    cta: "Let's talk",
  },

  // Overrides for Velocity's blog strings, so the blog reads as "Writing".
  blog: {
    title: 'Writing',
    description: 'Notes on design, front-end craft and running a one-person practice.',
    allPosts: 'All writing',
    subscribeTitle: 'New writing, now and then',
    subscribeText: 'An email when something new goes up. No schedule, no tracking, unsubscribe in one click.',
  },

  meta: {
    home: {
      title: 'Designer and front-end developer',
      description:
        'Independent designer and front-end developer. I design and build calm, fast websites and product interfaces, from first sketch to shipped code.',
    },
  },

  home: {
    hero: {
      status: '[[placeholder: availability, e.g. Booking projects from March]]',
      title: 'I design and build',
      titleHighlight: 'calm, fast software for the web.',
      lead: "I'm [[placeholder: your name]], an independent designer and front-end developer. I take products from a rough idea to a shipped, accessible interface, and I do both the design and the code.",
      primary: 'See selected work',
      secondary: 'Get in touch',
      portrait: 'Portrait of me',
    },
    work: {
      eyebrow: 'Selected work',
      title: 'A few things I have made',
      lead: 'Each project has a short write-up: the problem, what I did, and what changed.',
      all: 'All projects',
    },
    services: {
      eyebrow: 'What I do',
      title: 'Design and code, in one pair of hands',
      lead: 'No hand-off between a designer and a developer, because there is only one of me. Fewer meetings, and the details survive.',
      product: {
        title: 'Product design',
        body: 'Flows, interfaces and prototypes, tested with real people before anything is built.',
      },
      frontend: {
        title: 'Front-end engineering',
        body: 'Fast, accessible interfaces in modern HTML, CSS and TypeScript, with Astro or React where it fits.',
      },
      systems: {
        title: 'Design systems',
        body: 'Tokens, components and documentation your team can keep using long after I have gone.',
      },
      sites: {
        title: 'Websites',
        body: 'Marketing sites and portfolios that load instantly, rank well and are easy to edit.',
      },
    },
    process: {
      eyebrow: 'How I work',
      title: 'Small steps, shown early',
      listen: {
        title: 'Listen',
        body: 'A call about what you are trying to change, who it is for, and what done looks like.',
      },
      shape: {
        title: 'Shape',
        body: 'Sketches and a clickable prototype within the first week or two, so we argue about something real.',
      },
      build: {
        title: 'Build',
        body: 'Production code in short cycles, on a preview link you can open at any time.',
      },
      handover: {
        title: 'Hand over',
        body: 'Documentation, a walkthrough and a codebase your team can own.',
      },
    },
    writing: {
      eyebrow: 'Writing',
      title: 'Recent notes',
      all: 'All writing',
    },
    cta: {
      title: 'Have something in mind?',
      lead: 'Tell me what you are working on. I reply to every message, usually within two working days.',
      button: 'Start a conversation',
    },
  },

  workPage: {
    eyebrow: 'Work',
    title: 'Selected work',
    description: 'Case studies from recent projects: product design, front-end builds and design systems.',
    empty: 'No case studies yet.',
    emptyHint: 'Add one in src/content/projects/en/.',
    visit: 'Visit the live project',
    client: 'Client',
    year: 'Year',
    role: 'Role',
    next: 'Next project',
    back: 'All work',
    cta: {
      title: 'Want something like this?',
      lead: 'I take on a small number of projects at a time, so each one gets my full attention.',
      button: 'Get in touch',
    },
  },

  aboutPage: {
    eyebrow: 'About',
    title: 'Hi, I make things for the web.',
    description: 'Who I am, how I got here, and what I care about when I design and build.',
    intro: {
      eyebrow: 'The short version',
      title: 'Designer by training, developer by stubbornness',
      lead: '[[placeholder: two or three sentences about you: where you are based, how long you have been doing this, and what kind of work you love most]]',
      points: {
        one: 'Design and front-end under one roof',
        two: 'Accessibility and performance from day one',
        three: 'Clear writing, honest estimates',
      },
      portrait: 'Portrait of me at work',
    },
    path: {
      eyebrow: 'Path',
      title: 'How I got here',
      now: {
        date: '[[placeholder: year]]',
        title: '[[placeholder: most recent role or milestone]]',
        body: '[[placeholder: one line about it]]',
      },
      before: {
        date: '[[placeholder: year]]',
        title: '[[placeholder: earlier role]]',
        body: '[[placeholder: one line about it]]',
      },
      start: {
        date: '[[placeholder: year]]',
        title: '[[placeholder: where it started]]',
        body: '[[placeholder: one line about it]]',
      },
    },
    values: {
      eyebrow: 'What I care about',
      title: 'Principles I bring to every project',
      fast: {
        title: 'Fast is a feature',
        body: 'Pages that load before you notice. Most of my sites ship no JavaScript until something needs it.',
      },
      everyone: {
        title: 'Built for everyone',
        body: 'Keyboard, screen reader, slow phone, bright sunlight. If it does not work for someone, it is not done.',
      },
      plain: {
        title: 'Plain words',
        body: 'Interfaces, documentation and emails a busy person understands on the first read.',
      },
      lasting: {
        title: 'Made to last',
        body: 'Boring, well-documented technology that your team can maintain without me.',
      },
    },
    cta: {
      title: 'Want to work together?',
      lead: 'I am happy to talk through an idea, even if it is still rough.',
      button: 'Say hello',
    },
  },

  contactPage: {
    eyebrow: 'Contact',
    title: "Let's talk",
    description: 'Tell me about your project. I reply to every message, usually within two working days.',
    formTitle: 'Tell me about your project',
    formLead: 'A few sentences is plenty: what you are making, who it is for, and roughly when you need it.',
    details: {
      email: 'Email',
      location: 'Based in',
      locationValue: '[[placeholder: city, country]]',
      elsewhere: 'Elsewhere',
      elsewhereValue: '[[placeholder: a profile link, e.g. LinkedIn or GitHub]]',
    },
    submit: 'Send message',
    success: 'Thanks, your message is on its way. I will reply within two working days.',
  },
};

export type SiteStrings = typeof en;
export default en;
