# 00CLAUDE Implementation Plan

## Overview

Build 00CLAUDE — a Next.js App Router application providing a versioned library
and IDE for Agent Skills, AGENTS.md, and CLAUDE.md files. Vercel SaaS mode with
Supabase persistence. Artifact mode deferred to Phase 2.

## Decisions

- **Init**: Use `create-next-app` in temp dir, merge into repo preserving governance files
- **Supabase**: Document both local (Docker) and remote setup paths
- **Runtime**: Vercel SaaS only for this phase
- **Styling**: TailwindCSS v4 + shadcn/ui (New York style)
- **Editor**: Monaco via `@monaco-editor/react` with `next/dynamic` (ssr: false)
- **Auth**: Supabase Auth (email + Google OAuth)
- **Validation**: Zod for all schemas and manifests

---

## Phase 1: Next.js Scaffold + Governance Merge

**Goal**: Transform baseline repo into a working Next.js 15 project.

### Steps

1. Run `npx create-next-app@latest` in a temp directory with flags:
   `--typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*"`
2. Copy Next.js files into the repo:
   - `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
   - `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `tailwind.config.ts`
   - `next-env.d.ts`, `public/` directory
3. Merge `package.json`: keep existing metadata (name, version, private, description),
   add Next.js dependencies and scripts, preserve `markdownlint-cli2` devDep
4. Update `.gitignore` to add Next.js entries (`.next/`, `out/`)
5. Update `vercel.json` to add Next.js framework preset
6. Update `smoke-check.sh` to include new required files (`next.config.ts`, `tsconfig.json`)
7. Update `.markdownlint-cli2.jsonc` to exclude auto-generated files
8. Install dependencies with `npm install`
9. Verify `npm run dev` builds successfully

### Files Created

- `app/layout.tsx` — root layout with html/body, metadata
- `app/page.tsx` — landing page placeholder
- `app/globals.css` — Tailwind directives + custom CSS tokens
- `next.config.ts` — Next.js configuration
- `tsconfig.json` — TypeScript configuration
- `postcss.config.mjs` — PostCSS with Tailwind
- `tailwind.config.ts` — Tailwind theme with custom colors
- `public/` — static assets directory

### Files Modified

- `package.json` — add Next.js deps and scripts
- `.gitignore` — add `.next/`, `out/`
- `vercel.json` — add framework config
- `scripts/smoke-check.sh` — add new required files
- `.env.example` — add all env var templates

---

## Phase 2: shadcn/ui + Design System + Brand Components

**Goal**: Set up component library and the futuristic minimalist visual language.

### Steps

1. Initialize shadcn/ui: `npx shadcn@latest init`
   - Style: New York
   - Base color: Zinc (monochrome charcoal)
   - CSS variables: yes
2. Install core shadcn components:
   `button, input, dialog, dropdown-menu, tabs, badge, card, separator, toast,
   avatar, command, popover, select, sheet, tooltip, scroll-area, skeleton`
3. Create design tokens in `app/globals.css`:
   - Monochrome base palette (charcoal + white + glass)
   - Spectrum accent gradient: amber → orange → red → magenta → violet
   - Glassmorphism utility classes
4. Create brand components:
   - `components/brand/GlassPanel.tsx` — frosted glass surface
   - `components/brand/SpectrumGlow.tsx` — gradient halo accent
   - `components/brand/BeamAccent.tsx` — thin angled slash motif
5. Create app shell layout:
   - `components/layout/AppShell.tsx` — three-pane console layout
   - `components/layout/Sidebar.tsx` — left nav + filters
   - `components/layout/Inspector.tsx` — right detail panel
   - `components/layout/TopBar.tsx` — header bar with user menu

### Files Created

- `components.json` — shadcn/ui config
- `components/ui/*.tsx` — shadcn components
- `components/brand/GlassPanel.tsx`
- `components/brand/SpectrumGlow.tsx`
- `components/brand/BeamAccent.tsx`
- `components/layout/AppShell.tsx`
- `components/layout/Sidebar.tsx`
- `components/layout/Inspector.tsx`
- `components/layout/TopBar.tsx`
- `lib/utils.ts` — shadcn cn() utility

### Files Modified

- `app/globals.css` — design tokens, glassmorphism utilities
- `tailwind.config.ts` — extended theme colors and animations
- `package.json` — new deps (class-variance-authority, clsx, tailwind-merge, lucide-react)

