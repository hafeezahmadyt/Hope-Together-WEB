import { AdminProject } from '../types/admin';
import { initialMockProjects } from '../data/mock/mockProjects';

const STORAGE_KEY = 'hope_together_cms_projects';

function getStoredProjects(): AdminProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return initialMockProjects;
}

function saveStoredProjects(projects: AdminProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {
    // Ignore
  }
}

export const projectService = {
  async getProjects(): Promise<AdminProject[]> {
    await new Promise((r) => setTimeout(r, 150));
    return getStoredProjects();
  },

  async getProject(id: string): Promise<AdminProject | null> {
    await new Promise((r) => setTimeout(r, 100));
    const projects = getStoredProjects();
    return projects.find((p) => p.id === id) || null;
  },

  async createProject(data: Omit<AdminProject, 'id'>): Promise<AdminProject> {
    await new Promise((r) => setTimeout(r, 200));
    const projects = getStoredProjects();
    const newProject: AdminProject = {
      ...data,
      id: `proj-${Date.now()}`,
    };
    projects.push(newProject);
    saveStoredProjects(projects);
    return newProject;
  },

  async updateProject(id: string, data: Partial<AdminProject>): Promise<AdminProject> {
    await new Promise((r) => setTimeout(r, 200));
    const projects = getStoredProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Project not found');
    const updated = { ...projects[index], ...data };
    projects[index] = updated;
    saveStoredProjects(projects);
    return updated;
  },

  async deleteProject(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    const projects = getStoredProjects();
    const filtered = projects.filter((p) => p.id !== id);
    saveStoredProjects(filtered);
  },
};
