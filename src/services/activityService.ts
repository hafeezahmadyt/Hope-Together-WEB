import { AdminActivityLog } from '../types/admin';
import { initialMockActivities } from '../data/mock/mockActivities';

const STORAGE_KEY = 'hope_together_cms_activities';

function getStoredActivities(): AdminActivityLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return initialMockActivities;
}

function saveStoredActivities(activities: AdminActivityLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  } catch {
    // Ignore
  }
}

export const activityService = {
  async getActivities(): Promise<AdminActivityLog[]> {
    await new Promise((r) => setTimeout(r, 100));
    return getStoredActivities();
  },

  async logActivity(action: string, entity: string, entityTitle: string): Promise<void> {
    const list = getStoredActivities();
    const newLog: AdminActivityLog = {
      id: `act-${Date.now()}`,
      action,
      entity,
      entityTitle,
      timestamp: 'Just now',
      user: 'Admin',
    };
    saveStoredActivities([newLog, ...list.slice(0, 19)]);
  },
};
