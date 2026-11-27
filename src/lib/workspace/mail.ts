/**
 * The workspace's emails, through Resend's REST API (as the contact form
 * sends): the sign-in link, a new message for Hans, a new note for the
 * person.
 */
import { config } from './config';

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);

async function send(to: string, subject: string, lines: string[], link?: { url: string; label: string }) {
  const text = [...lines, ...(link ? ['', `${link.label}: ${link.url}`] : [])].join('\n');
  if (!config.resendKey && import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log(`[workspace] would email ${to}: ${subject}\n${text}`);
    return;
  }
  const html = `
    ${lines.map((line) => `<p style="font-size:16px;line-height:1.5;white-space:pre-wrap">${escapeHtml(line)}</p>`).join('')}
    ${link ? `<p><a href="${escapeHtml(link.url)}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#6d28d9;color:#ffffff;text-decoration:none;font-weight:600">${escapeHtml(link.label)}</a></p>` : ''}
  `;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.resendKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: config.from, to: [to], subject, text, html }),
  });
  if (!response.ok) throw new Error(`Resend ${response.status}: ${await response.text().catch(() => '')}`);
}

export const sendSignInLink = (to: string, url: string) =>
  send(
    to,
    'Your sign-in link for the workspace',
    ['Here is your link to sign in to the workspace. It works once, within 15 minutes.', "If you didn't ask for it, you can ignore this email."],
    { url, label: 'Sign in' }
  );

export const sendMessageToAdmin = (to: string, from: string, message: string, url: string) =>
  send(to, `New message in the workspace from ${from}`, [`${from} wrote:`, message], { url, label: 'Open the workspace' });

export const sendNoteToMember = (to: string, url: string) =>
  send(to, 'A new note in the workspace', ['Hans left a new note in the workspace.'], { url, label: 'Read it' });
