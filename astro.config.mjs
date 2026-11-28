import { defineConfig, envField } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import { readdirSync, readFileSync } from 'node:fs';

// Projects still on a placeholder (no picture of their own yet) stay out of
// the sitemap, and their pages carry noindex ([...slug].astro), so search
// engines and AI assistants index only real projects.
const placeholderProjects = readdirSync('./src/content/work')
  .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
  .filter((file) => !/^(pageHero|feature|cover):/m.test(readFileSync(`./src/content/work/${file}`, 'utf8')))
  .map((file) => `/projects/${file.replace(/\.mdx?$/, '')}/`);

export default defineConfig({
  site: process.env.SITE_URL || 'https://orbit.hansmartens.dev',

  // Old addresses keep working: the about page used to be the studio page,
  // and the projects used to live under /work.
  redirects: {
    '/studio': '/about',
    '/work': '/projects',
    '/work/[...slug]': '/projects/[...slug]',
  },

  // Static by default; only /api/contact opts out (prerender = false) so the
  // chat sheet and the contact page have somewhere to send to. The adapter
  // turns that one route into a Vercel function and leaves the rest as files.
  adapter: vercel(),

  // Every page's CSS goes into the page itself (about 33 KiB, compressed far
  // smaller). Five separate stylesheets were blocking the first paint for
  // 450-600ms each on a phone; inline, the page can paint as soon as the
  // HTML arrives.
  build: {
    inlineStylesheets: 'always',
  },

  env: {
    schema: {
      SITE_URL: envField.string({ context: 'server', access: 'public', optional: true }),
      // The contact endpoint mails through Resend. Without the key, dev logs
      // the message and accepts it; production refuses it.
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO: envField.string({
        context: 'server',
        access: 'public',
        optional: true,
        default: 'hello@example.com',
      }),
      // A sender on a domain verified in Resend.
      CONTACT_FROM: envField.string({
        context: 'server',
        access: 'public',
        optional: true,
        default: 'Alex Morgan <hello@example.com>',
      }),
      PUBLIC_GA_MEASUREMENT_ID: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      PUBLIC_GTM_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      CONTACT_FORM_ENDPOINT: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      NEWSLETTER_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      // The newsletter (/api/newsletter) uses RESEND_API_KEY and CONTACT_FROM
      // too. Confirmed subscribers go into this Resend segment, the list
      // its broadcasts are sent to.
      NEWSLETTER_SEGMENT_ID: envField.string({ context: 'server', access: 'public', optional: true }),
      GOOGLE_SITE_VERIFICATION: envField.string({
        context: 'server',
        access: 'public',
        optional: true,
      }),
      BING_SITE_VERIFICATION: envField.string({
        context: 'server',
        access: 'public',
        optional: true,
      }),
      PUBLIC_GOOGLE_MAPS_API_KEY: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: '',
      }),
      PUBLIC_CONSENT_ENABLED: envField.boolean({
        context: 'client',
        access: 'public',
        optional: true,
        default: false,
      }),
      PUBLIC_PRIVACY_POLICY_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
        default: '',
      }),
    },
  },

  image: {
    layout: 'constrained',
  },

  // ClientRouter swaps pages client-side; without prefetch every swap is a
  // cold fetch while the old page stays painted. Prefetch on hover by default,
  // for every internal link.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  integrations: [
    react(),
    mdx(),
    sitemap({ filter: (page) => !placeholderProjects.some((path) => page.endsWith(path)) }),
    // Iconify sets, inlined as SVG at build time - only the icons actually
    // referenced end up in the output, and none of it ships JavaScript.
    // Lucide for UI glyphs; Font Awesome brands for real logos (LinkedIn,
    // GitHub), which Lucide only approximates; Font Awesome solid for the
    // handset in the nav.
    icon({
      include: {
        lucide: ['*'],
        'fa6-brands': ['linkedin-in', 'github', 'whatsapp'],
        // The arrows, envelope and pin in the menu; the chat bubble in the
        // sign-off's first button (WhatsApp, its second, is a brand mark).
        'fa6-solid': ['arrow-right-long', 'envelope', 'location-dot', 'comment'],
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  security: {
    checkOrigin: true,
  },

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
