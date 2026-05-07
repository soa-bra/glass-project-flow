# Batch A Closure — 2026-05-05

## ملخص الإغلاق

- عدد الملفات المحذوفة: **36** (3 أولية + 8 ضمن Batch A.2 + 12 ضمن Batch A.8 + 12 hooks ضمن Batch H + 1 ضمن Batch A.9)
- عدد الملفات المؤجلة: **0**
- عدد الملفات في allowlist: **8**
- العدد المتبقي من قائمة الـ 95: **51**

## تفاصيل الحساب

اعتمادًا على baseline الأصلي `95` مرشّحًا:

- baseline: `95`
- المحذوف: `36`
- المؤجل: `0`
- allowlist: `8`
- المتبقي للمراجعة/المعالجة: `95 - 36 - 0 - 8 = 51`

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
- نتيجة البحث عن مسار shim القديم: لا توجد أي مراجع متبقية في المستودع بعد تنظيف إدخال تقرير التكرار القديم.
- نتيجة حذف shim: ملف shim القديم غير موجود بالفعل، لذلك لا يوجد ملف إضافي لحذفه في هذه الجولة، وبقيت النواة canonical في `src/features/planning/elements/shared/ShapeRenderer.tsx`.

### أوامر التحقق

- البحث الحرفي عن مسار renderer القديم لم يُرجع نتائج بعد تنظيف التقرير.
- تحقق وجود ملف shim القديم أكد أنه غير موجود.
- `npm run -s typecheck` نجح.

## Batch A.5 — 2026-05-07 — route/navigation audit for legacy panels

استجابةً لفحص route/navigation المحدد، تمت مراجعة:

- `src/App.tsx` للتحقق من routes العامة (`/`, `/departments`, `/departments/:departmentId`).
- `src/pages/*` للتحقق من wrappers الخاصة بالمسارات، وخصوصًا `DepartmentRoutePage`.
- `src/contexts/NavigationContext.tsx` للتحقق من مفاتيح التنقل الحالية (`activeSection`, `selectedDepartment`, `selectedCustomer`).
- إعدادات/تدفقات التنقل داخل `src` المرتبطة بالإدارات: `MainContent`, `DepartmentsSidebar`, `DepartmentPanel`, وواجهات `DepartmentTabs`.

### نتيجة التصنيف للملفات المطلوبة

| الملف | حالة الملف الحالية | التصنيف | قرار التنفيذ | ملاحظات route/navigation |
|---|---|---|---|---|
| `src/components/HRLite/HRLiteMainPanel.tsx` | غير موجود بعد حذف Batch A.2 | `delete-approved` | لا تغيير إضافي | لم تظهر أي مراجع للاسم في `src/App.tsx` أو `src/pages/*` أو `NavigationContext` أو config داخل `src`. لوحة الموارد البشرية المطلوبة حاليًا مربوطة عبر مفتاح `hr` إلى `HRDashboard` ضمن `DepartmentTabs/HR`، لذلك لا يلزم إحياء لوحة `HRLite` القديمة. |
| `src/components/KnowledgeBase/KnowledgeBaseMainPanel.tsx` | غير موجود بعد حذف Batch A.2 | `delete-approved` | لا تغيير إضافي | لم تظهر أي مراجع للاسم في route/navigation. مسار المعرفة الحالي يستخدم مفتاح الإدارة `research` ويعرض `KMPADashboard` من `DepartmentTabs/KMPA`، لذلك لا يلزم ربط اللوحة القديمة. |
| `src/components/kb/KnowledgeBaseOverview.tsx` | غير موجود بعد حذف Batch A.2 | `delete-approved` | لا تغيير إضافي | لم تظهر أي مراجع للاسم في route/navigation أو imports داخل `src`. واجهة المعرفة الحالية مغطاة عبر `KMPADashboard` وتبويبات KMPA، وليس عبر overview القديم. |
| `src/components/Surveys/SurveysMainPanel.tsx` | غير موجود بعد حذف Batch A.2 | `delete-approved` | لا تغيير إضافي | لم تظهر أي مراجع للاسم في route/navigation أو imports داخل `src`، ولا يوجد route أو nav item حالي يتوقع لوحة Surveys مستقلة. |

### ملاحظات الربط الحالي

