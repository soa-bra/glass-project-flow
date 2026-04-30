# خطة بناء التوثيق الجديد لمشروع SoaBra من الصفر

## الهدف
إيقاف الاعتماد على الوثيقة التوصيفية القديمة، وبناء **4 وثائق جديدة** مبنيّة على فحص الكود الفعلي للمستودع `glass-project-flow`، بدون أي تعديل على الوثيقة القديمة وبدون أي تعديل على الملفات التنفيذية.

---

## ما تم اكتشافه من فحص أوّلي للكود (ملخّص يبرّر الخطة)

- **التقنيات الفعلية** (`package.json`): React 18 + Vite 8 + TypeScript 5.5 + Tailwind 3 + Zustand 5 + React Query + Supabase JS + Zod + Framer Motion 12 + Recharts/Chart.js + DnD-Kit + jspdf/xlsx + pino + prom-client + OpenTelemetry. **لا يوجد Node.js API منفصل**، الـ backend هو Supabase فقط.
- **مساحات العمل الفعلية** (`MainContent.tsx`): `projects` (افتراضي) + `departments` + `planning` + `archive` + `settings`. التنقّل عبر `NavigationContext`.
- **Projects Workspace**: يعتمد كليًّا على `mockProjects` (in-memory `useState`) + `ProjectTasksContext` + `ProjectManagementBoard` + `OperationsBoard`. **لا ربط حقيقي بقاعدة البيانات** للمشاريع رغم وجود جدول `projects` في Supabase.
- **Departments Workspace**: شريط جانبي + لوحة `DepartmentPanel`. أقسام موجودة فعليًا: `Brand, CRM, CSR, Financial, HR, KMPA, Legal, Marketing, Templates, Training` + `GeneralOverview, Reports, Templates`.
- **Planning Workspace**: بنية ناضجة تحت `src/features/planning/` (FSD): `ui/{panels,toolbars,widgets,overlays}` + `canvas/` + `elements/{mindmap,diagram,text,smart,smart-doc,shared}` + `domain/{commands,policies,selectors,types}` + `state/{slices,history,transactions,store}` + `integration/{collaboration,persistence,export,telemetry,accessibility}`. **هذا هو الجزء الأكثر اكتمالًا**.
- **Engine Microkernel** (`src/engine/canvas/`): kernel + graph + spatial + history + interaction + io + rendering + routing + collaboration + voice + transform + math + events. **بنية موجودة ومُختبرة**.
- **Supabase Migrations** (7 ملفات):
  - جداول حقيقية: `boards, board_objects, board_permissions, board_invite_links, board_join_requests, links, op_log, snapshots, smart_element_data, projects, project_phases, project_tasks, invoices, invoice_items, invoice_payments, telemetry_events, ai_command_traces`.
  - **migration حديثة جدًا** `20260430090000_central_integration_data_model.sql` تُعرّف نموذج مركزي جديد (`boards, departments, projects, tasks, tools, engine_jobs, dependencies, project_cards, task_cards, task_tool_engine_links, department_projects`) مع `central_state` enum. **لكن لا يوجد كود Frontend يستخدمه بعد** — هذا قلب المعمارية المستهدفة.
- **RBAC الفعلي**: محدود جدًا. فقط `board_role` enum (`host/editor/viewer`) + `user_has_board_role()` RPC + `evaluateCommandAuthorization` لأمر واحد فقط (`canvas.smart-elements.generate`). **لا يوجد RBAC/ABAC شامل** كما في الوثيقة القديمة.
- **Audit**: `auditService` (`src/services/audit.ts`) + جدول `op_log` + `ai_command_traces` + `telemetry_events`. **جزئي**.
- **Event Bus**: `prisma/V2.prisma.additions.txt` يُعرّف `EventOutbox` و `EventDLQ` و `FeatureStore` — لكن **لا يوجد Prisma client مُفعَّل**، فقط ملف نصّي `.txt`. الكود يستخدم `src/shared/events/` (in-process emitter + handlers).
- **Mock Data**: `mockProjects.ts`, `OperationsBoard/mockData.ts`, `kv_store_*` tables (5 جداول مفاتيح/قيم).

---

## المخرجات (4 ملفات Markdown جديدة فقط)

### 1) `docs/CURRENT_SYSTEM_SPECIFICATION.md`
وصف الواقع الحالي **فقط** بناءً على الكود، بالأقسام المطلوبة:
- **A. System Overview**: تعريف النظام كـ React SPA + Supabase backend، 5 مساحات عمل، حالة الاكتمال لكل مساحة.
- **B. Application Structure**: شجرة `MainContent → Workspaces → Sidebar` + علاقة `NavigationContext`.
- **C. Current Domains**: Projects (Mock), Departments (UI + بعض الخدمات), Planning (Implemented), Archive (UI), Settings (UI), Collaboration (Implemented داخل Planning), Permissions (Partial — board-level only), Files (Partial — bucket موجود), Audit (Partial), Events (in-process Partial), AI/Smart Elements (Implemented داخل Planning + ai_command_traces table).
- **D. Planning Module**: الكانفاس + الأدوات (`selection, smart_pen, sticky, text, file_uploader, shapes, mindmap, smart_element, research, frame, smart_doc`) + `PlanningCommandDeck` + `collaborationStore` + سياسة `evaluateCommandAuthorization` (أمر واحد فقط).
- **E. Permissions**: فقط `board_role` (host/editor/viewer) + `user_has_board_role()` + RLS على جداول boards. **لا RBAC/ABAC شامل**.
- **F. Data Model**: جدول لكل كيان مع تصنيف Implemented/Partial/Mock/Planned/Unknown ومصدره (types/store/migration).
- **G. Backend/Infrastructure**: Supabase (DB + Storage `make-7c857198-whiteboard`, `board-assets` + Edge Functions config) + `infra/{logger,metrics,tracing}` + سكربتات `ExportRunner, outbox-relay, replay-events`.
- **H. Design System**: tokens من `project-knowledge` (IBM Plex Sans Arabic + ألوان + glass + radii) + `tailwind.config.ts` + مكونات `ui/` و `shared/`.
- **I. Current Limitations**: قائمة صريحة (Projects على mock, لا RBAC شامل, Prisma غير مُفعَّل, central data model غير مستخدم في UI, إلخ).
- **J. Evidence Map**: لكل ادّعاء → مسار الملف الداعم.

