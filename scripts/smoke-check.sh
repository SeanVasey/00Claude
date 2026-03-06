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
  "docs/MANIFEST.md"
  "docs/ABOUT.md"
  "docs/RIGHTS.md"
  "tasks/todo.md"
  "tasks/lessons.md"
  "logs/.gitkeep"
  ".github/workflows/ci.yml"
  "vercel.json"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing required file: $file"
    exit 1
  fi
done

echo "All required baseline files are present."
