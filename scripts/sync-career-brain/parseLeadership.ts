import fs from "node:fs";
import path from "node:path";
import {
  parseMarkdownSections,
  tbdOrNull,
  parseBulletList,
  parseMarkdownTableRows,
  assertHeaders,
} from "./parseMarkdown";
import { ClientInfo, redactTextAllClients, redactListAllClients } from "./anonymize";

const LEADERSHIP_HEADERS = [
  "Leadership Theme",
  "Summary",
  "Evidence Across Projects",
  "Scope",
  "Approach",
  "Impact",
  "Resume Bullet Points",
  "Interview Stories",
  "Notes",
];

export interface LeadershipEvidence {
  dates: string | null;
  description: string | null;
  projectSlug: string | null;
}

export interface LeadershipRecord {
  slug: string;
  theme: string;
  summary: string | null;
  evidence: LeadershipEvidence[];
  scope: string | null;
  approach: string | null;
  impact: string | null;
  resumeBulletPoints: string[];
}

function extractProjectSlugFromLink(cell: string): string | null {
  const match = cell.match(/\]\(\.\.\/projects\/([^)]+)\.md\)/);
  return match ? match[1] : null;
}

export function parseLeadership(
  careerBrainPath: string,
  clients: ClientInfo[],
  projectSlugMap: Map<string, string>,
): LeadershipRecord[] {
  const dir = path.join(careerBrainPath, "leadership");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const records: LeadershipRecord[] = [];

  for (const file of files.sort()) {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const sections = parseMarkdownSections(raw);
    assertHeaders(
      `leadership/${file}`,
      sections.map((s) => s.header),
      LEADERSHIP_HEADERS,
    );
    const byHeader = new Map(sections.map((s) => [s.header, s.body]));

    const rows = parseMarkdownTableRows(byHeader.get("Evidence Across Projects") ?? "").slice(1);
    const evidence: LeadershipEvidence[] = rows.map((cells) => {
      const [dates, , whatHeDid, fileCell] = cells;
      const rawSlug = extractProjectSlugFromLink(fileCell ?? "");
      const projectSlug = rawSlug ? (projectSlugMap.get(rawSlug) ?? null) : null;
      return {
        dates: tbdOrNull(dates ?? ""),
        description: redactTextAllClients(tbdOrNull(whatHeDid ?? ""), clients),
        projectSlug,
      };
    });

    records.push({
      slug: file.replace(/\.md$/, ""),
      theme: (byHeader.get("Leadership Theme") ?? "").trim(),
      summary: redactTextAllClients(tbdOrNull(byHeader.get("Summary") ?? ""), clients),
      evidence,
      scope: redactTextAllClients(tbdOrNull(byHeader.get("Scope") ?? ""), clients),
      approach: redactTextAllClients(tbdOrNull(byHeader.get("Approach") ?? ""), clients),
      impact: redactTextAllClients(tbdOrNull(byHeader.get("Impact") ?? ""), clients),
      resumeBulletPoints: redactListAllClients(
        parseBulletList(byHeader.get("Resume Bullet Points") ?? ""),
        clients,
      ),
    });
  }

  return records;
}
