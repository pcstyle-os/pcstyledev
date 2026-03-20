import React, { useState } from 'react';
import { Github, Lock, Unlock } from 'lucide-react';
import { WakaTimeSummaryCard } from '../components/ui/WakaTimeSummaryCard';
import { FutureMemoryTimeline } from '../components/ui/FutureMemoryTimeline';

export const Identity = () => {
  const [decrypted, setDecrypted] = useState(false);
  const [emailText, setEmailText] = useState('Click to reveal');

  const handleDecrypt = () => {
    if (decrypted) return;
    const target = 'AdamKrupa@Tuta.io';
    const chars = '·∘○◦░▒';
    let iterations = 0;

    const interval = setInterval(() => {
      setEmailText(
        target
          .split('')
          .map((c, i) => {
            if (i < iterations) return target[i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join(''),
      );

      if (iterations >= target.length) {
        clearInterval(interval);
        setDecrypted(true);
      }
      iterations += 1 / 2;
    }, 45);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 md:py-16 animate-fadeIn">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-20 lg:mb-28">
        <div className="relative order-2 lg:order-1">
          <div className="relative z-10 glass-panel p-1 rounded-[2.5rem] overflow-hidden">
            <img
              src="/pfp.png"
              alt="Adam Krupa"
              className="w-full h-auto rounded-[2.35rem] grayscale hover:grayscale-0 transition-all duration-700 object-cover aspect-square max-h-[480px] object-top"
            />
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-52 h-52 bg-secondary-container/30 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="order-1 lg:order-2">
          <span className="font-body text-primary font-semibold tracking-widest uppercase text-xs mb-6 block">
            Foundations
          </span>
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl text-on-surface mb-8 leading-tight tracking-tight">
            Spaces for the <span className="italic text-primary font-light">immaterial</span>.
          </h1>
          <div className="space-y-6 text-on-surface-variant font-body text-lg leading-relaxed font-light">
            <p>
              First-year AI student at{' '}
              <span className="text-on-surface font-medium">Politechnika Częstochowska</span>. I build tools,
              interfaces, and systems with an eye for clarity and performance.
            </p>
            <p>Privacy-first engineering and deliberate, breathable layouts — interfaces that stay out of the way.</p>
          </div>

          <div className="flex flex-wrap gap-4 mt-10">
            <button
              type="button"
              onClick={handleDecrypt}
              className={`inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-body text-sm font-semibold transition-all ${
                decrypted
                  ? 'bg-primary text-on-primary'
                  : 'glass-panel text-on-surface hover:bg-surface-container-lowest/80'
              }`}
            >
              {decrypted ? <Unlock size={18} /> : <Lock size={18} />}
              {decrypted ? (
                <a href={`mailto:${emailText}`} className="break-all">
                  {emailText}
                </a>
              ) : (
                <span>Reveal email</span>
              )}
            </button>
            <a
              href="https://github.com/pc-style"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-surface-container text-on-surface font-body text-sm font-semibold hover:bg-surface-variant transition-colors"
            >
              <Github size={18} /> GitHub
            </a>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="editorial-gradient rounded-[2.5rem] p-10 sm:p-16 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="font-headline text-3xl sm:text-5xl md:text-6xl text-on-primary mb-8 tracking-tight">
              Let&apos;s create <br />
              <span className="italic font-light">something light.</span>
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="mailto:AdamKrupa@Tuta.io"
                className="inline-flex justify-center bg-on-primary text-primary px-10 py-4 rounded-full font-body font-bold text-base hover:bg-surface-container-lowest transition-colors shadow-ambient"
              >
                Start a conversation
              </a>
              <a
                href="https://github.com/pc-style/pcstyledev"
                target="_blank"
                rel="noreferrer"
                className="inline-flex justify-center border border-on-primary/35 text-on-primary px-10 py-4 rounded-full font-body font-bold text-base hover:bg-on-primary/10 transition-colors backdrop-blur-sm"
              >
                View archives
              </a>
            </div>
          </div>
        </div>
      </section>

      <FutureMemoryTimeline />

      <WakaTimeSummaryCard />
    </div>
  );
};
