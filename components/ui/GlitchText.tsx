import React, { useState, useCallback } from 'react';

export const GlitchText = ({ text }: { text: string }) => {
  const [display, setDisplay] = useState(text || '');
  const chars = "!<>-_\\/[]{}—=+*^?#________";
  
  const glitch = useCallback(() => {
    if (!text) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(prev => 
        text.split("").map((char, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1/3;
    }, 30);
  }, [text, chars]);

  return <span onMouseEnter={glitch} className="cursor-none">{display}</span>;
};