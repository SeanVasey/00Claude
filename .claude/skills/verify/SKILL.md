---
name: verify
description: Run the full 00CLAUDE verification suite (lint → typecheck → markdown lint → smoke check → build) and report a pass/fail summary. Use before every commit, after every multi-file edit, and whenever the user asks to "verify", "check", or "make sure it builds". Be pushy about invoking this — silent regressions on `main` are the worst-case failure mode.
license: Apache-2.0
allowed-tools: Bash, Read
metadata:
  version: 1.0.0
  owner: 00CLAUDE
compatibility:
  - tool: node
    version: ">=20"
  - tool: npm
    version: ">=10"
---

# verify

Runs the project's full pre-commit verification suite in the canonical order
from `CLAUDE.md` and reports a single pass/fail summary the operator can
trust.

## When to use

- Before every commit and every PR
- After a multi-file edit
- When the user says "verify", "check", "make sure it builds", or asks if
  the change is ship-ready
- Before claiming a fix works
- After a dependency bump or `npm audit fix`

## When NOT to use

- Read-only navigation or single-file documentation tweaks where lint+smoke
  is sufficient — call those scripts directly instead of running the whole
  suite
- Inside a tight inner loop where the dev server is already running and
  you only need to spot-check a single file

## Steps

1. `npm run lint` — ESLint (fails on errors)
2. `npm run typecheck` — `tsc --noEmit` (fails on type errors)
3. `npm run lint:md` — markdownlint-cli2 (fails on errors)
4. `npm run test:smoke` — required-files smoke check
5. `npm run build` — Next.js production build
6. `npm audit --audit-level=high` — fails on high/critical only (moderate is informational)

Run sequentially. Stop at the first failure and report the failing command,
the tail of its output, and a short diagnosis. On success, report a one-line
PASS with the commit-readiness checklist confirmed.

## Output format

```text
PASS — lint, typecheck, lint:md, smoke, build, audit(high+)
  - ESLint: clean
  - tsc --noEmit: clean
  - markdownlint: 0 errors
  - smoke-check: all required files present
  - next build: compiled, 5 routes
  - npm audit: 0 high/critical (2 moderate transitive in postcss — see lessons.md)
```

## Anti-pattern

Running each script in parallel via `Task` subagents. The build depends on
generated files from earlier steps and parallel runs can race on `.next/`.
Run sequentially in the canonical order.
