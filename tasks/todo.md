# Task Plan

## Current Session — 2026-03-13: Fix Landing Page Performance & UI

### Completed

- [x] Update `CLAUDE.md` with app-specific project context
- [x] Extract 160 lines of inline CSS to `app/globals.css`
- [x] Move Google Fonts from CSS `@import` to `<link>` tags in `layout.tsx`
- [x] Fix header z-index (z-30) above hero content (z-10)
- [x] Remove `mt-[-5vh]` negative margin causing header overlap
- [x] Add `pointer-events-none` to hero heading for click-through
- [x] Fix non-functional "Docs" button — add `onClick` handler
- [x] Add typewriter animation to hero heading with blinking cursor
- [x] Optimize `AmbientField`: throttle to 30fps, reduce particles, add `isActive` prop
- [x] Create GitHub Pages deploy workflow (`.github/workflows/pages.yml`)
- [x] Update `next.config.ts` with conditional static export support
- [x] Add `Permissions-Policy` header to `vercel.json`
- [x] Fix ESLint errors (setState-in-effect, no-page-custom-font)
- [x] Run and pass: `npm run lint`, `npm run lint:md`, `npm run test:smoke`, `npm run build`
- [x] Update `CHANGELOG.md` with v0.4.0 entries
- [x] Update `tasks/lessons.md` with new patterns

### Review

All checks pass. Build compiles successfully. Landing page header is now above
hero text with proper z-index layering. Typing animation reveals heading
character-by-character. Canvas animation throttled to 30fps. CSS extracted from
inline injection to proper stylesheet.

---

## Previous Session — 2026-03-11: Repository Standards Compliance

### Completed

- [x] Create `CLAUDE.md` with senior staff engineer operating instructions
- [x] Create `tasks/` directory with `todo.md` and `lessons.md`
- [x] Update smoke-check script to include `CLAUDE.md` and `tasks/` files
- [x] Update `docs/MANIFEST.md` with new file entries
- [x] Update `README.md` to reflect Next.js app architecture and CLAUDE.md
- [x] Enhance CI workflow with ESLint, TypeScript check, and Next.js build
- [x] Update `CHANGELOG.md` with v0.3.0 entries
- [x] Verify Vercel and GitHub Pages deployment readiness
- [x] Run all tests and validate CI pipeline locally
