import React, { createContext, useContext, useEffect, useState } from 'react';

export type AppTheme = 'cosmic' | 'ocean' | 'sunset' | 'forest' | 'inferno';

interface ThemeContextType {
  theme: AppTheme;
  isAmoled: boolean;
  setTheme: (theme: AppTheme) => void;
  toggleAmoled: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    return (localStorage.getItem('app_theme') as AppTheme) || 'cosmic';
  });

  const [isAmoled, setIsAmoled] = useState(() => {
    return localStorage.getItem('is_amoled') === 'true';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-amoled', String(isAmoled));
    localStorage.setItem('is_amoled', String(isAmoled));
  }, [isAmoled]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
  };

  const toggleAmoled = () => {
    setIsAmoled(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, isAmoled, setTheme, toggleAmoled }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme must be used within ThemeProvider');
  return context;
};
