# PortfolioWeb

Russell Lubojacky's personal portfolio — a Next.js site pulling real career data from a separate knowledge base ([`career-brain`](../ai-lab/career-brain)): an interactive timeline, honestly-rated skills, 41 anonymized case studies, and leadership/accomplishments. An AI-powered "how do I fit this job?" tool is planned but not yet built — `/fit` is currently a placeholder.

See [`CLAUDE.md`](CLAUDE.md) for architecture and commands, and `/home/rdlubojacky/.claude/plans/sparkling-floating-octopus.md` for the full rebuild plan.

## Development

```bash
npm install
npm run dev            # http://localhost:3000
npm run sync:content   # regenerate content/generated/*.json from career-brain
```

## Build & run in Docker

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain docker compose up --build
```
