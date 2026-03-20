import React, { useState, useEffect } from 'react';

export const HexClock = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours().toString(16).toUpperCase().padStart(2, '0');
      const m = now.getMinutes().toString(16).toUpperCase().padStart(2, '0');
      const s = now.getSeconds().toString(16).toUpperCase().padStart(2, '0');
      setTime(`0x${h}:${m}:${s}`);
    };
    const timer = setInterval(update, 1000);
    update();
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-mono text-xs text-primary px-3 py-1.5 rounded-full bg-surface-container-lowest/70 backdrop-blur-sm border border-white/40 shadow-ambient">
      <span className="text-on-surface-variant mr-1.5 font-body text-[10px] uppercase tracking-wider">Time</span>
      {time}
    </div>
  );
};
