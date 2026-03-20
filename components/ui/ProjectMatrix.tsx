import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, Cpu } from 'lucide-react';
import { useWakaTimeSummary } from '../../hooks/useWakaTime';

const FILLED = 'rgba(70, 101, 97, 0.85)';
const EMPTY = 'rgba(234, 239, 238, 0.9)';

export function ProjectMatrix() {
  const { summary, loading, error } = useWakaTimeSummary();

  const projects = useMemo(() => {
    if (!summary?.projects) return [];
    return summary.projects.slice(0, 8);
  }, [summary]);

  if (loading || error || !summary) {
    return (
      <div className="p-6 rounded-[1.5rem] glass-panel min-h-[280px] flex items-center justify-center">
        <div className="text-xs text-primary font-body font-semibold uppercase tracking-widest flex items-center gap-2">
          <span className="inline-flex animate-spin">
            <Cpu size={12} />
          </span>
          Loading projects…
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-[1.5rem] glass-panel min-h-[300px] relative overflow-hidden flex flex-col group">
      <motion.div
        animate={{ top: ['-5%', '105%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        className="absolute left-4 right-4 h-px bg-primary/15 z-0 pointer-events-none"
      />

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest group-hover:text-primary transition-colors">
          <FolderGit2 size={14} className="text-primary" /> By project
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        {projects.map((project, idx) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.04 }}
            className="p-4 rounded-xl bg-surface-container-lowest/60 hover:bg-primary-container/25 transition-colors"
          >
            <div className="text-sm font-headline text-on-surface truncate mb-2">{project.name}</div>

            <div className="flex gap-[3px]">
              {Array.from({ length: 12 }).map((_, bIdx) => (
                <motion.div
                  key={bIdx}
                  initial={false}
                  animate={{
                    backgroundColor: (bIdx / 12) * 100 < project.percent ? FILLED : EMPTY,
                  }}
                  transition={{ duration: 0.35, delay: idx * 0.06 + bIdx * 0.02 }}
                  className="w-1 h-2 rounded-[1px]"
                />
              ))}
            </div>

            <div className="mt-2 text-[11px] font-body text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
              {project.percent}% of time
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-auto pt-6 flex justify-between items-center text-[10px] text-on-surface-variant/80 font-body uppercase tracking-widest relative z-10">
        <span>WakaTime</span>
        <span>{projects.length} shown</span>
      </div>
    </div>
  );
}
