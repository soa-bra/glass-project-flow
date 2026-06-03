# Planning Canvas Source Fix Plan

## Merge Verification

PR #324 was merged, but it only added:

- `src/features/planning/state/createPlanningElementId.ts`
- `src/features/planning/state/slices/planningElementIds.test.ts`

PR #325 was merged, but it only added a corrective handoff document/patch summary:

- `docs/planning-gap-closure-corrective.patch`

Neither PR applied the source-code changes required to close the Planning Canvas persistence/conversion gaps.

## Executed

- UUID helper exists.
- Initial UUID id test exists.
- Corrective patch summary exists.

## Not Yet Executed

The following source files still need the implementation from local commit `410dc32d fix(planning): close canvas persistence and conversion gaps`:

- `src/features/planning/elements/smart/ContextSmartMenu.tsx`
- `src/features/planning/elements/smart/factories/createTypedSmartElement.ts`
- `src/features/planning/elements/text/TextElement.ts`
- `src/features/planning/elements/text/hooks/useTextCreation.ts`
- `src/features/planning/hooks/useCanvasAIPermissions.ts`
- `src/features/planning/hooks/useCurrentBoardRole.ts`
- `src/features/planning/hooks/usePlanningElementPersistence.ts`
- `src/features/planning/services/smartConversion.service.ts`
- `src/features/planning/state/slices/elementsSlice.ts`
- `src/features/planning/state/slices/penSlice.ts`
- `src/features/planning/state/slices/selectionSlice.test.ts`
- `src/features/planning/state/slices/selectionSlice.ts`
- `src/features/planning/state/slices/toolsSlice.ts`
- `src/features/planning/ui/PlanningCanvas.tsx`
- `src/features/planning/ui/toolbars/floating-bar/actions/frameActions.ts`

## Required Source Fix

1. Use `createPlanningElementId()` anywhere a persisted Planning Canvas element id is generated.
2. Keep `nanoid()` only for non-persisted internal ids such as group ids, invite tokens, collaboration users, or suggestions.
3. Prevent smart conversion when selected source ids are not persisted UUID ids.
4. Validate source planning elements exist before creating converted entities.
5. Treat `element_transformations`, `data_links`, `sync_queue`, and relevant `project_events` writes as required, not best-effort.
6. Make Smart Docs persistence typed and fail visibly when required persistence fails.
7. Align frontend AI permission with `canvas.ai.use` through the shared permission service.
8. Merge board and global roles by highest effective canvas role instead of falling back to `guest`.
9. Extend paste tests to assert UUID ids for pasted elements.

## Validation Gate

Run after applying the source fix:

```bash
npm ci
npm run typecheck
npm test -- --run src/features/planning/state/slices/planningElementIds.test.ts src/features/planning/state/slices/selectionSlice.test.ts
npm run build
```

## Status

This PR documents that the previous merges were incomplete and blocks moving to the next Planning Canvas PR until the source fix is applied.
