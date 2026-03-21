import React, { useEffect, useRef } from 'react';
import { Synth } from '../../utils/audio';
import { usePerformanceMode } from '../../hooks/usePerformanceMode';

export const AudioVisualizer = ({ synth, isActive }: { synth: Synth | null; isActive: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isLowPerformance = usePerformanceMode();

  useEffect(() => {
    if (!synth || !canvasRef.current || !isActive || isLowPerformance) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = synth.analyser;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let animationId: number;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2;
      let barHeight;
      let x = 0;

      const rgb =
        typeof document !== 'undefined' && document.documentElement.dataset.skin === 'artifact'
          ? '255, 0, 255'
          : '70, 101, 97';
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 4;
        ctx.fillStyle = `rgba(${rgb}, ${dataArray[i] / 320})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [synth, isActive, isLowPerformance]);

  if (!isActive) {
    return (
      <div className="h-8 w-20 rounded-full bg-surface-container flex items-center justify-center opacity-60">
        <div className="w-3/4 h-px bg-on-surface-variant/25 rounded-full" />
      </div>
    );
  }

  return <canvas ref={canvasRef} width={80} height={32} className="opacity-90 w-20 h-8 rounded-md" />;
};
