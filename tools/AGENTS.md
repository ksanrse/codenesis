# Tooling Guidance

This folder contains project-level scripts used by development, e2e tests, and maintenance. Also follow the repository root `AGENTS.md`.

## E2E Servers

- Playwright web servers must start the actual package roots: DB scripts from `apps/db`, platform scripts from `apps/platform`.
- Keep e2e ports isolated from the normal dev server: API on `41732`, platform on `5174`.
- Do not route e2e startup through an ambiguous root dev command if the readiness URL would return a 404 instead of the app.

## Verification

- After changing Playwright server scripts, run at least one focused `npm.cmd run e2e -- --grep "<test name>"`.
- Run `vp check` after editing scripts in this folder.
