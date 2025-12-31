import { GoogleGenAI } from '@google/genai'
import { readFile } from 'fs/promises'
import { join, basename } from 'path'
import { glob } from 'glob'
import type { ProjFile } from './types'

const ANALYSIS_PROMPT = `Analyze this project and extract metadata for a portfolio site.

Return a JSON object with these fields:
- id: slug derived from project name (lowercase, hyphens, no special chars)
- name: display name
- desc: one sentence description, lowercase, no period at the end
- stack: array of 2-5 main technologies/frameworks used
- link: detected website url or null if not found
- github: detected github repo url or null if not found
- status: one of "active", "maintenance", "experimental", "prototype" (guess based on activity/completeness)
- icon: suggested lucide icon name (e.g. "Cpu", "Monitor", "Sparkles", "Globe", "Gamepad2", "Zap", "Clock", "Layers", "Calculator", "Box", "FileText", "Code", "Database", "Server", "Terminal")

Project files:
`

export async function gatherProjectFiles(dirname: string): Promise<string[]> {
  // find relevant files to analyze
  const patterns = [
    'README.md',
    'readme.md',
    'README',
    'package.json',
    'Cargo.toml',
    'pyproject.toml',
    'setup.py',
    'go.mod',
    'composer.json',
    'src/index.{ts,tsx,js,jsx}',
    'src/main.{ts,tsx,js,jsx,py,rs,go}',
    'src/app.{ts,tsx,js,jsx}',
    'lib/index.{ts,tsx,js,jsx}',
    'app/page.{ts,tsx,js,jsx}',
    'index.{ts,tsx,js,jsx,html}'
  ]

  const files: string[] = []

  for (const pattern of patterns) {
    const matches = await glob(join(dirname, pattern), { nodir: true })
    files.push(...matches)
  }

  // also check for .git/config to find github url
  const gitConfig = join(dirname, '.git/config')
  try {
    await readFile(gitConfig)
    files.push(gitConfig)
  } catch {}

  return files.slice(0, 10) // limit to 10 files
}

export async function buildContext(dirname: string, files: string[]): Promise<string> {
  const parts: string[] = []

  parts.push(`Project directory: ${basename(dirname)}`)
  parts.push('')

  for (const file of files) {
    try {
      const content = await readFile(file, 'utf-8')
      const relativePath = file.replace(dirname, '').replace(/^\//, '')

      // truncate large files
      const truncated = content.length > 3000
        ? content.slice(0, 3000) + '\n... (truncated)'
        : content

      parts.push(`--- ${relativePath} ---`)
      parts.push(truncated)
      parts.push('')
    } catch {}
  }

  return parts.join('\n')
}

export async function analyzeWithGemini(apiKey: string, context: string): Promise<ProjFile> {
  const ai = new GoogleGenAI({ apiKey })

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: ANALYSIS_PROMPT + context + '\n\nReturn only valid JSON, no markdown code blocks.',
    config: {
      temperature: 0.3,
      maxOutputTokens: 500
    }
  })

  const text = response.text || ''

  // try to extract JSON from response
  let jsonStr = text.trim()

  // remove markdown code blocks if present
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  }

  try {
    return JSON.parse(jsonStr)
  } catch (e) {
    throw new Error(`failed to parse gemini response: ${text}`)
  }
}
