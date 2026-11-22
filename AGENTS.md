# Agent Guide

Instructions for AI coding agents (Claude Code, Codex, Cursor, etc.) working in this project.

This project is built on [Velocity](https://github.com/southwellmedia/velocity). Read and follow @.agents/velocity.md before changing code. Velocity upgrades keep that file current, so put your own rules here instead.

Step-by-step skills for common tasks are in `.agents/skills/`: `velocity-start-site` (set up or rebuild the whole site from a brief), `velocity-add-page`, `velocity-add-component`, `velocity-add-content`, `velocity-add-locale`, `velocity-connect-forms` and `velocity-rebrand`. If your tool doesn't load skills automatically, read the matching `SKILL.md` before starting the task.

## Project notes

<!-- This file is yours. Upgrades won't change it. Add project-specific rules here. -->

- This is a personal portfolio + blog. Read `.agents/site.md` (the brief) first.
- Case studies are the `projects` collection (`src/config/collections.ts`), linked only through `src/lib/projects.ts`, at `/work/<slug>`. Covers are MediaSlot photo names in `src/assets/photos/`.
- `src/components/site/ProjectCard.astro` is the project card used on Home and Work.
- The blog is labelled "Writing" via `nav.writing` and `blog.*` overrides in `src/i18n/translations/en.ts`.
