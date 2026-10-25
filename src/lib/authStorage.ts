/**
 * Stores the API access token and the logged-in user in localStorage.
 * Replaces the NextAuth session cookie from the Next.js portal.
 */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
}

const TOKEN_KEY = "dolphin-portal.token";
const USER_KEY = "dolphin-portal.user";

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export const authStorage = {
  getToken(): string | null {
    return safeGet(TOKEN_KEY);
  },

  getUser(): AuthUser | null {
    const raw = safeGet(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  set(token: string, user: AuthUser) {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clear() {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  },
};
