import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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

  // Fixed: Wrap in useCallback to stabilize reference
  const loadUserThemePreference = useCallback(async () => {
    try {
      const response = await axios.get('/api/user-profiles/current');
      if (response.data?.theme) {
        setThemeState(response.data.theme);
      }
    } catch (error) {
      // Silent fail - use default theme
    }
  }, []);

  // Fixed: Added dependency
  useEffect(() => {
    const savedTheme = localStorage.getItem('userTheme') as ThemeMode;
    if (savedTheme && Object.values(ThemeMode).includes(savedTheme)) {
      setThemeState(savedTheme);
    } else {
      loadUserThemePreference();
    }
  }, [loadUserThemePreference]);

  // Fixed: Proper cleanup for event listener
  useEffect(() => {
    if (theme === ThemeMode.SYSTEM) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setActualTheme(prefersDark ? 'dark' : 'light');

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

  // Apply theme class to both html and body for complete coverage
  useEffect(() => {
    // Remove old theme classes
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.body.classList.remove('theme-light', 'theme-dark');

    // Add new theme classes
    document.documentElement.classList.add(`theme-${actualTheme}`);
    document.body.classList.add(`theme-${actualTheme}`);

    // Set data-theme attribute for CSS selectors
    document.documentElement.setAttribute('data-theme', actualTheme);
    document.body.setAttribute('data-theme', actualTheme);
  }, [actualTheme]);

  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('userTheme', newTheme);

    // Save to backend user profile
    try {
      await axios.patch('/api/user-profiles/update-theme', { theme: newTheme });
    } catch (error) {
      console.error('Failed to save theme preference:', error);
      // Silent fail - continue with local storage
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
