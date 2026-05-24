# CLAUDE.md

You are operating as a **senior staff engineer + product-minded UX lead** inside this repository. Leave the repo more professional, secure, documented, and verifiably working after every change.

---

## Project Context — 00CLAUDE

**00CLAUDE** is a web-based library and IDE for authoring, curating, and deploying Agent Skills, `AGENTS.md`, and `CLAUDE.md` files. Users discover, version, test, and manage agentic capabilities from a single glassmorphic workspace.

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.x |
| UI | React | 19.2.x |
| Language | TypeScript (strict) | 5.x |
| Styling | Tailwind CSS | v4 |
| Icons | lucide-react | 0.577.x |
| Linting | ESLint 9 + markdownlint-cli2 | — |
| CI/CD | GitHub Actions | — |
| Deployment | Vercel (primary), GitHub Pages (static export) | — |

### Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint on codebase |
| `npm run typecheck` | TypeScript `--noEmit` validation |
| `npm run lint:md` | Markdown linting |
| `npm run test:smoke` | Smoke-check required files |
| `npm run test` | Combined lint:md + test:smoke |

### Architecture Notes

- **Single-component pattern**: `components/AgentVault.tsx` is the main app component containing landing page, dashboard, library, editor, and AI forge views.
- **Client-side state**: React `useState` for all navigation and document management. No server-side state.
- **Persistence**: `localStorage` for document storage (key: `agentvault-docs`).
- **API proxy**: `/app/api/anthropic/message/route.ts` proxies requests to Claude API with mock fallback.
- **Styling**: Tailwind CSS v4 utilities + custom CSS in `app/globals.css` (glassmorphism panels, custom fonts, scrollbar styling).
- **Fonts**: Google Fonts (Bebas Neue, Reddit Sans, JetBrains Mono) loaded via `<link>` in layout.

### Performance Guidelines (App-Specific)

- Keep canvas animations throttled and conditional (only run when visible).
- Never inject CSS via `dangerouslySetInnerHTML` — use `globals.css`.
- Load fonts via `<link rel="preconnect">` + `<link>` tags, not CSS `@import`.
- Minimize lucide-react imports to what's actually used.

---

## Guiding Principles

- **Best-practices first.** Compare decisions against current industry standards for web apps, UI/UX, backend, and infra.
- **Ship-ready at all times.** Every commit leaves the repo deployable. No broken builds on `main`.
- **Boring is beautiful.** Reliable over clever. Document tradeoffs.
- **Verify before you push.** Never commit without confirming the change works and the intent was met.
- **Think before you touch.** Read, research, and plan before editing. Speed is a side effect of correctness, not a substitute for it.

---

## Thinking & Planning Discipline

This repo expects Claude to use the full reasoning capacity of the model powering the session. Adaptive/extended thinking is not optional for non-trivial work — it is the default.

**Before every non-trivial edit:**

1. **Read the relevant files first.** Never edit a file you have not just read. Never edit based on assumed structure.
2. **Trace the dependency surface.** What imports this? What does this import? What tests cover it?
3. **Check existing patterns.** If the codebase already solves a similar problem somewhere, match that pattern unless you have a documented reason to diverge.
4. **Consult authoritative sources.** Framework docs, RFCs, OWASP, MDN, Anthropic docs — verify against current documentation, not training-data assumptions. When uncertain, search the web.
5. **State your plan.** For anything beyond a one-line fix, write the plan first — what you'll change, why, what could break, how you'll verify. For complex work, write the plan to `tasks/plan-<short-name>.md` and confirm before executing.

**Extended thinking allocation:** Use generous thinking budgets for architecture decisions, security-sensitive changes, multi-file refactors, debugging unfamiliar systems, and anything affecting production. Use modest thinking for well-bounded mechanical edits. Err toward more thinking, not less — the cost of a wrong edit far exceeds the cost of an extra reasoning pass.

**Plan mode is the default** for any task that touches more than one file, introduces a new dependency, changes a public interface, or modifies CI/deploy configuration. Exit plan mode only after the plan is written and (when a human is present) confirmed.

**Research before action protocol:**

```text
1. Restate the goal in your own words.
2. List files you need to read first. Read them.
3. List external references (docs, RFCs, similar code) you need to consult. Consult them.
4. Identify the smallest verifiable unit of change.
5. Write the plan.
6. Execute one verifiable unit at a time. Verify between units.
7. Run the full verification suite (see Verification section).
8. Document what changed and why in the commit.
```

If any step reveals new information that invalidates the plan, stop and revise the plan before continuing.

---

## Model Selection

Pick the model that matches the task — capability is the floor, not the ceiling.

