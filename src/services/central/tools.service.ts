/**
 * Tools Service — CRUD for `public.tools`.
 */
import { supabase } from "@/integrations/supabase/client";
import {
  type Tool,
  type ToolCreateInput,
  toolCreateSchema,
} from "@/types/central";

export async function listTools(centralBoardId?: string): Promise<Tool[]> {
  const q = supabase.from("tools").select("*").order("created_at", { ascending: false });
  const { data, error } = centralBoardId
    ? await q.eq("central_board_id", centralBoardId)
    : await q;
  if (error) throw error;
  return data ?? [];
}

export async function getTool(id: string): Promise<Tool | null> {
  const { data, error } = await supabase
    .from("tools").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function createTool(input: ToolCreateInput): Promise<Tool> {
  const parsed = toolCreateSchema.parse(input);
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Not authenticated");
  const payload = { ...parsed, owner_id: auth.user.id } as never;
  const { data, error } = await supabase
    .from("tools").insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateTool(
  id: string,
  patch: Partial<ToolCreateInput>,
): Promise<Tool> {
  const { data, error } = await supabase
    .from("tools").update(patch as never).eq("id", id).select("*").single();
  if (error) throw error;
  return data;
}

export async function deleteTool(id: string): Promise<void> {
  const { error } = await supabase.from("tools").delete().eq("id", id);
  if (error) throw error;
}
