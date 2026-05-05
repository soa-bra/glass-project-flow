# EXECUTION ROADMAP — خارطة التنفيذ المعتمدة للوصول إلى v1.0

> هذه الوثيقة هي المرجع الملزم للتنفيذ. مبنية على الخطة المعتمدة في `.lovable/plan.md` + قرارات المالك.
> الوثائق التحليلية: `CURRENT_SYSTEM_SPECIFICATION.md`, `LEGACY_SPEC_AUDIT.md`, `TARGET_ARCHITECTURE_SPECIFICATION.md`, `MIGRATION_PLAN.md`.

---

## القرارات الاستراتيجية المعتمدة

| # | القرار | الاعتماد |
|---|---|---|
| 1 | **نموذج الأدوار** | **توسيع `board_role` الحالي** (host/editor/viewer) بدل إنشاء `app_role` منفصل. |
| 2 | **kv_store_* + prisma .txt** | **يبقيان كما هما** — لا حذف، لا migration الآن. |
| 3 | **ترتيب ربط Workspaces في P3** | **Projects → Tasks → Departments → Planning → Operations**. |
| 4 | **migration `20260430090000`** | **معتمدة كما هي**، لا تعديلات قبل P2. |
| 5 | **Compliance** | لم يُحدَّد بعد — يُراجع قبل P5 (Hardening). |

---

## انعكاس قرار الأدوار على الخطة

بدل إنشاء جدول `user_roles` جديد بـ `app_role` enum:
- نوسّع `board_role` الحالي (`host | editor | viewer`) ليشمل scope عام بإضافة:
  - عمود `scope_type text` (`global | board | department | project`).
  - عمود `scope_id uuid nullable`.
- نُنشئ جدول `user_roles` يستخدم enum `board_role` نفسه.
- دالة `has_role(user_id, role, scope_type, scope_id)` بـ `SECURITY DEFINER`.
- `host` = أعلى صلاحية (يحلّ محل Owner)، `editor` = صلاحية تعديل، `viewer` = قراءة.
- guest يبقى مفهومًا منطقيًا (مستخدم بدعوة مؤقتة) لا دورًا قاعديًا.

---

## المراحل بالتفصيل (مع Definition of Done)

### P0 — التثبيت (أسبوعان)
**التسليمات:**
- ✅ إصلاح أخطاء البناء في `src/shared/events/emitter.ts` و `src/components/TaskCard/BaseTaskCardLayout.tsx`.
- ✅ Feature Flag `VITE_USE_MOCK_DATA` في `.env.example` + توثيق.
- ✅ تفعيل CI صارم في `.github/workflows/pr-checks.yml` (typecheck + lint + test).
- ⏭️ kv_store + prisma .txt: **لا تغيير**.
- ✅ توثيق كل Environment Variables في `.env.example`.

**DoD:** Build أخضر، CI يحجب أي PR كاسر.

---

### P1 — Auth + توسيع board_role (2-3 أسابيع)
**التسليمات:**
- صفحة `/auth` (Supabase Email + Password)، `ProtectedRoute` لكل المسارات عدا `/join/:token`.
- جدول `profiles` (id, user_id, display_name, avatar_url, bio).
- توسيع `board_role` بـ scope (`scope_type`, `scope_id`).
- جدول `user_roles (id, user_id, role: board_role, scope_type, scope_id)`.
- دالة `has_role(uid, role, scope_type, scope_id) SECURITY DEFINER`.
- Hook `usePermission(action, scope)`.
- لوحة Admin مبسّطة (host scope=global فقط) لإسناد الأدوار.
- مراجعة كل RLS موجودة لتعتمد `has_role()` حيث يلزم.

**DoD:** Supabase Linter بدون تحذيرات حرجة، اختبارات RLS تمرّ، لا تسريب لـ service_role.

---

