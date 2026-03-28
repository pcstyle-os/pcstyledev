import React, { lazy, Suspense, useState, useCallback, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { BootSequence } from './components/ui/BootSequence';
import { useVisualSkin, VisualSkinProvider } from './hooks/useVisualSkin';
import { createSynth } from './utils/audio';

import { Projects } from './pages/Projects';
import { Hire } from './pages/Hire';

import type { Synth } from './utils/audio';

const Terminal = lazy(() => import('./pages/Terminal').then((m) => ({ default: m.Terminal })));
const Identity = lazy(() => import('./pages/Identity').then((m) => ({ default: m.Identity })));
const Stats = lazy(() => import('./pages/Stats').then((m) => ({ default: m.Stats })));
const SignatureDemo = lazy(() => import('./pages/SignatureDemo').then((m) => ({ default: m.SignatureDemo })));

const ArtifactLayout = lazy(() =>
  import('./components/layout/ArtifactLayout').then((m) => ({ default: m.ArtifactLayout })),
);
const EditorialLayout = lazy(() =>
  import('./components/layout/EditorialLayout').then((m) => ({ default: m.EditorialLayout })),
);

function BootGate({
  children,
  onBootComplete,
}: {
  children: React.ReactNode;
  onBootComplete?: () => void;
}) {
  const { skin } = useVisualSkin();
  const [bootDone, setBootDone] = useState(() => {
    if (typeof document === 'undefined') return true;
    return document.documentElement.dataset.skin !== 'artifact';
  });

  useEffect(() => {
    if (skin === 'editorial') setBootDone(true);
  }, [skin]);

  if (skin === 'artifact' && !bootDone) {
    return (
      <BootSequence
        onComplete={() => {
          setBootDone(true);
          onBootComplete?.();
        }}
      />
    );
  }

  return <>{children}</>;
}

interface LayoutRouterProps {
  notifications: string[];
  addNotification: (msg: string) => void;
  synth: Synth | null;
}

function LayoutRouter({ notifications, addNotification, synth }: LayoutRouterProps) {
  const { skin } = useVisualSkin();

  const layoutElement =
    skin === 'artifact' ? (
      <ArtifactLayout notifications={notifications} addNotification={addNotification} synth={synth} />
    ) : (
      <EditorialLayout notifications={notifications} addNotification={addNotification} synth={synth} />
    );

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={layoutElement}>
          <Route index element={<Projects />} />
          <Route path="hire" element={<Hire />} />
          <Route
            path="demo"
            element={
              <Suspense fallback={null}>
                <SignatureDemo />
              </Suspense>
            }
          />
          <Route
            path="terminal"
            element={
              <Suspense fallback={null}>
                <Terminal />
              </Suspense>
            }
          />
          <Route
            path="stats"
            element={
              <Suspense fallback={null}>
                <Stats />
              </Suspense>
            }
          />
          <Route
            path="identity"
            element={
              <Suspense fallback={null}>
                <Identity />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
}

interface AppTreeProps {
  notifications: string[];
  addNotification: (msg: string) => void;
  synth: Synth | null;
}

/** Router-agnostic route tree (used with BrowserRouter or StaticRouter for prerender). */
export function AppTree({ notifications, addNotification, synth }: AppTreeProps) {
  return <LayoutRouter notifications={notifications} addNotification={addNotification} synth={synth} />;
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
        <BootGate onBootComplete={() => addNotification('UPLINK_STABLE')}>
          <AppTree notifications={notifications} addNotification={addNotification} synth={synth} />
        </BootGate>
      </VisualSkinProvider>
    </BrowserRouter>
  );
}
