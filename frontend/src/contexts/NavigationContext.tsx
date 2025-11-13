'use client';

import React, { createContext, useContext, useState } from 'react';

export type PageType = 'dashboard' | 'portfolio' | 'acquisition' | 'processing' | 'dataManagement' | 'analysis' | 'fitnessForPurposes' | 'impactToolbox' | 'jupyterNotebook' | 'systemSettings' | 'help';

interface NavigationContextType {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  return (
    <NavigationContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </NavigationContext.Provider>
  );
};