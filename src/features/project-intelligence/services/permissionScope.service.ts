import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { recordProjectIntelligenceAudit } from './auditLog.service';

export type PermissionScopeType = Database['public']['Enums']['role_scope_type'];

export interface PermissionScopeCheckInput {
  permissionCode: string;
  userId?: string;
  scopeType?: PermissionScopeType;
  scopeId?: string | null;
  audit?: boolean;
}

export interface PermissionScopeCheckResult {
  allowed: boolean;
  userId: string | null;
  permissionCode: string;
  scopeType: PermissionScopeType;
  scopeId: string | null;
  reason?: string;
}

export async function checkPermissionScope(
  input: PermissionScopeCheckInput,
): Promise<PermissionScopeCheckResult> {
  const { data: auth } = await supabase.auth.getUser();
  const userId = input.userId ?? auth.user?.id ?? null;
  const scopeType = input.scopeType ?? 'global';

  if (!userId) {
    const denied: PermissionScopeCheckResult = {
      allowed: false,
      userId,
      permissionCode: input.permissionCode,
      scopeType,
      scopeId: input.scopeId ?? null,
      reason: 'unauthenticated',
    };
    if (input.audit ?? true) await auditPermissionDecision(denied);
    return denied;
  }

  const { data, error } = await supabase.rpc('has_permission', {
    _user_id: userId,
    _permission_code: input.permissionCode,
  });

  const result: PermissionScopeCheckResult = {
    allowed: Boolean(data) && !error,
    userId,
    permissionCode: input.permissionCode,
    scopeType,
    scopeId: input.scopeId ?? null,
    reason: error?.message,
  };

  if (input.audit ?? true) await auditPermissionDecision(result);
  return result;
}

async function auditPermissionDecision(result: PermissionScopeCheckResult): Promise<void> {
  await recordProjectIntelligenceAudit({
    action: 'project_intelligence.permission_scope.check',
    resourceType: 'permission',
    resourceId: result.permissionCode,
    decision: result.allowed ? 'allowed' : 'denied',
    reason: result.reason ?? null,
    scopeType: result.scopeType,
    scopeId: result.scopeId,
    metadata: {
      userId: result.userId,
      permissionCode: result.permissionCode,
    },
  });
}

export const permissionScopeService = {
  check: checkPermissionScope,
};
