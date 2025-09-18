import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  credits: number;
  redeemCodes: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateCredits: (credits: number) => void;
  addRedeemCode: (code: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: User) => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    
    // Default admin account
    if (email === 'admin@waste.com' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@waste.com',
        role: 'admin',
        credits: 0,
        redeemCodes: []
      };
      setUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      return true;
    }
    
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: User) => u.email === email);
    
    if (existingUser) {
      return false;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'user',
      credits: 0,
      redeemCodes: []
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateCredits = (credits: number) => {
    if (user) {
      const updatedUser = { ...user, credits };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update user in users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  const addRedeemCode = (code: string) => {
    if (user) {
      const updatedUser = { ...user, redeemCodes: [...user.redeemCodes, code] };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update user in users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      updateCredits,
      addRedeemCode
    }}>
      {children}
    </AuthContext.Provider>
  );
};