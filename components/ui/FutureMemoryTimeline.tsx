import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Orbit } from 'lucide-react';
import futureData from '../../data/future-memory.json';
import projectsData from '../../data/projects/projects.json';
import type { Project } from '../../lib/types';

interface Milestone {
  year: number;
  headline: string;
  metric: string;
  body: string;
  projectIds: string[];
}

const PROJECTS = projectsData.projects as Project[];

export function FutureMemoryTimeline() {
  const milestones = useMemo(
    () => [...(futureData.milestones as Milestone[])].sort((a, b) => b.year - a.year),
    [],
  );

  return (
    <section className="relative mb-16 md:mb-24">
      <div className="flex items-center gap-3 text-primary mb-4">
        <Orbit size={22} strokeWidth={1.75} />
        <span className="text-xs font-body font-semibold uppercase tracking-widest">Future memory</span>
      </div>
      <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl text-on-surface tracking-tight mb-6">
        Rewind from <span className="italic text-primary font-light">2030</span>
      </h2>
      <p className="text-on-surface-variant font-body text-base sm:text-lg max-w-2xl leading-relaxed mb-12 md:mb-16">
        {futureData.intro}
      </p>

      <div className="relative border-l-2 border-primary/25 ml-3 sm:ml-4 space-y-12 md:space-y-16 pl-8 sm:pl-12">
        {milestones.map((m) => {
          const linked = m.projectIds
            .map((id) => PROJECTS.find((p) => p.id === id))
            .filter((p): p is Project => Boolean(p));

          return (
            <article key={m.year} className="relative animate-fadeIn">
              <span className="absolute -left-[calc(2rem+5px)] sm:-left-[calc(2.75rem+5px)] top-2 w-3 h-3 rounded-full bg-primary shadow-ambient ring-4 ring-primary/15" />
              <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">{m.year}</p>
              <h3 className="font-headline text-2xl sm:text-3xl text-on-surface mb-3 tracking-tight">{m.headline}</h3>
              <p className="text-on-surface font-body text-sm sm:text-base font-medium mb-3">{m.metric}</p>
              <p className="text-on-surface-variant font-body text-sm sm:text-base leading-relaxed max-w-3xl mb-6">
                {m.body}
              </p>
              {linked.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-body font-semibold uppercase tracking-widest text-on-surface-variant w-full sm:w-auto sm:mr-2 py-1">
                    Linked builds
                  </span>
                  {linked.map((p) => (
                    <Link
                      key={p.id}
                      to={`/?q=${encodeURIComponent(p.name)}`}
                      className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-body font-semibold text-primary hover:bg-primary/20 transition-colors"
                    >
                      {p.name}
                    </Link>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
