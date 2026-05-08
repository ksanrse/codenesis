# Platform App Guidance

This folder contains the React UI for Foruntendo. Also follow the repository root `AGENTS.md`.

## Design

- Use `DESIGN.md` as the source of truth for spacing, typography, borders, hover states, and color usage.
- Prefer existing CSS variables from `apps/platform/src/styles/globals.css`; do not introduce one-off colors unless they become reusable tokens.
- Keep the Raycast-like visual language: quiet dark surfaces, thin borders, restrained red accents, clear hover/focus states, and no decorative gradients.
- Before adding a new UI pattern, check whether an existing route already has a matching card, table, tab, drawer, or button style.

## Architecture

- Shared domain rules must come from packages, not from route-local constants. For challenge ranks, MMR, and level labels, import from `@foruntendo/challenges`.
- Keep route files readable. Small presentational helpers are fine inside a route; reusable UI or domain formatting should move to a nearby component or package only when it is used in more than one place.
- Avoid duplicating Russian copy for the same concept across routes. Prefer a single exported data structure when the copy is product logic, not page-specific decoration.
- Attempt recording rules live in `src/lib/challenge-files.ts`. Do not inline duplicate signature checks in editor components. Only the `Завершить` / full-test submit flow may create an attempt, and the attempt status/counts must come from the full-test result, not from the ordinary public `Проверить` run. A passed submit must still be recorded when the same source was only stored as failed before, otherwise completion and profile progress can miss a solved task.

## Editor Layout (react-mosaic)

- `ChallengeLayout` uses `react-mosaic-component` for the description / editor / output panes. Root class is `.mosaic-foruntendo` — all overrides scope under it.
- The library ships `react-mosaic-component.css` with `background: white` on `.mosaic-window .mosaic-window-toolbar`, `.mosaic-window-body`, `.mosaic-window-additional-actions-bar`, `.mosaic-window-body-overlay`. Our overrides must include `.mosaic-foruntendo .mosaic-window <child>` (not just `.mosaic-foruntendo <child>`) to win specificity. Do not weaken these selectors — light surfaces will leak through.
- Tree state is persisted to `localStorage` under `editorMosaicTree`. Default tree is in `DEFAULT_MOSAIC_TREE`. Bumping the schema requires a key change so users get the new default.

## EditorPanel State

- `fileContents` (state) and `fileContentsRef.current` must stay in sync. `handleChange` updates both — ref for synchronous reads from save handlers, state so `currentContent = fileContents[activeFile]` reflects the live edit when the user switches tabs and back. Removing the `setFileContents` call drops unsaved edits on tab switch.

## Verification

- After UI changes, run `vp check` when possible.
- After editing Russian text, run `vp run check:mojibake`.
- If a page was visually changed, open it in the in-app browser or Playwright and verify that spacing, borders, hover/focus states, and scroll behavior still match the rest of the app.
