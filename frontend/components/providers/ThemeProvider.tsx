'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextShape {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextShape>({
  theme: 'light',
  toggleTheme: () => undefined,
  setTheme: () => undefined,
});

const STORAGE_KEY = 'prestalink-theme';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    try {
      setMounted(true);

      // Check localStorage
      const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (saved && (saved === 'light' || saved === 'dark')) {
        setThemeState(saved);
        applyTheme(saved);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDark ? 'dark' : 'light';
        setThemeState(initialTheme);
        applyTheme(initialTheme);
      }
    } catch (error) {
      // If localStorage fails, use default
      console.warn('Theme initialization error:', error);
      setThemeState('light');
      applyTheme('light');
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
  };

  const setTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return;
    
    try {
      setThemeState(newTheme);
      localStorage.setItem(STORAGE_KEY, newTheme);
      applyTheme(newTheme);
    } catch (error) {
      // If localStorage fails, still apply theme but don't save
      console.warn('Theme save error:', error);
      setThemeState(newTheme);
      applyTheme(newTheme);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Prevent hydration mismatch - don't render until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);














