'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      accent: string;
    };
    border: string;
    hover: string;
    accent: string;
    success: string;
    warning: string;
    info: string;
    buttonHover: string;
    buttonHoverText: string;
  };
}

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    primary: '#1E88E5',
    secondary: '#0D47A1',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      accent: '#FFFFFF'
    },
    border: '#E5E7EB',
    hover: '#F3F4F6',
    accent: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
    buttonHover: 'rgba(59, 130, 246, 0.1)',
    buttonHoverText: '#1F2937'
  }
};

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: '#60A5FA',
    secondary: '#34D399',
    background: '#0F172A',
    surface: '#1E293B',
    text: {
      primary: '#F1F5F9',
      secondary: '#94A3B8',
      accent: '#60A5FA'
    },
    border: '#334155',
    hover: '#334155',
    accent: '#F87171',
    success: '#34D399',
    warning: '#FBBF24',
    info: '#60A5FA',
    buttonHover: 'rgba(96, 165, 250, 0.1)',
    buttonHoverText: '#F1F5F9'
  }
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Custom theme variables
    document.documentElement.style.setProperty('--theme-primary', theme.colors.primary);
    document.documentElement.style.setProperty('--theme-secondary', theme.colors.secondary);
    document.documentElement.style.setProperty('--theme-background', theme.colors.background);
    document.documentElement.style.setProperty('--theme-surface', theme.colors.surface);
    document.documentElement.style.setProperty('--theme-text-primary', theme.colors.text.primary);
    document.documentElement.style.setProperty('--theme-text-secondary', theme.colors.text.secondary);
    document.documentElement.style.setProperty('--theme-border', theme.colors.border);
    document.documentElement.style.setProperty('--theme-hover', theme.colors.hover);
    
    // Shadcn UI CSS variables synchronization
    document.documentElement.style.setProperty('--primary', theme.colors.primary);
    document.documentElement.style.setProperty('--primary-foreground', theme.colors.text.accent);
    document.documentElement.style.setProperty('--secondary', theme.colors.secondary);
    document.documentElement.style.setProperty('--secondary-foreground', theme.colors.text.primary);
    document.documentElement.style.setProperty('--background', theme.colors.background);
    document.documentElement.style.setProperty('--foreground', theme.colors.text.primary);
    document.documentElement.style.setProperty('--card', theme.colors.surface);
    document.documentElement.style.setProperty('--card-foreground', theme.colors.text.primary);
    document.documentElement.style.setProperty('--muted', theme.colors.hover);
    document.documentElement.style.setProperty('--muted-foreground', theme.colors.text.secondary);
    document.documentElement.style.setProperty('--accent', theme.colors.hover);
    document.documentElement.style.setProperty('--accent-foreground', theme.colors.text.primary);
    document.documentElement.style.setProperty('--border', theme.colors.border);
    document.documentElement.style.setProperty('--input', theme.colors.border);
    document.documentElement.style.setProperty('--ring', theme.colors.primary);
  }, [isDark, theme]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};