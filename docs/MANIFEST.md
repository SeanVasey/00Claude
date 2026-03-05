# Repository Manifest

## Core Project Files

- `README.md`: project overview, setup, and usage.
- `LICENSE`: Apache 2.0 license terms for this project.
- `CHANGELOG.md`: release and change history.
- `SECURITY.md`: responsible disclosure instructions.
- `CODE_OF_CONDUCT.md`: contributor behavior expectations.

## Automation & Tooling

- `.github/workflows/ci.yml`: CI checks for markdown quality, smoke tests, and
  repository completeness.
- `package.json`: local command entry points for linting and smoke checks.
- `scripts/smoke-check.sh`: verifies required baseline files and project
  metadata.

## Platform Configuration

- `vercel.json`: baseline deployment configuration for Vercel-hosted static
  content.
- `.env.example`: example local environment variables.
