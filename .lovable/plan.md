
# الخطة الشاملة لمطابقة سوبرا للوثيقة التأسيسية المرجعية

> **الملف الحاكم**: `soabra-foundational-master-spec-merged-ar-updated-sections-16-18-2.md` — 5554 سطرًا، 16 بابًا (0→15).
> **المرجعيات الفرعية** (تابعة لهذا الملف، تم تحليلها سابقًا):
> 1. `departments-spec.xlsx` — 12 إدارة • 94 تبويب • 376 صندوق • 166 نافذة
> 2. `ProjectManagementBoard-spec.xlsx` — 8 تبويبات • 29 صندوق • 18 نافذة
> 3. `ArchiveWorkspace-spec.xlsx` — 9 تبويبات • 27 صندوق
> 4. `SettingsWorkspace-spec.xlsx` — 13 تبويب • 44 صندوق
>
> الـ Excel = التفاصيل البَنَويّة. الـ Master Spec = الحوكمة، الهوية، النموذج، العقود، التدفقات، والقبول.

---

## مبدأ تنفيذي حاكم

كل بند في الكود يجب أن يحمل **مرجعًا لقسم في الـ Master Spec أو سجل في الـ Excel**. أي ملف/جدول/مكوّن بلا مرجع = ديون تقنية تُجَدول للحذف.

---

## القسم A — الإطار العام (Master Foundation)

### A1. تثبيت الوثيقة كمصدر حقيقة
- نسخ الملف إلى `docs/specs/master-spec-ar.md` + الـ 4 ملفات Excel إلى `docs/specs/`.
- إنشاء `docs/specs/INDEX.md` يربط كل قسم من الـ 16 بـ:
  - الملف Excel المقابل إن وُجد.
  - مجلد الكود المسؤول.
  - حالة المطابقة (`✅ matched` / `🟡 partial` / `🔴 missing`).
- سكربت `scripts/generate-app-spec.mjs` يدمج الـ 4 ملفات Excel في `src/config/app-spec.ts` (مجمَّد `as const`) مع types صارمة (`WorkspaceKey`, `DashboardKey`, `TabRef`, `BoxRef`, `PopupRef`).
- اختبار `src/__tests__/app-spec.coverage.test.ts` يفشل إن لم تتطابق الأعداد: 15 dashboard • 124 tab • 476 box • 184 popup.

### A2. ذاكرة المشروع
- `mem://spec/master-spec` ← يحدد الوثيقة كحاكم نهائي.
- `mem://spec/workspaces-six` ← يثبت الـ 6 workspaces: Operations, Projects, Departments, Planning, Archive, Settings.
- `mem://spec/box-kit-vocabulary` ← قاموس مراجع المكوّنات (DAV/IPF/ACT/MDL).

---

## القسم B — الهوية والمبادئ الحاكمة (الأبواب 1, 3, 7)

### B1. تطبيق مبادئ التصميم (Section 7 — Design System)
| ركيزة | المخرج |
|---|---|
| 7.2 الألوان | تحديث `src/index.css` + `tailwind.config.ts` بالـ Design Tokens المنصوصة (HSL فقط، Semantic، لا قيم خام). |
| 7.3 الخطوط | تفعيل عائلة الخطوط الرسمية (IBM Plex Sans Arabic + ما يحدّده القسم) وإلغاء أي خط مهجور. |
| 7.4-7.6 المسافات/الأحجام/الحواف | جدول tokens موحَّد + lint rule تمنع القيم الخام (`px`) خارج الـ tokens. |
| 7.7 الطبقات | توحيد الـ z-index عبر CSS classes (`sb-modal-shell`) كما هو مثبَّت بالذاكرة. |
| 7.9 الوصولية | فحص axe في CI + اشتراط contrast 4.5 و focus-ring 2px. |

### B2. تطبيق مبادئ البناء (Section 3 + 15)
- تثبيت قواعد التسمية والتقسيم (15.1-15.2) عبر ESLint rules مخصصة.
- مبدأ Feature-Sliced (موجود) + Public API + منع deep imports.
- مبدأ «الواجهة تُترجم المرجع، لا تخترعه» (14.2) ← أي شاشة جديدة بلا entry في الـ spec = `🔴` في الـ INDEX.

### Acceptance — القسم B
- ESLint يكسر البناء إذا: لون خام، مسافة خارج tokens، deep import، z-index inline.
- لا يوجد ملف React جديد بلا JSDoc يحمل `@specRef <SectionNumber>`.

---

