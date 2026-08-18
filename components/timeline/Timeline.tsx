import Link from "next/link";
import { groupTimelineByYear } from "@/lib/content";

export function Timeline() {
  const groups = groupTimelineByYear();

  return (
    <ol className="relative border-l border-border pl-8">
      {groups.map(({ year, entries }) => (
        <li key={year} className="mb-10 last:mb-0">
          <div className="absolute -ml-[calc(2rem+4.5px)] mt-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
          <p className="font-mono text-sm font-semibold text-primary">{year}</p>
          <div className="mt-2 space-y-4">
            {entries.map((entry) => (
              <Link
                key={entry.slug}
                href={`/projects/${entry.slug}`}
                className="block rounded-md border border-border bg-surface p-4 transition-colors hover:border-primary"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="font-medium text-foreground">{entry.role ?? "Engagement"}</p>
                  <p className="font-mono text-xs text-muted">{entry.dates}</p>
                </div>
                <p className="mt-1 text-sm text-muted">{entry.clientDescriptor}</p>
              </Link>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
