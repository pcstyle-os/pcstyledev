import Link from "next/link";
import { SmoothBackground } from "@/components/SmoothBackground";
import { Hero } from "@/components/Hero";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import { loadProjects } from "@/lib/projects";

const explorations = [
  {
    title: "Realtime AI workflows",
    description:
      "Buduję lekkie agenty, które w locie zamieniają prompty na gotowe animacje i shaderowe wariacje.",
    status: "W prototypie",
  },
  {
    title: "Neo-brutalist design system",
    description:
      "Porządkuję kontrasty, spacingi i brutal shadows w tokenach, żeby każda subdomena miała tę samą energię.",
    status: "Tokeny siedzą już w Tailwind v4",
  },
  {
    title: "Interactive SSH contact UX",
    description:
      "Dopinam spokojniejszy onboarding i live logi, żeby zostawianie wiadomości z terminala było bezstresowe.",
    status: "Testuję WebRTC fallback",
  },
];

const faqEntries = [
  {
    question: "Kim jestem?",
    answer:
      "Adam Krupa (pcstyle) — developer z Polski. Łączę AI, design i kreatywny kod. Studiuję Sztuczną Inteligencję na Politechnice Częstochowskiej.",
  },
  {
    question: "Jakie projekty prowadzę?",
    answer:
      "Clock Gallery, AimDrift, PoliCalc i PixelForge pokazują zakres: interaktywne doświadczenia, narzędzia AI oraz produkty dla studentów.",
  },
  {
    question: "Jakiego stacku używam?",
    answer:
      "Next.js 16, React 19, TypeScript, Tailwind v4, Framer Motion, WebGL shadery. Po stronie AI — Python i autorskie pipeline'y generatywne.",
  },
  {
    question: "Jak się skontaktować?",
    answer:
      "Mailuj na adamkrupa@tuta.io, złap mnie na Discordzie (@pcstyle), albo wypróbuj SSH modal. Na rozmowy mam kalendarz pod cal.com/pcstyle.",
  },
];