## القسم C — مساحات العمل الست (Section 2.2 + Section 4)

> الـ Master Spec يثبت **6 workspaces**. التطبيق اليوم يحتوي 5 (Projects, Departments, Planning, Archive, Settings + لوحة Operations كأداة داخلية). يجب رفع Operations إلى Workspace كامل.

### C0. Workspace Shell الموحَّد (Section 4.0.1)
- `src/components/workspaces/WorkspaceShell.tsx` يفرض على كل Workspace:
  - Sidebar/TopBar موحَّد.
  - حالات قياسية: `Loading`, `Empty`, `Error`, `NoAccess`.
  - Breadcrumb 3 مستويات (Workspace → Screen → Panel/Component).
- كل Workspace يلتزم به عبر:
  ```tsx
  <WorkspaceShell workspaceKey="operations">{children}</WorkspaceShell>
  ```

### C1. Operations Workspace (جديد — Section 2.2.1 + 4.3)
- نقل `src/components/OperationsBoard/` → `src/workspaces/operations/`.
- إضافة عنصر «العمليات» في الـ Sidebar الرئيسي (`Sidebar.tsx`) بأيقونة `Activity`.
- إضافة Route `/operations` + `/operations/:tabId`.
- التبويبات حسب الكود الحالي + Master Spec 4.3: `overview, finance, projects, marketing, hr, clients, reports` (تُؤكَّد من Excel مستقبلًا إن طُلب).
- البيانات من `useTabData` المُحوَّل سلفًا (دفعة سابقة P3.b).

### C2. Projects Workspace (Section 4.1)
- ProjectManagementBoard يصبح Dashboard ضمن Projects Workspace.
- 8 تبويبات + 29 صندوق + 18 نافذة مطابقة لـ `ProjectManagementBoard-spec.xlsx`.
- خدمة `project.service.ts` تجمّع: `projects`, `tasks`, `project_files`, `financial_*`, `crm_*`, `template_items`.

### C3. Departments Workspace (Section 4.2)
- 12 إدارة بالمفاتيح: `financial, legal, marketing, hr, crm, csr, bcm, training, partnerships, kmpa, knowledge, brand`.
- 94 تبويب • 376 صندوق • 166 نافذة من Excel.
- مهاجرة: `social → csr`, `research → kmpa`. إضافة: `bcm, partnerships, knowledge`.
- تفاصيل في Plan السابق (Phase Departments 12).

### C4. Planning Workspace (Section 4.4 + Section 5 كاملًا)
- Section 5 = 13 قسمًا فرعيًا، أعمق مساحة في الوثيقة.
- مواءمة `src/features/planning/` مع:
  - 5.3 سلوك الـ canvas النهائي
  - 5.4 أدوات الـ canvas (موجود: pen, frame, text, sticky, mindmap, smart-elements…)
  - 5.5 التحديد والتحرير
  - 5.6 القلم الذكي
  - 5.7 المستندات الذكية
  - 5.8 الموصلات والجذر الذكي
  - 5.9 الصناديق التشغيلية ← ربط بـ Operations/Projects
  - 5.10 التحويل إلى كيانات تنفيذية ← Workflow Engine
  - 5.11 التعاون اللحظي (موجود: RealtimeSync + WebRTC)
  - 5.12 المساعد التنفيذي السياقي ← AI assistant داخل canvas
  - 5.13 صلاحيات التخطيط
- فحص gap لكل قسم فرعي عبر ملف `docs/specs/planning-gap.md`.

### C5. Archive Workspace (Section 4.5)
- 9 فئات + 27 صندوق من Excel.
- جدول `archive_documents (category, title, source_module, source_id, file_url, owner_id, tags[], archived_at, status)` + RLS.
- زر «أرشفة» في كل Workspace يكتب إلى هذا الجدول.

### C6. Settings Workspace (Section 4.6)
- 13 تبويب • 44 صندوق من Excel.
- جداول جديدة (إن لزم): `user_preferences`, `data_governance_rules`, `integrations`.
- RBAC صارم على: `users-roles, audit, admin-roles, data-governance`.

### Acceptance — القسم C
- 6 عناصر في Sidebar الرئيسي تمثل الـ 6 Workspaces.
- كل Workspace ملفوف بـ `WorkspaceShell` ويعرض حالاته القياسية.

---

## القسم D — كتالوج المكوّنات (Section 6) و Box-Kit

