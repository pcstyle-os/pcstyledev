import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutGrid, Terminal as TerminalIcon, BarChart3, User, Mail, Moon, Sun, Sparkles } from 'lucide-react';

import { SystemNotification } from './components/ui/SystemNotification';
import { PointerSpotlight } from './components/ui/PointerSpotlight';
import { useTheme } from './hooks/useTheme';
import { useUiSound } from './hooks/useUiSound';

import { Projects } from './pages/Projects';
import { Terminal } from './pages/Terminal';
import { Identity } from './pages/Identity';
import { Stats } from './pages/Stats';
import { SignatureDemo } from './pages/SignatureDemo';

import type { Synth } from './utils/audio';

interface LayoutProps {
  notifications: string[];
  addNotification: (msg: string) => void;
}

const NAV_STAGGER = ['nav-stagger-1', 'nav-stagger-2', 'nav-stagger-3', 'nav-stagger-4', 'nav-stagger-5'] as const;

function Layout({ notifications, addNotification }: LayoutProps) {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { soundEnabled, setSoundEnabled, playNavClick, playToggle } = useUiSound();
  const activeTab = location.pathname.substring(1) || 'projects';

  const navItems = [
    { path: '/', key: 'projects', label: 'Projects' },
    { path: '/demo', key: 'demo', label: 'Lab' },
    { path: '/stats', key: 'stats', label: 'Stats' },
    { path: '/identity', key: 'identity', label: 'About' },
    { path: '/terminal', key: 'terminal', label: 'Console' },
  ] as const;

  const isActive = (key: string) =>
    (key === 'projects' && activeTab === 'projects') || activeTab === key;

  const spotlightRoutes = activeTab === 'projects' || activeTab === 'stats' || activeTab === 'demo';

  const handleThemeToggle = () => {
    playToggle();
    toggleTheme();
  };

  return (
    <div className="relative min-h-screen bg-surface text-on-surface">
      <div className="site-atmosphere" aria-hidden />
      <PointerSpotlight enabled={spotlightRoutes} />

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
          <Outlet
            context={{
              soundEnabled,
              synth: null as Synth | null,
              addNotification,
            }}
          />
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
          </div>
          <p className="text-on-surface-variant font-body text-xs tracking-widest uppercase">
            © {new Date().getFullYear()} Adam Krupa
          </p>
        </div>
      </footer>

      {/* Mobile floating dock */}
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
        <a href="mailto:AdamKrupa@Tuta.io" className="text-on-surface-variant opacity-70">
          <Mail size={22} strokeWidth={1.8} />
        </a>
      </nav>

      <SystemNotification notifications={notifications} />
      </div>
    </div>
  );
}

export default function App() {
  const [notifications, setNotifications] = useState<string[]>([]);

  const addNotification = useCallback((msg: string) => {
    setNotifications((prev) => [...prev.slice(-3), msg]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n !== msg));
    }, 3500);
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={<Layout notifications={notifications} addNotification={addNotification} />}
        >
          <Route index element={<Projects />} />
          <Route path="demo" element={<SignatureDemo />} />
          <Route path="terminal" element={<Terminal />} />
          <Route path="stats" element={<Stats />} />
          <Route path="identity" element={<Identity />} />
        </Route>
      </Routes>

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
    </HashRouter>
  );
}
