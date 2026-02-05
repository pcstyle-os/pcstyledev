import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight, MapPin, Mail, Sparkles } from 'lucide-react';
import projectsData from '../../data/projects/projects.json';
import type { Project } from '../../lib/types';

const PROJECTS: Project[] = projectsData.projects as Project[];
const ACTIVE_PROJECTS = PROJECTS.filter(p => p.status !== 'disabled');
const FEATURED = ACTIVE_PROJECTS.filter(p => p.pinned);

/**
 * Beta 5 — "Ceramic Studio"
 *
 * Warm, textured, gallery-like aesthetic. Cream/warm-white base,
 * terracotta and sage accents, rounded organic shapes. 
 * Uses DM Serif Display + DM Sans for an upscale gallery catalog feel.
 * Completely opposite of the dark cyberpunk original — light, warm, 
 * refined, almost tactile. Projects presented like artworks in a gallery.
 */

const COLORS = {
  cream: '#faf6f0',
  warm: '#f3ede4',
  terracotta: '#c45d3e',
  sage: '#7a8f6d',
  charcoal: '#2a2a2a',
  stone: '#8a8478',
  sand: '#d4c5b0',
};

// Organic blob shape
const BlobShape = ({ className = '', color = COLORS.terracotta }: { className?: string; color?: string }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      fill={color}
      d="M44.7,-76.4C58.8,-69.2,71.8,-58.8,79.6,-45.3C87.3,-31.8,89.8,-15.9,88.4,-0.8C87,14.3,81.7,28.6,73.3,40.8C64.9,53,53.4,63.1,40.2,70.8C27,78.5,12.1,83.8,-2.4,87.2C-16.9,90.6,-33.8,92.1,-47.5,85.2C-61.2,78.3,-71.7,63,-78.1,46.8C-84.5,30.6,-86.8,13.5,-84.3,1.4C-81.8,-10.6,-74.5,-21.3,-66.3,-31.1C-58.1,-40.9,-49,-49.8,-38.1,-58.5C-27.2,-67.2,-14.6,-75.7,0.5,-76.6C15.6,-77.5,30.6,-83.6,44.7,-76.4Z"
      transform="translate(100 100)"
    />
  </svg>
);