- `src/App.tsx` يعرّف route الإدارات العام `/departments` وroute الإدارة المحددة `/departments/:departmentId` ولا يربط أيًا من اللوحات الأربع مباشرة.
- `DepartmentRoutePage` يحصر مفاتيح الإدارات المسموحة ويتضمن `hr` و`research`، ثم يضبط `activeSection` إلى `departments` و`selectedDepartment` حسب route param.
- `DepartmentsSidebar` يحتوي عنصرَي تنقل حاليين لـ `hr` و`research`، ولا يحتوي عنصرًا مستقلًا لـ `Surveys` أو `KnowledgeBaseMainPanel`.
- `DepartmentPanel` يربط `hr` عبر `FeatureDepartmentPanel` إلى `HRDashboard`، ويربط `research` عبر `BaseDepartmentPanel` إلى `KMPADashboard`.

### أوامر التحقق

- `for f in src/components/HRLite/HRLiteMainPanel.tsx src/components/KnowledgeBase/KnowledgeBaseMainPanel.tsx src/components/kb/KnowledgeBaseOverview.tsx src/components/Surveys/SurveysMainPanel.tsx; do if [ -e "$f" ]; then echo "exists $f"; else echo "absent $f"; fi; done`
- `rg -n "\\b(HRLiteMainPanel|KnowledgeBaseMainPanel|KnowledgeBaseOverview|SurveysMainPanel)\\b" src/App.tsx src/pages src/contexts/NavigationContext.tsx src --glob '!components/HRLite/HRLiteMainPanel.tsx' --glob '!components/KnowledgeBase/KnowledgeBaseMainPanel.tsx' --glob '!components/kb/KnowledgeBaseOverview.tsx' --glob '!components/Surveys/SurveysMainPanel.tsx'`
- `rg -n "path=|<Route|activeSection|selectedDepartment|departments|research|hr" src/App.tsx src/pages src/contexts/NavigationContext.tsx src/components/MainContent.tsx src/components/DepartmentsSidebar.tsx src/components/DepartmentPanel src/components/DepartmentTabs/KMPA src/components/DepartmentTabs/HR`
- `npm run -s typecheck`

## Batch A.6 — 2026-05-07 — requested route/navigation re-audit for legacy main panels

أُعيد تنفيذ الفحص المطلوب للملفات الثلاثة المحددة فقط، مع مراجعة `src/App.tsx` و`src/pages/*` و`src/contexts/NavigationContext.tsx` وأقرب إعدادات route/navigation داخل `src` المرتبطة بتدفق الإدارات (`MainContent`, `DepartmentsSidebar`, `DepartmentsWorkspace`, `DepartmentPanel`, `FeatureDepartmentPanel`, و`BaseDepartmentPanel`).

### نتيجة كل ملف

| الملف | حالة الملف عند الفحص | التصنيف | قرار التنفيذ | نتيجة route/navigation |
|---|---|---|---|---|
| `src/components/HRLite/HRLiteMainPanel.tsx` | غير موجود بالفعل بعد حذف Batch A.2 | `delete-approved` | لا حذف إضافي | لا توجد مراجع للاسم في `src/App.tsx` أو `src/pages/*` أو `NavigationContext` أو إعدادات التنقل داخل `src`. مدخل الموارد البشرية الحالي مربوط عبر `/departments/:departmentId` ومفتاح `hr`، ويُعرض من خلال `FeatureDepartmentPanel` إلى `HRDashboard` في `DepartmentTabs/HR`. |
| `src/components/KnowledgeBase/KnowledgeBaseMainPanel.tsx` | غير موجود بالفعل بعد حذف Batch A.2 | `delete-approved` | لا حذف إضافي | لا توجد مراجع للاسم في route/navigation. مدخل المعرفة الحالي مربوط بمفتاح `research` ضمن `DepartmentRoutePage` و`DepartmentsSidebar`، ويُعرض عبر `BaseDepartmentPanel` إلى `KMPADashboard` من `DepartmentTabs/KMPA`. |
| `src/components/Surveys/SurveysMainPanel.tsx` | غير موجود بالفعل بعد حذف Batch A.2 | `delete-approved` | لا حذف إضافي | لا توجد مراجع للاسم داخل route/navigation أو imports داخل `src`، ولا يوجد route أو navigation item حالي يتطلب لوحة Surveys مستقلة. |

### خلاصة الربط

- لا توجد ملفات من القائمة تحتاج تصنيف `route-missing`: لا يوجد route أو navigation config حالي يشير إلى هذه اللوحات بالاسم أو يتوقع مساراتها القديمة.
- لا توجد ملفات من القائمة تحتاج تصنيف `defer-feature-entry`: لم يظهر مدخل تنقل مستقبلي/معطّل لهذه اللوحات في النطاق المفحوص.
- لم تُحذف ملفات في هذه الجولة لأن الملفات الثلاثة كانت محذوفة مسبقًا ومصنفة `delete-approved`.
- لم يلزم ربط route جديد لأن البدائل المطلوبة حاليًا موجودة عبر مفاتيح الإدارات `hr` و`research`، ولا يوجد مدخل Surveys مستقل.

