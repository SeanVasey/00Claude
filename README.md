<p align="center">
  <img src="public/icon-512.png" alt="00CLAUDE app icon" width="128" height="128" />
</p>

<h1 align="center">00CLAUDE — The Not-so Secret Agent</h1>

<p align="center">
  A library and IDE for Agent Skills, <code>AGENTS.md</code>, and <code>CLAUDE.md</code> files.<br />
  Discover, curate, version, test, and deploy agent capabilities from a single interface.
</p>

<p align="center">
  <a href="https://github.com/SeanVasey/00Claude/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/SeanVasey/00Claude/ci.yml?branch=main&label=CI&logo=github" alt="CI status" /></a>
  <img src="https://img.shields.io/badge/version-0.4.0-blue?logo=semantic-release" alt="Version 0.4.0" />
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-Apache_2.0-green" alt="Apache 2.0 License" /></a>
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
</p>

---

## Features

- **AgentVault IDE** — AI-powered code generation with live markdown preview
- **Anthropic API integration** — Claude-based agent skill authoring with server-side proxy
- **Glassmorphic UI** — Spectrum gradient accents, ambient canvas animations, custom typography
- **Document management** — Create, edit, version, and organize `CLAUDE.md`, `AGENTS.md`, and skill files
- **Markdown linting** — Built-in quality gates for documentation standards
- **CI/CD pipeline** — GitHub Actions on every PR and `main` push
- **Vercel-ready** — Production config with secure response headers
- **PWA support** — Installable with app icons and web manifest

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.1.6 (App Router) |
| Language | TypeScript 5 |
| UI | React 19.2.3, Tailwind CSS v4 |
| Icons | lucide-react |
| Linting | ESLint 9, markdownlint-cli2 |
| CI | GitHub Actions |
| Deployment | Vercel (primary), GitHub Pages |
| Package Manager | npm (Node.js 20+) |

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` to access the AgentVault IDE.

### Build

```bash
npm run build
```

### Run Checks

```bash
npm test           # lint:md + smoke checks
npm run lint       # ESLint
npm run lint:md    # Markdown linting
npm run test:smoke # File inventory check
```

## Environment Variables

Copy `.env.example` to `.env` for local development:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `APP_NAME` | App or repository display name |
| `NODE_ENV` | Environment mode (`development` / `production`) |
| `ANTHROPIC_API_KEY` | Anthropic API key (server-side only) |

## Architecture

```text
.
├── .github/workflows/   # CI automation
├── app/                 # Next.js App Router pages and API routes
│   ├── api/anthropic/   # Claude API proxy endpoint
│   ├── layout.tsx       # Root layout (fonts, metadata)
│   └── page.tsx         # Home page
├── components/          # React UI components
│   └── AgentVault.tsx   # Main IDE component (all views)
├── docs/                # Supporting project documentation
├── public/              # Static assets (icons, SVGs, manifest)
├── scripts/             # Validation helper scripts
├── tasks/               # Task tracking (todo.md, lessons.md)
├── CLAUDE.md            # AI operating instructions
├── CHANGELOG.md         # Release history
├── CODE_OF_CONDUCT.md   # Contributor conduct expectations
├── LICENSE              # Apache 2.0
├── SECURITY.md          # Vulnerability disclosure policy
├── package.json         # Scripts and dependencies
└── vercel.json          # Deployment configuration
```

## Deployment

### Vercel

This repository includes a `vercel.json` configured with clean URLs, no
trailing slashes, and secure default headers (`X-Content-Type-Options`,
`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`). Connect the
repository to Vercel and deploy using the default Next.js build settings.

### GitHub Pages

The CI workflow includes a build verification step. For GitHub Pages static
export, configure `next.config.ts` with `output: 'export'` and enable Pages
in repository settings pointing to the `gh-pages` branch or GitHub Actions
deployment.

## Contributing

1. Fork the repo and create a feature branch
2. Make your changes following the standards in [CLAUDE.md](CLAUDE.md)
3. Run `npm test` and `npm run build` to verify
4. Open a pull request with a clear description

## License

[Apache 2.0](LICENSE)

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting.
