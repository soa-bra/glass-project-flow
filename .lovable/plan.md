# خطة محدّثة: استيراد حزمة soabra + خطة تنفيذ (P1 و P2 مُعاد ضبطهما وفق الـ Governing Rulings)

تنفيذ الخيارين معًا، مع إعادة تأطير P1 و P2 وفقًا لـ:

- **UR-001 → UR-010** (وثيقة الـ Governing Rulings).
- وثيقة "التخطيط التضامني والذكاء الاصطناعي المدمج" (Miro-inspired).
- وثيقة "تحويل العناصر، توسيع البطاقات، والموصلات الذكية" (ClickUp-inspired).

---

## الجزء 1 — استيراد الحزمة كمرجع (كما سبق)

- نسخ `soabra-conversion-package.zip` إلى `docs/reference/soabra-package/` مع `README.md` ومصفوفة تطابق.
- إضافة الوثائق الجديدة المرفوعة إلى `docs/reference/inspired-specs/` لتُستخدم كعقد وظيفي مكمّل للحزمة.
- إضافة قسم "Reference Contracts" داخل `docs/EXECUTION_ROADMAP.md`.

---

## الجزء 2 — خطة التنفيذ المُعاد ضبطها

### مبادئ حاكمة جديدة (مأخوذة من الـ Rulings)

1. **اللوحة ليست هويّة المنتج** (UR-001) — لا نوسّع canvas-first؛ نضمن أنها أداة قوية ضمن نظام أوسع.
2. **Collaborative-by-design حاكم** (UR-005) — Realtime presence + cursors + locks ليست اختيارية في P1.
3. **Smart Documents حاكمة** (UR-006) — يجب أن تُحفَظ كنوع عنصر مستقل من اليوم الأول.
4. **Semantic Connectors / Smart Roots حاكمة** (UR-007) — قد تحمل دلالة تنفيذية، وليست خطوطًا فقط.
5. **Planning→Execution Conversion حاكمة** (UR-008) — هي قلب P2.
6. **RBAC داخل اللوحة ضيّق ومباشر** (UR-009) — يختلف عن RBAC المنصة الواسع؛ Visitor محجوب عن AI واللوحة.
7. **Tech-debt مُعترف به** (UR-003, UR-004) — Bounding box ومعالجة النص والـ Smart Pen ليست نهائية؛ خطة P تُبقي حدودها مرئية.

---

### P0 — أساسيات

- استيراد حزمة المرجع + الوثائق الملهمة.
- مصفوفة DoD لكل لوحة من `system-map.yaml`.
- توثيق رسمي في `docs/CANVAS_LIMITATIONS.md` لقيود UR-003 و UR-004 (Bounding box, text handling, Smart Pen = annotation-only).

---

### P1 — Planning Persistence + Realtime + Smart Docs  

**ما تغيّر:** P1 لم يعد مجرد "حفظ اللوحة"؛ بل ثلاثة أعمدة حاكمة:

#### P1.a — Persistence

- Migration: `planning_boards`, `planning_elements` (مطابق Prisma المرجعي) + RLS.
- إضافة `element_type` enum يشمل: `sticky | shape | text | smart_doc | interactive_sheet | mindmap_node | frame | connector` (موسّع وفق وثيقة Miro §12).
- حقل `locked_by uuid` على `planning_elements` لدعم Optimistic Locking (UR-005).
- خدمة `src/services/central/planningBoards.service.ts` + ربط `usePlanningStore` بحفظ تدريجي (debounced).

#### P1.b — Collaboration (Governing — UR-005)

- إعادة استخدام `RealtimeSyncManager` الحالي + إضافة:
  - **Live cursors** عبر Supabase Realtime broadcast channel.
  - **Presence indicators** في أعلى اللوحة (avatars).
  - **Element locking** عند بدء التحرير، فك تلقائي بعد خمول 30 ث.
- معالجة Edge: قائمة انتظار للتعديلات عند انقطاع الشبكة + إعادة تطبيق (وثيقة Miro §4).

#### P1.c — Smart Documents كنوع عنصر مستقل (Governing — UR-006)

- جدول فرعي `planning_smart_docs` (id, element_id FK, content jsonb, schema_version).
- مكوّن `SmartDocRenderer` يدعم Rich Text + Spreadsheet (وثيقة Miro §7).
- لا تُخزَّن وثائق ذكية كنص ثابت — بل ككائنات مرتبطة بـ `planning_elements`.

#### P1.d — Canvas-scoped RBAC (UR-009)

- داخل اللوحة: `host | editor | viewer` فقط (موجود).
- منع `guest` و `viewer` من استدعاء AI أو إنشاء Smart Docs (تحقّق في `commandGateway.ts`).
- اعتراض الطلب في `evaluateCommandAuthorization` للأدوار غير المخوّلة.

**معايير القبول:**

- لوحتان تتزامنان عبر متصفّحَين بـ < 500ms latency.
- Smart Doc يُحفَظ ويُسترجَع مع `schema_version`.
- Visitor يرى رسالة "غير مصرّح" عند محاولة استدعاء AI.

---

### P2 — Convert / Expand / Smart Connectors

**ما تغيّر جذريًا:** P2 لم يعد "زر تحويل لوحة كاملة إلى مشروع"؛ بل ثلاثة محاور وفق وثيقة ClickUp:

#### P2.a — Smart Conversion (UR-008 + UR-010)

- Edge function جديدة `planning-convert-element`:
  - Input: `{ elementId, content, contextElements[] }`.
  - تستدعي Lovable AI Gateway لاقتراح `suggestedType ∈ {project, task, finance_box, hr_box, contract, opportunity}`.
  - Fallback يدوي إذا فشل الاقتراح (قائمة منسدلة).
- عند التأكيد:
  - إنشاء السجل الفعلي في الجدول المعني (`projects`, `tasks`, ...).
  - استبدال `planning_element` ببطاقة من نوع `entity_card` تشير إلى السجل (`linked_entity_type`, `linked_entity_id`).
  - Event في `event_outbox` بنوع `planning.element.converted`.

#### P2.b — Expandable Entity Cards (UR-008)

- مكوّن `EntityCardRenderer` يتكامل مع `framer-motion` `layoutId` (وثيقة ClickUp §قالب):
  - بطاقة مشروع → توسيع يفتح `ProjectManagementBoard` كاملًا في Modal/Drawer.
  - بطاقة مهمة → يفتح `TaskDetailPanel`.
  - بطاقة صندوق مالي/HR → يفتح "وضع التنفيذ الوظيفي" المخصّص لذلك الصندوق.
- على الموبايل: Full-Screen بدلًا من Modal (responsive rule §10).

#### P2.c — Smart Root Connectors (UR-007 — Governing)

- استبدال الـ MindMap connectors الحالية بنظام موحّد `smart_root_connectors`:
  - Migration: جدول `planning_connectors (id, board_id, source_id, target_id, source_anchor, target_anchor, style, semantic_type, execution_payload jsonb)`.
  - `semantic_type ∈ {flow, dependency, blocks, derives_from, financial_link}` — حاكم وفق UR-007.
  - `execution_payload`: قواعد تنفيذية اختيارية (مثل: "عند إكمال source، حدّث target").
- Cascading delete: حذف عنصر يحذف موصلاته (Edge §25).
- Anchors تظهر عند Hover/Select فقط (إخفاء على الموبايل).
- استخدام SVG `<path>` بمسارات Bezier/Orthogonal.

#### P2.d — Execution Tools Picker (UR-010)

- شريط جانبي جديد `ExecutionToolsPanel` يتيح "جلب صندوق من قسم آخر إلى اللوحة":
  - يستعلم `has_permission()` لكل صندوق قبل عرضه (Business Rule §29).
  - عند الإسقاط، يُنشأ `planning_element` من نوع `entity_card` مرتبط بالسجل الفعلي.

#### P2.e — Workflow Layer Hook (UR-010)

- Stub فقط في P2: جدول `planning_workflows` + خدمة بدون UI (يكتمل في P-Later).
- يسمح بتسجيل: "عندما يصل connector من X إلى Y، نفّذ Z".

**معايير القبول:**

- تحويل ملاحظة "حملة إطلاق" إلى مشروع فعلي في `projects` خلال خطوة واحدة.
- توسيع بطاقة مشروع يفتح لوحة الإدارة الكاملة دون مغادرة اللوحة.
- موصل `dependency` بين مهمتين ينعكس في `tasks.dependencies`.
- Visitor لا يرى زر "تحويل ذكي".

---

### P3 — Operations Split

- فصل تبويب Operations كلوحة مستقلة وربطها بـ `projects` + كيانات تشغيلية.

### P4 — Archive + Knowledge (أسابيع 9-10) — بدون تغيير

- Migrations: `archive_assets`, `knowledge_assets` + Storage buckets.

### P5 — Platform-Level RBAC الكامل (أسبوع 11) — بدون تغيير

- توسيع `app_role` لـ 12 دور + ABAC في RLS.
- ملاحظة: لا يلغي UR-009 (RBAC داخل اللوحة يبقى ضيّقًا).

### P6 — Contracts Enforcement (أسبوع 12) — بدون تغيير

- CI checks ضد OpenAPI/AsyncAPI/JSON-Schemas من الحزمة.

---

## تغييرات على EXECUTION_ROADMAP.md

- إضافة جدول "Governing Rulings Compliance" يربط كل P# بـ UR-### المعنية.
- إضافة `docs/CANVAS_LIMITATIONS.md` كملحق رسمي.

## مخاطر مُعالَجة

- **Tech-debt الـ Bounding Box و Text Handling (UR-003):** لا نخفيها؛ تظل مرئية في `CANVAS_LIMITATIONS.md` ويُعمَل عليها في موجة منفصلة (P-Later).
- **Smart Pen (UR-004):** يبقى "annotation only" — لا أزرار "تحويل لمهمة" من قلم.
- **RBAC مزدوج:** Canvas RBAC (UR-009) منفصل تقنيًا عن Platform RBAC (P5).

## تأكيد ما لم يتغيّر

- P1.a (Persistence) كان موجودًا في النسخة السابقة — أُضيف إليه فقط P1.b/c/d.
- P2 كان "تحويل لوحة" مبسّط — أصبح ثلاثيًا (Convert + Expand + Smart Roots) ليطابق وثيقتَي ClickUp + الـ Rulings.