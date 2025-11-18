const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const tokenStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getUser(): { id: string; email: string; isAdmin: boolean; isSuperAdmin?: boolean } | null {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser(user: { id: string; email: string; isAdmin: boolean; isSuperAdmin?: boolean }): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
};

