import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, ChevronRight, File, Folder, FolderOpen, X, Minus, Square, Search, GitBranch, AlertCircle, CheckCircle } from 'lucide-react';
import projectsData from '../../data/projects/projects.json';
import type { Project } from '../../lib/types';

const PROJECTS: Project[] = projectsData.projects as Project[];
const ACTIVE_PROJECTS = PROJECTS.filter(p => p.status !== 'disabled');

/**
 * Beta 3 — "IDE"
 *
 * Looks like a real code editor / IDE. VS Code inspired but as a portfolio.
 * Tab bar navigation, file tree sidebar, syntax-highlighted content,
 * line numbers, status bar. Developer-native aesthetic that's
 * iterative from the original but uses a completely different metaphor.
 */

// Syntax highlighting colors (One Dark inspired)
const SYNTAX = {
  keyword: '#c678dd',
  string: '#98c379',
  number: '#d19a66',
  comment: '#5c6370',
  function: '#61afef',
  variable: '#e06c75',
  type: '#e5c07b',
  operator: '#56b6c2',
  punctuation: '#abb2bf',
  bg: '#1e1e2e',
  sidebar: '#181825',
  tab: '#1e1e2e',
  tabActive: '#1e1e2e',
  tabBar: '#181825',
  border: '#313244',
  text: '#cdd6f4',
  lineNum: '#45475a',
  statusBar: '#181825',
  accent: '#89b4fa',
  selection: 'rgba(137, 180, 250, 0.15)',
};

// Status badge colors
const STATUS_COLORS: Record<string, string> = {
  active: SYNTAX.string,
  experimental: SYNTAX.type,
  maintenance: SYNTAX.number,
  prototype: SYNTAX.keyword,
};

type Tab = 'readme' | 'projects' | 'about' | 'contact';

