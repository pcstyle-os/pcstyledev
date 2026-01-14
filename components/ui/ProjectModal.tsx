import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal } from 'lucide-react';
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
    hidden: { scale: 0.95, opacity: 0, y: 20 },
    visible: { scale: 1, opacity: 1, y: 0 },
};

export const ProjectModal = ({ project, onClose }: Props) => {
    if (!project || !project.modal) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                initial="hidden"
                animate="visible"
                exit="hidden"
            >
                <motion.div
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    variants={backdropVariants}
                    onClick={onClose}
                />
                <motion.div
                    className="relative bg-black border border-[#ff00ff]/30 w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(255,0,255,0.1)]"
                    variants={modalVariants}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                        <div className="flex items-center gap-2 text-[#ff00ff]">
                            <Terminal size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {project.modal.title}
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8">
                        <h2 className="text-2xl sm:text-3xl font-black mb-6 uppercase tracking-tighter text-white">
                            <GlitchText text={project.name} />
                        </h2>

                        <div className="prose prose-invert prose-sm max-w-none">
                            <p className="text-gray-400 font-mono text-sm leading-relaxed whitespace-pre-wrap lowercase">
                                {project.modal.content}
                            </p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-2">
                            {project.stack.map((s) => (
                                <span key={s} className="text-[10px] text-[#ff00ff] font-black border border-[#ff00ff]/20 bg-[#ff00ff]/5 px-3 py-1 uppercase">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Scanline overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-[url('/scanlines.png')] opacity-10" />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
