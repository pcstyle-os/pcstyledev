import React, { useCallback, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Terminal as TerminalIcon,
  BarChart3,
  User,
  Mail,
  Sparkles,
  Briefcase,
  Volume2,
  VolumeX,
} from 'lucide-react';

import { MatrixBackground } from './MatrixBackground';
import { CRTOverlay } from '../ui/CRTOverlay';
import { NeuralCursor } from '../ui/NeuralCursor';
import { KernelLog } from '../ui/KernelLog';
import { HexClock } from '../ui/HexClock';
import { LiveCodingStatus } from '../ui/LiveCodingStatus';
import { AudioVisualizer } from '../ui/AudioVisualizer';
import { SystemNotification } from '../ui/SystemNotification';
import { useUiSound } from '../../hooks/useUiSound';
import { useVisualSkin } from '../../hooks/useVisualSkin';
import type { Synth } from '../../utils/audio';

const ARTIFACT_NAV = [
  { path: '/', key: 'projects', label: 'projects' },
  { path: '/hire', key: 'hire', label: 'hire' },
  { path: '/demo', key: 'demo', label: 'lab' },
  { path: '/stats', key: 'stats', label: 'stats' },
  { path: '/identity', key: 'identity', label: 'identity' },
  { path: '/terminal', key: 'terminal', label: 'terminal' },
] as const;

interface ArtifactLayoutProps {
  notifications: string[];
  addNotification: (msg: string) => void;
  synth: Synth | null;
}