### أوامر التحقق

- `for f in src/components/HRLite/HRLiteMainPanel.tsx src/components/KnowledgeBase/KnowledgeBaseMainPanel.tsx src/components/Surveys/SurveysMainPanel.tsx; do if [ -e "$f" ]; then echo "exists $f"; else echo "absent $f"; fi; done`
- `rg -n "HRLiteMainPanel|KnowledgeBaseMainPanel|SurveysMainPanel" src/App.tsx src/pages src/contexts/NavigationContext.tsx src || true`
- `rg -n "path=|<Route|activeSection|selectedDepartment|departments|research|hr|survey|knowledge" src/App.tsx src/pages src/contexts/NavigationContext.tsx src/components/MainContent.tsx src/components/DepartmentsSidebar.tsx src/components/DepartmentsWorkspace.tsx src/components/DepartmentPanel src/components/DepartmentTabs/KMPA src/components/DepartmentTabs/HR`
- `npm run -s typecheck`


## Batch A.7 — 2026-05-07 — low-risk zero-reference cleanup

### نطاق الدفعة

تم اختيار دفعة جديدة من **12** ملفًا من `docs/reports/zero-reference-candidates-2026-05-05.md` بعد الاستبعاد المؤقت للفئات التالية حسب الطلب:

- workers.
- hooks الفعلية تحت `src/hooks`.
- route/entry panels وملفات الدخول/barrel العامة.
- الملفات المرتبطة بـ dynamic import أو runtime loader.

اقتصرت الدفعة على ملفات مصنفة مسبقًا `delete-approved` في `batch-a-delete-list.md`، ثم أُعيد فحصها يدويًا قبل الحذف.

### نتيجة التصنيف والتنفيذ

| الملف | التصنيف | قرار التنفيذ | فحص import مباشر | فحص string/config/registry | فحص barrel export |
|---|---|---|---|---|---|
| `src/components/TaskCard/TaskCardOverflowGuards.test.tsx` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار. | لا توجد hits للاسم خارج التقارير وملف المصدر. | لا يوجد export من index قريب. |
| `src/components/shared/ImprovementsSummary.tsx` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار. | لا توجد hits للاسم خارج التقارير وملف المصدر. | `src/components/shared/index.ts` لا يصدّره. |
| `src/components/shared/design-system/canvas-positioning.ts` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار. | لا توجد hits للاسم خارج التقارير وملف المصدر. | لا يوجد export من index قريب. |
| `src/components/shared/design-system/surface-tokens.ts` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار. | لا توجد hits للاسم خارج التقارير وملف المصدر. | لا يوجد export من index قريب. |
| `src/features/planning/elements/text/FormatIndicator.tsx` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار. | لا توجد hits للاسم خارج التقارير وملف المصدر. | لا يوجد export من index قريب. |
| `src/types/canvas-component-props.ts` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار. | لا توجد registry/config hits؛ ظهرت مراجع توثيقية فقط في `docs/CURRENT_SYSTEM_SPECIFICATION.md`. | `src/types/index.ts` لا يصدّره. |
| `src/types/canvas-events.ts` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار. | لا توجد registry/config hits؛ ظهرت مراجع توثيقية فقط في `docs/CURRENT_SYSTEM_SPECIFICATION.md`. | `src/types/index.ts` لا يصدّره. |
| `src/utils/canvasCoordinates.ts` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار. | لا توجد hits للاسم خارج التقارير وملف المصدر. | `src/utils/index.ts` لا يصدّره. |
| `src/utils/deprecation.ts` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار. | لا توجد registry/config hits؛ ظهرت مراجع توثيقية فقط في تقرير `snapengine-diff`. | `src/utils/index.ts` لا يصدّره. |
| `src/utils/imageUtils.ts` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار. | لا توجد hits للاسم خارج التقارير وملف المصدر. | `src/utils/index.ts` لا يصدّره. |
| `src/utils/mindmap-tree.ts` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار. | لا توجد hits للاسم خارج التقارير وملف المصدر. | `src/utils/index.ts` لا يصدّره. |
| `src/utils/taskConstants.ts` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار. | لا توجد hits للاسم خارج التقارير وملف المصدر. | `src/utils/index.ts` لا يصدّره. |

