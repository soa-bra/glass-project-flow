import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import {
  getCrossDepartmentSyncHandlers,
  toSyncQueueInsert,
  type ProjectIntelligenceEventType,
  type SyncQueueHandler,
} from "./crossDepartmentLink.service";
import { writeProjectIntelligenceAudit } from "./auditLog.service";

export interface EmitProjectEventInput {
  projectId: string;
  eventType: ProjectIntelligenceEventType | string;
  sourceType: string;
  sourceId: string;
  actorId?: string | null;
  boardId?: string | null;
  eventKind?: "created" | "updated" | "deleted" | "status_changed" | "commented" | "synced" | "custom";
  eventVersion?: number;
  aggregateType?: string | null;
  aggregateId?: string | null;
  correlationId?: string | null;
  causationId?: string | null;
  payload?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  enqueueHandlers?: boolean;
}

export interface ProjectEventRecord {
  id: string;
  project_id: string;
  board_id: string | null;
  event_type: string;
  event_kind: string;
  actor_id: string | null;
  aggregate_type: string | null;
  aggregate_id: string | null;
  payload: Json;
  metadata: Json;
  created_at: string;
}

export interface EmitProjectEventResult {
  event: ProjectEventRecord;
  handlers: SyncQueueHandler[];
  syncQueueIds: string[];
}

interface InsertSingleBuilder<TRecord> {
  select: (columns: string) => {
    single: () => Promise<{ data: TRecord | null; error: { message: string } | null }>;
  };
}

interface InsertManyBuilder<TRecord> {
  select: (columns: string) => Promise<{ data: TRecord[] | null; error: { message: string } | null }>;
}

interface SelectSingleBuilder<TRecord> {
  select: (columns: string) => SelectSingleBuilder<TRecord>;
  eq: (column: string, value: string) => SelectSingleBuilder<TRecord>;
  single: () => Promise<{ data: TRecord | null; error: { message: string } | null }>;
}

interface UpdateBuilder<TRecord> {
  eq: (column: string, value: string) => {
    select: (columns: string) => {
      single: () => Promise<{ data: TRecord | null; error: { message: string } | null }>;
    };
  };
}

interface SupabaseTableClient<TRecord> {
  insert: (row: Record<string, unknown> | Record<string, unknown>[]) => InsertSingleBuilder<TRecord> & InsertManyBuilder<TRecord>;
  select: (columns: string) => SelectSingleBuilder<TRecord>;
  update: (row: Record<string, unknown>) => UpdateBuilder<TRecord>;
}

interface SupabaseUntypedClient {
  from: <TRecord>(table: string) => SupabaseTableClient<TRecord>;
}

interface SyncQueueIdRecord {
  id: string;
}

async function resolveActorId(actorId?: string | null): Promise<string> {
  if (actorId) return actorId;

  const { data } = await supabase.auth.getUser();
  const currentUserId = data.user?.id;

  if (!currentUserId) {
    throw new Error("Project event emission requires an actorId or an authenticated Supabase user.");
  }

  return currentUserId;
}

function getEventKind(eventType: string, explicitKind?: EmitProjectEventInput["eventKind"]): string {
  if (explicitKind) return explicitKind;
  if (eventType.includes("status")) return "status_changed";
  if (eventType.includes("signed") || eventType.includes("updated") || eventType.includes("changed")) return "updated";
  return "custom";
}

function getJsonRecord(value: Json | null | undefined): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

/**
 * يصدر حدث مشروع، يكتبه في project_events، ثم يصفّ handlers المتأثرة في sync_queue.
 */
export async function emitProjectEvent(input: EmitProjectEventInput): Promise<EmitProjectEventResult> {
  const actorId = await resolveActorId(input.actorId);
  const db = supabase as unknown as SupabaseUntypedClient;
  const eventKind = getEventKind(input.eventType, input.eventKind);
  const emittedAt = new Date().toISOString();

  const { data: event, error } = await db
    .from<ProjectEventRecord>("project_events")
    .insert({
      project_id: input.projectId,
      board_id: input.boardId ?? null,
      event_kind: eventKind,
      event_type: input.eventType,
      event_version: input.eventVersion ?? 1,
      aggregate_type: input.aggregateType ?? input.sourceType,
      aggregate_id: input.aggregateId ?? input.sourceId,
      actor_id: actorId,
      correlation_id: input.correlationId ?? null,
      causation_id: input.causationId ?? null,
      payload: {
        ...(input.payload ?? {}),
        sourceType: input.sourceType,
        sourceId: input.sourceId,
      } as Json,
      metadata: {
        ...(input.metadata ?? {}),
        emittedAt,
        processingStatus: "pending",
      } as Json,
    })
    .select("*")
    .single();

  if (error || !event) {
    await writeProjectIntelligenceAudit({
      actorId,
      action: "project.event.emit.failed",
      resourceType: "project_event",
      resourceId: null,
      decision: "error",
      scopeType: "project",
      scopeId: input.projectId,
      reason: error?.message ?? "project_events insert returned no row",
      metadata: {
        projectId: input.projectId,
        eventType: input.eventType,
        sourceType: input.sourceType,
        sourceId: input.sourceId,
      },
    });

    throw new Error(`Failed to emit project event: ${error?.message ?? "missing inserted event"}`);
  }

  await writeProjectIntelligenceAudit({
    actorId,
    action: "project.event.emitted",
    resourceType: "project_event",
    resourceId: event.id,
    scopeType: "project",
    scopeId: input.projectId,
    metadata: {
      eventType: input.eventType,
      eventKind,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      boardId: input.boardId ?? null,
    },
  });

  const handlers = input.enqueueHandlers === false
    ? []
    : await getCrossDepartmentSyncHandlers({
        eventId: event.id,
        eventType: input.eventType,
        projectId: input.projectId,
        boardId: input.boardId ?? null,
        sourceType: input.sourceType,
        sourceId: input.sourceId,
        actorId,
        payload: input.payload ?? {},
        occurredAt: event.created_at,
      });

  const syncQueueIds = await enqueueSyncHandlers(event, handlers);

  return {
    event,
    handlers,
    syncQueueIds,
  };
}

