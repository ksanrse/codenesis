# Database App Guidance

This folder contains the local API and persistence layer. Also follow the repository root `AGENTS.md`.

## Data Ownership

- Challenge definitions, ranks, MMR values, tests, and collection structure are owned by `packages/challenges`.
- The database app should persist user state: drafts, attempts, completed tasks, active profile, and active collection.
- Do not duplicate challenge copy or rank rules here. Import built challenge data instead.

## Challenge Updates

- When `packages/challenges` changes, rebuild it with `vp run build -r` before relying on seeded challenge data.
- Seed and migration code should be deterministic. A new app start must not corrupt existing user attempts or completed progress.

## API Surface

- Endpoints: `GET /api/health`, `GET /api/state`, `POST /api/attempts`, `PUT|DELETE /api/drafts/:challengeId/:language`, `PUT /api/settings/active-collection`, plus `POST /api/test/reset` (gated by `FORUNTENDO_E2E=1`).
- Challenge/collection metadata is **not** served from this app. Platform imports it directly from `@foruntendo/challenges` — do not re-add `/api/challenges` or `/api/collections`.
- `GET /api/health` returns `{ ok: true }` only. Do not add `dbPath` or other path/host details to the response — leaks server filesystem layout.

## Security

- CORS origin is controlled by `FORUNTENDO_ALLOWED_ORIGINS` (default `http://localhost:5173`). Do not revert to `*` — broadens attack surface to any origin.
- DB path failures (`readFile` error in `openDatabase`) log via `console.warn` and start a fresh empty DB. Do not silently swallow — masks corruption.

## Verification

- Run `vp check` when touching API or persistence code.
- For changes that affect challenge seeding or attempts, verify that existing attempts remain readable and new challenge metadata is reflected after restart.
