/**
 * Signed tokens for the workspace: the sign-in link and the session cookie.
 *
 * A token is a small JSON payload and its HMAC-SHA-256, both base64url. It
 * carries a purpose ("link" or "session") and an expiry, so a sign-in link
 * can't be used as a session cookie or the other way round, and an old one
 * stops working by itself. Only the server, which holds WORKSPACE_SECRET,
 * can make one that verifies. Web Crypto only, so it runs on any host.
 */

export type Purpose = 'link' | 'session';

export interface Payload {
  /** The email address, normalised. */
  e: string;
  /** What the token is for. */
  p: Purpose;
  /** Expiry, ms since the epoch. */
  x: number;
  /** A random value: makes a sign-in link single-use (see store.ts). */
  n?: string;
}

/** A sign-in link works for 15 minutes. */
export const LINK_LIFETIME = 15 * 60 * 1000;
/** A session lasts 30 days on a device. */
export const SESSION_LIFETIME = 30 * 24 * 60 * 60 * 1000;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[A-Za-z0-9_-]+$/.test(text)) return null;
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

function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/** A random value for a link's single use. */
export function nonce(): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(16)));
}

export async function sign(payload: Payload, secret: string): Promise<string> {
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const mac = await crypto.subtle.sign('HMAC', await hmacKey(secret), encoder.encode(body));
  return `${body}.${toBase64Url(new Uint8Array(mac))}`;
}

/** The payload, if the token is genuine, for this purpose and not expired. */
export async function verify(
  token: string,
  purpose: Purpose,
  secret: string,
  now = Date.now()
): Promise<Payload | null> {
  const [body, mac, extra] = token.split('.');
  if (!body || !mac || extra !== undefined) return null;
  const macBytes = fromBase64Url(mac);
  const bodyBytes = fromBase64Url(body);
  if (!macBytes || !bodyBytes) return null;
  const ok = await crypto.subtle.verify('HMAC', await hmacKey(secret), macBytes, encoder.encode(body));
  if (!ok) return null;
  let payload: Payload;
  try {
    payload = JSON.parse(decoder.decode(bodyBytes)) as Payload;
  } catch {
    return null;
  }
  if (payload.p !== purpose || typeof payload.e !== 'string' || typeof payload.x !== 'number') return null;
  if (now > payload.x) return null;
  return payload;
}
