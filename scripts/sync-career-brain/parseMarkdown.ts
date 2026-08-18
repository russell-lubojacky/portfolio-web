export interface MdSection {
  header: string;
  body: string;
}

export function parseMarkdownSections(raw: string): MdSection[] {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  const sections: MdSection[] = [];
  let currentHeader: string | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (currentHeader !== null) {
      sections.push({ header: currentHeader, body: buffer.join("\n").trim() });
    }
    buffer = [];
  };

  for (const line of lines) {
    const match = /^# (.+)$/.exec(line);
    if (match) {
      flush();
      currentHeader = match[1].trim();
    } else {
      buffer.push(line);
    }
  }
  flush();
  return sections;
}

/** career-brain mostly uses "TBD" for an unfilled field, but a handful of early-career
 *  project files use "Update Required" instead (e.g. Role on several pre-2006 engagements
 *  where the source resume didn't state a title) — both mean "not known," not a real value. */
export function tbdOrNull(body: string): string | null {
  const trimmed = body.trim();
  if (trimmed === "" || /^(TBD|Update Required)\b/.test(trimmed)) return null;
  return trimmed;
}

export function parseBulletList(body: string | null): string[] {
  if (!body) return [];
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}

/** Parses a markdown pipe-table into rows of trimmed cells, including the header
 *  row as rows[0] (callers that only want data rows should slice(1)). */
export function parseMarkdownTableRows(body: string): string[][] {
  const lines = body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|"));
  const rows: string[][] = [];
  for (const line of lines) {
    const cells = line.split("|").slice(1, -1).map((c) => c.trim());
    if (cells.every((c) => /^:?-+:?$/.test(c))) continue; // separator row
    rows.push(cells);
  }
  return rows;
}

export function assertHeaders(filePath: string, actual: string[], expected: string[]) {
  const mismatch =
    actual.length !== expected.length || actual.some((h, i) => h !== expected[i]);
  if (mismatch) {
    throw new Error(
      `career-brain header mismatch in ${filePath}\n  expected: ${expected.join(" | ")}\n  actual:   ${actual.join(" | ")}`,
    );
  }
}
