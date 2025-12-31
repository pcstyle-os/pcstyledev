import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { cors } from 'hono/cors'
import projectsData from '../data/projects/projects.json'
import type { Project } from '../lib/types'

export const config = { runtime: 'nodejs' }

const app = new Hono().basePath('/api')

const projects = projectsData.projects as Project[]

app.use('*', cors())

// list all projects
app.get('/projects', (c) => {
  return c.json(projects)
})

// get single project by id
app.get('/projects/:id', (c) => {
  const id = c.req.param('id')
  const project = projects.find((p) => p.id === id)

  if (!project) {
    return c.json({ error: 'project not found' }, 404)
  }

  return c.json(project)
})

// get projects metadata
app.get('/projects/meta', (c) => {
  return c.json({
    count: projectsData.projects.length,
    lastUpdated: projectsData.lastUpdated
  })
})

export default handle(app)
