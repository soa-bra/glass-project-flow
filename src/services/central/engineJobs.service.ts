/**
 * Engine Jobs Service — CRUD for `public.engine_jobs`.
 * Triggering side effects (Edge Function dispatch) lives in P4.
 */
import { supabase } from "@/integrations/supabase/client";
import {
  type EngineJob,
  type EngineJobCreateInput,
  engineJobCreateSchema,
} from "@/types/central";

export async function listEngineJobs(): Promise<EngineJob[]> {
  const { data, error } = await supabase
    .from("engine_jobs").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getEngineJob(id: string): Promise<EngineJob | null> {
  const { data, error } = await supabase
    .from("engine_jobs").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function createEngineJob(
  input: EngineJobCreateInput,
): Promise<EngineJob> {
  const parsed = engineJobCreateSchema.parse(input);
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Not authenticated");
  const payload = { ...parsed, owner_id: auth.user.id } as never;
  const { data, error } = await supabase
    .from("engine_jobs").insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateEngineJob(
  id: string,
  patch: Partial<EngineJobCreateInput>,
): Promise<EngineJob> {
  const { data, error } = await supabase
    .from("engine_jobs").update(patch as never).eq("id", id).select("*").single();
  if (error) throw error;
  return data;
}

export async function deleteEngineJob(id: string): Promise<void> {
  const { error } = await supabase.from("engine_jobs").delete().eq("id", id);
  if (error) throw error;
}
