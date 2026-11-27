import { describe, expect, it } from 'vitest';
import { LINK_LIFETIME, normalizeEmail, signToken, verifyToken } from '@/lib/newsletter';

const SECRET = 're_test_secret';
const NOW = Date.UTC(2026, 10, 27, 12);

describe('newsletter confirmation link', () => {
  it('gives back the address it was made for', async () => {
    const token = await signToken('reader@example.com', SECRET, NOW);
    expect(await verifyToken(token, SECRET, NOW + 1000)).toBe('reader@example.com');
  });

  it('keeps the address in lower case, without spaces', async () => {
    expect(normalizeEmail('  Reader@Example.COM ')).toBe('reader@example.com');
    const token = await signToken('  Reader@Example.COM ', SECRET, NOW);
    expect(await verifyToken(token, SECRET, NOW)).toBe('reader@example.com');
  });

  it('works for three days, and not after', async () => {
    const token = await signToken('reader@example.com', SECRET, NOW);
    expect(await verifyToken(token, SECRET, NOW + LINK_LIFETIME - 1)).toBe('reader@example.com');
    expect(await verifyToken(token, SECRET, NOW + LINK_LIFETIME + 1)).toBeNull();
  });

  it('refuses a link signed with another secret', async () => {
    const token = await signToken('reader@example.com', 'another secret', NOW);
    expect(await verifyToken(token, SECRET, NOW)).toBeNull();
  });

  it('refuses a link with another address put in', async () => {
    const token = await signToken('reader@example.com', SECRET, NOW);
    const [, signature] = token.split('.');
    const forged = btoa(JSON.stringify({ e: 'someone@example.com', x: NOW + LINK_LIFETIME }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    expect(await verifyToken(`${forged}.${signature}`, SECRET, NOW)).toBeNull();
  });

  it('refuses what is not a token', async () => {
    for (const junk of ['', '.', 'abc', 'a.b.c', 'not base64!.x', '%%%.%%%']) {
      expect(await verifyToken(junk, SECRET, NOW)).toBeNull();
    }
  });
});
