import { useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'pcstyle-theme';

export function getStoredTheme(): ThemeMode | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'dark' || v === 'light') return v;
  } catch {
    /* ignore */
  }
  return null;
}

export function getSystemDark(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyDomTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(mode === 'dark' ? 'dark' : 'light');
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
}

/** Call once before React paint (see inline script in index.html). */
export function applyThemeFromStorage() {
  const stored = getStoredTheme();
  const mode: ThemeMode = stored ?? (getSystemDark() ? 'dark' : 'light');
  applyDomTheme(mode);
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = getStoredTheme();
    if (stored) return stored;
    return getSystemDark() ? 'dark' : 'light';
  });

  useEffect(() => {
    const handleSkin = () => {
      if (typeof document === 'undefined') return;
      if (document.documentElement.dataset.skin !== 'editorial') return;
      const s = getStoredTheme();
      setThemeState(s ?? (getSystemDark() ? 'dark' : 'light'));
    };
    window.addEventListener('pcstyle-visual-skin', handleSkin);
    return () => window.removeEventListener('pcstyle-visual-skin', handleSkin);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (root.dataset.skin === 'artifact') {
      applyDomTheme('dark');
      return;
    }
    applyDomTheme(theme);
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, setTheme, toggleTheme, isDark: theme === 'dark' };
}
