import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi } from '../services/api';
import { tokenStorage } from '../utils/token';

interface AuthContextType {
  user: { id: string; email: string } | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = tokenStorage.getUser();
    if (storedUser) {
      setUser({
        id: storedUser.id,
        email: storedUser.email,
      });
      setIsAdmin(storedUser.isAdmin);
      setIsSuperAdmin(storedUser.isSuperAdmin || false);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    setUser({
      id: response.user.id,
      email: response.user.email,
    });
    setIsAdmin(response.isAdmin || false);
    setIsSuperAdmin(response.isSuperAdmin || false);
  };

  const register = async (email: string, password: string, fullName: string) => {
    const response = await authApi.register(email, password, fullName);
    setUser({
      id: response.user.id,
      email: response.user.email,
    });
    setIsAdmin(response.isAdmin || false);
    setIsSuperAdmin(false);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setIsAdmin(false);
    setIsSuperAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isSuperAdmin, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
