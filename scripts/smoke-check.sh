#!/usr/bin/env bash
set -euo pipefail

required_files=(
  ".editorconfig"
  ".gitignore"
  ".env.example"
  "LICENSE"
  "README.md"
  "CHANGELOG.md"
  "SECURITY.md"
  "CODE_OF_CONDUCT.md"
  "CLAUDE.md"
  "AGENTS.md"
  "SKILLS.md"
  "docs/MANIFEST.md"
  "tasks/todo.md"
  "tasks/lessons.md"
  ".github/workflows/ci.yml"
  ".github/workflows/pages.yml"
  ".claude/settings.json"
  ".claude/agents/lead-engineer.md"
  ".claude/skills/verify/SKILL.md"
  ".claude/skills/code-review/SKILL.md"
  ".claude/skills/security-review/SKILL.md"
  "vercel.json"
  "next.config.ts"
  "tsconfig.json"
  "package.json"
)

missing=0
for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file"
    missing=1
  fi
done

if (( missing != 0 )); then
  exit 1
fi

# Skill registry sync: every directory under .claude/skills/ must be listed in SKILLS.md.
if [[ -d ".claude/skills" ]]; then
  for dir in .claude/skills/*/; do
    name="$(basename "$dir")"
    if ! grep -q "\.claude/skills/${name}/" SKILLS.md; then
      echo "Skill '${name}' is missing from SKILLS.md registry"
      missing=1
    fi
    if [[ ! -f "${dir}SKILL.md" ]]; then
      echo "Skill '${name}' is missing SKILL.md"
      missing=1
    fi
  done
fi

if (( missing != 0 )); then
  exit 1
fi

echo "All required baseline files are present and skill registry is in sync."
