import { useMemo, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Box, Zap } from 'lucide-react';
import { useGitHubContributions } from '../../hooks/useGitHub';

const LEVEL_COLORS = [
  'var(--heatmap-0)',
  'var(--heatmap-1)',
  'var(--heatmap-2)',
  'var(--heatmap-3)',
  'var(--heatmap-4)',
];

const LEVEL_SHADOWS = [
  'none',
  'var(--heatmap-shadow-1)',
  'var(--heatmap-shadow-2)',
  'var(--heatmap-shadow-3)',
  'var(--heatmap-shadow-4)',
];

function voxelDisplayLevel(day: { level: number; count: number }) {
  if (day.count <= 0) return 0;
  return Math.max(day.level, 1);
}

function voxelFill(day: { level: number; color?: string }) {
  return day.color ?? LEVEL_COLORS[day.level] ?? LEVEL_COLORS[0];
}

export function VisualContributionHeatmap() {
  const { contributions, loading, error } = useGitHubContributions();
  const [hovered, setHovered] = useState<{ date: string; count: number } | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 120 };
  const rotateX = useSpring(useTransform(mouseY, [0, 500], [8, -4]), springConfig);
  const rotateZ = useSpring(useTransform(mouseX, [0, 1000], [-6, 6]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const displayWeeks = useMemo(() => {
    if (!contributions?.weeks?.length) return [];
    return contributions.weeks.slice(-14);
  }, [contributions]);

  if (loading || !contributions) {
    return (
      <div className="p-5 rounded-2xl glass-panel h-full min-h-[220px] flex items-center justify-center">
        <div className="text-xs text-primary font-body font-semibold uppercase tracking-widest animate-pulse flex items-center gap-2">
          <Zap size={12} /> Loading grid…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 rounded-2xl glass-panel h-full min-h-[220px] flex items-center justify-center">
        <div className="text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest">
          Grid unavailable
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl glass-panel h-full relative overflow-hidden flex flex-col group min-h-[220px]">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 bg-[length:20px_20px]"
          style={{
            backgroundImage:
              'linear-gradient(to right, var(--heatmap-grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--heatmap-grid-line) 1px, transparent 1px)',
          }}
        />
      </div>

      <div className="flex items-center justify-between gap-4 mb-5 relative z-10">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest group-hover:text-primary transition-colors">
          <Box size={14} className="text-primary" /> 3D activity
        </div>
      </div>

      {hovered && (
        <motion.div
          className="fixed z-[100] pointer-events-none px-3 py-2 glass-panel rounded-xl shadow-ambient"
          style={{
            left: mouseX,
            top: mouseY,
            x: '-50%',
            y: '-120%',
          }}
        >
          <div className="text-xs font-body whitespace-nowrap leading-tight">
            <div className="text-on-surface font-medium mb-0.5">{hovered.date}</div>
            <div className="text-primary font-semibold">{hovered.count} contributions</div>
          </div>
        </motion.div>
      )}

      <div className="flex-1 flex items-center justify-center p-4 relative">
        <motion.div
          className="relative"
          style={{
            perspective: 1200,
            rotateX,
            rotateZ,
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="grid grid-flow-col gap-1.5" style={{ transformStyle: 'preserve-3d' }}>
            {displayWeeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1.5" style={{ transformStyle: 'preserve-3d' }}>
                {week.map((day, dayIndex) => {
                  const L = voxelDisplayLevel(day);
                  const height = Math.max(4, L * 16);
                  const fill = voxelFill(day);
                  return (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      initial={{ height: 4 }}
                      animate={{
                        height,
                        backgroundColor: fill,
                        boxShadow: LEVEL_SHADOWS[L],
                      }}
                      onMouseEnter={() => setHovered({ date: day.date, count: day.count })}
                      onMouseLeave={() => setHovered(null)}
                      transition={{
                        delay: (weekIndex * 7 + dayIndex) * 0.004,
                        duration: 0.6,
                        type: 'spring',
                        stiffness: 60,
                        damping: 16,
                      }}
                      className="w-[10px] relative transition-filters group/voxel cursor-crosshair rounded-[2px]"
                      style={{
                        transformStyle: 'preserve-3d',
                        transformOrigin: 'bottom',
                      }}
                    >
                      <div
                        className="absolute top-0 left-0 w-full h-[10px] rounded-[2px]"
                        style={{
                          backgroundColor: fill,
                          transform: 'translateY(-4px) rotateX(90deg)',
                          boxShadow: LEVEL_SHADOWS[L],
                          filter: 'brightness(1.15)',
                        }}
                      >
                        <div className="absolute inset-0 bg-white/25 opacity-0 group-hover/voxel:opacity-50 transition-opacity rounded-[2px]" />
                      </div>
                      <div
                        className="absolute top-0 left-0 h-full w-[10px] rounded-[2px]"
                        style={{
                          backgroundColor: fill,
                          transform: 'translateX(-4px) rotateY(90deg)',
                          filter: 'brightness(0.88)',
                        }}
                      />
                      <div
                        className="absolute top-0 right-0 h-full w-[10px] rounded-[2px]"
                        style={{
                          backgroundColor: fill,
                          transform: 'translateX(4px) rotateY(90deg)',
                          filter: 'brightness(0.95)',
                        }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-3 flex justify-between items-center relative z-10">
        <div className="text-[10px] text-on-surface-variant/80 font-body uppercase tracking-widest">GitHub</div>
        <div className="flex gap-0.5">
          {LEVEL_COLORS.map((c, i) => (
            <div key={i} className="w-1 h-1 rounded-full" style={{ backgroundColor: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}