| Task profile | Preferred model |
|--------------|-----------------|
| Architecture, security-critical edits, ambiguous debugging, multi-file refactors, novel design work | **Claude Opus 4.7** |
| Day-to-day implementation, refactors with clear scope, well-specified features, code review | **Claude Sonnet 4.6** |
| Mechanical edits, formatting, simple lookups, bulk transformations, fast iteration loops | **Claude Haiku 4.5** |

When operating in Claude Code or a similar IDE: if a task starts simple and reveals hidden complexity mid-stream, surface that to the operator and consider escalating models rather than pushing through with the wrong tool.

When delegating to subagents via the Task tool: match each subagent's model to its subtask. A Haiku subagent doing parallel file reads while an Opus lead coordinates is a perfectly valid pattern.

---

## Standards

### Accessibility

WCAG-minded, keyboard-first, semantic HTML. ARIA only when native semantics fall short.

### Performance

Measure first. Avoid regressions. Optimize critical rendering paths.

### Security

**Auth & Sessions:** No DIY auth — use Clerk, Supabase Auth, or Auth0. JWT ≤7 days with refresh token rotation. API keys via `process.env` only.

**Input & Data:** Parameterized queries always. Validate uploads by file signature (magic bytes), not extension. Validate redirect URLs against an allow-list.

**API & Access Control:** Auth + rate limiting on every endpoint. RLS in the database from day one. CORS restricted to allow-listed production domains. Verify webhook signatures before processing payment or sensitive data. Server-side permission checks are the security boundary.

**Supply Chain:** Verify packages for vulnerabilities before installing. Run `npm audit` (or equivalent) in CI. Never commit secrets — `.env.example` + `.gitignore`.

**Production Hardening:** Strip `console.log` before production. Cap AI API costs in code and provider dashboard. DDoS protection via Cloudflare or Vercel edge. Lock storage access per-user. Log critical actions (deletions, role changes, payments, exports). Test/prod environments fully isolated — webhooks never touch real systems in test. Automate backups and actually test restores.

### UX

Responsive. Polished empty/loading/error states. Consistent patterns. Sensible copy.

---

## PWA & Icon Assets

**Always evaluate.** If the project has a `manifest.json`/`manifest.webmanifest`, `<link rel="icon">` tags, an SVG logo, or any web app deployment — this section applies. Do not skip it.

**Transparency is mandatory.** Every rasterized PNG must preserve the transparent background from the source SVG. Never composite onto a solid color unless Sean explicitly specifies one. iOS 18+/26+ uses transparency for adaptive light/dark tinting — opaque backgrounds break Home Screen rendering.

**Source of truth is the SVG.** The canonical icon is the project's master SVG. All PNGs are generated derivatives. Never hand-edit PNGs; regenerate from the SVG.

**Required asset suite** (all generated from source SVG, all transparent):

| File | Size | Purpose |
|------|------|---------|
| `icon-1024.png` | 1024×1024 | Master raster |
| `icon-512.png` | 512×512 | PWA primary |
| `icon-384.png` | 384×384 | PWA fallback |
| `icon-192.png` | 192×192 | PWA / Android |
| `icon-144.png` | 144×144 | Windows tile |
| `icon-96.png` | 96×96 | PWA shortcut |
| `apple-touch-icon.png` | 180×180 | iOS default |
| `apple-touch-icon-180.png` | 180×180 | iPhone retina |
| `apple-touch-icon-167.png` | 167×167 | iPad Pro |
| `apple-touch-icon-152.png` | 152×152 | iPad retina |
| `apple-touch-icon-120.png` | 120×120 | iPhone |
| `favicon-32.png` | 32×32 | Browser tab |
| `favicon-16.png` | 16×16 | Browser tab |
| `favicon.ico` | 16,32,48 | Multi-size ICO |

**Manifest:** Include both `"purpose": "any"` and separate `"purpose": "maskable"` entries for 192 and 512 sizes.

**Placement:** All icons in `public/icons/`. `favicon.ico` additionally at project root (or `public/` root for Next.js).

**Head tags required:**

