
import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, ShieldAlert } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import projectsData from '../data/projects/projects.json';
import type { Project } from '../lib/types';

const PROJECTS: Project[] = projectsData.projects as Project[];

interface ContextType {
  addNotification: (msg: string) => void;
}

// --- VIRTUAL FILE SYSTEM ---
type FileSystemNode = {
  type: 'dir' | 'file' | 'exec';
  content?: string;
  children?: Record<string, FileSystemNode>;
  hidden?: boolean;
  protected?: boolean;
};

const FILE_SYSTEM: Record<string, FileSystemNode> = {
  '~': {
    type: 'dir',
    children: {
      'projects': { 
        type: 'dir', 
        children: {
          'README.txt': { type: 'file', content: 'Execute "projects" command to view visual interface.' }
        }
      },
      'journals': {
        type: 'dir',
        children: {
          'entry_01.log': { type: 'file', content: 'Day 42: The neural link is stable. I can feel the data stream like a pulse.' },
          'entry_02.log': { type: 'file', content: 'Day 108: They found the drift field. I had to scramble the coordinates.' },
          'corrupted.dat': { type: 'file', content: 'X\u0000\u0000\u0010\u0000\u0000\u0000\u0000\u0000\u0001\u0000\u0018\u0000\u0000\u0000\u0000\u0000 [DATA LOSS]' }
        }
      },
      'tools': {
        type: 'dir',
        children: {
          'decoder.py': { type: 'exec', content: 'Binary decoder initialized...' },
          'nmap': { type: 'exec', content: 'Scanning ports...' }
        }
      },
      'manifesto.md': { 
        type: 'file', 
        content: '# THE DIGITAL FRONTIER\n\nWe build not to control, but to liberate the signal.\nEvery line of code is a rebellion against the static.' 
      },
      '.secrets': {
        type: 'dir',
        hidden: true,
        children: {
          'passwords.txt': { type: 'file', content: 'root: pcz_ai_2025\nwifi: h@ck3r_z0n3' },
          'blueprint_omega.json': { type: 'file', content: '{ "target": "mainframe", "status": "pending" }' }
        }
      }
    }
  },
  '/': {
    type: 'dir',
    children: {
      'bin': { type: 'dir', children: {} },
      'etc': { 
        type: 'dir', 
        children: {
          'passwd': { type: 'file', content: 'root:x:0:0:root:/root:/bin/zsh\nguest:x:1000:1000:guest:/home/guest:/bin/bash' },
          'shadow': { type: 'file', content: 'root:$6$hJ8...:19000:0:99999:7:::\nguest:$6$kL2...:19000:0:99999:7:::', protected: true },
          'id_card': { type: 'file', content: '[ENCRYPTED_ID_CARD_DATA]' }
        }
      },
      'var': { type: 'dir', children: { 'log': { type: 'dir', children: {} } } }
    }
  }
};

type HistoryItem = {
  type: 'user' | 'sys' | 'error' | 'success' | 'component';
  content: string | React.ReactNode;
  path?: string;
  isRoot?: boolean;
};

