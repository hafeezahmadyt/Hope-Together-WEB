import { AdminSiteSettings } from '../types/admin';
import { initialMockSettings } from '../data/mock/mockSettings';

const STORAGE_KEY = 'hope_together_cms_settings';

function getStoredSettings(): AdminSiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return initialMockSettings;
}

function saveStoredSettings(settings: AdminSiteSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore
  }
}

export const settingsService = {
  async getSettings(): Promise<AdminSiteSettings> {
    await new Promise((r) => setTimeout(r, 100));
    return getStoredSettings();
  },

  async updateSettings(data: Partial<AdminSiteSettings>): Promise<AdminSiteSettings> {
    await new Promise((r) => setTimeout(r, 200));
    const current = getStoredSettings();
    const updated = { ...current, ...data };
    saveStoredSettings(updated);
    return updated;
  },
};
