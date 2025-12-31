export type ProjectStatus = 'active' | 'maintenance' | 'experimental' | 'prototype' | 'disabled'

export interface Project {
  id: string
  name: string
  desc: string
  stack: string[]
  link?: string
  github?: string
  status: ProjectStatus
  icon: string
  createdAt: string
  updatedAt: string
}

export interface ProjectsData {
  projects: Project[]
  lastUpdated: string
}

// .proj file format (without timestamps, CLI adds those)
export interface ProjFile {
  id: string
  name: string
  desc: string
  stack: string[]
  link?: string
  github?: string
  status: ProjectStatus
  icon: string
}
