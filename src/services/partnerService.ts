import { AdminPartner } from '../types/admin';
import { initialMockPartners } from '../data/mock/mockPartners';
import { githubSyncService } from './githubSyncService';

const STORAGE_KEY = 'hope_together_cms_partners';
const DATA_VERSION_KEY = 'hope_together_partners_version';
const CURRENT_VERSION = 'v2_official_partners';

function getStoredPartners(): AdminPartner[] {
  try {
    const version = typeof localStorage !== 'undefined' ? localStorage.getItem(DATA_VERSION_KEY) : null;
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;

    // Auto-migrate or initialize to official partners dataset if version is missing or old
    if (version !== CURRENT_VERSION || !raw) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockPartners));
        localStorage.setItem(DATA_VERSION_KEY, CURRENT_VERSION);
      }
      return initialMockPartners;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Fallback
  }
  return initialMockPartners;
}

function saveStoredPartners(partners: AdminPartner[]): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(partners));
      localStorage.setItem(DATA_VERSION_KEY, CURRENT_VERSION);
      window.dispatchEvent(new Event('hope_together_partners_changed'));
    }
  } catch {
    // Ignore
  }
}

export const partnerService = {
  async getPartners(): Promise<AdminPartner[]> {
    await new Promise((r) => setTimeout(r, 50));
    return getStoredPartners();
  },

  async getPartner(id: string): Promise<AdminPartner | null> {
    await new Promise((r) => setTimeout(r, 50));
    const partners = getStoredPartners();
    return partners.find((p) => p.id === id) || null;
  },

  async createPartner(data: Omit<AdminPartner, 'id'>): Promise<AdminPartner> {
    await new Promise((r) => setTimeout(r, 100));
    const partners = getStoredPartners();

    let finalData = { ...data };

    // Auto-upload logo to GitHub public/assets/partners/ if configured and logo is base64
    if (
      githubSyncService.isConfigured() &&
      githubSyncService.getSettings().autoSync &&
      finalData.logoUrl &&
      finalData.logoUrl.startsWith('data:image/')
    ) {
      try {
        const uploadRes = await githubSyncService.uploadPartnerLogo(finalData.name, finalData.logoUrl);
        if (uploadRes.success) {
          finalData.logoUrl = uploadRes.logoUrl;
        }
      } catch (err) {
        console.warn('GitHub partner logo auto-upload warning:', err);
      }
    }

    const newPartner: AdminPartner = {
      ...finalData,
      id: `partner-${Date.now()}`,
    };
    partners.push(newPartner);
    saveStoredPartners(partners);

    // Auto-commit dataset to GitHub if configured
    if (githubSyncService.isConfigured() && githubSyncService.getSettings().autoSync) {
      githubSyncService.syncFullPartnersToGithub(partners).catch((err) => {
        console.warn('GitHub auto-sync warning for partners:', err);
      });
    }

    return newPartner;
  },

  async updatePartner(id: string, data: Partial<AdminPartner>): Promise<AdminPartner> {
    await new Promise((r) => setTimeout(r, 100));
    const partners = getStoredPartners();
    const index = partners.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Partner not found');

    let updatedData = { ...data };

    // Auto-upload logo to GitHub if configured and logo is base64
    if (
      githubSyncService.isConfigured() &&
      githubSyncService.getSettings().autoSync &&
      updatedData.logoUrl &&
      updatedData.logoUrl.startsWith('data:image/')
    ) {
      try {
        const partnerName = updatedData.name || partners[index].name;
        const uploadRes = await githubSyncService.uploadPartnerLogo(partnerName, updatedData.logoUrl);
        if (uploadRes.success) {
          updatedData.logoUrl = uploadRes.logoUrl;
        }
      } catch (err) {
        console.warn('GitHub partner logo auto-upload warning:', err);
      }
    }

    const updated = { ...partners[index], ...updatedData };
    partners[index] = updated;
    saveStoredPartners(partners);

    // Auto-commit dataset to GitHub if configured
    if (githubSyncService.isConfigured() && githubSyncService.getSettings().autoSync) {
      githubSyncService.syncFullPartnersToGithub(partners).catch((err) => {
        console.warn('GitHub auto-sync warning for partners:', err);
      });
    }

    return updated;
  },

  async deletePartner(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 100));
    const partners = getStoredPartners();
    const filtered = partners.filter((p) => p.id !== id);
    saveStoredPartners(filtered);

    // Auto-commit dataset to GitHub if configured
    if (githubSyncService.isConfigured() && githubSyncService.getSettings().autoSync) {
      githubSyncService.syncFullPartnersToGithub(filtered).catch((err) => {
        console.warn('GitHub auto-sync warning for partners:', err);
      });
    }
  },

  async syncToGithub(): Promise<{ success: boolean; deployedCount: number; error?: string }> {
    const partners = getStoredPartners();
    const result = await githubSyncService.syncFullPartnersToGithub(partners);
    if (result.success) {
      const updated = getStoredPartners();
      saveStoredPartners(updated);
    }
    return result;
  },
};
