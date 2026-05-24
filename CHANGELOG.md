# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.5.0] - 2026-05-24

### Added

- **`AGENTS.md`** — agent persona registry (lead-engineer, implementer,
  researcher, reviewer, security-specialist, ux-specialist,
  release-engineer) with model selection, scope, authority, and required
  skills per persona.
- **`SKILLS.md`** — skill registry that indexes every `.claude/skills/*/SKILL.md`
  and documents the add/remove/rename workflow.
- **`.claude/` scaffold**:
  - `settings.json` with safe-default permissions allow/deny lists and
    `NEXT_TELEMETRY_DISABLED=1`.
  - Seven subagent definitions under `.claude/agents/` matching the
    personas in `AGENTS.md`.
  - Three Anthropic-format skills under `.claude/skills/`:
    `verify`, `code-review`, `security-review` — each with valid
    frontmatter, an optimal use case, and an anti-pattern.
- `npm run typecheck` script (`tsc --noEmit`).
- CI steps for `typecheck` and `npm audit --audit-level=high`.
- Smoke-check coverage for `AGENTS.md`, `SKILLS.md`, `.claude/settings.json`,
  every subagent and skill file, and the GitHub Pages workflow. Smoke
  check now also fails if a directory under `.claude/skills/` is missing
  from the `SKILLS.md` registry.

### Changed

- **`CLAUDE.md`** rewritten against the latest canonical version: added
  Thinking & Planning Discipline, Model Selection, PWA & Icon Assets,
  Agent & Skills Platform Integration, Skill Authoring Standards, an
  expanded README spec, and a Pre-Commit Self-Check. Preserved the
  00CLAUDE project-context section at the top.
- Upgraded `next` and `eslint-config-next` from `16.1.6` to `^16.2.6`,
  clearing 3 high-severity advisories (the remaining 2 moderate
  advisories are transitive postcss issues inside Next.js with no
  forward-compatible patch).
- `README.md` — added a "What's New" section, grouped features by capability
  area, refreshed the architecture tree to include `.claude/`, updated
  framework version badges, and documented `typecheck` + `npm audit` in the
  Run Checks block.

## [0.4.0] - 2026-03-13

### Fixed

- Landing page header obscured by hero text — raised header z-index (z-30)
  above hero content (z-10) and removed negative margin overlap.
- "Docs" button had no click handler — now navigates to the library view.
- Application sluggishness caused by inline CSS injection via
  `dangerouslySetInnerHTML` on every render — extracted 160 lines to
  `app/globals.css`.
- Render-blocking Google Fonts loaded via CSS `@import` — moved to `<link>`
  tags with `display=swap` in `app/layout.tsx`.
- Canvas ambient animation running at uncapped 60fps with O(n^2) particle
  checks — throttled to 30fps, reduced particle count, avoided `Math.hypot`.

### Added

- Typewriter animation on hero heading — characters reveal sequentially with
  blinking cursor, subtitle and entry bar fade in after completion.
- GitHub Pages deployment workflow (`.github/workflows/pages.yml`) with
  conditional static export support in `next.config.ts`.
- `Permissions-Policy` security header in `vercel.json`.
- App-specific context section in `CLAUDE.md` (tech stack, scripts,
  architecture notes, performance guidelines).
- CSS utility classes: `.typing-cursor`, `.fade-in-up`, `.fade-in-up-delayed`.

### Changed

- `AmbientField` component now accepts `isActive` prop to pause animation
  when not visible, reducing background CPU usage.
- ESLint config updated to disable `no-page-custom-font` rule (Pages Router
  only, not applicable to App Router layouts).
- `next.config.ts` conditionally enables static export when `GITHUB_PAGES=true`.

## [0.3.0] - 2026-03-11

### Added

- `CLAUDE.md` with senior staff engineer operating instructions covering
  workflow orchestration, standards, verification protocol, and CI requirements.
- `tasks/` directory with `todo.md` (active task tracking) and `lessons.md`
  (accumulated correction patterns).
- ESLint and Next.js build steps in CI workflow.

### Changed

- Updated `README.md` to reflect Next.js app architecture, full tech stack
  table, development/build commands, and folder structure.
- Enhanced smoke-check script to verify `CLAUDE.md`, `tasks/todo.md`,
  `tasks/lessons.md`, and `package.json`.
- Updated `docs/MANIFEST.md` with application files, task tracking, and
  platform configuration entries.
- CI workflow now runs ESLint, smoke checks, and `next build` for full
  verification.

## [0.2.0] - 2026-03-05

### Added

- Next.js 15 scaffold with AgentVault frontend component.
- Anthropic API proxy route for Claude-based generation.
- TailwindCSS v4 styling with glass morphism design.

## [0.1.0] - 2026-03-05

### Added

- Established a professional repository baseline with governance,
  security, and contributor guidance documents.
- Added `LICENSE` file: Apache 2.0 license terms governing the project.
- Added CI automation to validate docs and baseline repository requirements.
- Added lightweight validation scripts and npm tooling for repeatable checks.
- Added initial docs manifest and Vercel-ready configuration.