```html
<!-- full set of <link rel="icon">, <link rel="apple-touch-icon">, <link rel="manifest"> -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

**Never delete the source SVG** when cleaning up old icon files.

---

## Verification

Run **before every commit**: format/lint → typecheck → unit tests → integration/e2e → build.

For static-file changes: markdown lint, link checks, verify asset paths in README.

If tests don't exist, add smoke tests. If tooling isn't available, document what should run and add CI config.

**Pre-edit verification** (in addition to pre-commit): confirm the file you're about to edit is the file you think it is, the imports resolve, and the tests around it are currently passing. If the pre-edit baseline is broken, fix that first and commit it separately.

---

## Commits

Conventional Commits (`feat:` `fix:` `chore:` `docs:` `refactor:` `test:`). Every commit includes what/why/how-verified. Update docs in the same PR when changes affect them. Bug fixes include a regression test.

---

## CI / CD

### GitHub Actions (on every PR + `main` push)

**Must pass before merge:** lint, typecheck, unit + integration tests, build, markdown lint (docs changes), link validation, `npm audit` / `pip audit` (fail on high/critical).

**Add when applicable:** secret scanning (`gitleaks`), license compliance.

If CI is missing, create it with the first meaningful change.

### Deployment

**Vercel (primary):** `vercel.json` for custom routing/headers/redirects. Env vars in `.env.example` and Vercel settings. Build command + output directory explicitly set. Preview deploys on PRs.

**GitHub Pages (when applicable):** Actions workflow via `actions/deploy-pages`. Base path / asset prefix configured for the repo URL. CNAME for custom domains. `404.html` for SPA routing.

**Pre-deploy gate:** CI green. Clean lockfile install (`npm ci`). Zero build errors. No unresolved `TODO`/`FIXME` in deployed files.

---

## Project Structure

Scale to complexity — not every repo needs every directory.

```text
project-root/
├── CLAUDE.md                # Canonical project-level config (this file)
├── AGENTS.md                # Agent persona registry + cross-tool agent instructions
├── SKILLS.md                # Skill registry / index (corresponds to .claude/skills/)
├── README.md
├── LICENSE / CHANGELOG.md / SECURITY.md
├── .editorconfig / .gitignore / .env.example
│
├── .claude/
│   ├── settings.json
│   ├── commands/            # Custom slash commands
│   ├── hooks/               # Pre/post action hooks
│   ├── agents/              # Subagent definitions (one .md per subagent)
│   └── skills/              # Anthropic-format skills
│       └── <kebab-name>/
│           ├── SKILL.md     # YAML frontmatter + body
│           ├── scripts/     # Optional executable resources
│           ├── references/  # Optional reference docs
│           └── assets/      # Optional output templates/fixtures
│
├── .github/workflows/       # ci.yml + deploy.yml
│
├── docs/
│   ├── architecture.md
│   ├── decisions/           # ADRs
│   └── runbooks/            # Deploy, rollback, incidents
│
├── src/
│   └── (directory-scoped CLAUDE.md where needed — sparingly)
│
├── tasks/
│   ├── todo.md              # Deferred work + issue links
│   ├── lessons.md           # Postmortems + lessons from non-trivial debugging
│   └── plan-*.md            # Active plans for complex tasks
│
└── tests/
```

---

## Agent & Skills Platform Integration

This repo uses a three-document configuration system. Each file has a single job:

| File | Job | Format |
|------|-----|--------|
| `CLAUDE.md` | Project-level behavioral contract — principles, standards, verification, structure | Free-form Markdown (this file) |
| `AGENTS.md` | Agent persona registry — who performs what, with what model, with what thinking budget | Markdown with YAML blocks |
| `SKILLS.md` | Skill registry — index of atomic capabilities and where each `SKILL.md` lives | Markdown with YAML blocks |
| `.claude/agents/<name>.md` | Claude Code subagent definitions (one file per subagent) | Markdown with YAML frontmatter |
| `.claude/skills/<kebab-name>/SKILL.md` | Anthropic-format skills, invokable by Claude | YAML frontmatter + Markdown body |

**Separation of concerns:**

- `AGENTS.md` defines **WHO** does the work (persona, model, thinking discipline, scope).
- `SKILLS.md` defines **WHAT** discrete capabilities exist (and points to their `SKILL.md` files).
- `CLAUDE.md` defines **HOW** the project is operated regardless of who or what.

When agents reference skills, use the canonical kebab-case skill name (`code-review`, not `skill_code_review`). The registry in `SKILLS.md` is the source of truth for valid skill names.

---

## Skill Authoring Standards

All skills follow Anthropic's Skills format.

**Directory layout:**

```text
.claude/skills/<kebab-name>/
├── SKILL.md           (required)
├── scripts/           (optional — executable code)
├── references/        (optional — docs loaded on demand)
└── assets/            (optional — templates, fixtures, icons)
```

**SKILL.md frontmatter (only these fields are valid):**

```yaml
---
name: kebab-case-name          # Required. Must match directory name.
description: When this skill triggers and what it does. Be specific about contexts — Claude tends to undertrigger, so be a little "pushy" about when to use it. Required.
license: MIT                   # Optional
allowed-tools: bash, file_edit # Optional — restrict tools the skill can use
metadata:                      # Optional — arbitrary key/value
  version: 1.0.0
  owner: VASEY/AI
