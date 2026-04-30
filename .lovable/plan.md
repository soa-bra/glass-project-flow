# خطة الوصول إلى النسخة النهائية الجاهزة للتسليم والإطلاق

> مبنية على: `CURRENT_SYSTEM_SPECIFICATION.md` + `LEGACY_SPEC_AUDIT.md` + `TARGET_ARCHITECTURE_SPECIFICATION.md` + `MIGRATION_PLAN.md`.
> القاعدة: لا قفز فوق المراحل — كل مرحلة لها Definition of Done صارم.

---

## نظرة عامة على المراحل

```text
P0 Stabilize ─▶ P1 Auth & Roles ─▶ P2 Central Data ─▶ P3 Workspace Integration

                                                            │
                                                            ▼
P6 Launch ◀── P5 Hardening ◀── P4 Audit / Events / Engine Jobs

```

&nbsp;

---

## P0 — التثبيت وإصلاح الأساسات

**الهدف:** قاعدة بناء نظيفة قبل أي عمل كبير.

1. إصلاح أخطاء البناء المعروفة في `src/shared/events/emitter.ts` و `src/components/TaskCard/BaseTaskCardLayout.tsx`.
2. تفعيل CI صارم: `tsc --noEmit` + `eslint` + `vitest run` على كل PR (موجود `.github/workflows/pr-checks.yml`).
3. حذف أو وسم `@deprecated` للملفات الميتة: `prisma/V2.prisma.additions.txt` (تتحول لاحقًا إلى migration).
4. اعتماد قرار رسمي حول `kv_store_*` (5 جداول): إبقاء/حذف.
5. تنظيف `mockProjects` و `OperationsBoard/mockData.ts` خلف Feature Flag `VITE_USE_MOCK_DATA` ليسهل تتبّعها.
6. توثيق Environment Variables المطلوبة في `.env.example`.

**Definition of Done:** Build أخضر، اختبارات تمرّ، CI يحجب أي PR كاسر.

---

## P1 — المصادقة والأدوار الموحّدة

**الهدف:** نظام هوية وصلاحيات حقيقي بدل البيانات المحلية المقلّدة.

1. **Supabase Auth:** صفحة `/auth` (تسجيل/دخول)، email + password، حماية كل الصفحات بـ `ProtectedRoute`.
2. جدول `profiles` بمعلومات المستخدم (لا تخزّن أدوار فيه).
3. **جدول `user_roles` منفصل** + `app_role` enum (`owner | manager | member | viewer | guest`) + دالة `has_role()` مع `SECURITY DEFINER` (وفق memory `user-roles`).
4. توحيد `board_role` الحالي مع `app_role` عبر طبقة تجريدية.
5. Hook موحَّد `usePermission(action, scope)`.
6. لوحة Admin بسيطة لإسناد الأدوار (Owner فقط).

**Definition of Done:** كل الجداول الحساسة محمية بـ RLS مبنية على `has_role()`، اختبارات RLS تمرّ، Supabase Linter بدون تحذيرات حرجة.

---

## P2 — ربط نموذج البيانات المركزي

**الهدف:** تفعيل migration `20260430090000` في الـ Frontend بدون أي UI جديد.

1. توليد Types من Supabase (`src/integrations/supabase/types.ts` آلي).
2. طبقة خدمات `src/services/central/{boards, departments, projects, tasks, tools, engineJobs, dependencies}.service.ts`.
3. Zod Schemas للتحقق من المدخلات.
4. React Query Hooks للقراءة فقط (`useBoards, useDepartments, useProjects, …`).
5. Seed تجريبي + اختبارات تكامل End-to-End لإنشاء Department→Project→Task→Tool→EngineJob+Dependency.
6. مراجعة RLS لكل جدول مركزي (تأكد أن كل `select/insert/update/delete` آمن).

**Definition of Done:** يمكن قراءة/كتابة كل كيانات النموذج المركزي من الـ Frontend عبر الخدمات، تغطية اختبارات ≥ 70% للخدمات.

