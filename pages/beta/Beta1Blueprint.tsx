import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, Crosshair, Ruler, Compass } from 'lucide-react';
import projectsData from '../../data/projects/projects.json';
import type { Project } from '../../lib/types';

const PROJECTS: Project[] = projectsData.projects as Project[];
const ACTIVE_PROJECTS = PROJECTS.filter(p => p.status !== 'disabled');

/**
 * Beta 1 — "Blueprint"
 * 
 * Architectural/engineering blueprint aesthetic. 
 * Dark navy bg with cyan gridlines, technical drawing callouts,
 * dimension markers, and coordinate notation. Developer-focused
 * but feels like reading a technical schematic, not a hacker terminal.
 */

// Blueprint grid background
const BlueprintGrid = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(56,189,248,0.06)" strokeWidth="0.5" />
        </pattern>
        <pattern id="bigGrid" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#smallGrid)" />
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(56,189,248,0.12)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bigGrid)" />
    </svg>
  </div>
);

// Dimension line component
const DimensionLine = ({ label, className = '' }: { label: string; className?: string }) => (
  <div className={`flex items-center gap-2 text-sky-500/40 ${className}`}>
    <div className="w-2 h-[1px] bg-sky-500/40" />
    <div className="h-3 w-[1px] bg-sky-500/40" />
    <span className="text-[8px] font-mono tracking-widest uppercase">{label}</span>
    <div className="h-3 w-[1px] bg-sky-500/40" />
    <div className="flex-1 h-[1px] bg-sky-500/40" />
  </div>
);

// Coordinate tag
const CoordTag = ({ x, y, className = '' }: { x: string; y: string; className?: string }) => (
  <span className={`text-[7px] font-mono text-sky-600/50 tracking-wider ${className}`}>
    [{x}, {y}]
  </span>
);

