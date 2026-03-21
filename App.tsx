import React, { useState, useCallback, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutGrid,
  Terminal as TerminalIcon,
  BarChart3,
  User,
  Mail,
  Moon,
  Sun,
  Sparkles,
  Briefcase,
  Volume2,
  VolumeX,
} from 'lucide-react';

import { MatrixBackground } from './components/layout/MatrixBackground';
import { CRTOverlay } from './components/ui/CRTOverlay';
import { NeuralCursor } from './components/ui/NeuralCursor';
import { KernelLog } from './components/ui/KernelLog';
import { HexClock } from './components/ui/HexClock';
import { LiveCodingStatus } from './components/ui/LiveCodingStatus';
import { AudioVisualizer } from './components/ui/AudioVisualizer';
import { SystemNotification } from './components/ui/SystemNotification';
import { PointerSpotlight } from './components/ui/PointerSpotlight';
import { useTheme } from './hooks/useTheme';
import { useUiSound } from './hooks/useUiSound';
import { useVisualSkin, VisualSkinProvider } from './hooks/useVisualSkin';
import { createSynth } from './utils/audio';

import { Projects } from './pages/Projects';
import { Terminal } from './pages/Terminal';
import { Identity } from './pages/Identity';
import { Stats } from './pages/Stats';
import { SignatureDemo } from './pages/SignatureDemo';
import { Hire } from './pages/Hire';

import type { Synth } from './utils/audio';

interface LayoutProps {
  notifications: string[];
  addNotification: (msg: string) => void;
  synth: Synth | null;
}

const NAV_STAGGER = [
  'nav-stagger-1',
  'nav-stagger-2',
  'nav-stagger-3',
  'nav-stagger-4',
  'nav-stagger-5',
  'nav-stagger-6',
] as const;

