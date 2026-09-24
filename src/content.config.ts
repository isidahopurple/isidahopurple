// Data schema for every fact on the site. Each fact carries a source URL.
// Forking for another state: copy data/idaho/ to data/<state>/ and point the loaders at it.
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const STATE = 'idaho';

// Prose can be a plain English string or { en, es }.
const text = z.union([z.string(), z.object({ en: z.string(), es: z.string().optional() })]);

const source = z.object({
  name: z.string(),
  url: z.url(),
  date: z.string().optional(), // publication date, YYYY-MM-DD when known
});

const quote = z.object({
  text: z.string(),
  translation_es: z.string().optional(),
  date: z.string(), // when it was said or published
  context: z.string(), // where and about what, one line
  source,
  // true only when a person read the quote at the source (not a search snippet)
  verified: z.boolean(),
});

const party = z.enum(['R', 'D', 'I', 'L', 'C', 'NP', 'Other']);

const candidate = z.object({
  name: z.string(),
  party,
  incumbent: z.boolean().default(false),
  withdrawn: z.boolean().default(false), // withdrew but may still be printed on the ballot
  bio: text.optional(), // one neutral line
  website: z.url().optional(),
  quote: quote.optional(),
});

const poll = z.object({
  pollster: z.string(),
  start: z.string(),
  end: z.string(),
  sample: z.string(), // e.g. "700 RV"
  margin_of_error: z.string().optional(),
  sponsor: z.string(), // "none", "unknown", or who paid
  sponsor_type: z.enum(['independent', 'campaign', 'party', 'unknown']),
  results: z.record(z.string(), z.number()), // candidate name -> percent
  undecided: z.number().optional(),
  source,
});

const history = z.object({
  year: z.number(),
  label: z.string(), // e.g. "2024 LD15 Senate"
  result: z.string(), // e.g. "Rabe (R) 51.8, Wintrow (D) 48.2"
  margin: z.string(), // e.g. "R+3.7"
  source,
});

const pick = z.object({
  // clear: one candidate in reach; two-way: turnout matters; not-sure; no-pick; not-researched
  label: z.enum(['clear', 'two-way', 'not-sure', 'no-pick', 'not-researched']),
  candidate: z.string().nullable(),
  rule: z.string(), // which step of the published method decided it
  reasoning: text,
  approved: z.boolean().default(false), // Ronnie signed off
});

const races = defineCollection({
  loader: glob({ pattern: '*.yaml', base: `./data/${STATE}/races` }),
  schema: z.object({
    office: text,
    level: z.enum(['federal', 'statewide', 'legislative', 'county']),
    district: z.string().optional(), // "LD15"
    seat: z.string().optional(), // "Senate", "House A"
    order: z.number(),
    featured: z.boolean().default(false),
    depth: z.enum(['full', 'short', 'not-researched']),
    controls: text.optional(), // what this office actually controls
    controls_source: source.optional(),
    candidates: z.array(candidate),
    polls: z.array(poll).default([]),
    history: z.array(history).default([]),
    pick,
    scenarios: z.array(z.object({ voters_of: z.string(), text })).default([]),
    review_flags: z.array(z.string()).default([]), // things Ronnie must look at
    unverified: z.array(z.string()).default([]), // facts not yet confirmed
    sources: z.array(source).default([]),
    updated: z.string(),
  }),
});

const measures = defineCollection({
  loader: glob({ pattern: '*.yaml', base: `./data/${STATE}/measures` }),
  schema: z.object({
    title: text,
    short_name: z.string(), // "Prop 1"
    order: z.number(),
    kind: z.enum(['initiative', 'constitutional-amendment', 'advisory', 'referendum']),
    summary: text, // neutral, plain words
    yes_means: text,
    no_means: text,
    passes_with: text, // threshold
    supporters: z.array(z.object({ name: z.string(), source })).default([]),
    opponents: z.array(z.object({ name: z.string(), source })).default([]),
    official: source,
    sources: z.array(source).default([]),
    unverified: z.array(z.string()).default([]),
    updated: z.string(),
  }),
});

const election = defineCollection({
  loader: file(`./data/${STATE}/election.yaml`),
  schema: z.object({
    label: text,
    value: text,
    note: text.optional(),
    source,
    verified: z.boolean(),
  }),
});

export const collections = { races, measures, election };
