import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { PerformanceBadge } from '../components/ui/PerformanceBadge';

const PARTICLE_COUNT = 420;
const REDUCED_PARTICLE_COUNT = 80;

type Particle = { x: number; y: number; vx: number; vy: number; r: number; a: number };

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

function initParticles(w: number, h: number, count: number): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 1.8 + 0.4,
      a: Math.random() * 0.5 + 0.15,
    });
  }
  return out;
}

export const SignatureDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);
  const fpsAccumRef = useRef({ frames: 0, lastReport: 0, value: 60 });

  const reducedMotion = useReducedMotion();
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const simpleMode = reducedMotion || narrow;

  const [fps, setFps] = useState(60);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [interactions, setInteractions] = useState(0);

  const bumpInteraction = useCallback(() => {
    setInteractions((n) => n + 1);
  }, []);

  const measureLatency = useCallback(() => {
    const t0 = performance.now();
    requestAnimationFrame(() => {
      setLatencyMs(performance.now() - t0);
    });
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
      measureLatency();
    },
    [measureLatency],
  );

  const onPointerDown = useCallback(() => {
    bumpInteraction();
    measureLatency();
  }, [bumpInteraction, measureLatency]);

  const onPointerLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || simpleMode) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = container.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = narrow ? Math.floor(PARTICLE_COUNT * 0.55) : PARTICLE_COUNT;
      particlesRef.current = initParticles(width, height, count);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const tick = (ts: number) => {
      const last = lastTsRef.current || ts;
      const dt = Math.min(32, ts - last);
      lastTsRef.current = ts;

      const acc = fpsAccumRef.current;
      acc.frames += 1;
      if (ts - acc.lastReport >= 500) {
        const elapsed = (ts - acc.lastReport) / 1000;
        acc.value = acc.frames / elapsed;
        acc.frames = 0;
        acc.lastReport = ts;
        setFps(acc.value);
      }

      const { width, height } = container.getBoundingClientRect();
      const parts = particlesRef.current;
      const mouse = mouseRef.current;

      const rootStyle = getComputedStyle(document.documentElement);
      const lowest = rootStyle.getPropertyValue('--tw-surface-container-lowest').trim() || '255 255 255';
      const primaryRgb = rootStyle.getPropertyValue('--tw-primary').trim() || '70 101 97';
      ctx.fillStyle = `rgb(${lowest.replaceAll(' ', ',')} / 0.18)`;
      ctx.fillRect(0, 0, width, height);

      const cx = mouse.active ? mouse.x : width * 0.5;
      const cy = mouse.active ? mouse.y : height * 0.45;
      const pull = mouse.active ? 0.085 : 0.035;

      for (const p of parts) {
        const dx = cx - p.x;
        const dy = cy - p.y;
        const d = Math.hypot(dx, dy) + 8;
        p.vx += (dx / d) * pull * (dt / 16);
        p.vy += (dy / d) * pull * (dt / 16);
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx * (dt / 16) * 4;
        p.y += p.vy * (dt / 16) * 4;
        if (p.x < 0 || p.x > width) p.vx *= -0.6;
        if (p.y < 0 || p.y > height) p.vy *= -0.6;
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));
      }

      for (const p of parts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${primaryRgb.replaceAll(' ', ',')} / ${p.a})`;
        ctx.fill();
      }

      ctx.strokeStyle = `rgb(${primaryRgb.replaceAll(' ', ',')} / 0.12)`;
      ctx.lineWidth = 1;
      for (let i = 0; i < parts.length; i += 3) {
        for (let j = i + 1; j < Math.min(i + 6, parts.length); j++) {
          const a = parts[i];
          const b = parts[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 72) {
            ctx.globalAlpha = (1 - dist / 72) * 0.35;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [simpleMode, narrow]);

  return (
    <div className="max-w-screen-2xl mx-auto animate-fadeIn space-y-10 sm:space-y-14 pb-24 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-on-surface-variant font-body text-sm hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={18} /> Back to projects
          </Link>
          <div className="flex items-center gap-3 text-primary mb-4">
            <Sparkles size={28} strokeWidth={1.5} />
            <span className="text-xs font-body font-semibold uppercase tracking-widest">Signature lab</span>
          </div>
          <h1 className="font-headline text-4xl sm:text-6xl md:text-7xl text-on-surface leading-[0.95] tracking-tight">
            Adaptive <span className="italic text-primary font-light">signal field</span>
          </h1>
          <p className="mt-6 text-on-surface-variant font-body text-base sm:text-lg max-w-2xl leading-relaxed">
            A dense particle mesh that chases your pointer with spring physics, edge-collision, and proximity lines —
            with live FPS and event-to-paint timing so the craft is visible, not implied.
          </p>
        </div>
        <div className="shrink-0 w-full sm:max-w-md">
          <PerformanceBadge
            fps={fps}
            latencyMs={latencyMs}
            interactions={interactions}
            staticMode={simpleMode}
          />
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative rounded-[2rem] overflow-hidden glass-panel shadow-ambient min-h-[320px] sm:min-h-[420px] md:min-h-[520px] border border-primary/20"
        onPointerMove={simpleMode ? undefined : onPointerMove}
        onPointerDown={onPointerDown}
        onPointerLeave={simpleMode ? undefined : onPointerLeave}
        role="application"
        aria-label="Interactive particle field demo"
      >
        {!simpleMode && (
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full touch-none cursor-crosshair" />
        )}

        {simpleMode && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-surface-container-low/40">
            <p className="font-headline text-2xl sm:text-3xl text-on-surface mb-4">Simple mode</p>
            <p className="text-on-surface-variant font-body max-w-md mb-8">
              Reduced motion, narrow viewport, or low-power preference: the heavy canvas loop stays off. Tap below to
              register interactions and see timing samples.
            </p>
            <div
              className="grid gap-3 w-full max-w-sm"
              style={{
                gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(REDUCED_PARTICLE_COUNT / 2))}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: REDUCED_PARTICLE_COUNT }).map((_, i) => (
                <span
                  key={i}
                  className="aspect-square rounded-full bg-primary/20 border border-primary/30"
                  aria-hidden
                />
              ))}
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 sm:hidden">
          <PerformanceBadge
            fps={fps}
            latencyMs={latencyMs}
            interactions={interactions}
            compact
            staticMode={simpleMode}
          />
        </div>
      </div>

      <p className="text-on-surface-variant font-body text-sm max-w-3xl">
        This page exists to answer one question recruiters rarely ask out loud:{' '}
        <span className="text-on-surface font-medium">does the interface respect the event loop?</span> If the numbers
        stay stable while you move, that&apos;s the point.
      </p>
    </div>
  );
};
