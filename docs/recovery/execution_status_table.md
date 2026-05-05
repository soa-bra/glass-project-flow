# Execution Status Table (Recovery Program)

تاريخ التحديث: 2026-05-05

| # | الخطوة | الحالة | أدلة حالية | ملاحظة تنفيذية |
|---|---|---|---|---|
| 1 | تثبيت القرار المعماري الحالي | Done | `docs/recovery/step-01-architectural-decision-record.md` | أُغلق بناءً على اعتماد توجيهي مباشر من صاحب الطلب بتاريخ 2026-05-01. |
| 2 | تعريف نطاق التطبيق النشط | Done | `docs/recovery/step-02-active-scope-baseline.md` | أُغلقت بعد إنشاء baseline موحد مدعوم بمسارات فعلية واعتماد تنفيذي. |
| 3 | بناء DoD Matrix كاملة | Done | `docs/recovery/step-03-dod-matrix.md` | أُغلقت بعد إنشاء مصفوفة DoD كاملة بعناصر الحالة/المصدر/التبعيات/الأولوية. |
| 4 | توثيق Source of Truth Matrix | Done | `docs/recovery/step-04-source-of-truth-matrix.md` | أُغلقت بعد توثيق active/legacy/mock لكل domain أساسي. |
| 5 | توثيق Active Architecture Baseline | Done | `docs/recovery/step-05-active-architecture-baseline.md` | أُغلقت بعد توثيق baseline الطبقات وحدود التدفق المعتمد. |
| 6 | عزل legacy code رسميًا | Done | `docs/recovery/step-06-legacy-isolation.md`, `eslint.config.js`, `src/index.ts` | تم عزل legacy عبر policy مانعة + تنظيف root barrel من exports legacy. |
| 7 | تثبيت معايير التطوير الجديدة | Done | `docs/recovery/step-07-development-standards-policy.md`, `.github/pull_request_template.md` | أُغلقت بعد اعتماد policy + PR compliance gate إلزامي. |
| 8 | تنفيذ Runtime Verification حقيقي | Done | `docs/recovery/step-08-runtime-verification.md`, `docs/recovery/evidence/step08-*.txt` | أُغلقت بعد تنفيذ التحقق runtime للمسارات الخمسة الأساسية. |
| 9 | تثبيت Quality Gates دائمة | Done | `.github/workflows/pr-checks.yml`, `scripts/recovery/smoke-gate.mjs`, `docs/recovery/step-09-quality-gates.md` | تم تفعيل lint/typecheck/test/smoke كـ merge gates دائمة. |
| 10 | توثيق Baseline Schema رسمي | Done | `docs/recovery/step-10-baseline-schema.md`, `docs/recovery/step-10-comparison-report.md`, `docs/recovery/step-10-schema-inventory.tsv` | أُغلقت بعد توثيق المقارنة واعتماد baseline مع توثيق القيود التشغيلية. |
| 11 | توثيق صلاحيات النظام | Done | `docs/recovery/step-11-permissions-matrix.md`, `docs/recovery/step-11-runtime-evidence-template.md` | أُغلقت بعد توثيق inventory الحي + أدلة runtime للأدوار الثلاثة. |
| 12 | إغلاق الفجوات التقنية في المكونات النشطة | Done | `docs/recovery/step-12-active-component-gap-closure.md` | أُغلقت فجوات Partial→Done للمكونات النشطة وربطت بأدلة 8/9/10/11. |
| 13 | ترتيب الدومينات حسب الأولوية التنفيذية | Done | `docs/recovery/step-13-domain-priority-order.md` | أُغلقت بمصفوفة ترتيب مبنية على DoD والـbacklog والتبعيات. |
| 14 | توثيق Workflow Matrix | Done | `docs/recovery/step-14-workflow-matrix.md` | أُغلقت بمصفوفة workflows للمسارات الخمسة الأساسية. |
| 15 | إنشاء Backlog إصلاحي حقيقي | Done | `docs/recovery/step-15-recovery-backlog.md` | أُغلقت بعد إنشاء backlog رسمي مصنف blocker/foundational/important/later مع DoD لكل بند. |
| 16 | تعريف قواعد الاستكمال بعد الإصلاح | Done | `docs/recovery/step-16-post-recovery-completion-rules.md` | أُغلقت بسياسة post-recovery تمنع SoT/mocks/legacy regression. |
| 17 | اعتماد نقطة انتقال رسمية | Not Started | جميع تبعيات الانتقال موثقة باستثناء محضر Go/No-Go | جاهز للبدء بعد إغلاق C/D. |

## ملاحظة حاكمة
حالة الجدول تعكس آخر الأدلة الموثقة داخل `docs/recovery/` وأي تغيير حالة يتطلب Artifact قابلًا للتدقيق.
