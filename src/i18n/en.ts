/**
 * English: the theme's own words (labels, buttons, messages, screen-reader
 * labels). The other dictionaries copy this file's shape; `pnpm test`
 * fails when one misses a line. The owner's own texts are in
 * config/theme.config.ts, not here.
 *
 * A function takes the values that go into the sentence, so each language
 * can put them where its grammar wants them.
 */
const en = {
  /** The name of the language, in itself. */
  name: 'English',

  nav: {
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    blog: 'Blog',
    contact: 'Contact',
    main: 'Main',
    menu: 'Menu',
    close: 'Close',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    homeLabel: 'Home',
    skip: 'Skip to content',
    backToTop: 'Back to top',
    toLight: 'Switch to light mode',
    toDark: 'Switch to dark mode',
    breadcrumb: 'Breadcrumb',
  },

  footer: {
    label: 'Footer',
    menu: 'Menu',
    social: 'Social',
    sayHi: 'Say hi',
    privacy: 'Privacy',
    /** The large mark's screen-reader label. */
    home: (mark: string, name: string) => `${mark} ${name}, home`,
    rss: (name: string) => `RSS feed of ${name}`,
  },

  home: {
    scroll: 'Scroll',
    allPosts: 'All posts',
  },

  hero: {
    about: 'About',
    contact: 'Contact',
    projects: 'Projects',
    blog: 'Blog',
    aboutFacts: 'About me in short',
    contactFacts: 'Other ways to reach me',
    projectFacts: 'The project in short',
    projectsFacts: 'The projects',
    blogFacts: 'The blog in short',
    postFacts: 'Post details',
  },

  blog: {
    title: 'Blog',
    readPost: 'Read the post',
    related: 'Related posts',
    back: 'Back to Blog',
    minRead: (n: number) => `${n} min read`,
    writtenBy: 'Written by',
    published: 'Published',
    updated: 'Updated',
    readingTime: 'Reading time',
    category: 'Category',
    posts: 'Posts',
    categories: 'Categories',
    latest: 'Latest',
    follow: 'Follow',
    rssFeed: 'RSS feed',
    all: 'All',
    filter: 'Filter by category',
    search: 'Search',
    searchLabel: 'Search the blog',
    noMatches: 'No matches.',
    untitled: 'Untitled',
    nothingYet: 'Nothing published yet.',
    toc: 'On this page',
    tocToggle: 'Table of contents',
    show: 'Show',
    hide: 'Hide',
    share: 'Share:',
    copyLink: 'Copy link',
    copied: 'Link copied',
    shareOn: (network: string) => `Share on ${network}`,
  },

  projects: {
    title: 'Projects',
    view: 'View project',
    next: 'Next project',
    seeAll: (n: number) => `See all ${n} projects`,
    seeProject: (title: string) => `View project: ${title}`,
    details: 'Project details',
    client: 'Client',
    year: 'Year',
    discipline: 'Discipline',
    services: 'Services',
    why: 'Why I built it',
    what: 'What I built',
    stack: 'Stack',
    shipped: 'Shipped',
    visit: 'Visit the site',
    github: 'View on GitHub',
  },

  contact: {
    title: 'Contact',
    label: 'Send a message',
    email: 'Email',
    whatsapp: 'WhatsApp',
    whatsappValue: 'Send a message',
    basedIn: 'Based in',
    name: 'Your name',
    emailAddress: 'Email address',
    subject: 'Subject',
    message: 'Message',
    placeholder: 'Your idea, your question, or just hello.',
    send: 'Send message',
    sending: 'Sending…',
    sent: "Message sent. I'll get back to you by email.",
    error: 'Something went wrong',
    failed: 'Failed to send message. Please try again later.',
    nameShort: 'Name must be at least 2 characters',
    messageShort: 'Message must be at least 10 characters',
    unexpected: 'An unexpected error occurred',
  },

  newsletter: {
    email: 'Email address',
    placeholder: 'you@example.com',
    subscribe: 'Subscribe',
    sending: 'Sending…',
    sent: 'Almost done: check your inbox and click the link in the email to confirm.',
    failed: 'Something went wrong. Please try again later.',
    note: 'You can unsubscribe at any time.',
    privacy: 'Privacy',
    confirmTitle: 'Confirm your subscription',
    confirmText: 'Click the button to confirm that you want new posts by email.',
    confirm: 'Confirm',
    confirming: 'Confirming…',
    done: 'Subscription confirmed',
    doneText: "Thanks. You'll get an email when a new post is published.",
    expired: "This link has expired or isn't valid. Subscribe again under any post to get a new link.",
    back: 'To the blog',
    metaDescription: 'Confirm your subscription to new posts by email.',
    invalid: 'Please enter a valid email address',
    /** The confirmation email. */
    mailSubject: (site: string) => `Confirm your subscription to ${site}`,
    mailIntro: (site: string) => `Please confirm that you want an email from ${site} when a new post is published.`,
    mailButton: 'Confirm my subscription',
    mailIgnore: "Didn't ask for this? Then ignore this email: your address won't be added.",
  },

  notFound: {
    title: 'Page not found',
    description: 'That page has either moved, been deleted, or never existed.',
    lead: 'Nothing',
    leadAccent: 'here.',
    text: 'That page has either moved, been deleted, or never existed in the first place.',
    home: 'Back to home',
    projects: 'See my projects',
  },

  privacy: {
    title: 'Privacy',
    description: 'What this website does with your personal data: the contact form, hosting, and your rights under the GDPR.',
    blurb: 'What this website does with your personal data, and the rights you have under the GDPR.',
    updated: (date: string) => `Last updated ${date}`,
  },

  /** The labels inside Velocity's components (src/components/ui), read with
   *  useTranslations(getLocale(Astro)). {name} is filled in by them. */
  ui: {
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
  },
};

export default en;

/** The shape every language follows: the same lines, its own words. */
export type Dictionary = typeof en extends infer T ? Widen<T> : never;

type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => string
    ? (...args: A) => string
    : { [K in keyof T]: Widen<T[K]> };
