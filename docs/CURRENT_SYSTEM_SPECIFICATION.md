# CURRENT SYSTEM SPECIFICATION — SoaBra (Glass Project Flow)

> **النطاق:** هذه الوثيقة تصف **الواقع الحالي فقط** كما هو مُثبَت في الكود الحالي للمستودع. لا تحتوي أي رؤية مستقبلية أو نوايا غير منفّذة.
>
> **اللغة:** الوصف بالعربية، المصطلحات والمسارات بالإنجليزية.
>
> **مستويات الاكتمال المستخدمة:**
> - `Implemented` — موجود في الكود ويعمل فعليًا.
> - `Partial` — موجود جزئيًا أو يعمل في حالات محدودة.
> - `Mock` — موجود كواجهة تستخدم بيانات وهمية في الذاكرة فقط.
> - `Planned` — هيكل/ملف موجود لكن لم يُفعَّل في التطبيق.
> - `Unknown` — يحتاج مراجعة بشرية.

---

## A. System Overview — نظرة عامة على النظام

**هوية النظام:** تطبيق ويب أحادي الصفحة (SPA) باللغة العربية يعمل من اليمين إلى اليسار (RTL-first) مبني على React 18 + Vite 8، يستخدم Supabase كـ backend وحيد (قاعدة بيانات + تخزين + Edge Functions + Realtime).

**التقنيات الأساسية الفعلية** (من `package.json`):
- **Framework:** React 18.3.1 + Vite 8 + TypeScript 5.5.3
- **Styling:** Tailwind 3.4.11 + tailwindcss-animate + IBM Plex Sans Arabic
- **State:** Zustand 5 + React Query 5 + React Context
- **Backend Client:** `@supabase/supabase-js` 2.52
- **Validation:** Zod 3.23
- **Animation:** Framer Motion 12
- **Charts:** Recharts 2.12 + Chart.js 4.5
- **Drag & Drop:** `@dnd-kit/*` + `@hello-pangea/dnd`
- **Files/Export:** jspdf, xlsx, file-saver
- **AI (in-browser):** `@huggingface/transformers` 3.6
- **Observability:** pino, prom-client, OpenTelemetry SDK
- **Testing:** Vitest + Testing Library

**ملاحظة حاسمة:** **لا يوجد Node.js API server منفصل** في المستودع. أي إشارة في الوثيقة القديمة إلى `Node.js API` أو `microservices` غير منطبقة.

**مساحات العمل الخمس** (`src/components/MainContent.tsx`):
| Workspace | الملف | حالة الاكتمال |
|---|---|---|
| Projects (افتراضي) | `ProjectWorkspace.tsx` | `Mock` — يستخدم `mockProjects` |
| Departments | `DepartmentsWorkspace.tsx` | `Partial` — UI كامل، خدمات جزئية |
| Planning | `PlanningWorkspace.tsx` | `Implemented` — الأكثر اكتمالًا |
| Archive | `ArchiveWorkspace.tsx` | `Partial` — UI فقط |
| Settings | `SettingsWorkspace.tsx` | `Partial` — UI فقط |

---

## B. Application Structure — بنية التطبيق

```
App.tsx
└── Index (Page)
    └── MainContent.tsx
        ├── Sidebar (ثابت يسارًا فعليًا = ابتداءً منطقيًا في RTL)
        └── Workspace (متبدّل حسب activeSection)
            ├── ProjectWorkspace
            │   ├── ProjectsColumn (قائمة)
            │   ├── OperationsBoard (لوحة عمليات بـ 7 تبويبات)
            │   └── ProjectManagementBoard (لوح تفاصيل المشروع)
            ├── DepartmentsWorkspace
            │   ├── DepartmentsSidebar
            │   └── DepartmentPanel (يعرض DepartmentTabs)
            ├── PlanningWorkspace
            │   ├── PlanningEntryScreen (شاشة دخول)
            │   └── PlanningCanvas (الكانفاس بكامل أدواته)
            ├── ArchiveWorkspace
            │   ├── ArchiveSidebar
            │   └── ArchivePanel/CategoryRenderer
            └── SettingsWorkspace
                ├── SettingsSidebar
                └── SettingsPanel
```

**نظام التنقّل:** `NavigationContext` (`src/contexts/NavigationContext.tsx`) يحفظ `activeSection` و `selectedDepartment`. لا يوجد تنقّل URL متعدّد المسارات في الكود الحالي خلاف `/`, `/join/:token` (board invite), و `*` (NotFound).

