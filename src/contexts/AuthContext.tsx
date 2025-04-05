import React, { createContext, useState, useContext, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'seller';
  location?: {
    country: string;
    state: string;
  };
  reputation?: number;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<User, 'id'>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulate authentication
    // In a real app, this would be an API call
    try {
      // For demo purposes, we'll just check for a seller email format
      if (email.includes('seller')) {
        setUser({
          id: 'seller1',
          name: 'Tech Store',
          email,
          role: 'seller',
          location: {
            country: 'Brasil',
            state: 'São Paulo'
          },
          reputation: 4.8
        });
      } else {
        setUser({
          id: '2',
          name: 'Customer Name',
          email,
          role: 'customer'
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid credentials');
    }
  };

  const register = async (userData: Omit<User, 'id'>) => {
    // Simulate registration
    try {
      setUser({
        ...userData,
        id: Math.random().toString(36).substr(2, 9)
      });
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
