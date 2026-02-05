import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, ChevronRight } from 'lucide-react';
import projectsData from '../../data/projects/projects.json';
import type { Project } from '../../lib/types';

const PROJECTS: Project[] = projectsData.projects as Project[];
const ACTIVE_PROJECTS = PROJECTS.filter(p => p.status !== 'disabled');
const FEATURED = ACTIVE_PROJECTS.filter(p => p.pinned);
const NON_FEATURED = ACTIVE_PROJECTS.filter(p => !p.pinned);

/**
 * Beta 2 — "Editorial"
 *
 * Newspaper/magazine broadsheet aesthetic. Serif typography,
 * multi-column layouts, ruled lines, pull quotes.
 * Warm off-white background, deep black text, crimson accent.
 * Completely departs from terminal/hacker aesthetic.
 */

const CRIMSON = '#c41e3a';

// Masthead separator
const RuledLine = ({ weight = 'thin' }: { weight?: 'thin' | 'thick' | 'double' }) => {
  if (weight === 'double') {
    return (
      <div className="my-4">
        <div className="h-[2px] bg-[#1a1a1a]" />
        <div className="h-[1px] bg-[#1a1a1a] mt-[2px]" />
      </div>
    );
  }
  if (weight === 'thick') return <div className="h-[3px] bg-[#1a1a1a] my-4" />;
  return <div className="h-[1px] bg-[#1a1a1a]/20 my-4" />;
};

