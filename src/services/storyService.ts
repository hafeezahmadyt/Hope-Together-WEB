import { AdminStory } from '../types/admin';
import { initialMockStories } from '../data/mock/mockStories';

const STORAGE_KEY = 'hope_together_cms_stories';

function getStoredStories(): AdminStory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return initialMockStories;
}

function saveStoredStories(stories: AdminStory[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  } catch {
    // Ignore
  }
}

export const storyService = {
  async getStories(): Promise<AdminStory[]> {
    await new Promise((r) => setTimeout(r, 150));
    return getStoredStories();
  },

  async getStory(id: string): Promise<AdminStory | null> {
    await new Promise((r) => setTimeout(r, 100));
    const stories = getStoredStories();
    return stories.find((s) => s.id === id) || null;
  },

  async createStory(data: Omit<AdminStory, 'id'>): Promise<AdminStory> {
    await new Promise((r) => setTimeout(r, 200));
    const stories = getStoredStories();
    const newStory: AdminStory = {
      ...data,
      id: `story-${Date.now()}`,
      publishedDate: data.isPublished ? new Date().toISOString().split('T')[0] : undefined,
    };
    stories.push(newStory);
    saveStoredStories(stories);
    return newStory;
  },

  async updateStory(id: string, data: Partial<AdminStory>): Promise<AdminStory> {
    await new Promise((r) => setTimeout(r, 200));
    const stories = getStoredStories();
    const index = stories.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Story not found');
    const existing = stories[index];
    const isNowPublished = data.isPublished !== undefined ? data.isPublished : existing.isPublished;
    const publishedDate = isNowPublished && !existing.publishedDate
      ? new Date().toISOString().split('T')[0]
      : data.publishedDate || existing.publishedDate;

    const updated = { ...existing, ...data, isPublished: isNowPublished, publishedDate };
    stories[index] = updated;
    saveStoredStories(stories);
    return updated;
  },

  async deleteStory(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    const stories = getStoredStories();
    const filtered = stories.filter((s) => s.id !== id);
    saveStoredStories(filtered);
  },
};
