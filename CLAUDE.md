# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev             # dev server at http://localhost:3000 (Turbopack, auto-reloads)
npm run build            # production build (output: 'standalone', see next.config.ts)
npm run start             # serve the production build
npm run lint              # eslint
npm run sync:content      # regenerate content/generated/*.json from career-brain (scripts/sync-career-brain)
```

## Architecture

Next.js 16 App Router (TypeScript, Tailwind v4). This is a personal portfolio for Russell Lubojacky, rebuilt in 2026 from a long-dormant Angular 16 scaffold — see `/home/rdlubojacky/.claude/plans/sparkling-floating-octopus.md` for the full rebuild plan this codebase executes against.

**Status**: Phases 1-3 and 5 (scaffold, deployment, content, polish) are built. Phase 4 (the AI job-fit tool that would live at `app/api/fit/route.ts`) is **deferred** — `app/fit/page.tsx` is currently a "coming soon" placeholder so the Hero CTA and nav link have somewhere real to go. No `ANTHROPIC_API_KEY`-dependent code exists yet.

- `app/` — routes. `app/page.tsx` is the single-scroll home page (Hero, Timeline, Skills, recent Projects, Leadership & Accomplishments, Contact); `app/projects/` (list) and `app/projects/[slug]/` (case study detail, statically generated for all 41 projects) are dedicated routes; `app/fit/` is the placeholder described above; `app/sitemap.ts` / `app/robots.ts` / `app/icon.svg` cover SEO basics.
- `components/` — `ui/` (Button, Section, Container, Badge design-system primitives), `layout/` (Nav, Footer), and one directory per content section (`hero/`, `timeline/`, `skills/`, `projects/`, `leadership/`, `contact/`).
- `lib/types.ts` / `lib/content.ts` — typed accessors over `content/generated/*.json` (direct JSON imports, no fs access at runtime), plus the curated `SKILL_CATEGORIES` grouping (career-brain's skill files carry no category field) and `shortTechLabel()` (some "Technologies Used" bullets are full sentences, not short tags — this trims them for badge display without touching the underlying data).
- `content/generated/` — structured JSON (timeline, skills, anonymized project case studies, leadership, accomplishments, plus a `fit-context.json` pre-built for the eventual AI feature) produced by `scripts/sync-career-brain/` from the sibling `career-brain` repo (`/home/rdlubojacky/projects/ai-lab/career-brain`, path configurable via `CAREER_BRAIN_PATH`). This is a **manual sync step** (`npm run sync:content`), **not a build-time dependency** — output is committed to this repo and must be re-verified for anonymization leaks (see below) before committing a regeneration. Client names are never rendered publicly; case studies use an industry+scale descriptor instead (`scripts/sync-career-brain/anonymize.ts` + `clientScale.ts`, the latter holding AI-suggested scale labels pending Russell's review).
  - **Before committing a re-sync**: re-run the leak check (grep every `ClientInfo` name/alias from `loadClients()` against all of `content/generated/*.json` — see git history for the exact one-liner used during development). A previous pass caught real leaks in `Role`/`Industry`/`Years Used` fields, not just the obvious narrative ones — redaction currently touches those three plus Business Problem/Responsibilities/Technical Architecture/Technologies Used/Leadership/Challenges/Results/Lessons Learned/Resume Bullet Points. `Client`, `Interview Stories`, and `Notes` are never included in the output at all.
  - The public project `slug` is generated from year + client scale (`anonymizedSlug()`), never from the real career-brain filename, which usually embeds the client name.
- The Skills chart (`components/skills/SkillsChart.tsx`) follows the `dataviz` skill's procedure: strength is an ordinal 1-5 scale (Beginner→Master), rendered as a single validated one-hue ramp (`--skill-1..5` in `app/globals.css`, passing `validate_palette.js --ordinal` in both light and dark) — not a categorical color per skill category. Each skill is a native `<details>`/`<summary>` for keyboard-accessible expansion, no custom JS.
- Design tokens live in `app/globals.css` (Tailwind v4 `@theme inline`, CSS custom properties for light/dark) — a "technical blueprint" palette (ink/navy background with a faint grid, blueprint-blue primary, warm copper accent), deliberately distinct from generic dark-SaaS defaults.
- `NEXT_PUBLIC_SITE_URL` drives `metadataBase`, Open Graph tags, and the sitemap — see `.env.local.example`. It's a `NEXT_PUBLIC_*` var, so it must be supplied at **Docker build time** (`--build-arg`), not just container runtime.

## Deployment

Three-stage Docker build (`node:20-alpine`): install deps → `npm run build` (standalone Next.js output, no career-brain access needed at build time since `content/generated/*.json` is already committed; accepts `NEXT_PUBLIC_SITE_URL` as a build arg) → runtime stage runs `node server.js` directly on port 3000 — no nginx in front. `docker-compose.yml` maps `${HOST_BIND:-0.0.0.0}:${HOST_PORT:-80}:3000` (bind address and host port both overridable per environment, defaulting to public/80), passes the build arg through, and forwards `ANTHROPIC_API_KEY` at runtime (currently unused until Phase 4).

**CI/CD — two environments, one Linode server**: both workflows verify the build on the runner (fail fast), then rsync the repo to the server and run `docker compose up --build -d` there over SSH, so the server always builds its own image. Auth is a dedicated deploy-only SSH key (`LINODE_SSH_KEY`, not Russell's personal key), shared by both workflows as a GitHub Actions secret alongside `LINODE_HOST` and `LINODE_USER`. The old Jenkinsfile was removed — it was never wired to a running Jenkins instance and duplicated this pipeline.

- `.github/workflows/deploy.yml` — push to `main` (or manual dispatch) deploys to `/opt/portfolio-web`, publicly on port 80 (`HOST_BIND`/`HOST_PORT` unset, so the compose defaults of `0.0.0.0`/`80` apply), using the `NEXT_PUBLIC_SITE_URL` repo variable.
- `.github/workflows/deploy-dev.yml` — push to `develop` (or manual dispatch) deploys to `/opt/portfolio-web-dev`, on port 8080, **not exposed publicly**. `HOST_BIND=127.0.0.1` restricts the container to the server's loopback interface; a `tailscale serve --bg --http=8080 localhost:8080` step (idempotent, re-run every deploy) republishes it privately to Russell's tailnet instead, since the server already runs Tailscale. Reachable only from devices on that tailnet — no public port, no Cloud Firewall rule needed for 8080. Requires the deploy SSH user to be either root or the tailscaled operator (one-time server-side setup: `sudo tailscale set --operator=<deploy-user>`). Because the deploy paths differ, Docker Compose's default project-name-from-directory-basename behavior keeps the two stacks' containers/networks separate on the same box automatically — no explicit `-p`/`COMPOSE_PROJECT_NAME` needed.

## Known open items (not blocking, but real)

- `scripts/sync-career-brain/clientScale.ts` holds AI-suggested "scale" labels (Fortune 500, etc.) for all 29 clients — not sourced from career-brain, needs Russell's review.
- The current NOAA/NWS-era engagement (`2025-us-federal-government-agency`) resists full anonymization even with the name removed — industry + dates narrow it to one identifiable engagement. Flagged, not fixed further.
- `NEXT_PUBLIC_SITE_URL` GitHub Actions variable is set to `http://45.79.25.170` (bare IP) — update it once a real domain is pointed at the server, and re-run the deploy so the build picks up the new value.
- `ANTHROPIC_API_KEY` GitHub secret doesn't exist yet — add it once Phase 4 (AI job-fit) is built; the workflow already forwards it if present.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