// Editorial project card
const EditorialCard = ({ project, index, size = 'normal' }: { key?: React.Key; project: Project; index: number; size?: 'large' | 'normal' | 'small' }) => {

  if (size === 'large') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.08, duration: 0.6 }}
        className="group"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: CRIMSON, fontFamily: "'Source Serif 4', Georgia, serif" }}>
            {project.status === 'active' ? 'Active' : project.status === 'experimental' ? 'Experimental' : project.status}
          </span>
          {project.pinned && (
            <>
              <span className="text-[#1a1a1a]/30">·</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: CRIMSON }}>Featured</span>
            </>
          )}
        </div>

        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-[1.05] mb-4 group-hover:text-[#c41e3a] transition-colors cursor-pointer"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {project.name}
        </h2>

        <p
          className="text-base md:text-lg text-[#3a3a3a] leading-relaxed mb-5 max-w-xl"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
        >
          {project.desc}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.stack.map(s => (
            <span key={s} className="text-[10px] font-mono px-2 py-0.5 bg-[#1a1a1a]/5 text-[#5a5a5a] border border-[#1a1a1a]/10">
              {s}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-5">
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] hover:underline" style={{ color: CRIMSON, fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Visit <ArrowUpRight size={13} />
            </a>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#5a5a5a] hover:text-[#1a1a1a] hover:underline" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Source <Github size={13} />
            </a>
          )}
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group py-4 border-b border-[#1a1a1a]/10 last:border-none"
    >
      <div className="flex items-start gap-3">
        <span className="text-[11px] font-mono text-[#1a1a1a]/25 mt-1 shrink-0" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3
              className="text-base font-bold text-[#1a1a1a] group-hover:text-[#c41e3a] transition-colors cursor-pointer leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {project.name}
            </h3>
            <span className={`text-[8px] font-bold uppercase tracking-[0.2em] px-1.5 py-0.5 ${project.status === 'active' ? 'bg-emerald-100 text-emerald-700' : project.status === 'experimental' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
              {project.status}
            </span>
          </div>
          <p className="text-[13px] text-[#5a5a5a] leading-relaxed" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
            {project.desc}
          </p>
          <div className="flex items-center gap-4 mt-2">
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase tracking-[0.15em] hover:underline" style={{ color: CRIMSON }}>
                Visit →
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#888] hover:text-[#1a1a1a]">
                Source
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export const Beta2Editorial = () => {
  const [date] = useState(new Date());

  return (
    <>
      {/* Load editorial fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,400&display=swap');
      `}</style>

      <div
        className="min-h-screen selection:bg-[#c41e3a] selection:text-white overflow-x-hidden"
        style={{ background: '#f5f0e8', color: '#1a1a1a' }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12">

          {/* Dateline */}
          <div className="pt-6 pb-2 flex items-center justify-between border-b border-[#1a1a1a]/10">
            <span className="text-[10px] font-mono text-[#1a1a1a]/40 tracking-[0.3em] uppercase">
              Częstochowa, Poland
            </span>
            <span className="text-[10px] font-mono text-[#1a1a1a]/40 tracking-[0.3em] uppercase">
              {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          {/* Masthead */}
          <header className="text-center py-8 md:py-12">
            <RuledLine weight="thick" />
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <span className="italic">pc</span>style
            </motion.h1>
            <p className="text-[11px] uppercase tracking-[0.6em] text-[#1a1a1a]/40 mt-3 font-bold" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
              A Developer's Chronicle — Projects, Tools & Digital Artifacts
            </p>
            <RuledLine weight="double" />
          </header>

          {/* Subhead / About banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col md:flex-row items-start gap-6 md:gap-12 mb-8 py-6 border-y border-[#1a1a1a]/15"
          >
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] block mb-2" style={{ color: CRIMSON }}>
                About the Author
              </span>
              <p className="text-base md:text-lg text-[#3a3a3a] leading-relaxed" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
                Adam Krupa is a first-year AI student at Politechnika Częstochowska, crafting high-fidelity tools and procedural wonders. Dedicated to aesthetic performance and privacy-first engineering.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <a
                href="https://github.com/pc-style"
                target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#1a1a1a] text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#1a1a1a] hover:text-[#f5f0e8] transition-all"
              >
                <Github size={14} /> GitHub
              </a>
              <a
                href="mailto:AdamKrupa@Tuta.io"
                className="flex items-center gap-2 px-5 py-2.5 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-80 transition-all"
                style={{ backgroundColor: CRIMSON }}
              >
                Contact
              </a>
            </div>
          </motion.div>

          {/* Featured Stories - Newspaper Layout */}
          {FEATURED.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: CRIMSON, fontFamily: "'Source Serif 4', Georgia, serif" }}>
                  Headlines
                </span>
                <div className="flex-1 h-[1px] bg-[#1a1a1a]/15" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {FEATURED.map((project, i) => (
                  <React.Fragment key={project.id}>
                    <EditorialCard project={project} index={i} size="large" />
                    {i < FEATURED.length - 1 && (
                      <div className="hidden md:block" /> 
                    )}
                  </React.Fragment>
                ))}
              </div>

              <RuledLine weight="thin" />
            </section>
          )}

          {/* All projects in column layout */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: CRIMSON, fontFamily: "'Source Serif 4', Georgia, serif" }}>
                Full Index
              </span>
              <div className="flex-1 h-[1px] bg-[#1a1a1a]/15" />
              <span className="text-[10px] text-[#1a1a1a]/40 tracking-[0.2em] uppercase font-mono">{ACTIVE_PROJECTS.length} entries</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              {/* Left column */}
              <div>
                {ACTIVE_PROJECTS.slice(0, Math.ceil(ACTIVE_PROJECTS.length / 2)).map((project, i) => (
                  <EditorialCard key={project.id} project={project} index={i} size="normal" />
                ))}
              </div>
              {/* Right column */}
              <div className="border-l border-[#1a1a1a]/10 pl-8 hidden md:block">
                {ACTIVE_PROJECTS.slice(Math.ceil(ACTIVE_PROJECTS.length / 2)).map((project, i) => (
                  <EditorialCard key={project.id} project={project} index={i + Math.ceil(ACTIVE_PROJECTS.length / 2)} size="normal" />
                ))}
              </div>
              {/* Mobile: remaining items without column split */}
              <div className="md:hidden">
                {ACTIVE_PROJECTS.slice(Math.ceil(ACTIVE_PROJECTS.length / 2)).map((project, i) => (
                  <EditorialCard key={project.id} project={project} index={i + Math.ceil(ACTIVE_PROJECTS.length / 2)} size="normal" />
                ))}
              </div>
            </div>
          </section>

          {/* Pull quote section */}
          <div className="py-12 border-y-2 border-[#1a1a1a] text-center mb-16">
            <blockquote
              className="text-2xl md:text-3xl font-bold italic text-[#1a1a1a] leading-snug max-w-2xl mx-auto"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              "Every line of code is a rebellion against the static."
            </blockquote>
            <cite className="text-[11px] font-bold uppercase tracking-[0.3em] mt-4 block text-[#1a1a1a]/40" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
              — pcstyle manifesto
            </cite>
          </div>

          {/* Tech stack summary */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em]" style={{ color: CRIMSON, fontFamily: "'Source Serif 4', Georgia, serif" }}>
                Technology Index
              </span>
              <div className="flex-1 h-[1px] bg-[#1a1a1a]/15" />
            </div>

            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(ACTIVE_PROJECTS.flatMap(p => p.stack))).sort().map(tech => {
                const count = ACTIVE_PROJECTS.filter(p => p.stack.includes(tech)).length;
                return (
                  <span key={tech} className="text-[10px] px-3 py-1.5 border border-[#1a1a1a]/15 text-[#5a5a5a] hover:bg-[#1a1a1a] hover:text-[#f5f0e8] transition-all cursor-default" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
                    {tech} <span className="text-[#1a1a1a]/30 ml-1">({count})</span>
                  </span>
                );
              })}
            </div>
          </section>

          {/* Footer */}
          <footer className="pb-12 pt-8 border-t-2 border-[#1a1a1a]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="text-[10px] text-[#1a1a1a]/30 tracking-[0.3em] uppercase font-mono">
                © {date.getFullYear()} pcstyle.dev — All rights reserved
              </span>
              <div className="flex gap-6">
                {['Privacy', 'Source', 'Network'].map(link => (
                  <span key={link} className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1a1a]/40 hover:text-[#c41e3a] cursor-pointer transition-colors" style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}>
                    {link}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};
