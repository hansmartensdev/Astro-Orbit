# The workspace

A private page for the person Hans builds a project with: where the project
stands, what Hans needs from them, links, and a thread of Hans's notes and
their messages. It lives at `/workspace`, is not in the menu and is not
indexed.

- **Sign in** with a link sent by email (15 minutes, works once). Only the
  invited address and Hans's own can sign in. A session lasts 30 days on a
  device. A stranger's address gets the same "check your email" and no email.
- **The person** reads the project and can leave messages; Hans gets an
  email for each one.
- **Hans** edits everything on `/workspace/admin`: the project's details and
  the invited address, the steps (named per project), what he needs (ticked
  off by him), links, and notes (with an email to the person if he wants).
  Clearing the invited address signs that person out at once.

## Setting it up on Vercel

Until these are set, `/workspace` says "Not set up yet" and nothing else on
the site changes.

1. **The database.** In the Vercel project: Storage → Marketplace → Upstash
   (Redis) → create a database and connect it to this project. Vercel adds
   its keys to the environment (`KV_REST_API_URL` and `KV_REST_API_TOKEN`, or
   `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`; either pair
   works).
2. **Your address.** Settings → Environment Variables:
   `WORKSPACE_ADMIN_EMAIL` = the address you sign in with.
3. **The secret.** `WORKSPACE_SECRET` = a long random value, at least 32
   characters. It signs the sign-in links and the sessions; changing it
   signs everyone out. One way to make one: `openssl rand -base64 48`.
4. **Email.** The workspace sends through Resend with `RESEND_API_KEY` and
   `CONTACT_FROM`, which the contact form already uses.
5. Redeploy, open `/workspace`, sign in with your address, and fill in the
   project on `/workspace/admin`.

## Where things are

| Path | What it holds |
|------|---------------|
| `src/pages/workspace/index.astro` | Sign-in, and the project for the signed-in person |
| `src/pages/workspace/verify.astro` | Where the link lands: one click signs in |
| `src/pages/workspace/admin.astro` | Hans's page |
| `src/pages/workspace/signout.ts` | Signs out |
| `src/components/workspace/` | The project view, the thread, the panel, the signed-in bar |
| `src/lib/workspace/` | Settings, signed tokens, session, storage, email, data model |
| `tests/workspace.test.ts` | Tokens, steps and links |

The forms post to the server pages themselves and carry
`data-astro-reload`, so the site's page-transition router leaves them alone.

## Taking it out of a fork

1. Delete `src/pages/workspace/`, `src/components/workspace/`,
   `src/lib/workspace/` and `tests/workspace.test.ts`.
2. In `astro.config.mjs`, delete the six `WORKSPACE_*`, `KV_REST_API_*` and
   `UPSTASH_REDIS_REST_*` lines in `env.schema`, and the comment above them.
3. Run `pnpm check && pnpm test && pnpm build`.

Nothing else on the site depends on it.