export default function Home() {
  const projects = loadProjects();
  const [latestProject] = projects;
  const spotlightProject =
    latestProject ??
    ({
      id: "portfolio",
      title: "Najnowszy eksperyment",
      description: "Nowy projekt jest w drodze — zaglądaj częściej po świeże rzeczy.",
      url: "https://pcstyle.dev",
    } as (typeof projects)[number]);

  return (
    <>
      <h1 className="sr-only">
        Adam Krupa — Developer z Polski | pcstyle.dev Portfolio | AI Developer & Creative Coder
      </h1>
      <main className="relative isolate mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-24 px-6 pb-40 pt-16 sm:px-10 lg:px-16">
        <SmoothBackground />
        <nav className="sticky top-6 z-20 mb-4 flex w-full justify-end">
          <ul className="flex flex-wrap gap-3 rounded-full border-4 border-[var(--color-ink)] bg-[var(--color-paper)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.35em] shadow-[6px_6px_0_var(--color-ink)] sm:text-sm">
            <li>
              <a className="transition-colors hover:text-[var(--color-magenta)]" href="#intro">
                intro
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-[var(--color-magenta)]" href="#latest">
                latest drop
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-[var(--color-magenta)]" href="#projects">
                projects
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-[var(--color-magenta)]" href="#lab">
                lab notes
              </a>
            </li>
            <li>
              <a className="transition-colors hover:text-[var(--color-magenta)]" href="#faq">
                faq
              </a>
            </li>
          </ul>
        </nav>
        <ScrollIndicator />
        <Hero />

        <section
          id="latest"
          className="relative flex flex-col gap-8 rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-10 brutal-shadow"
        >
          <header className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border-4 border-[var(--color-ink)] bg-[var(--color-yellow)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-ink)] shadow-[6px_6px_0_var(--color-ink)]">
              latest drop
            </span>
            <h2 className="text-[clamp(2.4rem,5vw,3.4rem)] font-black uppercase leading-tight text-[color:var(--color-ink)]">
              {spotlightProject.title}
            </h2>
          </header>
          <div className="grid gap-8 md:grid-cols-[1.3fr,1fr]">
            <p className="text-pretty text-base leading-relaxed text-[color:var(--color-ink)]/80 sm:text-lg">
              {spotlightProject.description} Ostatnia iteracja dopieszcza fizykę ruchu, manualne shadery i tryb
              dostępności (wysoki kontrast + redukcja animacji). Chcesz zajrzeć w proces szkiców i prototypów?
              Odezwij się, podeślę surowe nagrania i repo eksperymentów.
            </p>
            <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border-4 border-dashed border-[var(--color-ink)] bg-[var(--color-muted)]/60 p-6 text-sm uppercase tracking-[0.25em] text-[color:var(--color-ink)]">
              <div className="flex flex-col gap-2">
                <span className="text-xs opacity-60">role</span>
                <span className="font-semibold">Creative coding • Motion systems • UX glow-up</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs opacity-60">stack</span>
                <span className="font-semibold">Next.js · Framer Motion · WebGL shader toys · Tailwind v4</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs opacity-60">link</span>
                <Link
                  href={spotlightProject.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-2 text-[color:var(--color-magenta)] underline-offset-4 hover:underline"
                >
                  {spotlightProject.url.replace(/^https:\/\//, "")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <ProjectsSection />

        <section
          id="lab"
          className="relative grid gap-10 rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-10 brutal-shadow md:grid-cols-2"
        >
          <header className="flex flex-col gap-4">
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-black uppercase text-[color:var(--color-ink)]">
              What I&apos;m exploring now
            </h2>
            <p className="text-pretty text-sm uppercase tracking-[0.3em] text-[color:var(--color-ink)]/60 sm:text-base">
              {"// szybkie lab notes — eksperymenty, które kleję po nocach"}
            </p>
          </header>
          <ul className="flex flex-col gap-6">
            {explorations.map((item) => (
              <li
                key={item.title}
                className="group flex flex-col gap-3 rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-muted)]/70 p-6 transition-colors hover:bg-[var(--color-magenta)]/20"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-ink)]/60 group-hover:text-[color:var(--color-ink)]">
                  {item.status}
                </span>
                <h3 className="text-lg font-black uppercase text-[color:var(--color-ink)]">{item.title}</h3>
                <p className="text-pretty text-sm leading-relaxed text-[color:var(--color-ink)]/80">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="faq"
          className="relative flex flex-col gap-8 rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-paper)] p-10 brutal-shadow"
        >
          <header className="flex flex-col gap-3">
            <h2 className="text-[clamp(2.2rem,4.5vw,3.4rem)] font-black uppercase text-[color:var(--color-ink)]">
              Quick answers
            </h2>
            <p className="max-w-[60ch] text-sm text-[color:var(--color-ink)]/70 sm:text-base">
              Najczęstsze pytania klientów i współpracowników. Potrzebujesz więcej szczegółów? Odezwij się na
              maila albo umów call.
            </p>
          </header>
          <dl className="grid gap-6 md:grid-cols-2">
            {faqEntries.map(({ question, answer }) => (
              <div
                key={question}
                className="flex flex-col gap-2 rounded-[var(--radius-card)] border-4 border-[var(--color-ink)] bg-[var(--color-muted)]/60 p-6"
              >
                <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-ink)]/60">
                  {question}
                </dt>
                <dd className="text-sm leading-relaxed text-[color:var(--color-ink)]/85">{answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>

      {/* structured data - FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqEntries.map(({ question, answer }) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: {
                "@type": "Answer",
                text: answer,
              },
            })),
          }),
        }}
      />

      {/* structured data dla projektów */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "pcstyle Projects by Adam Krupa — Developer z Polski",
            itemListElement: projects.map((project, index) => ({
              "@type": "CreativeWork",
              position: index + 1,
              name: project.title,
              url: project.url,
              description: project.description,
              author: {
                "@type": "Person",
                name: "Adam Krupa",
                alternateName: "pcstyle",
                nationality: { "@type": "Country", name: "Poland" },
              },
            })),
          }),
        }}
      />
    </>
  );
}
