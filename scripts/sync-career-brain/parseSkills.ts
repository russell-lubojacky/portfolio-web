import fs from "node:fs";
import path from "node:path";
import { parseMarkdownSections, tbdOrNull, parseBulletList, assertHeaders } from "./parseMarkdown";
import { ClientInfo, redactTextAllClients, redactListAllClients } from "./anonymize";

const SKILL_FIXED_HEADERS = [
  "Years Used",
  "Projects Used On",
  "Experience Summary",
  "Architecture Experience",
  "Strength Level",
  "Example Resume Bullets",
  "Notes",
];

export interface SkillRecord {
  slug: string;
  name: string;
  yearsUsed: string | null;
  evidenceProjectSlugs: string[];
  experienceSummary: string | null;
  architectureExperience: string[];
  strengthLevel: number | null;
  strengthLabel: string | null;
  exampleResumeBullets: string[];
}

function parseStrength(raw: string | null): { level: number | null; label: string | null } {
  if (!raw) return { level: null, label: null };
  const match = raw.match(/^(\d+)\s*-\s*([A-Za-z]+)/);
  return match ? { level: Number(match[1]), label: match[2] } : { level: null, label: null };
}

function extractProjectRefs(body: string | null): string[] {
  if (!body) return [];
  return Array.from(body.matchAll(/\]\(\.\.\/projects\/([^)]+)\.md\)/g)).map((m) => m[1]);
}

export function parseSkills(
  careerBrainPath: string,
  clients: ClientInfo[],
  projectSlugMap: Map<string, string>,
): SkillRecord[] {
  const dir = path.join(careerBrainPath, "skills");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const records: SkillRecord[] = [];

  for (const file of files.sort()) {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const sections = parseMarkdownSections(raw);
    assertHeaders(
      `skills/${file}`,
      sections.slice(1).map((s) => s.header),
      SKILL_FIXED_HEADERS,
    );
    const name = sections[0].header;
    const byHeader = new Map(sections.map((s) => [s.header, s.body]));

    const rawProjectRefs = extractProjectRefs(byHeader.get("Projects Used On") ?? "");
    const evidenceProjectSlugs = rawProjectRefs
      .map((rawSlug) => projectSlugMap.get(rawSlug))
      .filter((s): s is string => Boolean(s));

    const { level, label } = parseStrength(tbdOrNull(byHeader.get("Strength Level") ?? ""));

    records.push({
      slug: file.replace(/\.md$/, ""),
      name,
      yearsUsed: redactTextAllClients(tbdOrNull(byHeader.get("Years Used") ?? ""), clients),
      evidenceProjectSlugs,
      experienceSummary: redactTextAllClients(
        tbdOrNull(byHeader.get("Experience Summary") ?? ""),
        clients,
      ),
      architectureExperience: redactListAllClients(
        parseBulletList(byHeader.get("Architecture Experience") ?? ""),
        clients,
      ),
      strengthLevel: level,
      strengthLabel: label,
      exampleResumeBullets: redactListAllClients(
        parseBulletList(byHeader.get("Example Resume Bullets") ?? ""),
        clients,
      ),
    });
  }

  return records;
}
