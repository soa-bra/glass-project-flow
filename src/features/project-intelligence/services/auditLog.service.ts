import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

type AuditDecision = "allowed" | "denied" | "error";
type AuditScopeType = "global" | "department" | "project" | "board";

export interface ProjectIntelligenceAuditInput {
  action: string;
  resourceType: string;
  resourceId?: string | null;
  actorId?: string | null;
  decision?: AuditDecision;
  reason?: string | null;
  scopeType?: AuditScopeType | null;
  scopeId?: string | null;
  metadata?: Record<string, unknown> | null;
}

interface SupabaseTableClient {
  insert: (row: Record<string, unknown>) => {
    select: (columns: string) => {
      single: () => Promise<{ data: { id: string } | null; error: { message: string } | null }>;
    };
  };
}

interface SupabaseUntypedClient {
  from: (table: string) => SupabaseTableClient;
}

async function resolveActorId(actorId?: string | null): Promise<string | null> {
  if (actorId) return actorId;

  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

/**
 * يكتب سجل تدقيق لمسار Project Intelligence بدون رمي الخطأ للمستدعي.
 * فشل التدقيق لا يجب أن يمنع إصدار الحدث أو صفوف المزامنة.
 */
export async function writeProjectIntelligenceAudit(
  input: ProjectIntelligenceAuditInput,
): Promise<string | null> {
  try {
    const actorId = await resolveActorId(input.actorId);
    const db = supabase as unknown as SupabaseUntypedClient;
    const { data, error } = await db
      .from("audit_events")
      .insert({
        actor_id: actorId,
        resource_type: input.resourceType,
        resource_id: input.resourceId ?? null,
        action: input.action,
        decision: input.decision ?? "allowed",
        reason: input.reason ?? null,
        scope_type: input.scopeType ?? null,
        scope_id: input.scopeId ?? null,
        metadata: (input.metadata ?? null) as Json | null,
      })
      .select("id")
      .single();

    if (error) {
      // eslint-disable-next-line no-console
      console.warn("[project-intelligence:audit] failed to write audit row", error.message);
      return null;
    }

    return data?.id ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("[project-intelligence:audit] failed to write audit row", error);
    return null;
  }
}
