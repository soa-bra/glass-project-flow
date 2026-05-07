# Batch A Closure — 2026-05-05

## ملخص الإغلاق

- عدد الملفات المحذوفة: **11** (3 أولية + 8 ضمن Batch A.2)
- عدد الملفات المؤجلة: **0**
- عدد الملفات في allowlist: **8**
- العدد المتبقي من قائمة الـ 95: **76**

## تفاصيل الحساب

اعتمادًا على baseline الأصلي `95` مرشّحًا:

- baseline: `95`
- المحذوف: `11`
- المؤجل: `0`
- allowlist: `8`
- المتبقي للمراجعة/المعالجة: `95 - 11 - 0 - 8 = 76`

## إعادة فحص import-graph

تمت إعادة تشغيل فحص import-graph وتحديث ملف المرشحين:

- `docs/reports/zero-reference-candidates-2026-05-05.md`

> ملاحظة: نتيجة إعادة الفحص الحالية تعتمد على نفس المنهج heuristic لربط `@/` و relative imports وقد تنتج baseline مختلفًا عن تقرير الـ95 الأصلي.

## Batch A.2 — 2026-05-07

### نطاق الفحص اليدوي

تم فحص الملفات التالية يدويًا قبل الحذف، مع البحث عن الاستخدامات المباشرة وغير المباشرة بالاسم داخل `src/App.tsx` و`src/pages/*` و`src/components/*`، بالإضافة إلى فحص عام لسلاسل الأسماء في المستودع لاستبعاد وجود registry/config يعتمد على أسماء المكوّنات كسلاسل نصية.

### أرقام Batch A.2

- الملفات المحذوفة ضمن Batch A.2: **8**.
- الملفات المتبقية من نطاق Batch A.2 بعد التنفيذ: **0**.
- الملفات المحذوفة من نطاق `ProjectPanel` الأربعة في هذا الفحص: **4**.
- الملفات المتبقية من نطاق `ProjectPanel` الأربعة بعد التنفيذ: **0**.
- العدد المتبقي من baseline الأصلي بعد احتساب حذف Batch A.2 والـ allowlist: **76** (`95 - 3 - 8 - 8 = 76`).

### نتيجة التصنيف

| الملف | التصنيف | قرار التنفيذ | ملاحظات الفحص |
|---|---|---|---|
| `src/components/HRLite/HRLiteMainPanel.tsx` | `delete-approved` | حُذف | لا توجد imports أو registry/config hits خارج تعريف الملف وتقارير الجرد. |
| `src/components/KnowledgeBase/KnowledgeBaseMainPanel.tsx` | `delete-approved` | حُذف | لا توجد imports أو registry/config hits خارج تعريف الملف وتقارير الجرد. |
| `src/components/Surveys/SurveysMainPanel.tsx` | `delete-approved` | حُذف | لا توجد imports أو registry/config hits خارج تعريف الملف وتقارير الجرد. |
| `src/components/kb/KnowledgeBaseOverview.tsx` | `delete-approved` | حُذف | لا توجد imports أو registry/config hits خارج تعريف الملف وتقارير الجرد. |
| `src/components/ProjectPanel/ProjectPanelContent.tsx` | `delete-approved` | حُذف | `ProjectPanel` الحالي يعرض `ProjectManagementBoard` بدل المحتوى القديم، ولا توجد imports لهذا الملف. |
| `src/components/ProjectPanel/AnalysisModal.tsx` | `delete-approved` | حُذف | لا توجد imports لهذا الملف؛ تبويب المشروع الحالي يستخدم `FinancialAnalysisModal` من `src/components/custom`. |
| `src/components/ProjectPanel/ApprovalRequestModal.tsx` | `delete-approved` | حُذف | لا توجد imports لهذا المسار؛ الاستخدام النشط بالاسم في `ProjectTabs` يستورد النسخة من `src/components/custom/ApprovalRequestModal.tsx`. |
| `src/components/ProjectPanel/ExpenseModal.tsx` | `delete-approved` | حُذف | لا توجد imports لهذا المسار؛ الاستخدام النشط بالاسم في `ProjectTabs` يستورد النسخة من `src/components/custom/ExpenseModal.tsx`. |

### تحديثات barrel exports

لم تكن هناك barrel exports مرتبطة بهذه الملفات في مجلدات `HRLite` أو `KnowledgeBase` أو `Surveys` أو `kb`، و`src/components/ProjectPanel/index.tsx` يصدّر المكوّن الرئيسي فقط ولا يصدّر الملفات المحذوفة؛ لذلك لم يلزم تعديل exports.

### أوامر التحقق