### 2) `docs/LEGACY_SPEC_AUDIT.md`
مراجعة الوثيقة القديمة بنود البنود، مع تصنيف كل بند:
- **Accurate**: مثل الـ Design Tokens، فلسفة RTL-first، استخدام Supabase.
- **Partially Accurate**: مثل التكاملات بين الوحدات (موجودة جزئيًا)، Audit (جزئي).
- **Outdated**: ذكر Node.js API، Identity & RBAC Service، microservices/Kubernetes/Istio، gRPC.
- **Planned/Vision**: نظام RBAC/ABAC الكامل بـ 18 دور، JIT, Break-Glass, SoD Matrix, Access Review Campaigns, SCIM, KMS rotation.
- **Unsupported**: AI Gateway موصّلات، SIEM/SOC integration، PagerDuty.
- **Conflicting**: الفصل بين Owner/CISO/DPO/Infra Admin غير منفّذ — الواقع هو host/editor/viewer فقط.

كل بند: نص مختصر + تصنيف + سبب + ملفات دالّة (إن وُجدت).

### 3) `docs/TARGET_ARCHITECTURE_SPECIFICATION.md`
وصف المعمارية المستهدفة بناءً على نموذج المستخدم + migration الموجودة `20260430090000_central_integration_data_model.sql`:
- الكيانات: **Board, Department, Project, Task, Tool, Engine Job, Dependency, State** (مع mapping لكل enum/جدول من الـ migration).
- العلاقات الـ 10 المطلوبة (Board⊃Tools, Department⊃Projects, Project⊃Tasks, Task→Tool, Task→EngineJob, Task↔Tool↔EngineJob, Tool↔EngineJob, Dependency, State).
- مخطط ASCII للعلاقات.
- States القانونية لكل كيان (`central_state` enum: draft/planned/active/blocked/paused/completed/cancelled/archived/failed).
- ملاحظة صريحة: هذه **معمارية مستهدفة** لا تعكس الواقع الحالي للـ UI.

### 4) `docs/MIGRATION_PLAN.md`
خطة 5 مراحل من الواقع إلى المستهدف:
- **Phase 1 — Stabilization**: ربط المخرجات الـ 3 السابقة + قائمة ملفات حرجة + قائمة mock data + قائمة تعارضات.
- **Phase 2 — Central Data Model**: إنشاء `src/types/central/` مطابقة للـ migration + خدمات قراءة/كتابة عبر Supabase client + **بدون أي UI جديد**.
- **Phase 3 — Access Control Model**: توسيع `board_role` إلى نموذج موحّد (Owner/Manager/Member/Viewer/Guest) + ربط الصلاحيات بالكيانات المركزية + توسيع `auditService` لتغطية الأوامر الحساسة.
- **Phase 4 — Workspace Integration**: ربط `ProjectWorkspace` بجدول `projects` الفعلي (إزالة mock)، ربط `Departments` بـ `departments` + `department_projects`، ربط `Planning boards` بـ `boards` + `tools`، ربط `Tasks` بـ `tasks` + `task_tool_engine_links`.
- **Phase 5 — UI/Feature Expansion**: بناء الواجهات الجديدة بعد اكتمال النموذج.

---

## ضوابط التنفيذ (قواعد صارمة)
- لا تعديل على الوثيقة القديمة `glass-project-flow/الوثيقة التوصيفية الشاملة...md`.
- لا تعديل على أي ملف `.ts/.tsx/.sql/.json` تنفيذي.
- لا إنشاء واجهات أو ميزات جديدة.
- كل ادّعاء في `CURRENT_SYSTEM_SPECIFICATION` يُربط بـ Evidence Map (مسار ملف).
- كل بند مصنّف Implemented/Partial/Mock/Planned/Unknown.
- اللغة: عربية للوصف + إنجليزية للمصطلحات والمسارات.

---

## المخرجات النهائية في رسالة الإغلاق
- قائمة الملفات الـ 4 الجديدة.
- ملخّص أهم 10 اكتشافات عن الواقع.
- أهم 5 فروقات بين الوثيقة القديمة والكود.
- أهم 5 مخاطر مستقبلية.
- توصية الخطوة التالية (المرشّح: البدء بـ Phase 2 — توليد types من migration المركزية).
- الافتراضات + الأجزاء التي تحتاج مراجعة بشرية (مثل: هل migration `20260430090000` مُعتمدة فعليًا أم تجريبية؟).

---

## النطاق الزمني المتوقّع
4 ملفات Markdown، إجمالي ~50–80KB. لا تنفيذ كود، فقط قراءة + كتابة توثيق. عملية واحدة في default mode بعد الموافقة.
