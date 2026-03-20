import { useCallback, useEffect, useRef, useState } from 'react';
import { createSynth } from '../utils/audio';

const STORAGE_KEY = 'pcstyle-ui-sound';

type SynthInstance = NonNullable<ReturnType<typeof createSynth>>;

function readStoredSound(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'true') return true;
    if (v === 'false') return false;
  } catch {
    /* ignore */
  }
  return false;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useUiSound() {
  const [soundEnabled, setSoundEnabledState] = useState(readStoredSound);
  const synthRef = useRef<SynthInstance | null>(null);

  const setSoundEnabled = useCallback((on: boolean) => {
    setSoundEnabledState(on);
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, on ? 'true' : 'false');
    } catch {
      /* ignore */
    }
    if (!on) synthRef.current = null;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setSoundEnabledState(readStoredSound());
  }, []);

  const ensureSynth = useCallback((): SynthInstance | null => {
    if (synthRef.current) return synthRef.current;
    const s = createSynth();
    if (!s) return null;
    synthRef.current = s;
    return s;
  }, []);

  const playNavClick = useCallback(() => {
    if (typeof window === 'undefined' || !soundEnabled || prefersReducedMotion()) return;
    ensureSynth()?.playBlip(880, 'square', 0.06, 0.035);
  }, [ensureSynth, soundEnabled]);

  const playToggle = useCallback(() => {
    if (typeof window === 'undefined' || !soundEnabled || prefersReducedMotion()) return;
    ensureSynth()?.playBlip(520, 'triangle', 0.1, 0.03);
  }, [ensureSynth, soundEnabled]);

  return { soundEnabled, setSoundEnabled, playNavClick, playToggle };
}