### D1. Box-Kit الموحَّد `src/components/box-kit/`
| Ref | Component | Spec section |
|---|---|---|
| `BaseBox` | (موجود) | 6.1 |
| `DAV-TTL/KPI/TAG/DTL/TBL/LST/CHT` | `BoxTitle, KpiCluster, TagStrip, DetailList, DataTable, DataList, ChartFrame` | 6.1 + 6.2 |
| `IPF-SRH/SLT/DAT/TGL` | `SearchInput, SelectFilter, DateRangeFilter, ToggleGroup` | 6.1 |
| `ACT-BTN/MNU/STS` | `ActionButton, ActionMenu, StatusChip` | 6.1 |
| `MDL-WND/HDR` | `ModalShell, ModalHeader` | 6.2 |

### D2. مكوّنات Renderer
- `<TabRenderer tabRef />` ← يقرأ TabSpec ويرسم الصناديق.
- `<BoxRenderer boxRef />` ← يقرأ BoxSpec ويربط البيانات.
- `modals/registry.ts` ← يربط `popupRef → Component`.
- `<DomainComponent kind />` للقسم 6.4 (CRM/HR/Finance widgets specialized).

### D3. مكوّنات السلوك (Section 6.3)
- توثيق العقود: `Selectable, Draggable, Resizable, Connectable, Editable, Lockable, Searchable, Exportable`.
- كل سلوك = Hook أو Higher-Order Component مع اختبار قبول.

### Acceptance — القسم D
- لا توجد JSX خام داخل تبويب: كل ما يُعرض يمر عبر `BoxRenderer`.
- اختبار `box-kit.coverage.test.ts` يفشل عند Ref بلا تسجيل.

---

## القسم E — نموذج البيانات (Section 9)

### E1. الكيانات (9.2)
ضمان وجود/إنشاء جداول لكل الكيانات الـ 16 المُعدَّدة في 9.2:

| الكيان | الحالة | الإجراء |
|---|---|---|
| المستخدم/الدور/الصلاحية | ✅ موجود | تأكيد user_roles + permissions |
| المشروع/القسم | ✅ projects + departments | تأكيد |
| عنصر التخطيط | ✅ canvas_elements | تأكيد |
| الصندوق التشغيلي | 🔴 جديد | `operational_boxes` (linked_workspace, linked_ref, data jsonb) |
| الموصل/العلاقة | ✅ connectors | تأكيد |
| المستند الذكي | ✅ smart_documents | تأكيد |
| الأصل/الملف | ✅ project_files | تأكيد |
| الأصل المعرفي | 🟡 kmpa_documents | توسيع إلى `knowledge_assets` العام |
| الحدث | 🟡 audit_events | فصل `domain_events` عن `audit_events` |
| الأمر | 🔴 جديد | `command_log (command, payload, status, requested_by, decided_at)` |
| سجل التدقيق | ✅ audit_events | تأكيد |
| كيان الأرشيف | 🔴 جديد | `archive_documents` (راجع C5) |
| العمل الجاري | 🟡 tasks + جزء من operations | توضيح في `work_items` view |

### E2. التصنيف (Section 9.10)
- الجداول الحاكمة على مستوى المنصة: `users, user_roles, projects, departments, command_log, domain_events, audit_events`.
- الجداول المحلية على مستوى الوحدة: `hr_*, crm_*, financial_*, legal_*, brand_*, marketing_*, csr_*, bcm_*, kmpa_*, knowledge_*, partnerships_*, training_*, archive_documents`.

### E3. القيود والنزاهة (9.7 + 9.9)
- لكل جدول: PK uuid, FK مع `on delete cascade/set null` حسب الدلالة، `created_at/updated_at` + trigger، RLS مفعلة.
- اختبارات `db-integrity.test.ts` تتحقق من أن كل جدول له RLS + سياسة `is_owner OR owner_id=auth.uid()`.

### Acceptance — القسم E
- `supabase--linter` يمر بدون Critical.
- كل كيان من 9.2 له جدول/view + service + Zod schema.

---

## القسم F — عقود الأحداث والأوامر (Section 10)

### F1. Event Bus موحَّد
- `src/shared/events/contracts.ts` يضم الأحداث المنصوصة في:
  - 10.2 أحداث المشاريع
  - 10.3 أحداث التخطيط
  - 10.4 أحداث الأقسام (+ 10.4.1 Operations)
  - 10.5 أحداث الأرشيف
  - 10.6 أحداث المعرفة
  - 10.7 أحداث الذكاء الاصطناعي
