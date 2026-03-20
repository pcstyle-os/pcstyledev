import React from 'react';
import { Activity, Gauge, MousePointer2, Zap } from 'lucide-react';

export interface PerformanceBadgeProps {
  /** Smoothed frames per second from rAF */
  fps: number;
  /** Approximate ms from last pointer event to next paint (rAF) */
  latencyMs: number | null;
  /** User-driven interaction count */
  interactions: number;
  /** Compact row for mobile */
  compact?: boolean;
  /** When true, metrics are static / estimated (reduced motion or simple mode) */
  staticMode?: boolean;
}

export function PerformanceBadge({
  fps,
  latencyMs,
  interactions,
  compact = false,
  staticMode = false,
}: PerformanceBadgeProps) {
  const latencyLabel =
    latencyMs == null ? '—' : latencyMs < 1 ? '<1' : Math.round(latencyMs).toString();

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs font-mono text-on-surface-variant">
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-2 py-1 border border-primary/15">
          <Gauge size={12} className="text-primary shrink-0" />
          {staticMode ? 'demo' : `${Math.round(fps)} fps`}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-2 py-1 border border-primary/15">
          <Zap size={12} className="text-primary shrink-0" />
          {latencyLabel} ms
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-2 py-1 border border-primary/15">
          <MousePointer2 size={12} className="text-primary shrink-0" />
          {interactions}
        </span>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl border border-primary/20 p-4 sm:p-5 shadow-ambient">
      <div className="flex items-center gap-2 text-primary mb-3">
        <Activity size={18} strokeWidth={1.75} />
        <span className="text-xs font-body font-semibold uppercase tracking-widest">Live telemetry</span>
        {staticMode && (
          <span className="text-[10px] font-body uppercase tracking-wider text-on-surface-variant ml-auto">
            Simple mode
          </span>
        )}
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-sm">
        <div className="rounded-xl bg-surface-container-low/80 px-4 py-3">
          <dt className="text-[10px] font-body uppercase tracking-wider text-on-surface-variant mb-1 flex items-center gap-1.5">
            <Gauge size={12} className="text-primary" /> FPS
          </dt>
          <dd className="text-on-surface text-lg font-semibold tabular-nums">
            {staticMode ? '—' : `${Math.round(fps)}`}
          </dd>
        </div>
        <div className="rounded-xl bg-surface-container-low/80 px-4 py-3">
          <dt className="text-[10px] font-body uppercase tracking-wider text-on-surface-variant mb-1 flex items-center gap-1.5">
            <Zap size={12} className="text-primary" /> Event → paint
          </dt>
          <dd className="text-on-surface text-lg font-semibold tabular-nums">{latencyLabel} ms</dd>
        </div>
        <div className="rounded-xl bg-surface-container-low/80 px-4 py-3">
          <dt className="text-[10px] font-body uppercase tracking-wider text-on-surface-variant mb-1 flex items-center gap-1.5">
            <MousePointer2 size={12} className="text-primary" /> Interactions
          </dt>
          <dd className="text-on-surface text-lg font-semibold tabular-nums">{interactions}</dd>
        </div>
      </dl>
    </div>
  );
}
