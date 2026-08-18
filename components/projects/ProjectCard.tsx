import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { shortTechLabel } from "@/lib/content";
import type { ProjectRecord } from "@/lib/types";

export function ProjectCard({ project }: { project: ProjectRecord }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block rounded-lg border border-border bg-surface p-6 transition-colors hover:border-primary"
    >
      <p className="font-mono text-xs text-muted">{project.dates}</p>
      <h3 className="mt-2 text-lg font-semibold text-foreground">{project.clientDescriptor}</h3>
      {project.role && <p className="mt-1 text-sm text-muted">{project.role}</p>}
      {project.technologiesUsed.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologiesUsed.slice(0, 4).map((tech) => (
            <Badge key={tech}>{shortTechLabel(tech)}</Badge>
          ))}
        </div>
      )}
    </Link>
  );
}
