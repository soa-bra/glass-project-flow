# Step 10 Artifact — Baseline Schema

- التاريخ: 2026-05-02
- الحالة: In Progress
- المالك: DB Owner + Backend Lead
- المرجع الحاكم: `docs/recovery_execution_package.md` (الخطوة 10)

## Baseline Source Snapshot (Repository)
1. الملف المرجعي البنيوي الأساسي:
   - `supabase/migrations/20260430160310_91fd3b59-915f-463d-8e01-63b1c31b6330.sql`
2. تحديثات لاحقة مؤثرة:
   - `supabase/migrations/20260430220416_782696df-3eed-4fbe-b20c-dd0131c92d8f.sql`
   - `supabase/migrations/20260428120000_add_ai_command_traces.sql`
   - `supabase/migrations/20260501054326_b1ba49b7-0941-49f3-b5f6-cd00b47117e2.sql`

## Active Tables (Operational Scope)
1. `central_boards`
2. `departments`
3. `projects`
4. `tasks`
5. `department_projects`
6. `tools`
7. `engine_jobs`
8. `dependencies`
9. `project_cards`
10. `task_cards`
11. `profiles`
12. `user_roles`
13. `permissions`
14. `role_permissions`
15. `audit_events`
16. `event_outbox`
17. `event_dlq`
18. `invoices` (+ `metadata` column in latest migration)
19. `ai_command_traces`

## Key Relationships (Baseline)
1. `projects.department_id -> departments.id`
2. `tasks.project_id -> projects.id`
3. `department_projects.department_id -> departments.id`
4. `department_projects.project_id -> projects.id`
5. `dependencies.source_entity_id/target_entity_id` (علاقات كيان-إلى-كيان)
6. `user_roles.user_id -> auth.users.id`
7. `role_permissions.role -> app_role`
8. `audit_events.owner_id -> auth.users.id`

## RLS Baseline Status
1. جداول central الرئيسية مفعّل عليها RLS حسب migrations.
2. جداول event/audit مفعّل عليها RLS.
3. تتبّع أوامر AI (`ai_command_traces`) مفعّل عليه RLS.

## Schema Freeze Rule (Recovery)
1. لا migration جديدة ضمن برنامج الاستعادة إلا مع:
   1. سبب موثق في backlog الإصلاحي.
   2. موافقة قيادة تقنية.
   3. تحديث فوري لهذا baseline.

## Remaining to Close Step 10
1. استخراج snapshot DDL موحد من بيئة DB الفعلية (وليس migrations فقط).
2. مطابقة snapshot الفعلي مع baseline أعلاه وتوثيق أي انحراف.
3. إعلان نسخة baseline نهائية (v1-recovery).


## Generated Inventory Artifact
1. `docs/recovery/step-10-schema-inventory.tsv` (استخراج CREATE TABLE/TYPE من migration baseline).


## Live DB Validation Checklist
1. `docs/recovery/step-10-db-snapshot-checklist.md`
