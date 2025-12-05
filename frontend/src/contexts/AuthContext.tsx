import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'judge' | 'participant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API endpoint
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      
      // Mock authentication for demo
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // Demo credentials
      const demoUsers = [
        { id: '1', email: 'admin@innovateher.com', password: 'admin123', name: 'Admin User', role: 'admin' as UserRole },
        { id: '2', email: 'judge@innovateher.com', password: 'judge123', name: 'Judge Smith', role: 'judge' as UserRole },
        { id: '3', email: 'participant@innovateher.com', password: 'participant123', name: 'Team Alpha', role: 'participant' as UserRole },
      ];
      
      const foundUser = demoUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };
      
      const mockToken = `mock-token-${foundUser.id}-${Date.now()}`;
      
      setUser(userData);
      setToken(mockToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', mockToken);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Mock API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // In production, this would call: POST /api/auth/signup
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
      };
      
      const mockToken = `mock-token-${newUser.id}-${Date.now()}`;
      
      setUser(newUser);
      setToken(mockToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', mockToken);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
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
