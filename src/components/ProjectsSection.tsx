import { ProjectsGrid } from "@/components/ProjectsGrid";
import { loadProjects } from "@/lib/projects";

export function ProjectsSection() {
  const projects = loadProjects();

  return (
    <section className="relative flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h2 className="text-[clamp(2.4rem,5vw,3.6rem)] font-black uppercase text-[color:var(--color-ink)]">
          playground of subdomains
        </h2>
        <p className="max-w-[60ch] text-sm uppercase tracking-[0.3em] text-[color:var(--color-ink)]/60 sm:text-base">
          {"// tu się dzieje: żywe eksperymenty z zegarami, aim trainingiem, kalkulatorami i AI grafiką"}
        </p>
      </header>

      <ProjectsGrid projects={projects} />
    </section>
  );
}

