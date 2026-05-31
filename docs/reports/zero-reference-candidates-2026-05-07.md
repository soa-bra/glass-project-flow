# Zero-reference candidates — 2026-05-07

Generated after the previously removed 22 files, using a static import-graph scan over current `src/**/*.{ts,tsx,js,jsx,mjs,cjs}` files.

## Baseline summary

- baseline: **95**
- already removed before this pass: **22**
- current zero-reference candidates before final deletion: **74**

## Scan notes

- Static imports, re-exports, type imports/exports, and literal `import(...)` calls were included.
- Path resolution covers relative imports, `@/` aliases, extensionless files, and `index.*` barrels.
- This is a candidate report only; runtime entry points, public barrels, tests, and owner-sensitive files are triaged separately.

## Current zero-reference candidates

- `src/__tests__/SmartElements.test.tsx`
- `src/__tests__/integration/smart-elements-integration.test.ts`
- `src/__tests__/integration/viewport-elements-integration.test.ts`
- `src/__tests__/integration/zoom-pan-behavior.test.tsx`
- `src/__tests__/performance/drag-benchmark.test.ts`
- `src/__tests__/performance/export-benchmark.test.ts`
- `src/__tests__/performance/peak-collaboration-load.test.ts`
- `src/__tests__/performance/render-benchmark.test.ts`
- `src/__tests__/setup.ts`
- `src/__tests__/stores/canvasStore.performance.test.ts`
- `src/__tests__/stores/canvasStore.test.ts`
- `src/__tests__/stores/elementsSlice.test.ts`
- `src/__tests__/stores/historySlice.test.ts`
- `src/__tests__/stores/selectionSlice.test.ts`
- `src/__tests__/stores/viewportSlice.test.ts`
- `src/components/ArchivePanel/index.ts`
- `src/components/DepartmentPanel/index.ts`
- `src/components/TaskCard/index.tsx`
- `src/components/shared/surfaces/index.ts`
- `src/components/ui/index.ts`
- `src/components/ui/performance/index.ts`
- `src/data/index.ts`
- `src/engine/canvas/collaboration/collaborationEngine.test.ts`
- `src/engine/canvas/io/index.ts`
- `src/engine/index.ts`
- `src/features/index.ts`
- `src/features/planning/canvas/controllers/useCanvasDropController.test.ts`
- `src/features/planning/canvas/controllers/useCanvasPointerTracking.test.ts`
- `src/features/planning/canvas/controllers/useCanvasRealtimeController.test.ts`
- `src/features/planning/canvas/controllers/useCanvasSelectionController.test.ts`
- `src/features/planning/canvas/controllers/useCanvasViewportController.test.ts`
- `src/features/planning/canvas/controllers/useMindMapConnectionController.test.ts`
- `src/features/planning/canvas/viewport/InfiniteCanvas.test.tsx`
- `src/features/planning/domain/index.ts`
- `src/features/planning/elements/index.ts`
- `src/features/planning/elements/text/utils/index.ts`
- `src/features/planning/integration/persistence/entityBindingRegistry.test.ts`
- `src/features/planning/state/history/boardSnapshot.test.ts`
- `src/features/planning/state/slices/selectionSlice.test.ts`
- `src/features/planning/state/slices/viewportSlice.test.ts`
- `src/features/planning/state/transactions/runCanvasTransaction.test.ts`
- `src/features/planning/ui/PlanningCanvas.test.tsx`
- `src/features/planning/ui/toolbars/CanvasToolbar.test.tsx`
- `src/features/planning/ui/toolbars/floating-bar/FloatingBar.test.tsx`
- `src/hooks/index.ts`
- `src/hooks/useCanvasKeyboardNav.ts`
- `src/hooks/useFileUpload.ts`
- `src/hooks/usePermission.ts`
- `src/hooks/useSnapEngine.ts`
- `src/index.ts`
- `src/lib/api/smart-elements.ts`
- `src/main.tsx`
- `src/modules/hr-lite/hr-lite.service.ts`
- `src/modules/hr/hr.service.ts`
- `src/modules/kb/kb.service.ts`
- `src/modules/surveys/surveys.service.ts`
- `src/services/aiAnalysis.ts`
- `src/services/central/withAuthorizationAndAudit.ts`
- `src/services/kanban.ts`
- `src/shared/adapters/index.ts`
- `src/shared/events/handlers/cultural-handlers.ts`
- `src/shared/events/handlers/hr-handlers.ts`
- `src/shared/events/handlers/project-handlers.ts`
- `src/shared/events/handlers/webhook-handlers.ts`
- `src/shared/events/validation.test.ts`
- `src/shared/index.ts`
- `src/stories/index.ts`
- `src/test/setup.ts`
- `src/types/canvas-hooks.ts`
- `src/types/index.ts`
- `src/utils/index.ts`
- `src/utils/performanceOptimizer.ts`
- `src/vite-env.d.ts`
- `src/workers/fileProcessor.worker.ts`
