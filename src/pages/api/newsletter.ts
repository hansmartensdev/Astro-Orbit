/**
 * POST /api/newsletter
 *
 * The newsletter signup under every post, with a confirmation email first
 * (double opt-in):
 *
 *   1. The form sends `email`. The address gets an email with a link to
 *      /newsletter/?t=<token>, signed and valid for three days
 *      (src/lib/newsletter.ts). Nothing is stored yet.
 *   2. The button on that page sends `token`. When the signature and the
 *      date hold, the address is added to Resend's contacts, in the segment
 *      NEWSLETTER_SEGMENT_ID when it's set: the list Resend's broadcasts
 *      go to. An address that is already a contact (it signed up before, or
 *      unsubscribed and came back) is subscribed again.
 *
 * Resend's REST API, with fetch: no SDK, so it runs on every host. The
 * token is signed with RESEND_API_KEY. Server-rendered, like
 * /api/contact. A form sent without JavaScript is answered with a redirect
 * to /newsletter/ instead of JSON.
 *
 * Without RESEND_API_KEY, dev logs the address and accepts it; production
 * refuses it. Ported from Astro Orbit's endpoint, in English only.
 */
import type { APIRoute } from 'astro';
import { z } from 'astro/zod';
import { RESEND_API_KEY, CONTACT_FROM, NEWSLETTER_SEGMENT_ID } from 'astro:env/server';
import siteConfig from '@/config/site.config';
import { normalizeEmail, signToken, verifyToken } from '@/lib/newsletter';

export const prerender = false;

const RESEND = 'https://api.resend.com';

const INVALID = 'Please enter a valid email address';
const FAILED = 'Something went wrong. Please try again later.';

/** The email with the link to confirm. */
const MAIL = {
  subject: (site: string) => `Confirm your subscription to ${site}`,
  intro: (site: string) => `Please confirm that you want an email from ${site} when a new post is published.`,
  button: 'Confirm my subscription',
  ignore: "Didn't ask for this? Then ignore this email: your address won't be added.",
};

const signupSchema = z.object({
  email: z.email(INVALID).max(254),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c
  );

function resend(path: string, method: string, body?: unknown): Promise<Response> {
  return fetch(`${RESEND}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

async function fail(step: string, response: Response): Promise<never> {
  const detail = await response.text().catch(() => '');
  throw new Error(`Resend ${step} ${response.status}: ${detail}`);
}

/** Step 1: the email with the link to confirm. */
async function sendConfirmation(email: string, link: string): Promise<void> {
  const site = siteConfig.name;
  const mail = MAIL;
  const text = [mail.intro(site), '', `${mail.button}: ${link}`, '', mail.ignore].join('\n');
  const html = `
    <p style="font-size:16px;line-height:1.5">${escapeHtml(mail.intro(site))}</p>
    <p style="margin:28px 0"><a href="${escapeHtml(link)}" style="display:inline-block;padding:14px 24px;border-radius:999px;background:#0e0e0e;color:#ffffff;text-decoration:none;font-weight:600">${escapeHtml(mail.button)}</a></p>
    <p style="font-size:14px;line-height:1.5;color:#6b7280">${escapeHtml(mail.ignore)}</p>
  `;
  const response = await resend('/emails', 'POST', {
    from: CONTACT_FROM,
    to: [email],
    subject: mail.subject(site),
    text,
    html,
  });
  if (!response.ok) await fail('email', response);
}

/** Step 2: the confirmed address on the list. */
async function addContact(email: string): Promise<void> {
  const segments = NEWSLETTER_SEGMENT_ID ? [{ id: NEWSLETTER_SEGMENT_ID }] : undefined;
  const created = await resend('/contacts', 'POST', { email, unsubscribed: false, segments });
  if (created.ok) return;
  if (created.status === 401 || created.status === 403) await fail('contact', created);

  // Already a contact: subscribe it again, and put it in the segment.
  const id = encodeURIComponent(email);
  const updated = await resend(`/contacts/${id}`, 'PATCH', { unsubscribed: false });
  if (!updated.ok) await fail('contact', created);
  if (NEWSLETTER_SEGMENT_ID) {
    const added = await resend(`/contacts/${id}/segments/${encodeURIComponent(NEWSLETTER_SEGMENT_ID)}`, 'POST');
    // Already in the segment is fine too.
    if (!added.ok && added.status !== 409 && added.status !== 422) await fail('segment', added);
  }
}

export const POST: APIRoute = async ({ request, site }) => {
  // A form sent without JavaScript asks for a page, not JSON.
  const wantsPage = (request.headers.get('accept') ?? '').includes('text/html');
  const reply = (body: Record<string, unknown>, status = 200) => {
    if (!wantsPage) return json(body, status);
    const state = body.state ?? (body.success ? 'sent' : 'failed');
    return Response.redirect(new URL(`/newsletter/?status=${state}`, request.url), 303);
  };

  try {
    const formData = await request.formData();
    const token = formData.get('token')?.toString();

    // --- step 2: the click on the confirmation page -------------------------
    if (token !== undefined) {
      if (!RESEND_API_KEY) return reply({ success: false, state: 'failed' }, 500);
      const email = await verifyToken(token, RESEND_API_KEY);
      if (!email) return reply({ success: false, state: 'expired' }, 400);
      await addContact(email);
      return reply({ success: true, state: 'done' });
    }

    // --- step 1: the signup under a post -------------------------------------
    // Honeypot: a bot filled in the hidden field. Pretend success and drop
    // it, before anything else, so the bot learns nothing.
    if (formData.get('honeypot')?.toString()) return reply({ success: true });

    // Trimmed and in lower case before the check: a pasted address often
    // carries a space.
    const result = signupSchema.safeParse({ email: normalizeEmail(formData.get('email')?.toString() ?? '') });
    if (!result.success) {
      return reply({ success: false, errors: { email: [INVALID] } }, 400);
    }

    const { email } = result.data;
    if (!RESEND_API_KEY) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log('[newsletter] RESEND_API_KEY not set — would have sent a confirmation to:', email);
        return reply({ success: true });
      }
      throw new Error('RESEND_API_KEY is not set');
    }

    const link = new URL(`/newsletter/?t=${await signToken(email, RESEND_API_KEY)}`, site ?? request.url);
    await sendConfirmation(email, link.href);
    return reply({ success: true });
  } catch (error) {
    console.error('Newsletter error:', error);
    return reply({ success: false, errors: { form: [FAILED] } }, 500);
  }
};
