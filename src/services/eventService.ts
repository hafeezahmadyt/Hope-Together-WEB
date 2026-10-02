import { AdminEvent } from '../types/admin';
import { initialMockEvents } from '../data/mock/mockEvents';

const STORAGE_KEY = 'hope_together_cms_events';

function getStoredEvents(): AdminEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return initialMockEvents;
}

function saveStoredEvents(events: AdminEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Ignore
  }
}

export const eventService = {
  async getEvents(): Promise<AdminEvent[]> {
    await new Promise((r) => setTimeout(r, 150));
    return getStoredEvents();
  },

  async getEvent(id: string): Promise<AdminEvent | null> {
    await new Promise((r) => setTimeout(r, 100));
    const events = getStoredEvents();
    return events.find((e) => e.id === id) || null;
  },

  async createEvent(data: Omit<AdminEvent, 'id'>): Promise<AdminEvent> {
    await new Promise((r) => setTimeout(r, 200));
    const events = getStoredEvents();
    const newEvent: AdminEvent = {
      ...data,
      id: `event-${Date.now()}`,
    };
    events.push(newEvent);
    saveStoredEvents(events);
    return newEvent;
  },

  async updateEvent(id: string, data: Partial<AdminEvent>): Promise<AdminEvent> {
    await new Promise((r) => setTimeout(r, 200));
    const events = getStoredEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Event not found');
    const updated = { ...events[index], ...data };
    events[index] = updated;
    saveStoredEvents(events);
    return updated;
  },

  async deleteEvent(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    const events = getStoredEvents();
    const filtered = events.filter((e) => e.id !== id);
    saveStoredEvents(filtered);
  },
};
