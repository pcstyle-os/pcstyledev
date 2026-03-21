import React from 'react';
import { Link } from 'react-router-dom';
import { Github, FlaskConical } from 'lucide-react';
import { ProjectCard } from '../components/ui/ProjectCard';
import { ProjectModal } from '../components/ui/ProjectModal';
import { AudiencePathSelector } from '../components/ui/AudiencePathSelector';
import { SeoHome } from '../components/Seo';
import type { Project, ProjectStatus } from '../lib/types';
import type { Synth } from '../utils/audio';
import type { AudiencePathId } from '../lib/audiencePaths';

type SortOption =
  | 'featured'
  | 'updated_desc'
  | 'updated_asc'
  | 'name_asc'
  | 'name_desc'
  | 'status';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'featured_first' },
  { value: 'updated_desc', label: 'recent_updates' },
  { value: 'updated_asc', label: 'oldest_updates' },
  { value: 'name_asc', label: 'name_asc' },
  { value: 'name_desc', label: 'name_desc' },
  { value: 'status', label: 'status' },
];

type FilterChip = {
  key: string;
  label: string;
  onRemove: () => void;
};

export interface ProjectsArtifactViewProps {
  totalNodes: number;
  activeNodes: number;
  experimentalNodes: number;
  lastUpdated: string;
  displayProjects: Project[];
  projectCount: number;
  filtersOpen: boolean;
  handleFiltersToggle: () => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  activeFilters: FilterChip[];
  searchInput: string;
  setSearchInput: (v: string) => void;
  sortBy: SortOption;
  setSortBy: (v: SortOption) => void;
  showStackFilter: boolean;
  availableStacks: string[];
  stackCounts: Map<string, number>;
  topStackSet: Set<string>;
  selectedStacks: string[];
  setSelectedStacks: (v: string[]) => void;
  showStatusFilter: boolean;
  availableStatuses: ProjectStatus[];
  statusCounts: Map<ProjectStatus, number>;
  selectedStatuses: ProjectStatus[];
  setSelectedStatuses: (v: ProjectStatus[]) => void;
  soundEnabled: boolean;
  synth: Synth | null;
  activeModalProject: Project | null;
  setActiveModalProject: (p: Project | null) => void;
  audiencePath: AudiencePathId | null;
  onAudiencePathSelect: (id: AudiencePathId) => void;
  toggleSelection: <T,>(value: T, selections: T[], setSelections: (next: T[]) => void) => void;
}

