/**
 * Central Task → UnifiedTask adapter.
 *
 * يسمح للمكوّنات الجديدة باستهلاك Central tasks (uuid + central schema)
 * بنفس shape `UnifiedTask` القديم (id: string, title, status, …) دون
 * المساس بـ 22 ملفًا تستخدم النموذج القديم.
 *
 * الاستخدام النموذجي:
 *   const central = useProjectCentralTasks(projectId);
 *   const unified = central.data?.map(toUnifiedTask) ?? [];
 *   // ثم مرّر `unified` لأي مكوّن TaskCard قديم.
 *
 * هذا يفصل التحوّل التدريجي ويُغني عن نقل دفعة واحدة كبيرة.
 */
import type { Database } from "@/integrations/supabase/types";
import type { UnifiedTask } from "@/types/task";

type CentralTask = Database["public"]["Tables"]["tasks"]["Row"];

const STATE_TO_STATUS: Record<CentralTask["state"], UnifiedTask["status"]> = {
  draft: "todo",
  planned: "todo",
  active: "in-progress",
  paused: "stopped",
  blocked: "stopped",
  completed: "completed",
  archived: "completed",
  cancelled: "stopped",
  failed: "stopped",
};

const PRIORITY_MAP: Record<CentralTask["priority"], UnifiedTask["priority"]> = {
  low: "low",
  medium: "medium",
  high: "high",
  critical: "urgent",
};

export function toUnifiedTask(t: CentralTask): UnifiedTask {
  const meta = (t.metadata ?? {}) as Record<string, unknown>;
  return {
    id: t.id,
    title: t.name,
    description: t.description ?? "",
    assignee: t.assignee_id ?? "",
    priority: PRIORITY_MAP[t.priority] ?? "medium",
    dueDate: t.due_date ?? "",
    status: STATE_TO_STATUS[t.state] ?? "todo",
    tags: Array.isArray(meta.tags) ? (meta.tags as string[]) : [],
    attachments: typeof meta.attachments === "number" ? (meta.attachments as number) : 0,
    comments: typeof meta.comments === "number" ? (meta.comments as number) : 0,
    linkedTasks: Array.isArray(meta.linkedTasks) ? (meta.linkedTasks as string[]) : [],
    progress: typeof meta.progress === "number" ? (meta.progress as number) : 0,
    projectId: t.linked_project_id,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  };
}

/** عكسي — يبني patch لجدول tasks من تعديلات UnifiedTask جزئية. */
export function fromUnifiedTaskPatch(
  patch: Partial<UnifiedTask>,
): Partial<Database["public"]["Tables"]["tasks"]["Update"]> {
  const out: Partial<Database["public"]["Tables"]["tasks"]["Update"]> = {};
  if (patch.title !== undefined) out.name = patch.title;
  if (patch.description !== undefined) out.description = patch.description;
  if (patch.assignee !== undefined) out.assignee_id = patch.assignee || null;
  if (patch.dueDate !== undefined) out.due_date = patch.dueDate || null;
  if (patch.priority !== undefined) {
    const inv: Record<UnifiedTask["priority"], CentralTask["priority"]> = {
      low: "low",
      medium: "medium",
      high: "high",
      urgent: "critical",
    };
    out.priority = inv[patch.priority];
  }
  if (patch.status !== undefined) {
    const inv: Record<UnifiedTask["status"], CentralTask["state"]> = {
      todo: "draft",
      "in-progress": "active",
      completed: "completed",
      stopped: "paused",
      treating: "active",
      late: "active",
    };
    out.state = inv[patch.status];
  }
  return out;
}
