import { Clock, Code2, TrendingUp, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWakaTimeSummary } from '../../hooks/useWakaTime';

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function WakaTimeSummaryCard() {
  const { summary, loading, error } = useWakaTimeSummary();

  if (loading) {
    return (
      <div className="p-8 rounded-[2rem] glass-panel">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest mb-4">
          <Clock size={14} className="animate-pulse text-primary" /> Loading…
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-surface-container rounded-full animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="p-8 rounded-[2rem] glass-panel">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest">
          <Clock size={14} /> Summary unavailable
        </div>
      </div>
    );
  }

  const topLanguages = summary.languages.slice(0, 3);

  return (
    <div className="p-8 rounded-[2rem] glass-panel space-y-8 shadow-ambient">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <span className="text-xs text-primary font-body font-semibold uppercase tracking-widest">Coding (7d)</span>
        <Link
          to="/stats"
          className="text-xs text-on-surface-variant hover:text-primary font-body font-semibold uppercase tracking-widest inline-flex items-center gap-1 transition-colors"
        >
          View all <ExternalLink size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest mb-1">
            <Clock size={12} /> Total
          </div>
          <span className="text-2xl font-headline text-on-surface tracking-tight">
            {formatTime(summary.totalSeconds)}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest mb-1">
            <TrendingUp size={12} /> Daily avg
          </div>
          <span className="text-2xl font-headline text-primary tracking-tight">
            {formatTime(summary.dailyAverage)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest">
          <Code2 size={12} /> Top languages
        </div>
        {topLanguages.map((lang) => (
          <div key={lang.name} className="space-y-1.5">
            <div className="flex justify-between text-sm font-body">
              <span className="text-on-surface">{lang.name}</span>
              <span className="text-primary font-medium">{lang.percent}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/70"
                style={{ width: `${lang.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {summary.bestDay && (
        <div className="pt-2">
          <p className="text-xs text-on-surface-variant font-body">
            Best day:{' '}
            <span className="text-primary font-semibold">{summary.bestDay.date}</span>
            <span className="text-on-surface-variant ml-2">({formatTime(summary.bestDay.seconds)})</span>
          </p>
        </div>
      )}
    </div>
  );
}
