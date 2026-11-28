# Astro Orbit: guide for AI assistants

This file is for AI coding assistants (Claude Code, Codex, Cursor, Copilot, Gemini and others) working on a site built with Astro Orbit. It says where things are and which rules keep a change in line with the theme. `CLAUDE.md` points here.

Astro Orbit is a free portfolio and blog theme for Astro, made by Hans Martens and based on SWM26 by Southwell Media, which is built on Velocity. It has a 3D droplet in the homepage hero, full-screen heroes on the other pages, a project grid, a blog, an About page and a contact form, in English, Spanish, French and Dutch. It opens in dark mode, and visitors can switch to light.

## Stack

Astro 7 · Tailwind CSS 4 · TypeScript (strict) · three.js · MDX · Pagefind · Vercel adapter · Node 22.23.4 or later · pnpm 10

## Commands

| Command | What it does |
|---------|--------------|
| `pnpm dev` | Dev server at http://localhost:4321 |
| `pnpm build` | Static build, then the Pagefind search index |
| `pnpm preview` | Serves the build. Search only works here |
| `pnpm check` | Astro and TypeScript diagnostics |
| `pnpm lint` | ESLint |
| `pnpm test` | Unit tests in `tests/`: the dictionaries, dates, post folders, the newsletter link |
| `pnpm validate` | Lint, check and build |

Before you say a change is done, run `pnpm lint`, `pnpm check`, `pnpm test` and `pnpm build`; all must pass. For a visual change, look at the page on a desktop and a phone width, in dark and in light mode.

## Where things live

