import React, { memo, useState, useRef, useCallback } from 'react';
import * as LucideIcons from 'lucide-react';
import { ExternalLink, Github, Lock, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlitchText } from './GlitchText';
import { useVisualSkin } from '../../hooks/useVisualSkin';
import { Synth } from '../../utils/audio';
import type { Project } from '../../lib/types';

function getIcon(name: string): React.ElementType {
  const icons = LucideIcons as Record<string, React.ElementType>;
  return icons[name] || icons['Box'];
}

export type ProjectCardVariant = 'default' | 'wide' | 'tall';

interface Props {
  project: Project;
  soundEnabled: boolean;
  delay: number;
  onOpenModal?: (project: Project) => void;
  synth?: Synth | null;
  variant?: ProjectCardVariant;
}

const VARIANT_CLASS: Record<ProjectCardVariant, string> = {
  default: 'min-h-0 p-6 sm:p-8 lg:p-10',
  wide:
    'min-h-[260px] sm:min-h-[280px] md:min-h-[300px] p-7 sm:p-9 lg:p-11 md:px-10 lg:px-12',
  tall:
    'min-h-[340px] sm:min-h-[360px] md:min-h-[400px] p-6 sm:py-10 sm:px-8 lg:py-12 lg:px-10',
};

const VARIANT_TILE_CLASS: Record<ProjectCardVariant, string> = {
  default: 'project-tile project-tile--default',
  wide: 'project-tile project-tile--wide',
  tall: 'project-tile project-tile--tall',
};

const MotionArticle = motion.article;

function ArtifactProjectCard({
  project,
  soundEnabled,
  synth,
  delay,
  onOpenModal,
}: Omit<Props, 'variant'>) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isDisabled = project.status === 'disabled';
  const hasDeepDive =
    Boolean(project.modal?.content?.trim()) || Boolean(project.modal?.casefile);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current || isDisabled) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 25;
      const rotateY = (centerX - x) / 25;
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    },
    [isDisabled],
  );

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative group border p-6 sm:p-8 lg:p-10 bg-black/80 backdrop-blur-sm transition-all duration-300 ease-out overflow-hidden shadow-2xl ${
        isDisabled ? 'border-red-900/20 opacity-40 grayscale pointer-events-none' : 'border-white/5'
      }`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => {
        if (isDisabled) return;
        if (soundEnabled) synth?.playBlip(Math.random() * 200 + 500, 'sine', 0.05, 0.02);
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {!isDisabled && (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-[#ff00ff] to-transparent" />
      )}

      <div className="flex justify-between items-start mb-6 sm:mb-10">
        <div
          className={`p-3 sm:p-4 shadow-[0_0_20px_rgba(255,0,255,0.2)] ${
            isDisabled ? 'bg-red-900/20 text-red-500' : 'bg-[#ff00ff] text-black'
          }`}
        >
          {isDisabled ? (
            <Lock className="w-5 h-5" />
          ) : (
            React.createElement(getIcon(project.icon), { className: 'w-5 h-5' })
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <span
            className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 border ${
              isDisabled
                ? 'border-red-500/20 text-red-500 bg-red-500/5'
                : project.status === 'active'
                  ? 'border-green-500/30 text-green-400 bg-green-500/5'
                  : 'border-[#ff00ff]/30 text-[#ff00ff] bg-[#ff00ff]/5'
            }`}
          >
            {project.status}
          </span>
          {project.pinned && !isDisabled && (
            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 border border-[#ff00ff]/60 text-[#ff00ff] bg-[#ff00ff]/15 shadow-[0_0_12px_rgba(255,0,255,0.6)]">
              priority_node
            </span>
          )}
        </div>
      </div>

      <h3
        className={`text-2xl sm:text-3xl font-black mb-4 uppercase tracking-tighter transition-colors ${
          isDisabled ? 'text-gray-700' : 'text-white group-hover:text-[#ff00ff]'
        }`}
      >
        <GlitchText text={project.name} />
      </h3>

      <p className="text-gray-500 text-[13px] mb-6 sm:mb-10 leading-relaxed lowercase font-mono opacity-70">
        {isDisabled
          ? '[MODULE_RESTRICTED] this node has been manually disabled by the architect.'
          : project.desc}
      </p>

      <div className="flex flex-wrap gap-2 mb-6 sm:mb-10">
        {project.stack.map((s: string) => (
          <span
            key={s}
            className="text-[10px] text-gray-600 font-black border border-gray-900 px-3 py-1 uppercase group-hover:border-[#ff00ff]/20"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-6 sm:gap-10 mt-auto pt-6 sm:pt-8 border-t border-white/5">
        {!isDisabled && project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#ff00ff] text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:brightness-125 transition-all"
          >
            <ExternalLink size={14} /> access
          </a>
        )}
        {!isDisabled && project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-700 text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:text-white transition-all"
          >
            <Github size={14} /> source
          </a>
        )}
        {!isDisabled && hasDeepDive && onOpenModal && (
          <button
            type="button"
            onClick={() => onOpenModal(project)}
            className="flex items-center gap-2 text-[#ff00ff] text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:brightness-125 transition-all"
          >
            <Info size={14} /> view_data
          </button>
        )}
        {isDisabled && (
          <span className="text-red-900/40 text-[10px] font-black uppercase tracking-[0.2em]">
            connection_terminated
          </span>
        )}
      </div>
    </div>
  );
}

