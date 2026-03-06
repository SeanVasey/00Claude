# 00Claude

A production-minded baseline repository with an integrated AI assistant
framework. Prioritizes security, maintainability, documentation quality, and
CI verification from day zero.

**Maintainer:** Sean Vasey
([vaseyai.com](https://www.vaseyai.com/) |
[GitHub](https://github.com/SeanVasey))

## Features

- **CLAUDE.md framework** — AI assistant operating standards, workflow
  orchestration, and verification protocols
- Professional baseline project files (`README`, `LICENSE`, `CHANGELOG`,
  `SECURITY`, Code of Conduct)
- Markdown linting and baseline smoke checks (17 required files)
- GitHub Actions CI on pull requests and `main` branch pushes
- Vercel-ready configuration with secure response headers
- Task tracking infrastructure (`tasks/todo.md`, `tasks/lessons.md`)
- Biographical and rights management documentation
- Documentation manifest for repository inventory

## Tech Stack

- Markdown for documentation
- Bash for smoke validation scripting
- Node.js + npm for linting automation
- GitHub Actions for CI
- Vercel configuration via `vercel.json`

## Setup

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Run checks

```bash
npm run lint:md
npm run test:smoke
npm test
```

## Environment Variables

Copy `.env.example` to `.env` for local development:

```bash
cp .env.example .env
```

Current documented variables:

- `APP_NAME`: App or repository display name.
- `NODE_ENV`: Environment mode (e.g., `development`, `production`).

## Architecture / Folder Structure

```text
.
├── .github/workflows/   # CI automation
├── docs/                # Supporting project documentation
│   ├── ABOUT.md         # Owner biographical information
│   ├── MANIFEST.md      # Repository file inventory
│   └── RIGHTS.md        # Licensing and rights management
├── logs/                # Runtime logs (git-ignored)
├── scripts/             # Validation helper scripts
├── tasks/               # Task tracking and lessons learned
│   ├── lessons.md       # Accumulated development insights
│   └── todo.md          # Active task plan
├── CHANGELOG.md
├── CLAUDE.md            # AI assistant framework
├── CODE_OF_CONDUCT.md
├── LICENSE
├── README.md
├── SECURITY.md
├── package.json
└── vercel.json
```

## Documentation

- [About the Owner](docs/ABOUT.md) — biographical information for Sean Vasey
- [Rights Management](docs/RIGHTS.md) — licensing, IP, and trademark details
- [Repository Manifest](docs/MANIFEST.md) — complete file inventory

## Deployment Notes (Vercel)

This repository includes a baseline `vercel.json` configured for clean URLs,
no trailing slashes, and secure default headers. Connect the repository to
Vercel and use the default build settings for static/documentation-first
projects.

## Usage Examples

Run all repository quality gates locally:

```bash
npm test
```

Run only the baseline file inventory check:

```bash
npm run test:smoke
```

## License

Licensed under the Apache License 2.0. Copyright 2026 Sean Vasey.
See [`LICENSE`](LICENSE) for details.