| Path | What it holds |
|------|---------------|
| `src/config/theme.config.ts` | The owner's texts and choices: `language`, `brandColor`, `darkOnly`, `home`, `about`, `pages`, `signOff`, `newsletter`, `footer`. Components read from it. |
| `src/config/site.config.ts` | The owner's name, mark, email, location, WhatsApp link, social links and the site's description. |
| `src/config/nav.config.ts`, `footer.config.ts` | The menu and the footer's columns. |
| `src/config/services.config.ts` | Four service cards for the homepage; `show: false` in the demo. |
| `src/i18n/` | The theme's own words: one dictionary per language (`en.ts`, `es.ts`, `fr.ts`, `nl.ts`) and the privacy page per language in `privacy/`. `index.ts` has `t`, `lang`, `formatDate`, `upper`, `readingMinutes` and Velocity's `useTranslations`/`getLocale`. |
| `src/content/blog/<language>/` | Blog posts (`.md` or `.mdx`), in the folder of the site's language. |
| `src/content/work/` | Projects, one file each; pictures in `src/assets/work/`. |
| `src/content/authors/` | Authors. |
| `src/content.config.ts` | The fields posts and projects can have, with comments. |
| `src/lib/posts.ts` | `postSlug`, `postLanguage`, `inSiteLanguage`: posts per language folder. |
| `src/lib/brand.ts` | The brand colour's shades and the contrast-checked roles. |
| `src/lib/post-tone.ts` | A post's colour by category: Performance is emerald. |
| `src/lib/og.ts` | Share images and blog covers, made at build time. |
| `src/components/sections/` | Homepage and page sections: Hero, Reel, WorkGrid, FeaturedPosts, Services, StackMarquee, Cta (the sign-off). |
| `src/components/site/` | Nav, Footer, `CinemaHero` (the hero of About, contact, projects, blog and posts), StatementCard (the droplet's card), the hero scene, buttons. |
| `src/components/blog/` | The post hero, post cards, related posts, table of contents, newsletter signup. |
| `src/components/ui/`, `src/components/patterns/` | Velocity's design-system components, listed in `component-registry.json`. |
| `src/pages/projects/[...slug].astro` | The project page: its hero, the sections, the next project (`split` or `cinema`). |
| `src/scripts/hero-scene.ts` | The 3D scene in the hero (three.js). |
| `src/scripts/reel/` | The droplet's journey down the homepage and its card. |
| `src/scripts/motion/` | Reveals, the hero entrance, the heroes' unveil (`case.ts`). |
| `src/scripts/gpu.ts` | Decides whether the 3D scenes may run. |
| `src/styles/themes/southwell.css` | Colour and type tokens, light and dark. |
| `src/pages/api/contact.ts`, `src/pages/api/newsletter.ts` | The contact form and the newsletter signup (Resend). |

## Rules

### Text

- Text the visitor reads that is about the owner belongs in `theme.config.ts` or `site.config.ts`, a post or a project, not in a component. If a component needs new text of that kind, add a setting for it, with a comment that says what it is.
- In the longer texts in `theme.config.ts`, `[text](url)` becomes a link and `**text**` bold (`lib/rich.ts`).

### Language

- The theme's own words (labels, buttons, messages, aria labels) come from the dictionary: `import { t } from '@/i18n'`, then `{t.blog.readPost}`. Never write such text in a component. A new label goes in `src/i18n/en.ts` and in every other dictionary; `pnpm test` fails when one is missing a line.
- Text in capitals: `upper(text)` from `@/i18n`, not `.toUpperCase()`. Dates: `formatDate`. Reading time: `readingMinutes`.
- Text a client script writes goes into the page as a `data-` attribute, filled from the dictionary, and the script reads it there.
- A post's language is its folder, and its address leaves the folder out: use `postSlug` and `inSiteLanguage` from `@/lib/posts`.
- The privacy page's text is in `src/i18n/privacy/<language>.astro`; a change to what it says goes in each language's file.
- Velocity's components ask for their labels with `useTranslations(getLocale(Astro))`; those labels are in the `ui` section of each dictionary. Don't change the components to fit Orbit; add the label to `ui` in every language.

### Colour

- Never write a colour code for the brand colour in a component or a stylesheet. Use the shades from `lib/brand.ts`, `var(--orbit-50)` to `var(--orbit-950)`, and for text and surfaces the roles, which keep their contrast in both modes whatever brand colour the owner picks: `--orbit-text`, `--orbit-on-dark`, `--orbit-on-ink`, `--orbit-mark-dark`, `--orbit-fill`, `--orbit-fill-hover`, `--orbit-card-1` to `--orbit-card-4`.
- A new use of the brand colour needs a role chosen by contrast (WCAG: 4.5:1 for text, 3:1 for large text and lines), not a fixed shade.
- Greys and page backgrounds come from the tokens in `southwell.css`. Sections below a hero take turns on `--background` and `--background-secondary` (the zebra).

### Dark and light mode

- Dark is the default. With `darkOnly = true` there is no light mode and no switch. Every change has to work in both modes. Dark-mode styles go under `.dark` (in a component: `:global(.dark) .thing`).

### The 3D hero and the droplet

- The scene only runs on a device with a graphics chip (`scripts/gpu.ts`). Without one, and in Lighthouse, the hero shows a still picture, and three.js isn't downloaded. Keep that check.
- With `prefers-reduced-motion`, the scene shows one still pose and the droplet doesn't travel. Keep that too.
- The stills are `src/assets/hero-poster*.png`. If the scene's look changes, they need to be captured again.
- Import three.js only in the scene scripts, which load on demand.

### Accessibility

- Every picture gets an `alt` that says what's in it; decorative pictures get `alt=""`.
- One `h1` per page, headings in order, visible keyboard focus on everything that can be clicked.
- Decorative text, such as the faint mark behind the sign-off, is drawn with CSS so contrast checks don't count it.

### Pages and structure

- Pages are static. Only `src/pages/api/contact.ts` and `src/pages/api/newsletter.ts` run on the server (`prerender = false`). Don't add `output: 'server'`.
- The newsletter is double opt-in: an address goes on the list only after its owner clicks the link in the confirmation email. Keep it that way, and keep the privacy pages in step with what the endpoint does.
- Pictures go through `astro:assets` from `src/assets/`, not as plain `<img>` from `public/`.
- In the content schema, `z` comes from `astro/zod`. Imports use the `@/` alias for `src/`.

### Keep

- The credit to Southwell Media and Velocity in the README and the licence.

### Don't

- Don't use Velocity's own tools to update the theme (`create-velocity-astro upgrade`): it would undo Orbit's changes.
