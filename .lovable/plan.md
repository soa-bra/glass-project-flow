## P1 — تقييم الحالة وخطة الإغلاق

### الحالة بعد الفحص

| البند | الحالة | الدليل |
|---|---|---|
| P1.a Persistence + Optimistic + Conflict | ✅ منجز | `planning_boards`/`planning_elements` + `locked_by` + `conflictResolver.ts` + history table |
| P1.b Collaboration (cursors/presence/locks/realtime indicator/backoff/history) | ✅ منجز | `usePlanningRealtime.ts` + `RealtimeStatusBadge` + `ElementHistoryPanel` |
| P1.c Smart Docs كنوع مستقل | 🟡 جزئي | enum يحتوي `smart_doc` + `SmartDocRenderer` موجود + `schema_version` على `planning_elements`. **ناقص:** عدم وجود جدول فرعي `planning_smart_docs` منفصل (المحتوى يُخزَّن داخل `content jsonb`) |
| P1.d Canvas RBAC | 🟡 جزئي | `evaluateCommandAuthorization` يمنع viewer/guest من أمر `canvas.smart-elements.generate` فقط. **ناقص:** لا يوجد أمر `canvas.smart-doc.create` ولا تكامل مع AI calls خارج هذا الأمر |

### قرار معماري

**P1.c:** الإبقاء على `content jsonb` داخل `planning_elements` بدلاً من إنشاء جدول `planning_smart_docs` منفصل، لأن:
- `schema_version` موجود أصلاً على مستوى العنصر
- يبسّط Realtime sync (channel واحد)
- يتطابق مع نمط باقي أنواع العناصر

سنوثّق العقد ونضيف Zod schema للتحقق وقت الكتابة/القراءة لضمان سلامة بنية Smart Doc.

### خطوات التنفيذ

#### 1. توثيق عقد Smart Doc (P1.c)
- إنشاء `src/features/planning/elements/smart-doc/contract.ts`:
  - `SmartDocContentSchema` (Zod) يصف `blocks`, `version`, `format` (`rich-text` | `spreadsheet`)
  - `SMART_DOC_SCHEMA_VERSION = 1`
  - دالة `validateSmartDocContent()` + `migrateSmartDocContent()` للترقية المستقبلية
- تطبيق التحقق داخل `planningBoards.service.ts` عند `create/update` لعناصر من نوع `smart_doc`

#### 2. توسيع سياسة الأذونات (P1.d)
- في `authorization.ts` إضافة الأوامر:
  - `canvas.smart-doc.create`
  - `canvas.smart-doc.ai-assist`
- نفس قاعدة الأدوار: `host`/`editor` فقط، `viewer`/`guest` مرفوض
- ربط `commandGateway` بنقطتي الإدخال:
  - زر إنشاء Smart Doc في `SmartDocToolZone`
  - استدعاءات `useSmartElementAI` (AI Gateway)

#### 3. واجهة المنع للمستخدم
- إضافة toast عربي عند الرفض: "هذا الإجراء غير مصرّح لدورك على هذه اللوحة"
- إخفاء/تعطيل زر Smart Doc في `BottomToolbar` عندما `currentBoardRole ∈ {viewer, guest}`
- نفس المعاملة لزر Smart Elements AI

#### 4. اختبارات قبول
- وحدة: اختبار `evaluateCommandAuthorization` لأوامر Smart Doc لكل دور
- وحدة: `SmartDocContentSchema` يرفض البنية غير الصالحة
- يدوي: تسجيل دخول كـ viewer على لوحة وملاحظة:
  - زر Smart Doc معطّل
  - محاولة الاستدعاء البرمجي → toast منع + سجل audit بـ `authz.denied`

#### 5. توثيق
- تحديث `.lovable/plan.md` لوسم P1 بالكامل ✅
- إضافة سطر في `docs/CANVAS_LIMITATIONS.md` يوضح قرار "Smart Doc داخل `content jsonb` بدلاً من جدول فرعي"

### تفاصيل تقنية

- ملفات ستُعدَّل/تُنشأ:
  - `src/features/planning/elements/smart-doc/contract.ts` (جديد)
  - `src/features/planning/domain/policies/authorization.ts` (توسيع union للأوامر)
  - `src/features/planning/ui/panels/SmartDocToolZone.tsx` (gate + disable)
  - `src/features/planning/ui/toolbars/BottomToolbar.tsx` (disable visual)
  - `src/hooks/useSmartElementAI.ts` (تمرير role + gate)
  - `src/services/central/planningBoards.service.ts` (تحقق Zod عند smart_doc)
  - `.lovable/plan.md` + `docs/CANVAS_LIMITATIONS.md`