### أرقام Batch A.7

- الملفات المحذوفة ضمن Batch A.7: **12**.
- الملفات المؤجلة ضمن Batch A.7: **0**.
- الملفات المحذوفة تراكمياً بعد Batch A.7: **23**.
- العدد المتبقي من baseline الأصلي بعد احتساب الحذف والـ allowlist: **64** (`95 - 23 - 0 - 8 = 64`).

### أوامر التحقق

- `rg -n --glob '!node_modules' --glob '!dist' --glob '!build' --glob '!docs/reports/**' --glob '!batch-a-delete-list.md' "(from ['\"][^'\"]*<stem>['\"]|import\(['\"][^'\"]*<stem>['\"]|export .*from ['\"][^'\"]*<stem>['\"])" .`
- `rg -n --glob '!node_modules' --glob '!dist' --glob '!build' --glob '!docs/reports/**' --glob '!batch-a-delete-list.md' --glob "!<candidate>" "\b(<stem>|<component>)\b" .`
- `sed -n '1,220p' src/utils/index.ts`
- `sed -n '1,220p' src/types/index.ts`
- `find src/components/shared -maxdepth 3 -name 'index.ts*' -print -exec sed -n '1,160p' {} \;`
- `npm run -s typecheck`

## Batch A.8 — 2026-05-07 — additional zero-reference integration-spec cleanup

### نطاق الدفعة

تم اختيار دفعة إضافية من **12** ملفًا من `docs/reports/zero-reference-candidates-2026-05-05.md` بعد الاستبعاد المؤقت للفئات المطلوبة:

- workers.
- hooks.
- route entry panels وملفات الدخول العامة مثل `src/main.tsx` و`src/index.ts`.
- ملفات runtime loader والإعداد مثل setup/config/env والملفات المشار إليها بـ dynamic import.

اقتصرت الدفعة على ملفات اختبار تكامل لا تمثل entry/runtime loader للتطبيق نفسه، ثم صُنفت يدويًا `delete-approved` بعد فحص الاستيراد المباشر، وسلاسل الاسم في config/registry، وملفات barrel القريبة.

### نتيجة التصنيف والتنفيذ

| الملف | التصنيف | قرار التنفيذ | فحص import مباشر | فحص string/config/registry | فحص barrel export |
|---|---|---|---|---|---|
| `src/__tests__/integration/canvas-acceptance.test.tsx` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار أو stem خارج الملف. | لا توجد hits للاسم خارج التقارير والملف. | لا يوجد `index.ts*` في مجلد الاختبارات القريب. |
| `src/__tests__/integration/canvas-kernel.test.tsx` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار أو stem خارج الملف. | لا توجد hits للاسم خارج التقارير والملف. | لا يوجد `index.ts*` في مجلد الاختبارات القريب. |
| `src/__tests__/integration/canvas-rendering.test.tsx` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار أو stem خارج الملف. | لا توجد hits للاسم خارج التقارير والملف. | لا يوجد `index.ts*` في مجلد الاختبارات القريب. |
| `src/__tests__/integration/canvas-workflow.test.tsx` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار أو stem خارج الملف. | لا توجد config/registry hits؛ توجد إشارة توثيقية فقط في `docs/README_TESTS.md`. | لا يوجد `index.ts*` في مجلد الاختبارات القريب. |
| `src/__tests__/integration/clipboard-behavior.test.tsx` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار أو stem خارج الملف. | لا توجد hits للاسم خارج التقارير والملف. | لا يوجد `index.ts*` في مجلد الاختبارات القريب. |
| `src/__tests__/integration/drag-drop-behavior.test.tsx` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار أو stem خارج الملف. | لا توجد hits للاسم خارج التقارير والملف. | لا يوجد `index.ts*` في مجلد الاختبارات القريب. |
| `src/__tests__/integration/element-creation.test.tsx` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار أو stem خارج الملف. | لا توجد hits للاسم خارج التقارير والملف. | لا يوجد `index.ts*` في مجلد الاختبارات القريب. |
| `src/__tests__/integration/export-import-integration.test.ts` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار أو stem خارج الملف. | لا توجد hits للاسم خارج التقارير والملف. | لا يوجد `index.ts*` في مجلد الاختبارات القريب. |
| `src/__tests__/integration/history-operations-integration.test.ts` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار أو stem خارج الملف. | لا توجد hits للاسم خارج التقارير والملف. | لا يوجد `index.ts*` في مجلد الاختبارات القريب. |
| `src/__tests__/integration/selection-behavior.test.tsx` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار أو stem خارج الملف. | لا توجد hits للاسم خارج التقارير والملف. | لا يوجد `index.ts*` في مجلد الاختبارات القريب. |
| `src/__tests__/integration/store-integration.test.ts` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار أو stem خارج الملف. | لا توجد hits للاسم خارج التقارير والملف. | لا يوجد `index.ts*` في مجلد الاختبارات القريب. |
| `src/__tests__/integration/undo-redo-behavior.test.tsx` | `delete-approved` | حُذف | لا توجد imports/exports مباشرة للمسار أو stem خارج الملف. | لا توجد hits للاسم خارج التقارير والملف. | لا يوجد `index.ts*` في مجلد الاختبارات القريب. |

