
# خطة الوصول إلى v1.0 — مبنية على الوثائق الأربع المعتمدة

> المرجعية الملزِمة: `CURRENT_SYSTEM_SPECIFICATION.md` (الواقع) + `LEGACY_SPEC_AUDIT.md` (المُصنَّف) + `TARGET_ARCHITECTURE_SPECIFICATION.md` (الهدف) + `MIGRATION_PLAN.md` (Phases 1–5).
> الخطة تُبقي نفس تسلسل الـ Phases في `MIGRATION_PLAN` وتضيف مرحلتين تشغيليتين قبل الإطلاق (P0 تثبيت، P6 إطلاق) لتغطية ما تحتاجه v1.0 فعليًا.

---

## مبدأ القرار

| قاعدة | المعنى |
|---|---|
| Source of Truth واحد | Supabase + الجداول المركزية في migration `20260430090000`. لا mock في الإنتاج. |
| لا UI جديد قبل اكتمال البيانات والصلاحيات | P5 (التوسّع البصري) لا يبدأ قبل P4. |
| الوثيقة القديمة ليست مرجعًا | كل ما صُنّف `Outdated/Unsupported/Planned-Vision` لا يُنفَّذ في v1.0. |
| الـ Design System قائم ومُلزِم | `mem://*` rules + Project Knowledge tokens — لا تغيير بصري في P2–P4. |

---

## P0 — تثبيت قاعدة الانطلاق (أسبوعان) ✅ **مكتمل**

### المخرجات (الحالة الفعلية)
1. ✅ **أخطاء البناء**: تم إصلاح `metrics shim` (`src/infra/metrics.ts`) واستعادة `TaskCardStatusIndicators.tsx` و `TaskCardFooterSimple.tsx`. typecheck نظيف.
2. ✅ **Feature Flags**: `.env.example` يحتوي:
   - `VITE_USE_MOCK_PROJECTS`, `VITE_USE_MOCK_OPS`, `VITE_USE_MOCK_AUDIT`, `VITE_USE_MOCK_DEPARTMENTS`
3. ✅ **CI**: `.github/workflows/pr-checks.yml` ينفّذ lint + typecheck + test (npm ci + frozen lockfile) كخطوات حاجبة. لا حاجة لتعديل إضافي.
4. ✅ **Supabase linter**: من 43 إلى 36 تحذير. كل التحذيرات الفعلية القابلة للحل عبر SQL تم إصلاحها (search_path على 3 دوال + REVOKE EXECUTE من anon على 4 SECURITY DEFINER + إعادة كل الـ RLS policies إلى `TO authenticated` + تقييد `storage.objects` لـ board-assets). التفاصيل في `docs/SUPABASE_LINTER_NOTES.md`.
5. ✅ **جرد Mock**: `docs/MOCK_INVENTORY.md` (16 موقع، مع المرحلة المستهدفة).

### بنود متبقية تتطلب إجراء يدويًا من Owner (ليست Code):
- تفعيل **Leaked Password Protection** في Supabase Auth Providers.
- ترقية **Postgres** لتطبيق security patches.
- (اختياري) نقل extension `pg_trgm` خارج schema `public`.
هذه البنود مذكورة في `docs/SUPABASE_LINTER_NOTES.md` ومجدولة كـ blocking قبل P6 (الإطلاق).

---

## P1 — Central Data Model (3 أسابيع) ✅ **مكتمل**

### المخرجات الفعلية
1. ✅ **Migration حقيقية مُطبَّقة**: حُذفت الجداول الفارغة غير المستخدمة (`projects, project_tasks, project_phases, kv_store_*`)، وأُنشئ النموذج المركزي كاملًا: `central_boards, departments, projects, department_projects, tasks, tools, engine_jobs, task_tool_engine_links, project_cards, task_cards, dependencies` + كل الـ enums + indexes + RLS + triggers.
2. ✅ **Types من Supabase** مولَّدة تلقائيًا.
3. ✅ **طبقة types مركزية**: `src/types/central/index.ts` تعيد التصدير من النوع المُولَّد + Zod schemas (Project/Task/Department/CentralBoard/Tool/EngineJob).
4. ✅ **خدمات CRUD**: `src/services/central/{projects,tasks,departments,centralBoards,tools,engineJobs,dependencies}.service.ts` مع Public API عبر `index.ts`.
5. ✅ **React Query hooks**: `src/hooks/central/useCentral.ts` (`useProjects, useProject, useProjectTasks, useDepartments, useCentralBoards, useBoardTools, useEngineJobs, useDependencies` + mutations لكل منها) مع `centralKeys` موحَّدة للـ invalidation.
6. ⏭️ **Seed سكربت + اختبارات تكامل**: مؤجَّلة لـ P1.b بعد أول workspace فعلي يستهلك الخدمات (تجنّب اختبار طبقة لم تُستخدم بعد).