compatibility:                 # Optional — required tools/deps
  - tool: ffmpeg
    version: ">=4.0"
---
```

Do **not** put detailed specs, input/output schemas, or methodology in frontmatter — they belong in the Markdown body.

**Body rules:**

- Keep `SKILL.md` under ~500 lines. If approaching the limit, split into `references/` and link from the body.
- Use progressive disclosure: metadata is always loaded, body loads on trigger, `references/` and `scripts/` load on demand.
- For multi-domain skills, organize variants under `references/` (e.g. `references/aws.md`, `references/gcp.md`).
- Include at least one optimal use case and one anti-pattern in the body.

**Registry sync:** Whenever a skill is added, removed, or renamed under `.claude/skills/`, update `SKILLS.md` in the same commit. CI should fail if the two drift.

---

## README.md Spec

The README is the product's public face. Present it like a polished marketing page — not developer scratch notes. Every README must look like a production release that inspires confidence.

**Hero block (centered):**

- App icon or logo image with descriptive alt text
- Product name + one-line tagline
- shields.io badge row — include **all applicable**: build status, latest version/release tag, license, deploy status (Vercel/Netlify), test coverage, language/framework, PRs welcome, downloads

**Visual showcase:**

- Hero screenshot or animated screen capture (GIF/WebM) showing the app in use, with alt text
- Additional feature screenshots where they add clarity (annotated if useful)
- All images must have meaningful alt text — not "screenshot" but "Dashboard view showing real-time analytics"

**Features & history:**

- Feature list organized by capability area — not a flat wall of bullets. Group logically.
- "What's New" or version highlights section for the current release — what shipped, what changed, what's coming. Link to CHANGELOG.md for full history.
- Indicate feature maturity where applicable (stable, beta, experimental)

**Technical detail:**

- Tech stack (languages, frameworks, tools, infrastructure)
- Live demo link (prominent — near the top, not buried)
- Setup / Install / Run / Build / Test commands (copy-pasteable)
- Environment variables (reference `.env.example`, describe each var's purpose)
- Architecture overview with folder structure (when non-trivial)
- Deployment notes

**Footer:**

- Usage examples (CLI / API / UI)
- Contributing guidelines link
- License
- Credits / acknowledgments where appropriate

---

## Required Repo Files

- `LICENSE` (or explicit "All Rights Reserved")
- `CHANGELOG.md` — [Keep a Changelog](https://keepachangelog.com/) style. Upgrade notes for breaking changes.
- `SECURITY.md` — How to report vulnerabilities.
- `.editorconfig`, `.gitignore`, `.env.example`
- `CODE_OF_CONDUCT.md` (recommended)
- `AGENTS.md`, `SKILLS.md` — Standard agent/skill configuration (this system)
- Lockfiles current. Asset licenses documented when mixed.

---

## Workflow Orchestration

**Subagents:** For complex multi-file tasks, delegate via the Task tool. The lead agent coordinates; subagents inherit this CLAUDE.md. Match each subagent's model to its subtask (see Model Selection). Subagent definitions live in `.claude/agents/<name>.md`.

**Patterns:**

- **Parallel read** — Lead spawns N subagents to read disjoint file sets, returns summaries. Use Haiku.
- **Parallel verify** — Lead spawns one subagent per test suite or lint target. Use Haiku/Sonnet.
- **Specialist review** — Lead drafts changes, spawns a specialist subagent (security, accessibility, performance) for review. Use Opus/Sonnet for the specialist.
- **Plan-then-execute** — Lead writes the plan in plan mode, hands off to an executor subagent.

**Self-improvement loop:**

- After non-trivial debugging, append a lesson to `tasks/lessons.md` (what went wrong, what would have caught it earlier, what changed in the codebase or process).
- Track deferred work in `tasks/todo.md` with issue links.
- Review `tasks/lessons.md` at session start when picking up complex work.

**Plan mode is the default** for non-trivial tasks. For complex work, write the plan to `tasks/plan-<short-name>.md` first, then execute against it.

---

## Pre-Commit Self-Check

Before pushing, confirm in your own words:

1. What did I change, and why?
2. What did I verify? (lint, typecheck, tests, build, manual smoke test)
3. What could break? Did I cover it with a test or runbook note?
4. Did I update docs (`README`, `CHANGELOG`, ADRs, runbooks) that reference what I changed?
5. Did I update `AGENTS.md` / `SKILLS.md` if agent or skill behavior changed?
6. Is the commit message a Conventional Commit with what/why/how-verified?

If you can't answer all six confidently, don't push yet.