const StudentIDCard = () => (
  <div className="my-4 max-w-sm">
    <div className="relative w-full rounded-2xl glass-panel p-5 shadow-ambient overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-container/40 to-transparent pointer-events-none" />
      <div className="relative flex justify-between items-start gap-3 mb-4">
        <div>
          <p className="text-[10px] font-body font-semibold text-on-surface-variant uppercase tracking-widest">
            Politechnika Częstochowska
          </p>
          <h3 className="font-headline text-sm text-on-surface leading-snug mt-1">
            Faculty of Artificial Intelligence &amp; Computer Science
          </h3>
        </div>
        <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <span className="text-[10px] font-headline font-semibold text-primary">PCz</span>
        </div>
      </div>
      <div className="relative flex gap-4">
        <div className="w-16 h-20 rounded-xl bg-surface-container flex items-center justify-center">
          <span className="text-3xl text-on-surface-variant/30 font-headline">?</span>
        </div>
        <div className="space-y-2 font-body text-sm">
          <div>
            <span className="text-[10px] text-primary font-semibold uppercase tracking-wider block">Name</span>
            <span className="text-on-surface">Krupa, Adam</span>
          </div>
          <div>
            <span className="text-[10px] text-primary font-semibold uppercase tracking-wider block">Role</span>
            <span className="text-on-surface">Student (AI)</span>
          </div>
          <div>
            <span className="text-[10px] text-primary font-semibold uppercase tracking-wider block">ID</span>
            <span className="text-on-surface-variant">#1337-AI-2025</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const Terminal = () => {
  const { addNotification } = useOutletContext<ContextType>();
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState(['~']);
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'sys', content: 'pcstyle console — session ready.' },
    { type: 'sys', content: 'Type "help" for commands.' },
  ]);
  const [isRoot, setIsRoot] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  
  // Command history navigation
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyPointer, setHistoryPointer] = useState(-1);
  const [tempInput, setTempInput] = useState('');

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic: only scroll if the new history item makes the container overflow
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [history]);

  const getNodeAtCurrent = () => {
    let current = FILE_SYSTEM[currentPath[0]];
    for (let i = 1; i < currentPath.length; i++) {
      current = current.children![currentPath[i]];
    }
    return current;
  };

  const processCommand = (cmdString: string, asRoot: boolean = isRoot) => {
    const cmdLine = cmdString.trim().split(/\s+/);
    const cmd = cmdLine[0].toLowerCase();
    const args = cmdLine.slice(1);
    const flags = args.filter(a => a.startsWith('-')).join('').replace(/-/g, '').split('');
    const targetArgs = args.filter(a => !a.startsWith('-'));
    
    const currentNode = getNodeAtCurrent();
    const newHistory: HistoryItem[] = [];

    const log = (item: HistoryItem) => newHistory.push(item);

    switch(cmd) {
      case 'help':
        log({ type: 'sys', content: 'commands: ls, cd, cat, pwd, clear, whoami, date, projects, wakatime, hack, sudo, reboot, id_card' });
        break;

      case 'clear':
        setHistory([]);
        return [];

      case 'pwd':
        log({ type: 'sys', content: currentPath.join('/').replace('~', '/home/guest') });
        break;

      case 'ls':
      case 'll':
        if (currentNode.type === 'dir' && currentNode.children) {
          const showHidden = flags.includes('a') || cmd === 'll';
          const showList = flags.includes('l') || cmd === 'll';
          
          const files = Object.entries(currentNode.children)
            .filter(([name, node]) => !node.hidden || showHidden)
            .sort((a, b) => {
               if(a[1].type === b[1].type) return a[0].localeCompare(b[0]);
               return a[1].type === 'dir' ? -1 : 1;
            });

          if (showList) {
             const listOutput = files.map(([name, node]) => {
                const typeChar = node.type === 'dir' ? 'd' : '-';
                const perms = node.protected ? 'r--------' : 'rw-r--r--';
                const user = node.protected ? 'root' : 'guest';
                const size = Math.floor(Math.random() * 4096);
                const date = 'Jan 1 00:00';
                return `${typeChar}${perms} 1 ${user} ${user} ${size.toString().padStart(4)} ${date} ${name}`;
             }).join('\n');
             log({ type: 'sys', content: listOutput });
          } else {
             const fileEls = files.map(([name, node]) => (
                <span key={name} className={`mr-4 ${node.type === 'dir' ? 'text-primary font-semibold' : node.type === 'exec' ? 'text-on-secondary-container' : 'text-on-surface'}`}>
                  {name}{node.type === 'dir' ? '/' : node.type === 'exec' ? '*' : ''}
                </span>
             ));
             log({ type: 'success', content: <div className="flex flex-wrap">{fileEls}</div> });
          }
        }
        break;

      case 'cd':
        const target = targetArgs[0];
        if (!target || target === '~') {
          setCurrentPath(['~']);
        } else if (target === '..') {
          if (currentPath.length > 1) setCurrentPath(prev => prev.slice(0, -1));
        } else if (target === '/') {
          setCurrentPath(['/']);
        } else {
          if (currentNode.children && currentNode.children[target] && currentNode.children[target].type === 'dir') {
             setCurrentPath(prev => [...prev, target]);
          } else {
             log({ type: 'error', content: `cd: no such directory: ${target}` });
          }
        }
        break;

      case 'cat':
        const file = targetArgs[0];
        if (!file) {
          log({ type: 'error', content: 'usage: cat [filename]' });
        } else if (file === '/etc/id_card' || file === 'id_card') {
           log({ type: 'component', content: <StudentIDCard /> });
        } else if (currentNode.children && currentNode.children[file]) {
          const node = currentNode.children[file];
          if (node.type === 'dir') {
            log({ type: 'error', content: `cat: ${file}: Is a directory` });
          } else if (node.protected && !asRoot) {
             log({ type: 'error', content: 'Access Denied: Root privileges required.' });
             addNotification('Elevated access required');
          } else {
            log({ type: 'sys', content: node.content || '' });
          }
        } else {
          log({ type: 'error', content: `cat: ${file}: No such file` });
        }
        break;
        
      case 'id_card':
        log({ type: 'component', content: <StudentIDCard /> });
        break;

      case 'projects':
        log({ type: 'sys', content: 'Accessing Project Artifacts...' });
        log({ type: 'success', content: PROJECTS.map(p => `> ${p.name} [${p.status}]`).join('\n') });
        break;

      case 'wakatime':
      case 'waka':
        log({ type: 'sys', content: 'Fetching WakaTime stats...' });
        fetch('/api/wakatime/summary')
          .then(res => res.json())
          .then(data => {
            if (data.error) {
              setHistory(h => [...h, { type: 'error', content: `wakatime: ${data.error}` }]);
              return;
            }

            const formatTime = (secs: number) => {
              const h = Math.floor(secs / 3600);
              const m = Math.floor((secs % 3600) / 60);
              return h > 0 ? `${h}h ${m}m` : `${m}m`;
            };

            const makeBar = (pct: number) => {
              const filled = Math.round(pct / 6.25);
              return '█'.repeat(filled) + '░'.repeat(16 - filled);
            };

            const langs = (data.languages || []).slice(0, 5).map((l: { name: string; percent: number }) =>
              `  ${l.name.padEnd(12)} ${makeBar(l.percent)} ${String(l.percent).padStart(3)}%`
            ).join('\n');

            const output = `
WAKATIME_STATS_v1.0
===================
TOTAL_TIME: ${formatTime(data.totalSeconds)} (7d)
DAILY_AVG:  ${formatTime(data.dailyAverage)}

LANGUAGES:
${langs || '  No data available'}

BEST_DAY: ${data.bestDay ? `${data.bestDay.date} (${formatTime(data.bestDay.seconds)})` : 'N/A'}
RANGE: ${data.range?.start || '?'} — ${data.range?.end || '?'}
`.trim();

            setHistory(h => [...h, { type: 'success', content: output }]);
          })
          .catch(() => {
            setHistory(h => [...h, { type: 'error', content: 'wakatime: failed to fetch stats' }]);
          });
        break;

      case 'whoami':
        log({ type: 'sys', content: asRoot ? 'root' : 'guest@pcstyle.dev (uid=1000)' });
        break;

      case 'sudo':
        const commandToRun = args.join(' ');
        if (!commandToRun) {
             log({ type: 'error', content: 'usage: sudo [command]' });
             return newHistory;
        }
        if (asRoot) {
             const res = processCommand(commandToRun, true);
             return [...newHistory, ...res];
        } else {
             log({ type: 'sys', content: `[sudo] password for guest:` });
             setPasswordMode(true);
             setPendingCommand(commandToRun);
             return newHistory;
        }

      case 'hack':
        log({ type: 'sys', content: 'Initializing brute-force sequence...' });
        setTimeout(() => setHistory(h => [...h, { type: 'success', content: 'Bypssing firewall... [OK]' }]), 800);
        setTimeout(() => setHistory(h => [...h, { type: 'success', content: 'Injecting payload... [OK]' }]), 1600);
        setTimeout(() => setHistory(h => [...h, { type: 'error', content: 'Connection Terminated by Remote Host.' }]), 2400);
        break;

      case 'date':
        log({ type: 'sys', content: new Date().toString() });
        break;
        
      case 'reboot':
         if (!asRoot) {
           log({ type: 'error', content: 'reboot: Operation not permitted' });
         } else {
           window.location.reload();
         }
         break;

      default:
        if (currentNode.children && currentNode.children[cmd] && currentNode.children[cmd].type === 'exec') {
           log({ type: 'sys', content: `Executing ${cmd}...` });
           log({ type: 'sys', content: currentNode.children[cmd].content || '' });
        } else {
           log({ type: 'error', content: `zsh: command not found: ${cmd}` });
        }
    }
    return newHistory;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (passwordMode) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      
      const nextPointer = historyPointer + 1;
      if (nextPointer < commandHistory.length) {
        if (historyPointer === -1) setTempInput(input);
        setInput(commandHistory[commandHistory.length - 1 - nextPointer]);
        setHistoryPointer(nextPointer);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyPointer === -1) return;

      const nextPointer = historyPointer - 1;
      if (nextPointer === -1) {
        setInput(tempInput);
        setHistoryPointer(-1);
      } else if (nextPointer >= 0) {
        setInput(commandHistory[commandHistory.length - 1 - nextPointer]);
        setHistoryPointer(nextPointer);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordMode) {
        setPasswordMode(false);
        const password = input.trim();
        setInput('');
        
        if (password === 'pcz_ai_2025') {
            setIsRoot(true);
            setHistory(h => [...h, { type: 'success', content: '' }]);
            if (pendingCommand) {
                const res = processCommand(pendingCommand, true);
                setHistory(h => [...h, ...res]);
            }
        } else {
            setHistory(h => [...h, { type: 'error', content: 'Sorry, try again.' }]);
            addNotification('Incorrect password');
        }
        setPendingCommand(null);
        return;
    }

    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add to history navigation
    setCommandHistory(prev => {
      const newHistory = [...prev, trimmedInput];
      // Limit history size
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryPointer(-1);

    const newEntry: HistoryItem = { 
        type: 'user', 
        content: input, 
        path: currentPath.join('/'), 
        isRoot 
    };

    setHistory(prev => [...prev, newEntry]);
    
    const results = processCommand(trimmedInput);
    setHistory(prev => [...prev, ...results]);
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto animate-slideUp">
      <p className="font-body text-on-surface-variant text-sm mb-4 max-w-xl">
        A small in-browser shell. Try <span className="text-primary font-medium">help</span>,{' '}
        <span className="text-primary font-medium">projects</span>, or{' '}
        <span className="text-primary font-medium">wakatime</span>.
      </p>
      <div className="glass-panel rounded-[1.75rem] shadow-ambient h-[70vh] sm:h-[480px] md:h-[550px] lg:h-[600px] flex flex-col font-body relative overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-surface-container-low/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {isRoot ? (
              <ShieldAlert size={16} className="text-error" />
            ) : (
              <TerminalIcon size={16} className="text-primary" />
            )}
            <span className="text-xs text-on-surface-variant font-semibold tracking-tight">
              {isRoot ? 'root@pcstyle.dev' : 'guest@pcstyle.dev'} · {currentPath.join('/')}
            </span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-error/25" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary/30" />
            <div className="w-2.5 h-2.5 rounded-full bg-secondary-container/80" />
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2 scrollbar-custom text-xs sm:text-sm bg-surface-container-lowest/40"
          onClick={() => document.getElementById('term-input')?.focus()}
          role="log"
        >
          {history.map((line, i) => (
            <div key={i} className="animate-fadeIn break-words">
              {line.type === 'user' ? (
                <div className="flex gap-2 text-on-surface font-semibold">
                  <span className={`${line.isRoot ? 'text-error' : 'text-primary'} shrink-0 font-mono text-[11px] sm:text-xs`}>
                    {line.isRoot ? 'root' : 'guest'}:{line.path}
                    {line.isRoot ? '#' : '$'}
                  </span>
                  <span className="font-mono text-[11px] sm:text-xs">{line.content}</span>
                </div>
              ) : line.type === 'component' ? (
                line.content
              ) : (
                <div
                  className={`pl-4 border-l-2 py-1 whitespace-pre-wrap font-mono text-[11px] sm:text-xs leading-relaxed ${
                    line.type === 'error'
                      ? 'border-error text-error'
                      : line.type === 'success'
                        ? 'border-primary text-on-surface'
                        : 'border-primary/25 text-on-surface-variant'
                  }`}
                >
                  {line.content}
                </div>
              )}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex gap-2 items-center glass-panel-subtle mx-3 mb-3 px-3 py-2.5 rounded-xl"
        >
          {!passwordMode && (
            <span
              className={`${isRoot ? 'text-error' : 'text-primary'} font-mono font-semibold text-[11px] sm:text-xs shrink-0`}
            >
              {isRoot ? 'root' : 'guest'}:{currentPath.join('/')}{isRoot ? '#' : '$'}
            </span>
          )}
          {passwordMode && <span className="text-on-surface font-body text-xs shrink-0">Password</span>}
          <input
            id="term-input"
            autoFocus
            type={passwordMode ? 'password' : 'text'}
            value={input}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-none outline-none flex-1 text-on-surface text-xs sm:text-sm caret-primary font-mono min-w-0"
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
};