// Render project as "code"
const ProjectAsCode = ({ project, lineStart }: { key?: React.Key; project: Project; lineStart: number }) => {
  const lines = [
    { num: lineStart, content: <><span style={{ color: SYNTAX.keyword }}>export</span> <span style={{ color: SYNTAX.keyword }}>const</span> <span style={{ color: SYNTAX.variable }}>{project.id}</span> <span style={{ color: SYNTAX.operator }}>=</span> <span style={{ color: SYNTAX.punctuation }}>{'{'}</span></> },
    { num: lineStart + 1, content: <>&nbsp;&nbsp;<span style={{ color: SYNTAX.variable }}>name</span><span style={{ color: SYNTAX.punctuation }}>:</span> <span style={{ color: SYNTAX.string }}>"{project.name}"</span><span style={{ color: SYNTAX.punctuation }}>,</span></> },
    { num: lineStart + 2, content: <>&nbsp;&nbsp;<span style={{ color: SYNTAX.variable }}>desc</span><span style={{ color: SYNTAX.punctuation }}>:</span> <span style={{ color: SYNTAX.string }}>"{project.desc}"</span><span style={{ color: SYNTAX.punctuation }}>,</span></> },
    { num: lineStart + 3, content: <>&nbsp;&nbsp;<span style={{ color: SYNTAX.variable }}>status</span><span style={{ color: SYNTAX.punctuation }}>:</span> <span style={{ color: SYNTAX.string }}>"{project.status}"</span><span style={{ color: SYNTAX.punctuation }}>,</span> <span style={{ color: SYNTAX.comment }}>{'// '}{project.status === 'active' ? '✓' : '○'}</span></> },
    { num: lineStart + 4, content: <>&nbsp;&nbsp;<span style={{ color: SYNTAX.variable }}>stack</span><span style={{ color: SYNTAX.punctuation }}>:</span> <span style={{ color: SYNTAX.punctuation }}>[</span>{project.stack.map((s, i) => <React.Fragment key={s}><span style={{ color: SYNTAX.string }}>"{s}"</span>{i < project.stack.length - 1 && <span style={{ color: SYNTAX.punctuation }}>, </span>}</React.Fragment>)}<span style={{ color: SYNTAX.punctuation }}>]</span><span style={{ color: SYNTAX.punctuation }}>,</span></> },
  ];

  if (project.link) {
    lines.push({ num: lineStart + 5, content: <>&nbsp;&nbsp;<span style={{ color: SYNTAX.variable }}>url</span><span style={{ color: SYNTAX.punctuation }}>:</span> <a href={project.link} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: SYNTAX.function }}>"{project.link}"</a><span style={{ color: SYNTAX.punctuation }}>,</span></> });
  }
  if (project.github) {
    lines.push({ num: lineStart + (project.link ? 6 : 5), content: <>&nbsp;&nbsp;<span style={{ color: SYNTAX.variable }}>repo</span><span style={{ color: SYNTAX.punctuation }}>:</span> <a href={project.github} target="_blank" rel="noreferrer" className="hover:underline" style={{ color: SYNTAX.function }}>"{project.github}"</a><span style={{ color: SYNTAX.punctuation }}>,</span></> });
  }

  const endLine = lineStart + lines.length;
  lines.push({ num: endLine, content: <><span style={{ color: SYNTAX.punctuation }}>{'}'}</span><span style={{ color: SYNTAX.punctuation }}>;</span></> });

  return (
    <div className="group">
      {lines.map((line, idx) => (
        <div
          key={line.num}
          className="flex hover:bg-white/[0.03] transition-colors"
          style={{ lineHeight: '1.7' }}
        >
          <span
            className="select-none text-right pr-6 shrink-0"
            style={{ color: SYNTAX.lineNum, width: '60px', fontSize: '13px', fontFamily: "'JetBrains Mono', monospace" }}
          >
            {line.num}
          </span>
          <span style={{ fontSize: '13px', fontFamily: "'JetBrains Mono', monospace", color: SYNTAX.text }}>
            {line.content}
          </span>
        </div>
      ))}
      {/* Empty line after each project */}
      <div className="flex" style={{ lineHeight: '1.7' }}>
        <span className="select-none text-right pr-6 shrink-0" style={{ color: SYNTAX.lineNum, width: '60px', fontSize: '13px', fontFamily: "'JetBrains Mono', monospace" }}>
          {endLine + 1}
        </span>
      </div>
    </div>
  );
};

