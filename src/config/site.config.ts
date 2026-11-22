import { SITE_URL, GOOGLE_SITE_VERIFICATION, BING_SITE_VERIFICATION } from 'astro:env/server';

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  author: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  socialLinks: string[];
  twitter?: {
    site: string;
    creator: string;
  };
  verification?: {
    google?: string;
    bing?: string;
  };
  /**
   * Branding configuration
   * Logo files: Replace SVGs in src/assets/branding/
   * Favicon: Replace in public/favicon.svg
   */
  branding: {
    /** Logo alt text for accessibility */
    logo: {
      alt: string;
    };
    /** Favicon path (lives in public/) */
    favicon: {
      svg: string;
    };
    /** Theme colors for manifest and browser UI */
    colors: {
      /** Browser toolbar color (hex) */
      themeColor: string;
      /** PWA splash screen background (hex) */
      backgroundColor: string;
    };
  };
  /** Human-readable location — used in the footer and on the contact page. */
  location: string;
  /** Phone in dialable form, for tel: links. */
  phoneHref: string;
  /** WhatsApp chat link (wa.me). Offered instead of a phone call: messages
   *  arrive from everywhere, and nobody is expected to ring. */
  whatsapp: string;
  /** The two-character wordmark the whole identity leans on. */
  mark: string;
  /**
   * A booking page (Calendly, Cal.com…) for the "Book a meeting" button.
   * Unset, the button keeps its place and look but links nowhere.
   */
  bookingUrl?: string;
}

const siteConfig: SiteConfig = {
  name: 'Hans Martens',
  description:
    'Hans Martens is an Astro developer based in Veghel, the Netherlands, building fast & beautiful websites.',
  url: SITE_URL || 'https://hansmartens.dev',
  ogImage: '/og-default.png',
  author: 'Hans Martens',
  email: 'hello@hansmartens.dev',
  phone: '+31 6 5188 8008',
  phoneHref: '+31651888008',
  whatsapp: 'https://wa.me/31651888008',
  location: 'Veghel, the Netherlands',
  mark: 'hm/',
  // bookingUrl: 'https://…', — set this to link the "Book a meeting" button.
  // TODO: add the street address to promote Organization schema to
  // LocalBusiness. Deliberately absent rather than guessed — a wrong postal
  // address in structured data is worse than none at all.
  // Feeds Organization.sameAs in the JSON-LD.
  socialLinks: ['https://www.linkedin.com/in/hansmartensdev/', 'https://github.com/hansmartensdev'],
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
    bing: BING_SITE_VERIFICATION,
  },
  branding: {
    logo: {
      alt: 'Hans Martens',
    },
    favicon: {
      svg: '/favicon.svg',
    },
    colors: {
      // Ice — the page ground, so browser chrome matches the site.
      themeColor: '#eef2f4',
      backgroundColor: '#eef2f4',
    },
  },
};

export default siteConfig;
