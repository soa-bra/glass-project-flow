// Engine Jobs Worker — يلتقط engine_jobs بحالة planned، ينقلها إلى active ثم completed.
// مُجدوَل عبر pg_cron كل دقيقة.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BATCH_SIZE = 10;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const { data: jobs, error } = await supabase
      .from("engine_jobs")
      .select("*")
      .eq("state", "planned")
      .order("created_at", { ascending: true })
      .limit(BATCH_SIZE);

    if (error) throw error;

    let processed = 0;
    for (const job of jobs ?? []) {
      // Transition planned -> active
      await supabase
        .from("engine_jobs")
        .update({ state: "active", updated_at: new Date().toISOString() })
        .eq("id", job.id);

      // Simulated work — replace with real kind-specific logic later.
      // Each kind would be a strategy: data sync, AI call, export, etc.
      const meta = (job.metadata ?? {}) as Record<string, unknown>;
      const updatedMeta = {
        ...meta,
        executed_at: new Date().toISOString(),
        worker: "engine-jobs-worker",
      };

      // Transition active -> completed
      await supabase
        .from("engine_jobs")
        .update({
          state: "completed",
          metadata: updatedMeta,
          updated_at: new Date().toISOString(),
        })
        .eq("id", job.id);

      processed++;
    }

    return new Response(
      JSON.stringify({ scanned: jobs?.length ?? 0, processed }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[engine-jobs-worker]", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
