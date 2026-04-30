
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

## P2 — Auth + RBAC موحَّد + Audit حقيقي (3–4 أسابيع) 🟡 **الأساس DB مكتمل، Auth UI متبقّي**

### المنجَز في هذه الجولة
1. ✅ **`profiles`** + trigger `handle_new_user()` ينشئ profile + يُسند الدور تلقائيًا (`owner` لأول مستخدم، `team_member` لاحقًا).
2. ✅ **`app_role` (18 دور مؤسسي)** كاملًا حسب project knowledge: owner, ciso, dpo, infra_admin, finance_admin, department_manager, project_manager, release_manager, qa_lead, sre, brand_manager, dam_curator, hr_analyst, finance_auditor, ai_analyst, content_reviewer, legal_archivist, help_desk_agent, team_member, guest, service_account.
3. ✅ **`user_roles`** مع `scope_type` (global/department/project/board) + `scope_id` + `expires_at` (لدعم JIT لاحقًا).
4. ✅ **`permissions` + `role_permissions`** + seed لأهم الصلاحيات (central.project.*, central.task.*, audit.read.all, rbac.manage).
5. ✅ **دوال SECURITY DEFINER** بـ `search_path` مُثبَّت: `has_role(uid, role, scope_type?, scope_id?)`, `is_owner(uid)`, `has_permission(uid, code)` — `EXECUTE` محصور على `authenticated`.
6. ✅ **`audit_events`** بجميع الحقول (actor, action, resource_type, resource_id, scope, decision, reason, metadata) + RLS (المستخدم يرى أحداثه، Owner يرى الكل).
7. ✅ **`event_outbox` + `event_dlq`** جاهزَين لمعالجة P4 (Outbox Pattern).

### المتبقّي في P2
1. ⏭️ صفحة `/auth` (Supabase Email + Password) + `ProtectedRoute`.
2. ⏭️ خدمة `auditService` حقيقية تكتب في `audit_events` (استبدال `mockAuditEvents` في `src/services/audit.ts` مع الحفاظ على signature).
3. ⏭️ Decorator `withAuthorizationAndAudit(action, scope)` يلفّ كل service call في P1.
4. ⏭️ Hook `usePermission(action, scope) → { allowed, reason }`.
5. ⏭️ لوحة Admin مبسّطة في Settings: قائمة المستخدمين + إسناد دور.
6. ⏭️ توسيع `evaluateCommandAuthorization` ليصبح Generic Command Gateway.

### قرار معماري مهم
- `board_role` الخاصة بالسبورات (whiteboard collaboration) **بقيت مستقلة** عن `app_role` لأن 25 سياسة وعملية تعتمد عليها مباشرة. الدمج يُؤجَّل إلى P3 عند إعادة هيكلة وحدة السبورات. `has_role()` قادرة على قراءة كليهما عند الحاجة.

### DoD المتبقّي
- محاولة أمر بدون صلاحية تُرفض وتظهر في `audit_events`.
- اختبار يثبت أن مستخدمَين منفصلَين لا يريان بيانات بعضهما.

---

## P3 — ربط مساحات العمل بالنموذج المركزي (5–6 أسابيع) — يطابق Phase 4

### الترتيب الإلزامي
1. **Projects** ⇆ `projects` (المركزي) — `ProjectWorkspace` يستخدم `useProjects()` بدل `useState(mockProjects)`. الإبقاء على نفس UI تمامًا.
2. **Tasks** ⇆ `tasks + task_tool_engine_links` — `ProjectTasksContext` يقرأ من DB.
3. **Departments** ⇆ `departments + department_projects` — `DepartmentsSidebar` و `DepartmentPanel` يقرآن حقيقة. يبقى UI لكل DepartmentTab كما هو، فقط مصدر البيانات يتبدّل.
4. **Planning Boards** ⇆ `boards + tools` — `PlanningEntryScreen` يعرض السبورات الحقيقية للمستخدم. كل Smart Element يُسجَّل كـ `tool` (kind=`board_widget`).
5. **OperationsBoard** ⇆ aggregations حقيقية — استبدال `mockData.ts` بقراءات تجميعية من الجداول المركزية. يبقى تصميم البطاقات والتبويبات السبعة كما هو.
6. **Invoices** ⇆ ربط `invoices.project_id` بالمشروع المركزي بدل المعرف الـ mock.
7. **Archive** ⇆ قراءة عناصر بحالة `archived` من جميع الكيانات (ليست جداول جديدة، فقط view + filter).

