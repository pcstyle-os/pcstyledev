import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useOutletContext, useSearchParams } from 'react-router-dom';
import { ProjectCard } from '../components/ui/ProjectCard';
import { ProjectModal } from '../components/ui/ProjectModal';
import { AudiencePathSelector } from '../components/ui/AudiencePathSelector';
import projectsData from '../data/projects/projects.json';
import stackConfig from '../data/projects/stack-canonical.json';
import { Synth } from '../utils/audio';
import { Github, Sparkles, FolderKanban, FlaskConical } from 'lucide-react';
import type { Project, ProjectStatus } from '../lib/types';
import type { ProjectCardVariant } from '../components/ui/ProjectCard';
import {
  AUDIENCE_PATH_QUERY_KEY,
  AUDIENCE_PATH_STORAGE_KEY,
  getAudiencePathConfig,
  parseAudiencePathParam,
  type AudiencePathId,
} from '../lib/audiencePaths';

interface ContextType {
  soundEnabled: boolean;
  synth: Synth | null;
}

const PROJECTS: Project[] = projectsData.projects as Project[];
const STATUS_ORDER: ProjectStatus[] = ['active', 'experimental', 'maintenance', 'prototype', 'disabled'];
const SORT_OPTIONS = [
  { value: 'featured', label: 'featured_first' },
  { value: 'updated_desc', label: 'recent_updates' },
  { value: 'updated_asc', label: 'oldest_updates' },
  { value: 'name_asc', label: 'name_asc' },
  { value: 'name_desc', label: 'name_desc' },
  { value: 'status', label: 'status' }
] as const;
type SortOption = typeof SORT_OPTIONS[number]['value'];
const STATUS_SET = new Set<ProjectStatus>(STATUS_ORDER);
type StackConfig = {
  canonical: string[];
  aliases: Record<string, string>;
  glossary: { label: string; desc: string }[];
};
const STACK_CONFIG = stackConfig as StackConfig;
const STACKS = STACK_CONFIG.canonical;

const parseList = (value: string | null) =>
  value?.split(',').map((item) => item.trim()).filter(Boolean) ?? [];

const parseSort = (value: string | null): SortOption => {
  if (!value) return 'featured';
  const match = SORT_OPTIONS.find((option) => option.value === value);
  return match ? match.value : 'featured';
};

/** Visual rhythm for the project mosaic: full-width beats + occasional tall tiles. */
function projectTileVariant(index: number): ProjectCardVariant {
  if (index % 5 === 0) return 'wide';
  if (index % 4 === 2) return 'tall';
  return 'default';
}

function projectGridCellClass(variant: ProjectCardVariant): string {
  if (variant === 'wide') return 'md:col-span-2 xl:col-span-3';
  if (variant === 'tall') return 'md:row-span-2';
  return '';
}

