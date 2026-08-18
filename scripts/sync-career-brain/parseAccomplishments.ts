import fs from "node:fs";
import path from "node:path";
import { parseMarkdownSections, tbdOrNull, parseBulletList, assertHeaders } from "./parseMarkdown";
import { ClientInfo, redactTextAllClients, redactListAllClients } from "./anonymize";
import { EXCLUDED_ACCOMPLISHMENT_SLUGS } from "./accomplishmentAllowlist";

const ACCOMPLISHMENT_HEADERS = [
  "Accomplishment",
  "Summary",
  "Timeframe",
  "Contributing Projects",
  "Technologies Involved",
  "Business Value / Impact",
  "Resume Bullet Points",
  "Notes",
];

export interface AccomplishmentRecord {
  slug: string;
  title: string;
  summary: string | null;
  timeframe: string | null;
  contributingProjectSlugs: string[];
  technologiesInvolved: string[];
  businessValue: string | null;
  resumeBulletPoints: string[];
}

export function parseAccomplishments(
  careerBrainPath: string,
  clients: ClientInfo[],
  projectSlugMap: Map<string, string>,
): AccomplishmentRecord[] {
  const dir = path.join(careerBrainPath, "accomplishments");
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .filter((f) => !EXCLUDED_ACCOMPLISHMENT_SLUGS.has(f.replace(/\.md$/, "")));
  const records: AccomplishmentRecord[] = [];

  for (const file of files.sort()) {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const sections = parseMarkdownSections(raw);
    assertHeaders(
      `accomplishments/${file}`,
      sections.map((s) => s.header),
      ACCOMPLISHMENT_HEADERS,
    );
    const byHeader = new Map(sections.map((s) => [s.header, s.body]));

    const contributingProjectSlugs = Array.from(
      (byHeader.get("Contributing Projects") ?? "").matchAll(/\]\(\.\.\/projects\/([^)]+)\.md\)/g),
    )
      .map((m) => projectSlugMap.get(m[1]))
      .filter((s): s is string => Boolean(s));

    records.push({
      slug: file.replace(/\.md$/, ""),
      title: (byHeader.get("Accomplishment") ?? "").trim(),
      summary: redactTextAllClients(tbdOrNull(byHeader.get("Summary") ?? ""), clients),
      timeframe: tbdOrNull(byHeader.get("Timeframe") ?? ""),
      contributingProjectSlugs,
      technologiesInvolved: redactListAllClients(
        parseBulletList(byHeader.get("Technologies Involved") ?? ""),
        clients,
      ),
      businessValue: redactTextAllClients(
        tbdOrNull(byHeader.get("Business Value / Impact") ?? ""),
        clients,
      ),
      resumeBulletPoints: redactListAllClients(
        parseBulletList(byHeader.get("Resume Bullet Points") ?? ""),
        clients,
      ),
    });
  }

  return records;
}
