# Execution Status Table (Recovery Program)

تاريخ التحديث: 2026-05-01

| # | الخطوة | الحالة | أدلة حالية | ملاحظة تنفيذية |
|---|---|---|---|---|
| 1 | تثبيت القرار المعماري الحالي | Done | `docs/recovery/step-01-architectural-decision-record.md` | أُغلق بناءً على اعتماد توجيهي مباشر من صاحب الطلب بتاريخ 2026-05-01. |
| 2 | تعريف نطاق التطبيق النشط | Done | `docs/recovery/step-02-active-scope-baseline.md` | أُغلقت بعد إنشاء baseline موحد مدعوم بمسارات فعلية واعتماد تنفيذي. |
| 3 | بناء DoD Matrix كاملة | Done | `docs/recovery/step-03-dod-matrix.md` | أُغلقت بعد إنشاء مصفوفة DoD كاملة بعناصر الحالة/المصدر/التبعيات/الأولوية. |
| 4 | توثيق Source of Truth Matrix | Done | `docs/recovery/step-04-source-of-truth-matrix.md` | أُغلقت بعد توثيق active/legacy/mock لكل domain أساسي. |
| 5 | توثيق Active Architecture Baseline | Done | `docs/recovery/step-05-active-architecture-baseline.md` | أُغلقت بعد توثيق baseline الطبقات وحدود التدفق المعتمد. |
| 6 | عزل legacy code رسميًا | Done | `docs/recovery/step-06-legacy-isolation.md`, `eslint.config.js`, `src/index.ts` | تم عزل legacy عبر policy مانعة + تنظيف root barrel من exports legacy. |
| 7 | تثبيت معايير التطوير الجديدة | Done | `docs/recovery/step-07-development-standards-policy.md`, `.github/pull_request_template.md` | أُغلقت بعد اعتماد policy + PR compliance gate إلزامي. |
| 8 | تنفيذ Runtime Verification حقيقي | Not Started | لا يوجد تقرير تحقق runtime مخصص لخطوات الاستعادة | يعتمد على 4/5/10/11.
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
