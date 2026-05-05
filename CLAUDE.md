# Foruntendo — Agent Guide

Educational coding platform. pnpm monorepo on Vite+, React 19, Monaco, WebContainer. Russian-language UI and challenge content. Raycast-inspired dark theme.

> Nested guides override scope:
> - `packages/challenges/AGENTS.md` — challenge package contract
> - `packages/challenges/src/challenges/AGENTS.md` — content + rank rules
> - `tools/AGENTS.md` — dev/e2e scripts
>
> Also see `DESIGN.md` for the design system.

## Repo Layout

```
apps/
  platform/      React app — editor, catalog, routing
  db/            sql.js HTTP server for progress/profile
packages/
  challenges/    Source of truth for tasks, tests, solutions, collections, ranks
  utils/         Shared helpers
tools/           dev orchestrator, e2e servers, mojibake check
data/            sqlite snapshots
```

Workspace pkg name typo is permanent: `@foruntendo/challenges` (not `forutenudo`). Don't "fix" it.

## Tech Stack

- Vite+ (`vp` CLI) wraps Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt
- pnpm 10 with `catalog:` versions in `pnpm-workspace.yaml`
- React 19, TanStack Router (hash routing), Monaco Editor, WebContainer API
- Browser-side test runner (`apps/platform/src/lib/browser-test-runner.ts`) for JS challenges; falls back to WebContainer + vitest for the rest
- TypeScript everywhere, `react-markdown` + `remark-gfm` for descriptions

## Commands

Run from repo root unless noted.

| Task | Command |
|------|---------|
| Install | `vp install` (or `pnpm install`) |
| Dev (full stack) | `pnpm dev` (= `node tools/dev.mjs`) |
| Platform only | `pnpm --filter platform dev` |
| Build all | `vp run build -r` |
| Check (fmt+lint+types) | `vp check` |
| Test all | `vp run test -r` |
| Mojibake guard | `vp run check:mojibake` (run after editing Russian text) |
| E2E | `pnpm e2e` |
| Pre-push gate | `pnpm ready` |

After editing challenge content or ranking, rebuild: `vp run build -r`. Consumers read from `packages/challenges/dist`.

## Conventions

- **Russian** in user-facing text (descriptions, UI labels, errors). English for identifiers and language terms.
- **Voice (challenges)**: Feynman-style — bytovoy metaphor → trap/gotcha → "Что написать" → `## Требования` → `## Примеры`. See `.claude/skills/challenge-creation.md`.
- **Ranks** zero-based: `rank: 0` → F1 ... `rank: 7` → F8. Calibrate by reasoning, not topic. F8 reserved for polyfills/interpreters.
- **Imports** use workspace name `@foruntendo/challenges`.
- **Styles** live in `apps/platform/src/styles/globals.css` (single global stylesheet). No CSS modules.
- **Routing** is hash-based; new routes go under `apps/platform/src/routes/`.
- **lucide-react** for icons (catalog version).
- **No new docs files** without explicit ask.

## Challenge Pipeline

Editor (`ChallengeLayout.tsx`) → file tree → Monaco → `runBrowserTests` (JS) or WebContainer + vitest → `parseTestResults` / direct results → `OutputPanel` rows with inline error details.

`TestResult` carries optional `error` for inline expansion. Browser runner records per-assertion results; vitest output is parsed line-by-line.

Last challenge in a collection swaps the "Следующее задание" button for "Перейти к списку" → routes to `/collections/$collectionId`.

## Verification Checklist

- [ ] `vp install` after pulling
- [ ] `vp check` and `vp run test -r` before sending
- [ ] `vp run check:mojibake` after Russian edits
- [ ] `vp run build -r` after challenge content/rank changes
- [ ] Browser smoke test for editor/test-runner changes (preview shows pills + inline errors)

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.

<!--VITE PLUS END-->
