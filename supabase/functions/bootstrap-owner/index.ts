// Bootstrap a single owner user. One-shot admin operation.
// SECURITY:
//   - Protected by BOOTSTRAP_WORKER_SECRET (must match `x-worker-secret` header).
//   - Credentials are read from env (BOOTSTRAP_OWNER_EMAIL / BOOTSTRAP_OWNER_PASSWORD).
//   - The password is NEVER returned in the response body.
//   - Intended to be invoked from a trusted operator pipeline only — not from browsers.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-worker-secret",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const workerSecret = Deno.env.get("BOOTSTRAP_WORKER_SECRET");
    const ownerEmail = Deno.env.get("BOOTSTRAP_OWNER_EMAIL");
    const ownerPassword = Deno.env.get("BOOTSTRAP_OWNER_PASSWORD");

    if (!workerSecret || !ownerEmail || !ownerPassword) {
      return new Response(
        JSON.stringify({ ok: false, error: "bootstrap is not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const providedSecret = req.headers.get("x-worker-secret");
    if (!providedSecret || providedSecret !== workerSecret) {
      return new Response(
        JSON.stringify({ ok: false, error: "unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const { data: list, error: listErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
    if (listErr) throw listErr;

    let deletedCount = 0;
    for (const u of list.users) {
      const { error } = await admin.auth.admin.deleteUser(u.id);
      if (!error) deletedCount++;
    }

    await admin.from("user_roles").delete().neq("user_id", "00000000-0000-0000-0000-000000000000");
    await admin.from("profiles").delete().neq("user_id", "00000000-0000-0000-0000-000000000000");

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: ownerEmail,
      password: ownerPassword,
      email_confirm: true,
      user_metadata: { display_name: "Owner" },
    });
    if (createErr) throw createErr;
    const ownerId = created.user!.id;

    await admin.from("user_roles").upsert(
      { user_id: ownerId, role: "owner", scope_type: "global" },
      { onConflict: "user_id,role,scope_type" },
    );

    return new Response(
      JSON.stringify({
        ok: true,
        deleted_count: deletedCount,
        owner: { id: ownerId, email: ownerEmail },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