### قواعد صارمة
- نقل تدريجي: workspace واحدة في كل sprint خلف flag (`VITE_USE_MOCK_*`).
- بعد التحقق من workspace، يُحذف الـ mock الخاص بها فقط.
- صفر تغيير في `mem://*` rules: نفس Surface contract، نفس RTL governance، نفس Grid، نفس Glassmorphism boundary.

### DoD
- لا استدعاء واحد لـ `mockProjects` أو `OperationsBoard/mockData` في build production.
- مستخدمان منفصلان يريان مشاريعهم المنفصلة.
- جميع DepartmentTabs تعمل على بيانات حقيقية مستمرة (وليس in-memory).

---

## P4 — Audit + Events + Engine Jobs (3–4 أسابيع)

### الأهداف
تفعيل النموذج الحدثي وتشغيل Engine Jobs غير متزامنة (يستجيب لقاعدة 9 في TARGET).

### المخرجات
1. تحويل `prisma/V2.prisma.additions.txt` إلى migration حقيقية:
   - `event_outbox (id, aggregate_type, aggregate_id, event_type, payload, created_at, dispatched_at, attempts)`
   - `event_dlq (id, original_event_id, error, payload, failed_at)`
2. Edge Function `outbox-relay` تحلّ محل سكربت `scripts/outbox-relay.ts`، يُجدوَل كل دقيقة (Supabase cron).
3. Edge Function `engine-jobs-worker` تستهلك `engine_jobs.state = 'planned'` وتنفّذها وتحدّث `state` و `actual_*`.
4. Realtime subscription على `engine_jobs.state` لتحديث Dashboard دون إعادة تحميل.
5. كل تغيير State (Project/Task/Tool/Engine Job) يُنشر كحدث في `event_outbox` تلقائيًا عبر Postgres trigger.
6. **Audit Center في Settings:** عرض آخر 100 حدث + فلترة (actor, action, time range, resource_type).

### DoD
- إنشاء Engine Job → ينتقل تلقائيًا من `planned` إلى `active` ثم `completed` بدون تدخل UI.
- Outbox يُفرَّغ ولا يتراكم > 50 حدث في الحالة المستقرة.
- DLQ يستقبل أحداث فاشلة بعد 3 محاولات.

---

## P5 — التحصين والتوسّع البصري المُقيَّد (4 أسابيع) — يطابق Phase 5 + جزء أمني

### المخرجات الوظيفية (مرشّحة، تُختار حسب الأولوية وقت الوصول)
1. **Dependency Graph Visualizer** — يستهلك `dependencies` table.
2. **Engine Jobs Dashboard** — لوحة حالة المحركات.
3. **Project Cards / Task Cards** — تفعيل الجدولين الموجودين كعناصر مشتركة بين المشاريع والسبورات.
4. **Cross-Workspace Search** — بحث موحّد عبر الكيانات المركزية.
5. **Tools Marketplace** داخل Boards (تسجيل أدوات قابلة لإعادة الاستخدام).

### المخرجات غير الوظيفية (إلزامية لـ v1.0)
1. **أمن:** Supabase linter صفر تحذيرات حرجة، مراجعة RLS يدوية شاملة، تفعيل Email confirm، session timeout مناسب.
2. **أداء:** ضبط React Query staleTime/gcTime، Code Splitting لكل Workspace، Lazy load للـ Planning canvas، هدف Lighthouse ≥ 85.
3. **اختبارات:** Unit ≥ 70%، Integration لكل Workspace، E2E لمسارات حرجة (auth, project create, board collaboration, invoice flow) — Playwright.
4. **موثوقية:** Error Boundaries على مستوى Workspace، Sentry (أو ما يعادله)، خطة Backup موثَّقة.
5. **a11y:** WCAG AA، focus rings (موجود في tokens)، اختبار قارئ شاشة لمسار Sidebar→Workspace→Modal.
6. **توثيق:** `docs/USER_GUIDE.md`, `docs/ADMIN_GUIDE.md`, `docs/RUNBOOK.md`, `docs/RELEASE_NOTES_V1.md`.

### مؤجَّل صراحة إلى ما بعد v1.0
Approval Workflow متدرّج، JIT/Break-Glass، 18 دور مؤسسي، SCIM/SSO، SIEM/PagerDuty، AI Gateway مستقل، KMS rotation policy، Compliance PDPL/GDPR formal — كلها مصنّفة `Planned-Vision` في `LEGACY_SPEC_AUDIT.md` ولا تدخل v1.0.

### DoD
- اختبار قبول من 3 مستخدمين حقيقيين بدون أخطاء كاسرة.
- Lighthouse ≥ 85 على Projects و Planning و OperationsBoard.

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

