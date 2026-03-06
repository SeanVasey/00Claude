# Repository Manifest

## Core Project Files

- `README.md`: project overview, setup, and usage.
- `LICENSE`: Apache 2.0 license terms. Copyright 2026 Sean Vasey.
- `CHANGELOG.md`: release and change history.
- `SECURITY.md`: responsible disclosure instructions.
- `CODE_OF_CONDUCT.md`: contributor behavior expectations.
- `CLAUDE.md`: AI assistant framework, guiding principles, and workflow
  standards.

## Documentation

- `docs/MANIFEST.md`: this file; repository inventory.
- `docs/ABOUT.md`: biographical documentation for the repository owner.
- `docs/RIGHTS.md`: licensing, intellectual property, and rights management.

## Task Management

- `tasks/todo.md`: active task plan with checkable items. Updated per session.
- `tasks/lessons.md`: accumulated patterns from corrections and mistakes.

## Automation & Tooling

- `.github/workflows/ci.yml`: CI checks for markdown quality, smoke tests, and
  repository completeness.
- `package.json`: local command entry points for linting and smoke checks.
- `scripts/smoke-check.sh`: verifies required baseline files and project
  metadata (17 files).

## Platform Configuration

- `vercel.json`: baseline deployment configuration for Vercel-hosted static
  content.
- `.env.example`: example local environment variables.

## Logs

- `logs/.gitkeep`: directory placeholder for runtime logs (contents ignored
  by `.gitignore`).
