import { BarChart3, Github, Star, Users, GitFork, Activity, Terminal as TerminalIcon } from 'lucide-react';
import { WakaTimeDashboard } from '../components/ui/WakaTimeDashboard';
import { ContributionHeatmap } from '../components/ui/ContributionHeatmap';
import { VisualContributionHeatmap } from '../components/ui/VisualContributionHeatmap';
import { useGitHubStats } from '../hooks/useGitHub';

import { motion } from 'framer-motion';

function GitHubMainStats() {
  const { stats, loading, error } = useGitHubStats();

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:gap-4 h-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-surface-container min-h-[100px] animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !stats) return null;

  const mainStats = [
    { label: 'Repositories', value: stats.publicRepos, icon: GitFork },
    { label: 'Stars', value: stats.totalStars, icon: Star },
    { label: 'Followers', value: stats.followers, icon: Users },
    { label: 'Following', value: stats.following, icon: Users },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 h-full">
      {mainStats.map((stat) => (
        <motion.div
          key={stat.label}
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-surface-container-lowest/70 backdrop-blur-sm shadow-ambient flex flex-col justify-center transition-shadow hover:shadow-ambient"
        >
          <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest mb-2">
            <stat.icon size={14} className="text-primary" /> {stat.label}
          </div>
          <span className="text-2xl md:text-3xl font-headline text-on-surface tracking-tight leading-none">
            {stat.value}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function GitHubExtraStats() {
  const { stats, loading } = useGitHubStats();

  if (loading) {
    return (
      <div className="flex flex-col gap-3 md:gap-4 h-full">
        <div className="p-5 rounded-2xl bg-surface-container min-h-[100px] animate-pulse flex-1" />
        <div className="p-5 rounded-2xl bg-surface-container min-h-[100px] animate-pulse flex-1" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="flex flex-col gap-3 md:gap-4 h-full">
      {stats.totalCommits !== undefined && (
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-surface-container-lowest/70 backdrop-blur-sm shadow-ambient md:flex-1 flex flex-col justify-center"
        >
          <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest mb-2">
            <Activity size={14} className="text-primary" /> Contributions (all-time)
          </div>
          <span className="text-2xl md:text-4xl font-headline text-on-surface tracking-tight leading-none">
            {stats.totalCommits.toLocaleString()}
          </span>
        </motion.div>
      )}

      {(stats.mostActiveRepo || stats.lastCommit) && (
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-surface-container-lowest/70 backdrop-blur-sm shadow-ambient text-left md:flex-1 flex flex-col justify-center transition-colors hover:bg-primary-container/20"
          onClick={() => window.open(stats.mostActiveRepo?.url || stats.lastCommit?.url, '_blank')}
        >
          <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest mb-2">
            <TerminalIcon size={14} className="text-primary" /> Active focus
          </div>
          <div className="truncate text-base md:text-lg font-headline text-on-surface mb-1">
            {(stats.mostActiveRepo?.name || stats.lastCommit?.repo || '').split('/').pop()}
          </div>
          <div className="text-xs text-on-surface-variant font-body">
            {stats.mostActiveRepo?.commits ?? 'Recent'} commits · open repo
          </div>
        </motion.button>
      )}
    </div>
  );
}

export function Stats() {
  return (
    <div className="space-y-12 md:space-y-16 pb-12 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary-container/50 text-primary">
            <BarChart3 size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-headline text-3xl md:text-4xl text-on-surface tracking-tight">Metrics</h1>
            <p className="text-sm text-on-surface-variant font-body mt-1">Coding activity and GitHub signals</p>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-2 text-xs text-primary font-body font-semibold uppercase tracking-widest">
          <Github size={16} /> GitHub
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="md:col-span-1">
            <GitHubMainStats />
          </div>
          <div className="md:col-span-1 xl:col-span-1">
            <ContributionHeatmap />
          </div>
          <div className="md:col-span-1 xl:col-span-1">
            <VisualContributionHeatmap />
          </div>
          <div className="md:col-span-1 xl:col-span-1">
            <GitHubExtraStats />
          </div>
        </div>
      </section>

      <section>
        <WakaTimeDashboard />
      </section>
    </div>
  );
}
