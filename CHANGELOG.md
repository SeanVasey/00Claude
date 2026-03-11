# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
