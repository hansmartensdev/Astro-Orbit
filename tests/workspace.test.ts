import { describe, expect, it } from 'vitest';
import { LINK_LIFETIME, SESSION_LIFETIME, normalizeEmail, sign, verify } from '@/lib/workspace/sign';
import { formatLinks, formatSteps, parseLinks, parseSteps } from '@/lib/workspace/model';

const SECRET = 'a-test-secret-that-is-long-enough-to-pass';
const NOW = Date.UTC(2026, 10, 27, 12);
const link = (email = 'person@example.com', x = NOW + LINK_LIFETIME) => sign({ e: email, p: 'link', x, n: 'abc' }, SECRET);

describe('workspace tokens', () => {
  it('gives back the address and nonce of a genuine link', async () => {
    const payload = await verify(await link(), 'link', SECRET, NOW);
    expect(payload?.e).toBe('person@example.com');
    expect(payload?.n).toBe('abc');
  });

  it('stops a link after 15 minutes', async () => {
    const token = await link();
    expect(await verify(token, 'link', SECRET, NOW + LINK_LIFETIME - 1)).not.toBeNull();
    expect(await verify(token, 'link', SECRET, NOW + LINK_LIFETIME + 1)).toBeNull();
  });

  it('refuses a link signed with another secret', async () => {
    const token = await sign({ e: 'person@example.com', p: 'link', x: NOW + LINK_LIFETIME }, 'another-secret-another-secret-xx');
    expect(await verify(token, 'link', SECRET, NOW)).toBeNull();
  });

  it('refuses a link with another address put in', async () => {
    const [, mac] = (await link()).split('.');
    const forged = btoa(JSON.stringify({ e: 'intruder@example.com', p: 'link', x: NOW + LINK_LIFETIME, n: 'abc' }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    expect(await verify(`${forged}.${mac}`, 'link', SECRET, NOW)).toBeNull();
  });

  it("doesn't take a sign-in link as a session, or a session as a link", async () => {
    const session = await sign({ e: 'person@example.com', p: 'session', x: NOW + SESSION_LIFETIME }, SECRET);
    expect(await verify(await link(), 'session', SECRET, NOW)).toBeNull();
    expect(await verify(session, 'link', SECRET, NOW)).toBeNull();
    expect((await verify(session, 'session', SECRET, NOW))?.e).toBe('person@example.com');
  });

  it('refuses rubbish', async () => {
    for (const bad of ['', '.', 'a.b.c', 'not base64!.x', '..']) {
      expect(await verify(bad, 'link', SECRET, NOW)).toBeNull();
    }
  });

  it('compares addresses in lower case, without spaces', () => {
    expect(normalizeEmail('  Person@Example.COM ')).toBe('person@example.com');
  });
});

describe('workspace steps and links', () => {
  it('reads one step a line, and counts an unknown state as next', () => {
    expect(parseSteps('Plan | done | 14 Nov\nBuild | NOW\nLaunch | soon | 20 Dec\n\n')).toEqual([
      { name: 'Plan', state: 'done', date: '14 Nov' },
      { name: 'Build', state: 'now', date: '' },
      { name: 'Launch', state: 'next', date: '20 Dec' },
    ]);
  });

  it('writes the steps back the way they are typed', () => {
    const text = 'Plan | done | 14 Nov\nBuild | now';
    expect(formatSteps(parseSteps(text))).toBe(text);
  });

  it('keeps only http and https links', () => {
    expect(
      parseLinks(
        'Preview | https://preview.example.com | the latest\nBad | javascript:alert(1)\nAlso bad | ftp://x.example\nPlain | http://example.com'
      )
    ).toEqual([
      { label: 'Preview', url: 'https://preview.example.com', note: 'the latest' },
      { label: 'Plain', url: 'http://example.com', note: '' },
    ]);
  });

  it('writes the links back the way they are typed', () => {
    const text = 'Preview | https://preview.example.com | the latest';
    expect(formatLinks(parseLinks(text))).toBe(text);
  });
});
