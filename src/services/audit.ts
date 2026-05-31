/**
 * Audit logging helper — writes to public.audit_events.
 * RLS allows authenticated users to INSERT events when actor_id = auth.uid() or null.
 * Failures are swallowed (logged to console only) to avoid blocking user actions.
 */
import { supabase } from "@/integrations/supabase/client";

export type AuditDecision = "allowed" | "denied" | "error";
export type AuditScope = "global" | "department" | "project" | "board";

export interface AuditEventInput {
  resource_type: string;
  action: string;
  resource_id?: string | null;
  decision?: AuditDecision;
  reason?: string | null;
  scope_type?: AuditScope | null;
  scope_id?: string | null;
  metadata?: Record<string, unknown> | null;
}

/**
 * Legacy auditService API — kept for existing callers (e.g. planning authz).
 * Maps eventType/entityType/entityId/metadata into the audit_events row shape.
 */
export const auditService = {
  logEvent(event: {
    eventType: string;
    entityType: string;
    entityId?: string | null;
    metadata?: Record<string, unknown> | null;
  }): Promise<void> {
    return audit({
      resource_type: event.entityType,
      action: event.eventType,
      resource_id: event.entityId ?? null,
      decision: event.eventType.endsWith(".denied") ? "denied" : "allowed",
      metadata: event.metadata ?? null,
    });
  },
};

export async function audit(event: AuditEventInput): Promise<void> {
  try {
    const { data: auth } = await supabase.auth.getUser();
    const actor_id = auth.user?.id ?? null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as unknown as { from: (t: string) => any };
    await db.from("audit_events").insert({
      actor_id,
      resource_type: event.resource_type,
      action: event.action,
      resource_id: event.resource_id ?? null,
      decision: event.decision ?? "allowed",
      reason: event.reason ?? null,
      scope_type: event.scope_type ?? null,
      scope_id: event.scope_id ?? null,
      metadata: event.metadata ?? null,
    });
  } catch (err) {
    // Never block the caller for audit failures.
    // eslint-disable-next-line no-console
    console.warn("[audit] failed to record event", event.resource_type, event.action, err);
  }
}
