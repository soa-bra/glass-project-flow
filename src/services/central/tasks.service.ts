/**
 * Tasks Service — central CRUD for `public.tasks`.
 */
import { supabase } from "@/integrations/supabase/client";
import {
  type Task,
  type TaskCreateInput,
  type TaskUpdateInput,
  taskCreateSchema,
  taskUpdateSchema,
} from "@/types/central";

export async function listTasksByProject(projectId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("linked_project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getTask(id: string): Promise<Task | null> {
  const { data, error } = await supabase
    .from("tasks").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function createTask(input: TaskCreateInput): Promise<Task> {
  const parsed = taskCreateSchema.parse(input);
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Not authenticated");
  const payload = { ...parsed, owner_id: auth.user.id } as never;
  const { data, error } = await supabase
    .from("tasks").insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateTask(id: string, patch: TaskUpdateInput): Promise<Task> {
  const parsed = taskUpdateSchema.parse(patch);
  const { data, error } = await supabase
    .from("tasks").update(parsed as never).eq("id", id).select("*").single();
  if (error) throw error;
  return data;
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}
