# MIGRATION PLAN — خطة الانتقال من الواقع إلى المعمارية المستهدفة

> **القراءة المسبقة:** `CURRENT_SYSTEM_SPECIFICATION.md` + `LEGACY_SPEC_AUDIT.md` + `TARGET_ARCHITECTURE_SPECIFICATION.md`.
>
> **مبدأ المخاطرة:** كل مرحلة تكتمل قبل التي تليها. لا تُبنى واجهات جديدة قبل اكتمال نموذج البيانات والصلاحيات.

---

## Phase 1 — Current State Stabilization (تثبيت الواقع)

### الأهداف
- توثيق الواقع بشكل لا لبس فيه (✅ مُكتمل في هذه الوثائق الأربع).
- تحديد كل mock data، كل تعارض، كل ملف حرج.

### المخرجات
1. **قائمة Mock Data المعروفة** (يجب استبدالها):
   - `src/data/mockProjects.ts`
   - `src/components/OperationsBoard/mockData.ts`
   - `src/services/audit.ts` (`mockAuditEvents`)
   - بيانات داخلية في `DepartmentTabs/*` (عدا Invoices)
2. **قائمة الملفات الحرجة** (لا تعدّل بدون مراجعة):
   - `src/engine/canvas/kernel/canvasKernel.ts`
   - `src/features/planning/state/store.ts`
   - `src/features/planning/domain/policies/authorization.ts`
   - `src/integrations/supabase/client.ts`
   - `supabase/migrations/*` (خاصة `20260430090000`)
3. **قائمة التعارضات بين الوثيقة القديمة والكود** — موجودة في `LEGACY_SPEC_AUDIT.md`.
4. **قائمة الجداول المهجورة/غير المستخدمة في الـ UI:**
   - `kv_store_*` (5 جداول KV)
   - `projects, project_phases, project_tasks` (UI يستخدم mock)
   - الجداول المركزية الحديثة (`departments, tasks, tools, engine_jobs, dependencies, …`)

### معايير الإنجاز
- لا يوجد ادّعاء عن "موجود فعلًا" بدون Evidence Map.
- كل المساحات مصنّفة `Implemented/Partial/Mock/Planned/Unknown`.

---

## Phase 2 — Central Data Model (نموذج البيانات المركزي)

### الأهداف
- ربط الـ Frontend بالنموذج المركزي الموجود في DB منذ migration `20260430090000`.
- **بدون بناء أي واجهة جديدة.**

### المخرجات
1. **توليد Types مطابقة للـ migration:**
   - `src/types/central/{board,department,project,task,tool,engineJob,dependency,state}.ts`
   - مطابقة للـ enums: `central_state, central_priority, central_complexity, central_dependency_type, central_entity_type, tool_kind, engine_job_kind, task_tool_engine_relation_type, department_project_role`.
   - المصدر التلقائي: `src/integrations/supabase/types.ts` (مولّد من Supabase) — لا يُعدَّل يدويًا.
2. **خدمات قراءة/كتابة (CRUD) لكل كيان:**
   - `src/services/central/{boards,departments,projects,tasks,tools,engineJobs,dependencies}.service.ts`
   - استخدام `supabase.from(...).select/insert/update/delete` بدون أي طبقات إضافية.
3. **Zod schemas للتحقق من المدخلات** قبل الإرسال (تماشيًا مع نمط Smart Elements).
4. **React Query hooks** للقراءة فقط في هذه المرحلة:
   - `useBoards, useDepartments, useProjects, useProjectTasks, useBoardTools, useEngineJobs, useDependencies`.
5. **اختبارات وحدة** للخدمات (Vitest + Testing Library).

### قواعد صارمة
- لا تعديل على أي مكوّن UI في هذه المرحلة.
- لا حذف لـ mock — يبقى متوازيًا حتى Phase 4.
- لا إضافة جداول جديدة إلا عند الضرورة المُثبَتة.

