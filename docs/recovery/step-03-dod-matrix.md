# Step 03 Artifact — DoD Matrix (Baseline)

- التاريخ: 2026-05-01
- الحالة: Approved
- المالك: Engineering Manager + Domain Leads
- المرجع الحاكم: `docs/recovery_execution_package.md` (الخطوة 3)

## DoD Matrix

| المكوّن الأساسي | Definition of Done (DoD) | الحالة الحالية | Source of Truth (مبدئي) | التبعيات | أولوية التنفيذ |
|---|---|---|---|---|---|
| Auth / Session | تسجيل دخول/جلسة مستقرة + حماية المسارات + عدم تسرب صلاحيات | Partial | Supabase Auth + `ProtectedRoute` | 5, 8, 9, 11 | P0 |
| Projects | Create/Read يعملان عبر service نشط بدون mocks | Partial | `src/services/central/projects.service.ts` | 4, 5, 8, 9, 10 | P0 |
| Tasks | Create/Read/Update عبر service موحّد + اتساق الحالة | Partial | `src/services/central/tasks.service.ts` + hooks المهام | 4, 5, 8, 9, 10 | P0 |
| Invoices | Create/Read/Update عبر active invoice path فقط | Partial | `src/services/invoices/invoices.service.ts` + `src/api/invoices/invoices.ts` | 4, 5, 6, 8, 9, 10 | P0 |
| Department shell read | قراءة بنية الأقسام من service مركزي | Partial | `src/services/central/departments.service.ts` | 4, 5, 8, 9, 11 | P1 |
| Authorization/Roles | صلاحيات دورية متسقة بين app + RLS | Partial | RLS policies + role services | 10, 11, 8 | P0 |
| Runtime Verification Pack | تقرير تحقق للمسارات الأساسية الخمسة | Not Started | Artifact الخطوة 8 | 4, 5, 10, 11 | P0 |
| Quality Gates (CI) | typecheck + lint + smoke + merge blocking | In Progress | `.github/workflows/pr-checks.yml` | 6, 8, 9 | P0 |
| Legacy Isolation | منع imports من legacy في المسارات النشطة | In Progress | lint/policy + ADR-001 | 5, 6, 9 | P0 |
| Baseline Schema | snapshot schema مع جداول/علاقات in-use | Not Started | Artifact الخطوة 10 | 4, 10 | P0 |

## ملاحظات تصنيف الحالة
1. **Done**: كل بنود DoD للمكوّن مغلقة مع دليل تحقق قابل للتدقيق.
2. **Partial**: جزء من DoD متحقق لكن توجد فجوات تشغيلية/تحققية.
3. **Not Started**: لا يوجد artifact أو تنفيذ كافٍ بعد.
4. **Blocked**: التنفيذ متوقف بسبب تبعية مانعة.

## قواعد التشغيل على المصفوفة
1. أي تغيير حالة يتطلب:
   1. رابط دليل (ملف/تشغيل/تقرير).
   2. تاريخ تحديث.
   3. مالك مسؤول.
2. يمنع بدء domain جديد قبل إغلاق P0 ذات الصلة.
3. تحديث المصفوفة إلزامي قبل كل Sprint Recovery Planning.

## Acceptance for Step 03
1. كل مكوّن أساسي لديه: DoD + حالة + Source of Truth + تبعيات + أولوية.
2. المصفوفة محفوظة داخل المستودع كمرجع واحد.
3. قابلة للاستخدام المباشر في فرز backlog الإصلاحي (الخطوة 15).

## Closure Record
1. تم إنشاء DoD Matrix baseline داخل المشروع.
2. تم ربطها بعناصر التنفيذ الحرجة ومخرجات الخطوات اللاحقة.
3. أُغلقت الخطوة 3 كمرجع تشغيلي حاكم.
