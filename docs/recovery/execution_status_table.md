# Execution Status Table (Recovery Program)

تاريخ التحديث: 2026-05-01

| # | الخطوة | الحالة | أدلة حالية | ملاحظة تنفيذية |
|---|---|---|---|---|
| 1 | تثبيت القرار المعماري الحالي | Done | `docs/recovery/step-01-architectural-decision-record.md` | أُغلق بناءً على اعتماد توجيهي مباشر من صاحب الطلب بتاريخ 2026-05-01. |

| 9 | تثبيت Quality Gates دائمة | In Progress | `.github/workflows/pr-checks.yml` موجود | يلزم ربط صريح ببوابة مسارات auth/project/task/invoice/department.
| 10 | توثيق Baseline Schema رسمي | Not Started | migrations موجودة فقط | لا يوجد snapshot baseline معتمد ومجمّد.
| 11 | توثيق صلاحيات النظام | In Progress | `docs/RBAC.md`, `docs/SECURITY.md` | لا توجد matrix دور/عملية رسمية مرتبطة مباشرة بـRLS + behavior.
| 12 | إغلاق الفجوات التقنية في المكونات النشطة | Not Started | لا يوجد سجل فجوات Partial→Done ضمن DoD matrix | معلق على الخطوة 3 و9.
| 13 | ترتيب الدومينات حسب الأولوية التنفيذية | Not Started | توجد roadmaps عامة (`docs/EXECUTION_ROADMAP.md`) | لا يوجد ترتيب معتمد مبني على DoD+backlog الإصلاحي.
| 14 | توثيق Workflow Matrix | Not Started | `docs/INTERACTION_FLOW.md` عام | لا توجد Workflow Matrix بصيغة الخطوة 14.
| 15 | إنشاء Backlog إصلاحي حقيقي | Not Started | لا يوجد backlog recovery مصنف blocker/foundational/... | مانع انتقال رسمي.
| 16 | تعريف قواعد الاستكمال بعد الإصلاح | Not Started | لا توجد policy post-recovery رسمية | يعتمد على 7 و9.
| 17 | اعتماد نقطة انتقال رسمية | Blocked | لا يوجد محضر Go/No-Go | محجوب حتى اكتمال شروط الخطوة 17.

## ملاحظة حاكمة
الخطوات 1-3 مصنفة بالخطة على أنها مكتملة، لكن الواقع الحالي داخل المستودع يظهر **drift** لغياب artifacts تنفيذية مستقلة قابلة للتدقيق.
