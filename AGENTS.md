# Codenesis — Agent Guide

Educational coding platform. pnpm monorepo on Vite+, Svelte 5, Monaco, and a browser-side JavaScript test runner. Russian-language UI and challenge content. Raycast-inspired dark theme.

> Nested guides override scope:
>
> - `packages/challenges/AGENTS.md` — challenge package contract
> - `packages/challenges/src/challenges/AGENTS.md` — content + rank rules
> - `tools/AGENTS.md` — dev/e2e scripts
>
> Also see `DESIGN.md` for the design system.

## Repo Layout

```
apps/
  platform/      Svelte app — editor, roadmaps, catalog, routing
  db/            sql.js HTTP server for progress/profile
packages/
  challenges/    Source of truth for tasks, tests, solutions, practice groups, ranks
  utils/         Shared helpers
tools/           dev orchestrator, e2e servers, mojibake check
data/            sqlite snapshots
```

Workspace package name: `@codenesis/challenges`.

## Tech Stack

- Vite+ (`vp` CLI) wraps Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt
- Per-package `vite.config.ts` files were removed — Vite+ auto-detects via `package.json` task fields. Do not re-add unless a task needs config the auto-detect cannot express.
- Node `>=22.12.0` (matches Volta pin `22.22.2`). Do not lower the engines field — risks runtime failures on Node 20 from 22-only APIs.
- pnpm 10 with `catalog:` versions in `pnpm-workspace.yaml`
- Svelte 5, hash routing, Monaco Editor, and Svelte Flow for interactive roadmaps
- Browser-side test runner (`apps/platform/src/lib/browser-test-runner.ts`) for supported JavaScript challenges
- TypeScript everywhere, `react-markdown` + `remark-gfm` for descriptions

## Commands

Run from repo root unless noted.

| Task                   | Command                                                  |
| ---------------------- | -------------------------------------------------------- |
| Install                | `vp install` (or `pnpm install`)                         |
| Dev (full stack)       | `pnpm dev` (= `node tools/dev.mjs`)                      |
| Platform only          | `pnpm --filter platform dev`                             |
| Build all              | `vp run -r build`                                        |
| Check (fmt+lint+types) | `vp check`                                               |
| Test all               | `vp run -r test`                                         |
| Mojibake guard         | `vp run check:mojibake` (run after editing Russian text) |
| E2E                    | `pnpm e2e`                                               |
| Pre-push gate          | `pnpm ready`                                             |

After editing challenge content or ranking, rebuild: `vp run -r build`. Consumers read from `packages/challenges/dist`.

## Conventions

- **Russian** in user-facing text (descriptions, UI labels, errors). English for identifiers and language terms.
- **Voice (challenges)**: Feynman-style — bytovoy metaphor → trap/gotcha → "Что написать" → `## Требования` → `## Примеры`. See `.claude/skills/challenge-creation.md`.
- **Ranks** zero-based: `rank: 0` → F1 ... `rank: 7` → F8. Calibrate by reasoning, not topic. F8 reserved for polyfills/interpreters.
- **Imports** use workspace name `@codenesis/challenges`.
- **Styles** live in `apps/platform/src/styles/globals.css` (single global stylesheet). No CSS modules.
- **Routing** is hash-based; new routes go under `apps/platform/src/routes/`.
- **No new docs files** without explicit ask.

## Challenge Pipeline

Editor (`ChallengeLayout.svelte`) → file tree → Monaco → `runBrowserTests` → `OutputPanel.svelte` rows with inline error details.

`TestResult` carries optional `error` for inline expansion. Browser runner records per-assertion results; vitest output is parsed line-by-line.

Roadmap stages link to exercises from `@codenesis/challenges`; roadmap content itself lives in `apps/platform/src/lib/roadmaps.ts`.

## Verification Checklist

- [ ] `vp install` after pulling
- [ ] `vp check` and `vp run -r test` before sending
- [ ] `vp run check:mojibake` after Russian edits
- [ ] `vp run -r build` after challenge content/rank changes
- [ ] Browser smoke test for editor/test-runner changes (preview shows pills + inline errors)

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
