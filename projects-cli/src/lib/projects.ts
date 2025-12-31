import { readFile, writeFile } from 'fs/promises'
import { PROJECTS_JSON_PATH } from '../utils/config'
import type { Project, ProjectsData } from './types'

export async function loadProjects(): Promise<ProjectsData> {
  const content = await readFile(PROJECTS_JSON_PATH, 'utf-8')
  return JSON.parse(content)
}

export async function saveProjects(data: ProjectsData): Promise<void> {
  data.lastUpdated = new Date().toISOString()
  await writeFile(PROJECTS_JSON_PATH, JSON.stringify(data, null, 2) + '\n')
}

export async function getProject(id: string): Promise<Project | undefined> {
  const data = await loadProjects()
  return data.projects.find(p => p.id === id)
}

export async function addProject(project: Project): Promise<void> {
  const data = await loadProjects()

  if (data.projects.some(p => p.id === project.id)) {
    throw new Error(`project with id "${project.id}" already exists`)
  }

  data.projects.push(project)
  await saveProjects(data)
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  const data = await loadProjects()
  const idx = data.projects.findIndex(p => p.id === id)

  if (idx === -1) {
    throw new Error(`project "${id}" not found`)
  }

  data.projects[idx] = {
    ...data.projects[idx],
    ...updates,
    id, // prevent id change
    updatedAt: new Date().toISOString()
  }

  await saveProjects(data)
  return data.projects[idx]
}

export async function deleteProject(id: string): Promise<void> {
  const data = await loadProjects()
  const idx = data.projects.findIndex(p => p.id === id)

  if (idx === -1) {
    throw new Error(`project "${id}" not found`)
  }

  data.projects.splice(idx, 1)
  await saveProjects(data)
}
