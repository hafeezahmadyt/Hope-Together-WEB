import { AdminPartner } from '../types/admin';
import { initialMockPartners } from '../data/mock/mockPartners';

const STORAGE_KEY = 'hope_together_cms_partners';

function getStoredPartners(): AdminPartner[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return initialMockPartners;
}

function saveStoredPartners(partners: AdminPartner[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(partners));
  } catch {
    // Ignore
  }
}

export const partnerService = {
  async getPartners(): Promise<AdminPartner[]> {
    await new Promise((r) => setTimeout(r, 150));
    return getStoredPartners();
  },

  async getPartner(id: string): Promise<AdminPartner | null> {
    await new Promise((r) => setTimeout(r, 100));
    const partners = getStoredPartners();
    return partners.find((p) => p.id === id) || null;
  },

  async createPartner(data: Omit<AdminPartner, 'id'>): Promise<AdminPartner> {
    await new Promise((r) => setTimeout(r, 200));
    const partners = getStoredPartners();
    const newPartner: AdminPartner = {
      ...data,
      id: `partner-${Date.now()}`,
    };
    partners.push(newPartner);
    saveStoredPartners(partners);
    return newPartner;
  },

  async updatePartner(id: string, data: Partial<AdminPartner>): Promise<AdminPartner> {
    await new Promise((r) => setTimeout(r, 200));
    const partners = getStoredPartners();
    const index = partners.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Partner not found');
    const updated = { ...partners[index], ...data };
    partners[index] = updated;
    saveStoredPartners(partners);
    return updated;
  },

  async deletePartner(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    const partners = getStoredPartners();
    const filtered = partners.filter((p) => p.id !== id);
    saveStoredPartners(filtered);
  },
};
