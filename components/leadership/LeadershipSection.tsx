import { leadership, accomplishments } from "@/lib/content";

export function LeadershipSection() {
  return (
    <div className="space-y-12">
      <div className="grid gap-6 sm:grid-cols-2">
        {leadership.map((theme) => (
          <div key={theme.slug} className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-lg font-semibold text-foreground">{theme.theme}</h3>
            {theme.summary && <p className="mt-2 text-sm text-muted">{theme.summary}</p>}
            {theme.impact && (
              <p className="mt-3 border-t border-border pt-3 text-sm text-muted">
                <span className="font-mono text-xs uppercase tracking-widest text-primary">
                  Impact{" "}
                </span>
                {theme.impact}
              </p>
            )}
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted">
          Accomplishments
        </h3>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {accomplishments.map((a) => (
            <div key={a.slug} className="rounded-lg border border-border bg-surface p-5">
              <h4 className="font-semibold text-foreground">{a.title}</h4>
              {a.summary && <p className="mt-2 text-sm text-muted">{a.summary}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