**الشريط الجانبي (`Sidebar.tsx`):** يقدّم خمسة أزرار للمساحات الخمس. يدعم وضع `collapsed/expanded` ويُجبَر على `collapsed` تلقائيًا داخل مساحة Planning (راجع `MainContent.tsx`).

**فصل المساحات:** كل Workspace مستقل تمامًا، يستخدم سياقه الخاص (`ProjectTasksProvider`, `NavigationContext`)، ولا يوجد تدفّق بيانات مشترك بينها في الواقع الحالي.

---

## C. Current Domains — النطاقات الحالية

### C.1 Projects — `Mock`
- **مصدر البيانات:** `src/data/mockProjects.ts` يُحمَّل في `useState` داخل `ProjectWorkspace.tsx`.
- **العمليات:** إضافة/تحديث/فلترة/ترتيب — كلها in-memory، تختفي عند تحديث الصفحة.
- **جدول `projects` في Supabase موجود لكن غير مستخدم من الـ UI** (راجع F).

### C.2 Departments — `Partial`
- **الأقسام الموجودة فعليًا** (`src/components/DepartmentTabs/`):
  `Brand, CRM, CSR, Financial, HR, KMPA, Legal, Marketing, Templates, Training` + التبويبات الأفقية: `GeneralOverview, Reports, Templates`.
- **خدمات الواجهة:** `src/modules/{contract,crm,expense,hr,hr-lite,invoice,kb,surveys}/*.service.ts` + `src/api/{contracts,crm,expenses,invoices}/*.ts`.
- **حالات الاتصال بقاعدة البيانات:**
  - **Invoices:** `Implemented` — جداول حقيقية `invoices, invoice_items, invoice_payments` + RLS + triggers.
  - باقي الأقسام: `Mock` — تستخدم بيانات محلية (راجع `OperationsBoard/mockData.ts` ومخازن داخلية).

### C.3 Planning — `Implemented` (الأكثر اكتمالًا)
- مفصّل في القسم D.

### C.4 Archive — `Partial`
- `ArchiveWorkspace + ArchiveSidebar + ArchivePanel/CategoryRenderer + CategoryPanelFactory` — UI فقط، لا اتصال بمصدر بيانات حقيقي للأرشيف.

### C.5 Settings — `Partial`
- `SettingsWorkspace + SettingsSidebar + SettingsPanel/*` — UI تنقّل بين تبويبات.

### C.6 Collaboration — `Implemented` (داخل Planning فقط)
- `src/stores/collaborationStore.ts`: مشاركون + تعليقات + حالة صوت.
- `src/features/planning/integration/collaboration/RealtimeSyncManager.tsx`.
- `src/engine/canvas/collaboration/collaborationEngine.ts` + `webrtcVoice.ts`.
- جداول Supabase: `boards, board_objects, board_permissions, board_invite_links, board_join_requests, snapshots, links, op_log, smart_element_data`.
- صفحة `JoinBoardPage` على المسار `/join/:token` تستخدم RPC الآمن `validate_board_invite_token`.

### C.7 Permissions — `Partial`
- مفصّل في القسم E.

### C.8 Files / Storage — `Partial`
- Buckets في Supabase: `make-7c857198-whiteboard`, `board-assets` (كلاهما خاص).
- `src/hooks/useFileUpload.ts` + `useProjectFiles.ts` + `services/projectFilesService.ts`.

### C.9 Audit — `Mock` (هام)
- `src/services/audit.ts` — **استدلال صريح في الكود:** يحفظ في مصفوفة JS داخلية (`mockAuditEvents`) مع تعليق `Mock implementation - replace with actual API calls when Supabase is integrated`.
- جدول `op_log` موجود في Supabase ويستخدمه نظام Realtime collaboration على مستوى السبورة، لكن **`auditService` في الـ Frontend لا يكتب فيه**.
- جدول `ai_command_traces` موجود ومُفعَّل بـ RLS.
- جدول `telemetry_events` موجود ومُفعَّل بـ RLS.

