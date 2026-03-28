import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
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
} from 'lucide-react';

import { PointerSpotlight } from '../ui/PointerSpotlight';
import { SystemNotification } from '../ui/SystemNotification';
import { useTheme } from '../../hooks/useTheme';
import { useUiSound } from '../../hooks/useUiSound';
import { useVisualSkin } from '../../hooks/useVisualSkin';
import type { Synth } from '../../utils/audio';

const NAV_STAGGER = [
  'nav-stagger-1',
  'nav-stagger-2',
  'nav-stagger-3',
  'nav-stagger-4',
  'nav-stagger-5',
  'nav-stagger-6',
] as const;

const NAV_ITEMS = [
  { path: '/', key: 'projects', label: 'Projects' },
  { path: '/hire', key: 'hire', label: 'Hire' },
  { path: '/demo', key: 'demo', label: 'Lab' },
  { path: '/stats', key: 'stats', label: 'Stats' },
  { path: '/identity', key: 'identity', label: 'About' },
  { path: '/terminal', key: 'terminal', label: 'Console' },
] as const;

interface EditorialLayoutProps {
  notifications: string[];
  addNotification: (msg: string) => void;
  synth: Synth | null;
}

export function EditorialLayout({ notifications, addNotification, synth }: EditorialLayoutProps) {
  const location = useLocation();
  const { toggleSkin } = useVisualSkin();
  const { isDark, toggleTheme } = useTheme();
  const { soundEnabled, setSoundEnabled, playNavClick, playToggle } = useUiSound();
  const activeTab = location.pathname.substring(1) || 'projects';

  const isActive = (key: string) =>
    (key === 'projects' && activeTab === 'projects') || activeTab === key;

  const spotlightRoutes =
    activeTab === 'projects' || activeTab === 'stats' || activeTab === 'demo' || activeTab === 'hire';

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

  return (
    <div className="relative min-h-screen bg-surface text-on-surface">
      <div className="site-atmosphere" aria-hidden />
      <PointerSpotlight enabled={spotlightRoutes} />

      <div className="site-content-layer flex min-h-screen flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded-lg">
          Skip to content
        </a>
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
              {NAV_ITEMS.map((item, i) => (
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
          id="main-content"
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
              &copy; {new Date().getFullYear()} Adam Krupa
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
            aria-label="Projects"
            onClick={() => playNavClick()}
          >
            <LayoutGrid size={22} strokeWidth={isActive('projects') ? 2.2 : 1.8} />
          </Link>
          <Link
            to="/demo"
            className={isActive('demo') ? 'text-primary' : 'text-on-surface-variant opacity-70'}
            aria-current={isActive('demo') ? 'page' : undefined}
            aria-label="Lab"
            onClick={() => playNavClick()}
          >
            <Sparkles size={22} strokeWidth={isActive('demo') ? 2.2 : 1.8} />
          </Link>
          <Link
            to="/stats"
            className={isActive('stats') ? 'text-primary' : 'text-on-surface-variant opacity-70'}
            aria-label="Stats"
            onClick={() => playNavClick()}
          >
            <BarChart3 size={22} strokeWidth={isActive('stats') ? 2.2 : 1.8} />
          </Link>
          <Link
            to="/hire"
            className={isActive('hire') ? 'text-primary' : 'text-on-surface-variant opacity-70'}
            aria-current={isActive('hire') ? 'page' : undefined}
            aria-label="Hire"
            onClick={() => playNavClick()}
          >
            <Briefcase size={22} strokeWidth={isActive('hire') ? 2.2 : 1.8} />
          </Link>
          <Link
            to="/identity"
            className={isActive('identity') ? 'text-primary' : 'text-on-surface-variant opacity-70'}
            aria-label="About"
            onClick={() => playNavClick()}
          >
            <User size={22} strokeWidth={isActive('identity') ? 2.2 : 1.8} />
          </Link>
          <Link
            to="/terminal"
            className={isActive('terminal') ? 'text-primary' : 'text-on-surface-variant opacity-70'}
            aria-label="Console"
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
