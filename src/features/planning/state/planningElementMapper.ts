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

const SMART_PERSISTED_ELEMENT_TYPES = new Set<string>([
  "smart_doc",
  "interactive_sheet",
  "root_connector",
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

function readSmartType(
  ...sources: Array<Record<string, unknown>>
): string | undefined {
  for (const source of sources) {
    const smartType = source.smartType;
    if (typeof smartType === "string" && smartType.trim()) return smartType;
  }
  return undefined;
}

function readLayerId(
  ...sources: Array<Record<string, unknown>>
): string | undefined {
  for (const source of sources) {
    const layerId = source.layerId;
    if (typeof layerId === "string" && layerId.trim()) return layerId;
  }
  return undefined;
}

function toCanvasElementType(row: PlanningElement): string {
  const content = asRecord(row.content);
  const metadata = asRecord(row.metadata);
  const smartType = readSmartType(content, metadata);

  if (SMART_PERSISTED_ELEMENT_TYPES.has(row.element_type) && smartType) {
    return "smart";
  }

  return row.element_type;
}

function getElementSmartType(el: CanvasElement): string | undefined {
  const type = typeof el.type === "string" ? el.type : "shape";
  const data = asRecord(el.data);
  const metadata = asRecord(el.metadata);
  const directSmartType = (el as { smartType?: unknown }).smartType;
  const smartType = readSmartType(data, metadata, { smartType: directSmartType });

  if (smartType) return smartType;
  if (!PERSISTED_ELEMENT_TYPES.has(type)) return type;
  return undefined;
}

function toPersistedElementType(
  el: CanvasElement,
): PlanningElementInsert["element_type"] {
  const type = typeof el.type === "string" ? el.type : "shape";
  const smartType = getElementSmartType(el);

  if (PERSISTED_ELEMENT_TYPES.has(type)) {
    return type as PlanningElementInsert["element_type"];
  }

  if (smartType === "interactive_sheet") return "interactive_sheet";
  if (smartType === "root_connector") return "root_connector";
  if (smartType && ENTITY_CARD_SMART_TYPES.has(smartType)) return "entity_card";

  return "smart_doc";
}

function withSmartType(
  value: unknown,
  smartType: string | undefined,
): Record<string, unknown> {
  const record = asRecord(value);
  return smartType ? { ...record, smartType } : record;
}

function withLayerId(
  value: Record<string, unknown>,
  layerId: string | undefined,
): Record<string, unknown> {
  return layerId ? { ...value, layerId } : value;
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
  const layerId = readLayerId(metadata, data);

  return {
    id: row.id,
    type: toCanvasElementType(row),
    smartType,
    position,
    size,
    style: (row.style as Record<string, unknown>) ?? {},
    rotation: row.rotation ?? 0,
    layer: row.z_index ?? 0,
    layerId,
    metadata,
    data,
    locked: !!row.locked_by,
    lockedBy: row.locked_by ?? null,
    lockedAt: row.locked_at ?? null,
    schemaVersion: row.schema_version ?? 1,
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
  const smartType = getElementSmartType(el);
  const layerId = typeof el.layerId === "string" && el.layerId.trim()
    ? el.layerId
    : undefined;

  return {
    id: el.id,
    board_id: boardId,
    created_by: createdBy,
    element_type: toPersistedElementType(el),
    position: el.position ?? { x: 0, y: 0 },
    size: el.size ?? { width: 200, height: 120 },
    rotation: typeof el.rotation === "number" ? el.rotation : 0,
    z_index: typeof el.layer === "number" ? el.layer : 0,
    content: withSmartType(el.data, smartType) as PlanningElementInsert["content"],
    style: (el.style ?? {}) as PlanningElementInsert["style"],
    metadata: withLayerId(
      withSmartType(el.metadata, smartType),
      layerId,
    ) as PlanningElementInsert["metadata"],
    schema_version: typeof ((el as unknown) as { schemaVersion?: unknown }).schemaVersion === "number"
      ? (((el as unknown) as { schemaVersion: number }).schemaVersion)
      : 1,
  };
}
