# Hooks & Call-Graph Audit — Zero-Reference Pass

Date: 2026-05-07

## Scope

This pass reviewed every hook-related entry that appears in `docs/reports/zero-reference-candidates-2026-05-05.md` under `src/hooks/**`:

- `src/hooks/canvas/useOptimizedCanvas.ts`
- `src/hooks/index.ts`
- `src/hooks/use-mobile.tsx`
- `src/hooks/useAIAnalysis.ts`
- `src/hooks/useApprovals.ts`
- `src/hooks/useAudit.ts`
- `src/hooks/useCanvasGraph.ts`
- `src/hooks/useCanvasHelpers.ts`
- `src/hooks/useCanvasKeyboardNav.ts`
- `src/hooks/useCanvasStyles.ts`
- `src/hooks/useFileUpload.ts`
- `src/hooks/useGridGuide.ts`
- `src/hooks/useHR.ts`
- `src/hooks/useKanban.ts`
- `src/hooks/usePermission.ts`
- `src/hooks/useSnapEngine.ts`
- `src/hooks/useTaskSelection.ts`

## Checks Applied

For each hook/file, the audit checked:

1. Whether it is exported from the global barrel `src/hooks/index.ts`.
2. Whether it has any consumer outside a barrel import graph, including direct imports and references under `src/**`.
3. Whether project documentation or active API-surface documentation identifies it as public/architectural API.
4. Whether the file has non-static runtime wiring that can be invisible to a simple static import graph.

Commands used during the pass:

```bash
rg -n "from ['\"]@/hooks['\"]|from ['\"]src/hooks['\"]|from ['\"]\.*/hooks['\"]|from ['\"]@/hooks/index|src/hooks/index" src docs --glob '!node_modules'
rg -n "useOptimizedCanvasState|useOptimizedSelection|useOptimizedCanvasInteractions|useOptimizedRender|useDebouncedCallback|useVirtualizedElements|useIsMobile|useAIAnalysis|useApprovals|useAudit|useCanvasGraph|useCanvasElementActions|useCanvasKeyboardNav|useCanvasStyles|useStylePresetClasses|useFileUpload|useGridGuide|useHR\b|useKanban|usePermission|useSnapEngine|useTaskSelection" src docs --glob '!docs/reports/zero-reference-candidates-2026-05-05.md' --glob '!node_modules'
npm run typecheck
```

## Barrel Export Findings

`src/hooks/index.ts` currently exports only:

- `useAutosave` from `src/components/SettingsPanel/hooks/useAutosave.ts`.
- Canvas-related types from `src/types/canvas.ts` and `src/types/enhanced-canvas.ts`.

None of the deleted zero-reference hooks were exported from `src/hooks/index.ts`, so no deleted-hook barrel export needed removal. The `useAutosave` barrel export was retained because the hook itself is used directly in Settings panels and was not one of the zero-reference hook files under review.

## Classification Results

| Hook/file | Barrel export? | Non-barrel usage? | Docs/public/API signal | Classification | Action |
|---|---:|---:|---|---|---|
| `src/hooks/canvas/useOptimizedCanvas.ts` (`useOptimizedCanvasState`, `useOptimizedSelection`, `useOptimizedCanvasInteractions`, `useOptimizedRender`, `useDebouncedCallback`, `useVirtualizedElements`) | No | No | No project doc/API reference found | `delete-approved` | Deleted |
| `src/hooks/use-mobile.tsx` (`useIsMobile`) | No | No | No project doc/API reference found | `delete-approved` | Deleted |
| `src/hooks/useAIAnalysis.ts` (`useAIAnalysis`) | No | No | No project doc/API reference found | `delete-approved` | Deleted |
| `src/hooks/useApprovals.ts` (`useApprovals`) | No | No | Active public exports are service-level approvals APIs via `src/index.ts`, not this hook | `delete-approved` | Deleted |
| `src/hooks/useAudit.ts` (`useAudit`) | No | No | No project doc/API reference found | `delete-approved` | Deleted |
| `src/hooks/useCanvasGraph.ts` (`useCanvasGraph`) | No | No | File-local comments only; no external docs/API surface found | `delete-approved` | Deleted |
| `src/hooks/useCanvasHelpers.ts` (`useCanvasElementActions`) | No | No | No project doc/API reference found | `delete-approved` | Deleted |
| `src/hooks/useCanvasStyles.ts` (`useCanvasStyles`, `useStylePresetClasses`) | No | No | No project doc/API reference found | `delete-approved` | Deleted |
| `src/hooks/useGridGuide.ts` (`useGridGuide`) | No | No | No project doc/API reference found | `delete-approved` | Deleted |
| `src/hooks/useHR.ts` (`useHR`) | No | No | Superseded by used `useHRLite`; no public doc/API signal for `useHR` found | `delete-approved` | Deleted |
| `src/hooks/useKanban.ts` (`useKanban`) | No | No | No project doc/API reference found | `delete-approved` | Deleted |
| `src/hooks/useTaskSelection.ts` (`useTaskSelection`) | No | No | No project doc/API reference found | `delete-approved` | Deleted |
| `src/hooks/index.ts` | It is the barrel | No consumer of `@/hooks` barrel found | Public-style barrel containing active `useAutosave` export and canvas type exports | `keep-public-api` | Retained |
| `src/hooks/useCanvasKeyboardNav.ts` (`useCanvasKeyboardNav`) | No | No | Listed in `docs/CANVAS_ARCHITECTURE.md` as the keyboard-navigation hook | `keep-public-api` | Retained |
| `src/hooks/useFileUpload.ts` (`useFileUpload`) | No | No static consumer | Documented in `docs/CURRENT_SYSTEM_SPECIFICATION.md`; also allowlisted because it creates the file processor Worker through `new URL('../workers/fileProcessor.worker.ts', import.meta.url)` | `keep-public-api` | Retained |
| `src/hooks/usePermission.ts` (`usePermission`) | No | No current source consumer | Documented as the RBAC permission hook in `docs/RBAC.md`, `docs/MIGRATION_PLAN.md`, and recovery docs | `keep-public-api` | Retained |
| `src/hooks/useSnapEngine.ts` (`useSnapEngine`) | No | No current source consumer | Identified in this report's prior priority list as the React interface for Snap Engine review | `keep-public-api` | Retained |

