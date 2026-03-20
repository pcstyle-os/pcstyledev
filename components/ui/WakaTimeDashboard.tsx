import { Clock, Code2, Monitor, FolderGit2, TrendingUp, Calendar, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWakaTimeSummary } from '../../hooks/useWakaTime';
import { NeuralLanguageMap } from './NeuralLanguageMap';
import { ProjectMatrix } from './ProjectMatrix';

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function ProgressBar({ percent, label, value }: { percent: number; label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-body">
        <span className="text-on-surface-variant">{label}</span>
        <span className="text-primary font-medium">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-surface-container overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percent, 100)}%` }}
          className="h-full rounded-full bg-primary/80"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-5 rounded-2xl bg-surface-container-lowest/80 backdrop-blur-sm shadow-ambient relative overflow-hidden group"
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Zap size={10} className="text-primary/60" />
      </div>
      <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest mb-2">
        <Icon size={14} className="text-primary" /> {label}
      </div>
      <span
        className={`text-2xl md:text-3xl font-headline tracking-tight ${highlight ? 'text-primary' : 'text-on-surface'}`}
      >
        {value}
      </span>
    </motion.div>
  );
}

export function WakaTimeDashboard() {
  const { summary, loading, error } = useWakaTimeSummary();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-xs text-primary font-body font-semibold uppercase tracking-widest flex items-center gap-2">
          <Clock size={14} className="animate-pulse" /> Loading WakaTime…
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-surface-container h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="p-8 rounded-[2rem] glass-panel">
        <div className="text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest">
          WakaTime unavailable
        </div>
        <p className="text-on-surface-variant text-sm mt-2 font-body">{error || 'Could not load coding statistics.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2 text-xs md:text-sm text-primary font-body font-semibold uppercase tracking-widest">
          <Clock size={16} /> WakaTime (7 days)
        </div>
        <span className="text-xs text-on-surface-variant font-body">
          {summary.range.start} — {summary.range.end}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="Total time" value={formatTime(summary.totalSeconds)} />
        <StatCard icon={TrendingUp} label="Daily average" value={formatTime(summary.dailyAverage)} highlight />
        <StatCard
          icon={Calendar}
          label="Best day"
          value={summary.bestDay ? formatTime(summary.bestDay.seconds) : 'N/A'}
        />
        <StatCard icon={Code2} label="Languages" value={String(summary.languages.length)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <NeuralLanguageMap />
        </div>
        <div className="xl:col-span-1">
          <ProjectMatrix />
        </div>
        <div className="space-y-6 xl:col-span-1">
          <div className="p-6 rounded-[1.5rem] glass-panel space-y-5 h-full">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest">
              <Monitor size={14} className="text-primary" /> Editors
            </div>
            <div className="space-y-4">
              {summary.editors.slice(0, 3).map((editor) => (
                <div key={editor.name}>
                  <ProgressBar label={editor.name} value={`${editor.percent}%`} percent={editor.percent} />
                </div>
              ))}
            </div>

            <div className="pt-6">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest mb-3">
                <FolderGit2 size={14} className="text-primary" /> Top project
              </div>
              {summary.projects.slice(0, 1).map((project) => (
                <div key={project.name}>
                  <span className="text-lg font-headline text-on-surface">{project.name}</span>
                  <p className="text-sm text-primary font-body font-medium mt-1">{formatTime(project.totalSeconds)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
