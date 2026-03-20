import { useCallback, useEffect, useRef, useState } from 'react';

export interface UsePointerSpotlightOptions {
  /** When true, pointer tracking and spotlight are off. */
  disabled?: boolean;
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function getEnvironmentAllowsSpotlight() {
  if (typeof window === 'undefined') return false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  return !reduced && !coarse;
}

/**
 * Normalized pointer position (0–1) for visual effects, throttled with rAF.
 * Disabled when prefers-reduced-motion is reduce or pointer is coarse.
 */
export function usePointerSpotlight(options?: UsePointerSpotlightOptions) {
  const { disabled: disabledProp = false } = options ?? {};
  const [userEnabled, setUserEnabled] = useState(true);
  const [envOk, setEnvOk] = useState(() =>
    typeof window !== 'undefined' ? getEnvironmentAllowsSpotlight() : false,
  );
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });

  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<{ x: number; y: number } | null>(null);
  const effectiveRef = useRef(false);

  const enabled = !disabledProp && userEnabled && envOk;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarseMq = window.matchMedia('(pointer: coarse)');

    const sync = () => setEnvOk(getEnvironmentAllowsSpotlight());
    sync();

    reducedMq.addEventListener('change', sync);
    coarseMq.addEventListener('change', sync);
    return () => {
      reducedMq.removeEventListener('change', sync);
      coarseMq.removeEventListener('change', sync);
    };
  }, []);

  const flushPointer = useCallback(() => {
    rafRef.current = null;
    const p = pendingRef.current;
    pendingRef.current = null;
    if (!p || typeof window === 'undefined') return;
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    setPos({
      x: clamp01(p.x / w),
      y: clamp01(p.y / h),
    });
  }, []);

  useEffect(() => {
    effectiveRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      pendingRef.current = null;
      return;
    }

    const onMove = (e: PointerEvent) => {
      if (!effectiveRef.current) return;
      pendingRef.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(flushPointer);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      pendingRef.current = null;
    };
  }, [enabled, flushPointer]);

  return {
    x: pos.x,
    y: pos.y,
    enabled,
    setEnabled: setUserEnabled,
  };
}
