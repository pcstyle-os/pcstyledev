import { useMemo, useState } from 'react';
import { Calendar } from 'lucide-react';
import { motion, useMotionValue } from 'framer-motion';
import { useGitHubContributions } from '../../hooks/useGitHub';

const LEVEL_CLASS = [
  'bg-surface-variant',
  'bg-primary/15',
  'bg-primary/30',
  'bg-primary/55',
  'bg-primary',
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function ContributionHeatmap() {
  const { contributions, loading, error } = useGitHubContributions();
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    x?: number;
    y?: number;
    isKeyboard?: boolean;
  } | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const displayWeeks = useMemo(() => {
    if (!contributions?.weeks?.length) return [];
    return contributions.weeks.slice(-17);
  }, [contributions]);

  const monthLabels = useMemo(() => {
    if (!displayWeeks.length) return [];

    const labels: { month: string; col: number }[] = [];
    let lastMonth = -1;

    displayWeeks.forEach((week, weekIndex) => {
      if (week.length > 0) {
        const date = new Date(week[0].date);
        const month = date.getMonth();
        if (month !== lastMonth) {
          labels.push({ month: MONTHS[month], col: weekIndex });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [displayWeeks]);

  if (loading) {
    return (
      <div className="p-5 rounded-2xl glass-panel overflow-hidden h-full min-h-[200px]">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-primary font-body font-semibold uppercase tracking-widest animate-pulse">
            Loading activity…
          </div>
        </div>
        <div className="flex gap-[2px] opacity-30 h-[82px] overflow-hidden">
          {Array.from({ length: 13 }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[2px]">
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <div key={dayIndex} className="w-[10px] h-[10px] bg-surface-container rounded-sm animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !contributions) {
    return (
      <div className="p-5 rounded-2xl glass-panel h-full min-h-[200px] flex items-center">
        <div className="text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest">
          Contributions unavailable
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-5 rounded-2xl glass-panel h-full relative min-h-[200px]"
      onMouseMove={(e) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }}
    >
      {hoveredDay && (
        <motion.div
          className="fixed z-[100] pointer-events-none px-3 py-2 glass-panel rounded-xl shadow-ambient"
          style={{
            left: hoveredDay.isKeyboard ? hoveredDay.x : mouseX,
            top: hoveredDay.isKeyboard ? hoveredDay.y : mouseY,
            x: '-50%',
            y: '-120%',
          }}
        >
          <div className="text-xs font-body whitespace-nowrap leading-tight">
            <div className="text-on-surface font-medium mb-0.5">{hoveredDay.date}</div>
            <div className="text-primary font-semibold">{hoveredDay.count} contributions</div>
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body font-semibold uppercase tracking-widest">
          <Calendar size={14} className="text-primary" /> Last ~120 days
        </div>
        <span className="text-xs text-on-surface-variant font-body">{contributions.totalContributions} total</span>
      </div>

      <div className="relative group">
        <div className="flex gap-2">
          <div className="flex flex-col gap-[2px] pt-[20px]">
            {['', 'M', '', 'W', '', 'F', ''].map((day, i) => (
              <span
                key={i}
                className="text-[7px] h-[10px] flex items-center text-on-surface-variant/70 font-body uppercase leading-none"
              >
                {day}
              </span>
            ))}
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="overflow-x-auto scrollbar-custom pb-1">
              <div className="w-fit">
                <div className="h-4 relative mb-1 w-full">
                  {monthLabels.map(({ month, col }) => (
                    <span
                      key={`${month}-${col}`}
                      className="text-[8px] text-on-surface-variant/80 font-body uppercase absolute"
                      style={{ left: `${col * 12}px` }}
                    >
                      {month}
                    </span>
                  ))}
                </div>

                <div className="flex gap-[2px]">
                  {displayWeeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-[2px]">
                      {week.map((day, dayIndex) => (
                        <motion.div
                          key={`${weekIndex}-${dayIndex}`}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: (weekIndex * 7 + dayIndex) * 0.002,
                            duration: 0.3,
                          }}
                          role="img"
                          tabIndex={0}
                          aria-label={`${day.date}: ${day.count} contributions`}
                          className={`w-[10px] h-[10px] rounded-[2px] ${LEVEL_CLASS[day.level] || LEVEL_CLASS[0]} transition-transform hover:scale-150 focus:scale-150 focus:outline-none focus:ring-2 focus:ring-primary/30 relative outline-none`}
                          onMouseEnter={() => setHoveredDay({ date: day.date, count: day.count, isKeyboard: false })}
                          onMouseLeave={() => setHoveredDay(null)}
                          onFocus={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredDay({
                              date: day.date,
                              count: day.count,
                              x: rect.left + rect.width / 2,
                              y: rect.top,
                              isKeyboard: true,
                            });
                          }}
                          onBlur={() => setHoveredDay(null)}
                        />
                      ))}
                      {week.length < 7 &&
                        Array.from({ length: 7 - week.length }).map((_, i) => (
                          <div key={`empty-${i}`} className="w-[10px] h-[10px] bg-transparent" />
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 ml-5">
          <span className="text-[7px] text-on-surface-variant/70 uppercase font-body">Less</span>
          <div className="flex gap-[2px]">
            {LEVEL_CLASS.map((color, i) => (
              <div key={i} className={`w-[8px] h-[8px] rounded-[2px] ${color}`} />
            ))}
          </div>
          <span className="text-[7px] text-on-surface-variant/70 uppercase font-body">More</span>
        </div>
      </div>
    </div>
  );
}