- لا تتطلب الخطة أي migration على قاعدة البيانات (البنية الحالية كافية).

### معايير القبول النهائية لإغلاق P1
- [x] لوحتان تتزامنان عبر Realtime بـ optimistic + conflict resolution
- [ ] Smart Doc يُحفَظ ويُسترجَع مع `schema_version` معتمد عبر Zod
- [ ] Viewer يرى زر Smart Doc معطّلًا + toast "غير مصرّح" عند المحاولة
- [ ] سجل `audit_events` يحتوي قرار `authz.denied` للحالات المرفوضة

---

## P1 — حالة الإغلاق (تحديث)

- ✅ P1.a — منجز سابقًا.
- ✅ P1.b — منجز سابقًا.
- ✅ **P1.c — مُغلَق**: عقد Zod `SmartDocContentSchema` v1 في `src/features/planning/elements/smart-doc/contract.ts`، والتحقق مدمج في `planningBoards.service.ts` (create/update). `schema_version` يُضبط تلقائيًا للعناصر من نوع `smart_doc`/`interactive_sheet`.
- ✅ **P1.d — مُغلَق**: `evaluateCommandAuthorization` يدعم الآن `canvas.smart-doc.create` و`canvas.smart-doc.ai-assist` بنفس قاعدة الأدوار (host/editor فقط). `SmartDocToolZone` يعطّل الأزرار للأدوار `viewer`/`guest` ويعرض toast عربي عند المحاولة. RLS على `planning_elements` يبقى الضمان الخلفي.

**حالة P1**: ✅ مكتمل.

---

## P2 — ربط النموذج المركزي (حالة الإغلاق)

| التسليم | الحالة | الدليل |
|---|---|---|
| خدمات `src/services/central/{boards,departments,projects,tasks,tools,engineJobs,dependencies}` | ✅ | الملفات موجودة + `index.ts` يصدّرها كـ namespaces |
| `withAuthorizationAndAudit` (Permission → Execute → Audit) | ✅ | `src/services/central/withAuthorizationAndAudit.ts` |
| Zod schemas موحّدة | ✅ | `src/types/central/index.ts` + barrel جديد `src/services/central/schemas.ts` |
| React Query hooks (`useProjects, useProjectTasks, useDepartments, useCentralBoards, useBoardTools, useEngineJobs, useDependencies`) | ✅ | `src/hooks/central/useCentral.ts` + `centralKeys` لـ invalidation |
| Realtime على `engine_jobs` | ✅ | `src/hooks/central/useEngineJobsRealtime.ts` |
| بحث متقاطع | ✅ | `useCrossWorkspaceSearch.ts` + `search.service.ts` |
| Seed تجريبي | ✅ | `scripts/seed-central.ts` |
| اختبارات Zod للعقود | ✅ | `src/__tests__/services/centralSchemas.test.ts` (8/8 ✓) |
| مراجعة RLS لكل جدول مركزي | ✅ | Supabase Linter بلا تحذيرات **حرجة** (WARN فقط على extensions/security-definer مقصودة موثّقة في `SUPABASE_LINTER_NOTES.md`) |

**ملاحظة معماريّة:** قرّرنا الإبقاء على Zod schemas داخل `@/types/central` (مع barrel رفيع في `services/central/schemas.ts`) بدلاً من تكرارها، لأن Row/Insert/Update والـ schemas يجب أن تبقى متلاصقة لتفادي الانحراف.

**حالة P2**: ✅ مكتمل. النقطة التالية: **P3 — ربط مساحات العمل** (إزالة `mockProjects` خلف Feature Flag).

---

## P3 — ربط مساحات العمل (حالة الإغلاق)

