import { AdminProject } from '../types/admin';
import { initialMockProjects } from '../data/mock/mockProjects';
import { githubSyncService } from './githubSyncService';

const STORAGE_KEY = 'hope_together_cms_projects';
const DATA_VERSION_KEY = 'hope_together_projects_version';
const DELETED_PROJECTS_KEY = 'hope_together_deleted_project_ids';
const CURRENT_VERSION = 'v3_clean_authentic_projects';

const MOCK_PROJECT_IDS = new Set(['proj-1', 'proj-2', 'proj-3', 'proj-4']);

function isMockProject(p: Partial<AdminProject>): boolean {
  if (p.id && MOCK_PROJECT_IDS.has(p.id)) return true;
  const slug = (p.slug || '').toLowerCase();
  if (
    slug.includes('youth-vocational-skill') ||
    slug.includes('women-legal-awareness') ||
    slug.includes('child-protection-inclusive') ||
    slug.includes('grassroots-ecological-tree') ||
    slug.includes('sample-')
  ) {
    return true;
  }
  return false;
}

function getDeletedProjectIds(): Set<string> {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(DELETED_PROJECTS_KEY) : null;
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch {
    // Ignore
  }
  return new Set();
}

function markProjectAsDeleted(id: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      const deleted = getDeletedProjectIds();
      deleted.add(id);
      localStorage.setItem(DELETED_PROJECTS_KEY, JSON.stringify(Array.from(deleted)));
    }
  } catch {
    // Ignore
  }
}

function getStoredProjects(): AdminProject[] {
  try {
    const deletedIds = getDeletedProjectIds();
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed: AdminProject[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Strip out mock projects and user-deleted projects
        const cleaned = parsed.filter((p) => !isMockProject(p) && !deletedIds.has(p.id));

        const storedIds = new Set(cleaned.map((p) => p.id || p.title));
        const missingOfficial = initialMockProjects.filter(
          (p) => !isMockProject(p) && !deletedIds.has(p.id) && !storedIds.has(p.id || p.title)
        );

        let needsUpdate = missingOfficial.length > 0 || cleaned.length !== parsed.length;
        const merged = cleaned.map((p) => {
          const official = initialMockProjects.find((o) => o.id === p.id || o.title === p.title || o.slug === p.slug);
          if (official) {
            let updated = { ...p };

            if (
              official.coverImageUrl &&
              (!p.coverImageUrl || p.coverImageUrl.startsWith('data:image/') || p.coverImageUrl !== official.coverImageUrl)
            ) {
              updated.coverImageUrl = official.coverImageUrl;
              needsUpdate = true;
            }
            if (official.images && official.images.length > 0) {
              if (!p.images || p.images.length === 0 || JSON.stringify(p.images) !== JSON.stringify(official.images)) {
                updated.images = official.images;
                needsUpdate = true;
              }
            } else if (!updated.images && updated.coverImageUrl) {
              updated.images = [updated.coverImageUrl];
              needsUpdate = true;
            }

            if (official.fundingReceived && official.fundingReceived !== p.fundingReceived) {
              updated.fundingReceived = official.fundingReceived;
              needsUpdate = true;
            }
            if (official.beneficiariesCount && official.beneficiariesCount !== p.beneficiariesCount) {
              updated.beneficiariesCount = official.beneficiariesCount;
              needsUpdate = true;
            }
            if (official.donorOrPartner && official.donorOrPartner !== p.donorOrPartner) {
              updated.donorOrPartner = official.donorOrPartner;
              needsUpdate = true;
            }
            if (official.status && official.status !== p.status) {
              updated.status = official.status;
              needsUpdate = true;
            }
            if (official.description && official.description !== p.description) {
              updated.description = official.description;
              needsUpdate = true;
            }
            if (official.location && official.location !== p.location) {
              updated.location = official.location;
              needsUpdate = true;
            }

            return updated;
          }

          if (!p.images && p.coverImageUrl) {
            needsUpdate = true;
            return { ...p, images: [p.coverImageUrl] };
          }
          return p;
        });

        const finalProjects = [...merged, ...missingOfficial];

        if (needsUpdate && typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(finalProjects));
          localStorage.setItem(DATA_VERSION_KEY, CURRENT_VERSION);
        }

        return finalProjects;
      }
    }
  } catch {
    // Fallback gracefully
  }

  const validInitial = initialMockProjects.filter((p) => !isMockProject(p));
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validInitial));
      localStorage.setItem(DATA_VERSION_KEY, CURRENT_VERSION);
    } catch {}
  }
  return validInitial;
}

