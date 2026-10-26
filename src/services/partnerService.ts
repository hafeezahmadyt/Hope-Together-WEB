import { AdminPartner } from '../types/admin';
import { initialMockPartners } from '../data/mock/mockPartners';

const STORAGE_KEY = 'hope_together_cms_partners';

function getStoredPartners(): AdminPartner[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const exactLegacySamples: AdminPartner[] = [
          {
            id: 'partner-1',
            name: 'Sample Community Foundation',
            category: 'Community Partners',
            categorySubtitle: '[Grassroots Network]',
            description: 'Sample community alliance supporting grassroots awareness and youth engagement.',
            websiteUrl: 'https://example.org',
            displayOrder: 1,
            isActive: true,
          },
          {
            id: 'partner-2',
            name: 'Sample Academic Institute',
            category: 'Education Partners',
            categorySubtitle: '[Higher Education Alliance]',
            description: 'Sample university partnership for vocational curriculum guidance and digital training.',
            websiteUrl: 'https://example.edu',
            displayOrder: 2,
            isActive: true,
          },
          {
            id: 'partner-3',
            name: 'Sample Regional Development Council',
            category: 'Institutional Partners',
            categorySubtitle: '[Civic Coalition]',
            description: 'Sample regional coalition collaborating on disaster preparedness protocols.',
            websiteUrl: 'https://example.gov.local',
            displayOrder: 3,
            isActive: true,
          },
          {
            id: 'partner-4',
            name: 'Sample Environmental Action Trust',
            category: 'Development Partners',
            categorySubtitle: '[Ecological Coalition]',
            description: 'Sample civil society partner focused on climate resilience and eco-restoration.',
            websiteUrl: 'https://example.org/eco',
            displayOrder: 4,
            isActive: false,
          },
        ];

        const isUnchangedLegacySample = (p: AdminPartner) => {
          const match = exactLegacySamples.find((sample) => sample.id === p.id);
          if (!match) return false;
          return (
            p.name === match.name &&
            p.category === match.category &&
            p.categorySubtitle === match.categorySubtitle &&
            p.description === match.description &&
            p.websiteUrl === match.websiteUrl &&
            p.displayOrder === match.displayOrder &&
            p.isActive === match.isActive &&
            !p.logoUrl
          );
        };

        const hasLegacy = parsed.some(isUnchangedLegacySample);
        if (hasLegacy) {
          // Remove only untouched legacy sample records and preserve any customized/administrator-added partners
          const customPartners = parsed.filter((p) => !isUnchangedLegacySample(p));
          const existingIds = new Set(customPartners.map((p) => p.id));
          const newOfficialPartners = initialMockPartners.filter((p) => !existingIds.has(p.id));
          const merged = [...customPartners, ...newOfficialPartners];

          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch {
            // Return merged even if storage fails
          }
          return merged;
        }
        return parsed;
      }
    }
  } catch {
    // Fallback
  }
  return initialMockPartners;
}

function saveStoredPartners(partners: AdminPartner[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(partners));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('hope_together_partners_changed'));
    }
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
