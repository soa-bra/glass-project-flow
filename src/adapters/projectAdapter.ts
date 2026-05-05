/**
 * Project Adapter — يحوّل صفّ `projects` المركزي إلى `Project` (UI shape) والعكس.
 *
 * يبقى بمعزل عن أي ملف UI ليتم اختباره بسهولة، ويسمح لـ `ProjectWorkspace`
 * بالعمل دون أي تعديل بصري.
 */
import type { Project as UiProject } from "@/types/project";
import type { Project as CentralProject, ProjectCreateInput } from "@/types/central";

const STATE_TO_STATUS: Record<string, UiProject["status"]> = {
  draft: "info",
  active: "success",
  blocked: "warning",
  completed: "success",
  archived: "info",
  cancelled: "error",
};

function daysUntil(date: string | null | undefined): number {
  if (!date) return 0;
  const ms = new Date(date).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function formatShortDate(date: string | null | undefined): string {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("ar-SA", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export function centralToUiProject(p: CentralProject): UiProject {
  const meta = (p.metadata ?? {}) as Record<string, unknown>;
  return {
    id: p.id,
    title: p.name,
    description: p.description ?? "",
    daysLeft: daysUntil(p.due_date),
    tasksCount: typeof meta.tasksCount === "number" ? meta.tasksCount : 0,
    status: STATE_TO_STATUS[p.state] ?? "info",
    date: formatShortDate(p.due_date),
    owner: typeof meta.ownerName === "string" ? meta.ownerName : "—",
    value: p.budget != null ? `${p.budget}` : "0",
    isOverBudget: typeof meta.isOverBudget === "boolean" ? meta.isOverBudget : false,
    hasOverdueTasks: typeof meta.hasOverdueTasks === "boolean" ? meta.hasOverdueTasks : false,
    team: Array.isArray(meta.team) ? (meta.team as { name: string; avatar?: string }[]) : [],
    progress: typeof meta.progress === "number" ? meta.progress : 0,
  };
}

/** يُستعمل من `ProjectWorkspace.handleProjectAdded` بعد أن تأتي البيانات من Modal. */
export function uiCreateInputToCentral(input: {
  name: string;
  description?: string;
  budget?: number;
  deadline?: string;
}): ProjectCreateInput {
  return {
    name: input.name,
    description: input.description ?? null,
    budget: input.budget ?? null,
    due_date: input.deadline ? new Date(input.deadline).toISOString() : null,
  };
}