- كل حدث = Zod schema + TS type + handler registry.
- جدول `domain_events (event_name, source, payload_jsonb, occurred_at, correlation_id)` يستقبل كل ما يُنشر.

### F2. Command Layer (Section 10.8)
- `src/shared/commands/` يحوي:
  - `Command.ts` interface (name, payload, requiresApproval, validator, executor).
  - `commandBus.ts` يطبّق RBAC + audit قبل التنفيذ + emit `command.executed`.
- كل عملية كتابة في الخدمات تمرّ عبر Command (لا استدعاء مباشر لـ supabase من UI).

### F3. التتبع والتدقيق (10.9)
- كل event/command له `correlation_id` يربط الـ chain.
- صفحة Settings/Audit تعرض الـ events والـ commands مع فلتر بـ correlation_id.

### Acceptance — القسم F
- لا توجد كتابة لـ Supabase خارج Command bus.
- كل event مذكور في الباب 10 له معرّف فريد، Zod، ومُسجَّل في contracts.ts.

---

## القسم G — التكاملات (Section 11)

| 11.x | الموضوع | الإجراء |
|---|---|---|
| 11.1 | تكاملات داخلية | عقود Service↔Service موثَّقة في `docs/integrations/internal.md` |
| 11.2 | تكاملات خارجية | جدول `integrations` (provider, status, config) + Settings/Integrations UI |
| 11.3 | AI Gateway | تمرير كل طلب ذكاء عبر Lovable AI Gateway فقط، مع credit-aware error handling |
| 11.4 | الملفات/المستندات | Supabase Storage buckets موحَّدة: `documents, avatars, archive` |
| 11.5 | الأتمتة/الأحداث | webhook outbox + `scripts/outbox-relay.ts` (موجود) → تفعيله ضمن Cron |

---

## القسم H — التدفقات التفصيلية (Section 12)

تنفيذ ضمان end-to-end لكل تدفق من 12.1 إلى 12.10:

| التدفق | الـ Workspaces المعنية | اختبار E2E |
|---|---|---|
| 12.1 إنشاء مشروع من لوحة التخطيط | Planning → Projects | ✅ مطلوب |
| 12.2 تحويل عنصر إلى مهمة | Planning → Projects/Tasks | ✅ |
| 12.3 ربط مستند بمشروع | Planning → Projects/Files | ✅ |
| 12.4 تخزين مادة في الأرشيف | * → Archive | ✅ |
| 12.5 إنتاج معرفة من مراجعة مشروع | Projects → KMPA/Knowledge | ✅ |
| 12.6 + 12.6.1 المساعد السياقي | Planning/Operations | ✅ |
| 12.7 إصدار فاتورة | Projects → Financial | ✅ |
| 12.8 إنشاء Workflow من Planning | Planning → Operations | ✅ |
| 12.9 الجذر الذكي | Planning | ✅ |
| 12.10 تدفقات إضافية | كل المساحات | جدول مرجعي |

كل تدفق ← ملف اختبار Playwright/Vitest في `e2e/flows/<12.x>.spec.ts`.

---

## القسم I — معايير القبول (Section 13)

ملف `docs/specs/acceptance-checklist.md` يفهرس كل بند من 13.1 إلى 13.9 ويضع لكل بند:
- Owner ✅/⏳/🔴
- اختبار آلي مرتبط
- صلة بكود (ملف/سطر)

ESLint hook + CI job يكسر النشر إذا انخفض معدل التغطية عن العتبة.

---

## القسم J — الصورة التقنية (Section 14)

### J1. الطبقات العشر (14.1)
هيكل المجلدات بعد إعادة التنظيم:
```
src/
  ui/              ← 14.2 الواجهة (Box-Kit + Renderers + Workspaces)
  stores/          ← 14.3 الحالة (Zustand)
  domain/          ← 14.4 السلوك والمجال
  services/        ← 14.4 الخدمات
  data/            ← 14.5 طبقة البيانات (Supabase clients + queries)
  shared/events/   ← 14.6 الأحداث (موجود)
  shared/commands/ ← 14.6 الأوامر (جديد)
  ai/              ← 14.7 الذكاء الاصطناعي
  collab/          ← 14.8 التعاون اللحظي
  files/           ← 14.9 الملفات
  governance/      ← 14.10 الحوكمة والتدقيق (audit, rbac, policies)
```
- خطوة لاحقة لا تكسر الكود الحالي: إنشاء aliases في `tsconfig` ونقل تدريجي مع `re-exports` مؤقتة.

