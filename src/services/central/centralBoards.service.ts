/**
 * Central Boards Service — CRUD for `public.central_boards`.
 * Distinct from legacy whiteboard `boards` (used by smart-elements).
 */
import { supabase } from "@/integrations/supabase/client";
import {
  type CentralBoard,
  type CentralBoardCreateInput,
  centralBoardCreateSchema,
} from "@/types/central";

export async function listCentralBoards(): Promise<CentralBoard[]> {
  const { data, error } = await supabase
    .from("central_boards").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getCentralBoard(id: string): Promise<CentralBoard | null> {
  const { data, error } = await supabase
    .from("central_boards").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function createCentralBoard(
  input: CentralBoardCreateInput,
): Promise<CentralBoard> {
  const parsed = centralBoardCreateSchema.parse(input);
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Not authenticated");
  const payload = { ...parsed, owner_id: auth.user.id } as never;
  const { data, error } = await supabase
    .from("central_boards").insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateCentralBoard(
  id: string,
  patch: Partial<CentralBoardCreateInput>,
): Promise<CentralBoard> {
  const { data, error } = await supabase
    .from("central_boards").update(patch as never).eq("id", id).select("*").single();
  if (error) throw error;
  return data;
}

export async function deleteCentralBoard(id: string): Promise<void> {
  const { error } = await supabase.from("central_boards").delete().eq("id", id);
  if (error) throw error;
}
