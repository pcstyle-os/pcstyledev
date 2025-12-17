import React, { useState, useEffect, useMemo } from 'react';

export const KernelLog = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const lines = useMemo(() => [
    "IO_REQUEST: FETCH_ARTIFACT_NODE_0x21",
    "NET_STAT: ESTABLISHED_UPLINK_ENCRYPTED",
    "MEM_ALLOC: PIXEL_FORGE_BUFFER_ALLOCATED",
    "SECURITY_SCAN: FIREWALL_PASS_TRUE",
    "OS_KERNEL: STABLE_V2_PROXIMITY_ALERT",
    "UI_RENDER: GLITCH_PASS_01_COMPLETE",
    "DRIFT_FIELD_STATUS: OFFLINE"
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => [...prev.slice(-14), lines[Math.floor(Math.random() * lines.length)]]);
    }, 2000);
    return () => clearInterval(interval);
  }, [lines]);

  return (
    <div className="fixed top-24 left-6 z-0 hidden xl:block opacity-20 font-mono text-[9px] text-[#ff00ff] space-y-1 select-none pointer-events-none">
      {logs.map((log, i) => (
        <div key={i} className="flex gap-2">
          <span className="opacity-40">[{Math.random().toString(36).substring(7)}]</span>
          <span>{log}</span>
        </div>
      ))}
    </div>
  );
};