### C.10 Events — `Partial` (in-process فقط)
- `src/shared/events/`: `emitter.ts` + `validation.ts` (Zod) + `contracts.ts` + `handlers/*` (cultural, hr, project, webhook).
- `src/engine/canvas/events/catalog.yml` — كتالوج YAML بأكثر من 20 حدثًا (CulturalImpactMeasured, BrandIdentityUpdated, ProjectCreated, …).
- **لا يوجد Outbox/DLQ مُفعَّل في قاعدة البيانات.** النموذج معرّف فقط في `prisma/V2.prisma.additions.txt` (ملف نصّي، Prisma غير مُفعَّل في المشروع).
- سكربتات `scripts/outbox-relay.ts` + `scripts/replay-events.ts` موجودة كأدوات سطر أوامر منفصلة.

### C.11 AI / Smart Elements — `Implemented` (داخل Planning)
- `src/features/planning/elements/smart/` + `src/stores/smartElementsStore.ts` بمعمارية Contract-First (Zod schemas).
- أنواع: Kanban, Voting, Brainstorm, Timeline, Matrix, Gantt, MindMap, Sheet, AISuggestion.
- Edge Function وحيدة: `supabase/functions/smart-elements-ai` (`verify_jwt = false`).
- جدول `smart_element_data` + `ai_command_traces`.
- `src/hooks/useSmartElementAI.ts` + `src/services/aiAnalysis.ts` + `src/lib/api/smart-elements.ts`.
- مفتاح `LOVABLE_API_KEY` و `OPENAI_API_KEY` متوفّران كـ secrets.

---

## D. Planning Module — وحدة التخطيط الحالية

### D.1 Canvas Engine (`src/engine/canvas/`)
بنية Microkernel مكتملة:
- `kernel/canvasKernel.ts` — النواة.
- `graph/canvasGraph.ts` — الرسم البياني للعناصر.
- `spatial/spatialIndex.ts` — فهرس مكاني للأداء.
- `history/historyManager.ts` — Undo/Redo.
- `interaction/{interactionStateMachine,selectionCoordinator}.ts` — آلة حالة التفاعل.
- `io/{exportEngine,importEngine,parsers/{figma,miro},validators}` — استيراد/تصدير.
- `rendering/gridRenderer.ts`.
- `routing/connectorRouter.ts` — مسارات الموصّلات.
- `collaboration/collaborationEngine.ts`.
- `voice/webrtcVoice.ts` — صوت WebRTC.
- `transform/operationalTransform.ts` — OT للتزامن.
- `math/snapEngine.ts` — محرك الالتقاط.
- `events/{eventPipeline,catalog.yml}`.

### D.2 الأدوات الفعلية (`ToolId` في `src/features/planning/state/types.ts`)
```
selection_tool, smart_pen, sticky_tool, text_tool, file_uploader,
shapes_tool, mindmap_tool, smart_element_tool, research_tool,
frame_tool, smart_doc_tool
```

### D.3 العناصر الذكية الفعلية (`src/features/planning/elements/`)
- `mindmap/` — خرائط ذهنية بموصّلات ديناميكية.
- `diagram/` — Visual Diagrams.
- `text/` — نص بدعم RTL/LTR وSVG/foreignObject.
- `smart/` — Kanban, Voting, Brainstorm, Timeline, Matrix, Gantt, Sheet.
- `smart-doc/` — مستندات ذكية مع SmartDocRenderer.
- `shared/` — مكوّنات مشتركة.

### D.4 شريط الأوامر الذكي
- `src/features/planning/ui/PlanningCommandDeck.tsx` — Smart Command Bar.
- `src/features/planning/ui/widgets/{AIAssistantButton,AIAssistantPopover}.tsx`.

### D.5 Collaboration Store
- `src/stores/collaborationStore.ts` — مشاركون، تعليقات، صوت.
- `src/features/planning/integration/collaboration/RealtimeSyncManager.tsx`.

### D.6 السياسات والتفويضات
- **سياسة واحدة فقط منفّذة فعليًا:** `src/features/planning/domain/policies/authorization.ts` تغطي الأمر `canvas.smart-elements.generate`.
  - الأدوار المعرّفة: `host | editor | viewer | guest | system`.
  - قيود ABAC: `boardStatus, boardOwnerId, source, generatedElementCount, isTrustedSession`.
  - حدّ صلب: `SMART_ELEMENT_LIMIT_PER_COMMAND = 50`.
  - تكتب نتيجة القرار إلى `auditService` (وهي Mock — راجع C.9).
- **لا توجد سياسات أخرى** لأي أمر آخر في النظام.

### D.7 State Slices (`src/features/planning/state/slices/`)
`elementsSlice, frameSlice, historySlice, layersSlice, mindmapSlice, penSlice, selectionSlice, toolsSlice, viewportSlice` + `transactions/` + `history/` + `helpers.ts` + `elementsIntegrity.ts`.

