import fs from "node:fs";
import path from "node:path";
import { parseMarkdownSections, tbdOrNull, parseBulletList, assertHeaders } from "./parseMarkdown";
import { ClientInfo, redactText, redactList, anonymizedSlug } from "./anonymize";

const PROJECT_HEADERS = [
  "Client",
  "Dates",
  "Role",
  "Industry",
  "Business Problem",
  "Responsibilities",
  "Technical Architecture",
  "Technologies Used",
  "Leadership",
  "Challenges",
  "Results",
  "Lessons Learned",
  "Resume Bullet Points",
  "Interview Stories",
  "Notes",
];

export interface ProjectRecord {
  slug: string;
  year: number;
  dates: string | null;
  role: string | null;
  industry: string | null;
  clientDescriptor: string;
  businessProblem: string | null;
  responsibilities: string | null;
  technicalArchitecture: string | null;
  technologiesUsed: string[];
  leadership: string | null;
  challenges: string | null;
  results: string | null;
  lessonsLearned: string | null;
  resumeBulletPoints: string[];
}

function extractYear(dates: string | null, fallbackFilename: string): number {
  const match = (dates ?? "").match(/(\d{4})/);
  if (match) return Number(match[1]);
  const fileMatch = fallbackFilename.match(/^(\d{4})-/);
  return fileMatch ? Number(fileMatch[1]) : 0;
}

export interface ParsedProjects {
  records: ProjectRecord[];
  /** raw career-brain filename slug -> anonymized public slug, for cross-referencing
   *  from skills/leadership/accomplishments without exposing the raw slug itself. */
  slugMap: Map<string, string>;
}

export function parseProjects(
  careerBrainPath: string,
  projectClientMap: Map<string, ClientInfo>,
): ParsedProjects {
  const dir = path.join(careerBrainPath, "projects");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const usedSlugs = new Set<string>();
  const records: ProjectRecord[] = [];
  const slugMap = new Map<string, string>();

  for (const file of files.sort()) {
    const fileSlug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const sections = parseMarkdownSections(raw);
    assertHeaders(
      `projects/${file}`,
      sections.map((s) => s.header),
      PROJECT_HEADERS,
    );
    const byHeader = new Map(sections.map((s) => [s.header, s.body]));

    const client = projectClientMap.get(fileSlug);
    if (!client) {
      throw new Error(
        `projects/${file} has no matching client in any clients/*.md Engagements table — cannot anonymize.`,
      );
    }

    const dates = tbdOrNull(byHeader.get("Dates") ?? "");
    const year = extractYear(dates, fileSlug);
    const slug = anonymizedSlug(String(year), client, usedSlugs);
    slugMap.set(fileSlug, slug);

    records.push({
      slug,
      year,
      dates,
      role: redactText(tbdOrNull(byHeader.get("Role") ?? ""), client),
      industry: redactText(tbdOrNull(byHeader.get("Industry") ?? ""), client),
      clientDescriptor: client.descriptor,
      businessProblem: redactText(tbdOrNull(byHeader.get("Business Problem") ?? ""), client),
      responsibilities: redactText(tbdOrNull(byHeader.get("Responsibilities") ?? ""), client),
      technicalArchitecture: redactText(
        tbdOrNull(byHeader.get("Technical Architecture") ?? ""),
        client,
      ),
      technologiesUsed: redactList(parseBulletList(byHeader.get("Technologies Used") ?? ""), client),
      leadership: redactText(tbdOrNull(byHeader.get("Leadership") ?? ""), client),
      challenges: redactText(tbdOrNull(byHeader.get("Challenges") ?? ""), client),
      results: redactText(tbdOrNull(byHeader.get("Results") ?? ""), client),
      lessonsLearned: redactText(tbdOrNull(byHeader.get("Lessons Learned") ?? ""), client),
      resumeBulletPoints: redactList(
        parseBulletList(byHeader.get("Resume Bullet Points") ?? ""),
        client,
      ),
      // Client, Interview Stories, and Notes are intentionally never included —
      // they either are the raw client name or may contain internal commentary.
    });
  }

  return { records: records.sort((a, b) => b.year - a.year), slugMap };
}
