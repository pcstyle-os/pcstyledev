import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Github, ArrowRight } from 'lucide-react';
import { SeoHire } from '../components/Seo';
import { HIRE_FAQ, SITE_ORIGIN } from '../lib/seo';

const LAST_UPDATED = '2026-03-20';

export const Hire = () => {
  return (
    <div className="max-w-3xl mx-auto py-6 md:py-16 animate-fadeIn">
      <SeoHire />

      <article>
        <p className="font-body text-primary font-semibold tracking-widest uppercase text-xs mb-4">
          Frontend design &amp; UI engineering
        </p>
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl text-on-surface mb-6 leading-tight tracking-tight">
          Hire <span className="text-primary italic">Adam Krupa</span> for interfaces developers want to ship
        </h1>
        <p className="text-on-surface-variant font-body text-lg leading-relaxed mb-4">
          Adam Krupa is a frontend designer and UI engineer based in Poland (student at Politechnika Częstochowska).
          He works at the intersection of editorial layout, React implementation, and performance so product teams
          get interfaces that are legible in production—not only in mockups.
        </p>
        <p className="font-body text-sm text-on-surface-variant mb-10">
          Last updated: <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time> · Primary site:{' '}
          <a href={SITE_ORIGIN} className="text-primary hover:underline">
            pcstyle.dev
          </a>
        </p>

        <div className="flex flex-wrap gap-4 mb-16">
          <a
            href="mailto:AdamKrupa@Tuta.io"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full editorial-gradient text-on-primary font-body text-sm font-semibold shadow-ambient hover:opacity-90 transition-opacity"
          >
            <Mail size={18} /> Email AdamKrupa@Tuta.io
          </a>
          <a
            href="https://github.com/pc-style"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass-panel text-on-surface font-body text-sm font-semibold hover:bg-surface-container-lowest/80 transition-colors"
          >
            <Github size={18} /> GitHub
          </a>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-primary/25 text-primary font-body text-sm font-semibold hover:bg-primary/10 transition-colors"
          >
            View portfolio <ArrowRight size={18} />
          </Link>
        </div>

        <h2 className="font-headline text-2xl sm:text-3xl text-on-surface mb-4 tracking-tight">What &ldquo;frontend design&rdquo; means here</h2>
        <p className="text-on-surface-variant font-body leading-relaxed mb-4">
          Many teams search for a <strong className="text-on-surface font-medium">frontend designer</strong> when they
          need someone who can translate product intent into a system of components, states, and responsive layouts that
          React (or similar stacks) can own long term. That is the core offer: pairing visual direction with
          implementation detail—spacing scales, focus rings, loading patterns, and how typography behaves between
          breakpoints.
        </p>
        <p className="text-on-surface-variant font-body leading-relaxed mb-10">
          According to the{' '}
          <a
            href="https://www.w3.org/WAI/WCAG22/quickref/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            WCAG 2.2 quick reference
          </a>
          , accessibility is a set of testable criteria; Adam treats those criteria as design constraints up front (color
          contrast, keyboard paths, motion preferences) rather than as a late audit.
        </p>

        <h2 className="font-headline text-2xl sm:text-3xl text-on-surface mb-4 tracking-tight">Stack and collaboration</h2>
        <p className="text-on-surface-variant font-body leading-relaxed mb-4">
          Day-to-day work leans on <strong className="text-on-surface font-medium">React</strong> and{' '}
          <strong className="text-on-surface font-medium">TypeScript</strong>, modern CSS, and design tokens when the
          team has them. Adam is comfortable reading API contracts and Git history, documenting components for other
          developers, and aligning with design tools (Figma and similar) without letting the handoff become a bottleneck.
        </p>
        <p className="text-on-surface-variant font-body leading-relaxed mb-10">
          For a live sample of how he structures a public surface, see the open portfolio source at{' '}
          <a
            href="https://github.com/pc-style/pcstyledev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            github.com/pc-style/pcstyledev
          </a>
          —it demonstrates animation restraint, API-backed sections, and a cohesive visual language.
        </p>

        <h2 className="font-headline text-2xl sm:text-3xl text-on-surface mb-4 tracking-tight">Process in four beats</h2>
        <ol className="list-decimal pl-6 space-y-3 text-on-surface-variant font-body leading-relaxed mb-10">
          <li>
            <strong className="text-on-surface">Discover</strong> — goals, users, constraints, and what &ldquo;done&rdquo;
            looks like for engineering.
          </li>
          <li>
            <strong className="text-on-surface">Structure</strong> — IA, key flows, and a component map tied to routes or
            features.
          </li>
          <li>
            <strong className="text-on-surface">Design &amp; build</strong> — high-fidelity UI in vertical slices with
            performance and accessibility checks alongside visuals.
          </li>
          <li>
            <strong className="text-on-surface">Handoff &amp; iteration</strong> — documentation, cleanup, and measured
            follow-up after release.
          </li>
        </ol>

        <h2 className="font-headline text-2xl sm:text-3xl text-on-surface mb-4 tracking-tight">FAQ</h2>
        <dl className="space-y-8 mb-16">
          {HIRE_FAQ.map((item) => (
            <div key={item.question}>
              <dt className="font-headline text-lg text-on-surface mb-2">{item.question}</dt>
              <dd className="text-on-surface-variant font-body leading-relaxed">{item.answer}</dd>
            </div>
          ))}
        </dl>

        <section className="editorial-gradient rounded-[2rem] p-10 sm:p-12 text-center relative overflow-hidden">
          <h2 className="font-headline text-2xl sm:text-3xl text-on-primary mb-4 tracking-tight">Ready to talk?</h2>
          <p className="text-on-primary/90 font-body mb-8 max-w-lg mx-auto">
            Mention timeline, stack, and whether you need design-only, build-only, or an end-to-end UI pass.
          </p>
          <a
            href="mailto:AdamKrupa@Tuta.io?subject=Frontend%20design%20inquiry"
            className="inline-flex justify-center bg-on-primary text-primary px-10 py-4 rounded-full font-body font-bold text-base hover:bg-surface-container-lowest transition-colors shadow-ambient"
          >
            Start a conversation
          </a>
        </section>
      </article>
    </div>
  );
};