function saveStoredProjects(projects: AdminProject[]): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      localStorage.setItem(DATA_VERSION_KEY, CURRENT_VERSION);
      window.dispatchEvent(new Event('hope_together_projects_changed'));
    }
  } catch {
    // Ignore
  }
}

export const projectService = {
  async getProjects(): Promise<AdminProject[]> {
    await new Promise((r) => setTimeout(r, 50));
    return getStoredProjects();
  },

  async getProject(id: string): Promise<AdminProject | null> {
    await new Promise((r) => setTimeout(r, 50));
    const projects = getStoredProjects();
    return projects.find((p) => p.id === id) || null;
  },

  async createProject(data: Omit<AdminProject, 'id'>): Promise<AdminProject> {
    await new Promise((r) => setTimeout(r, 80));
    const projects = getStoredProjects();

    let finalData = { ...data };

    // Standardize images array (max 5 pictures)
    let images = Array.isArray(finalData.images) && finalData.images.length > 0
      ? [...finalData.images.slice(0, 5)]
      : (finalData.coverImageUrl ? [finalData.coverImageUrl] : []);

    if (images.length > 0) {
      finalData.coverImageUrl = images[0];
    }
    finalData.images = images;

    const newProject: AdminProject = {
      ...finalData,
      id: `proj-${Date.now()}`,
    };
    projects.push(newProject);
    saveStoredProjects(projects);

    // Auto-commit dataset & pictures to GitHub if configured
    if (githubSyncService.isConfigured() && githubSyncService.getSettings().autoSync) {
      try {
        const syncRes = await githubSyncService.syncFullProjectsToGithub(projects);
        if (syncRes.success && syncRes.projects) {
          saveStoredProjects(syncRes.projects);
          const found = syncRes.projects.find((p) => p.id === newProject.id);
          if (found) return found;
        }
      } catch (err) {
        console.warn('GitHub auto-sync warning for project creation:', err);
      }
    }

    return newProject;
  },

  async updateProject(id: string, data: Partial<AdminProject>): Promise<AdminProject> {
    await new Promise((r) => setTimeout(r, 80));
    const projects = getStoredProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Project not found');

    let updatedData = { ...data };

    // Normalize images (max 5)
    if (updatedData.images !== undefined) {
      let images = [...(updatedData.images || []).slice(0, 5)];
      if (images.length > 0 && !updatedData.coverImageUrl) {
        updatedData.coverImageUrl = images[0];
      }
      updatedData.images = images;
    } else if (updatedData.coverImageUrl && (!projects[index].images || !projects[index].images.length)) {
      updatedData.images = [updatedData.coverImageUrl];
    }

    const updated = { ...projects[index], ...updatedData };
    projects[index] = updated;
    saveStoredProjects(projects);

    // Auto-commit dataset & pictures to GitHub if configured
    if (githubSyncService.isConfigured() && githubSyncService.getSettings().autoSync) {
      try {
        const syncRes = await githubSyncService.syncFullProjectsToGithub(projects);
        if (syncRes.success && syncRes.projects) {
          saveStoredProjects(syncRes.projects);
          const found = syncRes.projects.find((p) => p.id === id);
          if (found) return found;
        }
      } catch (err) {
        console.warn('GitHub auto-sync warning for project update:', err);
      }
    }

    return updated;
  },

  async deleteProject(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 80));
    markProjectAsDeleted(id);
    const projects = getStoredProjects();
    const filtered = projects.filter((p) => p.id !== id);
    saveStoredProjects(filtered);

    // Auto-commit dataset to GitHub if configured
    if (githubSyncService.isConfigured() && githubSyncService.getSettings().autoSync) {
      try {
        const syncRes = await githubSyncService.syncFullProjectsToGithub(filtered);
        if (syncRes.success && syncRes.projects) {
          saveStoredProjects(syncRes.projects);
        }
      } catch (err) {
        console.warn('GitHub auto-sync warning for project deletion:', err);
      }
    }
  },

  async syncToGithub(): Promise<{ success: boolean; deployedCount: number; error?: string }> {
    const projects = getStoredProjects();
    const result = await githubSyncService.syncFullProjectsToGithub(projects);
    if (result.success && result.projects) {
      saveStoredProjects(result.projects);
    }
    return result;
  },
};
