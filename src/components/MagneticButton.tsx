"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

type MagneticButtonProps = {
  children: React.ReactNode;
  className?: string;
  strength?: number; // jak bardzo przyciąga, 0-1
  onClick?: () => void;
};

// magnetic effect — elementy przyciągają kursor jak ma hover
export function MagneticButton({
  children,
  className = "",
  strength = 0.3,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const disableMagnet = shouldReduceMotion || isMobile;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || disableMagnet) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // apply magnetic pull
    x.set(distanceX * strength);
    y.set(distanceY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      className={`focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-magenta)] ${className}`.trim()}
      style={{ x: disableMagnet ? 0 : springX, y: disableMagnet ? 0 : springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={disableMagnet ? undefined : { scale: 1.05 }}
      whileTap={disableMagnet ? undefined : { scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}
