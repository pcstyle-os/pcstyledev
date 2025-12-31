import { loadProjects } from '../lib/projects'
import type { ProjectStatus } from '../lib/types'

interface LsOptions {
  status?: ProjectStatus
}

export async function ls(options: LsOptions) {
  const data = await loadProjects()
  let projects = data.projects

  // filter by status if specified
  if (options.status) {
    projects = projects.filter(p => p.status === options.status)
  }

  if (projects.length === 0) {
    console.log('no projects found')
    return
  }

  // status color codes
  const statusColor: Record<ProjectStatus, string> = {
    active: '\x1b[32m',      // green
    maintenance: '\x1b[33m', // yellow
    experimental: '\x1b[35m', // magenta
    prototype: '\x1b[36m',   // cyan
    disabled: '\x1b[90m'     // gray
  }
  const reset = '\x1b[0m'

  console.log()
  console.log(`found ${projects.length} project(s):\n`)

  for (const p of projects) {
    const color = statusColor[p.status] || reset
    console.log(`  ${color}[${p.status.padEnd(12)}]${reset} ${p.name}`)
    console.log(`                  ${p.desc}`)
    console.log()
  }
}
