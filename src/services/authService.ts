import { AdminUser } from '../types/admin';

const AUTH_STORAGE_KEY = 'hope_together_admin_auth';

// Official authorized credentials
const OFFICIAL_GMAIL = 'hopetogether.org@gmail.com';
const OFFICIAL_PASS = 'Hopetogether888tvo';

const OFFICIAL_ADMIN_USER: AdminUser = {
  id: 'usr-admin-official',
  email: OFFICIAL_GMAIL,
  name: 'Hope Together Administrator',
  role: 'super_admin',
};

/**
 * Authentication Service for Hope Together Admin Portal.
 * Restricts access strictly to authorized leadership credentials.
 */
export const authService = {
  async login(username: string, password: string): Promise<{ user: AdminUser | null; error?: string }> {
    // Artificial small delay to simulate secure async authentication
    await new Promise((resolve) => setTimeout(resolve, 350));

    if (!username || !password) {
      return { user: null, error: 'Please enter both your official email and password.' };
    }

    const cleanUsername = username.trim().toLowerCase();
    const isUsernameValid =
      cleanUsername === OFFICIAL_GMAIL ||
      cleanUsername === 'hopetogether.org';

    const isPasswordValid = password === OFFICIAL_PASS;

    if (!isUsernameValid || !isPasswordValid) {
      return {
        user: null,
        error: 'Invalid username or password. Access is restricted to authorized personnel.',
      };
    }

    const authenticatedUser: AdminUser = {
      ...OFFICIAL_ADMIN_USER,
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
      const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(AUTH_STORAGE_KEY) : null;
      if (stored) {
        const parsed = JSON.parse(stored) as AdminUser;
        // Strict verification: Reject old demo accounts or unauthorized sessions
        if (
          parsed &&
          parsed.email &&
          (parsed.email.toLowerCase() === OFFICIAL_GMAIL || parsed.email.toLowerCase() === 'hopetogether.org')
        ) {
          return parsed;
        }
        // Invalidate stale demo sessions
        localStorage.removeItem(AUTH_STORAGE_KEY);
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
