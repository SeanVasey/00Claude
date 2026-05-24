---
name: security-review
description: Targeted security audit of pending changes — auth, sessions, input validation, API access control, CORS, webhooks, secret handling, dependency vulnerabilities, and security headers. Auto-triggers on diffs touching app/api/**, middleware.ts, vercel.json, package.json, or content matching auth|token|secret|key|cors. Blocks merge on unresolved high/critical findings.
license: Apache-2.0
allowed-tools: Read, Glob, Grep, Bash, WebFetch
metadata:
  version: 1.0.0
  owner: 00CLAUDE
---

# security-review

Security audit aligned with the Security standards in `CLAUDE.md` and the
OWASP Top 10. Produces a findings list with severity, file/line citations,
and remediation suggestions.

## When to use

- Any diff touching `app/api/**`, `middleware.ts`, `vercel.json`,
  `package.json`, `package-lock.json`, `.env.example`, or `next.config.ts`
- Any content match for `auth|token|secret|key|password|cors|webhook|signature`
- Before tagging a release
- On a clean schedule (weekly) regardless of diff
- When the user asks for "security review" or "audit"

## When NOT to use

- Read-only documentation edits with no code change
- Pure-UI cosmetic changes that don't touch network, auth, or input handling

## Steps

1. **Secrets scan**
   - `grep -nIE 'sk_live_|sk_test_|API_KEY|SECRET|TOKEN|BEARER' -- ':!*.lock' ':!*.md' ':!.env.example'`
   - Verify no `.env*` file other than `.env.example` is staged.
2. **Dependencies**
   - `npm audit --audit-level=high` — fail on any high/critical.
   - For each finding, identify whether a non-breaking patch exists. If yes,
     apply via `npm audit fix` (no `--force`). If no, document in
     `tasks/lessons.md` and decide whether to pin a workaround.
3. **Auth & sessions** (when relevant)
   - JWT lifetime ≤7 days, refresh token rotation present.
   - Auth check in middleware AND server action — defense in depth.
   - No client-side auth-only gating.
4. **Input & data**
   - Every external input (query, body, header, file) parsed through Zod or
     equivalent.
   - File uploads validated by signature (magic bytes), not extension.
   - Redirect URLs validated against an allow-list.
5. **API & access control**
   - Rate limiting on every public endpoint.
   - CORS allow-list (no `*` in production).
   - Webhook signature verification before processing.
   - Server-side permission check on every mutating endpoint.
6. **Production hardening**
   - `vercel.json` headers: `X-Content-Type-Options`, `X-Frame-Options`,
     `Referrer-Policy`, `Permissions-Policy` — all present.
   - No `console.log` of user data or secrets in production paths
     (`grep -nrE 'console\.(log|debug|info)' app components lib`).
   - AI API cost caps in code (`max_tokens` set on every Anthropic call).
7. **Supply chain**
   - Lockfile committed and current.
   - No `dependencies` with `*` or `latest` ranges.

## Output format

```text
## Security review — <branch-name>

Verdict: BLOCK (1 high) | OK (0 high) | ADVISORY (0 high, N moderate)

### High / Critical
- [path:line] CWE-XXX — description — remediation

### Moderate
- [path:line] — description — remediation

### Informational
- ...

### npm audit (high+)
- 0 high, 0 critical
- (2 moderate transitive in postcss — accepted: only fix is next@9 downgrade)
```

## Anti-pattern

Running `npm audit fix --force` to silence the report. `--force` performs
semver-major downgrades or upgrades that can silently break the app and
introduce *worse* vulnerabilities. Patch only via `npm audit fix` (no flag);
escalate or document the rest.
