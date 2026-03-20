import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText } from 'lucide-react';
import type { Project } from '../../lib/types';
import { GlitchText } from './GlitchText';

interface Props {
  project: Project | null;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { scale: 0.96, opacity: 0, y: 16 },
  visible: { scale: 1, opacity: 1, y: 0 },
};

export const ProjectModal = ({ project, onClose }: Props) => {
  if (!project || !project.modal) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          className="absolute inset-0 bg-on-surface/25 backdrop-blur-md"
          variants={backdropVariants}
          onClick={onClose}
        />
        <motion.div
          className="relative glass-panel w-full max-w-2xl overflow-hidden rounded-[2rem] shadow-ambient max-h-[90vh] flex flex-col"
          variants={modalVariants}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        >
          <div className="flex items-center justify-between px-6 py-4 bg-surface-container-low/50">
            <div className="flex items-center gap-2 text-primary">
              <FileText size={18} strokeWidth={1.75} />
              <span className="text-xs font-body font-semibold uppercase tracking-widest">{project.modal.title}</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
              aria-label="Close"
            >
              <X size={22} />
            </button>
          </div>

          <div className="p-6 sm:p-8 overflow-y-auto scrollbar-custom">
            <h2 className="font-headline text-2xl sm:text-3xl mb-6 tracking-tight text-on-surface">
              <GlitchText text={project.name} />
            </h2>

            <p className="text-on-surface-variant font-body text-base leading-relaxed whitespace-pre-wrap">
              {project.modal.content}
            </p>

            <div className="mt-10 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="text-xs font-body font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
};
