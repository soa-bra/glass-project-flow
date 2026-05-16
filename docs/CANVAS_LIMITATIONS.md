# Canvas Limitations & Governing Rules (P0)

> وثيقة تأسيسية مرجعية — تُقيِّد تطوير لوحة التخطيط (Planning Canvas) ضمن نظام سـوبــرا.
> مصدر القواعد: الملفات السبعة المعتمدة (Miro Spec, ClickUp Conversion Spec, Governing Rulings UR-001..UR-010).

---

## 1) الحدود التقنية (Technical Limits)

| البند | الحد | المبرر |
|---|---|---|
| أقصى عدد عناصر/لوحة | 2,000 | أداء العرض (<500ms latency) |
| أقصى حجم Smart Doc (JSONB) | 1 MB | حدود Postgres/Realtime payload |
| أقصى عدد متعاونين متزامنين | 25 | حدود Supabase Realtime channel |
| Debounce حفظ التغييرات | 500ms | تقليل ضغط الكتابة |
| مهلة Element Lock | 30 ثانية | منع الإقفال الدائم (UR-005) |
| Schema Version لكل Smart Doc | إلزامي | دعم الترحيل المستقبلي (UR-006) |
| أنواع الاتصالات الدلالية | 5 فقط | flow / dependency / blocks / derives_from / financial_link |

## 2) الحدود الوظيفية (Functional Limits)

- **لا توجد طبقة Workflow كاملة في P2** — فقط Hook (`planning_workflows` stub) — تُؤجَّل للمرحلة P-Later (UR-010).
- **التحويل الذكي (Smart Conversion)** لا ينشئ كيانًا حقيقيًا تلقائيًا؛ يتطلب تأكيد المستخدم (UR-008).
- **AI Gateway** غير متاح للـ `viewer` أو `guest` — يُرجع "غير مصرّح" (UR-009).
- **Smart Docs** لا تدعم Real-time co-editing على مستوى الحرف في P1 — فقط Element Lock (UR-006).
- **Mobile**: التوسيع (Expand) يفتح Full-screen بدل Modal (UR-008).

## 3) القيود الأمنية (Security Constraints — UR-009)

- RBAC مقيد على ثلاثة أدوار فقط على مستوى اللوحة: `host | editor | viewer`.
- جميع كتابات `planning_elements` و`planning_connectors` تمر عبر RLS مرتبطة بـ `user_has_board_role`.
- `commandGateway.ts` يحجب أوامر AI/Smart Docs للأدوار الأدنى من `editor`.

## 4) القيود البصرية (Visual Constraints)

- لا Glassmorphism على Static surfaces — يقتصر على Overlays فقط (Project Memory).
- جميع البطاقات: radius=24px، البطاقات الفرعية=16px.
- RTL-First: استخدام `ps-*`، `pe-*`، `start` حصرًا.

---

## 5) خارج النطاق (Out of Scope)

- تكامل Figma/Miro المباشر — لا.
- استيراد ملفات `.miro` أو `.fig` — لا.
- Voice/Video داخل اللوحة — مؤجَّل (موجود في `RealtimeSyncManager` كـ stub).
- AI image generation داخل الكانفس — مؤجَّل لـ P5.

## 6) عقد Smart Doc (P1.c)

- محتوى `smart_doc` و`interactive_sheet` يُخزَّن داخل `planning_elements.content` (jsonb) ولا يوجد جدول فرعي منفصل (`planning_smart_docs`).
- النسخة الحالية: `SMART_DOC_SCHEMA_VERSION = 1` ضمن `src/features/planning/elements/smart-doc/contract.ts`.
- يُحقَّق العقد عبر Zod (`validateSmartDocContent`) عند `createPlanningElement` و`updatePlanningElement`.
- الترقية المستقبلية تمر عبر `migrateSmartDocContent(input, fromVersion)` قبل التحقق.
