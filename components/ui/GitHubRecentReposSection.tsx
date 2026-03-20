import { Github, Star } from 'lucide-react';
import { useGitHubStats } from '../../hooks/useGitHub';

function formatGitDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function truncate(text: string | null, max: number): string | null {
  if (!text) return null;
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export function GitHubRecentReposSection() {
  const { stats, loading, error } = useGitHubStats();
  const items = stats?.recentRepos ?? [];

  return (
    <section className="relative mb-16 md:mb-24">
      <div className="flex items-center gap-3 text-primary mb-4">
        <Github size={22} strokeWidth={1.75} />
        <span className="text-xs font-body font-semibold uppercase tracking-widest">Public repositories</span>
      </div>
      <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl text-on-surface tracking-tight mb-6">
        Recent <span className="italic text-primary font-light">pushes</span>
      </h2>
      <p className="text-on-surface-variant font-body text-base sm:text-lg max-w-2xl leading-relaxed mb-10 md:mb-12">
        Last activity on GitHub: sorted by <span className="text-on-surface font-medium">pushed_at</span> from the API
        (public, non-archived repos). No roadmap copy — just names, dates, and metadata.
      </p>

      {loading && (
        <div className="space-y-8 pl-6 border-l-2 border-primary/20 ml-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-3 w-24 rounded bg-surface-container" />
              <div className="h-6 w-48 rounded bg-surface-container" />
              <div className="h-4 w-full max-w-md rounded bg-surface-container-low" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-primary/20 bg-surface-container-low/50 p-6 font-body text-sm text-on-surface-variant">
          Couldn&apos;t load repo list ({error}).{' '}
          <a
            href="https://github.com/pc-style"
            target="_blank"
            rel="noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            Open GitHub
          </a>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="text-on-surface-variant font-body text-sm">
          No public repos returned for this view (or cache still warming). Check{' '}
          <a href="https://github.com/pc-style" target="_blank" rel="noreferrer" className="text-primary font-semibold">
            github.com/pc-style
          </a>
          .
        </p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="relative border-l-2 border-primary/25 ml-3 sm:ml-4 space-y-10 md:space-y-12 pl-8 sm:pl-12">
          {items.map((repo) => {
            const blurb = truncate(repo.description, 120);
            return (
              <article key={repo.fullName} className="relative">
                <span className="absolute -left-[calc(2rem+5px)] sm:-left-[calc(2.75rem+5px)] top-1.5 w-3 h-3 rounded-full bg-primary shadow-ambient ring-4 ring-primary/15" />
                <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">
                  Last push · {formatGitDate(repo.pushedAt)}
                </p>
                <h3 className="font-headline text-xl sm:text-2xl text-on-surface mb-2 tracking-tight">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary transition-colors underline-offset-4 hover:underline"
                  >
                    {repo.name}
                  </a>
                  {repo.fork && (
                    <span className="ml-2 text-xs font-body font-normal text-on-surface-variant normal-case tracking-normal">
                      fork
                    </span>
                  )}
                </h3>
                <p className="text-on-surface-variant font-body text-sm mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>{repo.language ?? '—'}</span>
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Star size={12} className="text-primary shrink-0" />
                    {repo.stars}
                  </span>
                  <span className="text-on-surface-variant/80">Created {formatGitDate(repo.createdAt)}</span>
                </p>
                {blurb ? (
                  <p className="text-on-surface-variant/90 font-body text-sm leading-relaxed max-w-3xl">{blurb}</p>
                ) : (
                  <p className="text-on-surface-variant/60 font-body text-sm italic">No GitHub description.</p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
