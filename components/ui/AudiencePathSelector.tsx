import React from 'react';
import { Compass } from 'lucide-react';
import {
  AUDIENCE_PATHS,
  type AudiencePathId,
} from '../../lib/audiencePaths';

interface AudiencePathSelectorProps {
  activePath: AudiencePathId | null;
  onSelect: (id: AudiencePathId) => void;
}

export function AudiencePathSelector({ activePath, onSelect }: AudiencePathSelectorProps) {
  return (
    <section className="glass-panel rounded-[2rem] p-6 sm:p-8 md:p-10 border border-primary/15 shadow-ambient">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 text-primary">
          <Compass size={22} strokeWidth={1.75} />
          <span className="text-xs font-body font-semibold uppercase tracking-widest">Choose your path</span>
        </div>
        <p className="text-on-surface-variant font-body text-sm max-w-md leading-relaxed">
          Same projects — different lens. Pick what you are optimizing for; we will persist it in the URL and on this
          device.
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