- `rg -n "\\b(HRLiteMainPanel|KnowledgeBaseMainPanel|SurveysMainPanel|KnowledgeBaseOverview|ProjectPanelContent|AnalysisModal|ApprovalRequestModal|ExpenseModal)\\b" src/App.tsx src/pages src/components`
- `rg -n --glob '!node_modules' --glob '!dist' --glob '!build' "\\b(HRLiteMainPanel|KnowledgeBaseMainPanel|SurveysMainPanel|KnowledgeBaseOverview|ProjectPanelContent|AnalysisModal|ApprovalRequestModal|ExpenseModal)\\b" .`
- `rg -n "@/components/ProjectPanel/(AnalysisModal|ApprovalRequestModal|ExpenseModal|ProjectPanelContent)|\\./((AnalysisModal|ApprovalRequestModal|ExpenseModal|ProjectPanelContent))|components/ProjectPanel/(AnalysisModal|ApprovalRequestModal|ExpenseModal|ProjectPanelContent)" src`

### إعادة تحقق Batch A.2 — ProjectPanel modal/content cleanup — 2026-05-07

استجابةً لفحص ملفات `ProjectPanel` المحددة، أُعيدت مقارنة المسارات الأربعة مع الاستخدامات الفعلية في `src/components/ProjectPanel/index.tsx` و`src/components/ProjectPanel/ProjectTabs.tsx` و`src/components/ProjectManagement/ProjectManagementBoard.tsx`، ثم أُعيد فحص أي import مباشر أو غير مباشر أو barrel export داخل `src/components/ProjectPanel`.

#### Removed

| الملف | سبب الحذف لكل ملف |
|---|---|
| `src/components/ProjectPanel/ExpenseModal.tsx` | لا يوجد import مباشر للمسار ولا barrel export ولا dynamic/string reference. `ProjectTabs` يستورد ويعرض النسخة المستخدمة فعليًا من `src/components/custom/ExpenseModal.tsx`، لذلك حُذفت نسخة `ProjectPanel` كـ legacy duplicate. |
| `src/components/ProjectPanel/ApprovalRequestModal.tsx` | لا يوجد import مباشر للمسار ولا barrel export ولا dynamic/string reference. `ProjectTabs` يستورد ويعرض النسخة المستخدمة فعليًا من `src/components/custom/ApprovalRequestModal.tsx`، لذلك حُذفت نسخة `ProjectPanel` كـ legacy duplicate. |
| `src/components/ProjectPanel/AnalysisModal.tsx` | لا يوجد import مباشر للمسار ولا barrel export ولا dynamic/string reference. `ProjectTabs` يستخدم `src/components/custom/FinancialAnalysisModal.tsx` بدل نسخة `ProjectPanel`، لذلك حُذفت نسخة التحليل غير المستخدمة. |
| `src/components/ProjectPanel/ProjectPanelContent.tsx` | لا يوجد import مباشر أو غير مباشر للمحتوى القديم. `src/components/ProjectPanel/index.tsx` يعرض `ProjectManagementBoard` مباشرة، و`ProjectManagementBoard` يستورد تبويباته من `ProjectTabs` فقط، لذلك حُذف المحتوى القديم غير المستخدم. |

#### Verification completed

- `test -e src/components/ProjectPanel/ProjectPanelContent.tsx -o -e src/components/ProjectPanel/ExpenseModal.tsx -o -e src/components/ProjectPanel/ApprovalRequestModal.tsx -o -e src/components/ProjectPanel/AnalysisModal.tsx; test $? -ne 0`
- `rg -n "@/components/ProjectPanel/(ProjectPanelContent|ExpenseModal|ApprovalRequestModal|AnalysisModal)|from ['\"]\./(ProjectPanelContent|ExpenseModal|ApprovalRequestModal|AnalysisModal)['\"]|import\(['\"].*(ProjectPanelContent|ExpenseModal|ApprovalRequestModal|AnalysisModal)" src -g '*.ts' -g '*.tsx'` returned no matches.
- `rg -n "custom/(ExpenseModal|ApprovalRequestModal|FinancialAnalysisModal)|\b(ExpenseModal|ApprovalRequestModal|FinancialAnalysisModal)\b" src/components/ProjectPanel src/components/ProjectManagement -g '*.ts' -g '*.tsx'` confirmed that active modal usage remains on the `src/components/custom/*` implementations.
- `npm run -s typecheck`


## Batch A.4 — 2026-05-07 — ShapeRenderer shim removal

تمت إعادة فحص مسار `ShapeRenderer` القديم بعد تحويل مستهلكي canvas إلى barrel المشترك canonical:

- `DrawingPreview` يستخدم الآن `@/features/planning/elements/shared`.
- `CanvasElement` يستخدم الآن `@/features/planning/elements/shared`.
- لم تعد هناك مراجع للمسار القديم داخل `src` أو `docs` بعد تحديث تقرير التكرار.
- ملف shim القديم غير موجود/محذوف، بينما بقيت النواة canonical في `src/features/planning/elements/shared/ShapeRenderer.tsx`.

### أوامر التحقق

- `rg -n "diagram/ShapeRenderer" .`
- `npm run -s typecheck`
