import path from "node:path";
import fs from "node:fs";
import { parseMarkdownSections, tbdOrNull } from "./parseMarkdown";
import { CLIENT_SCALE } from "./clientScale";

export interface ClientInfo {
  slug: string;
  primaryName: string;
  aliases: string[];
  industry: string | null;
  scale: string;
  descriptor: string;
  projectSlugs: string[];
}

function extractPrimaryAndAliases(clientBody: string): { primary: string; aliases: string[] } {
  const firstLine = clientBody.split("\n")[0].trim();
  const parenIndex = firstLine.indexOf(" (");
  const primary = (parenIndex === -1 ? firstLine : firstLine.slice(0, parenIndex)).trim();
  const aliases = Array.from(firstLine.matchAll(/"([^"]+)"/g)).map((m) => m[1]);
  return { primary, aliases };
}

function extractTableFileLinks(tableBody: string): string[] {
  const slugs: string[] = [];
  for (const match of tableBody.matchAll(/\]\(\.\.\/projects\/([^)]+)\.md\)/g)) {
    slugs.push(match[1]);
  }
  return slugs;
}

export function loadClients(careerBrainPath: string): ClientInfo[] {
  const dir = path.join(careerBrainPath, "clients");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const sections = parseMarkdownSections(raw);
    const byHeader = new Map(sections.map((s) => [s.header, s.body]));
    const clientBody = byHeader.get("Client") ?? "";
    const { primary, aliases } = extractPrimaryAndAliases(clientBody);
    const industry = tbdOrNull(byHeader.get("Industry") ?? "");
    const meta = CLIENT_SCALE[slug];
    if (!meta) {
      throw new Error(`No clientScale.ts entry for client slug "${slug}" — add one before syncing.`);
    }
    const projectSlugs = extractTableFileLinks(byHeader.get("Engagements") ?? "");
    return {
      slug,
      primaryName: primary,
      aliases: [...aliases, ...(meta.extraAliases ?? [])],
      industry,
      scale: meta.scale,
      descriptor: meta.scale,
      projectSlugs,
    };
  });
}

export function buildProjectClientMap(clients: ClientInfo[]): Map<string, ClientInfo> {
  const map = new Map<string, ClientInfo>();
  for (const client of clients) {
    for (const projectSlug of client.projectSlugs) {
      map.set(projectSlug, client);
    }
  }
  return map;
}

/** Best-effort: replaces known client name aliases with an anonymized descriptor.
 *  Cannot catch indirect/contextual references — see plan's flagged manual-review risk. */
export function redactText(text: string | null, client: ClientInfo): string | null {
  if (!text) return null;
  let result = text;
  const names = [client.primaryName, ...client.aliases]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(new RegExp(escaped, "gi"), `the ${client.descriptor}`);
  }
  // Collapse adjacent duplicate descriptors — two different aliases for the same
  // client next to each other (e.g. "Redbox DeLorean") would otherwise both expand.
  const descEscaped = client.descriptor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const dupeRe = new RegExp(`(the ${descEscaped})([\\s/]+the ${descEscaped})+`, "gi");
  result = result.replace(dupeRe, `the ${client.descriptor}`);
  // The source text often already had its own article ("the NOAA/NWS engagement"),
  // so the inserted "the" can double up — collapse "the the" from either direction.
  result = result.replace(/\bthe\s+the\b/gi, "the");
  return result;
}

export function redactList(items: string[], client: ClientInfo): string[] {
  return items.map((item) => redactText(item, client) ?? item);
}

/** For cross-client documents (skills/leadership/accomplishments) — applies every
 *  known client's redaction pass in sequence, since these files aren't scoped to one client. */
export function redactTextAllClients(text: string | null, clients: ClientInfo[]): string | null {
  let result = text;
  for (const client of clients) {
    result = redactText(result, client);
  }
  return result;
}

export function redactListAllClients(items: string[], clients: ClientInfo[]): string[] {
  return items.map((item) => redactTextAllClients(item, clients) ?? item);
}

/** Anonymized public slug for a project — never derived from the real project filename,
 *  which usually embeds the client name (e.g. "2025-noaa-nws-idp-modernization"). */
export function anonymizedSlug(year: string, client: ClientInfo, usedSlugs: Set<string>): string {
  const industrySlug = client.scale
    .toLowerCase()
    .replace(/^fortune \d+ /, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const base = `${year}-${industrySlug}`;
  let candidate = base;
  let n = 2;
  while (usedSlugs.has(candidate)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  usedSlugs.add(candidate);
  return candidate;
}