---

## P3 — ربط مساحات العمل

**الهدف:** استبدال كل Mock بقراءات حقيقية، مع الإبقاء على نفس الـ UI.

ترتيب الأولوية:

1. **Projects Workspace ⇆ `projects`:** `ProjectWorkspace`, `ProjectsColumn`, `ProjectManagementBoard` يقرؤون من `useProjects()`.
2. **Tasks ⇆ `tasks` + `task_tool_engine_links`:** `ProjectTasksContext` يستخدم `useProjectTasks(projectId)`.
3. **Departments ⇆ `departments` + `department_projects`:** `DepartmentsSidebar` يقرأ ديناميكيًا.
4. **Planning Boards ⇆ `boards` + `tools`:** `PlanningEntryScreen` يعرض سبورات حقيقية للمستخدم.
5. **OperationsBoard ⇆ Aggregations:** استبدال `mockData.ts` بقراءات تجميعية حقيقية.
6. **Invoices** (مرتبطة سابقًا) — ربط بالمشروع المركزي عبر `project_id`.

كل خطوة خلف Feature Flag، مع Fallback مؤقت للـ Mock حتى التحقق.

**Definition of Done:** لا استدعاء واحد لـ `mockProjects` في الإنتاج، اختلاف بيانات بين مستخدمَين يعمل (RLS فعّال).

---

## P4 — Audit + Events + Engine Jobs

**الهدف:** تحويل التدقيق والأحداث من Mock إلى نظام حقيقي.

1. **Audit Service حقيقي:** استبدال `mockAuditEvents` في `src/services/audit.ts` بكتابة فعلية إلى جدول `audit_events` (جديد) أو `op_log` موسّع.
2. **Decorator/Wrapper موحَّد** يلفّ كل Command حسّاس بسلسلة: Permission Check → Execute → Audit Log.
3. **Outbox Pattern:** تفعيل `EventOutbox + EventDLQ` كـ migration حقيقية (تحويل `prisma/V2.prisma.additions.txt`).
4. **Edge Function لمعالجة Outbox** (تحلّ محل سكربت `outbox-relay.ts` في الإنتاج).
5. **Engine Jobs Worker:** Edge Function لتشغيل `engine_jobs` (kind=`automation|sync|analytics|...`) بشكل غير متزامن.
6. **Realtime Subscriptions** على `engine_jobs.state` لإظهار التقدم في الـ UI.
7. **Audit Center داخل Settings:** عرض آخر 100 حدث + فلترة.

**Definition of Done:** كل أمر حسّاس يولّد سجلًا، Outbox/DLQ يعملان، Engine Job ينفّذ بنجاح ويحدّث حالته.

---

## P5 — التحصين (Hardening) 

**الهدف:** استعداد للإنتاج.

### الأمن

- Supabase Linter صفر تحذيرات حرجة.
- مراجعة RLS يدوية لكل جدول.
- إعدادات Auth: Email confirmation، Password strength، Session timeout مناسب.
- منع تسريب أي `service_role_key` لجانب العميل.

### الأداء

- React Query staleTime/gcTime مناسبة لكل query.
- Code Splitting لكل Workspace.
- Lazy load للكانفاس وأدواته الثقيلة.
- اختبار حمل: 50 مستخدم متزامن على نفس السبورة (موجود `peak-collaboration-load.test.ts` كأساس).
- Lighthouse score ≥ 85.

### الاختبار

- Unit ≥ 70% على الخدمات والـ stores.
- اختبارات تكامل لكل Workspace.
- E2E (Playwright/Cypress) للمسارات الحرجة: تسجيل دخول → إنشاء مشروع → إضافة مهمة → تنفيذ Engine Job.

### الموثوقية

- Error Boundary على مستوى App + كل Workspace.
- Sentry أو ما يعادله للأخطاء (يستفيد من `pino` الموجود).
- Backup policy لـ Supabase (يومي + أسبوعي).

