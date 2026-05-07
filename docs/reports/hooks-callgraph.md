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

### Batch H Final Verification

- Re-ran the performance-hook presence checks on 2026-05-07; `find src/hooks/performance -maxdepth 2 -type f -print 2>/dev/null || true` and `find src/hooks -path '*performance*' -maxdepth 4 -print 2>/dev/null || true` produced no hook-path output.
- Re-ran the source/docs reference scans on 2026-05-07; remaining matches are historical cleanup documentation, `batch-a-delete-list.md` candidate rows, or the unrelated component-level `src/components/performance/PerformanceOptimizer.tsx` API exported through `src/components/ui/performance/index.ts`.
- Re-ran `npm run -s typecheck` after the Batch H verification; it completed successfully.

## Batch I — Performance hook cleanup confirmation — 2026-05-07

### Scope

Batch I repeated the targeted review for these performance hook paths:

- `src/hooks/performance/useCanvasOptimization.ts`
- `src/hooks/performance/useCanvasPerformance.ts`
- `src/hooks/performance/useMemoizedStyles.ts`
- `src/hooks/performance/usePerformanceOptimization.ts`

### Checks Applied

Commands used for this confirmation:

```bash
sed -n '1,220p' src/hooks/index.ts
if [ -f src/hooks/performance/index.ts ]; then sed -n '1,220p' src/hooks/performance/index.ts; else echo 'NO src/hooks/performance/index.ts'; fi
test -d src/hooks/performance && find src/hooks/performance -maxdepth 2 -type f -print || true
rg -n "useCanvasOptimization|useCanvasPerformance|useMemoizedStyles|usePerformanceOptimization|src/hooks/performance|hooks/performance" src docs batch-a-delete-list.md package.json tsconfig.json -g '!node_modules' -g '!dist' -g '!build'
npm run -s typecheck
```

### Export and documentation review

- `src/hooks/index.ts` exports `useAutosave` and canvas/enhanced-canvas types only; it has no export for any `src/hooks/performance/*` hook.
- `src/hooks/performance/index.ts` is absent because the `src/hooks/performance` directory is absent.
- The source tree contains no active performance-hook implementation files at the requested paths.
- Remaining references are historical cleanup/report rows in `batch-a-delete-list.md`, `docs/reports/inventory-summary-2026-05-05.md`, and this call-graph report. No active source consumer, public barrel, or architecture/API document requires keeping the requested hooks.

### Classification Results

| Hook/file | Current file present? | Barrel/public export? | Non-documentation usage? | Classification | Action |
|---|---:|---:|---:|---|---|
| `src/hooks/performance/useCanvasOptimization.ts` | No | No | No | `delete-approved` | Already absent; no export removal needed |
| `src/hooks/performance/useCanvasPerformance.ts` | No | No | No | `delete-approved` | Already absent; no export removal needed |
| `src/hooks/performance/useMemoizedStyles.ts` | No | No | No | `delete-approved` | Already absent; no export removal needed |
| `src/hooks/performance/usePerformanceOptimization.ts` | No | No | No | `delete-approved` | Already absent; no export removal needed |

### Typecheck Cadence

1. Post-confirmation: `npm run -s typecheck` — passed.

### Batch I Disposition

All four requested hooks are classified as `delete-approved`. No filesystem deletion was needed in Batch I because the files and nested performance barrel are already absent from the current tree, and no `src/hooks/index.ts` export removal was required.

## Batch J — Performance hook absence and historical-safety audit — 2026-05-07

### Scope

This pass re-checked the four requested hook paths:

- `src/hooks/performance/useCanvasOptimization.ts`
- `src/hooks/performance/useCanvasPerformance.ts`
- `src/hooks/performance/useMemoizedStyles.ts`
- `src/hooks/performance/usePerformanceOptimization.ts`

### Checks Applied

Commands used for this pass:

```bash
sed -n '1,220p' src/hooks/index.ts
test -d src/hooks/performance && find src/hooks/performance -maxdepth 2 -type f -print || echo 'NO src/hooks/performance'
rg -n "useCanvasOptimization|useCanvasPerformance|useMemoizedStyles|usePerformanceOptimization|src/hooks/performance|hooks/performance" src docs batch-a-delete-list.md package.json tsconfig.json -g '!node_modules' -g '!dist' -g '!build'
git log --diff-filter=D --summary -- src/hooks/performance/useCanvasOptimization.ts src/hooks/performance/useCanvasPerformance.ts src/hooks/performance/useMemoizedStyles.ts src/hooks/performance/usePerformanceOptimization.ts
git show 7dd7fdc^:src/hooks/performance/useCanvasOptimization.ts
git show ae08641^:src/hooks/performance/useCanvasPerformance.ts
git show ae08641^:src/hooks/performance/useMemoizedStyles.ts
git show ae08641^:src/hooks/performance/usePerformanceOptimization.ts
npm run -s typecheck
```

