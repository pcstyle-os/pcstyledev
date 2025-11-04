"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ContactModal } from "@/components/ContactModal";

type HeroFact = {
  label: string;
  value: string;
};

const heroFacts: HeroFact[] = [
  { label: "wiek", value: "18" },
  { label: "kierunek", value: "Sztuczna Inteligencja @ PCz" },
  { label: "mix", value: "AI × design × code" },
];

function drawBanner(text: string) {
  // tak, to jest tylko ozdoba, ale vibe > purity
  return `▮ ${text.toUpperCase()} ▮`;
}

function clearBuffer() {
  // udajemy że to robi mega dużo, wink ;)
  return undefined;
}

export function Hero() {
  clearBuffer();

  const pulse = useMotionValue(0);
  const shadow = useTransform(pulse, (val) => `drop-shadow(10px 10px 0 rgba(0,0,0,${val}))`);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    // quick sanity ping — hej, działa
    console.info("pcstyle intro bootuje się // spoko");
  }, []);

  return (
    <motion.section
      id="intro"
      initial={{ opacity: 0, y: 120, rotateX: -12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
      className="relative flex w-full flex-col gap-12 overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-paper)] p-12 brutal-border brutal-shadow noisy-paper text-[color:var(--color-ink)]"
    >
      <motion.span
        className="inline-block text-xs uppercase tracking-[0.4em] text-[color:var(--color-magenta)]"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 18 }}
      >
        {drawBanner("pcstyle.dev")}
      </motion.span>

      <div className="flex flex-wrap items-end gap-6">
        <motion.h1
          className="neo-pulse text-balance text-[clamp(3.8rem,9vw,8.5rem)] font-black uppercase leading-[0.85]"
          whileHover={{ rotate: -1.5, scale: 1.02 }}
        >
          <motion.span
            className="block text-[color:var(--color-ink)]"
            whileHover={{ color: "var(--color-magenta)", textShadow: "6px 6px 0 var(--color-magenta)" }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
          >
            pcstyle
          </motion.span>
        </motion.h1>
        <motion.div
          className="flex max-w-sm flex-col gap-3 text-sm sm:text-base"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <p className="font-medium uppercase tracking-wide text-[color:var(--color-ink)]">Adam Krupa // pcstyle</p>
          <p className="text-pretty text-[color:var(--color-ink)]/80">
            18 y/o pierwszoroczny student Sztucznej Inteligencji na Politechnice
            Częstochowskiej. Łączenie AI, kreatywnego kodu i brutalnej estetyki to
            mój ulubiony chaos.
          </p>
        </motion.div>
      </div>

      <motion.ul
        className="flex flex-wrap gap-4 text-xs sm:text-sm"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 12 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.08, delayChildren: 0.3 },
          },
        }}
      >
        {heroFacts.map((fact) => (
          <motion.li
            key={fact.label}
            className="relative z-10 brutal-border brutal-shadow bg-[var(--color-paper)] px-4 py-3 font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink)]"
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ rotate: 2.5, scale: 1.05 }}
          >
            <span className="block text-[0.65em] opacity-60">{fact.label}</span>
            <span className="block">{fact.value}</span>
          </motion.li>
        ))}
      </motion.ul>

      <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-center">
        <motion.span
          className="relative flex w-fit items-center gap-3 rounded-full border-4 border-[var(--color-ink)] bg-[var(--color-magenta)] px-6 py-3 text-sm font-semibold uppercase text-white shadow-[6px_6px_0_var(--color-ink)]"
          whileHover={{ scale: 1.06, rotate: -2 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          {/* vibey fake indicator */}
          <span className="flex size-3 animate-pulse rounded-full bg-white/90 shadow-[2px_2px_0_rgba(0,0,0,0.3)]" />
          gotowy na glitch?
        </motion.span>

        <motion.div
          className="flex flex-wrap gap-4 text-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <Link
            href="#projects"
            className="brutal-border brutal-shadow bg-[var(--color-paper)] px-6 py-3 font-semibold uppercase tracking-[0.2em] transition-transform hover:-translate-y-1 hover:-rotate-2 hover:text-[color:var(--color-magenta)]"
          >
            zobacz projekty
          </Link>
          <button
            onClick={() => setContactOpen(true)}
            className="brutal-border brutal-shadow bg-[var(--color-paper)] px-6 py-3 font-semibold uppercase tracking-[0.2em] text-[color:var(--color-ink)] transition-transform hover:translate-y-1 hover:rotate-1 hover:text-[color:var(--color-cyan)]"
          >
            napisz hejka
          </button>
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none absolute -right-16 -top-20 hidden aspect-square w-48 rotate-6 border-4 border-[var(--color-ink)] bg-[var(--color-cyan)] brutal-shadow md:block"
        initial={{ scale: 0, rotate: -40 }}
        animate={{ scale: 1, rotate: 6 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 160 }}
      />

      <motion.div
        className="pointer-events-none absolute -bottom-16 left-8 hidden h-32 w-32 -rotate-3 border-4 border-[var(--color-ink)] bg-[var(--color-yellow)] brutal-shadow sm:block"
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.55, type: "spring", stiffness: 140 }}
        style={{ filter: shadow }}
        onMouseEnter={() => pulse.set(0.4)}
        onMouseLeave={() => pulse.set(0)}
      />

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </motion.section>
  );
}