### إمكانية الوصول

- WCAG AA للنماذج والأزرار.
- Focus rings + ARIA labels (موجودة جزئيًا في tokens).
- اختبار قارئ شاشة (NVDA/VoiceOver) لمسار حرج واحد على الأقل.

### التوثيق النهائي

- `docs/USER_GUIDE.md` (للمستخدم النهائي بالعربية).
- `docs/ADMIN_GUIDE.md` (لإدارة الأدوار + Settings).
- `docs/RUNBOOK.md` (للحوادث والاستعادة).
- تحديث `README.md` و `CHANGELOG.md`.

**Definition of Done:** كل ما سبق ≥ هدفه، اختبار قبول من 3 مستخدمين حقيقيين بدون أخطاء كاسرة.

---

## P6 — الإطلاق

1. **Staging Environment** مطابق للإنتاج، اختبار قبول نهائي.
2. **خطة Rollout متدرّجة:** Soft Launch لمجموعة 5-10 مستخدمين → أسبوع → فتح كامل.
3. **Domain + SSL + Email** (عبر Lovable Publish + Custom Domain).
4. **Monitoring Live:** لوحة Metrics (Prometheus/Grafana أو ما يعادله)، تنبيهات على Errors > threshold.
5. **خطة Rollback** موثّقة (snapshot DB قبل كل deploy، إمكانية الرجوع لـ tag سابق).
6. **Day-1 Support:** قناة دعم + متابعة 48 ساعة بعد الإطلاق.

**Definition of Done:** المنتج في الإنتاج، لا أخطاء حرجة لمدة 7 أيام، مستخدمون فعليون يستخدمونه.

---

## ميزات مؤجَّلة بعد v1.0 (Post-Launch)

تبقى ضمن "النوايا" من الوثيقة القديمة، تُجدوَل كـ v1.x:

- نظام موافقات متدرّج (Approvals Workflow) — بعض البنية موجودة في `src/services/approvals.ts`.
- Dependency Graph Visualizer.
- Tools Marketplace.
- AI Gateway connectors / تحليل شذوذ.
- SCIM / SSO Enterprise.
- SIEM/PagerDuty integration.
- JIT Access + Break-Glass.
- 18 دور مؤسسي (يبقى الحالي 5 أدوار).

---

## مخاطر رئيسية ومُلطِّفات


| المخاطرة                                   | اللطّف                                         |
| ------------------------------------------ | ---------------------------------------------- |
| Migration `20260430090000` لم تُختبر مع UI | P2 يفعل seed + integration tests               |
| استبدال Mock يكسر Workspaces               | Feature flags + rollout تدريجي في P3           |
| Edge Functions بطيئة لـ Engine Jobs        | Workers + queue pattern في P4                  |
| RLS misconfiguration                       | مراجعة يدوية + Linter + اختبارات RLS في P1/P5  |
| تأخر بسبب Refactor متزامن                  | تجميد المعمارية بعد P2، أي تغيير يحتاج مبرّرًا |


---

## قرارات مطلوبة قبل البدء

1. هل migration `20260430090000` نهائية؟ (تجمّد بعد البدء بـ P2).
2. الأدوار الخمسة المقترحة (`owner|manager|member|viewer|guest`) مقبولة؟
3. هل `kv_store_*` تُحذف أم تبقى؟
4. أولوية Workspaces في P3 — هل ترتيبي مقبول (Projects → Tasks → Departments → Planning → Operations)؟
5. متطلبات Compliance خاصة (PDPL سعودي/GDPR) قبل الإطلاق؟

---

## المخرجات النهائية للتسليم

- تطبيق Production يعمل على Domain.
- 4 وثائق توصيف (موجودة) + 3 أدلة تشغيلية (USER/ADMIN/RUNBOOK).
- اختبارات تلقائية (Unit + Integration + E2E).
- Monitoring + Alerts.
- خطة Rollback + Backup.
- تدريب فريق العميل (جلسة واحدة + فيديو).