### D.8 حدود الموجود مقارنة بالوثيقة القديمة
- لا يوجد "نظام موافقات متدرّج" في Planning.
- لا يوجد JIT/Break-Glass.
- لا يوجد ربط حقيقي بسجل تدقيق دائم على جانب الـ UI.

---

## E. Permissions and Access Control — الصلاحيات

### E.1 الأدوار الموجودة فعليًا في الكود
- **على مستوى السبورة (Supabase enum `board_role`):** `host | editor | viewer`.
- **على مستوى أمر Smart Elements (TS only):** `host | editor | viewer | guest | system` (داخل `authorization.ts`).
- **في `collaborationStore`:** `host | editor | viewer`.

### E.2 RPCs الموجودة
- `get_user_board_role(board_id, user_id)` — يُرجع دور المستخدم.
- `user_has_board_role(board_id, user_id, min_role)` — يتحقق من حد أدنى.
- `validate_board_invite_token(token_input)` — تحقق آمن من الدعوات.

### E.3 سياسات Supabase RLS
- مفعّلة على الجداول التالية: `boards, board_objects, board_permissions, board_invite_links, board_join_requests, links, op_log, snapshots, smart_element_data, projects, project_phases, project_tasks, invoices, invoice_items, invoice_payments, telemetry_events, ai_command_traces, kv_store_*`.
- النمط السائد: **ownership-based** (`auth.uid() = owner_id`) أو **board-role-based** (`user_has_board_role(...)`).

### E.4 ABAC
- موجود **فقط** داخل `evaluateCommandAuthorization` لأمر `canvas.smart-elements.generate`. لا توجد طبقة ABAC عامة.

### E.5 RBAC
- موجود **فقط** على مستوى السبورة بثلاثة أدوار. **لا يوجد RBAC مؤسّسي شامل** (لا أدوار Owner/CISO/DPO/Finance/HR/… كما تذكر الوثيقة القديمة).

### E.6 Audit Logging
- `Mock` على جانب الـ UI (راجع C.9).
- جداول قاعدة البيانات `op_log + ai_command_traces + telemetry_events` تستقبل بيانات لكن **لا يوجد قارئ مركزي للتدقيق** في الواجهة.

### E.7 واجهات الصلاحيات
- `src/components/custom/PermissionsModal.tsx` — modal واجهة فقط، لا تربط بنظام صلاحيات شامل.

---

## F. Data Model — نموذج البيانات الحالي

### F.1 جداول Supabase الموجودة فعليًا (من Migrations + Schema)

| الجدول | الحالة | الملاحظة |
|---|---|---|
| `boards` | `Implemented` | يستخدم في Planning |
| `board_objects` | `Implemented` | عناصر الكانفاس |
| `board_permissions` | `Implemented` | RBAC على مستوى السبورة |
| `board_invite_links` | `Implemented` | دعوات موقتة |
| `board_join_requests` | `Implemented` | طلبات انضمام |
| `links` | `Implemented` | روابط بين العناصر |
| `op_log` | `Implemented` | سجل عمليات الكانفاس (مكتوب من Realtime) |
| `snapshots` | `Implemented` | نسخ احتياطية للسبورات |
| `smart_element_data` | `Implemented` | بيانات العناصر الذكية |
| `projects` | `Partial` | الجدول موجود لكن **الـ UI يستخدم mock** |
| `project_phases` | `Partial` | جدول موجود، استخدام محدود |
| `project_tasks` | `Partial` | جدول موجود، استخدام محدود |
| `invoices` | `Implemented` | كامل بـ triggers لتوليد الأرقام والإجماليات |
| `invoice_items` | `Implemented` | |
| `invoice_payments` | `Implemented` | |
| `telemetry_events` | `Implemented` | جدول مع RLS |
| `ai_command_traces` | `Implemented` | لتتبع أوامر الذكاء الاصطناعي |
| `kv_store_06871a1a/4c8546af/7c857198/7e6493e3/8cde9397` | `Implemented` | جداول KV عامة لكل مستخدم مصادق |
| **Central Integration Model** (`boards, departments, projects, tasks, tools, engine_jobs, dependencies, project_cards, task_cards, task_tool_engine_links, department_projects`) | `Planned` | **migration `20260430090000` موجودة في DB لكن لا كود Frontend يستخدمها** |