export const Projects = () => {
  const { soundEnabled, synth } = useOutletContext<ContextType>();
  const [searchParams, setSearchParams] = useSearchParams();
  const pathPresetsAppliedRef = useRef(false);
  const [audiencePath, setAudiencePath] = useState<AudiencePathId | null>(() =>
    parseAudiencePathParam(searchParams.get(AUDIENCE_PATH_QUERY_KEY)),
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(() => searchParams.get('q')?.trim() ?? '');
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q')?.trim() ?? '');
  const [selectedStacks, setSelectedStacks] = useState<string[]>(() => parseList(searchParams.get('stack')));
  const [selectedStatuses, setSelectedStatuses] = useState<ProjectStatus[]>(() =>
    parseList(searchParams.get('status')).filter((status) => STATUS_SET.has(status as ProjectStatus)) as ProjectStatus[]
  );
  const [sortBy, setSortBy] = useState<SortOption>(() => parseSort(searchParams.get('sort')));
  const totalNodes = PROJECTS.length;
  const activeNodes = PROJECTS.filter((project) => project.status === 'active').length;
  const experimentalNodes = PROJECTS.filter((project) => project.status === 'experimental').length;
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  const pathLens = useMemo(() => getAudiencePathConfig(audiencePath), [audiencePath]);

  const applyAudiencePathPresets = useCallback((id: AudiencePathId) => {
    const cfg = getAudiencePathConfig(id);
    switch (id) {
      case 'hire_fast':
        setSortBy('featured');
        setSelectedStacks([]);
        setSelectedStatuses([]);
        break;
      case 'technical_deep':
        setSortBy('status');
        setSelectedStacks(cfg.stackHint ?? []);
        setSelectedStatuses([]);
        break;
      case 'founder':
        setSortBy('status');
        setSelectedStacks([]);
        setSelectedStatuses(['experimental', 'active']);
        break;
      case 'design_proof':
        setSortBy('featured');
        setSelectedStacks(cfg.stackHint ?? []);
        setSelectedStatuses([]);
        break;
      default:
        break;
    }
  }, []);

  useLayoutEffect(() => {
    if (audiencePath) return;
    try {
      const stored = parseAudiencePathParam(localStorage.getItem(AUDIENCE_PATH_STORAGE_KEY));
      if (stored) setAudiencePath(stored);
    } catch {
      /* ignore */
    }
  }, [audiencePath]);

  useEffect(() => {
    try {
      if (!audiencePath) {
        localStorage.removeItem(AUDIENCE_PATH_STORAGE_KEY);
        return;
      }
      localStorage.setItem(AUDIENCE_PATH_STORAGE_KEY, audiencePath);
    } catch {
      /* ignore */
    }
  }, [audiencePath]);

  useLayoutEffect(() => {
    if (pathPresetsAppliedRef.current) return;
    const urlPath = parseAudiencePathParam(searchParams.get(AUDIENCE_PATH_QUERY_KEY));
    if (!urlPath) return;
    const hasCustomFilters =
      Boolean(searchParams.get('stack')) ||
      Boolean(searchParams.get('status')) ||
      (Boolean(searchParams.get('sort')) && parseSort(searchParams.get('sort')) !== 'featured');
    if (!hasCustomFilters) {
      applyAudiencePathPresets(urlPath);
    }
    pathPresetsAppliedRef.current = true;
  }, [searchParams, applyAudiencePathPresets]);

  const handleAudiencePathSelect = useCallback(
    (id: AudiencePathId) => {
      setAudiencePath(id);
      applyAudiencePathPresets(id);
    },
    [applyAudiencePathPresets],
  );

  useEffect(() => {
    const handle = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 250);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const matchesQuery = (project: Project) => {
    if (!normalizedQuery) return true;
    const haystack = `${project.name} ${project.desc} ${project.stack.join(' ')}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  };
  const matchesStackFilter = (project: Project) =>
    selectedStacks.length === 0 || project.stack.some((stack) => selectedStacks.includes(stack));
  const matchesStatusFilter = (project: Project) =>
    selectedStatuses.length === 0 || selectedStatuses.includes(project.status);

  const filteredProjects = useMemo(() => {
    const matchesQuery = (project: Project) => {
      if (!normalizedQuery) return true;
      const haystack = `${project.name} ${project.desc} ${project.stack.join(' ')}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    };
    const matchesStackFilter = (project: Project) =>
      selectedStacks.length === 0 || project.stack.some((stack) => selectedStacks.includes(stack));
    const matchesStatusFilter = (project: Project) =>
      selectedStatuses.length === 0 || selectedStatuses.includes(project.status);

    return PROJECTS.filter(
      (project) => matchesQuery(project) && matchesStackFilter(project) && matchesStatusFilter(project)
    );
  }, [normalizedQuery, selectedStacks, selectedStatuses]);

  const stackCounts = useMemo(() => {
    const counts = new Map<string, number>();
    PROJECTS.forEach((project) => {
      if (!matchesQuery(project)) return;
      if (!matchesStatusFilter(project)) return;
      project.stack.forEach((stack) => {
        counts.set(stack, (counts.get(stack) ?? 0) + 1);
      });
    });
    return counts;
  }, [normalizedQuery, selectedStatuses]);

  const statusCounts = useMemo(() => {
    const counts = new Map<ProjectStatus, number>();
    PROJECTS.forEach((project) => {
      if (!matchesQuery(project)) return;
      if (!matchesStackFilter(project)) return;
      counts.set(project.status, (counts.get(project.status) ?? 0) + 1);
    });
    return counts;
  }, [normalizedQuery, selectedStacks]);

  const availableStacks = useMemo(
    () => STACKS.filter((stack) => (stackCounts.get(stack) ?? 0) > 0 || selectedStacks.includes(stack)),
    [selectedStacks, stackCounts]
  );

  const availableStatuses = useMemo(
    () =>
      STATUS_ORDER.filter(
        (status) => (statusCounts.get(status) ?? 0) > 0 || selectedStatuses.includes(status)
      ),
    [selectedStatuses, statusCounts]
  );

  const showStackFilter = availableStacks.length >= 2;
  const showStatusFilter = availableStatuses.length >= 2;

  const displayProjects = useMemo(() => {
    const projects = [...filteredProjects];
    const getUpdatedTime = (project: Project) => {
      const time = new Date(project.updatedAt).getTime();
      return Number.isNaN(time) ? 0 : time;
    };

    if (sortBy === 'featured') {
      projects.sort((a, b) => {
        const pinnedDiff = Number(!!b.pinned) - Number(!!a.pinned);
        if (pinnedDiff !== 0) return pinnedDiff;
        return getUpdatedTime(b) - getUpdatedTime(a);
      });
      return projects;
    }

    if (sortBy === 'updated_desc') {
      projects.sort((a, b) => getUpdatedTime(b) - getUpdatedTime(a));
    } else if (sortBy === 'updated_asc') {
      projects.sort((a, b) => getUpdatedTime(a) - getUpdatedTime(b));
    } else if (sortBy === 'name_asc') {
      projects.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name_desc') {
      projects.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'status') {
      projects.sort((a, b) => {
        const orderA = STATUS_ORDER.indexOf(a.status);
        const orderB = STATUS_ORDER.indexOf(b.status);
        const safeA = orderA === -1 ? STATUS_ORDER.length : orderA;
        const safeB = orderB === -1 ? STATUS_ORDER.length : orderB;
        if (safeA !== safeB) return safeA - safeB;
        return a.name.localeCompare(b.name);
      });
    }

    return projects;
  }, [filteredProjects, sortBy]);

  const lastUpdatedDate = new Date(projectsData.lastUpdated);
  const lastUpdated = Number.isNaN(lastUpdatedDate.getTime())
    ? 'unknown'
    : lastUpdatedDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  const toggleSelection = <T,>(value: T, selections: T[], setSelections: (next: T[]) => void) => {
    if (selections.includes(value)) {
      setSelections(selections.filter((item) => item !== value));
    } else {
      setSelections([...selections, value]);
    }
  };

  const clearFilters = () => {
    setSelectedStacks([]);
    setSelectedStatuses([]);
    setSearchInput('');
    setSearchQuery('');
    setAudiencePath(null);
  };

  const handleFiltersToggle = () => {
    setFiltersOpen((prev) => !prev);
  };

  useEffect(() => {
    const nextParams = new URLSearchParams();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) nextParams.set('q', trimmedQuery);
    if (selectedStacks.length > 0) nextParams.set('stack', [...selectedStacks].sort().join(','));
    if (selectedStatuses.length > 0) nextParams.set('status', [...selectedStatuses].sort().join(','));
    if (sortBy !== 'featured') nextParams.set('sort', sortBy);
    if (audiencePath) nextParams.set(AUDIENCE_PATH_QUERY_KEY, audiencePath);

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchParams, searchQuery, selectedStacks, selectedStatuses, sortBy, audiencePath, setSearchParams]);

  const activeFilters = [
    ...(searchQuery.trim()
      ? [
        {
          key: 'search',
          label: `search:${searchQuery.trim()}`,
          onRemove: () => {
            setSearchInput('');
            setSearchQuery('');
          }
        }
      ]
      : []),
    ...selectedStacks.map((stack) => ({
      key: `stack-${stack}`,
      label: stack,
      onRemove: () => toggleSelection(stack, selectedStacks, setSelectedStacks)
    })),
    ...selectedStatuses.map((status) => ({
      key: `status-${status}`,
      label: status,
      onRemove: () => toggleSelection(status, selectedStatuses, setSelectedStatuses)
    })),
    ...(audiencePath
      ? [
          {
            key: 'audience-path',
            label: `lens:${audiencePath.replace(/_/g, ' ')}`,
            onRemove: () => setAudiencePath(null),
          },
        ]
      : [])
  ];
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="space-y-16 sm:space-y-24 md:space-y-32 animate-fadeIn">
      <section className="relative">
        <h1 className="font-headline text-5xl sm:text-7xl md:text-8xl text-on-surface leading-[0.95] tracking-tight mb-12 md:mb-16 text-glow-soft">
          {pathLens.heroLead}{' '}
          <span className="italic font-light text-primary">{pathLens.heroAccent}</span>
          <br />
          {pathLens.heroRest}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          <div className="col-span-1 md:col-span-2 glass-panel p-8 sm:p-10 rounded-[2rem] flex flex-col justify-between min-h-[260px] relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/30 rounded-full blur-3xl group-hover:bg-primary-container/50 transition-all duration-700 pointer-events-none" />
            <div className="flex items-center gap-3 text-on-surface-variant mb-4 relative z-10">
              <Sparkles size={20} className="text-primary opacity-80" />
              <span className="font-body text-xs uppercase tracking-widest font-semibold">Archive</span>
            </div>
            <div className="relative z-10">
              <p className="font-headline text-5xl sm:text-6xl text-primary mb-2">{totalNodes}</p>
              <p className="text-on-surface-variant font-body font-light max-w-sm leading-relaxed">
                {pathLens.archiveLine}
              </p>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[2rem] flex flex-col justify-between min-h-[200px]">
            <FolderKanban className="text-primary mb-6" size={28} strokeWidth={1.5} />
            <div>
              <p className="font-headline text-4xl text-on-surface mb-1">{String(activeNodes).padStart(2, '0')}</p>
              <p className="text-on-surface-variant text-sm uppercase tracking-wider font-body font-medium">Active</p>
            </div>
          </div>

          <div className="editorial-gradient p-8 rounded-[2rem] flex flex-col justify-between shadow-ambient min-h-[200px]">
            <div className="flex justify-end">
              <Sparkles className="text-primary-container opacity-90" size={26} strokeWidth={1.25} />
            </div>
            <div className="text-on-primary">
              <p className="font-headline text-4xl mb-1">{experimentalNodes}</p>
              <p className="opacity-80 text-sm uppercase tracking-wider font-body font-medium">Experimental</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="https://github.com/pc-style/pcstyledev"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-container-low text-on-surface font-body text-sm font-semibold hover:bg-surface-container transition-colors shadow-ambient"
          >
            <Github size={18} /> View source
          </a>
          <Link
            to="/demo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full editorial-gradient text-on-primary font-body text-sm font-semibold shadow-ambient hover:opacity-90 transition-opacity"
          >
            <FlaskConical size={18} /> Signature lab
          </Link>
          <p className="text-on-surface-variant text-sm font-body">
            Last index update: <span className="text-primary font-medium">{lastUpdated}</span>
          </p>
        </div>
      </section>

      <AudiencePathSelector activePath={audiencePath} onSelect={handleAudiencePathSelect} />

      <section className="rounded-[2.5rem] bg-surface-container-low p-6 sm:p-8 md:p-10 relative overflow-hidden">
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-container/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <span className="font-body text-primary font-semibold tracking-widest uppercase text-xs mb-3 block">
              Curation
            </span>
            <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl text-on-surface tracking-tight">Projects</h2>
          </div>
          <p className="text-on-surface-variant max-w-md font-body font-light text-base sm:text-lg italic leading-relaxed">
            {pathLens.curationLine}
          </p>
        </div>

        <div className="relative z-10 glass-panel rounded-3xl p-5 sm:p-8 space-y-6 mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="font-body text-sm text-on-surface-variant">
                Showing <span className="text-primary font-semibold">{displayProjects.length}</span> of{' '}
                <span className="font-semibold text-on-surface">{PROJECTS.length}</span> projects
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleFiltersToggle}
                aria-expanded={filtersOpen}
                aria-controls="project-filter-panel"
                className="text-xs font-body font-semibold uppercase tracking-widest px-5 py-2.5 rounded-full bg-surface-container text-on-surface hover:bg-primary-container/40 transition-colors"
              >
                {filtersOpen ? 'Hide filters' : 'Filters & sort'}
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-body font-semibold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={filter.onRemove}
                  className="px-4 py-2 rounded-full text-xs font-body font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  {filter.label} ×
                </button>
              ))}
            </div>
          )}

          {filtersOpen && (
            <div id="project-filter-panel" className="space-y-8 pt-2">
              <div className="flex flex-col lg:flex-row gap-6 lg:items-end lg:justify-between">
                <div className="flex-1">
                  <label htmlFor="project-search" className="text-xs font-body font-semibold text-on-surface-variant uppercase tracking-widest block mb-2">
                    Search
                  </label>
                  <input
                    id="project-search"
                    type="search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Name, description, stack…"
                    className="w-full bg-surface-container-low rounded-xl px-4 py-3 font-body text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/25"
                  />
                </div>
                <div className="lg:min-w-[200px]">
                  <label className="text-xs font-body font-semibold text-on-surface-variant uppercase tracking-widest block mb-2">
                    Sort
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full bg-surface-container-low rounded-xl px-4 py-3 font-body text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/25"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {showStackFilter && (
                <div>
                  <span className="text-xs font-body font-semibold text-on-surface-variant uppercase tracking-widest block mb-3">
                    Stack
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {availableStacks.map((stack) => {
                      const active = selectedStacks.includes(stack);
                      const count = stackCounts.get(stack) ?? 0;
                      const disabled = count === 0 && !active;
                      return (
                        <button
                          key={stack}
                          type="button"
                          onClick={() => toggleSelection(stack, selectedStacks, setSelectedStacks)}
                          className={`px-4 py-2 rounded-full text-xs font-body font-medium transition-all ${
                            active
                              ? 'bg-primary text-on-primary shadow-ambient'
                              : 'bg-surface-container text-on-surface-variant hover:text-primary hover:bg-primary-container/30'
                          } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                          aria-pressed={active}
                          aria-disabled={disabled}
                          disabled={disabled}
                        >
                          {stack}{' '}
                          <span className="opacity-70">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {showStatusFilter && (
                <div>
                  <span className="text-xs font-body font-semibold text-on-surface-variant uppercase tracking-widest block mb-3">
                    Status
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {availableStatuses.map((status) => {
                      const active = selectedStatuses.includes(status);
                      const count = statusCounts.get(status) ?? 0;
                      const disabled = count === 0 && !active;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => toggleSelection(status, selectedStatuses, setSelectedStatuses)}
                          className={`px-4 py-2 rounded-full text-xs font-body font-medium transition-all ${
                            active
                              ? 'bg-primary text-on-primary shadow-ambient'
                              : 'bg-surface-container text-on-surface-variant hover:text-primary hover:bg-primary-container/30'
                          } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                          aria-pressed={active}
                          aria-disabled={disabled}
                          disabled={disabled}
                        >
                          {status}{' '}
                          <span className="opacity-70">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:grid-flow-dense md:auto-rows-min gap-6 md:gap-8">
          {displayProjects.length === 0 ? (
            <div className="col-span-full glass-panel rounded-[2rem] p-12 text-center">
              <p className="font-body text-on-surface-variant">No projects match these filters.</p>
            </div>
          ) : (
            displayProjects.map((p, idx) => {
              const variant = projectTileVariant(idx);
              return (
                <div key={p.id} className={`min-w-0 ${projectGridCellClass(variant)}`}>
                  <ProjectCard
                    project={p}
                    soundEnabled={soundEnabled}
                    synth={synth}
                    delay={idx * 50}
                    variant={variant}
                    onOpenModal={setActiveModalProject}
                  />
                </div>
              );
            })
          )}
        </div>
      </section>

      <ProjectModal project={activeModalProject} onClose={() => setActiveModalProject(null)} />
    </div>
  );
};
