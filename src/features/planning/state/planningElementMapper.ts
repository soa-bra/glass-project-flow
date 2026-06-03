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

const PERSISTED_ELEMENT_TYPES = new Set<string>([
  "sticky",
  "shape",
  "text",
  "smart_doc",
  "interactive_sheet",
  "mindmap_node",
  "mindmap_connector",
  "visual_node",
  "visual_connector",
  "root_connector",
  "frame",
  "connector",
  "entity_card",
]);

const ENTITY_CARD_SMART_TYPES = new Set<string>([
  "project_card",
  "task_card",
  "finance_card",
  "csr_card",
  "crm_card",
]);

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function readSmartType(...sources: Array<Record<string, unknown>>): string | undefined {
  for (const source of sources) {
    const smartType = source.smartType;
    if (typeof smartType === "string" && smartType.trim()) return smartType;
  }
  return undefined;
}

function toCanvasElementType(row: PlanningElement): string {
  const content = asRecord(row.content);
  const metadata = asRecord(row.metadata);
  const smartType = readSmartType(content, metadata);

  if ((row.element_type === "smart_doc" || row.element_type === "interactive_sheet" || row.element_type === "root_connector") && smartType) {
    return smartType;
  }

  return row.element_type;
}

function toPersistedElementType(el: CanvasElement): PlanningElementInsert["element_type"] {
  const type = typeof el.type === "string" ? el.type : "shape";
  const data = asRecord(el.data);
  const metadata = asRecord(el.metadata);
  const smartType = readSmartType(data, metadata, { smartType: (el as { smartType?: unknown }).smartType }, { smartType: type });

  if (PERSISTED_ELEMENT_TYPES.has(type)) {
    return type as PlanningElementInsert["element_type"];
  }

  if (smartType === "interactive_sheet") return "interactive_sheet";
  if (smartType === "root_connector") return "root_connector";
  if (smartType && ENTITY_CARD_SMART_TYPES.has(smartType)) return "entity_card";

  return "smart_doc";
}

export function planningElementToCanvas(row: PlanningElement): CanvasElement {
  const position = (row.position as { x: number; y: number } | null) ?? { x: 0, y: 0 };
  const size = (row.size as { width: number; height: number } | null) ?? {
    width: 200,
    height: 120,
  };
  const metadata = asRecord(row.metadata);
  const data = asRecord(row.content);
  const smartType = readSmartType(data, metadata);

  return {
    id: row.id,
    type: toCanvasElementType(row),
    smartType,
    position,
    size,
    style: (row.style as Record<string, unknown>) ?? {},
    rotation: row.rotation ?? 0,
    layer: row.z_index ?? 0,
    metadata,
    data,
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
    element_type: toPersistedElementType(el),
    position: el.position ?? { x: 0, y: 0 },
    size: el.size ?? { width: 200, height: 120 },
    rotation: typeof el.rotation === "number" ? el.rotation : 0,
    z_index: typeof el.layer === "number" ? el.layer : 0,
    content: (el.data ?? {}) as PlanningElementInsert["content"],
    style: (el.style ?? {}) as PlanningElementInsert["style"],
    metadata: (el.metadata ?? {}) as PlanningElementInsert["metadata"],
  };
}
