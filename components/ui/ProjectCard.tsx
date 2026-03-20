import React, { memo } from 'react';
import * as LucideIcons from 'lucide-react';
import { ExternalLink, Github, Lock, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlitchText } from './GlitchText';
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
  synth?: Synth;
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

export const ProjectCard = memo(
    ({ project, delay, onOpenModal, variant = 'default' }: Props) => {
    const isDisabled = project.status === 'disabled';
    const hasDeepDive =
      Boolean(project.modal?.content?.trim()) || Boolean(project.modal?.casefile);
    const tileMod = VARIANT_TILE_CLASS[variant];
    const sizeMod = VARIANT_CLASS[variant];

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
