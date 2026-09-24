import { getCollection, type CollectionEntry } from 'astro:content';

export type Race = CollectionEntry<'races'>;
export type Measure = CollectionEntry<'measures'>;
export type ElectionItem = CollectionEntry<'election'>['data'];

export async function getRaces(): Promise<Race[]> {
  return (await getCollection('races')).sort((a, b) => a.data.order - b.data.order);
}

export async function getMeasures(): Promise<Measure[]> {
  return (await getCollection('measures')).sort((a, b) => a.data.order - b.data.order);
}

// election.yaml as a lookup: election.register_deadline etc. Missing keys return undefined.
export async function getElection(): Promise<Record<string, ElectionItem>> {
  const out: Record<string, ElectionItem> = {};
  for (const e of await getCollection('election')) out[e.id] = e.data;
  return out;
}

// Poll most recently finished first; independent polls first among ties.
export function sortPolls<T extends { end: string }>(polls: T[]): T[] {
  return [...polls].sort((a, b) => b.end.localeCompare(a.end));
}

export function candidateParty(race: Race, name: string | null): string | undefined {
  return race.data.candidates.find((c) => c.name === name)?.party;
}

export const LEVELS = ['federal', 'statewide', 'legislative', 'county'] as const;
