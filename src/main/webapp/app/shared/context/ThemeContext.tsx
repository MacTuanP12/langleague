import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { ThemeMode } from 'app/shared/model/enumerations/enums.model';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  actualTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(ThemeMode.SYSTEM);
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('userTheme') as ThemeMode;
    if (savedTheme && Object.values(ThemeMode).includes(savedTheme)) {
      setThemeState(savedTheme);
    } else {
      // Try to load from user profile
      loadUserThemePreference();
    }
  }, []);

  // Calculate actual theme based on theme setting
  useEffect(() => {
    if (theme === ThemeMode.SYSTEM) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setActualTheme(prefersDark ? 'dark' : 'light');

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setActualTheme(e.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setActualTheme(theme === ThemeMode.DARK ? 'dark' : 'light');
    }
  }, [theme]);

  // Apply theme class to body
  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${actualTheme}`);
    document.documentElement.setAttribute('data-theme', actualTheme);
  }, [actualTheme]);

  const loadUserThemePreference = async () => {
    try {
      const response = await axios.get('/api/user-profiles/current');
      if (response.data?.theme) {
        setThemeState(response.data.theme);
      }
    } catch (error) {
      console.warn('Could not load user theme preference');
    }
  };

  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('userTheme', newTheme);

    // Save to backend user profile
    try {
      await axios.put('/api/user-profiles/theme', { theme: newTheme });
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  return <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeContext;
