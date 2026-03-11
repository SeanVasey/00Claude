# 00CLAUDE — The Not-so Secret Agent

A library and IDE for Agent Skills, `AGENTS.md`, and `CLAUDE.md` files.
Discover, curate, version, test, and deploy agent capabilities from a single
interface.

## Features

- Full-stack Next.js 15 application with React 19 and TypeScript
- AgentVault IDE with AI-powered code generation and markdown preview
- Anthropic API integration for Claude-based agent skill authoring
- Glass morphism UI with spectrum gradient accents and custom typography
- Markdown linting and baseline smoke checks
- GitHub Actions CI on pull requests and `main` branch pushes
- Vercel-ready configuration with secure response headers
- `CLAUDE.md` operating instructions for AI-assisted development

## Tech Stack

| Layer       | Technology                     |
| ----------- | ------------------------------ |
| Framework   | Next.js 16.1.6 (App Router)    |
| Language    | TypeScript 5                   |
| UI          | React 19.2.3, TailwindCSS v4  |
| Icons       | lucide-react                   |
| Linting     | ESLint 9, markdownlint-cli2   |
| CI          | GitHub Actions                 |
| Deployment  | Vercel                         |
| Package Mgr | npm (Node.js 20+)             |

## Setup

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

### Build

```bash
npm run build
```

### Run checks

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

| Variable            | Description                                    |
| ------------------- | ---------------------------------------------- |
| `APP_NAME`          | App or repository display name                 |
| `NODE_ENV`          | Environment mode (`development`, `production`) |
| `ANTHROPIC_API_KEY` | Anthropic API key (server-side only)           |

## Architecture

```text
.
├── .github/workflows/   # CI automation
├── app/                 # Next.js App Router pages and API routes
│   ├── api/anthropic/   # Claude API proxy endpoint
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # React UI components
│   └── AgentVault.tsx   # Main IDE component
├── docs/                # Supporting project documentation
├── public/              # Static assets (SVG icons)
├── scripts/             # Validation helper scripts
├── tasks/               # Task tracking (todo.md, lessons.md)
├── CLAUDE.md            # AI operating instructions
├── CHANGELOG.md         # Release history
├── CODE_OF_CONDUCT.md   # Contributor conduct expectations
├── LICENSE              # Apache 2.0
├── PLAN.md              # Implementation roadmap
├── README.md            # This file
├── SECURITY.md          # Vulnerability disclosure policy
├── package.json         # Scripts and dependencies
└── vercel.json          # Deployment configuration
```

## Deployment

### Vercel

This repository includes a `vercel.json` configured with clean URLs, no
trailing slashes, and secure default headers (`X-Content-Type-Options`,
`X-Frame-Options`, `Referrer-Policy`). Connect the repository to Vercel and
deploy using the default Next.js build settings.

### GitHub Pages

The CI workflow includes a build verification step. For GitHub Pages static
export, configure `next.config.ts` with `output: 'export'` and enable Pages
in repository settings pointing to the `gh-pages` branch or GitHub Actions
deployment.

## Usage

Run all repository quality gates locally:

```bash
npm test
```

Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` to access the AgentVault IDE.
