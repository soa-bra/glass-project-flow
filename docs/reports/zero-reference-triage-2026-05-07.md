# Zero-reference triage — 2026-05-07

This triage applies the follow-up rule for zero-reference test files discovered by the 2026-05-07 import-graph scan.

## Test-file triage policy

- Every `*.test.ts` and `*.test.tsx` file is classified as `defer-test-or-tooling` in this report.
- Test files must **not** be deleted from the import graph alone. Test runners discover these files by glob patterns, so a zero-reference result only means production code does not import the test file.
- If test cleanup is requested later, create a separate cleanup batch named **Batch T**.
- Batch T must inspect each test against the product file, slice, controller, service, store, or standalone behavioral harness it validates before any deletion decision.

## Batch T guardrail

Batch T is reserved for any future test/tooling cleanup. Its minimum review checklist is:

1. Identify the test subject or explain why the test is a standalone behavior/performance harness.
2. Run or update the relevant test command for the file or suite.
3. Confirm whether the covered production behavior still exists.
4. Only then decide whether to keep, rewrite, merge, or delete the test.

## `*.test.ts` / `*.test.tsx` classifications

| Test file | Classification | Subject to inspect before any future deletion |
| --- | --- | --- |
| `src/__tests__/SmartElements.test.tsx` | `defer-test-or-tooling` | Legacy smart-elements store behavior via `src/stores/canvasStore.ts` and related smart element flows. |
| `src/__tests__/integration/smart-elements-integration.test.ts` | `defer-test-or-tooling` | Standalone smart-element registration, data refresh, and rendering integration harness. |
| `src/__tests__/integration/viewport-elements-integration.test.ts` | `defer-test-or-tooling` | Standalone viewport/element coordinate transformation and visibility harness. |
| `src/__tests__/integration/zoom-pan-behavior.test.tsx` | `defer-test-or-tooling` | Standalone zoom/pan behavior harness for camera math, touch support, bounds, and fit-to-content behavior. |
| `src/__tests__/performance/drag-benchmark.test.ts` | `defer-test-or-tooling` | Canvas drag performance path using `src/stores/canvas.ts` and canvas element types. |
| `src/__tests__/performance/export-benchmark.test.ts` | `defer-test-or-tooling` | Canvas export/import performance path using `src/engine/canvas/io/exportEngine.ts`, `src/engine/canvas/io/importEngine.ts`, and `src/stores/canvas.ts`. |
| `src/__tests__/performance/peak-collaboration-load.test.ts` | `defer-test-or-tooling` | Collaboration-load telemetry and command-processing path using planning command processor, SLO targets, and collaboration metrics. |
| `src/__tests__/performance/render-benchmark.test.ts` | `defer-test-or-tooling` | Canvas render performance path using `src/stores/canvas.ts` and canvas element types. |
| `src/__tests__/stores/canvasStore.performance.test.ts` | `defer-test-or-tooling` | Legacy canvas store performance behavior via `src/stores/canvasStore.ts` and `src/utils/performanceMonitor.ts`. |
| `src/__tests__/stores/canvasStore.test.ts` | `defer-test-or-tooling` | Legacy canvas store state and actions via `src/stores/canvasStore.ts`. |
| `src/__tests__/stores/elementsSlice.test.ts` | `defer-test-or-tooling` | Legacy canvas elements slice behavior via `src/stores/canvas.ts`. |
| `src/__tests__/stores/historySlice.test.ts` | `defer-test-or-tooling` | Legacy canvas history slice behavior via `src/stores/canvas.ts`. |
| `src/__tests__/stores/selectionSlice.test.ts` | `defer-test-or-tooling` | Legacy canvas selection slice behavior via `src/stores/canvas.ts`. |
| `src/__tests__/stores/viewportSlice.test.ts` | `defer-test-or-tooling` | Legacy canvas viewport slice behavior via `src/stores/canvas.ts`. |
| `src/engine/canvas/collaboration/collaborationEngine.test.ts` | `defer-test-or-tooling` | Collaboration engine behavior via `src/engine/canvas/collaboration/collaborationEngine.ts`. |
| `src/features/planning/canvas/controllers/useCanvasDropController.test.ts` | `defer-test-or-tooling` | Drop controller behavior via `src/features/planning/canvas/controllers/useCanvasDropController.ts`. |
| `src/features/planning/canvas/controllers/useCanvasPointerTracking.test.ts` | `defer-test-or-tooling` | Pointer tracking controller behavior via `src/features/planning/canvas/controllers/useCanvasPointerTracking.ts`. |
| `src/features/planning/canvas/controllers/useCanvasRealtimeController.test.ts` | `defer-test-or-tooling` | Realtime controller behavior via `src/features/planning/canvas/controllers/useCanvasRealtimeController.ts`. |
| `src/features/planning/canvas/controllers/useCanvasSelectionController.test.ts` | `defer-test-or-tooling` | Selection controller behavior via `src/features/planning/canvas/controllers/useCanvasSelectionController.ts`. |
| `src/features/planning/canvas/controllers/useCanvasViewportController.test.ts` | `defer-test-or-tooling` | Viewport controller behavior via `src/features/planning/canvas/controllers/useCanvasViewportController.ts`. |
| `src/features/planning/canvas/controllers/useMindMapConnectionController.test.ts` | `defer-test-or-tooling` | Mind-map connection controller behavior via `src/features/planning/canvas/controllers/useMindMapConnectionController.ts`. |
| `src/features/planning/canvas/viewport/InfiniteCanvas.test.tsx` | `defer-test-or-tooling` | Infinite canvas viewport behavior via `src/features/planning/canvas/viewport/InfiniteCanvas.tsx`. |
| `src/features/planning/integration/persistence/entityBindingRegistry.test.ts` | `defer-test-or-tooling` | Entity binding registry behavior via `src/features/planning/integration/persistence/entityBindingRegistry.ts`. |
| `src/features/planning/state/history/boardSnapshot.test.ts` | `defer-test-or-tooling` | Board snapshot behavior via `src/features/planning/state/history/boardSnapshot.ts`. |
| `src/features/planning/state/slices/selectionSlice.test.ts` | `defer-test-or-tooling` | Planning selection slice behavior via `src/features/planning/state/slices/selectionSlice.ts`. |
| `src/features/planning/state/slices/viewportSlice.test.ts` | `defer-test-or-tooling` | Planning viewport slice behavior via `src/features/planning/state/slices/viewportSlice.ts`. |
| `src/features/planning/state/transactions/runCanvasTransaction.test.ts` | `defer-test-or-tooling` | Canvas transaction behavior via `src/features/planning/state/transactions/runCanvasTransaction.ts`. |
| `src/features/planning/ui/PlanningCanvas.test.tsx` | `defer-test-or-tooling` | Planning canvas UI behavior via `src/features/planning/ui/PlanningCanvas.tsx`. |
| `src/features/planning/ui/toolbars/CanvasToolbar.test.tsx` | `defer-test-or-tooling` | Canvas toolbar UI behavior via `src/features/planning/ui/toolbars/CanvasToolbar.tsx`. |
| `src/features/planning/ui/toolbars/floating-bar/FloatingBar.test.tsx` | `defer-test-or-tooling` | Floating toolbar UI behavior via `src/features/planning/ui/toolbars/floating-bar/FloatingBar.tsx`. |
| `src/shared/events/validation.test.ts` | `defer-test-or-tooling` | Shared event contract validation via `src/shared/events/validation.ts` and `src/shared/events/contracts.ts`. |

## Non-test candidates

This pass does not change the disposition of non-test zero-reference candidates from `docs/reports/zero-reference-candidates-2026-05-07.md`.
