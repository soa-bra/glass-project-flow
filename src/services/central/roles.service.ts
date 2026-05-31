/**
 * Roles Service — قراءة/إسناد أدوار المستخدمين (Owner UI فقط — RLS يحرس).
 */
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { AuditService } from "./audit.service";

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

export interface AssignRoleOptions {
  scopeId?: string | null;
  expiresAt?: string | null;
}

export interface RevokeRoleOptions {
  scopeId?: string | null;
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
  options: AssignRoleOptions = {},
): Promise<void> {
  const { data: auth } = await supabase.auth.getUser();
  const actorId = auth.user?.id ?? null;
  const scopeId = options.scopeId ?? null;

  const { error } = await supabase
    .from("user_roles")
    .insert({
      user_id: userId,
      role,
      scope_type: scopeType,
      scope_id: scopeId,
      expires_at: options.expiresAt ?? null,
      granted_by: actorId,
    } as never);

  if (error) {
    await AuditService.log({
      action: "central.role.assign",
      resource_type: "user_role",
      resource_id: userId,
      decision: "denied",
      reason: error.message,
      scope_type: scopeType,
      scope_id: scopeId,
      metadata: { role, target_user_id: userId },
    });
    throw error;
  }

  await AuditService.log({
    action: "central.role.assign",
    resource_type: "user_role",
    resource_id: userId,
    decision: "allowed",
    scope_type: scopeType,
    scope_id: scopeId,
    metadata: { role, target_user_id: userId },
  });
}

export async function revokeRole(
  userId: string,
  role: AppRole,
  scopeType: RoleScopeType = "global",
  options: RevokeRoleOptions = {},
): Promise<void> {
  const scopeId = options.scopeId ?? null;
  let query = supabase
    .from("user_roles")
    .delete()
    .eq("user_id", userId)
    .eq("role", role)
    .eq("scope_type", scopeType);

  query = scopeId === null ? query.is("scope_id", null) : query.eq("scope_id", scopeId);

  const { error } = await query;

  if (error) {
    await AuditService.log({
      action: "central.role.revoke",
      resource_type: "user_role",
      resource_id: userId,
      decision: "denied",
      reason: error.message,
      scope_type: scopeType,
      scope_id: scopeId,
      metadata: { role, target_user_id: userId },
    });
    throw error;
  }

  await AuditService.log({
    action: "central.role.revoke",
    resource_type: "user_role",
    resource_id: userId,
    decision: "allowed",
    scope_type: scopeType,
    scope_id: scopeId,
    metadata: { role, target_user_id: userId },
  });
}