function Layout({ notifications, addNotification, synth }: LayoutProps) {
  const location = useLocation();
  const { skin, toggleSkin } = useVisualSkin();
  const { isDark, toggleTheme } = useTheme();
  const { soundEnabled, setSoundEnabled, playNavClick, playToggle } = useUiSound();
  const activeTab = location.pathname.substring(1) || 'projects';

  const navItems = [
    { path: '/', key: 'projects', label: 'Projects' },
    { path: '/hire', key: 'hire', label: 'Hire' },
    { path: '/demo', key: 'demo', label: 'Lab' },
    { path: '/stats', key: 'stats', label: 'Stats' },
    { path: '/identity', key: 'identity', label: 'About' },
    { path: '/terminal', key: 'terminal', label: 'Console' },
  ] as const;

  const isActive = (key: string) =>
    (key === 'projects' && activeTab === 'projects') || activeTab === key;

  const spotlightRoutes =
    skin === 'editorial' &&
    (activeTab === 'projects' || activeTab === 'stats' || activeTab === 'demo' || activeTab === 'hire');

  const handleThemeToggle = () => {
    playToggle();
    toggleTheme();
  };

  const handleSkinToggle = () => {
    playToggle();
    toggleSkin();
  };

  const outletContext = {
    soundEnabled,
    synth,
    addNotification,
  };

  if (skin === 'artifact') {
    return (
      <>
        <MatrixBackground />
        <CRTOverlay />
        <div className="relative z-[40] transition-all duration-1000 min-h-screen bg-black text-on-surface">
          <header className="border-b border-[#ff00ff]/20 bg-black/95 backdrop-blur-xl sticky top-0 z-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 py-2 sm:py-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
              <div className="flex items-center gap-4 sm:gap-6 group w-full md:w-auto justify-between md:justify-start">
                <Link
                  to="/"
                  className="w-10 h-10 md:w-12 md:h-12 bg-[#ff00ff] flex items-center justify-center text-black font-black italic text-xl md:text-2xl active:scale-90 transition-all shadow-[0_0_15px_#ff00ff66] shrink-0"
                  onClick={() => {
                    playNavClick();
                    addNotification('ACCESSING_ROOT');
                  }}
                >
                  PC
                </Link>
                <div className="hidden sm:block min-w-0">
                  <h1 className="text-xl font-bold tracking-tighter text-white uppercase group-hover:text-[#ff00ff] transition-colors">
                    pcstyle<span className="text-[#ff00ff]/40">.dev</span>
                  </h1>
                  <div className="flex gap-6 mt-1">
                    <LiveCodingStatus />
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto">
                <nav className="flex items-center justify-center gap-1 sm:gap-3 md:gap-6 lg:gap-10 w-full overflow-x-auto no-scrollbar scroll-smooth py-1">
                  {navItems.map((item) => {
                    const active = isActive(item.key);
                    return (
                      <Link
                        key={item.key}
                        to={item.path}
                        onClick={() => {
                          playNavClick();
                          addNotification(`ACCESSING_${item.key.toUpperCase()}`);
                        }}
                        className={`text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.4em] transition-all relative px-2 py-2 md:py-3 flex-shrink-0 ${
                          active ? 'text-[#ff00ff] font-black' : 'text-gray-600 hover:text-white'
                        }`}
                      >
                        {item.label}
                        {active && (
                          <div className="absolute bottom-0 left-0 w-full h-[2px] md:h-1 bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]" />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                <div className="flex gap-2 sm:gap-4 items-center justify-center md:ml-4 flex-wrap">
                  <button
                    type="button"
                    onClick={handleSkinToggle}
                    className="text-[9px] md:text-[10px] font-black uppercase tracking-widest px-3 py-2 border border-[#ff00ff]/40 text-[#ff00ff] hover:bg-[#ff00ff]/10 rounded-full transition-colors"
                    aria-label="Switch to editorial skin"
                  >
                    Editorial
                  </button>
                  <HexClock />
                  <div className="hidden md:block h-4 w-px bg-[#ff00ff]/20 mx-1" />
                  <AudioVisualizer synth={synth} isActive={soundEnabled} />
                  <button
                    type="button"
                    onClick={() => {
                      setSoundEnabled(!soundEnabled);
                      addNotification(!soundEnabled ? 'AUDIO_LIVE' : 'MUTE_ACTIVE');
                    }}
                    className={`p-2 border rounded-full transition-all ${
                      soundEnabled ? 'border-[#ff00ff] text-[#ff00ff]' : 'border-gray-800 text-gray-700'
                    }`}
                    aria-label={soundEnabled ? 'Mute UI sound' : 'Enable UI sound'}
                  >
                    {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main
            key={location.pathname}
            className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-24 relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] pb-28 md:pb-16"
          >
            <Outlet context={outletContext} />
          </main>

          <footer className="p-8 sm:p-12 md:p-20 border-t border-[#ff00ff]/10 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 md:gap-10">
              <div className="flex flex-col items-center md:items-start gap-3">
                <p className="text-[12px] text-[#ff00ff] font-black uppercase tracking-[0.5em] opacity-30">
                  © {new Date().getFullYear()} pcstyle.dev
                </p>
                <span className="text-[10px] text-gray-800 uppercase tracking-widest font-mono">
                  protocol_reserved: 777-99-ALPHA
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-gray-700 text-[10px] uppercase font-black tracking-[0.2em]">
                <a
                  href="https://github.com/pc-style"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#ff00ff] transition-colors"
                >
                  GitHub
                </a>
                <Link to="/identity" className="hover:text-[#ff00ff] transition-colors">
                  Contact
                </Link>
                <Link to="/stats" className="hover:text-[#ff00ff] transition-colors">
                  Metrics
                </Link>
                <Link to="/hire" className="hover:text-[#ff00ff] transition-colors">
                  Hire
                </Link>
              </div>
            </div>
          </footer>
        </div>

        <NeuralCursor />
        <KernelLog />
        <SystemNotification notifications={notifications} />

        <nav
          className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 border border-[#ff00ff]/25 bg-black/90 backdrop-blur-md px-5 py-3 rounded-2xl flex items-center gap-5 z-50 shadow-[0_0_24px_rgba(255,0,255,0.12)]"
          aria-label="Primary"
        >
          <Link
            to="/"
            className={isActive('projects') ? 'text-[#ff00ff]' : 'text-gray-600'}
            aria-current={isActive('projects') ? 'page' : undefined}
            onClick={() => playNavClick()}
          >
            <LayoutGrid size={22} strokeWidth={isActive('projects') ? 2.2 : 1.8} />
          </Link>
          <Link
            to="/demo"
            className={isActive('demo') ? 'text-[#ff00ff]' : 'text-gray-600'}
            onClick={() => playNavClick()}
          >
            <Sparkles size={22} strokeWidth={isActive('demo') ? 2.2 : 1.8} />
          </Link>
          <Link to="/stats" className={isActive('stats') ? 'text-[#ff00ff]' : 'text-gray-600'} onClick={() => playNavClick()}>
            <BarChart3 size={22} strokeWidth={isActive('stats') ? 2.2 : 1.8} />
          </Link>
          <Link
            to="/hire"
            className={isActive('hire') ? 'text-[#ff00ff]' : 'text-gray-600'}
            onClick={() => playNavClick()}
          >
            <Briefcase size={22} strokeWidth={isActive('hire') ? 2.2 : 1.8} />
          </Link>
          <Link to="/identity" className={isActive('identity') ? 'text-[#ff00ff]' : 'text-gray-600'} onClick={() => playNavClick()}>
            <User size={22} strokeWidth={isActive('identity') ? 2.2 : 1.8} />
          </Link>
          <Link
            to="/terminal"
            className={isActive('terminal') ? 'text-[#ff00ff]' : 'text-gray-600'}
            onClick={() => playNavClick()}
          >
            <TerminalIcon size={22} strokeWidth={isActive('terminal') ? 2.2 : 1.8} />
          </Link>
          <a href="mailto:AdamKrupa@Tuta.io" className="text-gray-600" aria-label="Email">
            <Mail size={22} strokeWidth={1.8} />
          </a>
        </nav>
      </>
    );
  }

  return (
    <div className="relative min-h-screen bg-surface text-on-surface">
      <div className="site-atmosphere" aria-hidden />
      <PointerSpotlight enabled={Boolean(spotlightRoutes)} />

      <div className="site-content-layer flex min-h-screen flex-col">
        <header className="fixed top-0 left-0 right-0 z-50 glass-panel shadow-ambient rounded-b-3xl md:rounded-b-none">
          <nav className="flex justify-between items-center px-6 sm:px-10 lg:px-16 py-5 w-full max-w-screen-2xl mx-auto gap-4">
            <Link
              to="/"
              className="masthead-logo-draw font-headline italic text-xl sm:text-2xl text-primary tracking-tight shrink-0"
              onClick={() => playNavClick()}
            >
              pcstyle<span className="text-on-surface-variant not-italic font-body font-medium">.dev</span>
            </Link>

            <div className="hidden md:flex items-center gap-10 lg:gap-12">
              {navItems.map((item, i) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`nav-link-register font-headline text-base lg:text-lg tracking-tight transition-colors ${NAV_STAGGER[i] ?? ''} ${
                    isActive(item.key)
                      ? 'nav-link-register--active text-primary font-semibold'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                  onClick={() => playNavClick()}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={handleSkinToggle}
                className="inline-flex items-center rounded-full border border-primary/30 bg-surface-container-lowest/80 px-2.5 sm:px-3 py-2 text-[9px] sm:text-[10px] font-body font-semibold uppercase tracking-widest text-primary hover:bg-primary-container/25 transition-colors"
                aria-label="Switch to artifact skin"
              >
                Artifact
              </button>
              <button
                type="button"
                onClick={handleThemeToggle}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-surface-container-lowest/70 text-primary shadow-ambient backdrop-blur-sm transition hover:bg-primary-container/30 active:scale-[0.96] dark:border-primary/25 dark:bg-surface-container-lowest/50"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
              </button>
              <a
                href="mailto:AdamKrupa@Tuta.io"
                className="hidden sm:inline-flex editorial-gradient text-on-primary px-6 lg:px-8 py-2.5 rounded-full font-body font-semibold text-sm tracking-wide shadow-ambient hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Connect
              </a>
            </div>
          </nav>
        </header>

        <main
          key={location.pathname}
          className="app-main-enter pt-28 sm:pt-32 pb-28 md:pb-16 px-6 sm:px-10 lg:px-16 max-w-screen-2xl mx-auto min-h-[65vh] w-full flex-1"
        >
          <Outlet context={outletContext} />
        </main>

        <footer className="bg-surface-container-low/80 backdrop-blur-md w-full py-12 px-6 sm:px-10 lg:px-16 mt-auto">
          <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-screen-2xl mx-auto gap-8">
            <div className="font-headline text-lg text-primary italic">pcstyle.dev</div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 lg:gap-12 text-on-surface-variant font-body text-xs tracking-widest uppercase items-center">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`rounded-full px-3 py-1.5 border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50 ${
                  soundEnabled
                    ? 'border-primary/40 text-primary bg-primary/10'
                    : 'border-transparent hover:text-primary'
                }`}
                aria-pressed={soundEnabled}
              >
                UI sound {soundEnabled ? 'on' : 'off'}
              </button>
              <a
                href="https://github.com/pc-style"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary transition-colors"
              >
                GitHub
              </a>
              <Link to="/identity" className="hover:text-primary transition-colors">
                Contact
              </Link>
              <Link to="/stats" className="hover:text-primary transition-colors">
                Metrics
              </Link>
              <Link to="/hire" className="hover:text-primary transition-colors">
                Hire
              </Link>
            </div>
            <p className="text-on-surface-variant font-body text-xs tracking-widest uppercase">
              © {new Date().getFullYear()} Adam Krupa
            </p>
          </div>
        </footer>

        <nav
          className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 glass-panel px-6 py-3.5 rounded-2xl shadow-ambient flex items-center gap-6 z-50"
          aria-label="Primary"
        >
          <Link
            to="/"
            className={isActive('projects') ? 'text-primary' : 'text-on-surface-variant opacity-70'}
            aria-current={isActive('projects') ? 'page' : undefined}
            onClick={() => playNavClick()}
          >
            <LayoutGrid size={22} strokeWidth={isActive('projects') ? 2.2 : 1.8} />
          </Link>
          <Link
            to="/demo"
            className={isActive('demo') ? 'text-primary' : 'text-on-surface-variant opacity-70'}
            aria-current={isActive('demo') ? 'page' : undefined}
            onClick={() => playNavClick()}
          >
            <Sparkles size={22} strokeWidth={isActive('demo') ? 2.2 : 1.8} />
          </Link>
          <Link
            to="/stats"
            className={isActive('stats') ? 'text-primary' : 'text-on-surface-variant opacity-70'}
            onClick={() => playNavClick()}
          >
            <BarChart3 size={22} strokeWidth={isActive('stats') ? 2.2 : 1.8} />
          </Link>
          <Link
            to="/hire"
            className={isActive('hire') ? 'text-primary' : 'text-on-surface-variant opacity-70'}
            aria-current={isActive('hire') ? 'page' : undefined}
            onClick={() => playNavClick()}
          >
            <Briefcase size={22} strokeWidth={isActive('hire') ? 2.2 : 1.8} />
          </Link>
          <Link
            to="/identity"
            className={isActive('identity') ? 'text-primary' : 'text-on-surface-variant opacity-70'}
            onClick={() => playNavClick()}
          >
            <User size={22} strokeWidth={isActive('identity') ? 2.2 : 1.8} />
          </Link>
          <Link
            to="/terminal"
            className={isActive('terminal') ? 'text-primary' : 'text-on-surface-variant opacity-70'}
            onClick={() => playNavClick()}
          >
            <TerminalIcon size={22} strokeWidth={isActive('terminal') ? 2.2 : 1.8} />
          </Link>
          <a href="mailto:AdamKrupa@Tuta.io" className="text-on-surface-variant opacity-70" aria-label="Email">
            <Mail size={22} strokeWidth={1.8} />
          </a>
        </nav>

        <SystemNotification notifications={notifications} />
      </div>
    </div>
  );
}

interface AppTreeProps {
  notifications: string[];
  addNotification: (msg: string) => void;
  synth: Synth | null;
}

/** Router-agnostic route tree (used with BrowserRouter or StaticRouter for prerender). */
export function AppTree({ notifications, addNotification, synth }: AppTreeProps) {
  return (
    <Routes>
      <Route path="/" element={<Layout notifications={notifications} addNotification={addNotification} synth={synth} />}>
        <Route index element={<Projects />} />
        <Route path="hire" element={<Hire />} />
        <Route path="demo" element={<SignatureDemo />} />
        <Route path="terminal" element={<Terminal />} />
        <Route path="stats" element={<Stats />} />
        <Route path="identity" element={<Identity />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  const [notifications, setNotifications] = useState<string[]>([]);
  const synth = useMemo(() => createSynth(), []);

  const addNotification = useCallback((msg: string) => {
    setNotifications((prev) => [...prev.slice(-3), msg]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n !== msg));
    }, 3500);
  }, []);

  return (
    <BrowserRouter>
      <VisualSkinProvider>
        <AppTree notifications={notifications} addNotification={addNotification} synth={synth} />
      </VisualSkinProvider>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(24px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(12px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.7s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideIn { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </BrowserRouter>
  );
}