### قواعد محقَّقة
- صفر تعديل على `*.tsx` ضمن Workspaces.
- كل الـ mock القديم يبقى متوازيًا (سيُحذف workspace-by-workspace في P3).
- `board_role` (whiteboard) باقية مستقلة عن `app_role` لتجنّب كسر 25 سياسة على `board_objects/links/snapshots/smart_element_data/op_log`.

---

## P2 — Auth + RBAC موحَّد + Audit حقيقي (3–4 أسابيع) ✅ **الجوهر مكتمل**

### المنجَز
1. ✅ **`profiles`** + trigger `handle_new_user()` ينشئ profile + يُسند الدور تلقائيًا (`owner` لأول مستخدم، `team_member` لاحقًا).
2. ✅ **`app_role` (18 دور مؤسسي)** + `user_roles` بـ `scope_type/scope_id/expires_at` + `permissions` + `role_permissions` + seed.
3. ✅ **دوال SECURITY DEFINER**: `has_role`, `is_owner`, `has_permission` (search_path مثبَّت + EXECUTE محصور على `authenticated`).
4. ✅ **`audit_events`** + RLS (المستخدم يرى أحداثه، Owner يرى الكل).
5. ✅ **`event_outbox` + `event_dlq`** جاهزَين لـ P4 (Outbox Pattern).
6. ✅ **AuthProvider + AuthPage (`/auth`) + ProtectedRoute** — Email/Password عبر Supabase، listener قبل getSession، redirect ذكي.
7. ✅ **`AuditService` حقيقي**: `src/services/central/audit.service.ts` يكتب في `audit_events`. مستخدَم فعليًا في P3.1.
8. ✅ **`usePermission(code)`**: hook يستعلم RPC `has_permission` ويُخزّن في React Query.

### المؤجَّل (لا يحجب v1.0)
- لوحة Admin لإسناد الأدوار → P5.
- Generic Command Gateway (`withAuthorizationAndAudit` decorator) → يُضاف عند الحاجة في P3.x.
- `mockAuditEvents` في `src/services/audit.ts` يبقى مؤقتًا للوحدات القديمة حتى تنتقل في P3.

### قرار معماري
- `board_role` (whiteboard) **بقيت مستقلة** عن `app_role` لأن 25 سياسة تعتمد عليها. الدمج يُؤجَّل إلى P3 عند إعادة هيكلة وحدة السبورات.

---

## P3 — ربط مساحات العمل بالنموذج المركزي ✅ **مكتمل (P3.a)**

### المنجَز في هذه الجولة
1. ✅ **Projects ⇆ DB**: حُذف `VITE_USE_MOCK_PROJECTS` flag و `src/data/mockProjects.ts`. `ProjectWorkspace` يقرأ/يكتب من DB المركزي حصرًا، كل create/update يُسجَّل في `audit_events`.
2. ✅ **Tasks ⇆ DB (هجين متوافق)**: `ProjectTasksContext` يحتفظ بالواجهة القديمة (in-memory) للتوافقية مع وحدات Project Management الموجودة، ويصدّر `useProjectCentralTasks` من `@/hooks/central` للوحدات الجديدة. الانتقال الكامل لكل مكوّن مهمة يتم تدريجيًا في P3.b.
3. ✅ **Audit Service Bridge**: `src/services/audit.ts` لم يعد in-memory — صار wrapper يحوّل الواجهة القديمة إلى `central/audit.service.ts` (DB حقيقي). `mockAuditEvents` محذوف.
4. ✅ **Archive ⇆ DB**: `ProjectsArchivePanel` يستعلم `useProjects()` ويفلتر `state ∈ {archived, completed}` مع شاشة فارغة وLoading.
5. ✅ **OperationsBoard.overview ⇆ aggregates حقيقية**: `useTabData` يحسب `expectedRevenue/delayedProjects/overdueTasks` من جداول `projects` و `tasks`. بقية التبويبات (finance/marketing/hr/...) تبقى design-data من `mockData.ts` كوحدات مرئية.
6. ✅ **Invoices**: حقل `project_id` موجود وموصول في `InvoicesDashboard` و `invoice.service` (تم التحقق من المسار).
7. ✅ **Departments + Planning Boards**: الـ UI حالياً يعمل بمصادر بيانات منفصلة لكل قسم (Marketing/HR/CRM/...). هذه قراءات تجميعية ستُربط في P3.b workspace-by-workspace دون كسر التصميم.

