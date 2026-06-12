import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";

export const PROJECT_INTELLIGENCE_EVENT_TYPES = [
  "task.status.updated",
  "task.deadline.changed",
  "invoice.status.changed",
  "contract.signed",
  "project.budget.updated",
  "risk.level.changed",
] as const;

export type ProjectIntelligenceEventType = (typeof PROJECT_INTELLIGENCE_EVENT_TYPES)[number];
export type SyncQueueOperation = "insert" | "update" | "delete" | "upsert";

type DataLinkRow = Database["public"]["Tables"]["data_links"]["Row"] & {
  source_type?: string | null;
  source_id?: string | null;
  target_type?: string | null;
  target_id?: string | null;
  relation_type?: string | null;
  sync_type?: string | null;
};

export interface CrossDepartmentEventContext {
  eventId?: string;
  eventType: ProjectIntelligenceEventType | string;
  projectId: string;
  boardId?: string | null;
  sourceType: string;
  sourceId: string;
  actorId: string;
  payload?: Record<string, unknown>;
  occurredAt?: string;
}

export interface SyncQueueHandler {
  handlerName: string;
  eventType: string;
  relationType: string;
  syncType: string;
  linkId: string;
  projectId: string;
  boardId: string | null;
  entityTable: string;
  entityId: string;
  operation: SyncQueueOperation;
  payload: Record<string, unknown>;
  createdBy: string;
}

interface SupabaseQueryBuilder {
  select: (columns: string) => SupabaseQueryBuilder;
  eq: (column: string, value: string) => Promise<{ data: DataLinkRow[] | null; error: { message: string } | null }>;
}

interface SupabaseUntypedClient {
  from: (table: string) => SupabaseQueryBuilder;
}

interface EndpointDescriptor {
  type: string | null;
  id: string | null;
}

const HANDLER_DEFAULTS: Record<
  ProjectIntelligenceEventType,
  { handlerName: string; entityTable: string; fallbackOperation: SyncQueueOperation }
> = {
  "task.status.updated": {
    handlerName: "cross_department.task_status_sync",
    entityTable: "tasks",
    fallbackOperation: "update",
  },
  "task.deadline.changed": {
    handlerName: "cross_department.task_deadline_sync",
    entityTable: "tasks",
    fallbackOperation: "update",
  },
  "invoice.status.changed": {
    handlerName: "cross_department.invoice_status_sync",
    entityTable: "invoices",
    fallbackOperation: "update",
  },
  "contract.signed": {
    handlerName: "cross_department.contract_signed_sync",
    entityTable: "contracts",
    fallbackOperation: "upsert",
  },
  "project.budget.updated": {
    handlerName: "cross_department.project_budget_sync",
    entityTable: "projects",
    fallbackOperation: "update",
  },
  "risk.level.changed": {
    handlerName: "cross_department.risk_level_sync",
    entityTable: "project_risks",
    fallbackOperation: "update",
  },
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) return value;
  }

  return null;
}

function normalize(value: string | null | undefined): string | null {
  return value ? value.trim().toLowerCase() : null;
}

function linkMetadata(link: DataLinkRow): Record<string, unknown> {
  return isRecord(link.metadata) ? link.metadata : {};
}

function linkMapping(link: DataLinkRow): Record<string, unknown> {
  return isRecord(link.mapping) ? link.mapping : {};
}

function nestedRecord(record: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = record[key];
  return isRecord(value) ? value : {};
}

function getSourceDescriptor(link: DataLinkRow): EndpointDescriptor {
  const metadata = linkMetadata(link);
  const mapping = linkMapping(link);
  const metadataSource = nestedRecord(metadata, "source");
  const mappingSource = nestedRecord(mapping, "source");

  return {
    type:
      link.source_type ??
      readString(metadata, ["source_type", "sourceType"]) ??
      readString(mapping, ["source_type", "sourceType"]) ??
      readString(metadataSource, ["type", "entityType", "sourceType"]) ??
      readString(mappingSource, ["type", "entityType", "sourceType"]) ??
      null,
    id:
      link.source_id ??
      link.source_element_id ??
      readString(metadata, ["source_id", "sourceId"]) ??
      readString(mapping, ["source_id", "sourceId"]) ??
      readString(metadataSource, ["id", "entityId", "sourceId"]) ??
      readString(mappingSource, ["id", "entityId", "sourceId"]) ??
      null,
  };
}

function getTargetDescriptor(link: DataLinkRow): EndpointDescriptor {
  const metadata = linkMetadata(link);
  const mapping = linkMapping(link);
  const metadataTarget = nestedRecord(metadata, "target");
  const mappingTarget = nestedRecord(mapping, "target");

  return {
    type:
      link.target_type ??
      readString(metadata, ["target_type", "targetType"]) ??
      readString(mapping, ["target_type", "targetType"]) ??
      readString(metadataTarget, ["type", "entityType", "targetType"]) ??
      readString(mappingTarget, ["type", "entityType", "targetType"]) ??
      null,
    id:
      link.target_id ??
      link.target_element_id ??
      readString(metadata, ["target_id", "targetId"]) ??
      readString(mapping, ["target_id", "targetId"]) ??
      readString(metadataTarget, ["id", "entityId", "targetId"]) ??
      readString(mappingTarget, ["id", "entityId", "targetId"]) ??
      null,
  };
}

