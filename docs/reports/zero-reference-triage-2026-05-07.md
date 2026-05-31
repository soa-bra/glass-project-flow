# Zero-reference triage — 2026-05-07

Input: `docs/reports/zero-reference-candidates-2026-05-07.md`.

## Method

- Classified every current zero-reference candidate into exactly one of the requested buckets.
- Used conservative rules: app entry files, runtime workers, public barrels/APIs, tests/tooling, and owner-sensitive documented utilities are not deleted.
- Only `delete-approved` entries are eligible for the final delete list.

## Summary

- `delete-approved`: **2**
- `allowlist-runtime`: **2**
- `defer-route-entry`: **1**
- `defer-public-api`: **29**
- `defer-test-or-tooling`: **35**
- `needs-owner-decision`: **5**

## Triage table

| Candidate | Direct import / barrel export check | String / dynamic / route / registry / worker check | Test/tooling/public API check | Classification |
| --- | --- | --- | --- | --- |
| `src/__tests__/SmartElements.test.tsx` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/__tests__/integration/smart-elements-integration.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/__tests__/integration/viewport-elements-integration.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/__tests__/integration/zoom-pan-behavior.test.tsx` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/__tests__/performance/drag-benchmark.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/__tests__/performance/export-benchmark.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/__tests__/performance/peak-collaboration-load.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/__tests__/performance/render-benchmark.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/__tests__/setup.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/__tests__/stores/canvasStore.performance.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/__tests__/stores/canvasStore.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/__tests__/stores/elementsSlice.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/__tests__/stores/historySlice.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/__tests__/stores/selectionSlice.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/__tests__/stores/viewportSlice.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/components/ArchivePanel/index.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/components/DepartmentPanel/index.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/components/TaskCard/index.tsx` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/components/shared/surfaces/index.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/components/ui/index.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/components/ui/performance/index.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/data/index.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/engine/canvas/collaboration/collaborationEngine.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/engine/canvas/io/index.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/engine/index.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/features/index.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/features/planning/canvas/controllers/useCanvasDropController.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/features/planning/canvas/controllers/useCanvasPointerTracking.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/features/planning/canvas/controllers/useCanvasRealtimeController.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/features/planning/canvas/controllers/useCanvasSelectionController.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/features/planning/canvas/controllers/useCanvasViewportController.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/features/planning/canvas/controllers/useMindMapConnectionController.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/features/planning/canvas/viewport/InfiniteCanvas.test.tsx` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/features/planning/domain/index.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/features/planning/elements/index.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/features/planning/elements/text/utils/index.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/features/planning/integration/persistence/entityBindingRegistry.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/features/planning/state/history/boardSnapshot.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/features/planning/state/slices/selectionSlice.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/features/planning/state/slices/viewportSlice.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/features/planning/state/transactions/runCanvasTransaction.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/features/planning/ui/PlanningCanvas.test.tsx` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/features/planning/ui/toolbars/CanvasToolbar.test.tsx` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/features/planning/ui/toolbars/floating-bar/FloatingBar.test.tsx` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/hooks/index.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/hooks/useCanvasKeyboardNav.ts` | No direct import found, but semantic/docs/feature ownership risk remains. | No runtime loader proven. | Needs owner decision before deletion. | `needs-owner-decision` |
| `src/hooks/useFileUpload.ts` | Static import graph is insufficient for this runtime path. | Runtime loader/worker coupling or runtime-only execution path found. | Keep out of deletion list. | `allowlist-runtime` |
| `src/hooks/usePermission.ts` | No direct import found, but semantic/docs/feature ownership risk remains. | No runtime loader proven. | Needs owner decision before deletion. | `needs-owner-decision` |
| `src/hooks/useSnapEngine.ts` | No direct import found, but semantic/docs/feature ownership risk remains. | No runtime loader proven. | Needs owner decision before deletion. | `needs-owner-decision` |
| `src/index.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/lib/api/smart-elements.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/main.tsx` | Entry file is reached by Vite/browser bootstrapping, not by another source import. | Route/app bootstrap entry semantics apply. | Defer as route/application entry. | `defer-route-entry` |
| `src/modules/hr-lite/hr-lite.service.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/modules/hr/hr.service.ts` | No direct import/barrel export outside self. | No runtime/dynamic/route/registry loader found. | Not test/tooling and not retained as documented public API in this pass. | `delete-approved` |
| `src/modules/kb/kb.service.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/modules/surveys/surveys.service.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/services/aiAnalysis.ts` | No direct import found, but semantic/docs/feature ownership risk remains. | No runtime loader proven. | Needs owner decision before deletion. | `needs-owner-decision` |
| `src/services/central/withAuthorizationAndAudit.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/services/kanban.ts` | No direct import/barrel export outside self. | No runtime/dynamic/route/registry loader found. | Not test/tooling and not retained as documented public API in this pass. | `delete-approved` |
| `src/shared/adapters/index.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/shared/events/handlers/cultural-handlers.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/shared/events/handlers/hr-handlers.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/shared/events/handlers/project-handlers.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/shared/events/handlers/webhook-handlers.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/shared/events/validation.test.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/shared/index.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/stories/index.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/test/setup.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/types/canvas-hooks.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/types/index.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/utils/index.ts` | Barrel/module/service/API surface; zero inbound imports can be expected. | No deletion without public API owner review. | Defer public API. | `defer-public-api` |
| `src/utils/performanceOptimizer.ts` | No direct import found, but semantic/docs/feature ownership risk remains. | No runtime loader proven. | Needs owner decision before deletion. | `needs-owner-decision` |
| `src/vite-env.d.ts` | Test/tooling files are discovered by runners/config rather than source imports. | No runtime app loader required. | Defer to test/tooling cleanup policy. | `defer-test-or-tooling` |
| `src/workers/fileProcessor.worker.ts` | Static import graph is insufficient for this runtime path. | Runtime loader/worker coupling or runtime-only execution path found. | Keep out of deletion list. | `allowlist-runtime` |
