import React from 'react';
import { Compass } from 'lucide-react';
import {
  AUDIENCE_PATHS,
  type AudiencePathId,
} from '../../lib/audiencePaths';

interface AudiencePathSelectorProps {
  activePath: AudiencePathId | null;
  onSelect: (id: AudiencePathId) => void;
  /** `artifact` matches Jan 2026 brutalist chrome; default is editorial glass. */
  variant?: 'editorial' | 'artifact';
}

export function AudiencePathSelector({
  activePath,
  onSelect,
  variant = 'editorial',
}: AudiencePathSelectorProps) {
  if (variant === 'artifact') {
    return (
      <section className="space-y-4 sm:space-y-6 border border-white/10 bg-black/40 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-2 text-[#ff00ff]">
            <Compass size={18} strokeWidth={1.75} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">path_lens</span>
          </div>
          <p className="text-xs text-gray-500 font-mono lowercase max-w-md leading-relaxed">
            same archive — different routing table. persists in url + local. click active card to clear.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {AUDIENCE_PATHS.map((path) => {
            const selected = activePath === path.id;
            return (
              <button
                key={path.id}
                type="button"
                onClick={() => onSelect(path.id)}
                title={selected ? 'Clear lens' : undefined}
                className={`text-left px-4 py-3 transition-all border font-mono ${
                  selected
                    ? 'border-[#ff00ff] text-[#ff00ff] bg-[#ff00ff]/10 shadow-[0_0_18px_rgba(255,0,255,0.2)]'
                    : 'border-white/10 text-gray-500 hover:text-white hover:border-white/40'
                }`}
                aria-pressed={selected}
              >
                <span className="block font-black text-white text-[11px] uppercase tracking-wider mb-1">
                  {path.label}
                </span>
                <span className="block text-[10px] leading-relaxed opacity-90 lowercase">{path.blurb}</span>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section className="glass-panel rounded-[2rem] p-6 sm:p-8 md:p-10 border border-primary/15 shadow-ambient">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 text-primary">
          <Compass size={22} strokeWidth={1.75} />
          <span className="text-xs font-body font-semibold uppercase tracking-widest">Choose your path</span>
        </div>
        <p className="text-on-surface-variant font-body text-sm max-w-md leading-relaxed">
          Same projects — different lens. Pick what you are optimizing for; we persist it in the URL and on this device.
          <span className="text-on-surface/80"> Click the active card again to clear the lens.</span>
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {AUDIENCE_PATHS.map((path) => {
          const selected = activePath === path.id;
          return (
            <button
              key={path.id}
              type="button"
              onClick={() => onSelect(path.id)}
              title={selected ? 'Clear lens' : undefined}
              className={`text-left rounded-2xl px-5 py-4 transition-all border font-body ${
                selected
                  ? 'bg-primary/15 border-primary/50 text-on-surface shadow-ambient'
                  : 'bg-surface-container-low/60 border-transparent hover:border-primary/25 text-on-surface-variant hover:text-on-surface'
              }`}
              aria-pressed={selected}
            >
              <span className="block font-semibold text-on-surface text-sm mb-1">{path.label}</span>
              <span className="block text-xs leading-relaxed opacity-90">{path.blurb}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