### معايير الإنجاز
- استدعاء `selectAllBoards()` يعيد سجلات حقيقية من DB.
- اختبار End-to-End لإنشاء Department → Project → Task → Tool → Engine Job + Dependency.

---

## Phase 3 — Access Control Model (نموذج الصلاحيات)

### الأهداف
- توحيد الأدوار والصلاحيات.
- ربطها بالكيانات المركزية.
- تفعيل Audit حقيقي.

### المخرجات
1. **جدول `user_roles` منفصل** (وفق memory `user-roles` instructions):
   ```
   create type public.app_role as enum ('owner','manager','member','viewer','guest');
   create table public.user_roles (id, user_id, role, scope_type, scope_id, granted_at);
   ```
   - دالة `has_role(user_id, role, scope_type?, scope_id?) returns boolean` بـ `SECURITY DEFINER`.
2. **توسيع سياسة التفويض الموجودة:**
   - تعميم نمط `evaluateCommandAuthorization` ليغطّي:
     - `central.board.create/update/archive`
     - `central.department.create/update`
     - `central.project.create/update/transition-state`
     - `central.task.create/update/assign/transition-state`
     - `central.tool.create/update`
     - `central.engineJob.trigger`
3. **ABAC على `scope_id`:**
   - `departmentId, projectId, boardId, dataSensitivity` كقيود.
4. **Audit حقيقي:**
   - استبدال Mock في `src/services/audit.ts` بكتابة فعلية إلى جدول جديد `audit_events` (أو توسعة `op_log`).
   - استدعاء التدقيق من جميع الأوامر الحساسة آليًا عبر decorator/wrapper.
5. **Hook موحّد:** `usePermission(action, scope)` يعيد `{ allowed, reason }`.

### قواعد صارمة
- لا storage للأدوار في `localStorage` أو على جدول `profiles`.
- كل سياسة تُختبر بـ unit test.
- لا حذف للسياسة الحالية لـ Smart Elements — تبقى وتُهاجَر إلى النمط الموحّد.

### معايير الإنجاز
- محاولة تنفيذ أمر بدون صلاحية تُرفض وتُسجَّل في `audit_events`.
- لوحة Audit بسيطة (داخل Settings) تعرض آخر 100 حدث.

---

## Phase 4 — Workspace Integration (ربط المساحات)

### الأهداف
- استبدال mock data بقراءات حقيقية.
- ربط المساحات الخمس بالنموذج المركزي.

### المخرجات (مرتّبة بالأولوية)
1. **Projects Workspace ⇆ `projects` table (المركزي):**
   - `ProjectWorkspace.tsx` يستخدم `useProjects()` بدل `useState(mockProjects)`.
   - إضافة/تحديث/حذف عبر خدمات Phase 2.
   - الحفاظ على نفس واجهة UI (`ProjectsColumn, OperationsBoard, ProjectManagementBoard`).
2. **Departments Workspace ⇆ `departments + department_projects`:**
   - `DepartmentsSidebar` يقرأ من `useDepartments()`.
   - كل DepartmentTab يقرأ مشاريعه عبر `department_projects`.
3. **Planning Boards ⇆ `boards + tools`:**
   - `PlanningEntryScreen` يعرض السبورات الحقيقية للمستخدم.
   - كل أداة Smart Element تُسجَّل كـ `tool` (kind=`board_widget`).
4. **Tasks ⇆ `tasks + task_tool_engine_links`:**
   - `ProjectTasksContext` يستخدم `useProjectTasks(projectId)`.
   - الربط بين Task ↔ Tool ↔ Engine Job يصبح متاحًا.
5. **OperationsBoard ⇆ تجميعات حقيقية:**
   - استبدال `mockData.ts` بقراءات تجميعية (aggregations) من الجداول المركزية.

### قواعد صارمة
- نقل تدريجي: workspace واحدة في المرة، خلف feature flag.
- الإبقاء على mock كـ fallback خلف flag (`VITE_USE_MOCK_PROJECTS=true`) حتى انتهاء التحقق.
- لا تغيير في تصميم البطاقات/التبويبات (الـ UI يبقى كما هو).

