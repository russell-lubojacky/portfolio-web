import projectsData from "@/content/generated/projects.json";
import timelineData from "@/content/generated/timeline.json";
import skillsData from "@/content/generated/skills.json";
import leadershipData from "@/content/generated/leadership.json";
import accomplishmentsData from "@/content/generated/accomplishments.json";
import type {
  ProjectRecord,
  TimelineEntry,
  SkillRecord,
  LeadershipRecord,
  AccomplishmentRecord,
} from "./types";

export const projects = projectsData as ProjectRecord[];
export const timeline = timelineData as TimelineEntry[];
export const skills = skillsData as SkillRecord[];
export const leadership = leadershipData as LeadershipRecord[];
export const accomplishments = accomplishmentsData as AccomplishmentRecord[];

export function getProjectBySlug(slug: string): ProjectRecord | undefined {
  return projects.find((p) => p.slug === slug);
}

/** career-brain's "Technologies Used" bullets are sometimes a short tag ("Kubernetes")
 *  and sometimes a full sentence with parenthetical/semicolon explanation. Badges need
 *  the short form; the full bullet text is still in technicalArchitecture/responsibilities. */
export function shortTechLabel(tech: string): string {
  const cut = tech.search(/\s*[(;]/);
  return (cut === -1 ? tech : tech.slice(0, cut)).trim();
}

/** career-brain's skill files carry no category field — this grouping is curated
 *  here for display purposes only, not part of the ingested data. */
export const SKILL_CATEGORIES: Record<string, string> = {
  java: "Languages & Frameworks",
  javascript: "Languages & Frameworks",
  kotlin: "Languages & Frameworks",
  "node-js": "Languages & Frameworks",
  python: "Languages & Frameworks",
  "spring-framework": "Languages & Frameworks",
  aws: "Cloud & Infrastructure",
  cloud: "Cloud & Infrastructure",
  docker: "Cloud & Infrastructure",
  kubernetes: "Cloud & Infrastructure",
  terraform: "Cloud & Infrastructure",
  devops: "Cloud & Infrastructure",
  oracle: "Data & GIS",
  postgresql: "Data & GIS",
  postgis: "Data & GIS",
  arcgis: "Data & GIS",
  "rest-apis": "APIs & Architecture",
  microservices: "APIs & Architecture",
  "enterprise-architecture": "APIs & Architecture",
  servicenow: "APIs & Architecture",
  "ai-assisted-development": "AI-Assisted Development",
};

export const SKILL_CATEGORY_ORDER = [
  "Languages & Frameworks",
  "Cloud & Infrastructure",
  "APIs & Architecture",
  "Data & GIS",
  "AI-Assisted Development",
];

export function groupSkillsByCategory(): { category: string; skills: SkillRecord[] }[] {
  const byCategory = new Map<string, SkillRecord[]>();
  for (const skill of skills) {
    const category = SKILL_CATEGORIES[skill.slug] ?? "Other";
    if (!byCategory.has(category)) byCategory.set(category, []);
    byCategory.get(category)!.push(skill);
  }
  return SKILL_CATEGORY_ORDER.filter((c) => byCategory.has(c)).map((category) => ({
    category,
    skills: (byCategory.get(category) ?? []).sort(
      (a, b) => (b.strengthLevel ?? 0) - (a.strengthLevel ?? 0),
    ),
  }));
}

export function groupTimelineByYear(): { year: number; entries: TimelineEntry[] }[] {
  const byYear = new Map<number, TimelineEntry[]>();
  for (const entry of timeline) {
    if (!byYear.has(entry.year)) byYear.set(entry.year, []);
    byYear.get(entry.year)!.push(entry);
  }
  return Array.from(byYear.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, entries]) => ({ year, entries }));
}
