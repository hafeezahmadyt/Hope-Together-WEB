import { AdminSiteSettings } from '../types/admin';
import { initialMockSettings } from '../data/mock/mockSettings';

const STORAGE_KEY = 'hope_together_cms_settings';

function getStoredSettings(): AdminSiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      let updated = false;
      if (parsed.contactEmail === 'info@hopetogether.org.pk' || !parsed.contactEmail) {
        parsed.contactEmail = initialMockSettings.contactEmail;
        updated = true;
      }
      if (
        parsed.address === 'Regional Office: Khyber Pakhtunkhwa, Pakistan' ||
        !parsed.address
      ) {
        parsed.address = initialMockSettings.address;
        updated = true;
      }
      if (updated) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        } catch {
          // If storage quota or permission fails, still return parsed data
        }
      }
      return parsed;
    }
  } catch {
    // Fallback
  }
  return initialMockSettings;
}

function saveStoredSettings(settings: AdminSiteSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('hope_together_settings_changed'));
    }
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
