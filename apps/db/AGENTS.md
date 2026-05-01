# Database App Guidance

This folder contains the local API and persistence layer. Also follow the repository root `AGENTS.md`.

## Data Ownership

- Challenge definitions, ranks, MMR values, tests, and collection structure are owned by `packages/challenges`.
- The database app should persist user state: drafts, attempts, completed tasks, active profile, and active collection.
- Do not duplicate challenge copy or rank rules here. Import built challenge data instead.

## Challenge Updates

- When `packages/challenges` changes, rebuild it with `vp run build -r` before relying on seeded challenge data.
- Seed and migration code should be deterministic. A new app start must not corrupt existing user attempts or completed progress.

## Verification

- Run `vp check` when touching API or persistence code.
- For changes that affect challenge seeding or attempts, verify that existing attempts remain readable and new challenge metadata is reflected after restart.
