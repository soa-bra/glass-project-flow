# خطة مطابقة سوبرا — النسخة المحدّثة (بعد إغلاق R0 و R2)

> **الملف الحاكم**: `docs/specs/master-spec-ar.md` (16 بابًا) + 4 ملفات Excel في `docs/specs/`.
> **الأعداد المعتمدة** (محروسة باختبار `app-spec.coverage.test.ts`): **15 لوحة • 124 تبويب • 476 صندوق • 184 نافذة**.

---

## ما أُنجز (للسجل فقط — لا عمل متبقٍ)

### ✅ R0 — أساس المواصفة
- نقل الملفات الخمسة الحاكمة إلى `docs/specs/`.
- `scripts/generate-app-spec.mjs` يولّد `src/config/app-spec.ts` مجمَّدًا `as const` بأنواع `WorkspaceSpec/DashboardSpec/TabSpec/BoxSpec/PopupSpec`.
- `src/__tests__/app-spec.coverage.test.ts` يحرس الأعداد والتفرّد وصحة سلسلة `dashboard.tab.box`.
- `docs/specs/INDEX.md` يربط الأبواب 0→15 بالكود بحالة `✅/🟡/🔴`.
- ذاكرات: `mem://spec/master-spec`, `mem://spec/workspaces-six`, `mem://spec/box-kit-vocabulary`.

### ✅ R2 — Box-Kit + Renderers
- 17 primitive تحت `src/components/box-kit/primitives/` تغطي قاموس المواصفة (DAV/IPF/ACT/MDL).
- `registry.ts` يربط كل `componentRef` بمكوّن React واحد.
- `BoxRenderer` يلفّ كل صندوق بـ `BaseBox` ويستهلك `slotProps`، ويعرض تنبيهًا لأي ref غير مسجَّل.
- `TabRenderer` يرسم 12-col grid `dir="rtl"` لأي تبويب من المواصفة.
- `src/__tests__/box-kit.smoke.test.tsx` — 8/8 ناجحة (تبويب من كل workspace).

> الأقسام **A1, A2, D1, D2, D3** من الخطة الأصلية مُغلَقة بإنجاز R0 و R2 وتبقى كتوثيق مرجعي داخل `docs/specs/INDEX.md` بدون مهام متبقية.

---

## المتبقي

### القسم B — الهوية والحوكمة *(يقابل R1)*

**B1. تطبيق Section 7 — Design System**
| ركيزة | المخرج |
|---|---|
| 7.2 الألوان | تثبيت HSL Semantic في `src/index.css` + `tailwind.config.ts` بلا قيم خام. |
| 7.3 الخطوط | IBM Plex Sans Arabic + إلغاء الخطوط المهجورة. |
| 7.4-7.6 المسافات/الأحجام/الحواف | جدول tokens موحَّد + lint rule تمنع `px` خارج الـ tokens. |
| 7.7 الطبقات | توحيد z-index عبر CSS classes (`sb-modal-shell`). |
| 7.9 الوصولية | فحص axe في CI، contrast ≥ 4.5، focus-ring 2px. |

**B2. تطبيق Section 3 + 15 — قواعد البناء**
- ESLint rules مخصصة: لون خام، مسافة خارج tokens، deep import، z-index inline → كسر البناء.
- اشتراط JSDoc `@specRef <SectionNumber>` على كل ملف React جديد.

---

### القسم C — مساحات العمل الست *(يقابل R3→R8)*

**C0 / R3. WorkspaceShell + Operations Workspace جديد**
- `src/components/workspaces/WorkspaceShell.tsx` يفرض Sidebar/TopBar موحَّد + حالات `Loading/Empty/Error/NoAccess` + Breadcrumb 3 مستويات.
- نقل `src/components/OperationsBoard/` → `src/workspaces/operations/`، إضافة عنصر Sidebar وRoute `/operations/:tabId?`.

**C2 / R4. Projects Workspace** — 8 تبويبات + 29 صندوق + 18 نافذة وفق `ProjectManagementBoard-spec.xlsx`. خدمة `project.service.ts` تجمّع `projects + tasks + project_files + financial_* + crm_* + template_items`.

**C3 / R5. Departments Workspace** — 12 إدارة (`financial, legal, marketing, hr, crm, csr, bcm, training, partnerships, kmpa, knowledge, brand`) • 94 تبويب • 376 صندوق • 166 نافذة. هجرة `social→csr`, `research→kmpa`. إضافة `bcm, partnerships, knowledge`.

**C5 / R6. Archive Workspace** — 9 فئات + 27 صندوق. جدول `archive_documents (category, title, source_module, source_id, file_url, owner_id, tags[], archived_at, status)` + RLS. زر «أرشفة» في كل Workspace يكتب إليه.

**C6 / R7. Settings Workspace** — 13 تبويب + 44 صندوق. جداول `user_preferences, data_governance_rules, integrations`. RBAC صارم على `users-roles, audit, admin-roles, data-governance`.

