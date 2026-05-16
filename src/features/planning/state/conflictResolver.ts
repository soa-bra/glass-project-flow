/**
 * conflictResolver — merge strategy for concurrent planning_element updates.
 *
 * Two collaborators can patch the same row before either change is echoed by
 * Realtime. We resolve such conflicts with a hybrid policy:
 *
 *   1. Per-field Last-Write-Wins (LWW): each mergeable field is timestamped
 *      locally when an optimistic mutation is issued. When a remote row
 *      arrives, any local field whose pending timestamp is strictly newer
 *      than `remote.updated_at` is preserved; all other fields take the
 *      remote value. This lets two peers edit non-overlapping fields
 *      simultaneously without clobbering each other.
 *
 *   2. Row-level LWW fallback when there is no local pending edit: we trust
 *      whichever side has the later `updated_at` for the whole row.
 *
 * Non-mergeable / authoritative fields (id, board_id, created_at, created_by,
 * locked_*) are always taken from the remote row — these are server-managed.
 */
import type { PlanningElement } from "@/services/central/planningBoards.service";

/** Fields safe to merge per-field. Server-managed fields are intentionally excluded. */
export const MERGEABLE_FIELDS = [
  "position",
  "size",
  "rotation",
  "z_index",
  "content",
  "style",
  "metadata",
  "schema_version",
] as const satisfies ReadonlyArray<keyof PlanningElement>;

export type MergeableField = (typeof MERGEABLE_FIELDS)[number];

/**
 * Map of mergeable-field → timestamp of the most recent local optimistic edit
 * to that field. Absent entries mean "no pending local edit for this field".
 */
export type PendingFieldStamps = Partial<Record<MergeableField, number>>;

export interface MergeResult {
  /** Row to write back into local state. */
  next: PlanningElement;
  /** True when at least one local field was preserved over the remote value. */
  preservedLocalFields: MergeableField[];
}

function tsOf(iso: string | null | undefined): number {
  if (!iso) return 0;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : 0;
}

/**
 * Merge a remote row into the local row using per-field LWW for mergeable
 * fields and row-level LWW for everything else.
 *
 * @param local   current local row (may be undefined if we never saw it)
 * @param remote  authoritative row arriving from Realtime / refetch
 * @param pending pending optimistic field timestamps for this row
 */
export function mergePlanningElement(
  local: PlanningElement | undefined,
  remote: PlanningElement,
  pending: PendingFieldStamps | undefined,
): MergeResult {
  if (!local) {
    return { next: remote, preservedLocalFields: [] };
  }

  const remoteTs = tsOf(remote.updated_at);
  const localTs = tsOf(local.updated_at);
  const hasPending = !!pending && Object.keys(pending).length > 0;

  // Row-level LWW fallback when nothing is pending locally.
  if (!hasPending) {
    if (localTs > remoteTs) {
      return { next: local, preservedLocalFields: [] };
    }
    return { next: remote, preservedLocalFields: [] };
  }

  // Per-field merge: start from remote, then overlay local fields whose
  // pending timestamp beats the remote write.
  const merged: PlanningElement = { ...remote };
  const preserved: MergeableField[] = [];
  for (const field of MERGEABLE_FIELDS) {
    const pendingTs = pending?.[field];
    if (pendingTs && pendingTs > remoteTs) {
      // Local pending edit is newer — keep local value for this field.
      (merged as Record<string, unknown>)[field] = local[field];
      preserved.push(field);
    }
  }

  // Keep the larger updated_at so subsequent merges behave correctly.
  if (preserved.length > 0 && localTs > remoteTs) {
    merged.updated_at = local.updated_at;
  }

  return { next: merged, preservedLocalFields: preserved };
}

/** Remove pending stamps that are already reflected in `confirmed.updated_at`. */
export function prunePendingStamps(
  pending: PendingFieldStamps | undefined,
  confirmedUpdatedAt: string,
): PendingFieldStamps {
  if (!pending) return {};
  const cutoff = tsOf(confirmedUpdatedAt);
  const next: PendingFieldStamps = {};
  for (const [field, ts] of Object.entries(pending) as Array<
    [MergeableField, number]
  >) {
    if (ts > cutoff) next[field] = ts;
  }
  return next;
}
