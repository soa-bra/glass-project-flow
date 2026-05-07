# Batch A Closure — 2026-05-05

## ملخص الإغلاق

- عدد الملفات المحذوفة: **3**
- عدد الملفات المؤجلة: **0**
- عدد الملفات في allowlist: **8**
- العدد المتبقي من قائمة الـ 95: **84**

## تفاصيل الحساب

اعتمادًا على baseline الأصلي `95` مرشّحًا:

- baseline: `95`
- المحذوف: `3`
- المؤجل: `0`
- allowlist: `8`
- المتبقي للمراجعة/المعالجة: `95 - 3 - 0 - 8 = 84`

## إعادة فحص import-graph

تمت إعادة تشغيل فحص import-graph وتحديث ملف المرشحين:

- `docs/reports/zero-reference-candidates-2026-05-05.md`

> ملاحظة: نتيجة إعادة الفحص الحالية تعتمد على نفس المنهج heuristic لربط `@/` و relative imports وقد تنتج baseline مختلفًا عن تقرير الـ95 الأصلي.

## Batch A.2 — 2026-05-07

### نطاق الفحص اليدوي

تم فحص الملفات التالية يدويًا قبل الحذف، مع البحث عن الاستخدامات المباشرة وغير المباشرة بالاسم داخل `src/App.tsx` و`src/pages/*` و`src/components/*`، بالإضافة إلى فحص عام لسلاسل الأسماء في المستودع لاستبعاد وجود registry/config يعتمد على أسماء المكوّنات كسلاسل نصية.

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

## Batch A.3 — Route/navigation audit for requested panels — 2026-05-07

### نطاق الفحص

تمت مراجعة نقاط الدخول والتوجيه المطلوبة صراحة:

- `src/App.tsx`: يحتوي فقط على routes عامة لـ `/auth` و`/join/:token` و`/` المحمي وcatch-all، ولا توجد routes مباشرة للوحات Batch A أو dynamic route registry لهذه الأسماء.
- `src/pages/*`: صفحات `Index` و`AuthPage` و`JoinBoardPage` و`NotFound` لا تستورد اللوحات المطلوبة ولا تنشئ routes لها.
- `src/contexts/NavigationContext.tsx`: يدير `activeSection` و`selectedDepartment` و`selectedCustomer` فقط، ولا يحتوي registry ديناميكيًا لأسماء اللوحات.
- navigation/route config داخل `src/components`: مسار الأقسام الحالي يربط `hr` بـ`HRDashboard`، ويربط `research` بـ`KMPADashboard`، بينما لا توجد أي imports أو string registry للأسماء المحذوفة.

### نتيجة التصنيف المطلوبة

| الملف | التصنيف | قرار التنفيذ | ملاحظات route/navigation |
|---|---|---|---|
| `src/components/HRLite/HRLiteMainPanel.tsx` | `delete-approved` | لا إجراء حذف جديد؛ الملف غير موجود بالفعل | مدخل الموارد البشرية النشط هو `src/components/DepartmentTabs/HR/HRDashboard.tsx` عبر `FeatureDepartmentPanel`، ولا توجد route أو registry تشير إلى `HRLiteMainPanel`. |
| `src/components/KnowledgeBase/KnowledgeBaseMainPanel.tsx` | `delete-approved` | لا إجراء حذف جديد؛ الملف غير موجود بالفعل | مدخل المعرفة/البحث النشط هو `research` عبر `KMPADashboard`، ولا توجد route أو registry تشير إلى `KnowledgeBaseMainPanel`. |
| `src/components/Surveys/SurveysMainPanel.tsx` | `delete-approved` | لا إجراء حذف جديد؛ الملف غير موجود بالفعل | لا توجد route أو section مستقل باسم surveys؛ الاستخدامات الحالية للاستبيانات تظهر كقوالب/إجراءات داخل CRM وKMPA، وليس كلوحة `SurveysMainPanel`. |
| `src/components/kb/KnowledgeBaseOverview.tsx` | `delete-approved` | لا إجراء حذف جديد؛ الملف غير موجود بالفعل | لا توجد route أو registry تشير إلى `KnowledgeBaseOverview`؛ واجهة المعرفة الحالية مغطاة داخل `KMPADashboard` وArchive knowledge panel. |

### مهام ربط route

لم تُنشأ مهام ربط route جديدة؛ لم يظهر من الفحص أن أيًا من اللوحات الأربع مطلوبة لكنها غير مربوطة. الحالات النشطة لها بدائل مربوطة بالفعل (`HRDashboard` و`KMPADashboard` وArchive knowledge)، أو أنها ليست feature entry مستقلة في التوجيه الحالي.

### أوامر التحقق الإضافية

- `test ! -e src/components/HRLite/HRLiteMainPanel.tsx && test ! -e src/components/KnowledgeBase/KnowledgeBaseMainPanel.tsx && test ! -e src/components/Surveys/SurveysMainPanel.tsx && test ! -e src/components/kb/KnowledgeBaseOverview.tsx`
- `rg -n "HRLiteMainPanel|KnowledgeBaseMainPanel|SurveysMainPanel|KnowledgeBaseOverview" . -g '!node_modules' -g '!dist' -g '!build'`
- `rg -n "hr|HR|knowledge|Knowledge|survey|Survey|استبيان|معرفة|departments|activeSection|selectedDepartment|route:" src/App.tsx src/pages src/contexts src/components -g '!node_modules'`
