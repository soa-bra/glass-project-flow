// Outbox Relay — يستهلك event_outbox، يحدّث dispatched_at، ويحوّل الفاشل لـ event_dlq.
// مُجدوَل عبر pg_cron كل دقيقة. لا يتطلّب JWT (verify_jwt=false في config.toml).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_ATTEMPTS = 3;
const BATCH_SIZE = 50;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const { data: events, error } = await supabase
      .from("event_outbox")
      .select("*")
      .is("dispatched_at", null)
      .lt("attempts", MAX_ATTEMPTS)
      .order("created_at", { ascending: true })
      .limit(BATCH_SIZE);

    if (error) throw error;

    let dispatched = 0;
    let failed = 0;
    const dlqEvents: Array<Record<string, unknown>> = [];

    for (const ev of events ?? []) {
      try {
        // Dispatch = mark as dispatched. Side-effects (webhooks, AI gateway) attach here later.
        const { error: updateErr } = await supabase
          .from("event_outbox")
          .update({ dispatched_at: new Date().toISOString() })
          .eq("id", ev.id);
        if (updateErr) throw updateErr;
        dispatched++;
      } catch (err) {
        failed++;
        const newAttempts = (ev.attempts ?? 0) + 1;
        const errMsg = err instanceof Error ? err.message : String(err);
        await supabase
          .from("event_outbox")
          .update({ attempts: newAttempts, last_error: errMsg })
          .eq("id", ev.id);

        if (newAttempts >= MAX_ATTEMPTS) {
          dlqEvents.push({
            original_event_id: ev.id,
            aggregate_type: ev.aggregate_type,
            aggregate_id: ev.aggregate_id,
            event_type: ev.event_type,
            payload: ev.payload,
            error: errMsg,
          });
        }
      }
    }

    if (dlqEvents.length > 0) {
      await supabase.from("event_dlq").insert(dlqEvents);
      // Remove from outbox after DLQ insert
      await supabase
        .from("event_outbox")
        .delete()
        .in("id", dlqEvents.map((d) => d.original_event_id));
    }

    return new Response(
      JSON.stringify({ scanned: events?.length ?? 0, dispatched, failed, dlq: dlqEvents.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[outbox-relay]", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