export const ProjectCard = memo(
  ({ project, soundEnabled, synth, delay, onOpenModal, variant = 'default' }: Props) => {
    const { skin } = useVisualSkin();
    const isDisabled = project.status === 'disabled';
    const hasDeepDive =
      Boolean(project.modal?.content?.trim()) || Boolean(project.modal?.casefile);
    const tileMod = VARIANT_TILE_CLASS[variant];
    const sizeMod = VARIANT_CLASS[variant];

    if (skin === 'artifact') {
      return (
        <ArtifactProjectCard
          project={project}
          soundEnabled={soundEnabled}
          synth={synth ?? null}
          delay={delay}
          onOpenModal={onOpenModal}
        />
      );
    }

    return (
      <MotionArticle
        className={`relative group rounded-[2rem] glass-panel transition-[box-shadow,filter] duration-500 overflow-hidden ${tileMod} ${sizeMod} ${
          isDisabled ? 'opacity-45 grayscale pointer-events-none' : 'hover:shadow-ambient'
        }`}
        style={{ animationDelay: `${delay}ms` }}
        initial={false}
        whileHover={
          isDisabled
            ? undefined
            : {
                y: -6,
                scale: 1.02,
                transition: { type: 'spring', stiffness: 420, damping: 28 },
              }
        }
        whileTap={
          isDisabled
            ? undefined
            : { scale: 0.985, transition: { type: 'spring', stiffness: 500, damping: 32 } }
        }
      >
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary-container/25 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div
            className={`p-3 rounded-2xl ${
              isDisabled ? 'bg-surface-variant text-error' : 'bg-primary-container/80 text-primary'
            }`}
          >
            {isDisabled ? (
              <Lock className="w-5 h-5" />
            ) : (
              React.createElement(getIcon(project.icon), { className: 'w-5 h-5' })
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 justify-end">
            <span
              className={`text-[10px] font-body font-semibold uppercase tracking-widest px-3 py-1 rounded-full ${
                isDisabled
                  ? 'bg-error/10 text-error'
                  : project.status === 'active'
                    ? 'bg-secondary-container/60 text-on-secondary-container'
                    : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {project.status}
            </span>
            {project.pinned && !isDisabled && (
              <span className="text-[10px] font-body font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary">
                Featured
              </span>
            )}
          </div>
        </div>

        <h3
          className={`font-headline text-2xl sm:text-3xl mb-4 tracking-tight relative z-10 ${
            isDisabled ? 'text-on-surface-variant' : 'text-on-surface group-hover:text-primary transition-colors'
          }`}
        >
          <GlitchText text={project.name} />
        </h3>

        <p className="text-on-surface-variant font-body text-sm sm:text-base leading-relaxed mb-8 relative z-10">
          {isDisabled ? 'This project is currently unavailable.' : project.desc}
        </p>

        <div className="flex flex-wrap gap-2 mb-8 relative z-10">
          {project.stack.map((s: string) => (
            <span
              key={s}
              className="text-xs font-body font-medium text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-lg"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-6 relative z-10">
          {!isDisabled && project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-body text-sm font-semibold hover:opacity-80 transition-opacity"
            >
              <ExternalLink size={16} /> Open
            </a>
          )}
          {!isDisabled && project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-on-surface-variant font-body text-sm font-medium hover:text-primary transition-colors"
            >
              <Github size={16} /> Source
            </a>
          )}
          {!isDisabled && hasDeepDive && onOpenModal && (
            <button
              type="button"
              onClick={() => onOpenModal(project)}
              className="inline-flex items-center gap-2 text-primary font-body text-sm font-semibold hover:opacity-80 transition-opacity"
            >
              <Info size={16} /> Details
            </button>
          )}
          {isDisabled && <span className="text-sm text-on-surface-variant">Unavailable</span>}
        </div>
      </MotionArticle>
    );
  },
);
