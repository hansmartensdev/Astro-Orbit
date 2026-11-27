/**
 * The workspace's storage: Upstash Redis over its REST API, one fetch per
 * command, no SDK. Keys:
 *
 *   ws:project      the project (JSON, see model.ts)
 *   ws:thread       the notes and messages, newest first (a list of JSON)
 *   ws:used:<n>     a sign-in link that has been used (expires by itself)
 *   ws:wait:<mail>  a sign-in email was just sent to this address
 */
import { config } from './config';
import { emptyProject, projectSchema, type Entry, type Project } from './model';

type Command = (string | number)[];

async function run<T = unknown>(command: Command): Promise<T> {
  const response = await fetch(config.storeUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.storeToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  if (!response.ok) throw new Error(`Store ${response.status}: ${await response.text().catch(() => '')}`);
  const data = (await response.json()) as { result?: T; error?: string };
  if (data.error) throw new Error(`Store: ${data.error}`);
  return data.result as T;
}

export async function getProject(): Promise<Project> {
  const raw = await run<string | null>(['GET', 'ws:project']);
  if (!raw) return emptyProject();
  const parsed = projectSchema.safeParse(JSON.parse(raw));
  return parsed.success ? parsed.data : emptyProject();
}

export async function saveProject(project: Project): Promise<void> {
  const next = projectSchema.parse({ ...project, updated: new Date().toISOString() });
  await run(['SET', 'ws:project', JSON.stringify(next)]);
}

/** The thread, newest first: the last hundred entries. */
export async function getThread(): Promise<Entry[]> {
  const raw = await run<string[]>(['LRANGE', 'ws:thread', 0, 99]);
  return raw.flatMap((item) => {
    try {
      return [JSON.parse(item) as Entry];
    } catch {
      return [];
    }
  });
}

export async function addEntry(by: Entry['by'], text: string): Promise<Entry> {
  const entry: Entry = { id: crypto.randomUUID(), by, text, at: new Date().toISOString() };
  await run(['LPUSH', 'ws:thread', JSON.stringify(entry)]);
  await run(['LTRIM', 'ws:thread', 0, 499]);
  return entry;
}

export async function removeEntry(id: string): Promise<void> {
  const entries = await run<string[]>(['LRANGE', 'ws:thread', 0, 499]);
  const match = entries.find((item) => item.includes(`"id":"${id}"`));
  if (match) await run(['LREM', 'ws:thread', 1, match]);
}

/** Marks a sign-in link as used. False if it already was. */
export async function useOnce(n: string, seconds: number): Promise<boolean> {
  const result = await run<string | null>(['SET', `ws:used:${n}`, '1', 'NX', 'EX', seconds]);
  return result === 'OK';
}

/** At most one sign-in email a minute per address. False if one was just sent. */
export async function mayEmail(email: string): Promise<boolean> {
  const result = await run<string | null>(['SET', `ws:wait:${email}`, '1', 'NX', 'EX', 60]);
  return result === 'OK';
}