// Project blueprint card
const BlueprintCard = ({ project, index }: { key?: React.Key; project: Project; index: number }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group"
    >
      {/* Corner markers */}
      <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-sky-400/40 transition-colors group-hover:border-sky-400" />
      <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-sky-400/40 transition-colors group-hover:border-sky-400" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-sky-400/40 transition-colors group-hover:border-sky-400" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-sky-400/40 transition-colors group-hover:border-sky-400" />

      <div className={`border border-sky-500/15 bg-[#0a1628]/80 backdrop-blur-sm p-6 transition-all duration-500 ${hovered ? 'border-sky-400/50 bg-[#0c1e38]/90 shadow-[0_0_40px_rgba(56,189,248,0.08)]' : ''}`}>
        {/* Header row: revision + status */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-[8px] font-mono text-sky-600/60 tracking-[0.3em] uppercase">
            rev.{String(index + 1).padStart(3, '0')}
          </span>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${project.status === 'active' ? 'bg-emerald-400' : project.status === 'experimental' ? 'bg-amber-400' : 'bg-sky-400/40'}`} />
            <span className="text-[8px] font-mono text-sky-500/50 tracking-widest uppercase">{project.status}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-sky-100 mb-2 tracking-tight group-hover:text-white transition-colors" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {project.name}
        </h3>

        {/* Description with dimension lines */}
        <div className="relative pl-4 border-l border-dashed border-sky-500/20 mb-5">
          <p className="text-[12px] text-sky-300/50 leading-relaxed font-mono">
            {project.desc}
          </p>
        </div>

        {/* Stack as blueprint annotations */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.stack.map(s => (
            <span key={s} className="text-[9px] font-mono px-2 py-0.5 border border-sky-500/15 text-sky-400/60 bg-sky-500/5 tracking-wider group-hover:border-sky-400/30 group-hover:text-sky-400/80 transition-all">
              {s}
            </span>
          ))}
        </div>

        {/* Links with arrow notation */}
        <div className="flex items-center gap-6 pt-4 border-t border-dashed border-sky-500/10">
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-mono text-sky-400/60 hover:text-sky-300 transition-colors">
              <ArrowUpRight size={12} />
              <span className="tracking-wider">LIVE</span>
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-mono text-sky-400/40 hover:text-sky-300 transition-colors">
              <Github size={12} />
              <span className="tracking-wider">SRC</span>
            </a>
          )}
          {project.pinned && (
            <span className="ml-auto text-[8px] font-mono text-amber-400/60 border border-amber-400/20 px-2 py-0.5 tracking-widest">
              FEATURED
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const Beta1Blueprint = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#080f1e] text-sky-200 selection:bg-sky-400 selection:text-[#080f1e] overflow-x-hidden" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <BlueprintGrid />

      {/* Drawing border frame */}
      <div className="fixed inset-4 pointer-events-none z-40 border border-sky-500/10" />
      <div className="fixed inset-6 pointer-events-none z-40 border border-sky-500/5" />

      {/* Title block (bottom right - like real blueprints) */}
      <div className="fixed bottom-6 right-6 z-50 border border-sky-500/20 bg-[#080f1e]/95 backdrop-blur-sm p-4 hidden lg:block">
        <div className="text-[7px] font-mono text-sky-600/40 tracking-[0.4em] uppercase mb-1">SHEET 1 OF 1</div>
        <div className="text-[7px] font-mono text-sky-600/40 tracking-[0.3em] uppercase">
          DWG: PCSTYLE-PORTFOLIO-{time.getFullYear()}
        </div>
        <div className="text-[7px] font-mono text-sky-600/40 tracking-[0.3em] uppercase mt-1">
          DATE: {time.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <header className="pt-16 md:pt-24 pb-16 md:pb-20">
          <CoordTag x="0" y="0" className="mb-4 block" />

          <div className="flex items-end gap-6 mb-6">
            <div className="flex items-center gap-3">
              <Crosshair size={20} className="text-sky-400/60" />
              <div className="w-12 h-[1px] bg-sky-400/30" />
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter leading-[0.85]"
          >
            pcstyle
            <span className="text-sky-400/80">.dev</span>
          </motion.h1>

          <DimensionLine label="SECTION A — IDENTITY" className="mt-6 max-w-md" />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-6 text-sm text-sky-300/40 max-w-lg leading-relaxed"
          >
            First year AI student at Politechnika Częstochowska.
            Building high-fidelity tools and procedural systems.
            This document contains the architectural specifications.
          </motion.p>

          {/* Contact row */}
          <div className="flex flex-wrap gap-4 mt-8">
            <a
              href="https://github.com/pc-style"
              target="_blank" rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 border border-sky-500/25 text-sky-400/70 text-[10px] font-mono tracking-[0.25em] uppercase hover:border-sky-400 hover:text-sky-300 transition-all"
            >
              <Github size={14} /> GitHub
            </a>
            <a
              href="mailto:AdamKrupa@Tuta.io"
              className="flex items-center gap-2 px-5 py-2.5 border border-sky-500/25 text-sky-400/70 text-[10px] font-mono tracking-[0.25em] uppercase hover:border-sky-400 hover:text-sky-300 transition-all"
            >
              <Compass size={14} /> Contact
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-12 max-w-md">
            <div className="border border-sky-500/15 p-4 bg-sky-500/5">
              <div className="text-[7px] text-sky-500/50 tracking-[0.4em] uppercase mb-2">TOTAL</div>
              <div className="text-2xl font-bold text-white">{ACTIVE_PROJECTS.length}</div>
            </div>
            <div className="border border-sky-500/15 p-4 bg-sky-500/5">
              <div className="text-[7px] text-sky-500/50 tracking-[0.4em] uppercase mb-2">ACTIVE</div>
              <div className="text-2xl font-bold text-emerald-400">{ACTIVE_PROJECTS.filter(p => p.status === 'active').length}</div>
            </div>
            <div className="border border-sky-500/15 p-4 bg-sky-500/5">
              <div className="text-[7px] text-sky-500/50 tracking-[0.4em] uppercase mb-2">EXP.</div>
              <div className="text-2xl font-bold text-amber-400">{ACTIVE_PROJECTS.filter(p => p.status === 'experimental').length}</div>
            </div>
          </div>
        </header>

        {/* Divider */}
        <DimensionLine label="SECTION B — PROJECT SPECIFICATIONS" className="mb-12" />

        {/* Featured Projects */}
        {ACTIVE_PROJECTS.filter(p => p.pinned).length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Ruler size={14} className="text-amber-400/60" />
              <span className="text-[9px] font-mono text-amber-400/60 tracking-[0.4em] uppercase">Featured Specifications</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACTIVE_PROJECTS.filter(p => p.pinned).map((project, i) => (
                <BlueprintCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* All Projects */}
        <section className="pb-24">
          <div className="flex items-center gap-3 mb-8">
            <Ruler size={14} className="text-sky-400/40" />
            <span className="text-[9px] font-mono text-sky-500/50 tracking-[0.4em] uppercase">All Specifications ({ACTIVE_PROJECTS.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACTIVE_PROJECTS.map((project, i) => (
              <BlueprintCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="pb-12 border-t border-sky-500/10 pt-8">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-mono text-sky-600/30 tracking-[0.3em]">
              © {time.getFullYear()} PCSTYLE.DEV — ALL SPECIFICATIONS RESERVED
            </span>
            <CoordTag x="END" y="EOF" />
          </div>
        </footer>
      </div>
    </div>
  );
};
