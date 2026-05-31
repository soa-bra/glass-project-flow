/**
 * Central Data Model — type re-exports + Zod schemas.
 *
 * This module is the **single source of truth** for the central integration
 * model on the frontend. It re-exports the auto-generated Supabase types
 * (Row/Insert/Update) and pairs them with Zod schemas for runtime validation.
 *
 * NEVER import from `@/integrations/supabase/types` directly in feature code —
 * always go through this module so we can swap shapes safely later.
 */
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

// ── Enums ───────────────────────────────────────────────────────────────────
export type CentralState = Database["public"]["Enums"]["central_state"];
export type CentralPriority = Database["public"]["Enums"]["central_priority"];
export type CentralComplexity = Database["public"]["Enums"]["central_complexity"];
export type CentralEntityType = Database["public"]["Enums"]["central_entity_type"];
export type CentralDependencyType = Database["public"]["Enums"]["central_dependency_type"];
export type DepartmentProjectRole = Database["public"]["Enums"]["department_project_role"];
export type ToolKind = Database["public"]["Enums"]["tool_kind"];
export type EngineJobKind = Database["public"]["Enums"]["engine_job_kind"];
export type TaskToolEngineRelationType =
  Database["public"]["Enums"]["task_tool_engine_relation_type"];

export const CENTRAL_STATES: readonly CentralState[] = [
  "draft", "planned", "active", "blocked", "paused",
  "completed", "cancelled", "archived", "failed",
] as const;

export const CENTRAL_PRIORITIES: readonly CentralPriority[] = [
  "low", "medium", "high", "critical",
] as const;

export const CENTRAL_COMPLEXITIES: readonly CentralComplexity[] = [
  "trivial", "simple", "moderate", "complex", "critical",
] as const;

const stateSchema = z.enum([
  "draft", "planned", "active", "blocked", "paused",
  "completed", "cancelled", "archived", "failed",
]);
const prioritySchema = z.enum(["low", "medium", "high", "critical"]);
const complexitySchema = z.enum(["trivial", "simple", "moderate", "complex", "critical"]);
const toolKindSchema = z.enum([
  "board_widget", "dashboard_panel", "workflow_tool", "analysis_tool", "integration_tool",
]);
const engineJobKindSchema = z.enum([
  "automation", "data_processing", "orchestration", "sync", "analytics", "validation",
]);

// ── Row types ───────────────────────────────────────────────────────────────
export type CentralBoard = Database["public"]["Tables"]["central_boards"]["Row"];
export type Department = Database["public"]["Tables"]["departments"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type DepartmentProject = Database["public"]["Tables"]["department_projects"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type Tool = Database["public"]["Tables"]["tools"]["Row"];
export type EngineJob = Database["public"]["Tables"]["engine_jobs"]["Row"];
export type TaskToolEngineLink =
  Database["public"]["Tables"]["task_tool_engine_links"]["Row"];
export type ProjectCard = Database["public"]["Tables"]["project_cards"]["Row"];
export type TaskCard = Database["public"]["Tables"]["task_cards"]["Row"];
export type Dependency = Database["public"]["Tables"]["dependencies"]["Row"];

// ── Zod input schemas (for create/update) ───────────────────────────────────
export const projectCreateSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  state: stateSchema.optional(),
  priority: prioritySchema.optional(),
  start_date: z.string().datetime().optional().nullable(),
  due_date: z.string().datetime().optional().nullable(),
  budget: z.number().nonnegative().optional().nullable(),
  metadata: z.record(z.unknown()).optional().nullable(),
});
export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;

export const projectUpdateSchema = projectCreateSchema.partial();
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;

export const taskCreateSchema = z.object({
  linked_project_id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  state: stateSchema.optional(),
  priority: prioritySchema.optional(),
  assignee_id: z.string().uuid().optional().nullable(),
  estimated_duration: z.number().nonnegative().default(0),
  estimated_cost: z.number().nonnegative().default(0),
  complexity: complexitySchema.default("simple"),
  required_team_size: z.number().int().positive().default(1),
  start_date: z.string().datetime().optional().nullable(),
  due_date: z.string().datetime().optional().nullable(),
  metadata: z.record(z.unknown()).optional().nullable(),
});
export type TaskCreateInput = z.infer<typeof taskCreateSchema>;

export const taskUpdateSchema = taskCreateSchema.partial();
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;

export const departmentCreateSchema = z.object({
  name: z.string().min(1).max(200),
  code: z.string().min(1).max(50),
  description: z.string().max(2000).optional().nullable(),
  state: stateSchema.optional(),
  priority: prioritySchema.optional(),
  metadata: z.record(z.unknown()).optional().nullable(),
});
export type DepartmentCreateInput = z.infer<typeof departmentCreateSchema>;

export const centralBoardCreateSchema = z.object({
  name: z.string().min(1).max(200),
  code: z.string().min(1).max(50),
  description: z.string().max(2000).optional().nullable(),
  state: stateSchema.optional(),
  priority: prioritySchema.optional(),
  metadata: z.record(z.unknown()).optional().nullable(),
});
export type CentralBoardCreateInput = z.infer<typeof centralBoardCreateSchema>;

export const toolCreateSchema = z.object({
  central_board_id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  kind: toolKindSchema,
  state: stateSchema.optional(),
  priority: prioritySchema.optional(),
  produced_by_task_id: z.string().uuid().optional().nullable(),
  metadata: z.record(z.unknown()).optional().nullable(),
});
export type ToolCreateInput = z.infer<typeof toolCreateSchema>;

export const engineJobCreateSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  kind: engineJobKindSchema,
  state: stateSchema.optional(),
  priority: prioritySchema.optional(),
  produced_by_task_id: z.string().uuid().optional().nullable(),
  triggered_by_tool_id: z.string().uuid().optional().nullable(),
  metadata: z.record(z.unknown()).optional().nullable(),
});
export type EngineJobCreateInput = z.infer<typeof engineJobCreateSchema>;
