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
