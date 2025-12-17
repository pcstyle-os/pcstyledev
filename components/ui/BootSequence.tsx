import React, { useState, useEffect, memo } from 'react';
import { BOOT_MESSAGES } from '../../data/constants';

interface Props {
  onComplete: () => void;
}

export const BootSequence = memo(({ onComplete }: Props) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let current = 0;
    let timeoutId: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      if (current < BOOT_MESSAGES.length) {
        setLogs(prev => [...prev, BOOT_MESSAGES[current]]);
        current++;
      } else {
        clearInterval(interval);
        timeoutId = setTimeout(() => {
          if (onComplete) onComplete();
        }, 600);
      }
    }, 120); // Sped up slightly for better UX

    return () => {
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black text-[#ff00ff] font-mono p-8 flex flex-col justify-end z-[300] overflow-hidden">
      <div className="max-w-3xl space-y-1 mb-10">
        {logs.map((log, i) => {
          const isError = typeof log === 'string' && log.includes('DISABLED');
          return (
            <div key={i} className="flex gap-4 text-xs md:text-sm">
              <span className="opacity-30">[{new Date().toLocaleTimeString()}]</span>
              <span className={`animate-pulse tracking-tight ${isError ? 'text-red-500' : ''}`}>
                {log}
              </span>
            </div>
          );
        })}
        <div className="w-full h-0.5 bg-[#ff00ff]/10 mt-6 overflow-hidden relative">
          <div 
            className="h-full bg-[#ff00ff] transition-all duration-300 shadow-[0_0_100px_#ff00ff]" 
            style={{ width: `${(logs.length / BOOT_MESSAGES.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
});