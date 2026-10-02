import { AdminTeamMember } from '../types/admin';
import { initialMockTeamMembers } from '../data/mock/mockTeam';

const STORAGE_KEY = 'hope_together_cms_team';

function getStoredMembers(): AdminTeamMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return initialMockTeamMembers;
}

function saveStoredMembers(members: AdminTeamMember[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  } catch {
    // Ignore
  }
}

export const teamService = {
  async getTeamMembers(): Promise<AdminTeamMember[]> {
    await new Promise((r) => setTimeout(r, 150));
    return getStoredMembers();
  },

  async getTeamMember(id: string): Promise<AdminTeamMember | null> {
    await new Promise((r) => setTimeout(r, 100));
    const members = getStoredMembers();
    return members.find((m) => m.id === id) || null;
  },

  async createTeamMember(data: Omit<AdminTeamMember, 'id'>): Promise<AdminTeamMember> {
    await new Promise((r) => setTimeout(r, 200));
    const members = getStoredMembers();
    const newMember: AdminTeamMember = {
      ...data,
      id: `team-${Date.now()}`,
    };
    members.push(newMember);
    saveStoredMembers(members);
    return newMember;
  },

  async updateTeamMember(id: string, data: Partial<AdminTeamMember>): Promise<AdminTeamMember> {
    await new Promise((r) => setTimeout(r, 200));
    const members = getStoredMembers();
    const index = members.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Team member not found');
    const updated = { ...members[index], ...data };
    members[index] = updated;
    saveStoredMembers(members);
    return updated;
  },

  async deleteTeamMember(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    const members = getStoredMembers();
    const filtered = members.filter((m) => m.id !== id);
    saveStoredMembers(filtered);
  },
};
