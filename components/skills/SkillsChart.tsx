import { groupSkillsByCategory } from "@/lib/content";
import type { SkillRecord } from "@/lib/types";

const LEVEL_COLOR: Record<number, string> = {
  1: "var(--skill-1)",
  2: "var(--skill-2)",
  3: "var(--skill-3)",
  4: "var(--skill-4)",
  5: "var(--skill-5)",
};

const LEGEND: { level: number; label: string }[] = [
  { level: 1, label: "Beginner" },
  { level: 2, label: "Intermediate" },
  { level: 3, label: "Advanced" },
  { level: 4, label: "Expert" },
  { level: 5, label: "Master" },
];

function SkillBar({ skill }: { skill: SkillRecord }) {
  const hasEvidence = Boolean(
    skill.experienceSummary || skill.architectureExperience.length || skill.exampleResumeBullets.length,
  );

  return (
    <details className="group rounded-md border border-border bg-surface px-4 py-3 open:border-primary">
      <summary className="flex cursor-pointer list-none items-center gap-4">
        <span className="w-40 shrink-0 truncate text-sm text-foreground" title={skill.name}>
          {skill.name}
        </span>
        <span className="h-2.5 flex-1 overflow-hidden rounded-r-sm bg-background">
          {skill.strengthLevel && (
            <span
              className="block h-full rounded-r-sm"
              style={{
                width: `${(skill.strengthLevel / 5) * 100}%`,
                background: LEVEL_COLOR[skill.strengthLevel],
              }}
            />
          )}
        </span>
        <span className="w-28 shrink-0 text-right font-mono text-xs text-muted">
          {skill.strengthLabel ?? "Evidence-based"}
        </span>
      </summary>
      <div className="mt-3 border-t border-border pt-3 text-sm text-muted">
        {skill.yearsUsed && <p className="mb-2 font-mono text-xs text-muted">{skill.yearsUsed}</p>}
        {skill.experienceSummary && <p>{skill.experienceSummary}</p>}
        {skill.exampleResumeBullets.length > 0 && (
          <ul className="mt-2 list-inside list-disc space-y-1">
            {skill.exampleResumeBullets.slice(0, 3).map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        )}
        {!hasEvidence && <p>No detailed evidence recorded yet.</p>}
      </div>
    </details>
  );
}

export function SkillsChart() {
  const groups = groupSkillsByCategory();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2">
        {LEGEND.map(({ level, label }) => (
          <div key={level} className="flex items-center gap-2">
            <span
              className="h-2.5 w-4 rounded-sm"
              style={{ background: LEVEL_COLOR[level] }}
            />
            <span className="text-xs text-muted">{label}</span>
          </div>
        ))}
      </div>
      <div className="space-y-8">
        {groups.map(({ category, skills }) => (
          <div key={category}>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">
              {category}
            </h3>
            <div className="space-y-2">
              {skills.map((skill) => (
                <SkillBar key={skill.slug} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