// Gallery project card
const GalleryCard = ({ project, index }: { key?: React.Key; project: Project; index: number }) => {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Generate a warm pastel bg for each card
  const warmColors = ['#f5e6d3', '#e8ddd0', '#f0e8dc', '#e6dfd5', '#f2ece4', '#ebe4d8'];
  const cardBg = warmColors[index % warmColors.length];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group cursor-pointer"
    >
      <div
        className="rounded-2xl overflow-hidden transition-shadow duration-500"
        style={{
          background: cardBg,
          boxShadow: hovered
            ? '0 25px 60px rgba(42, 42, 42, 0.12), 0 8px 20px rgba(42, 42, 42, 0.08)'
            : '0 4px 20px rgba(42, 42, 42, 0.05)',
        }}
      >
        {/* Visual header area */}
        <div className="relative h-32 md:h-40 overflow-hidden flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${cardBg}, ${COLORS.sand}40)` }}>
          <motion.div
            animate={{ rotate: hovered ? 45 : 0, scale: hovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ background: COLORS.terracotta + '18' }}
          >
            <span className="text-2xl font-bold" style={{ color: COLORS.terracotta, fontFamily: "'DM Serif Display', Georgia, serif" }}>
              {project.name.charAt(0)}
            </span>
          </motion.div>

          {/* Small status pill */}
          <div className="absolute top-4 right-4">
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{
                background: project.status === 'active' ? COLORS.sage + '25' : COLORS.stone + '20',
                color: project.status === 'active' ? COLORS.sage : COLORS.stone,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {project.status}
            </span>
          </div>

          {project.pinned && (
            <div className="absolute top-4 left-4">
              <Sparkles size={14} style={{ color: COLORS.terracotta }} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 md:p-6">
          <h3 className="text-xl font-bold mb-2 transition-colors" style={{ color: COLORS.charcoal, fontFamily: "'DM Serif Display', Georgia, serif" }}>
            {project.name}
          </h3>

          <p className="text-[13px] leading-relaxed mb-4" style={{ color: COLORS.stone, fontFamily: "'DM Sans', sans-serif" }}>
            {project.desc}
          </p>

          {/* Stack */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.stack.slice(0, 4).map(s => (
              <span
                key={s}
                className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                style={{
                  background: COLORS.charcoal + '08',
                  color: COLORS.stone,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {s}
              </span>
            ))}
            {project.stack.length > 4 && (
              <span className="text-[10px] font-medium px-2 py-1 rounded-full" style={{ color: COLORS.stone + '80', fontFamily: "'DM Sans', sans-serif" }}>
                +{project.stack.length - 4}
              </span>
            )}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 pt-4" style={{ borderTop: `1px solid ${COLORS.sand}60` }}>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-bold transition-colors"
                style={{ color: COLORS.terracotta, fontFamily: "'DM Sans', sans-serif" }}
              >
                Visit <ArrowUpRight size={13} />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-medium transition-colors opacity-50 hover:opacity-100"
                style={{ color: COLORS.charcoal, fontFamily: "'DM Sans', sans-serif" }}
              >
                <Github size={13} /> Source
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const Beta5CeramicStudio = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');
      `}</style>

      <div className="min-h-screen overflow-x-hidden selection:bg-[#c45d3e] selection:text-white" style={{ background: COLORS.cream, color: COLORS.charcoal }}>
        
        {/* Navigation */}
        <nav className="sticky top-0 z-50 backdrop-blur-lg" style={{ background: COLORS.cream + 'e6', borderBottom: `1px solid ${COLORS.sand}40` }}>
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: COLORS.terracotta }}>
                <span className="text-white font-bold text-sm" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>pc</span>
              </div>
              <span className="text-lg font-bold" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                pcstyle<span style={{ color: COLORS.terracotta }}>.dev</span>
              </span>
            </motion.div>

            <div className="flex items-center gap-4">
              <a href="https://github.com/pc-style" target="_blank" rel="noreferrer" className="p-2 rounded-full transition-colors" style={{ color: COLORS.stone }}>
                <Github size={18} />
              </a>
              <a href="mailto:AdamKrupa@Tuta.io" className="text-[11px] font-bold px-4 py-2 rounded-full text-white transition-all hover:opacity-90" style={{ background: COLORS.terracotta, fontFamily: "'DM Sans', sans-serif" }}>
                Get in touch
              </a>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <div ref={heroRef} className="relative overflow-hidden">
          {/* Decorative blobs */}
          <BlobShape className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-[0.04]" color={COLORS.terracotta} />
          <BlobShape className="absolute bottom-0 -left-32 w-[300px] h-[300px] opacity-[0.03]" color={COLORS.sage} />

          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="max-w-6xl mx-auto px-6 md:px-12 pt-20 md:pt-32 pb-20 md:pb-28"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <MapPin size={14} style={{ color: COLORS.terracotta }} />
                <span className="text-[11px] font-medium tracking-wide" style={{ color: COLORS.stone, fontFamily: "'DM Sans', sans-serif" }}>
                  Częstochowa, Poland
                </span>
              </div>

              <h1
                className="text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                Crafting digital
                <br />
                <em style={{ color: COLORS.terracotta }}>experiences</em> with care
              </h1>

              <p
                className="text-lg md:text-xl leading-relaxed max-w-xl mb-10"
                style={{ color: COLORS.stone, fontFamily: "'DM Sans', sans-serif" }}
              >
                AI student and developer building high-fidelity tools, procedural art, and privacy-first software. Every project is a small piece of the craft.
              </p>

              {/* Stats pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full" style={{ background: COLORS.warm, fontFamily: "'DM Sans', sans-serif" }}>
                  <span className="text-lg font-bold" style={{ color: COLORS.terracotta }}>{ACTIVE_PROJECTS.length}</span>
                  <span className="text-[12px] font-medium" style={{ color: COLORS.stone }}>Projects</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full" style={{ background: COLORS.warm, fontFamily: "'DM Sans', sans-serif" }}>
                  <span className="text-lg font-bold" style={{ color: COLORS.sage }}>{ACTIVE_PROJECTS.filter(p => p.status === 'active').length}</span>
                  <span className="text-[12px] font-medium" style={{ color: COLORS.stone }}>Active</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full" style={{ background: COLORS.warm, fontFamily: "'DM Sans', sans-serif" }}>
                  <span className="text-lg font-bold" style={{ color: COLORS.stone }}>{FEATURED.length}</span>
                  <span className="text-[12px] font-medium" style={{ color: COLORS.stone }}>Featured</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Featured section */}
        {FEATURED.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 md:px-12 py-16">
            <div className="flex items-center gap-4 mb-10">
              <Sparkles size={18} style={{ color: COLORS.terracotta }} />
              <h2
                className="text-2xl md:text-3xl"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                Featured work
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURED.map((project, i) => (
                <GalleryCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="h-[1px]" style={{ background: `linear-gradient(to right, transparent, ${COLORS.sand}, transparent)` }} />
        </div>

        {/* All projects */}
        <section className="max-w-6xl mx-auto px-6 md:px-12 py-16">
          <div className="flex items-center justify-between mb-10">
            <h2
              className="text-2xl md:text-3xl"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              All projects
            </h2>
            <span className="text-[12px] font-medium" style={{ color: COLORS.stone, fontFamily: "'DM Sans', sans-serif" }}>
              {ACTIVE_PROJECTS.length} works
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACTIVE_PROJECTS.map((project, i) => (
              <GalleryCard key={project.id} project={project} index={i} />
            ))}
          </div>
        </section>

        {/* Tech palette */}
        <section className="py-16" style={{ background: COLORS.warm }}>
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <h2
              className="text-2xl md:text-3xl mb-8"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Tools of the craft
            </h2>

            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(ACTIVE_PROJECTS.flatMap(p => p.stack))).sort().map((tech, i) => {
                const count = ACTIVE_PROJECTS.filter(p => p.stack.includes(tech)).length;
                return (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.02 }}
                    className="px-4 py-2 rounded-full text-[12px] font-medium cursor-default transition-all hover:shadow-md"
                    style={{
                      background: count >= 5 ? COLORS.terracotta : '#fff',
                      color: count >= 5 ? '#fff' : COLORS.charcoal,
                      border: count >= 5 ? 'none' : `1px solid ${COLORS.sand}`,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {tech}
                    {count > 1 && <span className="ml-1.5 opacity-50">({count})</span>}
                  </motion.span>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="max-w-4xl mx-auto px-6 md:px-12 py-20 text-center">
          <blockquote
            className="text-2xl md:text-3xl italic leading-relaxed mb-4"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: COLORS.charcoal }}
          >
            "We build not to control, but to liberate the signal."
          </blockquote>
          <span className="text-[12px] font-medium tracking-wider uppercase" style={{ color: COLORS.stone, fontFamily: "'DM Sans', sans-serif" }}>
            — from the manifesto
          </span>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: `1px solid ${COLORS.sand}40` }}>
          <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: COLORS.terracotta + '15' }}>
                <span className="text-[10px] font-bold" style={{ color: COLORS.terracotta, fontFamily: "'DM Serif Display', Georgia, serif" }}>pc</span>
              </div>
              <span className="text-[12px] font-medium" style={{ color: COLORS.stone, fontFamily: "'DM Sans', sans-serif" }}>
                © 2026 pcstyle.dev — Made with care
              </span>
            </div>
            <div className="flex gap-6">
              {['Privacy', 'Source', 'Contact'].map(link => (
                <span
                  key={link}
                  className="text-[11px] font-medium cursor-pointer transition-colors"
                  style={{ color: COLORS.stone, fontFamily: "'DM Sans', sans-serif" }}
                >
                  {link}
                </span>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};