export function ProjectsArtifactView({
  totalNodes,
  activeNodes,
  experimentalNodes,
  lastUpdated,
  displayProjects,
  projectCount,
  filtersOpen,
  handleFiltersToggle,
  hasActiveFilters,
  clearFilters,
  activeFilters,
  searchInput,
  setSearchInput,
  sortBy,
  setSortBy,
  showStackFilter,
  availableStacks,
  stackCounts,
  topStackSet,
  selectedStacks,
  setSelectedStacks,
  showStatusFilter,
  availableStatuses,
  statusCounts,
  selectedStatuses,
  setSelectedStatuses,
  soundEnabled,
  synth,
  activeModalProject,
  setActiveModalProject,
  audiencePath,
  onAudiencePathSelect,
  toggleSelection,
}: ProjectsArtifactViewProps) {
  return (
    <div className="space-y-10 sm:space-y-14 md:space-y-20 animate-fadeIn text-gray-300">
      <SeoHome />

      <div className="flex flex-col md:flex-row justify-between items-end gap-6 sm:gap-8 md:gap-10 border-l-[6px] border-[#ff00ff] pl-4 sm:pl-6 md:pl-10 py-4">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-4 italic leading-none">
            artifact_nodes
          </h2>
          <p className="text-gray-500 max-w-xl text-xs lowercase font-mono opacity-80 leading-relaxed">
            exploring the junction of human interaction and autonomous code.
            decrypted from public repository archives.
          </p>
          <div className="pt-6 flex flex-wrap gap-3">
            <a
              href="https://github.com/pc-style/pcstyledev"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-8 py-3 border border-gray-800 text-gray-400 hover:text-white hover:border-white transition-all font-black uppercase text-[10px] tracking-[0.35em] cursor-none"
            >
              <Github size={16} /> show_source
            </a>
            <Link
              to="/demo"
              className="inline-flex items-center gap-3 px-8 py-3 border border-[#ff00ff]/40 text-[#ff00ff] hover:bg-[#ff00ff]/10 transition-all font-black uppercase text-[10px] tracking-[0.35em] cursor-none"
            >
              <FlaskConical size={16} /> signature_lab
            </Link>
            <Link
              to="/hire"
              className="inline-flex items-center gap-3 px-8 py-3 border border-white/10 text-gray-500 hover:text-white hover:border-white/40 transition-all font-black uppercase text-[10px] tracking-[0.35em] cursor-none"
            >
              hire_protocol
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 w-full md:w-auto">
          <div className="p-4 bg-white/5 border border-white/10">
            <span className="text-[9px] text-[#ff00ff] block uppercase font-black tracking-widest mb-1">total_nodes</span>
            <span className="text-3xl font-mono text-white tracking-tighter">{totalNodes}</span>
          </div>
          <div className="p-4 bg-white/5 border border-white/10">
            <span className="text-[9px] text-[#ff00ff] block uppercase font-black tracking-widest mb-1">active_nodes</span>
            <span className="text-3xl font-mono text-white tracking-tighter">{activeNodes}</span>
          </div>
          <div className="p-4 bg-white/5 border border-white/10">
            <span className="text-[9px] text-[#ff00ff] block uppercase font-black tracking-widest mb-1">exp_nodes</span>
            <span className="text-3xl font-mono text-white tracking-tighter">{experimentalNodes}</span>
          </div>
          <div className="p-4 bg-white/5 border border-white/10">
            <span className="text-[9px] text-[#ff00ff] block uppercase font-black tracking-widest mb-1">last_updated</span>
            <span className="text-xl sm:text-2xl md:text-3xl font-mono text-white tracking-tighter leading-none">
              {lastUpdated}
            </span>
          </div>
        </div>
      </div>

      <AudiencePathSelector variant="artifact" activePath={audiencePath} onSelect={onAudiencePathSelect} />

      <div className="space-y-4 sm:space-y-6 border border-white/10 bg-black/40 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] text-[#ff00ff] block uppercase font-black tracking-[0.4em]">filter_matrix</span>
            <p className="text-xs text-gray-500 font-mono lowercase">
              showing {displayProjects.length} / {projectCount} nodes
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleFiltersToggle}
              aria-expanded={filtersOpen}
              aria-controls="project-filter-panel"
              className="text-[10px] uppercase font-black tracking-[0.3em] px-4 py-3 border border-white/10 text-gray-400 hover:text-white hover:border-white transition-all"
            >
              {filtersOpen ? 'hide_filters' : 'show_filters'}
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-[10px] uppercase font-black tracking-[0.3em] px-4 py-3 border border-white/10 text-gray-500 hover:text-white hover:border-white transition-all"
              >
                clear_filters
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
                className="px-3 py-2 text-[9px] font-black uppercase tracking-[0.25em] border border-[#ff00ff]/40 text-[#ff00ff] bg-[#ff00ff]/10 hover:bg-transparent transition-all"
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {filtersOpen && (
          <div id="project-filter-panel" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-end lg:justify-between">
              <div className="flex-1">
                <label
                  htmlFor="project-search-artifact"
                  className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-500 block mb-3"
                >
                  search_nodes
                </label>
                <input
                  id="project-search-artifact"
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="name, description, stack"
                  className="w-full bg-black/60 border border-white/10 text-[11px] uppercase tracking-[0.25em] px-4 py-3 text-gray-300 font-black focus:outline-none focus-visible:border-white/40"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-500 block mb-3">
                  sort_by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-black/60 border border-white/10 text-[10px] uppercase tracking-[0.3em] px-4 py-3 text-gray-300 font-black focus:outline-none focus-visible:border-white/40"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="text-black">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {showStackFilter && (
              <div>
                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-500 block mb-3">
                  stack_filter
                </span>
                <div className="flex flex-wrap gap-3">
                  {availableStacks.map((stack) => {
                    const active = selectedStacks.includes(stack);
                    const count = stackCounts.get(stack) ?? 0;
                    const disabled = count === 0 && !active;
                    const isTopStack = topStackSet.has(stack);
                    return (
                      <button
                        key={stack}
                        type="button"
                        onClick={() => toggleSelection(stack, selectedStacks, setSelectedStacks)}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] border transition-all ${
                          active
                            ? 'border-[#ff00ff] text-[#ff00ff] bg-[#ff00ff]/10 shadow-[0_0_18px_rgba(255,0,255,0.2)]'
                            : 'border-white/10 text-gray-500 hover:text-white hover:border-white/40'
                        } ${isTopStack ? 'shadow-[0_0_22px_rgba(255,0,255,0.35)]' : ''} ${
                          disabled ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                        aria-pressed={active}
                        aria-disabled={disabled}
                        disabled={disabled}
                      >
                        {stack} <span className="ml-2 text-[9px] text-gray-600">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {showStatusFilter && (
              <div>
                <span className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-500 block mb-3">
                  status_filter
                </span>
                <div className="flex flex-wrap gap-3">
                  {availableStatuses.map((status) => {
                    const active = selectedStatuses.includes(status);
                    const count = statusCounts.get(status) ?? 0;
                    const disabled = count === 0 && !active;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => toggleSelection(status, selectedStatuses, setSelectedStatuses)}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] border transition-all ${
                          active
                            ? 'border-[#ff00ff] text-[#ff00ff] bg-[#ff00ff]/10 shadow-[0_0_18px_rgba(255,0,255,0.2)]'
                            : 'border-white/10 text-gray-500 hover:text-white hover:border-white/40'
                        } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                        aria-pressed={active}
                        aria-disabled={disabled}
                        disabled={disabled}
                      >
                        {status} <span className="ml-2 text-[9px] text-gray-600">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {displayProjects.length === 0 ? (
          <div className="col-span-full border border-white/10 bg-black/40 p-10 text-center">
            <p className="text-[11px] uppercase tracking-[0.4em] text-gray-600 font-black">no_nodes_match_filters</p>
          </div>
        ) : (
          displayProjects.map((p, idx) => (
            <ProjectCard
              key={p.id}
              project={p}
              soundEnabled={soundEnabled}
              synth={synth}
              delay={idx * 50}
              variant="default"
              onOpenModal={setActiveModalProject}
            />
          ))
        )}
      </div>

      <ProjectModal project={activeModalProject} onClose={() => setActiveModalProject(null)} />
    </div>
  );
}
