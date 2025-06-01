import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { users, getCurrentUser } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for stored authentication
    const checkAuth = async () => {
      try {
        // In a real app, you would validate a token with your backend
        const storedUser = localStorage.getItem('currentUser');
        
        if (storedUser) {
          // For demo purposes, we're using the first agent user
          setCurrentUser(getCurrentUser());
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication check failed', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple mock authentication
      const user = users.find(u => u.email === email);
      
      if (user) {
        // In a real app, you would verify the password hash
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};