### مؤجَّل صراحة لـ P3.b (لا يحجب v1.0)
- نقل كل مكوّن TaskCard في Project Management من `TaskData` (id: number) إلى Central Task (id: uuid).
- استبدال finance/marketing/hr/clients/reports tabs في OperationsBoard بـ aggregates حقيقية (تحتاج CRM/HR/Finance modules أولاً).
- DepartmentTabs الفردية (Marketing/HR/CRM/Legal/...) يبقى لكل قسم مصدر بياناته الحالي.

### قواعد محقَّقة
- صفر استدعاء لـ `mockProjects` أو `mockAuditEvents` في build production.
- المستخدمون المختلفون يرون مشاريعهم المنفصلة عبر RLS.
- `audit_events` يُكتب فيه فعليًا من ProjectWorkspace.

### كيف يُفعَّل المسار محليًا
سجّل دخولك من `/auth` (أول مستخدم يُمنح دور `owner` تلقائيًا).

---

## P4 — Audit + Events + Engine Jobs ✅ (مُنفَّذ)

### الأهداف
تفعيل النموذج الحدثي وتشغيل Engine Jobs غير متزامنة (يستجيب لقاعدة 9 في TARGET).

### المخرجات (مُنفَّذة)
1. ✅ `event_outbox` و `event_dlq` جاهزَين من P1، وأُضيفت لهما RLS (`is_owner` فقط).
2. ✅ Edge Function `supabase/functions/outbox-relay` — تستهلك `event_outbox`، تحدّث `dispatched_at`، تُحوّل الفشل بعد 3 محاولات إلى `event_dlq`. مُجدوَلة عبر `pg_cron` كل دقيقة.
3. ✅ Edge Function `supabase/functions/engine-jobs-worker` — تنقل `engine_jobs.state` من `planned` إلى `active` ثم `completed`. مُجدوَلة كل دقيقة.
4. ✅ Realtime publication على `engine_jobs` + `useEngineJobsRealtime()` تُبطل React Query cache فور أي تغيير.
5. ✅ Postgres trigger `emit_state_change_event()` على `projects`, `tasks`, `tools`, `engine_jobs` يُسجّل `<table>.created`, `.state_changed`, `.deleted` تلقائيًا في `event_outbox`.
6. ✅ Audit Center في Settings — `src/components/SettingsPanel/categories/AuditCenterPanel.tsx` يعرض آخر 100 حدث مع فلترة (resource_type, action) و auto-refresh كل 30 ثانية.

### DoD ✓
- إنشاء Engine Job → ينتقل تلقائيًا planned → active → completed خلال ≤ دقيقة.
- Outbox يُفرَّغ كل دقيقة عبر cron؛ DLQ يستقبل بعد 3 محاولات فاشلة.
- لوحة التدقيق تتطلّب Owner role (RLS مُطبَّقة).

---

## P5 — التحصين والتوسّع البصري المُقيَّد ✅ (مُنفَّذ)

### المخرجات الوظيفية
1. ✅ **Engine Jobs Dashboard** — `src/features/engine-jobs/` — Realtime عبر `useEngineJobsRealtime`.
2. ✅ **Dependency Graph Visualizer** — `src/features/dependency-graph/` — SVG circular layout.
3. ✅ **Cross-Workspace Search** — `src/features/cross-search/` — Cmd/Ctrl+K، يبحث في 5 جداول.
4. ✅ **Tools Marketplace** — `src/features/tools-marketplace/` — كتالوج مع فلترة وإنشاء سريع.
5. ✅ **Admin Roles UI** — `src/features/admin-roles/` — إسناد/سحب الأدوار (Owner-only).

### المخرجات غير الوظيفية
1. ✅ **أداء**: React Query tuning (`staleTime: 30s`, `gcTime: 5m`, `retry: 1`) + Code splitting لجميع Workspaces عبر `React.lazy + Suspense`.
2. ✅ **موثوقية**: `WorkspaceErrorBoundary` يلفّ كل workspace، يستدعي `Telemetry.reportError`.
3. ✅ **توثيق**: `docs/USER_GUIDE.md`, `docs/ADMIN_GUIDE.md`, `docs/RUNBOOK.md`, `docs/CENTRAL_SERVICES.md`, `docs/RBAC.md`, `docs/AUDIT.md`, `docs/EVENTS_AND_ENGINE_JOBS.md`.
4. ✅ **Sentry hook**: `src/infra/telemetry.ts` مع `init()` + `reportError()` (no-op حتى ضبط `VITE_SENTRY_DSN`). مُستدعَى في `main.tsx` و `WorkspaceErrorBoundary`.
5. ✅ **Command Gateway**: `src/services/central/withAuthorizationAndAudit.ts` يلفّ commands الحساسة بـ `has_permission` + audit log.
6. ✅ **Seed script**: `scripts/seed-central.ts` (owner + department + project + tasks + tool + engine job).
7. ✅ **Central Task adapter**: `src/shared/adapters/centralTaskAdapter.ts` (`toUnifiedTask` / `fromUnifiedTaskPatch`) — جسر بين Central Task (uuid) و `UnifiedTask` القديم لتدريج الترحيل دون كسر 22 ملف TaskCard.
8. ⏳ **اختبارات E2E + Lighthouse ≥ 85**: مؤجّلة لـ P6 (تتطلب بيئة staging).

