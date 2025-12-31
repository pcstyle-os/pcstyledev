import { confirm, select } from '@inquirer/prompts'
import { loadProjects, getProject, deleteProject as deleteProjectData } from '../lib/projects'

interface DeleteOptions {
  yes?: boolean
}

export async function deleteProject(name: string, options: DeleteOptions) {
  const data = await loadProjects()

  // find project by id or name
  let project = data.projects.find(p => p.id === name || p.name.toLowerCase() === name.toLowerCase())

  if (!project) {
    // show selector if not found
    const projectId = await select({
      message: 'project not found. select one:',
      choices: data.projects.map(p => ({
        value: p.id,
        name: `${p.name} [${p.status}]`
      }))
    })
    project = await getProject(projectId)
  }

  if (!project) {
    console.error('error: no project selected')
    process.exit(1)
  }

  console.log(`\nproject: ${project.name}`)
  console.log(`desc:    ${project.desc}`)

  // confirm unless -y flag
  if (!options.yes) {
    const shouldDelete = await confirm({
      message: `are you sure you want to delete "${project.name}"?`,
      default: false
    })

    if (!shouldDelete) {
      console.log('cancelled')
      return
    }
  }

  await deleteProjectData(project.id)
  console.log(`\ndeleted ${project.name}`)
  console.log('\nto deploy, commit and push the changes')
}
