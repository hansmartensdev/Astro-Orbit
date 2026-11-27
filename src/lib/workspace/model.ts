/**
 * The workspace's content: one project, its steps, what Hans needs from the
 * person he builds it with, links, and a thread of notes (from Hans) and
 * messages (from the person). Hans edits it on /workspace/admin; the person
 * reads it on /workspace and can add messages.
 */
import { z } from 'astro/zod';

export const stepState = z.enum(['done', 'now', 'next']);

export const projectSchema = z.object({
  name: z.string().max(80).default(''),
  /** Who it's for, after "Workspace ·" in the hero. */
  client: z.string().max(80).default(''),
  description: z.string().max(240).default(''),
  status: z.string().max(60).default(''),
  next: z.string().max(80).default(''),
  launch: z.string().max(80).default(''),
  /** The invited person's address; only they and the admin can sign in. */
  member: z.string().max(200).default(''),
  steps: z
    .array(z.object({ name: z.string().max(40), state: stepState, date: z.string().max(40) }))
    .max(12)
    .default([]),
  needs: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().max(120),
        detail: z.string().max(600),
        due: z.string().max(40),
        done: z.boolean(),
      })
    )
    .max(40)
    .default([]),
  links: z
    .array(z.object({ label: z.string().max(80), url: z.url(), note: z.string().max(80) }))
    .max(12)
    .default([]),
  updated: z.string().default(''),
});

export type Project = z.infer<typeof projectSchema>;
export type Step = Project['steps'][number];
export type Need = Project['needs'][number];
export type Link = Project['links'][number];

export const emptyProject = (): Project => projectSchema.parse({});

export interface Entry {
  id: string;
  /** "hans" for a note, "member" for a message from the person. */
  by: 'hans' | 'member';
  text: string;
  /** ISO time. */
  at: string;
}

/**
 * The steps, as Hans types them: one per line, "Name | done/now/next | date",
 * e.g. "Build | now | until 12 Dec". A line without a state counts as next.
 */
export function parseSteps(text: string): Step[] {
  return text
    .split('\n')
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter(([name]) => Boolean(name))
    .slice(0, 12)
    .map(([name, state = '', date = '']) => ({
      name: name.slice(0, 40),
      state: stepState.safeParse(state.toLowerCase()).success ? (state.toLowerCase() as Step['state']) : 'next',
      date: date.slice(0, 40),
    }));
}

export const formatSteps = (steps: Step[]) =>
  steps.map((s) => [s.name, s.state, s.date].filter(Boolean).join(' | ')).join('\n');

/**
 * The links, one per line: "Label | https://… | note". Only http(s)
 * addresses are kept, so a link can't run script.
 */
export function parseLinks(text: string): Link[] {
  return text
    .split('\n')
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter(([label, url]) => Boolean(label) && /^https?:\/\//i.test(url ?? ''))
    .slice(0, 12)
    .flatMap(([label, url, note = '']) => {
      const ok = z.url().safeParse(url);
      return ok.success ? [{ label: label.slice(0, 80), url, note: note.slice(0, 80) }] : [];
    });
}

export const formatLinks = (links: Link[]) =>
  links.map((l) => [l.label, l.url, l.note].filter(Boolean).join(' | ')).join('\n');

/** "27 Nov", for the thread. */
export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Europe/Amsterdam' });
