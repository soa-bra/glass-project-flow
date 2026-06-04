/**
 * Planning Hooks — Public API barrel.
 *
 * Stable import path for all planning-feature hooks. Consumers should import
 * from `@/features/planning/hooks` (or via the feature root `@/features/planning`)
 * instead of reaching into individual hook files.
 */

export { useAutoUnlockStaleLocks } from "./useAutoUnlockStaleLocks";
export type { UseAutoUnlockStaleLocksOptions } from "./useAutoUnlockStaleLocks";

export { useBoardCanvasLifecycle } from "./useBoardCanvasLifecycle";
export { useBoardSaveState, formatBoardSaveStatusLabel } from "./useBoardSaveState";

export { useElementLock } from "./useElementLock";
export { useElementLockState } from "./useElementLockState";
export type { ElementLockState, ElementLockStatus } from "./useElementLockState";
export { useElementLockAcquire } from "./useElementLockAcquire";
export type { LockFailureInfo, AcquireFn } from "./useElementLockAcquire";

export { usePlanningElements } from "./usePlanningElements";
export type { UsePlanningElementsResult } from "./usePlanningElements";

export { usePlanningRealtime } from "./usePlanningRealtime";
export type { PresencePeer } from "./usePlanningRealtime";

export { usePlanningCanvasPersistence } from "./usePlanningCanvasPersistence";
export { usePlanningStoreSync } from "./usePlanningStoreSync";

export { useElementHistory } from "./useElementHistory";
export type { UseElementHistoryResult } from "./useElementHistory";
