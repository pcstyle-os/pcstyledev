import { select } from '@inquirer/prompts'
import { loadProjects, getProject } from '../lib/projects'

export async function view(name?: string) {
  const data = await loadProjects()

  let projectId = name

  // if no name provided, show selector
  if (!projectId) {
    projectId = await select({
      message: 'select a project to view:',
      choices: data.projects.map(p => ({
        value: p.id,
        name: `${p.name} [${p.status}]`
      }))
    })
  }

  const project = await getProject(projectId)

  if (!project) {
    console.error(`error: project "${projectId}" not found`)
    process.exit(1)
  }

  console.log()
  console.log('─'.repeat(50))
  console.log(`  ${project.name}`)
  console.log('─'.repeat(50))
  console.log()
  console.log(`  id:         ${project.id}`)
  console.log(`  desc:       ${project.desc}`)
  console.log(`  stack:      ${project.stack.join(', ')}`)
  console.log(`  status:     ${project.status}`)
  console.log(`  icon:       ${project.icon}`)
  console.log(`  link:       ${project.link || '(none)'}`)
  console.log(`  github:     ${project.github || '(none)'}`)
  console.log(`  created:    ${project.createdAt}`)
  console.log(`  updated:    ${project.updatedAt}`)
  console.log()
}
