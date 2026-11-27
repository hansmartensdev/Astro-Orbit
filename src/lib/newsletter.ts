/**
 * The newsletter's confirmation link.
 *
 * Double opt-in without a database: the link in the confirmation email
 * carries the address and an expiry time, signed with HMAC-SHA-256. Only the
 * server, which holds the secret, can make a link that verifies, so a click
 * proves the address's owner asked for the newsletter. Nothing is stored
 * before the click; an address that is never confirmed is never kept.
 *
 * Web Crypto only (crypto.subtle, btoa, atob), so it runs on Vercel, Netlify
 * and Cloudflare alike.
 */

/** How long a confirmation link works: three days. */
export const LINK_LIFETIME = 3 * 24 * 60 * 60 * 1000;

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[A-Za-z0-9_-]*$/.test(text)) return null;
  try {
    const padded = text.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (text.length % 4)) % 4);
    return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  } catch {
    return null;
  }
}

/** The address as it is kept and compared: trimmed, in lower case. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function key(secret: string): Promise<CryptoKey> {
  // The prefix keeps this key apart from any other use of the same secret.
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(`astro-orbit-newsletter:${secret}`),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/** A token for the confirmation link: `<payload>.<signature>`. */
export async function signToken(email: string, secret: string, now = Date.now()): Promise<string> {
  const payload = toBase64Url(
    encoder.encode(JSON.stringify({ e: normalizeEmail(email), x: now + LINK_LIFETIME }))
  );
  const signature = await crypto.subtle.sign('HMAC', await key(secret), encoder.encode(payload));
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

/**
 * The address in a token, when its signature is the server's own and it
 * hasn't expired; otherwise null.
 */
export async function verifyToken(token: string, secret: string, now = Date.now()): Promise<string | null> {
  const [payload, signature, ...rest] = token.split('.');
  if (!payload || !signature || rest.length) return null;
  const sig = fromBase64Url(signature);
  if (!sig) return null;
  // crypto.subtle.verify compares in constant time.
  const valid = await crypto.subtle.verify('HMAC', await key(secret), sig, encoder.encode(payload));
  if (!valid) return null;
  const bytes = fromBase64Url(payload);
  if (!bytes) return null;
  try {
    const { e, x } = JSON.parse(new TextDecoder().decode(bytes)) as { e?: unknown; x?: unknown };
    if (typeof e !== 'string' || typeof x !== 'number' || x < now) return null;
    return e;
  } catch {
    return null;
  }
}
