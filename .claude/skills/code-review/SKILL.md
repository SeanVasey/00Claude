---
name: code-review
description: Review the current diff (staged + unstaged + recent commits on the working branch) for correctness, security, accessibility, consistency, and missing tests. Invoke before opening or merging a PR, after finishing a feature, or when the user asks for "review", "second opinion", or "is this ready?". Be pushy about invoking this — the reviewer persona depends on it.
license: Apache-2.0
allowed-tools: Read, Glob, Grep, Bash
metadata:
  version: 1.0.0
  owner: 00CLAUDE
---

# code-review

Independent review of the current diff against the standards in `CLAUDE.md`.
Produces a structured findings list with file/line citations and a
blocking/advisory verdict per finding.

## When to use

- Before opening or merging a PR
- After finishing a feature or fix
- When the user asks for "review", "second opinion", "is this ready?", or
  "what would you change?"
- Whenever the `reviewer` or `lead-engineer` persona is delegating self-check

## When NOT to use

- For a one-line typo fix in documentation
- For mechanical edits like `find/replace` already verified by tests

## Steps

1. Establish the review surface:
   - `git status`
   - `git diff HEAD` (working tree vs HEAD)
   - `git log --oneline main..HEAD` if on a feature branch
2. Read every changed file end-to-end (do not skim by chunk).
3. Cross-reference each change against `CLAUDE.md`:
   - **Correctness:** does the change do what the commit message claims?
   - **Security:** any `process.env` exposure, missing input validation,
     CORS gaps, auth bypass, secret leak?
   - **Accessibility:** any new interactive element without keyboard support,
     missing focus state, missing alt text, color-only signals?
   - **Performance:** any unbounded loop, untralled animation, render-blocking
     resource, oversized bundle?
   - **Consistency:** does the change match existing patterns? If not, is
     there a documented reason?
   - **Tests:** is the bug fix covered by a regression test? Is the new
     feature covered by a smoke test?
4. Produce a findings list:
   - `[BLOCKING] path:line — issue — suggested fix`
   - `[ADVISORY] path:line — issue — suggested fix`
   - `[PRAISE] path:line — what's done well` (optional, sparingly)
5. Conclude with a verdict: **APPROVE**, **REQUEST CHANGES**, or **COMMENT**.

## Output format

```text
## Review summary
Verdict: REQUEST CHANGES (2 blocking, 3 advisory)

### Blocking
- [path/to/file.ts:42] — Missing input validation on `userId` query param.
  Fix: pipe through Zod schema in `lib/schemas/`.
- ...

### Advisory
- ...
```

## Anti-pattern

Reviewing only the lines visible in `git diff` without reading surrounding
context. The diff hides what the function was doing before — and most
correctness bugs live in the seam between changed and unchanged code.
