
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { User, UserRole } from '../types';
import { mockUsers } from '../services/mockData'; // Assuming mockUsers is exported

interface UserContextType {
  currentUser: User | null;
  loginAsOwner: () => void;
  loginAsInvestor: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const loginAsOwner = useCallback(() => {
    const ownerUser = mockUsers.find(u => u.role === UserRole.OWNER && u.id === 'user-owner-1');
    setCurrentUser(ownerUser || null);
  }, []);

  const loginAsInvestor = useCallback(() => {
    const investorUser = mockUsers.find(u => u.role === UserRole.INVESTOR && u.id === 'user-investor-1');
    setCurrentUser(investorUser || null);
  }, []);
  
  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, loginAsOwner, loginAsInvestor, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
