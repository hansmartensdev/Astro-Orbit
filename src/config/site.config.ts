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

}

const siteConfig: SiteConfig = {
  // Demo details: the fictive designer Alex Morgan. Put your own here.
  name: 'Alex Morgan',
  description:
    'Alex Morgan is an Astro developer in Amsterdam, the Netherlands, building fast & beautiful websites.',
  url: SITE_URL || 'https://orbit.hansmartens.dev',
  ogImage: '/og-default.png',
  author: 'Alex Morgan',
  email: 'hello@example.com',
  phoneHref: '',
  // A wa.me link (https://wa.me/<number>) shows a WhatsApp button on the
  // contact page, in the sign-off and in the footer; empty hides them.
  whatsapp: '',
  location: 'Amsterdam, the Netherlands',
  mark: 'am/',
  // TODO: add the street address to promote Organization schema to
  // LocalBusiness. Deliberately absent rather than guessed — a wrong postal
  // address in structured data is worse than none at all.
  // Feeds Organization.sameAs in the JSON-LD.
  socialLinks: ['https://www.linkedin.com/', 'https://github.com/'],
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
    bing: BING_SITE_VERIFICATION,
  },
  branding: {
    logo: {
      alt: 'Alex Morgan',
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
