import { readFile, writeFile } from 'fs/promises'
import { STACK_CANONICAL_PATH } from '../utils/config'

export interface StackGlossaryEntry {
  label: string
  desc: string
}

export interface StackConfig {
  canonical: string[]
  aliases: Record<string, string>
  glossary: StackGlossaryEntry[]
}

interface NormalizeResult {
  normalized: string[]
  unknown: string[]
  changed: boolean
}

const normalizeKey = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()

export async function loadStackConfig(): Promise<StackConfig> {
  const content = await readFile(STACK_CANONICAL_PATH, 'utf-8')
  return JSON.parse(content) as StackConfig
}

export async function saveStackConfig(config: StackConfig): Promise<void> {
  await writeFile(STACK_CANONICAL_PATH, JSON.stringify(config, null, 2) + '\n')
}

export function normalizeStackList(stack: string[], config: StackConfig): NormalizeResult {
  const lookup = new Map<string, string>()

  config.canonical.forEach((label) => {
    lookup.set(normalizeKey(label), label)
  })

  Object.entries(config.aliases).forEach(([alias, canonical]) => {
    lookup.set(normalizeKey(alias), canonical)
  })

  const unknown = new Set<string>()
  const normalized: string[] = []
  const seen = new Set<string>()

  stack.forEach((label) => {
    const trimmed = label.trim()
    if (!trimmed) return
    const key = normalizeKey(trimmed)
    const canonical = lookup.get(key)
    if (!canonical) {
      unknown.add(trimmed)
      if (!seen.has(key)) {
        normalized.push(trimmed)
        seen.add(key)
      }
      return
    }

    const canonicalKey = normalizeKey(canonical)
    if (!seen.has(canonicalKey)) {
      normalized.push(canonical)
      seen.add(canonicalKey)
    }
  })

  const changed = normalized.join('|') !== stack.map((label) => label.trim()).filter(Boolean).join('|')

  return {
    normalized,
    unknown: Array.from(unknown),
    changed
  }
}
