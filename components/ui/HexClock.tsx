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
    <div className="font-mono text-xs text-[#ff00ff] border border-[#ff00ff]/30 px-2 py-1 bg-black/50 backdrop-blur-sm">
      <span className="opacity-50 mr-1">SYS_TIME:</span>
      {time}
    </div>
  );
};