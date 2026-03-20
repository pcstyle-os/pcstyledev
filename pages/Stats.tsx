import { BarChart3, Github, Star, Users, GitFork, Activity, Terminal as TerminalIcon } from 'lucide-react';
import { WakaTimeDashboard } from '../components/ui/WakaTimeDashboard';
import { ContributionHeatmap } from '../components/ui/ContributionHeatmap';
import { VisualContributionHeatmap } from '../components/ui/VisualContributionHeatmap';
import { useGitHubStats, type UseGitHubStatsResult } from '../hooks/useGitHub';

import { motion } from 'framer-motion';
import { SeoSecondary } from '../components/Seo';

function GitHubMainStats({ github }: { github: UseGitHubStatsResult }) {
  const { stats, loading, error } = github;

  if (loading) {
    return (
      <div className="rounded-2xl glass-panel shadow-ambient p-4 md:p-5 h-full min-h-[140px] xl:min-h-[180px] animate-pulse">
        <div className="grid grid-cols-2 gap-3 h-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl bg-surface-container/80 min-h-[52px]" />
          ))}
        </div>
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
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="rounded-2xl glass-panel shadow-ambient p-4 md:p-5 h-full flex flex-col justify-center"
    >
      <div className="grid grid-cols-2 gap-x-5 gap-y-2.5">
        {mainStats.map((stat) => (
          <div key={stat.label} className="flex flex-col justify-center gap-0.5 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant font-body font-semibold uppercase tracking-widest">
              <stat.icon size={12} className="text-primary shrink-0" /> {stat.label}
            </div>
            <span className="text-lg md:text-xl xl:text-2xl font-headline text-on-surface tracking-tight leading-none tabular-nums">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </span>
            {'sub' in stat && stat.sub ? (
              <span className="text-[9px] text-on-surface-variant/90 font-body leading-tight">{stat.sub}</span>
            ) : null}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function GitHubExtraStats({ github }: { github: UseGitHubStatsResult }) {
  const { stats, loading } = github;

  if (loading) {
    return (
      <div className="flex flex-col gap-3 md:gap-4 h-full">
        <div className="rounded-2xl glass-panel shadow-ambient min-h-[160px] xl:min-h-[200px] flex-1 animate-pulse p-6 md:p-8">
          <div className="h-3 w-40 rounded bg-surface-container mb-4" />
          <div className="h-14 xl:h-20 w-48 rounded-lg bg-surface-container" />
        </div>
        <div className="rounded-2xl glass-panel shadow-ambient min-h-[88px] animate-pulse p-4">
          <div className="h-2.5 w-28 rounded bg-surface-container mb-2" />
          <div className="h-4 w-full max-w-xs rounded bg-surface-container" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="flex flex-col gap-3 md:gap-4 h-full">
      {stats.totalCommits !== undefined && (
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="rounded-2xl glass-panel shadow-ambient flex flex-col justify-center flex-1 p-6 md:p-8 xl:p-10 xl:min-h-[200px]"
        >
          <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest mb-3 xl:mb-4">
            <Activity size={14} className="text-primary" /> Contributions (all-time)
          </div>
          <span className="text-4xl md:text-5xl xl:text-6xl font-headline text-on-surface tracking-tighter leading-none tabular-nums">
            {stats.totalCommits.toLocaleString()}
          </span>
        </motion.div>
      )}

      {(stats.mostActiveRepo || stats.lastCommit) && (
        <motion.button
          type="button"
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="rounded-2xl glass-panel shadow-ambient text-left p-4 md:p-5 flex flex-col justify-center transition-colors hover:bg-primary-container/15"
          onClick={() => window.open(stats.mostActiveRepo?.url || stats.lastCommit?.url, '_blank')}
        >
          <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-body font-semibold uppercase tracking-widest mb-1.5">
            <TerminalIcon size={12} className="text-primary" /> Active focus
          </div>
          <div className="truncate text-sm md:text-base font-headline text-on-surface mb-0.5">
            {(stats.mostActiveRepo?.name || stats.lastCommit?.repo || '').split('/').pop()}
          </div>
          <div className="text-[11px] text-on-surface-variant font-body">
            {stats.mostActiveRepo?.commits ?? 'Recent'} commits · open repo
          </div>
        </motion.button>
      )}
    </div>
  );
}

export function Stats() {
  const github = useGitHubStats()

  return (
    <div className="space-y-12 md:space-y-16 pb-12 animate-fadeIn">
      <SeoSecondary
        title="Metrics"
        description="GitHub and coding activity metrics for Adam Krupa (pcstyle.dev)."
        path="/stats"
      />
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
        <div className="label-editorial flex items-center gap-2 text-xs text-primary">
          <Github size={16} className="shrink-0" /> GitHub
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 xl:gap-6 xl:items-stretch">
          {/* Hero spread: contributions hero (~2 cols) + dense profile stats */}
          <div className="md:col-span-1 xl:col-span-2 min-w-0 flex flex-col">
            <GitHubExtraStats github={github} />
          </div>
          <div className="md:col-span-1 xl:col-span-2 min-w-0 flex flex-col">
            <GitHubMainStats github={github} />
          </div>

          {/* Second row: wide calendar + tall visual sidebar */}
          <div className="md:col-span-2 xl:col-span-3 min-w-0 flex flex-col">
            <ContributionHeatmap />
          </div>
          <div className="md:col-span-2 xl:col-span-1 min-w-0 flex flex-col xl:min-h-[280px]">
            <div className="flex-1 min-h-[220px] xl:min-h-0 xl:h-full flex flex-col">
              <VisualContributionHeatmap />
            </div>
          </div>
        </div>
      </section>

      <section>
        <WakaTimeDashboard githubSevenDay={github.stats?.sevenDay} githubLoading={github.loading} />
      </section>
    </div>
  );
}
