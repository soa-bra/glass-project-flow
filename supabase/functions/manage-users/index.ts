// Admin user management — create / update / delete users + assign role.
// Caller must be an authenticated owner. Uses SERVICE_ROLE internally.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Action = "list" | "create" | "update" | "delete";
type AppRole =
  | "owner" | "ciso" | "dpo" | "infra_admin" | "finance_admin"
  | "department_manager" | "project_manager" | "team_member" | "guest";

interface Payload {
  action: Action;
  user_id?: string;
  email?: string;
  password?: string;
  display_name?: string;
  role?: AppRole;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authHeader = req.headers.get("Authorization") ?? "";

    // Verify caller is an owner.
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });
    const { data: authData, error: authErr } = await userClient.auth.getUser();
    if (authErr || !authData.user) return json({ ok: false, error: "unauthenticated" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
    const { data: isOwner, error: roleErr } = await admin.rpc("has_role", {
      _user_id: authData.user.id,
      _role: "owner",
    });
    if (roleErr) return json({ ok: false, error: roleErr.message }, 500);
    if (!isOwner) return json({ ok: false, error: "forbidden_owner_only" }, 403);

    const body = (await req.json()) as Payload;

    if (body.action === "list") {
      const { data: list, error } = await admin.auth.admin.listUsers({ perPage: 1000 });
      if (error) return json({ ok: false, error: error.message }, 500);
      const ids = list.users.map((u) => u.id);
      const { data: profiles } = await admin.from("profiles").select("user_id, display_name").in("user_id", ids);
      const { data: roles } = await admin.from("user_roles").select("user_id, role").in("user_id", ids);
      const pMap = new Map((profiles ?? []).map((p) => [p.user_id, p.display_name]));
      const rMap = new Map<string, string[]>();
      (roles ?? []).forEach((r) => {
        const arr = rMap.get(r.user_id) ?? [];
        arr.push(r.role as string);
        rMap.set(r.user_id, arr);
      });
      const users = list.users.map((u) => ({
        user_id: u.id,
        email: u.email ?? "",
        display_name: pMap.get(u.id) ?? null,
        last_sign_in_at: u.last_sign_in_at ?? null,
        roles: rMap.get(u.id) ?? [],
      }));
      return json({ ok: true, users });
    }

    if (body.action === "create") {
      if (!body.email || !body.password) return json({ ok: false, error: "email_and_password_required" }, 400);
      const { data: created, error } = await admin.auth.admin.createUser({
        email: body.email,
        password: body.password,
        email_confirm: true,
        user_metadata: { display_name: body.display_name ?? body.email },
      });
      if (error) return json({ ok: false, error: error.message }, 400);
      const newUserId = created.user!.id;

      if (body.role) {
        await admin.from("user_roles").upsert(
          { user_id: newUserId, role: body.role, scope_type: "global" },
          { onConflict: "user_id,role,scope_type" },
        );
      }
      return json({ ok: true, user_id: newUserId });
    }

    if (body.action === "update") {
      if (!body.user_id) return json({ ok: false, error: "user_id_required" }, 400);
      const attrs: Record<string, unknown> = {};
      if (body.email) attrs.email = body.email;
      if (body.password) attrs.password = body.password;
      if (body.display_name) attrs.user_metadata = { display_name: body.display_name };
      if (Object.keys(attrs).length > 0) {
        const { error } = await admin.auth.admin.updateUserById(body.user_id, attrs);
        if (error) return json({ ok: false, error: error.message }, 400);
      }
      if (body.display_name) {
        await admin.from("profiles").update({ display_name: body.display_name }).eq("user_id", body.user_id);
      }
      if (body.role) {
        // Replace global role with the new one.
        await admin.from("user_roles").delete().eq("user_id", body.user_id).eq("scope_type", "global");
        await admin.from("user_roles").insert({
          user_id: body.user_id, role: body.role, scope_type: "global",
        });
      }
      return json({ ok: true });
    }

    if (body.action === "delete") {
      if (!body.user_id) return json({ ok: false, error: "user_id_required" }, 400);
      if (body.user_id === authData.user.id) return json({ ok: false, error: "cannot_delete_self" }, 400);
      const { error } = await admin.auth.admin.deleteUser(body.user_id);
      if (error) return json({ ok: false, error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ ok: false, error: "invalid_action" }, 400);
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500);
  }
});

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
