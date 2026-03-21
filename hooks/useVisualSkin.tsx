import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { applyDomTheme, getStoredTheme, getSystemDark } from './useTheme';

export type VisualSkin = 'artifact' | 'editorial';

const STORAGE_KEY = 'pcstyle-skin';

export function getStoredVisualSkin(): VisualSkin {
  if (typeof window === 'undefined') return 'artifact';
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'editorial' || v === 'artifact') return v;
  } catch {
    /* ignore */
  }
  return 'artifact';
}

/** Sync `data-skin` + localStorage (optional; inline script in index.html is first paint). */
export function applyVisualSkinFromStorage() {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.skin = getStoredVisualSkin();
}

type VisualSkinContextValue = {
  skin: VisualSkin;
  setSkin: (skin: VisualSkin) => void;
  toggleSkin: () => void;
};

const VisualSkinContext = createContext<VisualSkinContextValue | null>(null);

export function VisualSkinProvider({ children }: { children: ReactNode }) {
  const [skin, setSkinState] = useState<VisualSkin>(() => getStoredVisualSkin());

  useEffect(() => {
    document.documentElement.dataset.skin = skin;
    try {
      localStorage.setItem(STORAGE_KEY, skin);
    } catch {
      /* ignore */
    }
    if (skin === 'artifact') {
      applyDomTheme('dark');
    } else {
      const stored = getStoredTheme();
      const mode = stored ?? (getSystemDark() ? 'dark' : 'light');
      applyDomTheme(mode);
    }
    window.dispatchEvent(new Event('pcstyle-visual-skin'));
  }, [skin]);

  const setSkin = useCallback((next: VisualSkin) => {
    setSkinState(next);
  }, []);

  const toggleSkin = useCallback(() => {
    setSkinState((s) => (s === 'artifact' ? 'editorial' : 'artifact'));
  }, []);

  const value = useMemo(
    () => ({ skin, setSkin, toggleSkin }),
    [skin, setSkin, toggleSkin],
  );

  return <VisualSkinContext.Provider value={value}>{children}</VisualSkinContext.Provider>;
}

const fallback: VisualSkinContextValue = {
  skin: 'artifact',
  setSkin: () => {},
  toggleSkin: () => {},
};

export function useVisualSkin(): VisualSkinContextValue {
  return useContext(VisualSkinContext) ?? fallback;
}
