# Hooks & Call-Site Audit (Initial Pass)

## Critical Hook Zones
1. `src/hooks/*` (global/shared hooks)
2. `src/features/planning/canvas/controllers/*` (input, viewport, selection)
3. `src/features/planning/elements/text/hooks/*` (editor behavior/history)
4. `src/hooks/performance/*` (memoization/perf-sensitive paths)

## Initial Verification Checklist (to execute per hook)
- `useEffect` dependencies complete and intentional.
- no stale closures in callbacks passed to event listeners.
- cleanup function exists for subscriptions/timers/workers.
- stable return shape (avoid identity churn where consumers depend on memoization).
- hook consumers import canonical hook (not legacy duplicate).

## Priority Hook Paths
- `src/hooks/useSnapEngine.ts` vs engine-level snap implementations.
- `src/features/planning/canvas/controllers/useCanvasSelectionController.ts`
- `src/features/planning/canvas/controllers/useCanvasViewportController.ts`
- `src/features/planning/canvas/controllers/useCanvasRealtimeController.ts`
- `src/hooks/useCollaboration.ts` and `src/hooks/useWebRTCVoice.ts`

## Expected Deliverables in Deep Pass
- Hook dependency defect list (file + line + fix type).
- Call-site mismatch list (wrong hook imported, stale signature, legacy shim use).
- Refactor PR batches grouped by subsystem (Canvas, Collaboration, DepartmentTabs).
