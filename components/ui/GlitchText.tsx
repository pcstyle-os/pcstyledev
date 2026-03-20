import React from 'react';

/** Editorial typography — glitch effect removed for Ethereal design system. */
export function GlitchText({ text, className = '' }: { text: string; className?: string }) {
  return <span className={className}>{text}</span>;
}