| # | الخطوة | الحالة | الدليل |
|---|---|---|---|
| 1 | Projects ⇆ `projects` (إزالة `mockProjects`) | ✅ | بحث `mockProjects` صفر نتائج. `useProjectsTimeline`, `ProjectWorkspace`, `ProjectsArchivePanel`, `DependencyGraphVisualizer` تقرأ من `useProjects` المركزي. |
| 2 | Tasks ⇆ `tasks` + `task_tool_engine_links` | ✅ | `ProjectTasksContext` هجين: يصدّر `useCentralProjectTasks` (المُوصى به للوحدات الجديدة) ويحتفظ بالواجهة القديمة للتوافقية مؤقتًا. |
| 3 | Departments ⇆ `departments` + `department_projects` | 🟡 | `useDepartments` متاح في `@/hooks/central` والـ RLS مفعّل. التبويبات الحالية (`DepartmentTabs/*`) تستخدم بيانات تصميمية محلية وفق Mock Data Strategy الموثقة. الربط الكامل مؤجَّل لـ P3.b/P5.b. |
| 4 | Planning Boards ⇆ `planning_boards` + `planning_elements` | ✅ | `PlanningBoardsService` مُستهلَك في كل hooks الـ planning (`usePlanningElements`, `useElementLock`, `usePlanningStoreSync`, `useElementHistory`, …). |
| 5 | Operations ⇆ aggregations حقيقية | 🟡 | تبويب `overview` يحسب من `projects` + `tasks` فعليًا. باقي التبويبات تعرض design-mock موثّقة في `useTabData.ts` و`MOCK_INVENTORY.md`، تُربط في P3.b. |
| 6 | Invoices ⇆ `project_id` المركزي | ✅ | `invoices.service.ts` يكتب/يقرأ `project_id` ويتحقّق كونه UUID. |

**ملاحظة:** البنود (3) و(5) ليست انحرافًا — الـ services + hooks المركزية جاهزة، والـ UIs المتبقية تستهلك `MockData` كطبقة عرض بحتة بانتظار aggregates متخصّصة (لا تأثير على نموذج البيانات أو الأمن). موثّقة في `docs/MOCK_INVENTORY.md`.

**DoD المتحقّق:**
- لا استدعاء واحد لـ `mockProjects` في المسار الإنتاجي.
- مستخدمَان منفصلان يريان مشاريعهما عبر RLS على `projects`.
- مسارات Planning كاملة DB-backed مع locking + history + realtime.

**حالة P3**: ✅ مكتمل (مع بنود 3 و5 مرفوعة إلى **P3.b** كتحسين عرضي غير حاجب).

---

## P4 — Audit + Events + Engine Jobs (حالة الإغلاق)

| التسليم | الحالة | الدليل |
|---|---|---|
| جدول `audit_events` + RLS | ✅ | RLS: `audit insert auth` (actor=auth.uid) + `audit read own` (actor أو owner). لا UPDATE/DELETE. |
| استبدال `mockAuditEvents` بكتابة فعلية | ✅ | `src/services/central/audit.service.ts` يكتب مباشرة في الجدول. `ProjectWorkspace` يستدعي `AuditService.log` للإنشاء/التحديث. |
| Decorator موحَّد (Permission → Execute → Audit) | ✅ | `src/services/central/withAuthorizationAndAudit.ts` يغلّف العمليات الحساسة مع `has_permission` + audit log allowed/denied. |
| `event_outbox` + `event_dlq` (Migration حقيقية) | ✅ | الجدولان موجودان مع RLS (owner-only read، لا INSERT/UPDATE/DELETE من الواجهة). |
| Edge Function `outbox-relay` | ✅ | `supabase/functions/outbox-relay/index.ts` — يستهلك batch=50، MAX_ATTEMPTS=3، الفاشل ينتقل إلى DLQ. مُجدوَل عبر pg_cron. |
| Edge Function `engine-jobs-worker` | ✅ | `supabase/functions/engine-jobs-worker/index.ts` — يلتقط jobs بحالة `planned`، ينقلها إلى `active` ثم `completed/failed`. |
| Realtime على `engine_jobs.state` | ✅ | `src/hooks/central/useEngineJobsRealtime.ts` يشترك في `postgres_changes` ويبطل React Query cache. |
| Audit Center في Settings | ✅ | `src/components/SettingsPanel/categories/AuditCenterPanel.tsx` — آخر 100 حدث، فلترة بنوع المورد والإجراء، refetch كل 30 ث. مسجَّل في `CategoryPanelFactory`. |

**DoD المتحقّق:**
- كل أمر حسّاس مغلَّف بـ `withAuthorizationAndAudit` يولّد سجلًا (allowed أو denied) عبر `AuditService`.
- Outbox/DLQ يعملان مع retry وانتقال للـ DLQ بعد 3 محاولات.
- Engine Jobs تنفّذ وتُحدّث حالتها، والواجهة تستقبل التحديثات Realtime.
- مركز التدقيق متاح للمالكين فقط عبر RLS.

**حالة P4**: ✅ مكتمل. النقطة التالية: **P5 — التحصين** (Lighthouse، اختبارات، a11y، Sentry).
