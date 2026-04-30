/**
 * Projects Service — central CRUD for `public.projects`.
 * Owner is set automatically from the current Supabase session.
 */
import { supabase } from "@/integrations/supabase/client";
import {
  type Project,
  type ProjectCreateInput,
  type ProjectUpdateInput,
  projectCreateSchema,
  projectUpdateSchema,
} from "@/types/central";

export async function listProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function createProject(input: ProjectCreateInput): Promise<Project> {
  const parsed = projectCreateSchema.parse(input);
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("projects")
    .insert({ ...parsed, owner_id: auth.user.id })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateProject(
  id: string,
  patch: ProjectUpdateInput,
): Promise<Project> {
  const parsed = projectUpdateSchema.parse(patch);
  const { data, error } = await supabase
    .from("projects")
    .update(parsed)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}