### Current-tree findings

- The current tree has no `src/hooks/performance` directory, so none of the four requested hook implementation files can still be imported from the working tree.
- `src/hooks/index.ts` exports only `useAutosave` plus canvas/enhanced-canvas types; it does not expose a performance-hook public API.
- The only remaining current references to the requested hook names or paths are historical reports/candidate rows and this report. No active `src/**` runtime consumer was found.
- Git history shows `useCanvasPerformance.ts`, `useMemoizedStyles.ts`, and `usePerformanceOptimization.ts` were deleted by `ae086411d26e0edbb0c498015ab3a35b52bc2a5f`; `useCanvasOptimization.ts` was deleted by `7dd7fdc23fae3caee950caa3b8831808361cb099`.

### Hook-by-hook review

| Hook/file | Current dependency-array review | Current cleanup review | Current stale-closure review | Current stable-reference review | Used/exported as public API? | Classification | Action |
|---|---|---|---|---|---|---|---|
| `src/hooks/performance/useCanvasOptimization.ts` | Not applicable in current tree because the file is absent. Historical code used empty dependency arrays for pure callbacks/memoized helpers and `[shouldUseVirtualization]` for chunk processing. | No current cleanup path needed. Historical `batchElementUpdates` canceled only a prior frame before scheduling a new one and had no unmount cleanup for the final pending animation frame. | No current closure risk because absent. Historical callbacks only closed over refs/constants except chunk processing, which depended on `shouldUseVirtualization`. | No current returned object. Historical returned functions were stable, but the returned object literal itself was recreated each render. | No active source consumer, no `src/hooks/index.ts` export, no nested performance barrel, and no active public/API documentation signal. | `delete-approved` | Already absent; no deletion needed. |
| `src/hooks/performance/useCanvasPerformance.ts` | Not applicable in current tree because the file is absent. Historical dependencies were mostly complete: render tracking intentionally ran every render, `getVisibleElements` depended on `elements`, `getPerformanceMetrics` on `elements.length`, cache cleanup on `elements`, monitor interval on `[enabled]`. | No current cleanup path needed. Historical monitor cleaned its interval on disable/unmount. Historical cache cleanup was tied to `elements`; no special unmount cleanup was present for singleton metric/style caches. | No current closure risk because absent. Historical viewport and metrics callbacks captured current `elements` through dependency arrays. | No current returned object. Historical callbacks were stable according to their dependencies, but returned object literals were not memoized; `usePerformanceMonitor` returned a singleton metrics instance. | No active source consumer, no `src/hooks/index.ts` export, no nested performance barrel, and no active public/API documentation signal. | `delete-approved` | Already absent; no deletion needed. |
| `src/hooks/performance/useMemoizedStyles.ts` | Not applicable in current tree because the file is absent. Historical memoized helpers used empty dependency arrays where calculations were pure and `[getElementTransform, getElementSize]` for `calculateElementStyle`. | No current cleanup path needed. Historical code allocated no timers/listeners/subscriptions, so cleanup was not required. | No current closure risk because absent. Historical closures only referenced stable helper functions or call arguments. | No current returned object. Historical helper functions/constants were stable, but each returned object literal from the hook was recreated each render. | No active source consumer, no `src/hooks/index.ts` export, no nested performance barrel, and no active public/API documentation signal. | `delete-approved` | Already absent; no deletion needed. |
| `src/hooks/performance/usePerformanceOptimization.ts` | Not applicable in current tree because the file is absent. Historical `throttleOperation`, `batchOperations`, and `calculateElementStyle` used empty dependency arrays; `useOptimizedSelector` delegated to caller-provided deps; `useDebouncedCallback` used `[callback, delay, ...deps]`. | No current cleanup path needed. Historical main hook canceled a pending animation frame on unmount, but the debounced callback helper had no unmount timeout cleanup. | No current closure risk because absent. Historical debounced callback depended on `callback`, `delay`, and caller deps, but exposed the usual risk of incorrect caller-supplied deps. | No current returned object. Historical callbacks were stable by dependency arrays, but returned object literals were not memoized. | No active source consumer, no `src/hooks/index.ts` export, no nested performance barrel, and no active public/API documentation signal. | `delete-approved` | Already absent; no deletion needed. |

### Disposition

All four requested hooks remain `delete-approved`. No additional file deletion was performed in this pass because the implementations and `src/hooks/performance` directory are already absent, and no public export removal is necessary.

### Typecheck Cadence

1. Post-audit: `npm run -s typecheck` — passed.