### P2 — ربط النموذج المركزي (3-4 أسابيع)
**التسليمات:**
- `src/services/central/{boards,departments,projects,tasks,tools,engineJobs,dependencies}.service.ts`.
- Zod schemas في `src/services/central/schemas.ts`.
- React Query hooks: `useBoards, useDepartments, useProjects, useProjectTasks, useBoardTools, useEngineJobs, useDependencies`.
- Seed تجريبي + اختبارات تكامل E2E.
- مراجعة RLS لكل جدول مركزي.

**DoD:** قراءة/كتابة كاملة من Frontend، تغطية ≥ 70% للخدمات.

---

### P3 — ربط مساحات العمل (5-6 أسابيع)
**ترتيب صارم (معتمد):**
1. **Projects ⇆ `projects`** — إزالة `mockProjects` خلف flag.
2. **Tasks ⇆ `tasks` + `task_tool_engine_links`** — `ProjectTasksContext` يقرأ من DB.
3. **Departments ⇆ `departments` + `department_projects`**.
4. **Planning Boards ⇆ `boards` + `tools`** — `PlanningEntryScreen` يعرض السبورات الحقيقية.
5. **Operations ⇆ aggregations حقيقية** — استبدال `mockData.ts`.
6. **Invoices ⇆ project_id المركزي**.

كل خطوة خلف Feature Flag، Fallback للـ Mock حتى التحقق.

**DoD:** لا استدعاء واحد لـ `mockProjects` في Production، تجربة مستخدمَين منفصلَين تعمل.

---

### P4 — Audit + Events + Engine Jobs (3-4 أسابيع)
**التسليمات:**
- جدول `audit_events` جديد + RLS.
- استبدال `mockAuditEvents` بكتابة فعلية.
- Decorator موحَّد: Permission Check → Execute → Audit Log.
- Migration حقيقية لـ `EventOutbox + EventDLQ` (تحويل `prisma/V2.prisma.additions.txt` لـ SQL).
- Edge Function `outbox-relay` (تحلّ محل السكربت).
- Edge Function `engine-jobs-worker` لتشغيل `engine_jobs` غير متزامنًا.
- Realtime subscriptions على `engine_jobs.state`.
- Audit Center في Settings (آخر 100 حدث + فلترة).

**DoD:** كل أمر حسّاس يولّد سجلًا، Outbox/DLQ يعملان، Engine Job ينفّذ ويحدّث حالته.

---

### P5 — التحصين (3-4 أسابيع)
**يُراجع قرار Compliance (PDPL/GDPR) في بداية هذه المرحلة.**

- **أمن:** Linter صفر تحذيرات حرجة، مراجعة RLS يدوية، Auth settings (email confirm, session timeout).
- **أداء:** React Query staleTime/gcTime، Code Splitting، Lazy load، Lighthouse ≥ 85.
- **اختبارات:** Unit ≥ 70%، Integration لكل Workspace، E2E لمسارات حرجة (Playwright).
- **موثوقية:** Error Boundaries، Sentry، Backup policy.
- **a11y:** WCAG AA، Focus rings، اختبار قارئ شاشة.
- **توثيق:** `docs/USER_GUIDE.md`, `docs/ADMIN_GUIDE.md`, `docs/RUNBOOK.md`.

**DoD:** اختبار قبول من 3 مستخدمين حقيقيين بدون أخطاء كاسرة.

---

### P6 — الإطلاق (1-2 أسبوع)
- Staging مطابق للإنتاج.
- Soft Launch (5-10 مستخدمين) → أسبوع → فتح كامل.
- Custom Domain + SSL + Email.
- Monitoring Live + Alerts.
- خطة Rollback موثّقة.
- Day-1 Support 48 ساعة.

**DoD:** Production مستقر 7 أيام بدون أخطاء حرجة.

---

## ميزات مؤجَّلة (v1.x+)
Approvals Workflow متدرّج · Dependency Graph Visualizer · Tools Marketplace · AI Gateway · SCIM/SSO · SIEM · JIT/Break-Glass · 18 دور مؤسسي.

---

## نقطة البدء التالية
**P0 — Step 1:** إصلاح أخطاء البناء + إعداد Feature Flag للـ mock data. (يُنفَّذ في الجلسة القادمة بأمر صريح من المالك.)
