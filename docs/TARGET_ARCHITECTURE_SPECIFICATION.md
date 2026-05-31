# TARGET ARCHITECTURE SPECIFICATION — المعمارية المستهدفة

> **هذه الوثيقة تصف المعمارية المستهدفة، لا الواقع الحالي.**
>
> الواقع الحالي مغطّى في `CURRENT_SYSTEM_SPECIFICATION.md`. خطة الانتقال في `MIGRATION_PLAN.md`.
>
> الجداول الأساسية للمعمارية المستهدفة **موجودة بالفعل في قاعدة البيانات** عبر migration `supabase/migrations/20260430090000_central_integration_data_model.sql`، لكنها **غير مرتبطة بأي UI بعد**. هذه الوثيقة تشرح النموذج المنشود واستخدامه.

---

## 1. الكيانات الأساسية (Core Entities)

### 1.1 Board — السبورة/المجال
- **التعريف:** حاوية أو قسم مخصّص لوظيفة رئيسية داخل النظام (مثل: لوحة تخطيط، لوحة عمليات، لوحة CRM).
- **ليس مشروعًا**، وليس مبادرة.
- **يجمع** بداخله الأدوات (`Tools`) المرتبطة بهذه الوظيفة.
- **الجدول المقابل:** `boards (id, name, code, description, state, owner_id, priority, metadata)`.

### 1.2 Department — الإدارة
- **التعريف:** جهة ملكية ومسؤولية تشغيلية أو إدارية.
- **الإدارة لا تساوي المشروع.** الإدارة تملك أو تشرف على عدّة مشاريع.
- **الجدول المقابل:** `departments (id, name, code, description, state, owner_id, priority, metadata)`.
- **جدول العلاقة:** `department_projects (department_id, project_id, role: owner|supervisor)`.

### 1.3 Project — المشروع
- **التعريف:** مسار تنفيذ واضح له هدف، نطاق، مدة، ومسؤول.
- **يتكون من** عدّة `Tasks`.
- **الجدول المقابل:** `projects (id, name, description, state, owner_id, priority, start_date, due_date, budget, metadata)`.

### 1.4 Task — المهمة
- **التعريف:** أصغر وحدة عمل عملية داخل النظام.
- **وحدة التحليل الأساسية** لحجم المشروع، مدته، تكلفته، تعقيده، حجم الفريق، والاعتماديات.
- **الجدول المقابل:** `tasks (id, linked_project_id, name, description, state, owner_id, assignee_id, priority, estimated_duration, estimated_cost, complexity, required_team_size, start_date, due_date, actual_duration, actual_cost, metadata)`.
- **قيود محسوبة:** `estimated_duration ≥ 0`, `estimated_cost ≥ 0`, `required_team_size > 0`.

### 1.5 Tool — الأداة
- **التعريف:** أداة أو وظيفة أو قدرة داخل النظام.
- **غالبًا** تكون داخل `Board`، وقد ترتبط بـ `Task` أو `Engine Job`.
- **الجدول المقابل:** `tools (id, board_id, produced_by_task_id, name, description, kind, state, owner_id, priority, metadata)`.
- **أنواع الأدوات (`tool_kind`):** `board_widget | dashboard_panel | workflow_tool | analysis_tool | integration_tool`.

### 1.6 Engine Job — مهمة المحرك
- **التعريف:** عملية خلفية، أتمتة، منطق تنفيذي، معالجة بيانات، أو وظيفة عميقة تعمل خلف الواجهة.
- **الجدول المقابل:** `engine_jobs (id, name, description, kind, state, owner_id, priority, produced_by_task_id, triggered_by_tool_id, metadata)`.
- **أنواع المحركات (`engine_job_kind`):** `automation | data_processing | orchestration | sync | analytics | validation`.

