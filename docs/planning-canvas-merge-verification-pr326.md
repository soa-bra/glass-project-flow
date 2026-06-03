# Planning Canvas Merge Verification - PR #326

## Verification Result

PR #326 was merged, but it did not apply the Planning Canvas source-code fix.

It added only:

- `docs/planning-canvas-source-fix-plan.md`

Therefore the critical implementation remains missing from `main`.

## Current Executed Items

- PR #324: added UUID helper and initial UUID id test.
- PR #325: added corrective patch/handoff summary.
- PR #326: added source-fix plan document.

## Still Missing From Source Code

The following required changes are not implemented in active Planning Canvas source paths:

1. `createPlanningElementId()` must be wired into persisted element creation paths.
2. `addElement`, `addText`, pen strokes, paste, smart factories, text helpers, and frame creation must stop generating persisted ids with `nanoid()` or non-UUID prefixes.
3. Smart conversion must reject legacy/non-persistable selected ids before opening approval.
4. `smartConversion.service.ts` must verify source planning elements exist before creating target entities.
5. Required conversion writes to `element_transformations`, `data_links`, `sync_queue`, and relevant `project_events` must fail loudly instead of using best-effort behavior.
6. Smart Docs persistence must be typed and must not fail silently.
7. Frontend AI permission must align with backend `canvas.ai.use` permission.
8. Board/global role merging must use the highest effective canvas role instead of falling back incorrectly.
9. Paste tests must assert UUID ids for pasted elements.

## Required Next PR

The next PR must be a source-code PR, not another documentation PR.

It must modify the actual files listed in `docs/planning-canvas-source-fix-plan.md` and then run:

```bash
npm ci
npm run typecheck
npm test -- --run src/features/planning/state/slices/planningElementIds.test.ts src/features/planning/state/slices/selectionSlice.test.ts
npm run build
```

## Decision

Do not start the next Planning Canvas feature PR until this source-code correction is merged and verified.
