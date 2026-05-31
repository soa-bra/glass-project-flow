/**
 * Planning Boards Service — CRUD for `public.planning_boards` and
 * `public.planning_elements` (P1.a).
 *
 * Authorization model (UR-009):
 * - Every write requires an authenticated user (`auth.uid()`).
 * - RLS enforces ownership/global-owner at the database layer; this service
 *   adds frontend pre-checks to fail fast with clearer errors.
 * - Element lock helpers (`lockElement`/`unlockElement`) implement the
 *   30-second cooperative lock contract from UR-005 (lock auto-expires by
 *   filtering on `locked_at` server-side).
 *
 * Import via the central barrel: `@/services/central`.
 */
import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { z } from "zod";
import {
  isSmartDocElementType,
  SMART_DOC_SCHEMA_VERSION,
  validateSmartDocContent,
} from "@/features/planning/elements/smart-doc/contract";
import { planningElementToConnectorLogicalRecord } from "@/features/planning/integration/connectors";
import { upsertSmartConnector, upsertSmartConnectors } from "./smartConnectors.service";

// ── Types ───────────────────────────────────────────────────────────────────
export type PlanningBoard = Database["public"]["Tables"]["planning_boards"]["Row"];
export type PlanningBoardInsert =
  Database["public"]["Tables"]["planning_boards"]["Insert"];
export type PlanningBoardUpdate =
  Database["public"]["Tables"]["planning_boards"]["Update"];

export type PlanningElement =
  Database["public"]["Tables"]["planning_elements"]["Row"];
export type PlanningElementInsert =
  Database["public"]["Tables"]["planning_elements"]["Insert"];
export type PlanningElementUpdate =
  Database["public"]["Tables"]["planning_elements"]["Update"];

export type PlanningElementType =
  Database["public"]["Enums"]["planning_element_type"];

/** Lock TTL — must match docs/CANVAS_LIMITATIONS.md (UR-005). */
export const ELEMENT_LOCK_TTL_MS = 30_000;

// ── Zod schemas ─────────────────────────────────────────────────────────────
const centralStateSchema = z.enum([
  "draft", "planned", "active", "blocked", "paused",
  "completed", "cancelled", "archived", "failed",
]);

export const planningBoardCreateSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  state: centralStateSchema.optional(),
  settings: z.record(z.unknown()).optional(),
  metadata: z.record(z.unknown()).optional().nullable(),
});
export type PlanningBoardCreateInput = z.infer<typeof planningBoardCreateSchema>;

export const planningBoardUpdateSchema = planningBoardCreateSchema.partial();
export type PlanningBoardUpdateInput = z.infer<typeof planningBoardUpdateSchema>;

const planningElementTypeSchema = z.enum([
  "sticky", "shape", "text", "smart_doc", "interactive_sheet",
  "mindmap_node", "mindmap_connector", "visual_node", "visual_connector",
  "root_connector", "frame", "connector", "entity_card",
]);

const positionSchema = z.object({ x: z.number(), y: z.number() });
const sizeSchema = z.object({ width: z.number(), height: z.number() });

export const planningElementCreateSchema = z.object({
  board_id: z.string().uuid(),
  element_type: planningElementTypeSchema,
  position: positionSchema.optional(),
  size: sizeSchema.optional(),
  rotation: z.number().optional(),
  z_index: z.number().int().optional(),
  content: z.record(z.unknown()).optional(),
  style: z.record(z.unknown()).optional(),
  metadata: z.record(z.unknown()).optional(),
  schema_version: z.number().int().min(1).optional(),
});
export type PlanningElementCreateInput =
  z.infer<typeof planningElementCreateSchema>;

export const planningElementUpdateSchema = planningElementCreateSchema
  .omit({ board_id: true })
  .partial();
export type PlanningElementUpdateInput =
  z.infer<typeof planningElementUpdateSchema>;

// ── Internal helpers ────────────────────────────────────────────────────────
async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error("Not authenticated");
  return data.user.id;
}

