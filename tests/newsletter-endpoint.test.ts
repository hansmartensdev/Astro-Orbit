import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { signToken } from '@/lib/newsletter';

// The endpoint with a key and a segment set, talking to a stand-in for
// Resend's API: every request is recorded, and each test says how Resend
// answers.
vi.mock('astro:env/server', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  RESEND_API_KEY: 're_test_key',
  CONTACT_FROM: 'Alex Morgan <hello@example.com>',
  NEWSLETTER_SEGMENT_ID: 'seg_123',
}));

const { POST } = await import('@/pages/api/newsletter');

type Call = { url: string; method: string; body: Record<string, unknown> | undefined };
let calls: Call[] = [];
let answer: (call: Call) => Response;

beforeEach(() => {
  calls = [];
  answer = () => new Response('{}', { status: 200 });
  vi.stubGlobal('fetch', async (url: string, init: RequestInit) => {
    const call = { url, method: init.method ?? 'GET', body: init.body ? JSON.parse(init.body as string) : undefined };
    calls.push(call);
    return answer(call);
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const site = new URL('https://site.example.com');
const post = async (fields: Record<string, string>, accept = '*/*') => {
  const body = new FormData();
  for (const [k, v] of Object.entries(fields)) body.set(k, v);
  const request = new Request('https://site.example.com/api/newsletter', { method: 'POST', body, headers: { accept } });
  // The handler only reads `request` and `site` from the context.
  return POST({ request, site } as Parameters<typeof POST>[0]);
};

describe('newsletter signup', () => {
  it('mails a link to confirm, and stores nothing yet', async () => {
    const response = await post({ email: ' Reader@Example.com ', honeypot: '' });
    expect(await response.json()).toEqual({ success: true });
    expect(calls).toHaveLength(1);
    const [mail] = calls;
    expect(mail.url).toBe('https://api.resend.com/emails');
    expect(mail.body?.to).toEqual(['reader@example.com']);
    expect(mail.body?.from).toBe('Alex Morgan <hello@example.com>');
    expect(String(mail.body?.text)).toMatch(/https:\/\/site\.example\.com\/newsletter\/\?t=[\w-]+\.[\w-]+/);
  });

  it('drops a bot that filled in the hidden field, without a word', async () => {
    const response = await post({ email: 'bot@example.com', honeypot: 'spam' });
    expect(await response.json()).toEqual({ success: true });
    expect(calls).toHaveLength(0);
  });

  it('refuses an address that is not one', async () => {
    const response = await post({ email: 'not-an-address', honeypot: '' });
    expect(response.status).toBe(400);
    expect(calls).toHaveLength(0);
  });

  it('says so when Resend refuses the email', async () => {
    answer = () => new Response('{"message":"domain not verified"}', { status: 403 });
    const response = await post({ email: 'reader@example.com', honeypot: '' });
    expect(response.status).toBe(500);
    expect((await response.json()).success).toBe(false);
  });
});

describe('newsletter confirmation', () => {
  it('adds a confirmed address to the contacts, in the segment', async () => {
    const token = await signToken('reader@example.com', 're_test_key');
    const response = await post({ token });
    expect(await response.json()).toEqual({ success: true, state: 'done' });
    expect(calls).toEqual([
      {
        url: 'https://api.resend.com/contacts',
        method: 'POST',
        body: { email: 'reader@example.com', unsubscribed: false, segments: [{ id: 'seg_123' }] },
      },
    ]);
  });

  it('subscribes an existing contact again and puts it in the segment', async () => {
    answer = (call) =>
      call.url.endsWith('/contacts') && call.method === 'POST'
        ? new Response('{"message":"already exists"}', { status: 409 })
        : new Response('{}', { status: 200 });
    const token = await signToken('reader@example.com', 're_test_key');
    const response = await post({ token });
    expect(await response.json()).toEqual({ success: true, state: 'done' });
    expect(calls.map((c) => `${c.method} ${c.url.replace('https://api.resend.com', '')}`)).toEqual([
      'POST /contacts',
      'PATCH /contacts/reader%40example.com',
      'POST /contacts/reader%40example.com/segments/seg_123',
    ]);
    expect(calls[1].body).toEqual({ unsubscribed: false });
  });

  it('refuses a link that was tampered with, or signed with another key', async () => {
    const other = await signToken('reader@example.com', 'another key');
    for (const token of [other, 'abc.def', '']) {
      const response = await post({ token });
      expect(await response.json()).toEqual({ success: false, state: 'expired' });
    }
    expect(calls).toHaveLength(0);
  });

  it('sends a form without JavaScript on to the page that says how it went', async () => {
    const token = await signToken('reader@example.com', 're_test_key');
    const response = await post({ token }, 'text/html,application/xhtml+xml');
    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('https://site.example.com/newsletter/?status=done');
  });
});