### 1.7 Dependency — الاعتماد
- **التعريف:** علاقة اعتماد بين عنصرين داخل النظام، مع نوع الاعتماد.
- **الجدول المقابل:** `dependencies (id, from_entity_type, from_entity_id, to_entity_type, to_entity_id, dependency_type, description, metadata)`.
- **أنواع الاعتماد (`central_dependency_type`):** `execution | data | technical | operational | time`.
- **الكيانات المسموحة (`central_entity_type`):** `board | department | project | task | tool | engine_job | project_card | task_card`.
- **قيد:** `from_entity_id <> to_entity_id` (لا اعتماد ذاتي).

### 1.8 State — الحالة
- **التعريف:** حالة العنصر داخل دورة العمل.
- **مُستخدمة مع:** Project, Task, Tool, Engine Job, Board, Department, Project Card, Task Card.
- **القيم القانونية (`central_state` enum):**
  `draft | planned | active | blocked | paused | completed | cancelled | archived | failed`.

### 1.9 كيانات إضافية مرتبطة (موجودة في migration)
- **Project Card** (`project_cards`): تمثيل بصري للمشروع داخل سبورة، مع `projection: compact|standard|executive` و `visible_metrics`.
- **Task Card** (`task_cards`): تمثيل بصري للمهمة داخل سبورة.
- **Task ↔ Tool ↔ Engine Job Link** (`task_tool_engine_links`): علاقة ثلاثية بنوع `produces|binds|executes`.

---

## 2. العلاقات المطلوبة

```
                       ┌──────────────┐
                       │  Department  │
                       └──────┬───────┘
                              │ owns / supervises (department_projects)
                              ▼
                       ┌──────────────┐
                       │   Project    │
                       └──────┬───────┘
                              │ contains
                              ▼
                       ┌──────────────┐         ┌─────────────┐
                       │     Task     │────────▶│    Tool     │
                       └──┬───────────┘ produces└──────┬──────┘
                          │                            │ contained in
                          │ produces                   ▼
                          ▼                     ┌──────────────┐
                  ┌──────────────┐              │    Board     │
                  │  Engine Job  │◀──triggers──│              │
                  └──────────────┘              └──────────────┘
                          ▲
                          │ (binds via task_tool_engine_links)
                          │
                  ┌───────┴──────────┐
                  │      Tool        │ reads from / activates
                  └──────────────────┘

   Dependency  ────►  أي كيان ⇄ أي كيان (مع dependency_type)
   State       ────►  مُلصَقة بكل: Project, Task, Tool, Engine Job, Board, Department
```

### قائمة العلاقات الرسمية
| # | العلاقة | الجدول/المفتاح |
|---|---|---|
| أ | Board يحتوي Tools | `tools.board_id → boards.id` |
| ب | Department يملك/يشرف على Projects | `department_projects` |
| جـ | Project يتكون من Tasks | `tasks.linked_project_id → projects.id` |
| د | Task قد ينتج Tool | `tools.produced_by_task_id → tasks.id` |
| هـ | Task قد ينتج Engine Job | `engine_jobs.produced_by_task_id → tasks.id` |
| و | Task قد يربط Tool بـ Engine Job | `task_tool_engine_links (task_id, tool_id, engine_job_id, relation_type)` |
| ز | Tool قد يقرأ من Engine Job | `task_tool_engine_links.relation_type = 'binds'` |
| ح | Tool قد يفعّل Engine Job | `engine_jobs.triggered_by_tool_id → tools.id` أو `relation_type = 'executes'` |
| ط | Dependency تربط أي كيانين | `dependencies (from/to_entity_type+id, dependency_type)` |
| ي | كل Project/Task/Tool/Engine Job/Board/Department يملك State | عمود `state central_state` على كل جدول |

---

## 3. السمات المشتركة (Cross-Cutting Attributes)

كل كيان أساسي يحمل **بحد أدنى**:
- `id uuid PK`
- `name text`
- `state central_state` (افتراضي `draft`)
- `owner_id uuid` (المسؤول)
- `priority central_priority` (`low|medium|high|critical`)
- `metadata jsonb`
- `created_at, updated_at timestamptz`

