/**
 * Departments Service — central CRUD for `public.departments`.
 */
import { supabase } from "@/integrations/supabase/client";
import {
  type Department,
  type DepartmentCreateInput,
  departmentCreateSchema,
} from "@/types/central";

export async function listDepartments(): Promise<Department[]> {
  const { data, error } = await supabase
    .from("departments").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getDepartment(id: string): Promise<Department | null> {
  const { data, error } = await supabase
    .from("departments").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function createDepartment(
  input: DepartmentCreateInput,
): Promise<Department> {
  const parsed = departmentCreateSchema.parse(input);
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Not authenticated");
  const payload = { ...parsed, owner_id: auth.user.id } as never;
  const { data, error } = await supabase
    .from("departments").insert(payload).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateDepartment(
  id: string,
  patch: Partial<DepartmentCreateInput>,
): Promise<Department> {
  const { data, error } = await supabase
    .from("departments").update(patch as never).eq("id", id).select("*").single();
  if (error) throw error;
  return data;
}

export async function deleteDepartment(id: string): Promise<void> {
  const { error } = await supabase.from("departments").delete().eq("id", id);
  if (error) throw error;
}
