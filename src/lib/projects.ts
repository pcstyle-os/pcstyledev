import projectsData from "../../data/projects.json";
import type { ProjectInfo } from "@/types/project";

// little helper bo nie chce mi się pisać fetchy
export function loadProjects(): ProjectInfo[] {
  return projectsData as ProjectInfo[];
}

export function findProject(id: string) {
  return loadProjects().find((project) => project.id === id);
}