export function ArtifactLayout({ notifications, addNotification, synth }: ArtifactLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleSkin } = useVisualSkin();
  const { soundEnabled, setSoundEnabled, playNavClick, playToggle } = useUiSound();
  const activeTab = location.pathname.substring(1) || 'projects';
  const [logoClicks, setLogoClicks] = useState(0);
  const [isHacked, setIsHacked] = useState(false);
  const [isSuperHacker, setIsSuperHacker] = useState(false);

  useEffect(() => {
    const sequence = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ];
    let history: string[] = [];
    const handler = (e: KeyboardEvent) => {
      history = [...history, e.key];
      if (history.length > sequence.length) history.shift();
      if (JSON.stringify(history) === JSON.stringify(sequence)) {
        setIsSuperHacker((prev) => !prev);
        if (soundEnabled) synth?.playBlip(1200, 'sawtooth', 0.5);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [soundEnabled, synth]);

  useEffect(() => {
    if (!isSuperHacker) return;
    addNotification('ROOT_ACCESS_GRANTED: OVERDRIVE_MODE');
  }, [isSuperHacker, addNotification]);

  const handleLogoClick = useCallback(() => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    addNotification(`INPUT_OVERRIDE: ${newCount}/5`);
    if (soundEnabled) synth?.playBlip(200 + newCount * 100, 'sine');
    if (newCount >= 5) {
      setIsHacked(true);
      addNotification('SYSTEM_FAILURE_SIMULATED');
      setTimeout(() => {
        setIsHacked(false);
        setLogoClicks(0);
      }, 3000);
    }
  }, [logoClicks, soundEnabled, synth, addNotification]);

  const handleSkinToggle = () => {
    playToggle();
    toggleSkin();
  };

  const isActive = (key: string) =>
    (key === 'projects' && activeTab === 'projects') || activeTab === key;

  const outletContext = {
    soundEnabled,
    synth,
    addNotification,
  };

  return (
    <div
      className={`relative min-h-screen bg-black text-gray-300 font-mono selection:bg-[#ff00ff] selection:text-black overflow-x-hidden cursor-none transition-all duration-1000 ${
        isHacked ? 'animate-artifact-shake' : ''
      }`}
      style={{ filter: isSuperHacker ? 'hue-rotate(90deg) contrast(1.2)' : undefined }}
    >
      <MatrixBackground />
      <CRTOverlay />
      <div className="relative z-10 transition-all duration-1000">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#ff00ff] focus:text-black focus:rounded">
          Skip to content
        </a>
        <header className="border-b border-[#ff00ff]/20 bg-black/95 backdrop-blur-xl sticky top-0 z-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-2 sm:py-4 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
            <div className="flex items-center gap-4 sm:gap-6 group w-full md:w-auto justify-between md:justify-start">
              <button
                type="button"
                onClick={handleLogoClick}
                onDoubleClick={() => navigate('/')}
                className="w-10 h-10 md:w-12 md:h-12 bg-[#ff00ff] cursor-none flex items-center justify-center text-black font-black italic text-xl md:text-2xl active:scale-90 transition-all shadow-[0_0_15px_#ff00ff66] shrink-0"
                title="Double-click: home"
              >
                PC
              </button>
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
                {ARTIFACT_NAV.map((item) => {
                  const active = isActive(item.key);
                  return (
                    <Link
                      key={item.key}
                      to={item.path}
                      onClick={() => {
                        playNavClick();
                        addNotification(`ACCESSING_${item.label.toUpperCase()}`);
                        if (soundEnabled) synth?.playBlip(600, 'sine', 0.05);
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

              <div className="flex gap-4 items-center justify-center md:ml-4 scale-75 md:scale-100 flex-wrap">
                <button
                  type="button"
                  onClick={handleSkinToggle}
                  className="text-[9px] md:text-[10px] font-black uppercase tracking-widest px-3 py-2 border border-[#ff00ff]/40 text-[#ff00ff] hover:bg-[#ff00ff]/10 rounded-full transition-colors"
                  aria-label="Switch to editorial skin"
                >
                  Editorial
                </button>
                <HexClock />
                <div className="hidden md:block h-4 w-[1px] bg-[#ff00ff]/20 mx-2" />
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
          id="main-content"
          key={location.pathname}
          className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-24 relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] pb-28 md:pb-16"
        >
          <Outlet context={outletContext} />
        </main>

        <footer className="p-8 sm:p-12 md:p-20 border-t border-[#ff00ff]/10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 md:gap-10">
            <div className="flex flex-col items-center md:items-start gap-3">
              <p className="text-[12px] text-[#ff00ff] font-black uppercase tracking-[0.5em] opacity-30">
                &copy; {new Date().getFullYear()} pcstyle.dev
              </p>
              <span className="text-[10px] text-gray-800 uppercase tracking-widest font-mono">
                protocol_reserved: 777-99-ALPHA
              </span>
            </div>
            <div className="flex gap-6 sm:gap-10 md:gap-16 text-gray-700">
              {['privacy', 'network', 'source'].map((link) => (
                <span
                  key={link}
                  className="text-[10px] uppercase font-black cursor-none hover:text-[#ff00ff] transition-all tracking-[0.3em]"
                >
                  {link}
                </span>
              ))}
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
          aria-label="Projects"
          onClick={() => playNavClick()}
        >
          <LayoutGrid size={22} strokeWidth={isActive('projects') ? 2.2 : 1.8} />
        </Link>
        <Link
          to="/demo"
          className={isActive('demo') ? 'text-[#ff00ff]' : 'text-gray-600'}
          aria-label="Lab"
          onClick={() => playNavClick()}
        >
          <Sparkles size={22} strokeWidth={isActive('demo') ? 2.2 : 1.8} />
        </Link>
        <Link
          to="/stats"
          className={isActive('stats') ? 'text-[#ff00ff]' : 'text-gray-600'}
          aria-label="Stats"
          onClick={() => playNavClick()}
        >
          <BarChart3 size={22} strokeWidth={isActive('stats') ? 2.2 : 1.8} />
        </Link>
        <Link
          to="/hire"
          className={isActive('hire') ? 'text-[#ff00ff]' : 'text-gray-600'}
          aria-label="Hire"
          onClick={() => playNavClick()}
        >
          <Briefcase size={22} strokeWidth={isActive('hire') ? 2.2 : 1.8} />
        </Link>
        <Link
          to="/identity"
          className={isActive('identity') ? 'text-[#ff00ff]' : 'text-gray-600'}
          aria-label="About"
          onClick={() => playNavClick()}
        >
          <User size={22} strokeWidth={isActive('identity') ? 2.2 : 1.8} />
        </Link>
        <Link
          to="/terminal"
          className={isActive('terminal') ? 'text-[#ff00ff]' : 'text-gray-600'}
          aria-label="Console"
          onClick={() => playNavClick()}
        >
          <TerminalIcon size={22} strokeWidth={isActive('terminal') ? 2.2 : 1.8} />
        </Link>
        <a href="mailto:AdamKrupa@Tuta.io" className="text-gray-600" aria-label="Email">
          <Mail size={22} strokeWidth={1.8} />
        </a>
      </nav>
    </div>
  );
}