## Defer

No reviewed hook was left in `defer` after this pass. Hooks with concrete documentation/API/runtime-wiring evidence were retained as `keep-public-api`; hooks with no barrel export, no non-barrel usage, and no project public/API signal were deleted as `delete-approved`.

## Deleted Files

Deleted `delete-approved` hooks only:

- `src/hooks/canvas/useOptimizedCanvas.ts`
- `src/hooks/use-mobile.tsx`
- `src/hooks/useAIAnalysis.ts`
- `src/hooks/useApprovals.ts`
- `src/hooks/useAudit.ts`
- `src/hooks/useCanvasGraph.ts`
- `src/hooks/useCanvasHelpers.ts`
- `src/hooks/useCanvasStyles.ts`
- `src/hooks/useGridGuide.ts`
- `src/hooks/useHR.ts`
- `src/hooks/useKanban.ts`
- `src/hooks/useTaskSelection.ts`

## Typecheck Cadence

Typecheck was run at baseline and after each deletion batch:

1. Baseline before deletion: `npm run typecheck` — passed.
2. After deleting 5 hooks/files: `npm run typecheck` — passed.
3. After deleting 5 additional hooks/files: `npm run typecheck` — passed.
4. After deleting the final 2 hooks/files: `npm run typecheck` — passed.

Each typecheck printed the npm warning `Unknown env config "http-proxy"`, but `tsc --noEmit` completed successfully.

## Batch H — Performance hooks revalidation — 2026-05-07

### Scope

Batch H revalidated the requested performance hook paths:

- `src/hooks/performance/useCanvasOptimization.ts`
- `src/hooks/performance/useCanvasPerformance.ts`
- `src/hooks/performance/useMemoizedStyles.ts`
- `src/hooks/performance/usePerformanceOptimization.ts`

### Checks Applied

Commands used for this batch:

```bash
find src/hooks -maxdepth 3 -type f | sort
find src/hooks/performance -maxdepth 2 -type f -print 2>/dev/null || true
find src/hooks -path '*performance*' -maxdepth 4 -print 2>/dev/null || true
rg -n "useCanvasOptimization|useCanvasPerformance|useMemoizedStyles|usePerformanceOptimization|src/hooks/performance|hooks/performance" src docs batch-a-delete-list.md package.json tsconfig.json -g '!node_modules' -g '!dist' -g '!build'
rg -n "CanvasPerformance|MemoizedStyles|PerformanceOptimization|CanvasOptimization|useStableCallback|useStableMemo|performance hook|performance/hooks|hooks/performance|PerformanceOptimizer" docs src/components src/hooks -g '!node_modules'
npm run -s typecheck
```

### Export Review

- `src/hooks/index.ts` still exports only `useAutosave` plus canvas/enhanced-canvas types; it does not export any `src/hooks/performance/*` hook.
- No `src/hooks/performance` directory or nested barrel export exists in the current tree.
- Current runtime performance helpers remain under `src/components/performance/PerformanceOptimizer.tsx` and are re-exported by `src/components/ui/performance/index.ts`; those component-level exports are outside this hook batch and were not changed.

### Documentation Review

The only current documentation references to the requested hook paths are historical cleanup records:

- `docs/reports/inventory-summary-2026-05-05.md` records prior deletion of `useCanvasPerformance.ts`, `useMemoizedStyles.ts`, and `usePerformanceOptimization.ts` in Batch 1.
- `batch-a-delete-list.md` contains the original heuristic candidate rows for all four requested hook paths, including stale allowlist labels for three hooks that are no longer present in the current tree.

No active architecture, public API, or usage documentation was found that requires retaining any requested `src/hooks/performance/*` hook.

### Classification Results

| Hook/file | Current file present? | Barrel/public export? | Non-documentation usage? | Docs/public/API signal | Classification | Action |
|---|---:|---:|---:|---|---|---|
| `src/hooks/performance/useCanvasOptimization.ts` | No | No | No | Only historical candidate-row reference found | `delete-approved` | Already absent; no export removal needed |
| `src/hooks/performance/useCanvasPerformance.ts` | No | No | No | Historical deletion log only | `delete-approved` | Already deleted; no export removal needed |
| `src/hooks/performance/useMemoizedStyles.ts` | No | No | No | Historical deletion log only | `delete-approved` | Already deleted; no export removal needed |
| `src/hooks/performance/usePerformanceOptimization.ts` | No | No | No | Historical deletion log only | `delete-approved` | Already deleted; no export removal needed |

### Typecheck Cadence

No new hook files were deleted during Batch H because all four requested paths were already absent from the current tree. A post-revalidation typecheck was still run after confirming the top-level and nested performance barrels were absent:

1. Post-revalidation: `npm run -s typecheck` — passed.

### Batch H Disposition

All four requested performance hook paths are classified as `delete-approved`, but they required no filesystem deletion in this batch because the files and the `src/hooks/performance` barrel directory were already absent. No `src/hooks/index.ts` export removal was required.