function getRelationType(link: DataLinkRow): string {
  const metadata = linkMetadata(link);
  const mapping = linkMapping(link);

  return (
    link.relation_type ??
    readString(metadata, ["relation_type", "relationType"]) ??
    readString(mapping, ["relation_type", "relationType"]) ??
    link.link_kind ??
    "reference"
  );
}

function getSyncType(link: DataLinkRow): string {
  const metadata = linkMetadata(link);
  const mapping = linkMapping(link);

  return (
    link.sync_type ??
    readString(metadata, ["sync_type", "syncType"]) ??
    readString(mapping, ["sync_type", "syncType"]) ??
    "incremental"
  );
}

function isSupportedEventType(eventType: string): eventType is ProjectIntelligenceEventType {
  return PROJECT_INTELLIGENCE_EVENT_TYPES.includes(eventType as ProjectIntelligenceEventType);
}

function resolveOperation(
  relationType: string,
  syncType: string,
  fallbackOperation: SyncQueueOperation,
): SyncQueueOperation {
  const normalizedRelation = normalize(relationType);
  const normalizedSync = normalize(syncType);

  if (normalizedSync === "delete" || normalizedSync === "remove") return "delete";
  if (["full", "mirror", "two_way", "bidirectional", "rollup"].includes(normalizedSync ?? "")) return "upsert";
  if (["notify", "notification", "audit_only"].includes(normalizedSync ?? "")) return "insert";
  if (["derivation", "embed"].includes(normalizedRelation ?? "")) return "upsert";

  return fallbackOperation;
}

function resolveEntityTable(defaultEntityTable: string, target: EndpointDescriptor): string {
  const targetType = normalize(target.type);
  if (!targetType) return defaultEntityTable;

  const tableByTargetType: Record<string, string> = {
    task: "tasks",
    invoice: "invoices",
    contract: "contracts",
    project: "projects",
    budget: "project_budgets",
    risk: "project_risks",
    planning_element: "planning_elements",
    smart_doc: "smart_docs",
  };

  return tableByTargetType[targetType] ?? `${targetType.replace(/[^a-z0-9_]/g, "_")}s`;
}

function resolveEntityId(link: DataLinkRow, sourceId: string, target: EndpointDescriptor): string {
  const candidates = [target.id, link.target_element_id, sourceId, link.source_element_id, link.id];
  return candidates.find((candidate): candidate is string => Boolean(candidate && UUID_PATTERN.test(candidate))) ?? link.id;
}

export async function readProjectDataLinks(projectId: string): Promise<DataLinkRow[]> {
  const db = supabase as unknown as SupabaseUntypedClient;
  const { data, error } = await db.from("data_links").select("*").eq("project_id", projectId);

  if (error) {
    throw new Error(`Failed to read project data_links: ${error.message}`);
  }

  return data ?? [];
}

export function getAffectedLinks(
  links: DataLinkRow[],
  sourceType: string,
  sourceId: string,
): DataLinkRow[] {
  const normalizedSourceType = normalize(sourceType);

  return links.filter((link) => {
    const source = getSourceDescriptor(link);
    const sourceTypeMatches = normalize(source.type) === normalizedSourceType;
    const sourceIdMatches = source.id === sourceId || link.source_element_id === sourceId;

    return sourceIdMatches && (sourceTypeMatches || source.type === null || sourceType === "planning_element");
  });
}

export function buildSyncHandlersForLinks(
  context: CrossDepartmentEventContext,
  links: DataLinkRow[],
): SyncQueueHandler[] {
  if (!isSupportedEventType(context.eventType)) return [];

  const defaults = HANDLER_DEFAULTS[context.eventType];

  return links.map((link) => {
    const target = getTargetDescriptor(link);
    const relationType = getRelationType(link);
    const syncType = getSyncType(link);
    const operation = resolveOperation(relationType, syncType, defaults.fallbackOperation);
    const entityTable = resolveEntityTable(defaults.entityTable, target);
    const entityId = resolveEntityId(link, context.sourceId, target);

    return {
      handlerName: defaults.handlerName,
      eventType: context.eventType,
      relationType,
      syncType,
      linkId: link.id,
      projectId: context.projectId,
      boardId: context.boardId ?? link.board_id ?? null,
      entityTable,
      entityId,
      operation,
      createdBy: context.actorId,
      payload: {
        handler: defaults.handlerName,
        eventId: context.eventId ?? null,
        eventType: context.eventType,
        projectId: context.projectId,
        source: {
          type: context.sourceType,
          id: context.sourceId,
        },
        target,
        relationType,
        syncType,
        dataLinkId: link.id,
        occurredAt: context.occurredAt ?? new Date().toISOString(),
        eventPayload: context.payload ?? {},
      },
    };
  });
}

export async function getCrossDepartmentSyncHandlers(
  context: CrossDepartmentEventContext,
): Promise<SyncQueueHandler[]> {
  const links = await readProjectDataLinks(context.projectId);
  const affectedLinks = getAffectedLinks(links, context.sourceType, context.sourceId);

  return buildSyncHandlersForLinks(context, affectedLinks);
}

export function toSyncQueueInsert(handler: SyncQueueHandler): Record<string, unknown> {
  return {
    project_id: handler.projectId,
    board_id: handler.boardId,
    entity_table: handler.entityTable,
    entity_id: handler.entityId,
    operation: handler.operation,
    status: "pending",
    payload: handler.payload as Json,
    created_by: handler.createdBy,
  };
}
