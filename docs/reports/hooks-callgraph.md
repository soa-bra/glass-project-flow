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
