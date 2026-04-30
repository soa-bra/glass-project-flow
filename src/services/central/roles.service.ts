/**
 * Roles Service — قراءة/إسناد أدوار المستخدمين (Owner UI فقط — RLS يحرس).
 */
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];
export type RoleScopeType = Database["public"]["Enums"]["role_scope_type"];

export interface UserRoleRow {
  id: string;
  user_id: string;
  role: AppRole;
  scope_type: RoleScopeType;
  scope_id: string | null;
  granted_at: string;
  expires_at: string | null;
}

export interface UserWithRoles {
  user_id: string;
  display_name: string | null;
  roles: AppRole[];
}

export async function listAllUsersWithRoles(): Promise<UserWithRoles[]> {
  // profiles is readable by owner only via RLS — fetch then join roles
  const { data: profiles, error: pErr } = await supabase
    .from("profiles")
    .select("user_id, display_name");
  if (pErr) throw pErr;

  const { data: roles, error: rErr } = await supabase
    .from("user_roles")
    .select("user_id, role");
  if (rErr) throw rErr;

  const byUser = new Map<string, AppRole[]>();
  (roles ?? []).forEach((r) => {
    const arr = byUser.get(r.user_id) ?? [];
    arr.push(r.role as AppRole);
    byUser.set(r.user_id, arr);
  });

  return (profiles ?? []).map((p) => ({
    user_id: p.user_id,
    display_name: p.display_name,
    roles: byUser.get(p.user_id) ?? [],
  }));
}

export async function assignRole(
  userId: string,
  role: AppRole,
  scopeType: RoleScopeType = "global",
): Promise<void> {
  const { error } = await supabase
    .from("user_roles")
    .insert({ user_id: userId, role, scope_type: scopeType } as never);
  if (error) throw error;
}

export async function revokeRole(
  userId: string,
  role: AppRole,
): Promise<void> {
  const { error } = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", userId)
    .eq("role", role);
  if (error) throw error;
}
