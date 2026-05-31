/**
 * Map a DB `planning_elements` row to the in-memory `CanvasElement` shape
 * used by the planning store, and back. The DB row is the source of truth
 * for geometry / content; the store keeps a flattened representation for
 * the canvas renderers.
 */
import type { CanvasElement } from "@/features/planning/domain/types/canvas.types";
import type {
  PlanningElement,
  PlanningElementInsert,
} from "@/services/central/planningBoards.service";

export function planningElementToCanvas(row: PlanningElement): CanvasElement {
  const position = (row.position as { x: number; y: number } | null) ?? { x: 0, y: 0 };
  const size = (row.size as { width: number; height: number } | null) ?? {
    width: 200,
    height: 120,
  };
  return {
    id: row.id,
    type: row.element_type,
    position,
    size,
    style: (row.style as Record<string, unknown>) ?? {},
    rotation: row.rotation ?? 0,
    layer: row.z_index ?? 0,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    data: (row.content as Record<string, unknown>) ?? {},
    locked: !!row.locked_by,
    lockedBy: row.locked_by ?? null,
    boardId: row.board_id,
    createdBy: row.created_by,
    updatedAt: row.updated_at,
  } as CanvasElement;
}

export function canvasToPlanningInsert(
  el: CanvasElement,
  boardId: string,
  createdBy: string,
): PlanningElementInsert {
  return {
    id: el.id,
    board_id: boardId,
    created_by: createdBy,
    element_type: (el.type ?? "shape") as PlanningElementInsert["element_type"],
    position: el.position ?? { x: 0, y: 0 },
    size: el.size ?? { width: 200, height: 120 },
    rotation: typeof el.rotation === "number" ? el.rotation : 0,
    z_index: typeof el.layer === "number" ? el.layer : 0,
    content: (el.data ?? {}) as PlanningElementInsert["content"],
    style: (el.style ?? {}) as PlanningElementInsert["style"],
    metadata: (el.metadata ?? {}) as PlanningElementInsert["metadata"],
  };
}
