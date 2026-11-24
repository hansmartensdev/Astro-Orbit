import type {
  WebSite,
  Person,
  BlogPosting,
  BreadcrumbList,
  FAQPage,
  WithContext,
} from 'schema-dts';
import siteConfig from '@/config/site.config';

/**
 * Create WebSite schema for homepage. No SearchAction: the site has no
 * search page, and a SearchAction pointing at one that doesn't exist is
 * a broken promise to search engines.
 */
export function createWebsiteSchema(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: { '@id': `${siteConfig.url}/#person` },
  };
}

/**
 * Create Person schema: who the site is by, for search engines and AI
 * assistants. Facts only, all from the site config and the site itself:
 * the name, that he is an Astro developer, the town and country (no street
 * address, which the config doesn't hold), the email and the profiles.
 */
export function createPersonSchema(): WithContext<Person> {
  const [locality, country] = siteConfig.location.split(',').map((part) => part.trim());
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteConfig.url}/#person`,
    name: siteConfig.name,
    url: siteConfig.url,
    jobTitle: 'Astro developer',
    description: siteConfig.description,
    email: `mailto:${siteConfig.email}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: locality,
      ...(country ? { addressCountry: country.replace(/^the /i, '') } : {}),
    },
    knowsAbout: ['Astro', 'Web design', 'Web development', 'Web performance'],
    sameAs: siteConfig.socialLinks,
  };
}

/**
 * Create BlogPosting schema for blog posts
 */
export function createBlogPostSchema(post: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: Date;
  dateModified?: Date;
  author: { name: string; url?: string };
}): WithContext<BlogPosting> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: post.url,
    image: post.image,
    datePublished: post.datePublished.toISOString(),
    dateModified: post.dateModified?.toISOString() || post.datePublished.toISOString(),
    // A personal site: the author is also the publisher, the same Person as
    // the site's own (no organisation, and no logo file to point at).
    author: {
      '@type': 'Person',
      '@id': `${siteConfig.url}/#person`,
      name: post.author.name,
      url: post.author.url ?? siteConfig.url,
    },
    publisher: { '@id': `${siteConfig.url}/#person` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.url,
    },
  };
}

/**
 * Create BreadcrumbList schema
 */
export function createBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Create FAQPage schema
 */
export function createFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
