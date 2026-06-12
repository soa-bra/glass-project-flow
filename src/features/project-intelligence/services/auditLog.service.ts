/**
 * Project Intelligence Audit Log
 *
 * القرار الحالي: جدول audit المعتمد في هذا المشروع هو `public.audit_events`، وليس
 * `audit_logs`. لذلك تقوم طبقة project-intelligence بتغليف audit الحالي بدل إنشاء
 * جدول جديد. إذا تقرر لاحقًا الانتقال إلى `audit_logs` فيجب أن يتم ذلك عبر migration
 * و adapter هنا يحافظ على نفس واجهة الخدمة.
 */
import { supabase } from '@/integrations/supabase/client';
import type { Database, Json } from '@/integrations/supabase/types';

export type AuditEventRow = Database['public']['Tables']['audit_events']['Row'];
export type AuditEventInsert = Database['public']['Tables']['audit_events']['Insert'];
export type AuditDecision = Database['public']['Enums']['audit_decision'];
export type AuditScopeType = Database['public']['Enums']['role_scope_type'];

export interface ProjectIntelligenceAuditInput {
  action: string;
  resourceType: string;
  resourceId?: string | null;
  decision?: AuditDecision;
  reason?: string | null;
  scopeType?: AuditScopeType | null;
  scopeId?: string | null;
  metadata?: Record<string, unknown> | null;
}

export const PROJECT_INTELLIGENCE_AUDIT_TABLE = 'audit_events' as const;
export const AUDIT_LOG_MIGRATION_DECISION =
  'Keep using public.audit_events as the approved audit table; migrate to audit_logs only with a future schema migration.';

export async function recordProjectIntelligenceAudit(
  input: ProjectIntelligenceAuditInput,
): Promise<AuditEventRow | null> {
  const { data: auth } = await supabase.auth.getUser();
  const row: AuditEventInsert = {
    actor_id: auth.user?.id ?? null,
    action: input.action,
    resource_type: input.resourceType,
    resource_id: input.resourceId ?? null,
    decision: input.decision ?? 'allowed',
    reason: input.reason ?? null,
    scope_type: input.scopeType ?? null,
    scope_id: input.scopeId ?? null,
    metadata: (input.metadata ?? null) as Json | null,
  };

  const { data, error } = await supabase
    .from(PROJECT_INTELLIGENCE_AUDIT_TABLE)
    .insert(row)
    .select('*')
    .single();

  if (error) {
    console.warn('[project-intelligence:audit] failed to record audit event', error.message, input);
    return null;
  }

  return data;
}
