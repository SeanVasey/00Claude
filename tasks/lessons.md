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

## 2026-03-13 — Landing Page Performance & UI

- **Never inject CSS via `dangerouslySetInnerHTML`.** It re-parses on every
  React render and blocks paint. Always use proper stylesheets (`globals.css`).
- **Load Google Fonts via `<link>` tags, not CSS `@import`.** CSS imports are
  render-blocking. Use `<link rel="preconnect">` + `<link>` with
  `display=swap` for non-blocking font loading.
- **Always give distinct z-index values to stacking elements.** Two elements
  with the same z-index rely on DOM order, which is fragile. Be explicit.
- **Canvas animations need frame throttling.** Uncapped `requestAnimationFrame`
  at 60fps with O(n^2) logic is wasteful. Throttle to 30fps and avoid
  `Math.hypot` in hot loops (use squared distance comparisons).
- **React 19 ESLint: avoid mutable variables in render.** Use pure functions
  with prefix-sum lookups instead of mutable counters in `.map()` callbacks.
- **React 19 ESLint: avoid `setState` directly in effects.** Use timer-based
  state updates (`setTimeout` returning cleanup) instead of synchronous
  `setState` in effect bodies.
