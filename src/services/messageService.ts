import { AdminContactMessage } from '../types/admin';
import { initialMockMessages } from '../data/mock/mockMessages';

const STORAGE_KEY = 'hope_together_cms_messages';

function getStoredMessages(): AdminContactMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // Fallback
  }
  return initialMockMessages;
}

function saveStoredMessages(messages: AdminContactMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Ignore
  }
}

export const messageService = {
  async getMessages(): Promise<AdminContactMessage[]> {
    await new Promise((r) => setTimeout(r, 150));
    return getStoredMessages();
  },

  async getMessage(id: string): Promise<AdminContactMessage | null> {
    await new Promise((r) => setTimeout(r, 100));
    const messages = getStoredMessages();
    return messages.find((m) => m.id === id) || null;
  },

  async markAsRead(id: string): Promise<AdminContactMessage> {
    await new Promise((r) => setTimeout(r, 100));
    const messages = getStoredMessages();
    const index = messages.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Message not found');
    messages[index].status = 'Read';
    saveStoredMessages(messages);
    return messages[index];
  },

  async archiveMessage(id: string): Promise<AdminContactMessage> {
    await new Promise((r) => setTimeout(r, 100));
    const messages = getStoredMessages();
    const index = messages.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Message not found');
    messages[index].status = 'Archived';
    saveStoredMessages(messages);
    return messages[index];
  },

  async deleteMessage(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 150));
    const messages = getStoredMessages();
    const filtered = messages.filter((m) => m.id !== id);
    saveStoredMessages(filtered);
  },
};
