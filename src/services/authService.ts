import { AdminUser } from '../types/admin';

const AUTH_STORAGE_KEY = 'hope_together_admin_auth';

const DEMO_USER: AdminUser = {
  id: 'usr-admin-01',
  email: 'admin@example.com',
  name: 'Hope Together Administrator',
  role: 'super_admin',
};

/**
 * Authentication Service Abstraction.
 * Currently uses local mock state / localStorage.
 * Designed to be replaced with Supabase Auth in the future.
 */
export const authService = {
  async login(email: string, password: string): Promise<{ user: AdminUser | null; error?: string }> {
    // Artificial small delay to simulate async authentication
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Simple demo validation: accepts admin@example.com / any 6+ char password, or pre-configured credentials
    if (!email || !password) {
      return { user: null, error: 'Please enter both email and password.' };
    }

    if (password.length < 4) {
      return { user: null, error: 'Password must be at least 4 characters.' };
    }

    const authenticatedUser: AdminUser = {
      ...DEMO_USER,
      email: email.trim().toLowerCase(),
    };

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
    } catch {
      // In case localStorage is blocked
    }

    return { user: authenticatedUser };
  },

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Ignore
    }
  },

  getCurrentUser(): AdminUser | null {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as AdminUser;
      }
    } catch {
      return null;
    }
    return null;
  },

  isAuthenticated(): boolean {
    return authService.getCurrentUser() !== null;
  },
};
