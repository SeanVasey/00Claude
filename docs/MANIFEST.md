# Repository Manifest

## Core Project Files

- `README.md`: project overview, setup, and usage.
- `LICENSE`: Apache 2.0 license terms for this project.
- `CHANGELOG.md`: release and change history.
- `SECURITY.md`: responsible disclosure instructions.
- `CODE_OF_CONDUCT.md`: contributor behavior expectations.
- `CLAUDE.md`: project-level behavioral contract — principles, standards,
  verification, structure.
- `AGENTS.md`: agent persona registry — who performs work, with what model,
  with what authority.
- `SKILLS.md`: skill registry — index of `.claude/skills/*/SKILL.md` entries.
- `PLAN.md`: multi-phase implementation roadmap.

## Application

- `app/layout.tsx`: Next.js root layout with metadata and font preconnect.
- `app/page.tsx`: home page rendering AgentVault component.
- `app/globals.css`: TailwindCSS imports and global styles.
- `app/api/anthropic/message/route.ts`: Claude API proxy endpoint.
- `components/AgentVault.tsx`: main IDE component with AI-powered editing.

## Claude Code Configuration

- `.claude/settings.json`: permissions allow/deny lists and env.
- `.claude/agents/lead-engineer.md`: senior staff engineer persona (Opus).
- `.claude/agents/implementer.md`: bounded-scope execution persona (Sonnet).
- `.claude/agents/researcher.md`: read-only research persona (Haiku).
- `.claude/agents/reviewer.md`: independent code reviewer (Sonnet).
- `.claude/agents/security-specialist.md`: security audit specialist (Opus).
- `.claude/agents/ux-specialist.md`: UX and accessibility specialist (Sonnet).
- `.claude/agents/release-engineer.md`: release and CI/CD persona (Sonnet).
- `.claude/skills/verify/SKILL.md`: full verification suite runner.
- `.claude/skills/code-review/SKILL.md`: structured diff review.
- `.claude/skills/security-review/SKILL.md`: security audit of pending changes.

## Automation & Tooling

- `.github/workflows/ci.yml`: CI checks — markdown lint, ESLint, typecheck,
  smoke check, Next.js build, and `npm audit --audit-level=high`.
- `.github/workflows/pages.yml`: GitHub Pages static-export deploy workflow.
- `package.json`: local command entry points for development, linting,
  typecheck, and testing.
- `scripts/smoke-check.sh`: verifies required baseline files and validates
  that the `SKILLS.md` registry stays in sync with `.claude/skills/`.
- `scripts/generate-icons.py`: rasterizes the master SVG to the full PWA
  icon suite (transparent backgrounds preserved).

## Platform Configuration

- `vercel.json`: deployment configuration for Vercel with security headers
  (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`).
- `next.config.ts`: Next.js framework configuration with conditional
  GitHub Pages static export when `GITHUB_PAGES=true`.
- `tsconfig.json`: TypeScript compiler settings.
- `eslint.config.mjs`: ESLint flat config with Next.js core-web-vitals rules.
- `postcss.config.mjs`: PostCSS with TailwindCSS plugin.
- `.editorconfig`: editor settings (UTF-8, 2-space indent, LF).
- `.markdownlint-cli2.jsonc`: markdown linting configuration.
- `.env.example`: example local environment variables.
- `.gitignore`: files excluded from version control.

## Task Tracking

- `tasks/todo.md`: active task plan with checkable items.
- `tasks/lessons.md`: accumulated patterns from corrections and mistakes.

## Static Assets

- `public/manifest.json`: PWA web manifest with maskable + any icon entries.
- `public/favicon.ico`: site favicon (also at `app/favicon.ico`).
- `public/icons/`: full PWA icon suite generated from
  `00Claude-refined.svg` — 1024, 512, 384, 192, 144, 96, apple-touch
  (180/167/152/120), favicon-16/32, and the canonical SVG.
- `public/*.svg`: framework default SVG icons (file, globe, next, vercel,
  window).
