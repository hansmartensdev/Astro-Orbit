/**
 * Who is signed in: the session cookie, checked on every request against
 * who may use the workspace now (Hans, and the person the project invites).
 * Removing the invited address signs that person out at once.
 */
import type { AstroCookies } from 'astro';
import { config } from './config';
import { getProject } from './store';
import { SESSION_LIFETIME, normalizeEmail, sign, verify } from './sign';

export const COOKIE = 'ws_session';

export type Role = 'admin' | 'member';

export interface Who {
  email: string;
  role: Role;
}

/** The role of an address, or null if it may not sign in. */
export async function roleOf(address: string): Promise<Role | null> {
  const email = normalizeEmail(address);
  if (!email) return null;
  if (email === config.admin) return 'admin';
  const project = await getProject();
  return project.member && normalizeEmail(project.member) === email ? 'member' : null;
}

export async function startSession(cookies: AstroCookies, email: string, secure: boolean) {
  const token = await sign({ e: email, p: 'session', x: Date.now() + SESSION_LIFETIME }, config.secret);
  cookies.set(COOKIE, token, {
    path: '/workspace',
    httpOnly: true,
    sameSite: 'lax',
    secure,
    maxAge: SESSION_LIFETIME / 1000,
  });
}

export function endSession(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: '/workspace' });
}

export async function whoIs(cookies: AstroCookies): Promise<Who | null> {
  const token = cookies.get(COOKIE)?.value;
  if (!token) return null;
  const payload = await verify(token, 'session', config.secret);
  if (!payload) return null;
  const role = await roleOf(payload.e);
  return role ? { email: payload.e, role } : null;
}
