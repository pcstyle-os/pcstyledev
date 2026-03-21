import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, LayoutList, Search, AlertTriangle, Lightbulb, Trophy, Link2, Terminal } from 'lucide-react';
import type { Project } from '../../lib/types';
import { GlitchText } from './GlitchText';
import { useVisualSkin } from '../../hooks/useVisualSkin';

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

type TabId = 'overview' | 'casefile';

function hasModalBody(modal: Project['modal']): modal is NonNullable<Project['modal']> {
  if (!modal) return false;
  const hasOverview = Boolean(modal.content?.trim());
  const hasCasefile = Boolean(modal.casefile);
  return hasOverview || hasCasefile;
}

export const ProjectModal = ({ project, onClose }: Props) => {
  const { skin } = useVisualSkin();
  const isArtifact = skin === 'artifact';
  const [tab, setTab] = useState<TabId>('overview');

  const content = project?.modal?.content;
  const casefile = project?.modal?.casefile;
  const title = project?.modal?.title ?? '';

  useEffect(() => {
    if (!project?.modal) return;
    const hasOverview = Boolean(project.modal.content?.trim());
    const hasCf = Boolean(project.modal.casefile);
    if (!hasOverview && hasCf) setTab('casefile');
    else setTab('overview');
  }, [project?.id, project?.modal]);

  const showTabs = Boolean(content?.trim()) && Boolean(casefile);

  const activeTab: TabId = useMemo(() => {
    if (!content?.trim() && casefile) return 'casefile';
    if (!casefile) return 'overview';
    return tab;
  }, [content, casefile, tab]);

  if (!project || !hasModalBody(project.modal)) return null;

  return createPortal(
    <AnimatePresence>
      {project ? (
        <motion.div
          key={project.id}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className={
              isArtifact
                ? 'absolute inset-0 bg-black/80 backdrop-blur-sm'
                : 'absolute inset-0 bg-on-surface/25 backdrop-blur-md'
            }
            variants={backdropVariants}
            onClick={onClose}
          />
          <motion.div
            className={
              isArtifact
                ? 'relative bg-black border border-[#ff00ff]/30 w-full max-w-2xl overflow-hidden shadow-[0_0_50px_rgba(255,0,255,0.1)] max-h-[90vh] flex flex-col'
                : 'relative glass-panel w-full max-w-2xl overflow-hidden rounded-[2rem] shadow-ambient max-h-[90vh] flex flex-col'
            }
            variants={modalVariants}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div
              className={
                isArtifact
                  ? 'flex items-center justify-between p-4 border-b border-white/10 bg-white/5 gap-3'
                  : 'flex items-center justify-between px-6 py-4 bg-surface-container-low/50 gap-3'
              }
            >
              <div
                className={`flex items-center gap-2 min-w-0 ${isArtifact ? 'text-[#ff00ff]' : 'text-primary'}`}
              >
                {isArtifact ? (
                  <Terminal size={16} className="shrink-0" />
                ) : (
                  <FileText size={18} strokeWidth={1.75} className="shrink-0" />
                )}
                <span
                  className={
                    isArtifact
                      ? 'text-[10px] font-black uppercase tracking-widest truncate'
                      : 'text-xs font-body font-semibold uppercase tracking-widest truncate'
                  }
                >
                  {title}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {showTabs && (
                  <div
                    className={
                      isArtifact
                        ? 'hidden sm:flex gap-1 border border-[#ff00ff]/30 p-0.5'
                        : 'hidden sm:flex rounded-full bg-surface-container-low p-1 border border-primary/10'
                    }
                  >
                    <button
                      type="button"
                      onClick={() => setTab('overview')}
                      className={
                        isArtifact
                          ? `px-3 py-1.5 text-[9px] font-black uppercase tracking-wider transition-colors ${
                              activeTab === 'overview'
                                ? 'bg-[#ff00ff] text-black'
                                : 'text-gray-500 hover:text-[#ff00ff]'
                            }`
                          : `px-3 py-1.5 rounded-full text-[10px] font-body font-semibold uppercase tracking-wider transition-colors ${
                              activeTab === 'overview'
                                ? 'bg-primary text-on-primary'
                                : 'text-on-surface-variant hover:text-primary'
                            }`
                      }
                    >
                      Overview
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('casefile')}
                      className={
                        isArtifact
                          ? `px-3 py-1.5 text-[9px] font-black uppercase tracking-wider transition-colors ${
                              activeTab === 'casefile'
                                ? 'bg-[#ff00ff] text-black'
                                : 'text-gray-500 hover:text-[#ff00ff]'
                            }`
                          : `px-3 py-1.5 rounded-full text-[10px] font-body font-semibold uppercase tracking-wider transition-colors ${
                              activeTab === 'casefile'
                                ? 'bg-primary text-on-primary'
                                : 'text-on-surface-variant hover:text-primary'
                            }`
                      }
                    >
                      Casefile
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className={
                    isArtifact
                      ? 'p-2 text-gray-500 hover:text-white transition-colors'
                      : 'p-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors'
                  }
                  aria-label="Close"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {showTabs && (
              <div
                className={
                  isArtifact
                    ? 'flex sm:hidden px-4 pt-2 gap-2 border-b border-white/10'
                    : 'flex sm:hidden px-6 pt-2 gap-2 border-b border-primary/10'
                }
              >
                <button
                  type="button"
                  onClick={() => setTab('overview')}
                  className={
                    isArtifact
                      ? `flex-1 py-2 text-[10px] font-black uppercase tracking-wider border-b-2 transition-colors ${
                          activeTab === 'overview' ? 'border-[#ff00ff] text-[#ff00ff]' : 'border-transparent text-gray-500'
                        }`
                      : `flex-1 py-2 text-xs font-body font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                          activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'
                        }`
                  }
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => setTab('casefile')}
                  className={
                    isArtifact
                      ? `flex-1 py-2 text-[10px] font-black uppercase tracking-wider border-b-2 transition-colors ${
                          activeTab === 'casefile' ? 'border-[#ff00ff] text-[#ff00ff]' : 'border-transparent text-gray-500'
                        }`
                      : `flex-1 py-2 text-xs font-body font-semibold uppercase tracking-wider border-b-2 transition-colors ${
                          activeTab === 'casefile' ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'
                        }`
                  }
                >
                  Casefile
                </button>
              </div>
            )}

            <div className="p-6 sm:p-8 overflow-y-auto scrollbar-custom">
              <h2
                className={
                  isArtifact
                    ? 'text-2xl sm:text-3xl font-black mb-6 uppercase tracking-tighter text-white'
                    : 'font-headline text-2xl sm:text-3xl mb-6 tracking-tight text-on-surface'
                }
              >
                <GlitchText text={project.name} />
              </h2>

              {activeTab === 'overview' && content?.trim() && (
                <p
                  className={
                    isArtifact
                      ? 'text-gray-500 font-mono text-sm leading-relaxed lowercase whitespace-pre-wrap mb-10 opacity-90'
                      : 'text-on-surface-variant font-body text-base leading-relaxed whitespace-pre-wrap mb-10'
                  }
                >
                  {content}
                </p>
              )}

              {activeTab === 'casefile' && casefile && (
                <div className="space-y-10">
                  <CasefileBlock
                    icon={<Search size={16} strokeWidth={1.75} />}
                    label="Problem"
                    body={casefile.problem}
                    isArtifact={isArtifact}
                  />
                  <CasefileBlock
                    icon={<LayoutList size={16} strokeWidth={1.75} />}
                    label="Constraints"
                    body={casefile.constraints}
                    isArtifact={isArtifact}
                  />
                  {casefile.failedAttempts && casefile.failedAttempts.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-error mb-3">
                        <AlertTriangle size={16} strokeWidth={1.75} />
                        <span className="text-xs font-body font-semibold uppercase tracking-widest">Dead ends</span>
                      </div>
                      <ul className="list-disc pl-5 space-y-2 text-on-surface-variant font-body text-sm leading-relaxed">
                        {casefile.failedAttempts.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <CasefileBlock
                    icon={<Lightbulb size={16} strokeWidth={1.75} />}
                    label="Breakthrough"
                    body={casefile.breakthrough}
                    isArtifact={isArtifact}
                  />
                  <CasefileBlock
                    icon={<Trophy size={16} strokeWidth={1.75} />}
                    label="Outcome"
                    body={casefile.outcome}
                    isArtifact={isArtifact}
                  />

                  {casefile.timeline && casefile.timeline.length > 0 && (
                    <div>
                      <p className="text-xs font-body font-semibold uppercase tracking-widest text-primary mb-4">
                        Timeline
                      </p>
                      <div className="relative border-l-2 border-primary/25 pl-6 space-y-6">
                        {casefile.timeline.map((ev, i) => (
                          <div key={i} className="relative">
                            <span className="absolute -left-[calc(0.5rem+5px)] top-1.5 w-2.5 h-2.5 rounded-full bg-primary shadow-ambient" />
                            <p className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider mb-1">
                              {ev.at}
                            </p>
                            <p className="font-body font-semibold text-on-surface text-sm">{ev.title}</p>
                            {ev.detail && (
                              <p className="text-on-surface-variant font-body text-sm mt-1 leading-relaxed">{ev.detail}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {casefile.evidence && casefile.evidence.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 text-primary mb-3">
                        <Link2 size={16} strokeWidth={1.75} />
                        <span className="text-xs font-body font-semibold uppercase tracking-widest">Evidence</span>
                      </div>
                      <ul className="space-y-2">
                        {casefile.evidence.map((ev, i) => (
                          <li key={i} className="text-sm font-body">
                            {ev.href ? (
                              <a
                                href={ev.href}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary font-semibold hover:underline"
                              >
                                {ev.label}
                              </a>
                            ) : (
                              <span className="text-on-surface font-medium">{ev.label}</span>
                            )}
                            {ev.detail && (
                              <span className="text-on-surface-variant block text-xs mt-0.5">{ev.detail}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-10 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <span
                    key={s}
                    className={
                      isArtifact
                        ? 'text-[10px] text-gray-600 font-black border border-gray-800 px-3 py-1 uppercase'
                        : 'text-xs font-body font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full'
                    }
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
};

function CasefileBlock({
  icon,
  label,
  body,
  isArtifact,
}: {
  icon: ReactNode;
  label: string;
  body: string;
  isArtifact: boolean;
}) {
  return (
    <div>
      <div
        className={`flex items-center gap-2 mb-3 ${
          isArtifact ? 'text-[#ff00ff]' : 'text-primary'
        }`}
      >
        {icon}
        <span
          className={
            isArtifact
              ? 'text-[10px] font-black uppercase tracking-widest'
              : 'text-xs font-body font-semibold uppercase tracking-widest'
          }
        >
          {label}
        </span>
      </div>
      <p
        className={
          isArtifact
            ? 'text-gray-500 font-mono text-sm leading-relaxed whitespace-pre-wrap'
            : 'text-on-surface-variant font-body text-sm sm:text-base leading-relaxed whitespace-pre-wrap'
        }
      >
        {body}
      </p>
    </div>
  );
}
