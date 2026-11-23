# hansmartens.dev

The personal website of Hans Martens, an Astro developer in Veghel, the
Netherlands: about, projects, blog and contact.

## Credits

This site is based on the **SWM26** site by [Southwell Media](https://github.com/southwellmedia),
which is built on the [Velocity](https://github.com/southwellmedia/velocity)
Astro starter, also by Southwell Media. Both are published under the MIT licence;
see [LICENSE](LICENSE). The content, the violet brand, the blog, the speed work
and the animation system are by Hans Martens, built with
[Claude Code](https://www.anthropic.com/claude-code).

## Stack

Astro 6 · Tailwind CSS v4 · TypeScript · three.js for the hero and reel
scenes · deployed on Vercel. Node 22.12 or later, pnpm 10.

## Commands

```bash
pnpm install
pnpm dev        # local dev server at http://localhost:4321
pnpm build      # static build, then the Pagefind search index
pnpm preview    # serve the build (the only way to test search locally)
pnpm check      # astro + TypeScript diagnostics
pnpm lint       # eslint
pnpm validate   # lint + check + build
```

## Where things live

```
src/
  config/              site details, navigation, footer, services
  content/blog/en/     blog posts (Markdown)
  content/work/        projects
  components/sections/ homepage and page sections
  components/site/     nav, footer, hero visual and scene, chat sheet
  components/blog/     post header, table of contents, post cover
  lib/og.ts            generated share images and blog covers
  scripts/motion/      the reveal system (one ease-out curve, one movement
                       per card) and the hero entrance
  scripts/reel/        the reel's morph engine
  scripts/gpu.ts       decides whether the WebGL scenes may run
  styles/themes/southwell.css   the theme tokens, violet accent included
```

## Notes

- **Light only for now.** The dark theme stays in `themes/southwell.css` to be
  designed later; the layout removes `.dark` before first paint.
- **Speed.** The WebGL scenes only load and run on a device with a graphics
  chip (`scripts/gpu.ts`). Without one, the hero keeps its still
  (`src/assets/hero-poster.png`) and the reel its static mode. All CSS is
  inlined into each page.
- **Contact form.** `/api/contact` sends mail through Resend and needs
  `RESEND_API_KEY` in the Vercel environment; `CONTACT_TO` and `CONTACT_FROM`
  default to hello@hansmartens.dev.

## Licence

MIT, see [LICENSE](LICENSE). The original code and design are © 2026 Southwell
Media; the changes and content of this site are © 2026 Hans Martens.
