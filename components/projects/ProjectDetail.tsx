import { Badge } from "@/components/ui/Badge";
import { shortTechLabel } from "@/lib/content";
import type { ProjectRecord } from "@/lib/types";

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border py-8 first:border-t-0 first:pt-0">
      <h2 className="font-mono text-sm uppercase tracking-widest text-primary">{title}</h2>
      <div className="mt-3 text-muted">{children}</div>
    </div>
  );
}

export function ProjectDetail({ project }: { project: ProjectRecord }) {
  return (
    <article>
      <p className="font-mono text-sm text-muted">{project.dates}</p>
      <h1 className="mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
        {project.clientDescriptor}
      </h1>
      {project.role && <p className="mt-2 text-lg text-muted">{project.role}</p>}
      {project.industry && <p className="mt-1 text-sm text-muted">{project.industry}</p>}

      {project.technologiesUsed.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {project.technologiesUsed.map((tech) => (
            <Badge key={tech}>{shortTechLabel(tech)}</Badge>
          ))}
        </div>
      )}

      <div className="mt-10">
        {project.businessProblem && (
          <DetailSection title="Business Problem">
            <p className="whitespace-pre-line">{project.businessProblem}</p>
          </DetailSection>
        )}
        {project.responsibilities && (
          <DetailSection title="Responsibilities">
            <p className="whitespace-pre-line">{project.responsibilities}</p>
          </DetailSection>
        )}
        {project.technicalArchitecture && (
          <DetailSection title="Technical Architecture">
            <p className="whitespace-pre-line">{project.technicalArchitecture}</p>
          </DetailSection>
        )}
        {project.challenges && (
          <DetailSection title="Challenges">
            <p className="whitespace-pre-line">{project.challenges}</p>
          </DetailSection>
        )}
        {project.results && (
          <DetailSection title="Results">
            <p className="whitespace-pre-line">{project.results}</p>
          </DetailSection>
        )}
        {project.lessonsLearned && (
          <DetailSection title="Lessons Learned">
            <p className="whitespace-pre-line">{project.lessonsLearned}</p>
          </DetailSection>
        )}
        {project.leadership && (
          <DetailSection title="Leadership">
            <p className="whitespace-pre-line">{project.leadership}</p>
          </DetailSection>
        )}
      </div>
    </article>
  );
}
