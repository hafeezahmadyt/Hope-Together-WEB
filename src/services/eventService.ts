import { AdminEvent } from '../types/admin';
import { initialMockEvents } from '../data/mock/mockEvents';
import { githubSyncService } from './githubSyncService';

const STORAGE_KEY = 'hope_together_cms_events';
const DATA_VERSION_KEY = 'hope_together_events_version';
const CURRENT_VERSION = 'v2_official_events';

function getStoredEvents(): AdminEvent[] {
  try {
    const version = typeof localStorage !== 'undefined' ? localStorage.getItem(DATA_VERSION_KEY) : null;
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;

    // Auto-migrate or initialize to official events dataset if version is missing or old
    if (version !== CURRENT_VERSION || !raw) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockEvents));
        localStorage.setItem(DATA_VERSION_KEY, CURRENT_VERSION);
      }
      return initialMockEvents;
    }

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Fallback
  }
  return initialMockEvents;
}

function saveStoredEvents(events: AdminEvent[]): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      localStorage.setItem(DATA_VERSION_KEY, CURRENT_VERSION);
      window.dispatchEvent(new Event('hope_together_events_changed'));
    }
  } catch {
    // Ignore
  }
}

export const eventService = {
  async getEvents(): Promise<AdminEvent[]> {
    await new Promise((r) => setTimeout(r, 50));
    return getStoredEvents();
  },

  async getEvent(id: string): Promise<AdminEvent | null> {
    await new Promise((r) => setTimeout(r, 50));
    const events = getStoredEvents();
    return events.find((e) => e.id === id) || null;
  },

  async createEvent(data: Omit<AdminEvent, 'id'>): Promise<AdminEvent> {
    await new Promise((r) => setTimeout(r, 100));
    const events = getStoredEvents();

    let finalData = { ...data };

    // Auto-upload cover image to GitHub public/assets/events/ if configured and image is base64
    if (
      githubSyncService.isConfigured() &&
      githubSyncService.getSettings().autoSync &&
      finalData.coverImageUrl &&
      finalData.coverImageUrl.startsWith('data:image/')
    ) {
      try {
        const uploadRes = await githubSyncService.uploadEventImage(finalData.title, finalData.coverImageUrl);
        if (uploadRes.success) {
          finalData.coverImageUrl = uploadRes.coverImageUrl;
        }
      } catch (err) {
        console.warn('GitHub event cover auto-upload warning:', err);
      }
    }

    const newEvent: AdminEvent = {
      ...finalData,
      id: `event-${Date.now()}`,
    };
    events.push(newEvent);
    saveStoredEvents(events);

    // Auto-commit dataset to GitHub if configured
    if (githubSyncService.isConfigured() && githubSyncService.getSettings().autoSync) {
      githubSyncService.syncFullEventsToGithub(events).catch((err) => {
        console.warn('GitHub auto-sync warning for events:', err);
      });
    }

    return newEvent;
  },

  async updateEvent(id: string, data: Partial<AdminEvent>): Promise<AdminEvent> {
    await new Promise((r) => setTimeout(r, 100));
    const events = getStoredEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Event not found');

    let updatedData = { ...data };

    // Auto-upload cover image to GitHub if configured and image is base64
    if (
      githubSyncService.isConfigured() &&
      githubSyncService.getSettings().autoSync &&
      updatedData.coverImageUrl &&
      updatedData.coverImageUrl.startsWith('data:image/')
    ) {
      try {
        const eventTitle = updatedData.title || events[index].title;
        const uploadRes = await githubSyncService.uploadEventImage(eventTitle, updatedData.coverImageUrl);
        if (uploadRes.success) {
          updatedData.coverImageUrl = uploadRes.coverImageUrl;
        }
      } catch (err) {
        console.warn('GitHub event cover auto-upload warning:', err);
      }
    }

    const updated = { ...events[index], ...updatedData };
    events[index] = updated;
    saveStoredEvents(events);

    // Auto-commit dataset to GitHub if configured
    if (githubSyncService.isConfigured() && githubSyncService.getSettings().autoSync) {
      githubSyncService.syncFullEventsToGithub(events).catch((err) => {
        console.warn('GitHub auto-sync warning for events:', err);
      });
    }

    return updated;
  },

  async deleteEvent(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 100));
    const events = getStoredEvents();
    const filtered = events.filter((e) => e.id !== id);
    saveStoredEvents(filtered);

    // Auto-commit dataset to GitHub if configured
    if (githubSyncService.isConfigured() && githubSyncService.getSettings().autoSync) {
      githubSyncService.syncFullEventsToGithub(filtered).catch((err) => {
        console.warn('GitHub auto-sync warning for events:', err);
      });
    }
  },

  async syncToGithub(): Promise<{ success: boolean; deployedCount: number; error?: string }> {
    const events = getStoredEvents();
    const result = await githubSyncService.syncFullEventsToGithub(events);
    if (result.success) {
      const updated = getStoredEvents();
      saveStoredEvents(updated);
    }
    return result;
  },
};
