"use client";

import { motion, useReducedMotion } from "framer-motion";

const shapes = [
  {
    id: "stripe",
    className:
      "absolute left-1/2 top-12 h-[3px] w-[420px] -translate-x-1/2 bg-[var(--color-magenta)] flux-line opacity-60",
    animate: { x: [0, 12, -12, 0] },
  },
  {
    id: "disk",
    className:
      "absolute -right-20 top-[18%] h-40 w-40 rotate-[12deg] border-4 border-[var(--color-ink)] bg-[var(--color-cyan)] brutal-shadow opacity-30",
    animate: { rotate: [8, 12, 6, 8] },
  },
  {
    id: "block",
    className:
      "absolute -left-16 bottom-[14%] h-48 w-32 -rotate-[6deg] border-4 border-[var(--color-ink)] bg-[var(--color-yellow)] brutal-shadow opacity-30",
    animate: { y: [0, -18, 0, 14, 0] },
  },
];

export function BackgroundFlux() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          aria-hidden
          className={shape.className}
          animate={prefersReducedMotion ? undefined : shape.animate}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(230,0,126,0.1),_transparent_60%)]"
        animate={prefersReducedMotion ? undefined : { opacity: [0.4, 0.55, 0.35, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

