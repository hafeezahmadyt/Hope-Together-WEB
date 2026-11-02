import { AdminEvent } from '../types/admin';
import { initialMockEvents } from '../data/mock/mockEvents';
import { githubSyncService } from './githubSyncService';

const STORAGE_KEY = 'hope_together_cms_events';
const DATA_VERSION_KEY = 'hope_together_events_version';
const CURRENT_VERSION = 'v4_clean_official_events';

const MOCK_EVENT_IDS = new Set(['event-1', 'event-2', 'event-3']);

function isMockEvent(e: Partial<AdminEvent>): boolean {
  if (e.id && MOCK_EVENT_IDS.has(e.id)) return true;
  const slug = (e.slug || '').toLowerCase();
  if (
    slug.includes('example-community') ||
    slug.includes('sample-women') ||
    slug.includes('draft-ecological')
  ) {
    return true;
  }
  return false;
}

function getStoredEvents(): AdminEvent[] {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed: AdminEvent[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Strip out any obsolete mock events
        const cleaned = parsed.filter((e) => !isMockEvent(e));
        const storedIds = new Set(cleaned.map((e) => e.id || e.title));
        const missingOfficial = initialMockEvents.filter((e) => !storedIds.has(e.id || e.title));

        let needsUpdate = missingOfficial.length > 0 || cleaned.length !== parsed.length;
        const merged = cleaned.map((e) => {
          const official = initialMockEvents.find((o) => o.id === e.id || o.title === e.title || o.slug === e.slug);
          if (official) {
            let updated = { ...e };
            // Ensure status syncs (e.g. Published / Completed)
            if (official.status && official.status !== e.status) {
              updated.status = official.status;
              needsUpdate = true;
            }
            // Ensure cover image is updated if local is base64 or different
            if (
              official.coverImageUrl &&
              (!e.coverImageUrl || e.coverImageUrl.startsWith('data:image/') || e.coverImageUrl !== official.coverImageUrl)
            ) {
              updated.coverImageUrl = official.coverImageUrl;
              needsUpdate = true;
            }
            // Ensure images array is synced if official has images
            if (official.images && official.images.length > 0) {
              if (!e.images || e.images.length === 0 || JSON.stringify(e.images) !== JSON.stringify(official.images)) {
                updated.images = official.images;
                needsUpdate = true;
              }
            } else if (!updated.images && updated.coverImageUrl) {
              updated.images = [updated.coverImageUrl];
              needsUpdate = true;
            }
            // Sync details if updated
            if (official.description && official.description !== e.description) {
              updated.description = official.description;
              needsUpdate = true;
            }
            if (official.eventDate && official.eventDate !== e.eventDate) {
              updated.eventDate = official.eventDate;
              needsUpdate = true;
            }
            if (official.eventTime && official.eventTime !== e.eventTime) {
              updated.eventTime = official.eventTime;
              needsUpdate = true;
            }
            if (official.location && official.location !== e.location) {
              updated.location = official.location;
              needsUpdate = true;
            }
            return updated;
          }
          if (!e.images && e.coverImageUrl) {
            needsUpdate = true;
            return { ...e, images: [e.coverImageUrl] };
          }
          return e;
        });

        const finalEvents = [...merged, ...missingOfficial];

        if (needsUpdate && typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(finalEvents));
          localStorage.setItem(DATA_VERSION_KEY, CURRENT_VERSION);
        }

        return finalEvents;
      }
    }
  } catch {
    // Fallback gracefully
  }

  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockEvents));
      localStorage.setItem(DATA_VERSION_KEY, CURRENT_VERSION);
    } catch {}
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
    await new Promise((r) => setTimeout(r, 80));
    const events = getStoredEvents();

    let finalData = { ...data };

    // Standardize images array (max 5 pictures)
    let images = Array.isArray(finalData.images) && finalData.images.length > 0
      ? [...finalData.images.slice(0, 5)]
      : (finalData.coverImageUrl ? [finalData.coverImageUrl] : []);

    if (images.length > 0) {
      finalData.coverImageUrl = images[0];
    }
    finalData.images = images;

    const newEvent: AdminEvent = {
      ...finalData,
      id: `event-${Date.now()}`,
    };
    events.push(newEvent);
    saveStoredEvents(events);

    // Auto-commit dataset & pictures to GitHub if configured
    if (githubSyncService.isConfigured() && githubSyncService.getSettings().autoSync) {
      try {
        const syncRes = await githubSyncService.syncFullEventsToGithub(events);
        if (syncRes.success && syncRes.events) {
          saveStoredEvents(syncRes.events);
          const found = syncRes.events.find((e) => e.id === newEvent.id);
          if (found) return found;
        }
      } catch (err) {
        console.warn('GitHub auto-sync warning for event creation:', err);
      }
    }

    return newEvent;
  },

  async updateEvent(id: string, data: Partial<AdminEvent>): Promise<AdminEvent> {
    await new Promise((r) => setTimeout(r, 80));
    const events = getStoredEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Event not found');

    let updatedData = { ...data };

    // Normalize images (max 5)
    if (updatedData.images !== undefined) {
      let images = [...(updatedData.images || []).slice(0, 5)];
      if (images.length > 0 && !updatedData.coverImageUrl) {
        updatedData.coverImageUrl = images[0];
      }
      updatedData.images = images;
    } else if (updatedData.coverImageUrl && (!events[index].images || !events[index].images.length)) {
      updatedData.images = [updatedData.coverImageUrl];
    }

    const updated = { ...events[index], ...updatedData };
    events[index] = updated;
    saveStoredEvents(events);

    // Auto-commit dataset & pictures to GitHub if configured
    if (githubSyncService.isConfigured() && githubSyncService.getSettings().autoSync) {
      try {
        const syncRes = await githubSyncService.syncFullEventsToGithub(events);
        if (syncRes.success && syncRes.events) {
          saveStoredEvents(syncRes.events);
          const found = syncRes.events.find((e) => e.id === id);
          if (found) return found;
        }
      } catch (err) {
        console.warn('GitHub auto-sync warning for event update:', err);
      }
    }

    return updated;
  },

  async deleteEvent(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 80));
    const events = getStoredEvents();
    const filtered = events.filter((e) => e.id !== id);
    saveStoredEvents(filtered);

    // Auto-commit dataset to GitHub if configured
    if (githubSyncService.isConfigured() && githubSyncService.getSettings().autoSync) {
      try {
        const syncRes = await githubSyncService.syncFullEventsToGithub(filtered);
        if (syncRes.success && syncRes.events) {
          saveStoredEvents(syncRes.events);
        }
      } catch (err) {
        console.warn('GitHub auto-sync warning for event deletion:', err);
      }
    }
  },

  async syncToGithub(): Promise<{ success: boolean; deployedCount: number; error?: string }> {
    const events = getStoredEvents();
    const result = await githubSyncService.syncFullEventsToGithub(events);
    if (result.success && result.events) {
      saveStoredEvents(result.events);
    }
    return result;
  },
};
