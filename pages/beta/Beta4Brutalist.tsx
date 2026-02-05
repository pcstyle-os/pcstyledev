import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import projectsData from '../../data/projects/projects.json';
import type { Project } from '../../lib/types';

const PROJECTS: Project[] = projectsData.projects as Project[];
const ACTIVE_PROJECTS = PROJECTS.filter(p => p.status !== 'disabled');

/**
 * Beta 4 — "Brutalist"
 *
 * Raw brutalist web design. Oversized typography, broken grids,
 * stark black & white with electric lime accent. Anti-design that's
 * intentionally rough and confrontational. Overlapping elements,
 * exposed structure, no polish — just raw creative energy.
 */

const LIME = '#a3e635';

// Marquee ticker
const Marquee = ({ text, speed = 30 }: { text: string; speed?: number }) => (
  <div className="overflow-hidden whitespace-nowrap border-y-2 border-black py-2 my-8">
    <motion.div
      animate={{ x: ['0%', '-50%'] }}
      transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      className="inline-block"
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className="text-sm font-black uppercase tracking-[0.5em] mx-8" style={{ fontFamily: "'Space Mono', monospace" }}>
          {text} <span style={{ color: LIME }}>★</span> {text} <span style={{ color: LIME }}>★</span>&nbsp;
        </span>
      ))}
    </motion.div>
  </div>
);