---

## Phase 3: Supabase Setup + Database Schema + RLS

**Goal**: Full database schema with migrations, RLS policies, and client setup.

### Steps

1. Install Supabase deps: `@supabase/supabase-js`, `@supabase/ssr`
2. Create Supabase client utilities:
   - `lib/supabase/client.ts` — browser client (createBrowserClient)
   - `lib/supabase/server.ts` — server client (createServerClient with cookies)
   - `lib/supabase/middleware.ts` — middleware auth refresh
3. Create `middleware.ts` at project root for auth session management
4. Write migration `supabase/migrations/0001_init.sql`:
   - Extensions: pgcrypto, citext
   - Tables: profiles, assets, asset_versions, asset_files, tags, asset_tags,
     favorites, collections, collection_items, publishes, evaluations,
     evaluation_runs, audit_log
   - Custom enum: asset_type (skill, agents_md, claude_md)
   - Indexes on: owner_id, type, visibility, asset_id, is_draft
   - Unique constraints: asset version, asset file path, tag slug
   - Triggers: updated_at on profiles, assets, collections
5. Write migration `supabase/migrations/0002_rls.sql`:
   - Enable RLS on all user-facing tables
   - Policies for assets (owner CRUD, public read)
   - Policies for asset_versions (owner CRUD, public read for non-draft)
   - Policies for favorites, collections, tags (owner-scoped)
   - Policies for evaluations (owner-scoped)
6. Create Zod schemas for database types: `lib/schemas/`
   - `asset.ts`, `version.ts`, `collection.ts`, `evaluation.ts`
7. Add Supabase types generation script to package.json
8. Update `.env.example` with Supabase env vars
9. Document both local (`supabase start`) and remote setup in docs

### Files Created

- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/middleware.ts`
- `middleware.ts`
- `supabase/migrations/0001_init.sql`
- `supabase/migrations/0002_rls.sql`
- `supabase/config.toml` — local Supabase config
- `lib/schemas/asset.ts`
- `lib/schemas/version.ts`
- `lib/schemas/collection.ts`
- `lib/schemas/evaluation.ts`
- `lib/database.types.ts` — generated or manual Supabase types

### Files Modified

- `package.json` — add Supabase deps + gen script
- `.env.example` — add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- `.gitignore` — add supabase/.temp/

---

## Phase 4: Auth + User Profiles

**Goal**: Working authentication with profile bootstrap.

### Steps

1. Create auth pages:
   - `app/(marketing)/login/page.tsx` — sign-in form (email + Google OAuth)
   - `app/(marketing)/signup/page.tsx` — sign-up form
   - `app/auth/callback/route.ts` — OAuth callback handler
   - `app/auth/confirm/route.ts` — email confirmation handler
2. Create auth components:
   - `components/auth/LoginForm.tsx`
   - `components/auth/SignupForm.tsx`
   - `components/auth/OAuthButtons.tsx`
   - `components/auth/UserMenu.tsx`
3. Create profile bootstrap:
   - Database trigger or server action to create profile row on first sign-in
   - `app/(app)/settings/page.tsx` — profile editor (handle, display_name, avatar)
4. Add route protection in `middleware.ts`:
   - `(app)/*` routes require auth
   - `(marketing)/*` routes are public
5. Create auth context provider for client components
6. Write migration `supabase/migrations/0003_profile_trigger.sql`:
   - Function + trigger to auto-create profile on `auth.users` insert

### Files Created

- `app/(marketing)/login/page.tsx`
- `app/(marketing)/signup/page.tsx`
- `app/auth/callback/route.ts`
- `app/auth/confirm/route.ts`
- `components/auth/LoginForm.tsx`
- `components/auth/SignupForm.tsx`
- `components/auth/OAuthButtons.tsx`
- `components/auth/UserMenu.tsx`
- `supabase/migrations/0003_profile_trigger.sql`
- `lib/auth/context.tsx` — auth context provider

### Files Modified

- `middleware.ts` — add route protection logic
- `app/(app)/layout.tsx` — wrap with auth provider
- `app/(app)/settings/page.tsx` — profile management

---

## Phase 5: Asset CRUD + Versioning

**Goal**: Create, read, update, delete assets with draft/release versioning.

### Steps

1. Create server actions for asset operations:
   - `lib/actions/assets.ts` — createAsset, updateAsset, deleteAsset, forkAsset
   - `lib/actions/versions.ts` — saveDraft, createRelease, getDiff
2. Implement versioning rules:
   - Drafts: editable, one active draft per asset
   - Releases: immutable, semver validated (Zod), changelog required
   - Content hashing: sha256 over canonicalized markdown + manifest
3. Create asset utility functions:
   - `lib/assets/hashing.ts` — sha256 content hash
   - `lib/assets/canonicalize.ts` — canonical form for hashing
   - `lib/assets/validate.ts` — manifest + markdown validation
4. Create app routes:
   - `app/(app)/dashboard/page.tsx` — overview of user's assets
   - `app/(app)/library/page.tsx` — browsable asset list
   - `app/(app)/assets/new/page.tsx` — create new asset
   - `app/(app)/assets/[assetId]/page.tsx` — asset detail view
   - `app/(app)/assets/[assetId]/versions/page.tsx` — version history
5. Create asset UI components:
   - `components/library/AssetCard.tsx` — card display
   - `components/library/AssetList.tsx` — list/grid view
   - `components/library/AssetTypeBadge.tsx` — skill/agents/claude badge
   - `components/library/VersionBadge.tsx` — draft/release indicator
   - `components/assets/CreateAssetForm.tsx`
   - `components/assets/AssetDetail.tsx`
   - `components/assets/VersionHistory.tsx`
   - `components/assets/ForkButton.tsx`
6. Write audit log helper:
   - `lib/audit.ts` — log actions to audit_log table

### Files Created

- `lib/actions/assets.ts`
- `lib/actions/versions.ts`
- `lib/assets/hashing.ts`
- `lib/assets/canonicalize.ts`
- `lib/assets/validate.ts`
- `lib/audit.ts`
- `app/(app)/dashboard/page.tsx`
- `app/(app)/library/page.tsx`
- `app/(app)/assets/new/page.tsx`
- `app/(app)/assets/[assetId]/page.tsx`
- `app/(app)/assets/[assetId]/versions/page.tsx`
- `components/library/AssetCard.tsx`
- `components/library/AssetList.tsx`
- `components/library/AssetTypeBadge.tsx`
- `components/library/VersionBadge.tsx`
- `components/assets/CreateAssetForm.tsx`
- `components/assets/AssetDetail.tsx`
- `components/assets/VersionHistory.tsx`
- `components/assets/ForkButton.tsx`

---

## Phase 6: Monaco Editor + Markdown Preview

**Goal**: IDE-grade editing with live preview and diff.

### Steps

1. Install `@monaco-editor/react` and `react-markdown` + plugins
   (`remark-gfm`, `rehype-highlight`)
2. Create editor components:
   - `components/editor/MonacoEditor.tsx` — dynamic import, ssr: false
   - `components/editor/MarkdownPreview.tsx` — rendered markdown preview
   - `components/editor/DiffViewer.tsx` — Monaco diff editor for version comparison
   - `components/editor/EditorToolbar.tsx` — save, release, format buttons
   - `components/editor/ManifestEditor.tsx` — JSON/YAML manifest panel
   - `components/editor/SplitPane.tsx` — resizable split view
3. Create edit page:
   - `app/(app)/assets/[assetId]/edit/page.tsx` — full editor view
4. Implement autosave:
   - Debounced save-draft on content change (1.5s delay)
   - Visual "saved" / "saving..." indicator
5. Implement release flow:
   - Dialog to input semver + changelog
   - Validate semver > previous version
   - Hash content and create immutable release
6. Configure Monaco:
   - Markdown language support
   - Custom theme matching app design (charcoal + spectrum accents)
   - Minimap, word wrap, bracket matching
   - Frontmatter/YAML validation for manifest blocks

### Files Created

- `components/editor/MonacoEditor.tsx`
- `components/editor/MarkdownPreview.tsx`
- `components/editor/DiffViewer.tsx`
- `components/editor/EditorToolbar.tsx`
- `components/editor/ManifestEditor.tsx`
- `components/editor/SplitPane.tsx`
- `app/(app)/assets/[assetId]/edit/page.tsx`

### Files Modified

- `package.json` — add @monaco-editor/react, react-markdown, remark-gfm, rehype-highlight

---

## Phase 7: Search + Tags + Favorites + Collections

**Goal**: Discovery features for the asset library.

### Steps

1. Create full-text search:
   - Migration `supabase/migrations/0004_search.sql`:
     Add `tsvector` column to assets, GIN index, trigger to update on insert/update
   - `lib/search/fts.ts` — full-text search query builder
2. Create API route:
   - `app/api/search/route.ts` — search endpoint with filters (type, tags, visibility)
3. Create server actions:
   - `lib/actions/tags.ts` — CRUD for tags, add/remove from assets
   - `lib/actions/favorites.ts` — toggle favorite
   - `lib/actions/collections.ts` — CRUD collections, add/remove items
4. Create UI components:
   - `components/library/SearchBar.tsx` — search input with filters
   - `components/library/FiltersBar.tsx` — type/tag filter controls
   - `components/library/TagPills.tsx` — tag display and editing
   - `components/library/FavoriteButton.tsx`
   - `components/collections/CollectionList.tsx`
   - `components/collections/CollectionDetail.tsx`
   - `components/collections/AddToCollection.tsx`
5. Create collection pages:
   - `app/(app)/collections/page.tsx` — list user's collections
   - `app/(app)/collections/[collectionId]/page.tsx` — collection detail

### Files Created

- `supabase/migrations/0004_search.sql`
- `lib/search/fts.ts`
- `app/api/search/route.ts`
- `lib/actions/tags.ts`
- `lib/actions/favorites.ts`
- `lib/actions/collections.ts`
- `components/library/SearchBar.tsx`
- `components/library/FiltersBar.tsx`
- `components/library/TagPills.tsx`
- `components/library/FavoriteButton.tsx`
- `components/collections/CollectionList.tsx`
- `components/collections/CollectionDetail.tsx`
- `components/collections/AddToCollection.tsx`
- `app/(app)/collections/[collectionId]/page.tsx`

---

## Phase 8: Anthropic API Integration

**Goal**: Model selection and message routing via Anthropic API.

### Steps

1. Install `@anthropic-ai/sdk`
2. Create Anthropic lib:
   - `lib/anthropic/client.ts` — server-side Anthropic client singleton
   - `lib/anthropic/models.ts` — fetch models, sort latest-first, pick top 3
   - `lib/anthropic/streaming.ts` — streaming message helper
3. Create API routes:
   - `app/api/anthropic/models/route.ts` — GET, returns model list (cached 5min)
   - `app/api/anthropic/message/route.ts` — POST, proxies messages with streaming
4. Create UI components:
   - `components/anthropic/ModelSelector.tsx` — top 3 default, "show all" toggle
   - `components/anthropic/ModelBadge.tsx` — model info display
5. Integrate with editor:
   - "Test with Claude" button in editor toolbar
   - Model selector in test panel
   - Streaming response display

### Files Created

- `lib/anthropic/client.ts`
- `lib/anthropic/models.ts`
- `lib/anthropic/streaming.ts`
- `app/api/anthropic/models/route.ts`
- `app/api/anthropic/message/route.ts`
- `components/anthropic/ModelSelector.tsx`
- `components/anthropic/ModelBadge.tsx`

### Files Modified

- `package.json` — add @anthropic-ai/sdk
- `.env.example` — add ANTHROPIC_API_KEY
- `components/editor/EditorToolbar.tsx` — add test button

---

## Phase 9: Export Bundles

**Goal**: Generate repo-ready file trees as zip downloads or clipboard content.

### Steps

1. Install `archiver` (or use JSZip for client-compatible zip generation)
2. Create export utilities:
   - `lib/assets/export.ts` — generate file tree from asset + version
   - `lib/assets/manifests.ts` — generate manifest.json for skills
3. Create API route:
   - `app/api/export/bundle/route.ts` — POST, returns zip file
4. Create UI components:
   - `components/export/ExportDialog.tsx` — export options dialog
   - `components/export/FileTreePreview.tsx` — preview generated file tree
   - `components/export/CopyBlock.tsx` — copy-to-clipboard for individual files
5. Export formats:
   - Skill: `skills/<slug>/SKILL.md` + `manifest.json` + `resources/`
   - AGENTS.md: single file
   - CLAUDE.md: single file
   - Bundle: all selected assets in repo-ready tree

### Files Created

- `lib/assets/export.ts`
- `lib/assets/manifests.ts`
- `app/api/export/bundle/route.ts`
- `components/export/ExportDialog.tsx`
- `components/export/FileTreePreview.tsx`
- `components/export/CopyBlock.tsx`

### Files Modified

- `package.json` — add jszip

---

## Phase 10: Marketing Pages + Landing

**Goal**: Public-facing pages for the product.

### Steps

1. Create marketing layout:
   - `app/(marketing)/layout.tsx` — public layout with nav + footer
2. Create landing page:
   - `app/(marketing)/page.tsx` — hero, features, CTA
3. Create additional pages:
   - `app/(marketing)/pricing/page.tsx` — pricing tiers (placeholder for v1)
4. Use brand components (GlassPanel, SpectrumGlow, BeamAccent) throughout

### Files Created

- `app/(marketing)/layout.tsx`
- `app/(marketing)/page.tsx` (update from Phase 1 placeholder)
- `app/(marketing)/pricing/page.tsx`

---

## Phase 11: CI/CD + Docs + Polish

**Goal**: Update governance, CI pipeline, and documentation for the new app.

### Steps

1. Update CI pipeline (`.github/workflows/ci.yml`):
   - Add TypeScript type checking (`npx tsc --noEmit`)
   - Add ESLint step
   - Add Next.js build step (`npm run build`)
   - Keep markdown lint + smoke check
2. Update `smoke-check.sh`:
   - Add checks for: `next.config.ts`, `tsconfig.json`, `middleware.ts`,
     `supabase/migrations/`, `lib/supabase/`, `lib/anthropic/`
3. Write documentation:
   - `docs/PRD.md` — product requirements (from user's spec)
   - `docs/ARCHITECTURE.md` — system architecture overview
   - `docs/SCHEMAS.md` — database schema reference
4. Update `README.md`:
   - Setup instructions (env vars, Supabase local/remote, npm run dev)
   - Deployment instructions (Vercel)
   - Development workflow
5. Update `CHANGELOG.md` with v0.2.0 entries
6. Update `docs/MANIFEST.md` with new file inventory
7. Update `.env.example` with all env vars and comments

### Files Modified

- `.github/workflows/ci.yml`
- `scripts/smoke-check.sh`
- `README.md`
- `CHANGELOG.md`
- `docs/MANIFEST.md`
- `.env.example`

### Files Created

- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/SCHEMAS.md`

---

## Dependency Graph

```text
Phase 1 (Next.js scaffold)
  |
  v
Phase 2 (shadcn/ui + design system)
  |
  v
Phase 3 (Supabase schema + clients)
  |
  v
Phase 4 (Auth + profiles)
  |
  +---> Phase 5 (Asset CRUD + versioning)
  |         |
  |         +---> Phase 6 (Monaco editor)
  |         |
  |         +---> Phase 7 (Search/tags/favorites/collections)
  |         |
  |         +---> Phase 9 (Export bundles)
  |
  +---> Phase 8 (Anthropic API) — independent of Phase 5
  |
  v
Phase 10 (Marketing pages) — after Phase 2
  |
  v
Phase 11 (CI/docs/polish) — after all phases
```

Phases 6, 7, 8, and 9 can be parallelized once Phase 5 is complete.

---

## File Count Summary

| Phase | New Files | Modified Files |
|-------|-----------|----------------|
| 1     | ~8        | ~5             |
| 2     | ~12       | ~3             |
| 3     | ~12       | ~3             |
| 4     | ~10       | ~2             |
| 5     | ~18       | ~0             |
| 6     | ~7        | ~1             |
| 7     | ~14       | ~0             |
| 8     | ~7        | ~2             |
| 9     | ~6        | ~1             |
| 10    | ~3        | ~0             |
| 11    | ~3        | ~7             |
| **Total** | **~100**  | **~24**        |

---

## Key Architectural Decisions

1. **Server Components by default** — all pages are RSC; Client Components only for interactivity
2. **Server Actions for mutations** — `"use server"` functions, not API routes, for CRUD
3. **API routes for external integrations** — Anthropic proxy, export, search
4. **Middleware for auth** — single `middleware.ts` handles session refresh + route protection
5. **Dynamic import for Monaco** — `next/dynamic` with `ssr: false` to avoid server bundle bloat
6. **RLS as security boundary** — Supabase RLS policies are the enforcement layer, not app code
7. **Migration-first schema** — all changes via numbered SQL files in `supabase/migrations/`
8. **Content hashing** — sha256 of canonicalized content for immutable release integrity
