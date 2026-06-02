// Bootstrap a single owner user (1@1.co) and wipe all other auth users.
// One-shot admin operation. Uses SERVICE_ROLE — do NOT expose to clients in production.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OWNER_EMAIL = "1@1.co";
const OWNER_PASSWORD = "111111";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    // 1) List & delete all existing auth users
    const { data: list, error: listErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
    if (listErr) throw listErr;

    const deleted: string[] = [];
    for (const u of list.users) {
      const { error } = await admin.auth.admin.deleteUser(u.id);
      if (!error) deleted.push(u.email ?? u.id);
    }

    // 2) Clear role/profile rows defensively (cascade should handle it, but be explicit)
    await admin.from("user_roles").delete().neq("user_id", "00000000-0000-0000-0000-000000000000");
    await admin.from("profiles").delete().neq("user_id", "00000000-0000-0000-0000-000000000000");

    // 3) Create the owner user
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: OWNER_EMAIL,
      password: OWNER_PASSWORD,
      email_confirm: true,
      user_metadata: { display_name: "Owner" },
    });
    if (createErr) throw createErr;
    const ownerId = created.user!.id;

    // 4) Ensure owner role @ global (handle_new_user trigger should also do this for the first user)
    await admin.from("user_roles").upsert(
      { user_id: ownerId, role: "owner", scope_type: "global" },
      { onConflict: "user_id,role,scope_type" },
    );

    return new Response(
      JSON.stringify({
        ok: true,
        deleted_count: deleted.length,
        deleted_emails: deleted,
        owner: { id: ownerId, email: OWNER_EMAIL, password: OWNER_PASSWORD },
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
