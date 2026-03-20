import React, { memo } from 'react';
import { Sparkles } from 'lucide-react';

interface Props {
  notifications: string[];
}

export const SystemNotification = memo(({ notifications }: Props) => (
  <div className="fixed bottom-24 md:bottom-6 right-4 sm:right-6 z-[200] space-y-2 pointer-events-none w-[calc(100vw-2rem)] sm:w-auto max-w-sm">
    {notifications.map((n, i) => (
      <div
        key={`${n}-${i}`}
        className="glass-panel-subtle rounded-2xl px-4 py-3 text-sm font-body text-on-surface animate-slideIn shadow-ambient flex items-center gap-3 break-words"
      >
        <Sparkles size={16} className="text-primary shrink-0 opacity-80" />
        <span className="font-medium tracking-tight">{n}</span>
      </div>
    ))}
  </div>
));
