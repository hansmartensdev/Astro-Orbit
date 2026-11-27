/**
 * POST /workspace/signout: ends the session on this device.
 */
import type { APIRoute } from 'astro';
import { endSession } from '@/lib/workspace/session';

export const prerender = false;

export const POST: APIRoute = ({ cookies, redirect }) => {
  endSession(cookies);
  return redirect('/workspace', 303);
};