// File tree item
const TreeItem = ({ name, icon, active, depth = 0, onClick }: { key?: React.Key; name: string; icon: React.ReactNode; active?: boolean; depth?: number; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-1 text-[12px] transition-colors text-left ${active ? 'bg-white/[0.06] text-white' : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-300'}`}
    style={{ paddingLeft: `${12 + depth * 16}px`, fontFamily: "'JetBrains Mono', monospace" }}
  >
    {icon}
    {name}
  </button>
);

export const Beta3IDE = () => {
  const [activeTab, setActiveTab] = useState<Tab>('readme');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return ACTIVE_PROJECTS;
    const q = searchQuery.toLowerCase();
    return ACTIVE_PROJECTS.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.desc.toLowerCase().includes(q) ||
      p.stack.some(s => s.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'readme', label: 'README.md', icon: '📄' },
    { id: 'projects', label: 'projects.ts', icon: '📦' },
    { id: 'about', label: 'about.ts', icon: '👤' },
    { id: 'contact', label: 'contact.ts', icon: '📧' },
  ];

  const totalProblems = ACTIVE_PROJECTS.filter(p => p.status === 'experimental').length;

  return (
    <div className="min-h-screen flex flex-col overflow-hidden" style={{ background: SYNTAX.bg, color: SYNTAX.text, fontFamily: "'JetBrains Mono', monospace" }}>

      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-1.5 select-none" style={{ background: SYNTAX.sidebar, borderBottom: `1px solid ${SYNTAX.border}` }}>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500/70 hover:bg-green-500 transition-colors" />
          </div>
          <span className="text-[11px] text-gray-500 ml-2">pcstyle.dev — Portfolio IDE</span>
        </div>
        <div className="flex items-center gap-4 text-gray-500">
          <Search size={13} />
          <GitBranch size={13} />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="shrink-0 overflow-y-auto border-r select-none"
            style={{ background: SYNTAX.sidebar, borderColor: SYNTAX.border }}
          >
            <div className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
              Explorer
            </div>

            {/* Project tree */}
            <div className="mb-4">
              <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                pcstyle.dev
              </div>
              <TreeItem
                name="README.md"
                icon={<File size={14} className="text-blue-400 shrink-0" />}
                active={activeTab === 'readme'}
                onClick={() => setActiveTab('readme')}
              />
              <TreeItem
                name="about.ts"
                icon={<File size={14} className="text-blue-400 shrink-0" />}
                active={activeTab === 'about'}
                onClick={() => setActiveTab('about')}
              />
              <TreeItem
                name="contact.ts"
                icon={<File size={14} className="text-blue-400 shrink-0" />}
                active={activeTab === 'contact'}
                onClick={() => setActiveTab('contact')}
              />

              {/* Projects folder */}
              <TreeItem
                name="projects/"
                icon={<FolderOpen size={14} className="text-yellow-400 shrink-0" />}
                active={activeTab === 'projects'}
                onClick={() => setActiveTab('projects')}
              />
              {ACTIVE_PROJECTS.slice(0, 8).map(p => (
                <TreeItem
                  key={p.id}
                  name={`${p.id}.ts`}
                  icon={<File size={13} className="text-blue-300/60 shrink-0" />}
                  depth={1}
                  onClick={() => setActiveTab('projects')}
                />
              ))}
              {ACTIVE_PROJECTS.length > 8 && (
                <div className="px-3 py-1 text-[11px] text-gray-600" style={{ paddingLeft: '28px' }}>
                  +{ACTIVE_PROJECTS.length - 8} more…
                </div>
              )}
            </div>
          </motion.aside>
        )}

        {/* Main editor area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center overflow-x-auto" style={{ background: SYNTAX.tabBar, borderBottom: `1px solid ${SYNTAX.border}` }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-[12px] border-r shrink-0 transition-colors ${activeTab === tab.id ? 'text-white border-b-2' : 'text-gray-500 hover:text-gray-300'
                  }`}
                style={{
                  background: activeTab === tab.id ? SYNTAX.tabActive : 'transparent',
                  borderColor: SYNTAX.border,
                  borderBottomColor: activeTab === tab.id ? SYNTAX.accent : 'transparent',
                }}
              >
                <span className="text-[13px]">{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && <X size={13} className="ml-2 text-gray-600 hover:text-white" />}
              </button>
            ))}
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 px-4 py-1 text-[11px] text-gray-500" style={{ background: SYNTAX.bg, borderBottom: `1px solid ${SYNTAX.border}` }}>
            <span>pcstyle.dev</span>
            <ChevronRight size={12} />
            <span>{tabs.find(t => t.id === activeTab)?.label}</span>
          </div>

          {/* Editor content */}
          <div className="flex-1 overflow-y-auto py-2" style={{ background: SYNTAX.bg }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === 'readme' && (
                  <div className="px-6 py-4 max-w-3xl">
                    {/* Rendered markdown style */}
                    <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                      pcstyle.dev
                    </h1>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: SYNTAX.string + '22', color: SYNTAX.string }}>AI Student</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: SYNTAX.accent + '22', color: SYNTAX.accent }}>{ACTIVE_PROJECTS.length} Projects</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: SYNTAX.keyword + '22', color: SYNTAX.keyword }}>Częstochowa, PL</span>
                    </div>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: SYNTAX.text + 'cc', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                      First year AI student at Politechnika Częstochowska. Creating high-fidelity tools and procedural wonders. Dedicated to aesthetic performance and privacy-first engineering.
                    </p>
                    <h2 className="text-xl font-bold text-white mb-3 mt-8" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                      Featured Projects
                    </h2>
                    <div className="space-y-3">
                      {ACTIVE_PROJECTS.filter(p => p.pinned).map(p => (
                        <div key={p.id} className="flex items-start gap-3 py-2">
                          <span style={{ color: SYNTAX.accent }}>▸</span>
                          <div>
                            <span className="font-bold text-white">{p.name}</span>
                            <span className="text-gray-500 mx-2">—</span>
                            <span className="text-gray-400 text-[13px]">{p.desc}</span>
                            <div className="flex gap-3 mt-1">
                              {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="text-[11px] hover:underline" style={{ color: SYNTAX.function }}>{p.link}</a>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <h2 className="text-xl font-bold text-white mb-3 mt-8" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                      Quick Links
                    </h2>
                    <div className="flex gap-3">
                      <a href="https://github.com/pc-style" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded text-[12px] hover:opacity-80" style={{ background: SYNTAX.accent + '22', color: SYNTAX.accent }}>
                        <Github size={14} /> GitHub
                      </a>
                      <a href="mailto:AdamKrupa@Tuta.io" className="flex items-center gap-2 px-4 py-2 rounded text-[12px] hover:opacity-80" style={{ background: SYNTAX.string + '22', color: SYNTAX.string }}>
                        Email
                      </a>
                    </div>
                  </div>
                )}

                {activeTab === 'projects' && (
                  <div>
                    {/* Search bar */}
                    <div className="px-4 py-2 border-b flex items-center gap-2" style={{ borderColor: SYNTAX.border }}>
                      <Search size={14} className="text-gray-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Filter projects..."
                        className="bg-transparent border-none outline-none text-[12px] text-gray-300 flex-1 placeholder:text-gray-600"
                      />
                      {searchQuery && (
                        <span className="text-[10px] text-gray-500">{filteredProjects.length} results</span>
                      )}
                    </div>

                    {/* Import statement */}
                    <div className="flex" style={{ lineHeight: '1.7' }}>
                      <span className="select-none text-right pr-6 shrink-0" style={{ color: SYNTAX.lineNum, width: '60px', fontSize: '13px' }}>1</span>
                      <span style={{ fontSize: '13px' }}>
                        <span style={{ color: SYNTAX.comment }}>// pcstyle.dev — Project Registry</span>
                      </span>
                    </div>
                    <div className="flex" style={{ lineHeight: '1.7' }}>
                      <span className="select-none text-right pr-6 shrink-0" style={{ color: SYNTAX.lineNum, width: '60px', fontSize: '13px' }}>2</span>
                      <span style={{ fontSize: '13px' }}>
                        <span style={{ color: SYNTAX.comment }}>// Total: {filteredProjects.length} active specifications</span>
                      </span>
                    </div>
                    <div className="flex" style={{ lineHeight: '1.7' }}>
                      <span className="select-none text-right pr-6 shrink-0" style={{ color: SYNTAX.lineNum, width: '60px', fontSize: '13px' }}>3</span>
                    </div>

                    {filteredProjects.map((project, i) => {
                      const linesPerProject = 7 + (project.link ? 1 : 0) + (project.github ? 1 : 0) + 1;
                      const prevLines = filteredProjects.slice(0, i).reduce((sum, p) => sum + 7 + (p.link ? 1 : 0) + (p.github ? 1 : 0) + 1, 0);
                      return <ProjectAsCode key={project.id} project={project} lineStart={4 + prevLines} />;
                    })}
                  </div>
                )}

                {activeTab === 'about' && (
                  <div>
                    {[
                      { num: 1, content: <><span style={{ color: SYNTAX.comment }}>/**</span></> },
                      { num: 2, content: <><span style={{ color: SYNTAX.comment }}> * @author Adam Krupa (pcstyle)</span></> },
                      { num: 3, content: <><span style={{ color: SYNTAX.comment }}> * @location Częstochowa, Poland</span></> },
                      { num: 4, content: <><span style={{ color: SYNTAX.comment }}> * @university Politechnika Częstochowska</span></> },
                      { num: 5, content: <><span style={{ color: SYNTAX.comment }}> * @field Artificial Intelligence (1st year)</span></> },
                      { num: 6, content: <><span style={{ color: SYNTAX.comment }}> */</span></> },
                      { num: 7, content: <></> },
                      { num: 8, content: <><span style={{ color: SYNTAX.keyword }}>interface</span> <span style={{ color: SYNTAX.type }}>Developer</span> <span style={{ color: SYNTAX.punctuation }}>{'{'}</span></> },
                      { num: 9, content: <>&nbsp;&nbsp;<span style={{ color: SYNTAX.variable }}>name</span><span style={{ color: SYNTAX.punctuation }}>:</span> <span style={{ color: SYNTAX.type }}>string</span><span style={{ color: SYNTAX.punctuation }}>;</span></> },
                      { num: 10, content: <>&nbsp;&nbsp;<span style={{ color: SYNTAX.variable }}>focus</span><span style={{ color: SYNTAX.punctuation }}>:</span> <span style={{ color: SYNTAX.type }}>string</span><span style={{ color: SYNTAX.punctuation }}>[];</span></> },
                      { num: 11, content: <>&nbsp;&nbsp;<span style={{ color: SYNTAX.variable }}>values</span><span style={{ color: SYNTAX.punctuation }}>:</span> <span style={{ color: SYNTAX.type }}>string</span><span style={{ color: SYNTAX.punctuation }}>[];</span></> },
                      { num: 12, content: <><span style={{ color: SYNTAX.punctuation }}>{'}'}</span></> },
                      { num: 13, content: <></> },
                      { num: 14, content: <><span style={{ color: SYNTAX.keyword }}>export</span> <span style={{ color: SYNTAX.keyword }}>const</span> <span style={{ color: SYNTAX.variable }}>pcstyle</span><span style={{ color: SYNTAX.punctuation }}>:</span> <span style={{ color: SYNTAX.type }}>Developer</span> <span style={{ color: SYNTAX.operator }}>=</span> <span style={{ color: SYNTAX.punctuation }}>{'{'}</span></> },
                      { num: 15, content: <>&nbsp;&nbsp;<span style={{ color: SYNTAX.variable }}>name</span><span style={{ color: SYNTAX.punctuation }}>:</span> <span style={{ color: SYNTAX.string }}>"Adam Krupa"</span><span style={{ color: SYNTAX.punctuation }}>,</span></> },
                      { num: 16, content: <>&nbsp;&nbsp;<span style={{ color: SYNTAX.variable }}>focus</span><span style={{ color: SYNTAX.punctuation }}>:</span> <span style={{ color: SYNTAX.punctuation }}>[</span><span style={{ color: SYNTAX.string }}>"AI/ML"</span><span style={{ color: SYNTAX.punctuation }}>,</span> <span style={{ color: SYNTAX.string }}>"Web Development"</span><span style={{ color: SYNTAX.punctuation }}>,</span> <span style={{ color: SYNTAX.string }}>"Privacy Engineering"</span><span style={{ color: SYNTAX.punctuation }}>],</span></> },
                      { num: 17, content: <>&nbsp;&nbsp;<span style={{ color: SYNTAX.variable }}>values</span><span style={{ color: SYNTAX.punctuation }}>:</span> <span style={{ color: SYNTAX.punctuation }}>[</span><span style={{ color: SYNTAX.string }}>"Aesthetic Performance"</span><span style={{ color: SYNTAX.punctuation }}>,</span> <span style={{ color: SYNTAX.string }}>"Privacy First"</span><span style={{ color: SYNTAX.punctuation }}>,</span> <span style={{ color: SYNTAX.string }}>"Open Source"</span><span style={{ color: SYNTAX.punctuation }}>],</span></> },
                      { num: 18, content: <><span style={{ color: SYNTAX.punctuation }}>{'}'}</span><span style={{ color: SYNTAX.punctuation }}>;</span></> },
                    ].map(line => (
                      <div key={line.num} className="flex hover:bg-white/[0.03]" style={{ lineHeight: '1.7' }}>
                        <span className="select-none text-right pr-6 shrink-0" style={{ color: SYNTAX.lineNum, width: '60px', fontSize: '13px' }}>{line.num}</span>
                        <span style={{ fontSize: '13px' }}>{line.content}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div>
                    {[
                      { num: 1, content: <><span style={{ color: SYNTAX.comment }}>// Contact endpoints</span></> },
                      { num: 2, content: <></> },
                      { num: 3, content: <><span style={{ color: SYNTAX.keyword }}>export</span> <span style={{ color: SYNTAX.keyword }}>const</span> <span style={{ color: SYNTAX.variable }}>contact</span> <span style={{ color: SYNTAX.operator }}>=</span> <span style={{ color: SYNTAX.punctuation }}>{'{'}</span></> },
                      { num: 4, content: <>&nbsp;&nbsp;<span style={{ color: SYNTAX.variable }}>email</span><span style={{ color: SYNTAX.punctuation }}>:</span> <a href="mailto:AdamKrupa@Tuta.io" className="hover:underline" style={{ color: SYNTAX.string }}>"AdamKrupa@Tuta.io"</a><span style={{ color: SYNTAX.punctuation }}>,</span></> },
                      { num: 5, content: <>&nbsp;&nbsp;<span style={{ color: SYNTAX.variable }}>github</span><span style={{ color: SYNTAX.punctuation }}>:</span> <a href="https://github.com/pc-style" target="_blank" rel="noreferrer" className="hover:underline" style={{ color: SYNTAX.string }}>"https://github.com/pc-style"</a><span style={{ color: SYNTAX.punctuation }}>,</span></> },
                      { num: 6, content: <>&nbsp;&nbsp;<span style={{ color: SYNTAX.variable }}>website</span><span style={{ color: SYNTAX.punctuation }}>:</span> <span style={{ color: SYNTAX.string }}>"https://pcstyle.dev"</span><span style={{ color: SYNTAX.punctuation }}>,</span></> },
                      { num: 7, content: <>&nbsp;&nbsp;<span style={{ color: SYNTAX.variable }}>location</span><span style={{ color: SYNTAX.punctuation }}>:</span> <span style={{ color: SYNTAX.string }}>"Częstochowa, Poland"</span><span style={{ color: SYNTAX.punctuation }}>,</span></> },
                      { num: 8, content: <><span style={{ color: SYNTAX.punctuation }}>{'}'}</span> <span style={{ color: SYNTAX.keyword }}>as</span> <span style={{ color: SYNTAX.keyword }}>const</span><span style={{ color: SYNTAX.punctuation }}>;</span></> },
                    ].map(line => (
                      <div key={line.num} className="flex hover:bg-white/[0.03]" style={{ lineHeight: '1.7' }}>
                        <span className="select-none text-right pr-6 shrink-0" style={{ color: SYNTAX.lineNum, width: '60px', fontSize: '13px' }}>{line.num}</span>
                        <span style={{ fontSize: '13px' }}>{line.content}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Minimap hint (right side) */}
          <div className="absolute top-20 right-2 w-[60px] h-[200px] opacity-30 hidden xl:block pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="h-1 mb-[1px] rounded-sm" style={{ background: SYNTAX.text + '20', width: `${20 + Math.random() * 40}px` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1 text-[11px] select-none" style={{ background: SYNTAX.accent, color: '#1e1e2e' }}>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-bold">
            <GitBranch size={12} /> main
          </span>
          <span className="flex items-center gap-1">
            {totalProblems > 0 ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
            {totalProblems} experimental
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>TypeScript</span>
          <span>UTF-8</span>
          <span>Ln {activeTab === 'projects' ? ACTIVE_PROJECTS.length * 8 : 18}, Col 1</span>
        </div>
      </div>
    </div>
  );
};
