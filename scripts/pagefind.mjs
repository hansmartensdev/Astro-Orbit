/**
 * The blog's search index (Pagefind), built after `astro build`.
 *
 * With the Vercel adapter, Vercel publishes .vercel/output/static, not
 * dist/client, so an index made only in dist/client never went live and
 * the search field stayed hidden. The index is built from dist/client and
 * copied into every output folder that exists.
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync } from 'node:fs';

const source = 'dist/client';
execFileSync('pagefind', ['--site', source, '--glob', 'blog/**/*.html'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

for (const target of ['.vercel/output/static']) {
  if (existsSync(target)) {
    cpSync(`${source}/pagefind`, `${target}/pagefind`, { recursive: true });
    // eslint-disable-next-line no-console -- build output, as pagefind's own
    console.log(`[pagefind] index copied to ${target}/pagefind`);
  }
}
