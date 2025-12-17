export const createSynth = () => {
  if (typeof window === 'undefined') return null;
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 64; // Low res for retro feel
  analyser.connect(ctx.destination);

  const playBlip = (freq = 440, type: OscillatorType = 'square', duration = 0.1, vol = 0.05) => {
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(analyser); // Route through analyser
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  return { playBlip, ctx, analyser };
};

export interface Synth {
    playBlip: (freq?: number, type?: OscillatorType, duration?: number, vol?: number) => void;
    ctx: AudioContext;
    analyser: AnalyserNode;
}