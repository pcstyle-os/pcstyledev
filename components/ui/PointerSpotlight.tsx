import type { CSSProperties } from 'react';
import { usePointerSpotlight } from '../../hooks/usePointerSpotlight';

interface PointerSpotlightProps {
  enabled?: boolean;
}

/**
 * Subtle full-viewport radial highlight following the pointer (z below header).
 * Pass enabled={false} to turn off tracking and hide the effect.
 */
export function PointerSpotlight({ enabled: enabledProp = true }: PointerSpotlightProps) {
  const { x, y, enabled } = usePointerSpotlight({ disabled: !enabledProp });

  if (!enabledProp || !enabled) return null;

  const xp = `${(x * 100).toFixed(2)}%`;
  const yp = `${(y * 100).toFixed(2)}%`;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[5]"
      style={
        {
          '--spot-x': xp,
          '--spot-y': yp,
          background: `radial-gradient(
            circle 42vmin at var(--spot-x) var(--spot-y),
            var(--pointer-spot-glow) 0%,
            var(--pointer-spot-mid) 38%,
            transparent 68%
          )`,
        } as CSSProperties
      }
      aria-hidden
    />
  );
}
