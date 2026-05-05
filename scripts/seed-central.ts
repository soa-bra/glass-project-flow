/**
 * Seed سكربت لـ Central Data Model — يُملأ DB بأمثلة قابلة للاستخدام أثناء التطوير.
 *
 * الاستخدام:
 *   bunx tsx scripts/seed-central.ts
 *
 * متطلبات: VITE_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY في environment.
 * يستخدم service-role لتجاوز RLS أثناء seeding، وعلى ذلك لا يجب تشغيله في الإنتاج.
 */
/* eslint-disable no-console */
import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("✗ ينقص متغيرات البيئة: VITE_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const ownerEmail = process.env.SEED_OWNER_EMAIL ?? "owner@local.dev";

const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

async function main() {
  // 1) جلب أو إنشاء owner user
  const { data: list } = await admin.auth.admin.listUsers();
  let owner = list?.users.find((u) => u.email === ownerEmail);
  if (!owner) {
    const { data, error } = await admin.auth.admin.createUser({
      email: ownerEmail,
      password: "Seed-1234!",
      email_confirm: true,
    });
    if (error) throw error;
    owner = data.user!;
    console.log(`✓ أُنشئ owner: ${ownerEmail}`);
  } else {
    console.log(`✓ owner موجود: ${ownerEmail}`);
  }
  const ownerId = owner!.id;

  // 2) Department
  const { data: dept } = await admin
    .from("departments")
    .upsert(
      { code: "ENG", name: "الهندسة", state: "active", owner_id: ownerId },
      { onConflict: "code" },
    )
    .select()
    .single();
  console.log(`✓ department: ${dept?.code}`);

  // 3) Central Board
  const { data: board } = await admin
    .from("central_boards")
    .upsert(
      { code: "MAIN-2026", name: "اللوحة الرئيسية 2026", state: "active", owner_id: ownerId },
      { onConflict: "code" },
    )
    .select()
    .single();
  console.log(`✓ central_board: ${board?.code}`);

  // 4) Project
  const { data: project } = await admin
    .from("projects")
    .insert({
      name: "مشروع تجريبي A",
      description: "Seed project لاختبار workspace",
      state: "active",
      priority: "high",
      owner_id: ownerId,
      budget: 50000,
    })
    .select()
    .single();
  console.log(`✓ project: ${project?.id}`);

  // 5) ربط القسم بالمشروع
  if (dept && project) {
    await admin.from("department_projects").insert({
      department_id: dept.id,
      project_id: project.id,
      role: "owner",
    });
  }

  // 6) Tasks
  if (project) {
    const tasks = [
      { name: "تخطيط الـ MVP", state: "active" as const, priority: "high" as const },
      { name: "تنفيذ الواجهة", state: "draft" as const, priority: "medium" as const },
      { name: "اختبار التكامل", state: "draft" as const, priority: "medium" as const },
    ];
    for (const t of tasks) {
      await admin.from("tasks").insert({
        ...t,
        owner_id: ownerId,
        linked_project_id: project.id,
        estimated_cost: 1000,
        estimated_duration: 8,
      });
    }
    console.log(`✓ ${tasks.length} tasks`);
  }

  // 7) Tool + Engine Job
  if (board) {
    const { data: tool } = await admin
      .from("tools")
      .insert({
        name: "أداة تحليلات",
        kind: "automation",
        state: "active",
        owner_id: ownerId,
        central_board_id: board.id,
      })
      .select()
      .single();
    console.log(`✓ tool: ${tool?.id}`);

    await admin.from("engine_jobs").insert({
      name: "مهمة Seed",
      kind: "scheduled",
      state: "planned",
      owner_id: ownerId,
      triggered_by_tool_id: tool?.id ?? null,
    });
    console.log(`✓ engine_job (planned)`);
  }

  console.log("\n✓ Seed مكتمل.");
}

main().catch((e) => {
  console.error("✗ Seed فشل:", e);
  process.exit(1);
});
