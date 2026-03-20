import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import replayData from '../../data/replays/sessions.json';

export type ReplayStepKind = 'log' | 'checkpoint' | 'fail' | 'fix' | 'ship';

export interface ReplayStep {
  t: number;
  kind: ReplayStepKind;
  text: string;
}

export interface ReplaySession {
  id: string;
  title: string;
  summary: string;
  narrationUrl: string | null;
  steps: ReplayStep[];
}

const SPEEDS = [1, 1.5, 2] as const;

const KIND_CLASS: Record<ReplayStepKind, string> = {
  log: 'border-primary/30 text-on-surface-variant',
  checkpoint: 'border-secondary-container text-on-surface',
  fail: 'border-error text-error',
  fix: 'border-primary text-primary',
  ship: 'border-primary bg-primary/10 text-on-surface font-semibold',
};

export function ReplayTimeline() {
  const sessions = replayData.sessions as ReplaySession[];
  const [sessionId, setSessionId] = useState(sessions[0]?.id ?? '');
  const session = useMemo(
    () => sessions.find((s) => s.id === sessionId) ?? sessions[0],
    [sessions, sessionId],
  );

  const sortedSteps = useMemo(
    () => (session ? [...session.steps].sort((a, b) => a.t - b.t) : []),
    [session],
  );

  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(1);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(0);
  const [narrationOn, setNarrationOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const visibleRef = useRef(0);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setPlaying(false);
    setVisible(0);
    visibleRef.current = 0;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [clearTimers]);

  useEffect(() => {
    reset();
  }, [sessionId, session, reset]);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  /** Always stop narration on unmount so audio cannot outlive the panel. */
  useEffect(() => {
    return () => {
      const el = audioRef.current;
      if (el) {
        el.pause();
        el.currentTime = 0;
      }
    };
  }, []);

  /** Drive playback; `speed` in deps re-schedules from current `visibleRef` without resetting position. */
  useEffect(() => {
    if (!playing || !session) {
      clearTimers();
      return;
    }

    if (sortedSteps.length === 0) {
      setPlaying(false);
      return;
    }

    clearTimers();

    const scheduleChain = (currentVisible: number) => {
      if (currentVisible === 0) {
        setVisible(1);
        visibleRef.current = 1;
        scheduleChain(1);
        return;
      }
      if (currentVisible >= sortedSteps.length) {
        setPlaying(false);
        return;
      }
      const lastIdx = currentVisible - 1;
      if (lastIdx >= sortedSteps.length - 1) {
        setPlaying(false);
        return;
      }
      const delay = (sortedSteps[lastIdx + 1].t - sortedSteps[lastIdx].t) / speedRef.current;
      const id = window.setTimeout(() => {
        const next = currentVisible + 1;
        setVisible(next);
        visibleRef.current = next;
        scheduleChain(next);
      }, Math.max(40, delay));
      timeoutsRef.current.push(id);
    };

    scheduleChain(visibleRef.current);

    return () => clearTimers();
  }, [playing, session, speed, clearTimers, sortedSteps]);

  useEffect(() => {
    if (!session?.narrationUrl) {
      setNarrationOn(false);
      return;
    }
    const el = audioRef.current ?? new Audio(session.narrationUrl);
    audioRef.current = el;
    el.src = session.narrationUrl;
    if (narrationOn && playing) {
      void el.play().catch(() => setNarrationOn(false));
    } else {
      el.pause();
    }

    return () => {
      el.pause();
      el.currentTime = 0;
    };
  }, [session, narrationOn, playing]);

  if (!session) {
    return <p className="text-on-surface-variant font-body text-sm">No replay sessions configured.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:justify-between">
        <div className="min-w-0 flex-1">
          <label htmlFor="replay-session" className="text-xs font-body font-semibold text-on-surface-variant uppercase tracking-widest block mb-2">
            Session
          </label>
          <select
            id="replay-session"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="w-full max-w-xl bg-surface-container-low rounded-xl px-4 py-3 font-body text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/25"
          >
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
          <p className="mt-3 text-on-surface-variant font-body text-sm leading-relaxed max-w-2xl">{session.summary}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (playing) {
                setPlaying(false);
                return;
              }
              if (visible >= sortedSteps.length) {
                setVisible(0);
                visibleRef.current = 0;
              }
              setPlaying(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-body text-xs font-semibold uppercase tracking-wider shadow-ambient hover:opacity-90"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
            {playing ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-low text-on-surface font-body text-xs font-semibold uppercase tracking-wider border border-primary/15"
          >
            <RotateCcw size={16} /> Reset
          </button>
          {session.narrationUrl && (
            <button
              type="button"
              onClick={() => setNarrationOn((v) => !v)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-body text-xs font-semibold uppercase tracking-wider border ${
                narrationOn ? 'border-primary text-primary bg-primary/10' : 'border-transparent bg-surface-container text-on-surface-variant'
              }`}
            >
              {narrationOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
              Narration
            </button>
          )}
        </div>
      </div>

      <div>
        <span className="text-xs font-body font-semibold text-on-surface-variant uppercase tracking-widest block mb-2">
          Speed
        </span>
        <div className="flex flex-wrap gap-2">
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={`px-4 py-2 rounded-full text-xs font-body font-semibold transition-colors ${
                speed === s ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:text-primary'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <div
        className="rounded-[1.25rem] bg-surface-container-lowest/50 border border-primary/15 p-4 sm:p-5 min-h-[200px] max-h-[340px] overflow-y-auto scrollbar-custom font-mono text-[11px] sm:text-xs space-y-2"
        role="log"
        aria-live="polite"
      >
        {sortedSteps.slice(0, visible).map((step, idx) => (
          <div
            key={`${step.t}-${idx}`}
            className={`border-l-2 pl-3 py-1.5 ${KIND_CLASS[step.kind]}`}
          >
            <span className="text-[10px] uppercase tracking-wider opacity-70 mr-2">{step.kind}</span>
            <span className="whitespace-pre-wrap">{step.text}</span>
          </div>
        ))}
        {visible === 0 && <p className="text-on-surface-variant font-body">Press play to stream the build transcript.</p>}
      </div>
    </div>
  );
}