### F.2 Types في `src/types/`
- `canvas, canvas-elements, canvas-events, canvas-hooks, canvas-ai-tools, canvas-component-props, enhanced-canvas, mindmap-canvas, visual-diagram-canvas` → كلها `Implemented` (للكانفاس).
- `arrow-connections, kanban` → `Implemented`.
- `audit, approvals` → `Partial` (تستخدمها Mock services).
- `task, project` → `Implemented` (للـ UI الحالي).
- `smart-elements` → `Implemented` (Zod schemas).

### F.3 Stores (Zustand) في `src/stores/`
- `canvasStore, planningStore` → `Implemented` (alias لنفس المتجر).
- `interactionStore, smartElementsStore, collaborationStore, partnersStore, graphStore` → `Implemented`.

### F.4 Prisma — `Planned` فقط
- `prisma/V2.prisma.additions.txt` ملف نصّي (.txt) يعرّف `EventOutbox, EventDLQ, FeatureNamespace, FeatureRow`.
- **لا يوجد `prisma/schema.prisma`** ولا Prisma client. هذه نوايا مستقبلية.

---

## G. Backend / Infrastructure — البنية الخلفية

### G.1 Supabase
- **Project ref:** `zdqkrrehlivayconjcgm` (`supabase/config.toml`).
- **Database:** Postgres + extensions (`pg_trgm`).
- **Storage Buckets:** `make-7c857198-whiteboard` (private), `board-assets` (private).
- **Edge Functions:** `smart-elements-ai` فقط (`verify_jwt = false`).
- **Migrations:** 7 ملفات في `supabase/migrations/` (آخرها `20260430090000_central_integration_data_model.sql`).
- **Secrets المتوفرة:** `LOVABLE_API_KEY, OPENAI_API_KEY, SUPABASE_*`.

### G.2 Observability (`src/infra/`)
- `logger.ts` — pino.
- `metrics.ts` — prom-client.
- `tracing.ts` — OpenTelemetry SDK Node.

### G.3 سكربتات تشغيل (`scripts/`)
- `ExportRunner.ts` — تشغيل تصدير دفعي.
- `outbox-relay.ts` — مرحّل outbox (يفترض جدول outbox غير مُفعَّل).
- `replay-events.ts` — إعادة تشغيل أحداث.
- `setup-husky.sh` — إعداد git hooks.

### G.4 Workers
- `src/workers/{exportWorker,fileProcessor.worker,importWorker,snapWorker}.ts` — Web Workers للأداء.

### G.5 الاختبارات
- Vitest + Testing Library.
- مجموعات: `src/__tests__/{integration,performance,stores}/*` + اختبارات بجوار المكوّنات (`*.test.ts/x`).
- CI: `.github/workflows/pr-checks.yml`.

---

## H. Design System — نظام التصميم الحالي

### H.1 Tokens (مُعرَّفة في `index.css` + `tailwind.config.ts`)
- **Font:** IBM Plex Sans Arabic (RTL-first).
- **Surfaces:**
  - أسطح ثابتة (Static): أبيض عالي التباين، حدود رمادية، نصف قطر **24px** (`AppCardSurface`). **ممنوع glassmorphism** على الأسطح الثابتة.
  - الـ Overlays/Modals: glassmorphism مسموح حصرًا عبر فئات قانونية مثل `sb-modal-shell`.
- **Layout Grid:** سبورات بـ 12 عمود (`AppDashboardGrid` مع `dir="rtl"`).
- **RTL:** خصائص CSS منطقية (`ps-*, pe-*, start-*`).

### H.2 مكوّنات UI الأساسية (`src/components/ui/`)
shadcn/ui القياسية (Button, Card, Dialog, Tabs, Toast, Tooltip, …) + إضافات: `penToolbar/`.

### H.3 مكتبة Visual Data (`src/components/shared/`)
10 primitives موحّدة لجميع بطاقات التحليلات (NumericStatCard, DataCardFrame, ChartTooltipShell, …).

### H.4 مكتبات التبويبات والبطاقات
- `OperationsBoard/` — 7 تبويبات للعمليات.
- `DepartmentTabs/` — تبويبات الأقسام.
- `ProjectCard/` — بطاقة المشروع متعدّدة الأجزاء.
- `TaskCard/` — بطاقة المهمة.

