/**
 * Permissions Service — thin client boundary for role permission checks.
 *
 * Uses the database `has_permission` RPC so frontend command guards can share
 * the same permission matrix as RLS and admin settings.
 */
import { supabase } from "@/integrations/supabase/client";
import { AuditService } from "./audit.service";

export interface PermissionDecision {
  allowed: boolean;
  reason: string | null;
}

export async function hasPermission(
  permissionCode: string,
  userId?: string,
): Promise<PermissionDecision> {
  const { data: auth } = await supabase.auth.getUser();
  const resolvedUserId = userId ?? auth.user?.id ?? null;

  if (!resolvedUserId) {
    return {
      allowed: false,
      reason: "not_authenticated",
    };
  }

  const { data, error } = await supabase.rpc("has_permission", {
    _user_id: resolvedUserId,
    _permission_code: permissionCode,
  });

  if (error) {
    return {
      allowed: false,
      reason: error.message,
    };
  }

  return {
    allowed: Boolean(data),
    reason: data ? null : "missing_permission",
  };
}

export async function requirePermission(
  permissionCode: string,
  input: {
    action: string;
    resourceType: string;
    resourceId?: string | null;
    metadata?: Record<string, unknown> | null;
  },
): Promise<void> {
  const decision = await hasPermission(permissionCode);

  if (decision.allowed) {
    return;
  }

  await AuditService.log({
    action: input.action,
    resource_type: input.resourceType,
    resource_id: input.resourceId ?? null,
    decision: "denied",
    reason: decision.reason,
    metadata: {
      ...(input.metadata ?? {}),
      permission_code: permissionCode,
    },
  });

  throw new Error(decision.reason ?? "missing_permission");
}
