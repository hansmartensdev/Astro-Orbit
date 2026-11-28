import { t, upper } from '@/i18n';
/**
 * Footer link columns
 *
 * The designed footer is three labelled columns, not Velocity's generic
 * social-icon row — so it carries its own list rather than reusing
 * nav.config.ts, which only describes the overlay menu.
 */
import siteConfig from './site.config';

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  /** Iconify icon name with its set prefix, e.g. `lucide:mail` or
   *  `fa6-brands:github`. Brand marks use fa6-brands; UI glyphs use lucide. */
  icon?: string;
}

export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

export const footerColumns: FooterColumn[] = [
  {
    heading: upper(t.footer.menu),
    links: [
      { label: t.nav.home, href: '/' },
      { label: t.nav.about, href: '/about' },
      { label: t.nav.projects, href: '/projects' },
      { label: t.nav.blog, href: '/blog' },
      { label: t.nav.contact, href: '/contact' },
    ],
  },
  {
    heading: upper(t.footer.social),
    links: [
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/',
        external: true,
        icon: 'fa6-brands:linkedin-in',
      },
      {
        label: 'GitHub',
        href: 'https://github.com/',
        external: true,
        icon: 'fa6-brands:github',
      },
    ],
  },
  {
    heading: upper(t.footer.sayHi),
    links: [
      { label: siteConfig.email, href: `mailto:${siteConfig.email}`, icon: 'lucide:mail' },
      { label: 'WhatsApp', href: siteConfig.whatsapp, external: true, icon: 'fa6-brands:whatsapp' },
    ].filter((link) => link.href),
  },
];
