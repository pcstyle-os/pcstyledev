import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Code2, Zap } from 'lucide-react';
import { useWakaTimeSummary } from '../../hooks/useWakaTime';

export function NeuralLanguageMap() {
  const { summary, loading, error } = useWakaTimeSummary();

  const languages = useMemo(() => {
    if (!summary?.languages) return [];
    return summary.languages.slice(0, 10).map((lang) => ({
      ...lang,
      fragmentDelay: Math.random(),
      fragmentPosition: Math.random() * lang.percent,
    }));
  }, [summary]);

  if (loading || !summary) {
    return (
      <div className="p-6 rounded-[1.5rem] glass-panel min-h-[280px] flex items-center justify-center">
        <div className="text-xs text-primary font-body font-semibold uppercase tracking-widest animate-pulse flex items-center gap-2">
          <Zap size={12} /> Loading languages…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-[1.5rem] glass-panel min-h-[280px] flex items-center justify-center">
        <div className="text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest">
          Could not load languages
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-[1.5rem] glass-panel min-h-[300px] relative overflow-hidden flex flex-col group"
      role="region"
      aria-label="Programming language usage statistics"
    >
      <div className="sr-only">
        <h3>Programming Languages</h3>
        <ul>
          {languages.map((lang) => (
            <li key={lang.name}>
              {lang.name}: {lang.percent}%
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(70,101,97,0.35)_1px,transparent_1px)] bg-[length:16px_16px]" />
      </div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest group-hover:text-primary transition-colors">
            <Code2 size={14} className="text-primary" /> Languages
          </div>
          {summary.source === 'github-inferred' && (
            <span className="text-[10px] text-on-surface-variant/70 font-body normal-case tracking-normal">
              Weighted by active repos (bytes × push activity)
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-around gap-4 relative z-10">
        {languages.map((lang, idx) => (
          <div key={lang.name} className="relative">
            <div className="flex justify-between items-end mb-1">
              <span className="text-sm font-body text-on-surface-variant group-hover:text-on-surface transition-colors">
                {lang.name}
              </span>
              <span className="text-xs font-body text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                {lang.percent}%
              </span>
            </div>

            <div className="h-1.5 w-full rounded-full bg-surface-container relative overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${lang.percent}%` }}
                transition={{ duration: 1.2, delay: idx * 0.08, ease: 'circOut' }}
                className="h-full rounded-full bg-primary/85 relative"
              >
                <motion.div
                  animate={{
                    opacity: [0.2, 0.55, 0.2],
                    left: ['-20%', '120%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: idx * 0.15,
                    ease: 'linear',
                  }}
                  className="absolute top-0 w-[20%] h-full bg-white/40 blur-[2px] rounded-full"
                />
              </motion.div>

              {lang.percent > 20 && (
                <motion.div
                  animate={{ opacity: [0, 0.8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: lang.fragmentDelay }}
                  className="absolute top-0 h-full w-px bg-primary-container"
                  style={{ left: `${lang.fragmentPosition}%` }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center text-[10px] text-on-surface-variant/80 font-body uppercase tracking-widest relative z-10">
        <span>7-day window</span>
        <span className="text-primary/80">WakaTime</span>
      </div>
    </div>
  );
}
