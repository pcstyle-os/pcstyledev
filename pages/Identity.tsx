import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Lock, Unlock } from 'lucide-react';
import { WakaTimeSummaryCard } from '../components/ui/WakaTimeSummaryCard';
import { GitHubRecentReposSection } from '../components/ui/GitHubRecentReposSection';
import { SeoIdentity } from '../components/Seo';

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
      <SeoIdentity />

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

        <div className="order-1 lg:order-2 lg:pl-2">
          <span className="font-body text-on-surface-variant/80 font-medium tracking-[0.2em] uppercase text-[11px] mb-5 block">
            About
          </span>
          <h1 className="mb-6 max-w-lg">
            <span className="block font-headline text-4xl sm:text-5xl md:text-[2.75rem] lg:text-6xl text-on-surface leading-[1.08] tracking-tight">
              Adam Krupa
            </span>
            <span className="mt-3 block font-headline text-lg sm:text-xl text-on-surface-variant font-light italic leading-snug">
              Frontend designer <span className="text-on-surface-variant/45 not-italic mx-1.5">·</span> UI engineer
              <span className="text-on-surface-variant/45 not-italic mx-1.5">·</span>{' '}
              <span className="text-on-surface/85 not-italic font-body text-[0.95em] font-normal tracking-normal">
                pcstyle.dev
              </span>
            </span>
          </h1>
          <p className="font-body text-on-surface-variant text-[15px] sm:text-base leading-relaxed mb-8 max-w-lg">
            I build interfaces and tools with an emphasis on clarity, performance, and privacy-first engineering.
            Open to collaboration — see the{' '}
            <Link to="/hire" className="text-on-surface underline decoration-primary/40 underline-offset-4 hover:decoration-primary transition-colors">
              hire page
            </Link>{' '}
            for how I work.
          </p>
          <figure className="mb-8 max-w-lg border-l-2 border-primary/35 pl-5 py-0.5">
            <blockquote className="font-headline text-lg sm:text-xl text-on-surface-variant/90 font-light leading-relaxed italic">
              Spaces for the <span className="text-primary/90 not-italic">immaterial</span>.
            </blockquote>
          </figure>
          <div className="space-y-5 text-on-surface-variant font-body text-base sm:text-[17px] leading-relaxed">
            <p>
              First-year AI student at{' '}
              <span className="text-on-surface font-medium">Politechnika Częstochowska</span>. I build tools,
              interfaces, and systems with an eye for clarity and performance.
            </p>
            <p className="text-on-surface-variant/90">
              Privacy-first engineering and deliberate, breathable layouts — interfaces that stay out of the way.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-12">
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
              rel="noopener noreferrer"
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
                rel="noopener noreferrer"
                className="inline-flex justify-center border border-on-primary/35 text-on-primary px-10 py-4 rounded-full font-body font-bold text-base hover:bg-on-primary/10 transition-colors backdrop-blur-sm"
              >
                View archives
              </a>
            </div>
          </div>
        </div>
      </section>

      <GitHubRecentReposSection />

      <WakaTimeSummaryCard />
    </div>
  );
};
