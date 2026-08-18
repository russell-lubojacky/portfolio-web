import fs from "node:fs";
import path from "node:path";
import type { ProjectRecord } from "./parseProjects";
import type { SkillRecord } from "./parseSkills";
import type { LeadershipRecord } from "./parseLeadership";
import type { AccomplishmentRecord } from "./parseAccomplishments";

export interface TimelineEntry {
  slug: string;
  year: number;
  dates: string | null;
  role: string | null;
  industry: string | null;
  clientDescriptor: string;
}

const OUT_DIR = path.join(process.cwd(), "content", "generated");

function writeJson(filename: string, data: unknown) {
  fs.writeFileSync(path.join(OUT_DIR, filename), `${JSON.stringify(data, null, 2)}\n`);
}

export function writeAll({
  projects,
  skills,
  leadership,
  accomplishments,
  careerBrainPath,
}: {
  projects: ProjectRecord[];
  skills: SkillRecord[];
  leadership: LeadershipRecord[];
  accomplishments: AccomplishmentRecord[];
  careerBrainPath: string;
}) {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const timeline: TimelineEntry[] = projects.map((p) => ({
    slug: p.slug,
    year: p.year,
    dates: p.dates,
    role: p.role,
    industry: p.industry,
    clientDescriptor: p.clientDescriptor,
  }));

  const fitContext = {
    skills: skills.map((s) => ({
      name: s.name,
      strengthLevel: s.strengthLevel,
      strengthLabel: s.strengthLabel,
      yearsUsed: s.yearsUsed,
      summary: s.experienceSummary,
    })),
    projects: projects.map((p) => ({
      slug: p.slug,
      year: p.year,
      role: p.role,
      industry: p.industry,
      clientDescriptor: p.clientDescriptor,
      technologiesUsed: p.technologiesUsed,
      resultsSummary: p.results ? p.results.slice(0, 400) : null,
    })),
  };

  writeJson("timeline.json", timeline);
  writeJson("skills.json", skills);
  writeJson("projects.json", projects);
  writeJson("leadership.json", leadership);
  writeJson("accomplishments.json", accomplishments);
  writeJson("fit-context.json", fitContext);
  writeJson("manifest.json", {
    generatedAt: new Date().toISOString(),
    careerBrainPath,
    counts: {
      projects: projects.length,
      skills: skills.length,
      leadership: leadership.length,
      accomplishments: accomplishments.length,
    },
  });
}
