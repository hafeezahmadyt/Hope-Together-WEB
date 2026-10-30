import { AdminTeamMember } from '../types/admin';
import { initialMockTeamMembers } from '../data/mock/mockTeam';
import { githubSyncService } from './githubSyncService';

const STORAGE_KEY = 'hope_together_cms_team';
const DATA_VERSION_KEY = 'hope_together_team_version';
const CURRENT_VERSION = 'v2_official_team';

function getStoredMembers(): AdminTeamMember[] {
  try {
    const version = typeof localStorage !== 'undefined' ? localStorage.getItem(DATA_VERSION_KEY) : null;
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;

    // Auto-migrate or initialize to official team dataset if version is missing or old
    if (version !== CURRENT_VERSION || !raw) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockTeamMembers));
        localStorage.setItem(DATA_VERSION_KEY, CURRENT_VERSION);
      }
      return initialMockTeamMembers;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Fallback
  }
  return initialMockTeamMembers;
}

function saveStoredMembers(members: AdminTeamMember[]): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
      localStorage.setItem(DATA_VERSION_KEY, CURRENT_VERSION);
      window.dispatchEvent(new Event('hope_together_team_changed'));
    }
  } catch {
    // Ignore
  }
}

export const teamService = {
  async getTeamMembers(): Promise<AdminTeamMember[]> {
    await new Promise((r) => setTimeout(r, 50));
    return getStoredMembers();
  },

  async getTeamMember(id: string): Promise<AdminTeamMember | null> {
    await new Promise((r) => setTimeout(r, 50));
    const members = getStoredMembers();
    return members.find((m) => m.id === id) || null;
  },

  async createTeamMember(data: Omit<AdminTeamMember, 'id'>): Promise<AdminTeamMember> {
    await new Promise((r) => setTimeout(r, 100));
    const members = getStoredMembers();

    let finalData = { ...data };

    // Auto-upload photo to GitHub if configured and photo is base64
    if (
      githubSyncService.isConfigured() &&
      githubSyncService.getSettings().autoSync &&
      finalData.photoUrl &&
      finalData.photoUrl.startsWith('data:image/')
    ) {
      try {
        const uploadRes = await githubSyncService.uploadPhoto(finalData.name, finalData.photoUrl);
        if (uploadRes.success) {
          finalData.photoUrl = uploadRes.photoUrl;
        }
      } catch (err) {
        console.warn('GitHub photo auto-upload warning:', err);
      }
    }

    const newMember: AdminTeamMember = {
      ...finalData,
      id: `team-${Date.now()}`,
    };
    members.push(newMember);
    saveStoredMembers(members);

    // Auto-commit dataset to GitHub if configured
    if (githubSyncService.isConfigured() && githubSyncService.getSettings().autoSync) {
      githubSyncService.syncFullTeamToGithub(members).catch((err) => {
        console.warn('GitHub auto-sync warning:', err);
      });
    }

    return newMember;
  },

  async updateTeamMember(id: string, data: Partial<AdminTeamMember>): Promise<AdminTeamMember> {
    await new Promise((r) => setTimeout(r, 100));
    const members = getStoredMembers();
    const index = members.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Team member not found');

    let updatedData = { ...data };

    // Auto-upload photo to GitHub if configured and photo is base64
    if (
      githubSyncService.isConfigured() &&
      githubSyncService.getSettings().autoSync &&
      updatedData.photoUrl &&
      updatedData.photoUrl.startsWith('data:image/')
    ) {
      try {
        const memberName = updatedData.name || members[index].name;
        const uploadRes = await githubSyncService.uploadPhoto(memberName, updatedData.photoUrl);
        if (uploadRes.success) {
          updatedData.photoUrl = uploadRes.photoUrl;
        }
      } catch (err) {
        console.warn('GitHub photo auto-upload warning:', err);
      }
    }

    const updated = { ...members[index], ...updatedData };
    members[index] = updated;
    saveStoredMembers(members);

    // Auto-commit dataset to GitHub if configured
    if (githubSyncService.isConfigured() && githubSyncService.getSettings().autoSync) {
      githubSyncService.syncFullTeamToGithub(members).catch((err) => {
        console.warn('GitHub auto-sync warning:', err);
      });
    }

    return updated;
  },

  async deleteTeamMember(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 100));
    const members = getStoredMembers();
    const filtered = members.filter((m) => m.id !== id);
    saveStoredMembers(filtered);

    // Auto-commit dataset to GitHub if configured
    if (githubSyncService.isConfigured() && githubSyncService.getSettings().autoSync) {
      githubSyncService.syncFullTeamToGithub(filtered).catch((err) => {
        console.warn('GitHub auto-sync warning:', err);
      });
    }
  },

  async syncToGithub(): Promise<{ success: boolean; deployedCount: number; error?: string }> {
    const members = getStoredMembers();
    const result = await githubSyncService.syncFullTeamToGithub(members);
    if (result.success) {
      // Refresh local copy with any replaced structured paths
      const updatedMembers = getStoredMembers();
      saveStoredMembers(updatedMembers);
    }
    return result;
  },
};
