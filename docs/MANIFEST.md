# Repository Manifest

## Core Project Files

- `README.md`: project overview, setup, and usage.
- `LICENSE`: Apache 2.0 license terms for this project.
- `CHANGELOG.md`: release and change history.
- `SECURITY.md`: responsible disclosure instructions.
- `CODE_OF_CONDUCT.md`: contributor behavior expectations.
- `CLAUDE.md`: AI operating instructions for senior staff engineer workflow.
- `PLAN.md`: multi-phase implementation roadmap.

## Application

- `app/layout.tsx`: Next.js root layout with metadata.
- `app/page.tsx`: home page rendering AgentVault component.
- `app/globals.css`: TailwindCSS imports and global styles.
- `app/api/anthropic/message/route.ts`: Claude API proxy endpoint.
- `components/AgentVault.tsx`: main IDE component with AI-powered editing.

## Automation & Tooling

- `.github/workflows/ci.yml`: CI checks for linting, type checking, smoke
  tests, and build verification.
- `package.json`: local command entry points for development, linting, and
  testing.
- `scripts/smoke-check.sh`: verifies required baseline files and project
  metadata.

## Platform Configuration

- `vercel.json`: deployment configuration for Vercel with security headers.
- `next.config.ts`: Next.js framework configuration.
- `tsconfig.json`: TypeScript compiler settings.
- `eslint.config.mjs`: ESLint flat config with Next.js rules.
- `postcss.config.mjs`: PostCSS with TailwindCSS plugin.
- `.editorconfig`: editor settings (UTF-8, 2-space indent, LF).
- `.markdownlint-cli2.jsonc`: markdown linting configuration.
- `.env.example`: example local environment variables.
- `.gitignore`: files excluded from version control.

## Task Tracking

- `tasks/todo.md`: active task plan with checkable items.
- `tasks/lessons.md`: accumulated patterns from corrections and mistakes.

## Static Assets

- `public/`: SVG icons (file, globe, next, vercel, window).
- `app/favicon.ico`: site favicon.
