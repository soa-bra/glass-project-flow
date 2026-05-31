# Batch A Closure — 2026-05-07

## Final closure summary

- Regenerated the zero-reference candidate report after the previously removed 22 files.
- Created a fresh triage report and classified every current candidate into the requested buckets.
- Deleted only the files present in the final `delete-approved` list.

## Final closure numbers

| Metric | Count |
| --- | ---: |
| baseline | 95 |
| already removed | 22 |
| final removed | 2 |
| allowlisted | 2 |
| deferred | 70 |
| remaining | 0 |

## Final deleted files

- `src/modules/hr/hr.service.ts`
- `src/services/kanban.ts`

## Triage bucket counts

- `delete-approved`: **2**
- `allowlist-runtime`: **2**
- `defer-route-entry`: **1**
- `defer-public-api`: **29**
- `defer-test-or-tooling`: **35**
- `needs-owner-decision`: **5**

## Verification commands

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
