/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

// Astro's own Vite setup, so tests resolve the @/ alias like the site does.
export default getViteConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