### J2. حوكمة الطبقات
- ESLint rule `no-cross-layer-import` تمنع: UI ← data, services ← stores عكسيًا، إلخ.

---

## القسم K — قواعد البناء (Section 15)

- 15.1 التسمية: convention موحَّدة (`PascalCase` للمكوّنات، `camelCase` للـ hooks/services، `kebab-case` للملفات داخل box-kit).
- 15.2 التقسيم: حجم ملف ≤ 400 سطر، مكوّن ≤ 200.
- 15.3-15.6 موجود ضمن القسم B (ESLint).
- 15.7 الاختبار: لكل service + command + event handler test ملف اختبار.
- 15.8 PR template يجبر ملء `@specRef`.

---

## الترتيب التنفيذي (Roadmap على Batches)

| Batch | المحتوى | اعتماد | الحالة |
|---|---|---|---|
| **R0** | A1+A2 (Spec ثابت + Index + memories) | — | ✅ مكتمل — `src/config/app-spec.ts` مولَّد آليًا (15/124/476/184)، `docs/specs/INDEX.md` + 3 memories، اختبار تغطية يحرس الأعداد. |
| **R1** | B1+B2 (Design Tokens + ESLint Governance) | R0 | 🟡 قائمة |
| **R2** | D1+D2+D3 (Box-Kit + Renderers + Behaviors) | R0+R1 | ✅ مكتمل — `src/components/box-kit/` يحوي 17 primitive (DAV/IPF/ACT/MDL) + `registry.ts` + `BoxRenderer` + `TabRenderer`، اختبار smoke يرسم أول تبويب من كل workspace بدون أعطال. |
| **R3** | C0 + C1 (WorkspaceShell + Operations Workspace جديد) | R2 | 🟡 قائمة |
| **R4** | C2 (Projects Workspace + 8/29/18) | R2 | 🟡 قائمة |
| **R5** | C3 (Departments — تفاصيل في خطة 12 إدارة الموافَق عليها) | R2 | 🟡 قائمة |
| **R6** | C5 (Archive Workspace + جدول archive_documents) | R2+E1 | 🟡 قائمة |
| **R7** | C6 (Settings Workspace + جداول الإعدادات + RBAC) | R2 | 🟡 قائمة |
| **R8** | C4 (Planning Workspace — Gap analysis + قطع الفجوات) | R2 | 🟡 قائمة |
| **R9** | E1+E2+E3 (Data Model alignment + migrations + Zod) | R5-R8 | 🟡 قائمة |
| **R10** | F1+F2+F3 (Event Bus + Command Layer + Tracing) | R9 | 🟡 قائمة |
| **R11** | G (Integrations + AI Gateway hardening) | R10 | 🟡 قائمة |
| **R12** | H (10 تدفقات + E2E tests) | R3-R11 | 🟡 قائمة |
| **R13** | I (Acceptance checklist + CI gates) | R12 | 🟡 قائمة |
| **R14** | J (إعادة هيكلة الطبقات تدريجية) | R10 | 🟡 قائمة |
| **R15** | K (PR template + lint rules + توثيق نهائي) | R14 | 🟡 قائمة |

---

## المخرجات النهائية المعتمدة

1. **Source of truth واحد** (master-spec + 4 Excel) مرتبط ببنية الكود عبر `docs/specs/INDEX.md`.
2. **6 Workspaces** (Operations مرفوع إلى مساحة كاملة).
3. **Box-Kit + Renderers** يدير 124 تبويبًا و 476 صندوقًا و 184 نافذة.
4. **Data Model** يغطي 16 كيانًا حاكمًا مع جداول جديدة (`operational_boxes`, `command_log`, `domain_events`, `archive_documents`).
5. **Event/Command Layer** كل كتابة تمر عبر Command bus.
6. **Design System** يلتزم بالـ tokens المنصوصة مع ESLint enforcement.
7. **10 تدفقات** ممسوحة بـ E2E tests.
8. **Acceptance checklist** + CI gates تمنع الانحراف.
9. **Architecture 10 layers** مفصولة بـ lint rules.

---

## ما يخرج عن نطاق هذه الخطة (يُعالَج لاحقًا)
- النسخ الفعلي للوثيقة إلى عربية مترجمة في الواجهة (الوثيقة مرجعية، لا محتوى نهائي للـ UI).
- تكاملات إنتاجية محددة (Bank API, Email Provider) — تُجَدول داخل R11 بقرار منفصل لكل provider.

---

هل أبدأ تنفيذ **R0 + R1 + R2** (المؤسس) في الجلسة القادمة؟
