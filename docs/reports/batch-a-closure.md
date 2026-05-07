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

## Batch A.3 — 2026-05-07 — ProjectPanel modal revalidation

استجابةً لفحص ملفات `ProjectPanel` المحددة، أُعيدت مقارنة المسارات الأربعة مع الاستخدامات الفعلية في `src/components/ProjectPanel/ProjectTabs.tsx`:

| الملف المفحوص | direct import | barrel export | dynamic/string reference | القرار | سبب الاحتفاظ/الحذف |
|---|---:|---:|---:|---|---|
| `src/components/ProjectPanel/ExpenseModal.tsx` | لا يوجد | لا يوجد | لا يوجد | محذوف سابقًا/مؤكد | `ProjectTabs` يستورد ويعرض النسخة المستخدمة فعليًا من `src/components/custom/ExpenseModal.tsx`، لذلك حُذفت نسخة `ProjectPanel` لتجنب تكرار واجهة المصروفات ومنطقها. |
| `src/components/ProjectPanel/ApprovalRequestModal.tsx` | لا يوجد | لا يوجد | لا يوجد | محذوف سابقًا/مؤكد | `ProjectTabs` يستورد ويعرض النسخة المستخدمة فعليًا من `src/components/custom/ApprovalRequestModal.tsx`، لذلك حُذفت نسخة `ProjectPanel` لتجنب تكرار واجهة طلب الاعتماد المالي. |
| `src/components/ProjectPanel/AnalysisModal.tsx` | لا يوجد | لا يوجد | لا يوجد | محذوف سابقًا/مؤكد | `ProjectTabs` يستخدم `src/components/custom/FinancialAnalysisModal.tsx` بدل نسخة `ProjectPanel`، لذلك حُذفت النسخة غير المستخدمة لتجنب تكرار Modal تحليل الميزانية. |
| `src/components/ProjectPanel/ProjectPanelContent.tsx` | لا يوجد | لا يوجد | لا يوجد | محذوف سابقًا/مؤكد | `src/components/ProjectPanel/index.tsx` يعرض `ProjectManagementBoard` مباشرة، ولا يوجد مسار حي يستدعي المحتوى القديم. |

ملاحظة: بقيت النسخ النشطة داخل `src/components/custom/*Modal.tsx` لأنها هي المستوردة فعليًا من `ProjectTabs.tsx`، ولم تكن هناك exports مرتبطة بالمسارات المحذوفة داخل `src/components/ProjectPanel/index.tsx`.

### أوامر التحقق الإضافية

- `rg -n "@/components/ProjectPanel/(ExpenseModal|ApprovalRequestModal|AnalysisModal|ProjectPanelContent)|from ['\"]\./(ExpenseModal|ApprovalRequestModal|AnalysisModal|ProjectPanelContent)|import\(['\"].*(ExpenseModal|ApprovalRequestModal|AnalysisModal|ProjectPanelContent)" src -g '*.ts' -g '*.tsx'`
- `npm run typecheck`

## Batch A.4 — 2026-05-07 — route/navigation revalidation for panel candidates

استجابةً لإعادة فحص لوحات `HRLiteMainPanel` و`KnowledgeBaseMainPanel` و`SurveysMainPanel` و`KnowledgeBaseOverview`، أُعيدت مراجعة نقاط الربط التالية قبل اتخاذ القرار:

- `src/App.tsx`: يحتوي فقط على مسارات `/auth` و`/join/:token` و`/` و`/departments` و`/departments/:departmentId` ثم catch-all؛ لا توجد routes منفصلة لهذه اللوحات.
- `src/pages/*`: صفحة الأقسام `DepartmentRoutePage` تربط مفاتيح الأقسام الحية فقط (`financial`, `legal`, `marketing`, `hr`, `crm`, `social`, `training`, `research`, `brand`) مع `Index` عبر `NavigationContext`؛ لا توجد imports أو dynamic references لهذه اللوحات.
- `src/contexts/NavigationContext.tsx`: الحالة تدعم `activeSection` و`selectedDepartment` و`selectedCustomer` فقط، و`navigateToCustomerDetails` يوجه إلى قسم `crm`؛ لا توجد entry points باسم HRLite أو KnowledgeBase أو Surveys.
- navigation/config داخل `src`: لا توجد hits للأسماء الأربعة خارج تقارير الجرد/الإغلاق، ولا توجد route أو registry string تربط هذه اللوحات بواجهة المنتج.

### نتيجة التصنيف بعد فحص route/navigation

| اللوحة/الملف | التصنيف | قرار التنفيذ | نتيجة فحص route/navigation |
|---|---|---|---|
| `src/components/HRLite/HRLiteMainPanel.tsx` | `delete-approved` | محذوف سابقًا/مؤكد | غير موجود في `src` الآن، ولا يوجد route أو navigation entry أو department key يشير إليه؛ شاشة HR الحية تستخدم مسار القسم `/departments/hr` ومكوّنات `DepartmentTabs/HR`. |
| `src/components/KnowledgeBase/KnowledgeBaseMainPanel.tsx` | `delete-approved` | محذوف سابقًا/مؤكد | غير موجود في `src` الآن، ولا يوجد route أو navigation entry أو string registry يطلبه؛ الموجود هو hook/service layer فقط بدون لوحة مربوطة. |
| `src/components/Surveys/SurveysMainPanel.tsx` | `delete-approved` | محذوف سابقًا/مؤكد | غير موجود في `src` الآن، ولا يوجد route أو navigation entry أو string registry يطلبه؛ الموجود هو hook/service layer فقط بدون لوحة مربوطة. |
| `src/components/kb/KnowledgeBaseOverview.tsx` | `delete-approved` | محذوف سابقًا/مؤكد | غير موجود في `src` الآن، ولا يوجد route أو navigation entry أو string registry يطلبه؛ لا توجد لوحة مطلوبة product-wise تحتاج ربطًا بدل الحذف. |

لم تظهر أي حالة `route-missing` أو `defer-feature-entry` في هذا الفحص؛ لذلك لم تتم إضافة routes أو navigation entries جديدة، ولم تكن هناك ملفات إضافية للحذف لأن ملفات `delete-approved` الأربعة كانت محذوفة بالفعل.

### أوامر التحقق الخاصة بهذا الفحص

- `find src -name '*HRLiteMainPanel*' -o -name '*KnowledgeBaseMainPanel*' -o -name '*SurveysMainPanel*' -o -name '*KnowledgeBaseOverview*'`
- `rg -n "HRLiteMainPanel|KnowledgeBaseMainPanel|SurveysMainPanel|KnowledgeBaseOverview" src`
- `rg -n "HRLiteMainPanel|KnowledgeBaseMainPanel|SurveysMainPanel|KnowledgeBaseOverview|route|routes|navigate|Navigation" src/App.tsx src/pages src/contexts/NavigationContext.tsx src`
- `npm run -s typecheck`