### معايير الإنجاز
- يمكن لمستخدمَين مختلفَين رؤية بياناتهما المنفصلة (RLS فعّال).
- ProjectWorkspace يعمل بدون mock data.

---

## Phase 5 — UI and Feature Expansion (التوسّع البصري والوظيفي)

### الأهداف
- بعد اكتمال النموذج والصلاحيات والربط، يُسمح ببناء الواجهات الجديدة.

### المخرجات المرشّحة (للمراجعة عند الوصول)
1. **Dependency Graph Visualizer** (يستفيد من `dependencies` table).
2. **Engine Jobs Dashboard** (يعرض `engine_jobs` + statuses).
3. **Tools Marketplace داخل Boards.**
4. **Audit Center في Settings** (يعرض `audit_events` الكامل).
5. **Project Cards / Task Cards** كعنصر مشترك بين المشاريع والسبورات (الجداول `project_cards, task_cards` موجودة).
6. **Cross-Workspace Search** (مشروع يظهر في Planning كعنصر، وفي Departments كانتماء، وفي Operations كمؤشر).
7. **Approval Workflow متدرّج** (مرحلة لاحقة جدًا).
8. **Event Outbox/DLQ فعلي** (تفعيل النموذج المعرّف في `prisma/V2.prisma.additions.txt`).

### قواعد صارمة
- لا توسعة قبل اكتمال 1–4.
- كل ميزة جديدة تمرّ بـ: types → service → policy → audit → hook → UI.
- التزام كامل بـ `mem://*` rules (Surface contract، RTL، Glassmorphism، Grid).

---

## ملخّص التسلسل

```
Phase 1 ─▶ Phase 2 ─▶ Phase 3 ─▶ Phase 4 ─▶ Phase 5
Stabilize  Data       Access     Integrate   Expand
(docs)     Model      Control    Workspaces  Features
```

- **Phase 1:** ✅ مكتملة بهذه الوثائق.
- **Phase 2:** التالي مباشرة. لا ينتج عنه أي تغيير بصري. مخاطر منخفضة.
- **Phase 3:** يتطلب موافقة على نموذج الأدوار قبل البدء.
- **Phase 4:** أكبر مرحلة — تحوّل بصري بدون تغيير تصميم.
- **Phase 5:** مفتوحة للنمو.

---

## مخاطر معروفة ومُلطّفات

| المخاطرة | اللطّف |
|---|---|
| Migration `20260430090000` لم تُختبر مع UI | تشغيل seed صغير + اختبارات تكامل في Phase 2 |
| الكود يحمل types متكرّرة لـ Project/Task | Phase 2 يولّد types مركزية ويُعلِم القديم بـ `@deprecated` |
| `auditService` Mock مستخدَم في `authorization.ts` | الإبقاء على نفس signature أثناء استبدال التنفيذ في Phase 3 |
| OperationsBoard يعرض mockData لـ 6 تبويبات | الإبقاء على fallback مرحليًا، استبدال في Phase 4 |
| Edge Function وحيدة (`smart-elements-ai`) | إذا توسّعت الأتمتة، تُضاف Edge Functions جديدة في Phase 5 لـ Engine Jobs |

---

## أسئلة تحتاج قرارًا بشريًا قبل البدء بـ Phase 2

1. هل migration `20260430090000_central_integration_data_model.sql` نهائية ومعتمدة، أم تحتاج تعديلات قبل البناء عليها؟
2. هل الجداول المهجورة (`kv_store_*`) تُحذَف أم تبقى للتوافقية؟
3. هل تُحذَف `prisma/V2.prisma.additions.txt` أم تتحوّل إلى migration حقيقية لـ Outbox/DLQ؟
4. ما هي مجموعة الأدوار المؤسسية المعتمدة؟ (مقترح بسيط: `Owner | Manager | Member | Viewer | Guest`).
5. هل نُبقي 3 أدوار `board_role` كما هي، أم نوحّدها مع نموذج `app_role` العام؟