// Brutalist project block
const BrutalistBlock = ({ project, index }: { key?: React.Key; project: Project; index: number }) => {
  const [hovered, setHovered] = useState(false);

  // Alternate between different layout styles
  const variant = index % 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotate: Math.random() * 2 - 1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.03 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative transition-all duration-300 group ${variant === 0 ? 'col-span-2 row-span-1' : variant === 1 ? 'col-span-1 row-span-2' : 'col-span-1 row-span-1'}`}
      style={{
        background: hovered ? '#000' : '#fff',
        color: hovered ? '#fff' : '#000',
        border: '3px solid #000',
      }}
    >
      {/* Index number overlapping */}
      <div
        className="absolute -top-5 -left-2 text-7xl md:text-8xl font-black leading-none select-none pointer-events-none transition-colors"
        style={{ 
          fontFamily: "'Space Mono', monospace",
          color: hovered ? LIME : '#000',
          opacity: 0.15,
          WebkitTextStroke: '2px currentColor',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="p-5 md:p-7 relative z-10">
        {/* Status strip */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-[9px] font-black uppercase tracking-[0.4em] px-2 py-1"
            style={{
              background: project.status === 'active' ? LIME : hovered ? '#333' : '#eee',
              color: project.status === 'active' ? '#000' : hovered ? '#fff' : '#000',
            }}
          >
            {project.status}
          </span>
          {project.pinned && (
            <span className="text-[9px] font-black uppercase tracking-[0.3em] px-2 py-1 border-2" style={{ borderColor: hovered ? LIME : '#000', color: hovered ? LIME : '#000' }}>
              ★ PINNED
            </span>
          )}
        </div>

        {/* Title — oversized */}
        <h3
          className="text-2xl md:text-3xl font-black uppercase leading-[0.9] mb-3 break-words"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          {project.name}
        </h3>

        {/* Description */}
        <p className="text-[12px] leading-relaxed mb-4 opacity-60" style={{ fontFamily: "'Space Mono', monospace" }}>
          {project.desc}
        </p>

        {/* Stack tags — raw */}
        <div className="flex flex-wrap gap-1 mb-4">
          {project.stack.map(s => (
            <span
              key={s}
              className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 border transition-colors"
              style={{
                borderColor: hovered ? '#444' : '#ccc',
                color: hovered ? '#aaa' : '#666',
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider transition-colors hover:underline underline-offset-4"
              style={{ color: hovered ? LIME : '#000', textDecorationColor: LIME }}
            >
              VISIT <ArrowUpRight size={14} />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider opacity-40 hover:opacity-100 transition-all"
            >
              SRC <Github size={14} />
            </a>
          )}
        </div>
      </div>

      {/* Corner accent */}
      {project.pinned && (
        <div className="absolute bottom-0 right-0 w-12 h-12 transition-colors" style={{ background: hovered ? LIME : '#000' }} />
      )}
    </motion.div>
  );
};

export const Beta4Brutalist = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const progressWidth = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '100%']), { stiffness: 100, damping: 30 });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>

      <div ref={containerRef} className="min-h-screen bg-white text-black selection:bg-[#a3e635] selection:text-black overflow-x-hidden" style={{ fontFamily: "'Space Mono', monospace" }}>
        
        {/* Scroll progress bar */}
        <motion.div
          className="fixed top-0 left-0 h-1 z-50"
          style={{ width: progressWidth, background: LIME }}
        />

        {/* Hero — raw, oversized */}
        <header className="px-6 md:px-12 pt-8 pb-4">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-12 border-b-2 border-black pb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">
              ©2026
            </span>
            <div className="flex gap-4">
              <a href="https://github.com/pc-style" target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white px-3 py-1 border-2 border-black transition-all">
                GitHub
              </a>
              <a href="mailto:AdamKrupa@Tuta.io" className="text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 border-2 border-black transition-all" style={{ background: LIME }}>
                Contact
              </a>
            </div>
          </div>

          {/* Title — extreme size */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[15vw] md:text-[12vw] font-black leading-[0.8] uppercase tracking-tighter -ml-1 md:-ml-2">
              PC
              <br />
              <span className="italic" style={{ WebkitTextStroke: '3px #000', WebkitTextFillColor: 'transparent' }}>
                STYLE
              </span>
            </h1>
          </motion.div>

          {/* Subtitle row */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mt-6 gap-4">
            <p className="text-sm max-w-md leading-relaxed">
              First year AI student. Building tools that respect users and push pixels to their limits. 
              Based in Częstochowa, Poland.
            </p>
            <div className="flex flex-col items-end">
              <span className="text-4xl md:text-6xl font-black" style={{ color: LIME }}>{ACTIVE_PROJECTS.length}</span>
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">Active Projects</span>
            </div>
          </div>
        </header>

        <Marquee text="DEVELOPER · DESIGNER · AI STUDENT · OPEN SOURCE · PRIVACY FIRST" speed={35} />

        {/* Projects grid — broken, intentional */}
        <section className="px-6 md:px-12 pb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              WORK<span className="text-gray-300">/</span>INDEX
            </h2>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
              {ACTIVE_PROJECTS.length} entries
            </span>
          </div>

          {/* Masonry-like grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
            {ACTIVE_PROJECTS.map((project, i) => (
              <BrutalistBlock key={project.id} project={project} index={i} />
            ))}
          </div>
        </section>

        <Marquee text="REACT · TYPESCRIPT · NEXT.JS · CONVEX · TAILWIND · VITE · PYTHON · AI/ML" speed={25} />

        {/* Stack cloud */}
        <section className="px-6 md:px-12 py-16">
          <h2 className="text-xl font-black uppercase tracking-[0.3em] mb-8 border-b-3 border-black pb-4" style={{ borderBottom: '3px solid black' }}>
            TECHNOLOGY_INDEX
          </h2>
          <div className="flex flex-wrap gap-3">
            {Array.from(new Set(ACTIVE_PROJECTS.flatMap(p => p.stack))).sort().map((tech, i) => {
              const count = ACTIVE_PROJECTS.filter(p => p.stack.includes(tech)).length;
              const size = Math.min(count * 6 + 12, 36);
              return (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.02 }}
                  className="font-black uppercase tracking-wider leading-none cursor-default hover:line-through transition-all"
                  style={{ fontSize: `${size}px`, color: count >= 5 ? LIME : count >= 3 ? '#000' : '#999' }}
                >
                  {tech}
                </motion.span>
              );
            })}
          </div>
        </section>

        {/* Footer — raw */}
        <footer className="px-6 md:px-12 py-8 border-t-3 border-black" style={{ borderTop: '3px solid black' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              pcstyle.dev — no cookies, no tracking, no bullshit.
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">
              DESIGNED WITH INTENT
            </span>
          </div>
        </footer>
      </div>
    </>
  );
};