**C4 / R8. Planning Workspace** — مواءمة `src/features/planning/` مع Section 5 (13 قسمًا فرعيًا: 5.3 سلوك canvas، 5.4 الأدوات، 5.5 التحديد، 5.6 القلم الذكي، 5.7 المستندات الذكية، 5.8 الموصلات والجذر الذكي، 5.9 الصناديق التشغيلية، 5.10 التحويل لكيانات تنفيذية، 5.11 التعاون اللحظي، 5.12 المساعد السياقي، 5.13 صلاحيات التخطيط). الناتج: `docs/specs/planning-gap.md` + قطع الفجوات.

---

### القسم E — نموذج البيانات *(يقابل R9)*

ضمان جدول/Zod/Service لكل كيان في 9.2:
| الكيان | الحالة | الإجراء |
|---|---|---|
| الصندوق التشغيلي | 🔴 | `operational_boxes(linked_workspace, linked_ref, data jsonb)` |
| الأصل المعرفي | 🟡 | توسيع `kmpa_documents` → `knowledge_assets` |
| الأمر | 🔴 | `command_log(command, payload, status, requested_by, decided_at)` |
| الحدث | 🟡 | فصل `domain_events` عن `audit_events` |
| كيان الأرشيف | 🔴 | `archive_documents` (راجع R6) |
| العمل الجاري | 🟡 | view `work_items` |

تصنيف 9.10 (جداول حاكمة عامة vs محلية للوحدة) + قيود 9.7/9.9 (PK uuid, FK, RLS, triggers). اختبار `db-integrity.test.ts` يفحص RLS و سياسة الملكية.

---

### القسم F — الأحداث والأوامر *(يقابل R10)*

- `src/shared/events/contracts.ts` يضم كل أحداث 10.2→10.7 كـ Zod + types + registry.
- `domain_events` يستقبل كل المنشورات.
- `src/shared/commands/` يحوي `Command.ts` + `commandBus.ts` (RBAC + audit + emit `command.executed`). كل كتابة UI تمرّ عبر Command (لا استدعاء supabase مباشر).
- `correlation_id` على كل event/command. صفحة Audit في Settings تعرض السلسلة.

---

### القسم G — التكاملات *(يقابل R11)*
| 11.x | الإجراء |
|---|---|
| 11.1 داخلية | عقود Service↔Service في `docs/integrations/internal.md` |
| 11.2 خارجية | جدول `integrations(provider, status, config)` + Settings UI |
| 11.3 AI Gateway | كل ذكاء عبر Lovable AI Gateway فقط مع credit-aware errors |
| 11.4 ملفات | Buckets موحَّدة: `documents, avatars, archive` |
| 11.5 أتمتة | تفعيل `scripts/outbox-relay.ts` ضمن Cron |

---

### القسم H — التدفقات *(يقابل R12)*

E2E لكل تدفق 12.1→12.10 (`e2e/flows/<12.x>.spec.ts`): إنشاء مشروع من Planning، تحويل عنصر إلى مهمة، ربط مستند بمشروع، أرشفة، إنتاج معرفة، المساعد السياقي، إصدار فاتورة، إنشاء Workflow، الجذر الذكي.

---

### القسم I — معايير القبول *(يقابل R13)*

`docs/specs/acceptance-checklist.md` يفهرس 13.1→13.9 (Owner ✅/⏳/🔴 + اختبار آلي + صلة بكود). CI gate يكسر النشر تحت العتبة.

---

### القسم J — هيكلة الطبقات *(يقابل R14)*

إعادة تنظيم تدريجية إلى 10 طبقات Section 14.1:
```
src/{ui, stores, features, services, shared/{events,commands,services}, config, types, hooks, pages, integrations}
```

---

### القسم K — الحوكمة النهائية *(يقابل R15)*

PR template يفرض حقل «Spec Refs touched» + lint rule تتحقق من `@specRef` + توثيق نهائي في `docs/specs/INDEX.md`.

---

## خارطة المراحل المتبقية

| المرحلة | المحتوى | تعتمد على |
|---|---|---|
| **R1** | B1 + B2 — Design Tokens + ESLint Governance | R0 ✅ |
| **R3** | C0 + C1 — WorkspaceShell + Operations Workspace | R2 ✅ |
| **R4** | C2 — Projects Workspace (8/29/18) | R2 ✅ |
| **R5** | C3 — Departments 12 (94/376/166) | R2 ✅ |
| **R6** | C5 — Archive Workspace + جدول | R2 ✅ + E1 |
| **R7** | C6 — Settings Workspace + RBAC | R2 ✅ |
| **R8** | C4 — Planning gap + إغلاق | R2 ✅ |
| **R9** | E1+E2+E3 — نموذج البيانات + Migrations + Zod | R5-R8 |
| **R10** | F1+F2+F3 — Event Bus + Command Layer + Tracing | R9 |
| **R11** | G — Integrations + AI Gateway hardening | R10 |
| **R12** | H — 10 تدفقات + E2E | R3-R11 |
| **R13** | I — Acceptance + CI gates | R12 |
| **R14** | J — إعادة هيكلة الطبقات | R10 |
| **R15** | K — PR template + lint + توثيق | R14 |

---

## خارج النطاق
- ترجمة الوثيقة كمحتوى UI نهائي.
- تكاملات إنتاجية محددة (Bank API, Email Provider) — تُجَدول داخل R11 بقرار منفصل.

---

ما المرحلة التالية: **R1** (الحوكمة) أم **R3** (WorkspaceShell + Operations) أم **R5** (الإدارات 12)؟