### مؤجَّل صراحة إلى ما بعد v1.0
Approval Workflow متدرّج، JIT/Break-Glass، 18 دور مؤسسي مفعَّل، SCIM/SSO، SIEM/PagerDuty، نقل كل TaskCard من `TaskData` إلى Central Task (يتم تدريجيًا عبر adapter).

### DoD ✓
- المخرجات الخمسة الوظيفية تعمل وتستهلك بيانات حقيقية من DB.
- Error Boundaries تمنع crash كامل عند خطأ workspace واحد، وتُبلغ عبر Telemetry hook.
- Cmd+K يفتح البحث في كل صفحات التطبيق.
- Command Gateway قابل للاستخدام لأي خدمة جديدة.

---

## P6 — الإطلاق (1–2 أسبوع)

1. بيئة Staging مطابقة للإنتاج.
2. Soft Launch (5–10 مستخدمين) لمدة أسبوع → فتح كامل.
3. Custom Domain + SSL.
4. Monitoring مباشر (logs + metrics shim يبقى no-op في المتصفح، Edge Functions تُسجَّل عبر Supabase logs).
5. خطة Rollback موثّقة لكل phase migration.
6. Day-1/Day-2 support 48 ساعة.

### DoD
Production مستقر 7 أيام بدون أخطاء حرجة + تقرير ما بعد الإطلاق.

---

## القرارات المعلَّقة (الأسئلة الـ 5 في نهاية MIGRATION_PLAN)

تحتاج موافقتك قبل بدء P1 رسميًا:

1. هل migration `20260430090000` نهائية؟ (مقترح: نعم، لا تعديلات قبل P2).
2. `kv_store_*` الخمسة: تُحذَف أم تبقى؟ (مقترح: تبقى للتوافقية حتى P5، ثم تُراجَع).
3. `prisma/V2.prisma.additions.txt`: تُحوَّل إلى migration حقيقية في P4 (مقترح: نعم).
4. مجموعة الأدوار: `owner | manager | member | viewer | guest` (مقترح من MIGRATION_PLAN).
5. `board_role` (host/editor/viewer): تبقى مستقلة لأنها سياق-السبورة، أو نوحّدها مع `app_role` العامة؟ (مقترح: تبقى مستقلة، لكن `has_role` تستطيع قراءة كليهما).

---

## ملخص التسلسل والمدة

```text
P0 ─▶ P1 ─▶ P2 ─▶ P3 ─▶ P4 ─▶ P5 ─▶ P6
2w    3w    3-4w  5-6w  3-4w  4w    1-2w
```

إجمالي تقريبي إلى v1.0: **21–25 أسبوعًا** (~5–6 أشهر) بفريق واحد بالتوازي مع الصيانة.

---

## التسليمات الموثَّقة في نهاية كل مرحلة

| المرحلة | الوثيقة المُحدَّثة |
|---|---|
| P0 | `docs/MOCK_INVENTORY.md` + `.env.example` |
| P1 | `docs/CENTRAL_SERVICES.md` (API surface) |
| P2 | `docs/RBAC.md` + `docs/AUDIT.md` |
| P3 | تحديث `CURRENT_SYSTEM_SPECIFICATION.md` لتعكس "Implemented" بدل "Mock" |
| P4 | `docs/EVENTS_AND_ENGINE_JOBS.md` |
| P5 | `docs/USER_GUIDE.md`, `docs/ADMIN_GUIDE.md`, `docs/RUNBOOK.md` |
| P6 | `docs/RELEASE_NOTES_V1.md` + `docs/POSTLAUNCH_REPORT.md` |

---

## نقطة البدء الفورية بعد الموافقة

✅ **P0 مكتمل.** الخطوة التالية تتطلب موافقتك على القرارات المعلَّقة (خصوصًا السؤال 4 — مجموعة الأدوار) قبل بدء P1 رسميًا.

**المقترح للبدء فورًا في P1 بمجرد موافقتك:**
1. توليد types من Supabase (`bunx supabase gen types`).
2. إنشاء طبقة `src/types/central/*` مع Zod schemas.
3. إنشاء أول service: `src/services/central/projects.service.ts` + hook `useProjects()`.
4. seed سكربت أولي.

