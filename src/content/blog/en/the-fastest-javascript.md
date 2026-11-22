---
title: "The fastest JavaScript is the JavaScript you don't send"
description: "A practical way to decide when a page needs client-side code, and what to reach for instead."
publishedAt: 2026-10-14
author: "Your Name"
tags: ["front-end", "performance"]
locale: en
---

A lot of the speed work I do comes down to one question for each interactive thing on a page: does this need JavaScript at all?

Often it doesn't. The platform has quietly absorbed a lot of what we used to write scripts for.

## Reach for the platform first

- **Disclosure and accordions:** `<details>` and `<summary>` open, close and work with a keyboard, with no script.
- **Modals and side panels:** `<dialog>` with `showModal()` gives you focus containment, Escape to close and a backdrop for free.
- **Menus and tooltips:** the `popover` attribute handles top-layer stacking and light dismiss.
- **Page transitions:** cross-document view transitions animate between ordinary page loads with a few lines of CSS.

## When you do need it, ship it late and small

Some things genuinely need code: a live search, a form that validates as you type, a chart you can explore. For those, I load a small island only where it's used, and only when it's about to be seen. The rest of the page stays plain HTML.

## The payoff

Pages that render on the first response, work before scripts load, and stay fast on a five-year-old phone on a train. The users never notice, and that's the point.