### أرقام Batch A.8

- الملفات المحذوفة ضمن Batch A.8: **12**.
- الملفات المؤجلة ضمن Batch A.8: **0**.
- الملفات المحذوفة تراكمياً بعد Batch A.8: **35**.
- العدد المتبقي من baseline الأصلي بعد احتساب الحذف والـ allowlist: **52** (`95 - 35 - 0 - 8 = 52`).

### أوامر التحقق

- `rg -n --glob '!node_modules' --glob '!dist' --glob '!build' --glob '!docs/reports/**' --glob '!batch-a-delete-list.md' --glob '!<candidate>' "(from ['\"][^'\"]*<stem>['\"]|import\(['\"][^'\"]*<stem>['\"]|export .*from ['\"][^'\"]*<stem>['\"])" .`
- `rg -n --glob '!node_modules' --glob '!dist' --glob '!build' --glob '!docs/reports/**' --glob '!batch-a-delete-list.md' --glob '!<candidate>' "\b<stem>\b" .`
- `find src/__tests__/integration -maxdepth 1 -name 'index.ts*' -print -exec sed -n '1,160p' {} \;`
- `npm run -s typecheck`


## Batch A.9 — 2026-05-07 — zero-reference triage report and legacy invoice cleanup

### نطاق الدفعة

تم فتح `docs/reports/zero-reference-candidates-2026-05-05.md` وإنشاء تقرير triage شامل لكل المرشحين في:

- `docs/reports/zero-reference-triage.md`

استخدمت الدفعة `rg` لفحص اسم الملف، والمسار النسبي، وأسماء exports الظاهرة، وأي إشارات داخل docs/config/registry أو مداخل runtime. صُنفت الملفات ضمن الحالات المطلوبة فقط: `delete-approved`, `allowlist-runtime`, `defer-route-entry`, `defer-public-api`, و`needs-owner-decision`.

### نتيجة التصنيف والتنفيذ

| الملف | التصنيف | قرار التنفيذ | ملاحظات الفحص |
|---|---|---|---|
| `src/components/Financial/InvoicesDashboard.tsx` | `delete-approved` | حُذف | فحص `rg` أظهر أنه legacy path محظور في `eslint.config.js` وموثق كـ dead legacy في ADR، دون import نشط داخل `src`. |
| بقية المرشحين | `allowlist-runtime` / `defer-route-entry` / `defer-public-api` / `delete-approved` للملفات المحذوفة سابقًا | لا حذف إضافي | التفاصيل الكاملة في `docs/reports/zero-reference-triage.md`. |

### أرقام Batch A.9

- الملفات المحذوفة ضمن Batch A.9: **1**.
- الملفات المؤجلة/المحتفظ بها ضمن Batch A.9: **67** ملفًا قائمًا.
- الملفات غير الموجودة مسبقًا والمصنفة كحذف منفذ سابقًا: **56**.
- الملفات المحذوفة تراكمياً بعد Batch A.9: **36**.
- العدد المتبقي من baseline الأصلي بعد احتساب الحذف والـ allowlist: **51** (`95 - 36 - 0 - 8 = 51`).

### أوامر التحقق

- `sed -n '1,160p' docs/reports/zero-reference-candidates-2026-05-05.md`
- `rg -n --pcre2 -f /tmp/zero-ref-rg-patterns.txt --glob '!node_modules' --glob '!dist' --glob '!build' --glob '!docs/reports/**' .`
- `rg -n --glob '!node_modules' --glob '!dist' --glob '!build' "InvoicesDashboard|withAuthorizationAndAudit|useCanvasKeyboardNav|useFileUpload|usePermission|useSnapEngine|fileProcessor\.worker|ArchivePanel|DepartmentPanel" docs components.json package.json eslint.config.js src/App.tsx src/pages src/components src/hooks src/workers`
- `npm run -s typecheck`