/**
 * يضيف handlers كصفوف pending في sync_queue، لتتم معالجتها خارج الواجهة.
 */
export async function enqueueSyncHandlers(
  event: ProjectEventRecord,
  handlers: SyncQueueHandler[],
): Promise<string[]> {
  if (handlers.length === 0) return [];

  const db = supabase as unknown as SupabaseUntypedClient;
  const rows = handlers.map(toSyncQueueInsert);
  const insertResult = await db.from<SyncQueueIdRecord>("sync_queue").insert(rows).select("id");
  const { data, error } = insertResult as { data: SyncQueueIdRecord[] | null; error: { message: string } | null };

  if (error) {
    await writeProjectIntelligenceAudit({
      actorId: event.actor_id,
      action: "project.event.sync_enqueue.failed",
      resourceType: "project_event",
      resourceId: event.id,
      decision: "error",
      scopeType: "project",
      scopeId: event.project_id,
      reason: error.message,
      metadata: {
        eventType: event.event_type,
        handlerCount: handlers.length,
        handlers: handlers.map((handler) => ({
          handlerName: handler.handlerName,
          linkId: handler.linkId,
          relationType: handler.relationType,
          syncType: handler.syncType,
        })),
      },
    });

    throw new Error(`Failed to enqueue sync handlers: ${error.message}`);
  }

  const ids = (data ?? []).map((row) => row.id);

  await writeProjectIntelligenceAudit({
    actorId: event.actor_id,
    action: "project.event.sync_enqueued",
    resourceType: "project_event",
    resourceId: event.id,
    scopeType: "project",
    scopeId: event.project_id,
    metadata: {
      eventType: event.event_type,
      syncQueueIds: ids,
      handlerCount: handlers.length,
      handlers: handlers.map((handler) => ({
        handlerName: handler.handlerName,
        linkId: handler.linkId,
        relationType: handler.relationType,
        syncType: handler.syncType,
      })),
    },
  });

  return ids;
}

/**
 * يعلّم event بأنه تمت صفّ معالجاته عبر metadata لأن project_events لا يملك عمود processed_at.
 */
export async function markEventProcessed(
  eventId: string,
  options: { actorId?: string | null; status?: "processed" | "failed"; error?: string | null } = {},
): Promise<ProjectEventRecord> {
  const db = supabase as unknown as SupabaseUntypedClient;
  const { data: existing, error: readError } = await db
    .from<ProjectEventRecord>("project_events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (readError || !existing) {
    throw new Error(`Failed to read project event before marking processed: ${readError?.message ?? "not found"}`);
  }

  const processedAt = new Date().toISOString();
  const nextMetadata = {
    ...getJsonRecord(existing.metadata),
    processingStatus: options.status ?? "processed",
    processedAt,
    processedBy: options.actorId ?? existing.actor_id ?? null,
    processingError: options.error ?? null,
  };

  const { data: updated, error: updateError } = await db
    .from<ProjectEventRecord>("project_events")
    .update({ metadata: nextMetadata as Json })
    .eq("id", eventId)
    .select("*")
    .single();

  if (updateError || !updated) {
    throw new Error(`Failed to mark project event processed: ${updateError?.message ?? "missing updated event"}`);
  }

  await writeProjectIntelligenceAudit({
    actorId: options.actorId ?? existing.actor_id,
    action: "project.event.processed",
    resourceType: "project_event",
    resourceId: eventId,
    decision: options.status === "failed" ? "error" : "allowed",
    reason: options.error ?? null,
    scopeType: "project",
    scopeId: existing.project_id,
    metadata: {
      eventType: existing.event_type,
      status: options.status ?? "processed",
      processedAt,
    },
  });

  return updated;
}
