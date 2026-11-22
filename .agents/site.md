# Site brief

Status: built

## Business

A personal portfolio and blog for an independent designer and front-end developer. (Discipline is an assumption; see Assumptions.)

## Audience

Founders, product teams and agencies looking to hire a designer-developer for a project; peers reading the writing.

## Primary action

Get in touch (header CTA "Let's talk" → /contact; every CTA band points there).

## Voice

Calm, direct, specific. First person, plain words, no buzzwords or hype.

## Brand

- Site name: placeholder ("Your Name" in `site.config.ts`)
- Logo: neutral monogram (slash and dot in a rounded square) in `src/assets/branding/`; replace with your own
- Brand colour: green, `--brand-hue: 165` (themeColor `#008B4F`); light-mode steps darkened for AA contrast in `src/styles/theme.css`
- Fonts: Velocity defaults (Manrope body, Outfit display, JetBrains Mono for eyebrows and meta)

## Design

Editorial and quiet: big display headline, lots of white space, large project covers, mono-type meta labels, pill buttons. Light and dark both supported.

## Languages

en

## Sitemap

- Home `/` → hero with availability + portrait, selected work (featured projects), what I do (FeatureGrid), how I work (Steps), recent writing, CTA → built, needs content
- Work `/work` → all case studies → built
- Case study `/work/<slug>` → hero with client/year/role, cover, MDX body, next project, CTA → built, needs content (4 templates)
- About `/about` → hero, intro split with portrait, path (Timeline), principles (FeatureGrid), CTA → built, needs content
- Writing `/blog` → Velocity blog, relabelled "Writing" → built (2 sample posts)
- Contact `/contact` → ContactSection with email, location, profile link → built, form not connected
- Search `/search`, 404 → Velocity defaults

## Facts

None supplied yet.

## Placeholders

- Everywhere: site name and author "Your Name", email `hello@example.com` (`src/config/site.config.ts`); `SITE_URL` unset
- Home: availability badge, your name in the intro, portrait photo (`src/assets/photos/portrait.*`)
- Work: all four case studies in `src/content/projects/en/` (name, summary, client, year, cover alt, body) and their covers (`src/assets/photos/project-one.*` … `project-four.*`)
- About: bio paragraph, three timeline entries (year, role, line), portrait (`src/assets/photos/about.*`)
- Contact: location, profile link
- Writing: both posts are samples with author "Your Name"; rewrite or delete them

## Assumptions

- Discipline: designer + front-end developer, and the four services on the home page
- The process steps (Listen, Shape, Build, Hand over) and the "two working days" reply promise
- English only; green brand; Velocity's default fonts
- The two blog posts are sample essays, not the owner's published writing

## Decisions log

- 2026-11-22: Rebuilt swm26 from a fresh Velocity 2.7.3 scaffold (minimal, English, all components), replacing the old Southwell Media site.
- 2026-11-22: Added `projects` collection (`src/config/collections.ts`, `src/lib/projects.ts`) served at /work.
- 2026-11-22: Menu label uses a new `nav.writing` key rather than overriding `nav.blog` (a starter unit test pins `nav.blog`).
- 2026-11-22: Light-mode brand-500/600/700 darkened and brand fills set to white ink, since green at default lightness failed axe contrast.
- 2026-11-22: Updated the contact form E2E test's expected success text to this site's copy; added `tests/e2e/projects.spec.ts` for case-study pages.