// ── Boards CRUD ─────────────────────────────────────────────────────────────
export async function listPlanningBoards(): Promise<PlanningBoard[]> {
  const { data, error } = await supabase
    .from("planning_boards")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPlanningBoard(
  id: string,
): Promise<PlanningBoard | null> {
  const { data, error } = await supabase
    .from("planning_boards")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function createPlanningBoard(
  input: PlanningBoardCreateInput,
): Promise<PlanningBoard> {
  const parsed = planningBoardCreateSchema.parse(input);
  const owner_id = await requireUserId();
  const payload: PlanningBoardInsert = {
    name: parsed.name,
    description: parsed.description ?? null,
    state: parsed.state,
    settings: (parsed.settings ?? {}) as Json,
    metadata: (parsed.metadata ?? null) as Json | null,
    owner_id,
  };
  const { data, error } = await supabase
    .from("planning_boards")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updatePlanningBoard(
  id: string,
  patch: PlanningBoardUpdateInput,
): Promise<PlanningBoard> {
  const parsed = planningBoardUpdateSchema.parse(patch);
  const update: PlanningBoardUpdate = {
    ...parsed,
    settings: parsed.settings as Json | undefined,
    metadata: parsed.metadata as Json | undefined,
  };
  const { data, error } = await supabase
    .from("planning_boards")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deletePlanningBoard(id: string): Promise<void> {
  const { error } = await supabase.from("planning_boards").delete().eq("id", id);
  if (error) throw error;
}

// ── Elements CRUD ───────────────────────────────────────────────────────────
export async function listPlanningElements(
  boardId: string,
): Promise<PlanningElement[]> {
  const { data, error } = await supabase
    .from("planning_elements")
    .select("*")
    .eq("board_id", boardId)
    .order("z_index", { ascending: true })
    .order("updated_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getPlanningElement(
  id: string,
): Promise<PlanningElement | null> {
  const { data, error } = await supabase
    .from("planning_elements")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function createPlanningElement(
  input: PlanningElementCreateInput,
): Promise<PlanningElement> {
  const parsed = planningElementCreateSchema.parse(input);
  const created_by = await requireUserId();
  // P1.c — validate smart-doc payloads against the contract before insert.
  if (isSmartDocElementType(parsed.element_type) && parsed.content) {
    validateSmartDocContent(parsed.content);
  }
  const payload: PlanningElementInsert = {
    board_id: parsed.board_id,
    element_type: parsed.element_type,
    position: (parsed.position ?? { x: 0, y: 0 }) as Json,
    size: (parsed.size ?? { width: 200, height: 120 }) as Json,
    rotation: parsed.rotation ?? 0,
    z_index: parsed.z_index ?? 0,
    content: (parsed.content ?? {}) as Json,
    style: (parsed.style ?? {}) as Json,
    metadata: (parsed.metadata ?? {}) as Json,
    schema_version: parsed.schema_version ??
      (isSmartDocElementType(parsed.element_type) ? SMART_DOC_SCHEMA_VERSION : 1),
    created_by,
  };
  const { data, error } = await supabase
    .from("planning_elements")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  const connectorRecord = planningElementToConnectorLogicalRecord(data);
  if (connectorRecord) await upsertSmartConnector(connectorRecord);
  return data;
}

export async function updatePlanningElement(
  id: string,
  patch: PlanningElementUpdateInput,
): Promise<PlanningElement> {
  const parsed = planningElementUpdateSchema.parse(patch);
  // P1.c — validate smart-doc payloads on update when type+content provided.
  if (
    parsed.element_type &&
    isSmartDocElementType(parsed.element_type) &&
    parsed.content
  ) {
    validateSmartDocContent(parsed.content);
  }
  const update: PlanningElementUpdate = {
    ...parsed,
    position: parsed.position as Json | undefined,
    size: parsed.size as Json | undefined,
    content: parsed.content as Json | undefined,
    style: parsed.style as Json | undefined,
    metadata: parsed.metadata as Json | undefined,
  };
  const { data, error } = await supabase
    .from("planning_elements")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  const connectorRecord = planningElementToConnectorLogicalRecord(data);
  if (connectorRecord) await upsertSmartConnector(connectorRecord);
  return data;
}

export async function deletePlanningElement(id: string): Promise<void> {
  const { error } = await supabase
    .from("planning_elements")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

/** Bulk upsert — used by debounced save loop (P1.a). */
export async function upsertPlanningElements(
  rows: PlanningElementInsert[],
): Promise<PlanningElement[]> {
  if (rows.length === 0) return [];
  const { data, error } = await supabase
    .from("planning_elements")
    .upsert(rows)
    .select("*");
  if (error) throw error;
  const savedRows = data ?? [];
  const connectorRecords = savedRows
    .map((row) => planningElementToConnectorLogicalRecord(row))
    .filter((record): record is NonNullable<typeof record> => Boolean(record));
  await upsertSmartConnectors(connectorRecords);
  return savedRows;
}

// ── Element locking (UR-005) ────────────────────────────────────────────────
/**
 * Acquire a 30s cooperative lock on an element. Only succeeds if the element
 * is currently unlocked OR its lock has expired OR it is already held by the
 * current user (idempotent refresh).
 *
 * Returns the updated row on success, or `null` if another user holds a live
 * lock.
 */
export async function lockElement(
  id: string,
): Promise<PlanningElement | null> {
  const userId = await requireUserId();
  const cutoffIso = new Date(Date.now() - ELEMENT_LOCK_TTL_MS).toISOString();
  const { data, error } = await supabase
    .from("planning_elements")
    .update({ locked_by: userId, locked_at: new Date().toISOString() })
    .eq("id", id)
    .or(
      `locked_by.is.null,locked_by.eq.${userId},locked_at.lt.${cutoffIso}`,
    )
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function unlockElement(id: string): Promise<void> {
  const userId = await requireUserId();
  const { error } = await supabase
    .from("planning_elements")
    .update({ locked_by: null, locked_at: null })
    .eq("id", id)
    .eq("locked_by", userId);
  if (error) throw error;
}

/** Release every lock currently held by the user on a board. */
export async function releaseUserLocksOnBoard(
  boardId: string,
): Promise<void> {
  const userId = await requireUserId();
  const { error } = await supabase
    .from("planning_elements")
    .update({ locked_by: null, locked_at: null })
    .eq("board_id", boardId)
    .eq("locked_by", userId);
  if (error) throw error;
}

/**
 * Exclusive lock — at most ONE element per user per board (UR-005).
 * Releases any other element the user currently holds on the board, then
 * acquires the target. Returns the locked row, or `null` if another user
 * holds a live lock on the target.
 */
export async function acquireExclusiveElementLock(
  boardId: string,
  elementId: string,
): Promise<PlanningElement | null> {
  const userId = await requireUserId();
  // 1) Release any other locks held by this user on this board.
  const { error: releaseErr } = await supabase
    .from("planning_elements")
    .update({ locked_by: null, locked_at: null })
    .eq("board_id", boardId)
    .eq("locked_by", userId)
    .neq("id", elementId);
  if (releaseErr) throw releaseErr;

  // 2) Acquire (or refresh) lock on the target with 30s TTL window.
  const cutoffIso = new Date(Date.now() - ELEMENT_LOCK_TTL_MS).toISOString();
  const { data, error } = await supabase
    .from("planning_elements")
    .update({ locked_by: userId, locked_at: new Date().toISOString() })
    .eq("id", elementId)
    .eq("board_id", boardId)
    .or(`locked_by.is.null,locked_by.eq.${userId},locked_at.lt.${cutoffIso}`)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

// ── Element history ─────────────────────────────────────────────────────────
export interface PlanningElementHistoryEntry {
  id: string;
  element_id: string;
  board_id: string;
  actor_id: string | null;
  action: "insert" | "update" | "delete";
  changed_fields: Record<string, { old: unknown; new: unknown }>;
  snapshot: Record<string, unknown> | null;
  created_at: string;
}

export async function listElementHistory(
  elementId: string,
  limit = 100,
): Promise<PlanningElementHistoryEntry[]> {
  const { data, error } = await supabase
    .from("planning_element_history" as never)
    .select("*")
    .eq("element_id", elementId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as PlanningElementHistoryEntry[];
}
