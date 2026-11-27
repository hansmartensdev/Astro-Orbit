/**
 * The workspace's settings, from the environment (astro:env, see the schema
 * in astro.config.mjs). `ready` is false until all of them are set; the
 * pages then say the workspace isn't set up yet.
 */
import {
  WORKSPACE_SECRET,
  WORKSPACE_ADMIN_EMAIL,
  KV_REST_API_URL,
  KV_REST_API_TOKEN,
  UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN,
  RESEND_API_KEY,
  CONTACT_FROM,
} from 'astro:env/server';
import { normalizeEmail } from './sign';

export const config = {
  secret: WORKSPACE_SECRET ?? '',
  admin: normalizeEmail(WORKSPACE_ADMIN_EMAIL ?? ''),
  storeUrl: KV_REST_API_URL ?? UPSTASH_REDIS_REST_URL ?? '',
  storeToken: KV_REST_API_TOKEN ?? UPSTASH_REDIS_REST_TOKEN ?? '',
  resendKey: RESEND_API_KEY ?? '',
  from: CONTACT_FROM,
};

/** A secret shorter than this is too easy to guess. */
const MIN_SECRET = 32;

/** In development the emails can be logged instead of sent (mail.ts), so
 *  the Resend key is only required in production. */
export const ready = Boolean(
  config.secret.length >= MIN_SECRET &&
    config.admin &&
    config.storeUrl &&
    config.storeToken &&
    (config.resendKey || import.meta.env.DEV)
);
