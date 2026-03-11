# Lessons Learned

Accumulated patterns from corrections and mistakes. Review at session start.

## 2026-03-11 — Initial Setup

- **Always update all dependent files together.** When adding a new required
  file (like `CLAUDE.md`), also update the smoke-check script, `MANIFEST.md`,
  `README.md`, and `CHANGELOG.md` in the same commit/PR.
- **CI must include the build step.** A lint-only CI pipeline gives false
  confidence. Always include `npm run build` in the workflow for Next.js
  projects.
- **Keep the folder structure diagram in README current.** Stale architecture
  diagrams erode trust in documentation.
