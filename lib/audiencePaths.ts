export type AudiencePathId = 'hire_fast' | 'technical_deep' | 'founder' | 'design_proof';

export const AUDIENCE_PATH_STORAGE_KEY = 'pcstyle_audience_path';
export const AUDIENCE_PATH_QUERY_KEY = 'path';

const IDS = new Set<AudiencePathId>(['hire_fast', 'technical_deep', 'founder', 'design_proof']);

export function parseAudiencePathParam(value: string | null): AudiencePathId | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase().replace(/-/g, '_') as AudiencePathId;
  return IDS.has(normalized) ? normalized : null;
}

export interface AudiencePathConfig {
  id: AudiencePathId;
  label: string;
  blurb: string;
  heroLead: string;
  heroAccent: string;
  heroRest: string;
  archiveLine: string;
  curationLine: string;
  /** Optional stack ids to pre-highlight in UI (subset of stack-canonical) */
  stackHint?: string[];
}

export const AUDIENCE_PATHS: AudiencePathConfig[] = [
  {
    id: 'hire_fast',
    label: 'Hire me fast',
    blurb: 'Proof, links, and shipped work — minimal friction.',
    heroLead: 'The',
    heroAccent: 'decision-ready',
    heroRest: 'archive.',
    archiveLine: 'Curated for speed: featured work first, clear status, direct outbound links.',
    curationLine: 'Start with pinned builds, then drill into details when you need depth.',
  },
  {
    id: 'technical_deep',
    label: 'Technical deep dive',
    blurb: 'Systems, constraints, and how things actually work.',
    heroLead: 'The',
    heroAccent: 'systems',
    heroRest: 'ledger.',
    archiveLine: 'Sorted for inspection: stack filters, maintenance signals, and repo truth.',
    curationLine: 'Use stack + status filters to stress-test breadth across runtimes and domains.',
    stackHint: ['TypeScript', 'Next.js', 'Convex', 'React'],
  },
  {
    id: 'founder',
    label: 'Founder mode',
    blurb: 'Velocity, product instinct, and experiments that ship.',
    heroLead: 'The',
    heroAccent: 'ship-first',
    heroRest: 'studio.',
    archiveLine: 'Experimental and active nodes surfaced — ideas that became interfaces.',
    curationLine: 'Look for experimental + active tags; that is where product risk lives.',
  },
  {
    id: 'design_proof',
    label: 'Design + frontend proof',
    blurb: 'Motion, glass, typography — craft you can feel.',
    heroLead: 'The',
    heroAccent: 'sensory',
    heroRest: 'catalog.',
    archiveLine: 'Interfaces with motion, glass, and spatial rhythm — not template filler.',
    curationLine: 'Try Tailwind, Framer Motion, and Vite stacks; open the Lab for live telemetry.',
    stackHint: ['Tailwind CSS', 'Framer Motion', 'React', 'Vite'],
  },
];

export function getAudiencePathConfig(id: AudiencePathId | null): AudiencePathConfig {
  const found = id ? AUDIENCE_PATHS.find((p) => p.id === id) : undefined;
  return found ?? AUDIENCE_PATHS[0];
}
