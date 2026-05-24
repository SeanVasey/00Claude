# SKILLS.md

Skill registry for **00CLAUDE**. Defines **what** discrete capabilities exist
in this repo and where each `SKILL.md` lives.

Skills here follow the [Anthropic Skills format](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview):
each skill is a self-contained directory under `.claude/skills/<kebab-name>/`
with a `SKILL.md` containing YAML frontmatter and a Markdown body. The
registry below indexes them and CI verifies the registry stays in sync.

Personas in [`AGENTS.md`](./AGENTS.md) reference skills by canonical kebab-case
name. Authoring rules live in [`CLAUDE.md`](./CLAUDE.md) under "Skill Authoring
Standards".

---

## Skill Index

| Skill | Path | Owner Persona(s) | Purpose |
|-------|------|------------------|---------|
| [`verify`](.claude/skills/verify/SKILL.md) | `.claude/skills/verify/` | `lead-engineer`, `implementer`, `release-engineer` | Run full verification suite (lint → typecheck → markdown → smoke → build) and report a pass/fail summary. |
| [`code-review`](.claude/skills/code-review/SKILL.md) | `.claude/skills/code-review/` | `reviewer`, `lead-engineer` | Review the current diff for correctness, security, accessibility, and consistency. |
| [`security-review`](.claude/skills/security-review/SKILL.md) | `.claude/skills/security-review/` | `security-specialist` | Targeted security audit of pending changes: secrets, auth, RLS, headers, dependencies. |

---

## Skill Authoring Rules

Repeat of the contract in `CLAUDE.md` so this file is independently
readable. The canonical wording lives in `CLAUDE.md`.

- Directory name and `name:` field in frontmatter **must match** and **must be
  kebab-case**.
- Frontmatter is limited to: `name`, `description`, `license`, `allowed-tools`,
  `metadata`, `compatibility`. No other keys.
- `description` is the trigger contract — be specific about *when* the skill
  fires. Claude tends to under-trigger; lean pushy.
- Body under 500 lines. Overflow goes to `references/`.
- Include at least one optimal use case and one anti-pattern in the body.
- Update this registry in the same commit that adds, removes, or renames a
  skill directory. `npm run test:smoke` validates the link.

---

## Adding a Skill

1. Create `.claude/skills/<kebab-name>/SKILL.md` with valid frontmatter.
2. Add a row to the **Skill Index** table above.
3. Add the skill name to the relevant persona's `skills:` list in
   [`AGENTS.md`](./AGENTS.md).
4. Run `npm test` to verify the smoke check passes.
5. Open a PR with the body explaining the trigger contract and how it differs
   from existing skills.

---

## Removing or Renaming a Skill

1. Remove or rename the directory under `.claude/skills/`.
2. Update the **Skill Index** table.
3. Remove the skill name from every persona that listed it in
   [`AGENTS.md`](./AGENTS.md).
4. Note the change in `CHANGELOG.md` under `### Removed` or `### Changed`.