### H.5 Storybook
- قصص محدودة في `src/stories/` (BaseBadge, BaseBox, BaseListItem, BasePageHeader, BaseSearchBar, BaseStatsCard).

---

## I. Current Limitations — القيود والفجوات الحالية

| # | الفجوة | الأثر |
|---|---|---|
| 1 | `ProjectWorkspace` يعتمد كليًا على `mockProjects` رغم وجود جدول `projects` حقيقي | لا استمرار للبيانات، لا تعدّد مستخدمين |
| 2 | `Central Integration Data Model` (boards/departments/tasks/tools/engine_jobs) موجود في DB **بدون أي ربط من الـ Frontend** | المعمارية المستهدفة غير مُفعَّلة |
| 3 | `AuditService` Mock بالكامل | لا تدقيق فعلي رغم وجود الجداول |
| 4 | Event Outbox/DLQ معرّف في ملف `.txt` فقط | لا توجد ضمانات تسليم للأحداث |
| 5 | RBAC محدود بثلاثة أدوار على مستوى السبورة فقط | لا أدوار مؤسسية (Owner/Manager/Finance/…) |
| 6 | لا توجد سياسة تفويض شاملة، فقط لأمر Smart Elements | باقي الأوامر الحساسة بدون حماية متعدّدة الطبقات |
| 7 | OperationsBoard يعرض `mockData` للتبويبات الستة (HR, Finance, Legal, Marketing, Clients, Reports) | البيانات تجميلية |
| 8 | Departments تستخدم خدمات محلية بدون استمرار (عدا Invoices) | فقدان البيانات عند إعادة التحميل |
| 9 | Archive و Settings UI فقط بدون مصدر بيانات | غير وظيفية |
| 10 | لا نظام صلاحيات على مستوى الإدارات/المشاريع/المهام | كل شيء مفتوح للمستخدم المصادق |
| 11 | `useState` كثير على مستوى Workspace بدون React Query أو متجر مركزي للبيانات | خلط بين بيانات UI وبيانات Domain |
| 12 | تكرار في types: `src/types.ts + src/types/{project,task}.ts + ProjectData/Project` | عدم اتساق مفاهيمي |

---

## J. Evidence Map — خريطة الأدلة

| الادّعاء | الملفات الداعمة |
|---|---|
| 5 مساحات عمل | `src/components/MainContent.tsx` |
| Projects على Mock | `src/components/ProjectWorkspace.tsx`, `src/data/mockProjects.ts` |
| Departments بـ 10 أقسام | `src/components/DepartmentTabs/{Brand,CRM,CSR,Financial,HR,KMPA,Legal,Marketing,Templates,Training}/` |
| Planning بنية ناضجة | `src/features/planning/{ui,canvas,elements,domain,state,integration}/` |
| Engine Microkernel | `src/engine/canvas/{kernel,graph,spatial,history,interaction,io,rendering,routing,collaboration,voice,transform,math,events}/` |
| سياسة وحيدة | `src/features/planning/domain/policies/authorization.ts` |
| board_role 3 أدوار | `supabase/migrations/*` (enum), `src/stores/collaborationStore.ts` |
| Audit Mock | `src/services/audit.ts` (تعليق صريح في الكود) |
| Central Data Model | `supabase/migrations/20260430090000_central_integration_data_model.sql` |
| AI Command Traces | `supabase/migrations/20260428120000_add_ai_command_traces.sql`, `src/lib/api/smart-elements.ts` |
| Edge Function وحيدة | `supabase/config.toml`, `supabase/functions/smart-elements-ai/` |
| Prisma غير مُفعَّل | `prisma/V2.prisma.additions.txt` (لاحظ امتداد `.txt`) |
| Event Catalog | `src/engine/canvas/events/catalog.yml` |
| Realtime Collaboration | `src/features/planning/integration/collaboration/RealtimeSyncManager.tsx` |
| WebRTC Voice | `src/engine/canvas/voice/webrtcVoice.ts` |
| Smart Elements بـ Zod | `src/types/smart-elements.ts`, `src/stores/smartElementsStore.ts` |
| Invoices مكتمل | `supabase/migrations/*` (triggers `calculate_invoice_total`, `generate_invoice_number`) |
| Storage buckets | Supabase config (`make-7c857198-whiteboard`, `board-assets`) |
| Observability | `src/infra/{logger,metrics,tracing}.ts` |
| Workers | `src/workers/*.ts` |
| Permissions Modal | `src/components/custom/PermissionsModal.tsx` |