والـ Tasks تضيف:
- `estimated_duration, estimated_cost, complexity, required_team_size`
- `actual_duration, actual_cost`
- `start_date, due_date, due_date`
- `assignee_id`

---

## 4. دورة الحياة المنشودة (State Machine موحّدة)

```
draft ─▶ planned ─▶ active ─┬─▶ paused ─▶ active
                            ├─▶ blocked ─▶ active
                            ├─▶ completed ─▶ archived
                            ├─▶ cancelled ─▶ archived
                            └─▶ failed ─▶ archived
```

- جميع الكيانات تستخدم نفس الـ enum.
- الانتقالات يجب أن تُدار في طبقة Domain (commands) لا في الـ UI مباشرةً.
- تغيير الـ State حدث قابل للتدقيق (`audit log`).

---

## 5. المبادئ الموجِّهة للمعمارية المستهدفة

1. **مصدر حقيقة واحد:** قاعدة Supabase + الجداول المركزية (`boards, departments, projects, tasks, tools, engine_jobs, dependencies, *_cards, links, …`). لا mock في الإنتاج.
2. **نموذج أحداث (Event-Driven):** كل تغيير حالة يُنشر كحدث (`State Changed`, `Task Completed`, `Tool Created`, …) عبر `EventOutbox + DLQ` (يُفعَّل لاحقًا).
3. **Audit أصلي:** كل أمر حسّاس يمر بسياسة تفويض (`evaluateCommandAuthorization` على غرار النموذج الموجود لـ Smart Elements) ويُسجَّل في جدول تدقيق فعلي (مرشّح: `op_log` موسّع أو جدول جديد `audit_events`).
4. **RBAC موحَّد بـ ABAC اختياري:**
   - أدوار قاعدية موحّدة (مرشّح: `Owner | Manager | Member | Viewer | Guest`).
   - قيود ABAC على `departmentId | projectId | boardId | dataSensitivity`.
   - مصدر الحقيقة: جدول `user_roles` منفصل (راجع memory `user-roles` instructions).
5. **Public API لكل feature:** الالتزام الصارم بـ `src/features/*/index.ts` كنقطة دخول وحيدة (موجود فعليًا، يجب التوسعة على باقي النطاقات).
6. **لا glassmorphism على الأسطح الثابتة، فقط على الـ overlays** (قاعدة قائمة).
7. **RTL-First** بخصائص CSS منطقية (قاعدة قائمة).
8. **Dependencies صريحة** بدلًا من الاقتران الضمني عبر الكود.
9. **Engine Jobs غير متزامنة:** تُشغَّل عبر Edge Functions أو Workers، لا تُحجب الـ UI.
10. **State كسلوك أوّلي:** كل كيان قابل للتنفيذ يحمل State صريحة، وتغييرها يمرّ بـ command + policy + audit.

---

## 6. الأنماط المعمارية المرشّحة لكل كيان

| الكيان | نمط الإنشاء | نمط القراءة | نمط التعديل |
|---|---|---|---|
| Board | Command + Policy | React Query selector | Command + Audit |
| Department | Admin-only Command | RLS-scoped query | Command + Audit |
| Project | Department-scoped Command | Joined view (project + department) | Command + State Machine |
| Task | Project-scoped Command | Paginated query | Command + State Machine + Notify |
| Tool | Board-scoped Command | Board view | Command + Permission |
| Engine Job | Task-triggered or Tool-triggered | Status query | Worker/Edge Function update |
| Dependency | Cross-entity Command | Graph query | Soft delete |

---

## 7. ما هو خارج هذه الوثيقة

- لا تصف هذه الوثيقة الواجهات الجديدة (UI).
- لا تصف بناء ميزات جديدة.
- لا تشرح كيفية الانتقال (راجع `MIGRATION_PLAN.md`).
- لا تحلّ محل الـ Design System (الذي يبقى كما هو موثَّق في `CURRENT_SYSTEM_SPECIFICATION.md` قسم H والـ Project Knowledge).
