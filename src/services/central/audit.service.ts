/**
 * Audit Service — يكتب ويقرأ من جدول `public.audit_events` الحقيقي.
 *
 * يحلّ محل `mockAuditEvents` تدريجيًا (P2 → P3). يحافظ على signature بسيط
 * يقبله أي service decorator أو command gateway لاحقًا.
 */
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AuditDecision = Database["public"]["Enums"]["audit_decision"];
export type AuditScopeType = Database["public"]["Enums"]["role_scope_type"];

export interface AuditLogInput {
  action: string;
  resource_type: string;
  resource_id?: string | null;
  decision?: AuditDecision;
  reason?: string | null;
  scope_type?: AuditScopeType | null;
  scope_id?: string | null;
  metadata?: Record<string, unknown> | null;
}

export interface AuditQueryInput {
  resource_type?: string;
  action?: string;
  actor_id?: string;
  limit?: number;
}

export const AuditService = {
  async log(input: AuditLogInput): Promise<void> {
    const { data: auth } = await supabase.auth.getUser();
    const actor_id = auth.user?.id ?? null;
    const { error } = await supabase.from("audit_events").insert({
      actor_id,
      action: input.action,
      resource_type: input.resource_type,
      resource_id: input.resource_id ?? null,
      decision: input.decision ?? "allowed",
      reason: input.reason ?? null,
      scope_type: input.scope_type ?? null,
      scope_id: input.scope_id ?? null,
      metadata: (input.metadata ?? null) as never,
    });
    if (error) {
      // لا نريد إسقاط العملية الأصلية بسبب فشل audit. نسجّل فقط.
      console.warn("[audit] failed to log event", error.message, input);
    }
  },

  async query(q: AuditQueryInput = {}) {
    let query = supabase
      .from("audit_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(q.limit ?? 100);
    if (q.resource_type) query = query.eq("resource_type", q.resource_type);
    if (q.action) query = query.eq("action", q.action);
    if (q.actor_id) query = query.eq("actor_id", q.actor_id);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },
};
