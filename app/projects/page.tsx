import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Case Studies — Russell Lubojacky",
  description: "25+ years of architecture engagements across banking, hospitality, insurance, energy, retail, and federal government.",
};

export default function ProjectsPage() {
  return (
    <Section
      eyebrow="Case Studies"
      title={`${projects.length} engagements, 1999-${projects[0]?.year ?? new Date().getFullYear()}`}
    >
      <p className="max-w-2xl text-muted">
        Client names are anonymized (industry + scale) out of respect for consulting
        confidentiality — the architecture, the problem, and the outcome are all real.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}
