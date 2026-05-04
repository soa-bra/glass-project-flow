# الحزمة التنفيذية لاستعادة الانضباط الهندسي

## 1) تطبيع المدخلات (Phase 1: Normalize Inputs)

1. الخطوة 1: **حوكمة (governance)**.
2. الخطوة 2: **وضوح سير/نطاق التشغيل (workflow clarity)**.
3. الخطوة 3: **حوكمة (governance)**.
4. الخطوة 4: **المخطط/البيانات (schema/data)**.
5. الخطوة 5: **معمارية (architecture)**.
6. الخطوة 6: **عزل الشيفرة (code isolation)**.
7. الخطوة 7: **حوكمة (governance)**.
8. الخطوة 8: **تحقق وقت التشغيل (runtime verification)**.
9. الخطوة 9: **فرض الجودة (quality enforcement)**.
10. الخطوة 10: **المخطط/البيانات (schema/data)**.
11. الخطوة 11: **الصلاحيات (permissions)**.
12. الخطوة 12: **فرض الجودة (quality enforcement)**.
13. الخطوة 13: **التحكم في الأولويات/الباك لوج (backlog control)**.
14. الخطوة 14: **وضوح سير العمل (workflow clarity)**.
15. الخطوة 15: **التحكم في الباك لوج (backlog control)**.
16. الخطوة 16: **حوكمة (governance)**.
17. الخطوة 17: **التحكم بالانتقال (transition control)**.

## 2) مخطط التبعيات (Phase 2: Dependency Graph)

### الخطوات المكتملة التأسيسية
1. الخطوة 1 تؤسس المرجعية المعمارية الرسمية.
2. الخطوة 2 تؤسس حدود النطاق النشط.
3. الخطوة 3 تؤسس مرجع الإغلاق (DoD) التشغيلي.

### تبعيات الخطوات غير المكتملة على المكتملة
1. 4 يعتمد على 1 + 2 + 3.
2. 5 يعتمد على 1 + 2.
3. 6 يعتمد على 1 + 2 + 5.
4. 7 يعتمد على 1 + 2 + 3 + 4 + 5 + 6.
5. 8 يعتمد على 2 + 4 + 5 + 10 + 11.
6. 9 يعتمد على 5 + 6 + 8.
7. 10 يعتمد على 2 + 4.
8. 11 يعتمد على 4 + 10 + 5.
9. 12 يعتمد على 3 + 4 + 5 + 9.
10. 13 يعتمد على 3 + 12 + 15.
11. 14 يعتمد على 4 + 5 + 8.
12. 15 يعتمد على 3 + 12 + 14.
13. 16 يعتمد على 1 + 3 + 5 + 7 + 9.
14. 17 يعتمد على 4 + 5 + 6 + 8 + 9 + 15.

### خطوات مانعة لاستئناف التطوير الآمن (Blockers)
1. 4
2. 5
3. 6
4. 8
5. 9
6. 10
7. 11
8. 15
9. 17

### خطوات التحقق/الإغلاق (Validation/Closure)
1. 8 (تحقق تشغيلي مباشر)
2. 9 (بوابات منع الانحدار)
3. 17 (قرار الانتقال الرسمي)

## 3) هيكلة البرنامج (Phase 3: Program Scaffolding)

## Executive Overview
برنامج الاستعادة يثبت مرجعيات الحقيقة، يفرض حدود المعمارية النشطة، يعزل الإرث، يغلق فجوات المكونات النشطة، ويمنع استئناف أي تطوير وظيفي قبل استيفاء شروط انتقال رسمية قابلة للقياس.

## Dependency Map
1. **مرجعيات**: 1 ← 2 ← 3.
2. **شفافية الحقيقة والبنية**: 4 + 5 + 10 + 11.
3. **ضبط المنظومة البرمجية**: 6 + 7 + 9 + 16.
4. **التحقق والتثبيت التشغيلي**: 8 + 12 + 14.
5. **إدارة التنفيذ والانتقال**: 13 + 15 + 17.

## Master Step Index
1) القرار المعماري، 2) نطاق التطبيق، 3) DoD Matrix، 4) Source of Truth Matrix، 5) Active Architecture، 6) عزل legacy، 7) معايير التطوير، 8) Runtime Verification، 9) Quality Gates، 10) Baseline Schema، 11) صلاحيات النظام، 12) إغلاق الفجوات، 13) ترتيب الدومينات، 14) Workflow Matrix، 15) Backlog إصلاحي، 16) قواعد الاستكمال، 17) نقطة الانتقال.

## Recovery Sequencing Logic
1. تثبيت المرجعيات (1-3) [مكتمل ومحكوم].
2. توثيق الحقيقة والبنية (4-5-10-11).
3. عزل الإرث ومنع الانحدار (6-7-9-16).
4. تحقق تشغيلي وإغلاق فجوات (8-12-14).
5. ترتيب وتنفيذ إصلاحي (13-15).
6. قرار الانتقال الرسمي (17).

# 1 تثبيت القرار المعماري الحالي
## Executive Intent
تثبيت قرار رسمي ملزم بأن المسار المعماري النشط قابل للإصلاح دون إعادة بناء شاملة.
## Why This Step Exists
لمنع إعادة فتح نقاشات بنيوية تعطل التنفيذ وتسمح بازدواجية مصادر الحقيقة.
## Strategic Outcome
مرجعية قرار واحدة تحكم جميع قرارات التنفيذ والاعتماد.
## Scope
### Includes
1. قرار رسمي مكتوب ومعتمد.
2. تعريف المسارات النشطة المعتمدة للقرار.
3. نفي اعتماد shadow ORM وlegacy كمصدر حقيقة.
### Excludes
1. أي إعادة تصميم معمارية جذرية جديدة.
2. أي توسيع نطاق خارج التطبيق النشط.
## Current Status Interpretation
مكتملة تنفيذيًا؛ تتحول إلى أصل حوكمي يجب فرضه وتدقيق الالتزام به.
## Execution Assumptions
1. الوثيقة المرجعية موجودة وقابلة للوصول.
## Inputs Required
1. قرار الإدارة التقنية.
2. سجل المسارات النشطة.
## Deliverables
1. وثيقة قرار معماري موقعة.
2. سجل اعتماد قرار في قنوات الفريق.
## Execution Approach
### Preparation
1. مراجعة نص القرار وتثبيت نسخة رقمية نهائية.
### Implementation
1. نشر القرار في مستودع التوثيق الداخلي.
### Validation
1. التحقق من ربط القرار في قوالب RFC/PR.
### Adoption / Enforcement
1. رفض أي مقترح يخالف القرار دون استثناء موثق.
### Closure
1. اعتماد القرار كمرجع إلزامي في دليل التطوير.
## Detailed Execution Tasks
1. تعيين مالك قرار معماري.
2. إصدار معرف وثيقة ثابت.
3. ربط القرار بسياسة المراجعة الهندسية.
## Roles and Ownership
1. CTO: اعتماد نهائي.
2. Lead Architect: صيانة الوثيقة.
3. EM: فرض الالتزام يوميًا.
## Dependencies
1. لا توجد تبعيات سابقة (خطوة تأسيسية مكتملة).
## Risks
1. تفسير انتقائي للقرار.
## Mitigation Plan
1. إضافة بنود منع الاستثناء غير الموثق.
## Acceptance Criteria
1. وجود وثيقة معتمدة بإصدار ثابت.
2. وجود دليل استخدام إلزامي داخل عمليات المراجعة.
## Verification Method
1. تدقيق شهري على عينات PR للتأكد من الاستشهاد بالقرار.
## Downstream Impact
تمكين 4 و5 و7 و16 من العمل على مرجعية مستقرة.
## Recommended Priority and Timing
أولوية حرجة دائمة؛ مراجعة حوكمة أسبوعية.
## Operational Notes
لا تعاد صياغة القرار إلا عبر Change Control رسمي.
## Definition of Successful Completion
قرار معتمد ومفروض تشغيليًا دون خروقات غير مصححة.

# 2 تعريف نطاق التطبيق النشط
## Executive Intent
حصر ما هو نشط فعليًا وما هو خارج النطاق التشغيلي.
## Why This Step Exists
لمنع صرف الجهد على مسارات غير فعالة وخلط الإرث بالنشط.
## Strategic Outcome
حدود تنفيذ واضحة لجميع الفرق.
## Scope
### Includes
1. قائمة نهائية للمكونات النشطة.
2. قوائم استبعاد صريحة للـlegacy/dead/mock/export-only.
3. تعريف DoD التشغيلي داخل النطاق.
### Excludes
1. أي مكوّن خارج المسارات النشطة.
2. أعمال تحسين تجميلي خارج النطاق.
## Current Status Interpretation
مكتملة تنفيذيًا؛ يجب الحفاظ عليها كمرجع نطاق ملزم.
## Execution Assumptions
1. القائمة النهائية منشورة داخل المستودع.
## Inputs Required
1. جرد المكونات.
2. نتائج تشغيل فعلية.
## Deliverables
1. وثيقة نطاق نشط مع حالات include/exclude.
## Execution Approach
### Preparation
1. مراجعة توافق النطاق مع القرار المعماري (1).
### Implementation
1. تثبيت النطاق في README هندسي أو دليل داخلي.
### Validation
1. فحص كل Epic جديد مقابل حدود النطاق.
### Adoption / Enforcement
1. رفض أي تذكرة لا تحدد انتماءها للنطاق.
### Closure
1. قفل الوثيقة عبر آلية إصدار.
## Detailed Execution Tasks
1. تحديث خريطة المكونات مرة كل Sprint.
2. وسم المكونات المستبعدة بوضوح.
3. تفعيل مراجعة Scope Check في التخطيط.
## Roles and Ownership
1. Product Tech Lead.
2. Engineering Manager.
## Dependencies
1. يعتمد على 1 (مكتمل).
## Risks
1. تسلل مهام خارج النطاق.
## Mitigation Plan
1. بوابة موافقة Planning Gate إلزامية.
## Acceptance Criteria
1. كل تذكرة تنفيذ تحتوي وسم in-scope/out-of-scope.
## Verification Method
1. تدقيق backlog أسبوعي.
## Downstream Impact
مدخل إلزامي لـ4 و5 و10 و12.
## Recommended Priority and Timing
مفعل فورًا وبشكل مستمر.
## Operational Notes
تغييرات النطاق تتطلب موافقة قيادة تقنية/منتج مشتركة.
## Definition of Successful Completion
عدم وجود تنفيذ خارج النطاق دون استثناء معتمد.

# 3 بناء DoD Matrix كاملة
## Executive Intent
تثبيت معيار إغلاق موحد لكل مكوّن أساسي.
## Why This Step Exists
لإنهاء التقدير الذاتي غير المنضبط لحالة الإكمال.
## Strategic Outcome
مرجع حالة تنفيذي دقيق (Done/Partial/Not Started/Blocked).
## Scope
### Includes
1. DoD لكل مكوّن.
2. الحالة الحالية.
3. Source of Truth.
4. التبعيات والأولوية.
### Excludes
1. تقديرات عامة غير قابلة للتحقق.
## Current Status Interpretation
مكتملة إنشائيًا؛ يلزم فرضها كمدخل إلزامي للتخطيط والتنفيذ.
## Execution Assumptions
1. المصفوفة تحتوي كل المكونات الأساسية النشطة.
## Inputs Required
1. قائمة المكونات النشطة من الخطوة 2.
## Deliverables
1. DoD Matrix معتمدة ومؤرشفة.
## Execution Approach
### Preparation
1. تدقيق جودة تعريفات Done.
### Implementation
1. ربط المصفوفة بأدوات التخطيط.
### Validation
1. اختبار اتساق الحالة مع الواقع التشغيلي.
### Adoption / Enforcement
1. منع بدء عمل دون DoD مطابق في المصفوفة.
### Closure
1. اعتماد نسخة baseline مرقمة.
## Detailed Execution Tasks
1. إضافة owner لكل صف.
2. إضافة تاريخ آخر تحديث.
3. إضافة حقل دليل التحقق.
## Roles and Ownership
1. Domain Leads.
2. PMO/EM.
## Dependencies
1. يعتمد على 1 و2 (مكتملان).
## Risks
1. تقادم الحالة.
## Mitigation Plan
1. تحديث دوري إلزامي كل Sprint.
## Acceptance Criteria
1. كل مكوّن نشط له صف كامل دون حقول فارغة حرجة.
## Verification Method
1. مراجعة أسبوعية بين Leads وQA.
## Downstream Impact
أساس 12 و13 و15 و16.
## Recommended Priority and Timing
مفعل دائمًا.
## Operational Notes
أي تغيير حالة يتطلب دليل تحقق مرفق.
## Definition of Successful Completion
المصفوفة مرجع تشغيل فعلي وليست وثيقة أرشيفية.

# 4 توثيق Source of Truth Matrix
## Executive Intent
إزالة أي غموض حول المصدر الفعلي للبيانات في كل Domain.
## Why This Step Exists
لمنع ازدواجية القراءة/الكتابة والتضارب بين active/legacy/mock.
## Strategic Outcome
طبقة حقيقة موثقة وقابلة للتدقيق عبر جميع الدومينات.
## Scope
### Includes
1. الجدول/الخدمة/الهوك/الواجهة المعتمدة.
2. active path.
3. legacy path.
4. mock path.
### Excludes
1. اقتراح بدائل معمارية جديدة.
## Current Status Interpretation
غير مكتملة؛ خطوة مانعة (Blocker).
## Execution Assumptions
1. الدومينات الأساسية محددة مسبقًا.
## Inputs Required
1. DoD Matrix.
2. نطاق التطبيق النشط.
3. جرد المسارات في الشيفرة.
## Deliverables
1. Source of Truth Matrix معتمدة.
2. سجل تعارضات تمت معالجتها.
## Execution Approach
### Preparation
1. استخراج جميع نقاط data access لكل domain.
### Implementation
1. تعيين مصدر الحقيقة المعتمد لكل عملية CRUD.
2. وسم المسارات legacy/mock صراحة.
### Validation
1. مراجعة مشتركة بين Architect وDomain Owners.
### Adoption / Enforcement
1. إلزام ربط كل PR بتحديث المصفوفة عند تغيير المصدر.
### Closure
1. تجميد baseline بإصدار مرقّم.
## Detailed Execution Tasks
1. بناء جدول domain-by-domain.
2. مطابقة كل hook مع service وجدول خلفي.
3. توثيق أي فجوة أو تعارض كمهمة إصلاح.
## Roles and Ownership
1. Lead Architect.
2. Backend Lead.
3. Frontend Lead.
## Dependencies
1. 1,2,3.
## Risks
1. نسيان مسارات فرعية غير ظاهرة.
## Mitigation Plan
1. استخدام تدقيق آلي للاستيرادات ونقاط الوصول.
## Acceptance Criteria
1. 100% من الدومينات النشطة موثقة.
2. لا يوجد domain بمصدر حقيقة غير محدد.
## Verification Method
1. تدقيق تقاطعي يدوي + script inventory.
## Downstream Impact
مدخل حرج لـ5 و7 و8 و11 و14 و16 و17.
## Recommended Priority and Timing
P0 خلال أول Sprint استعادة.
## Operational Notes
أي تضارب غير محلول يرفع كـblocker فوري.
## Definition of Successful Completion
توثيق كامل ودقيق لمصدر الحقيقة بدون استثناءات مجهولة.

# 5 توثيق Active Architecture Baseline
## Executive Intent
تثبيت صورة معمارية تشغيلية واضحة للطبقات والحدود.
## Why This Step Exists
لمنع اختراق الطبقات وتوليد مسارات موازية غير محكومة.
## Strategic Outcome
مرجع هندسي واحد لمسار التنفيذ المعتمد UI→hook→service→Supabase.
## Scope
### Includes
1. Auth.
2. Supabase.
3. services.
4. hooks.
5. active UI surfaces.
### Excludes
1. legacy architecture diagrams.
## Current Status Interpretation
غير مكتملة؛ مانع رئيسي.
## Execution Assumptions
1. Source of Truth Matrix جاهزة أو قريبة الإغلاق.
## Inputs Required
1. نتائج الخطوة 4.
2. جرد الطبقات الفعلية في الكود.
## Deliverables
1. مخطط baseline.
2. دليل boundaries and allowed calls.
## Execution Approach
### Preparation
1. استخراج خرائط الاستدعاء الحالية.
### Implementation
1. رسم معماري نصي/مرئي بسيط قابل للتحديث.
2. تحديد ممنوعات التداخل الطبقي.
### Validation
1. جلسة walkthrough هندسية مع الفريق.
### Adoption / Enforcement
1. اعتماد baseline ضمن قوالب التصميم الفني.
### Closure
1. إصدار نسخة رسمية وربطها بسياسات التطوير.
## Detailed Execution Tasks
1. توثيق نقاط الدخول لكل طبقة.
2. توثيق عقود hook/service.
3. ربط كل surface بمصدر الحقيقة.
## Roles and Ownership
1. Architect.
2. FE/BE Leads.
## Dependencies
1. 1,2,4.
## Risks
1. وجود تدفقات مختلطة غير موثقة.
## Mitigation Plan
1. تشغيل فحص تبعيات imports وعكسها على المخطط.
## Acceptance Criteria
1. كل مكوّن نشط يمكن تتبعه عبر الطبقات الأربع.
## Verification Method
1. مراجعة تصميم + مطابقة عينات كود.
## Downstream Impact
أساس 6 و7 و9 و16 و17.
## Recommended Priority and Timing
P0 مباشرة بعد 4.
## Operational Notes
أي مكوّن جديد خارج baseline يرفض حتى يمر Change Control.
## Definition of Successful Completion
مخطط baseline منشور ومستخدم فعليًا في المراجعات.

# 6 عزل legacy code رسميًا
## Executive Intent
منع الرجوع البرمجي للمسارات القديمة.
## Why This Step Exists
لإيقاف إعادة إدخال أخطاء الإرث إلى المسار النشط.
## Strategic Outcome
حدود كود آمنة تمنع الاستيراد من legacy/dead paths.
## Scope
### Includes
1. وسم legacy/dead.
2. منع استيرادات جديدة.
3. تنظيف barrels/exports القديمة.
4. lint/policy مانعة.
### Excludes
1. حذف تاريخي شامل لكل إرث غير مؤثر الآن.
## Current Status Interpretation
غير مكتملة؛ blocker للجودة والاستقرار.
## Execution Assumptions
1. baseline المعماري معروف.
## Inputs Required
1. نتائج 5.
2. قائمة مسارات legacy.
## Deliverables
1. قواعد lint/import boundaries.
2. قائمة exports نظيفة.
## Execution Approach
### Preparation
1. inventory للمسارات القديمة المستخدمة حاليًا.
### Implementation
1. وسم المجلدات legacy.
2. إزالة exports غير مستخدمة.
3. فرض no-restricted-imports.
### Validation
1. تشغيل lint boundary checks.
### Adoption / Enforcement
1. fail CI عند أي استيراد legacy جديد.
### Closure
1. تقرير خلو المسار النشط من ارتباطات legacy.
## Detailed Execution Tasks
1. تعريف regex للمسارات المحظورة.
2. تحديث eslint rules.
3. إصلاح الاستيرادات المخالفة.
## Roles and Ownership
1. Frontend Platform Owner.
2. Code Quality Owner.
## Dependencies
1. 5 أساسًا، و2 لتحديد النطاق.
## Risks
1. كسر بناء بسبب اعتماد خفي.
## Mitigation Plan
1. مسار انتقال staged مع استثناءات زمنية محددة.
## Acceptance Criteria
1. صفر استيراد legacy في المسارات النشطة.
2. CI يفشل تلقائيًا عند المخالفة.
## Verification Method
1. lint + dependency scan.
## Downstream Impact
يمكّن 7 و9 و17.
## Recommended Priority and Timing
P0 بعد 5 مباشرة.
## Operational Notes
الاستثناءات تكون مؤقتة ومؤرخة ومرتبطة بتذاكر إزالة.
## Definition of Successful Completion
عزل مفعّل تقنيًا وحوكميًا ومثبت في CI.

# 7 تثبيت معايير التطوير الجديدة
## Executive Intent
تحويل قواعد التطوير إلى سياسات تنفيذ إلزامية.
## Why This Step Exists
لمنع ولادة فوضى معمارية جديدة أثناء الإصلاح.
## Strategic Outcome
بوابة حوكمة مسبقة لأي feature جديدة.
## Scope
### Includes
1. اشتراط Source of Truth وDoD وactive path.
2. حظر mocks/local truth/parallel services.
3. فرض نمط UI→hook→service→Supabase.
### Excludes
1. استثناءات غير موثقة.
## Current Status Interpretation
غير مكتملة؛ عنصر ضبط حوكمي حرج.
## Execution Assumptions
1. 4 و5 و6 متاحة.
## Inputs Required
1. وثائق 3 و4 و5.
2. سياسات مراجعة PR.
## Deliverables
1. Engineering Standard Policy.
2. PR Checklist إلزامي.
## Execution Approach
### Preparation
1. صياغة القواعد بصيغة قابلة للتدقيق.
### Implementation
1. إدراج القواعد في القوالب والإجراءات.
### Validation
1. تجربة Pilot على 3 PRs متتالية.
### Adoption / Enforcement
1. عدم قبول أي PR لا يثبت الامتثال.
### Closure
1. اعتماد policy رسمي ومؤرشف.
## Detailed Execution Tasks
1. تحديث CONTRIBUTING.
2. تحديث PR template.
3. تدريب الفريق على القواعد.
## Roles and Ownership
1. Engineering Manager.
2. Tech Leads.
## Dependencies
1. 1,2,3,4,5,6.
## Risks
1. تطبيق شكلي بلا التزام فعلي.
## Mitigation Plan
1. قياس نسبة PRs الممتثلة أسبوعيًا.
## Acceptance Criteria
1. 100% من PRs الجديدة تحتوي حقول الامتثال الثلاثة.
## Verification Method
1. تدقيق PR checklist آلي/يدوي.
## Downstream Impact
يدعم 12 و13 و16 و17.
## Recommended Priority and Timing
P1 بعد إغلاق 4-6.
## Operational Notes
عدم الامتثال يرفع كحادثة حوكمية.
## Definition of Successful Completion
المعايير مطبقة إلزاميًا ومقاسة دوريًا.

# 8 تنفيذ Runtime Verification حقيقي
## Executive Intent
إثبات تشغيلي للمسارات الأساسية بدل الافتراض النظري.
## Why This Step Exists
لأن اكتمال الوثائق دون تحقق تشغيل يترك مخاطر خفية.
## Strategic Outcome
دليل تشغيل معتمد لسلامة workflows الحرجة.
## Scope
### Includes
1. Login.
2. Project C/R.
3. Task C/R/U.
4. Invoice C/R/U.
5. Department shell read.
### Excludes
1. اختبارات غير مرتبطة بالنطاق النشط.
## Current Status Interpretation
غير مكتملة؛ خطوة تحقق مانعة قبل الانتقال.
## Execution Assumptions
1. بيئة اختبار مماثلة للإنتاج متاحة.
## Inputs Required
1. حسابات اختبار.
2. بيانات baseline.
3. سيناريوهات تحقق معتمدة.
## Deliverables
1. تقرير Runtime Verification.
2. أدلة نجاح/فشل (logs, screenshots, test runs).
## Execution Approach
### Preparation
1. تعريف سيناريو لكل مسار مع preconditions.
### Implementation
1. تنفيذ يدوي منظم أو E2E آلي.
### Validation
1. مراجعة النتائج مقابل DoD وSource of Truth.
### Adoption / Enforcement
1. اعتماد التقرير كمرجع release gate.
### Closure
1. إغلاق جميع failures الحرجة أو تحويلها blockers backlog.
## Detailed Execution Tasks
1. إعداد test accounts حسب الأدوار.
2. تشغيل السيناريوهات الخمسة.
3. تسجيل زمن التنفيذ ونتائج كل خطوة.
## Roles and Ownership
1. QA Lead.
2. Domain Leads.
3. Release Manager.
## Dependencies
1. 2,4,5,10,11.
## Risks
1. نتائج إيجابية كاذبة بسبب بيانات mock.
## Mitigation Plan
1. منع mocks تمامًا في بيئة التحقق.
## Acceptance Criteria
1. نجاح 100% للمسارات الأساسية أو توثيق blocker لكل فشل.
## Verification Method
1. إعادة تشغيل مستقل بواسطة QA ثانٍ.
## Downstream Impact
شرط مباشر لـ9 و14 و17.
## Recommended Priority and Timing
P0 بعد تثبيت baseline البيانات/الصلاحيات.
## Operational Notes
أي فشل auth/project/task/invoice/dept يمنع الانتقال.
## Definition of Successful Completion
تقرير تحقق قابل لإعادة التنفيذ ويؤكد سلامة المسارات الأساسية.

# 9 تثبيت Quality Gates دائمة
## Executive Intent
إنشاء حواجز منع انحدار تقنية غير قابلة للتجاوز.
## Why This Step Exists
لمنع دمج تغييرات تكسر المسارات الحرجة.
## Strategic Outcome
CI gate يحمي auth/project/task/invoice/department shell.
## Scope
### Includes
1. Typecheck إلزامي.
2. Lint للمسارات النشطة.
3. Smoke tests أساسية.
4. قواعد منع merge عند الفشل.
### Excludes
1. اختبارات موسعة غير ضرورية لبوابة الاستعادة.
## Current Status Interpretation
غير مكتملة؛ blocker سلامة تشغيل.
## Execution Assumptions
1. عزل legacy بدأ أو اكتمل.
## Inputs Required
1. سيناريوهات smoke.
2. إعدادات CI.
## Deliverables
1. Pipeline محدث.
2. سياسة Merge Gate موثقة.
## Execution Approach
### Preparation
1. تحديد الحد الأدنى للاختبارات الإلزامية.
### Implementation
1. تفعيل commands في CI.
2. ربط حالة checks بحق merge.
### Validation
1. تجربة PR تجريبية تمر وأخرى تفشل.
### Adoption / Enforcement
1. منع override إلا بموافقة قيادة مكتوبة.
### Closure
1. إعلان تفعيل gate رسميًا.
## Detailed Execution Tasks
1. تعريف job typecheck.
2. تعريف job lint active paths.
3. تعريف smoke test suite.
## Roles and Ownership
1. DevOps/Platform.
2. QA.
3. Engineering Manager.
## Dependencies
1. 5,6,8.
## Risks
1. بطء pipeline يدفع لتعطيلها.
## Mitigation Plan
1. تقسيم jobs وتخزين cache فعال.
## Acceptance Criteria
1. لا merge مع check أحمر.
2. تغطية smoke للمسارات الخمسة الأساسية.
## Verification Method
1. تدقيق إعدادات branch protection + سجلات CI.
## Downstream Impact
يمكن 12 و16 و17.
## Recommended Priority and Timing
P0 بعد 8 مباشرة.
## Operational Notes
تعديل gate يخضع Change Control.
## Definition of Successful Completion
بوابات الجودة فعالة ومفروضة دون تجاوزات غير موثقة.

# 10 توثيق Baseline Schema رسمي
## Executive Intent
تجميد مرجع schema الحالي قبل أي تغيير بنيوي جديد.
## Why This Step Exists
لمنع migrations عشوائية فوق أساس غير موثق.
## Strategic Outcome
Baseline schema واضح يدعم التتبع والتوافق.
## Scope
### Includes
1. snapshot schema.
2. الجداول الأساسية.
3. العلاقات الفعلية.
4. الجداول المستخدمة في المسار النشط.
5. إيقاف migrations الجديدة مؤقتًا.
### Excludes
1. إعادة تصميم البيانات.
## Current Status Interpretation
غير مكتملة؛ blocker للبيانات والتحقق.
## Execution Assumptions
1. صلاحية الوصول لقاعدة البيانات متاحة.
## Inputs Required
1. قاعدة البيانات الحالية.
2. قائمة الدومينات النشطة.
## Deliverables
1. ملف baseline schema.
2. Data model map مختصر.
## Execution Approach
### Preparation
1. تحديد نافذة تجميد migrations.
### Implementation
1. استخراج snapshot.
2. توثيق العلاقات والجداول المستخدمة.
### Validation
1. مطابقة مع Source of Truth Matrix.
### Adoption / Enforcement
1. عدم قبول migration جديدة قبل إقرار baseline.
### Closure
1. فك التجميد بعد اعتماد baseline رسميًا.
## Detailed Execution Tasks
1. export schema DDL.
2. تعليم جداول in-use/out-of-scope.
3. توثيق constraints الحرجة.
## Roles and Ownership
1. DB Owner.
2. Backend Lead.
## Dependencies
1. 2 و4.
## Risks
1. استخراج snapshot غير متزامن مع التطبيق.
## Mitigation Plan
1. أخذ snapshot في نافذة ثابتة مع tag إصدار.
## Acceptance Criteria
1. baseline موثق وموقّع من backend + architect.
## Verification Method
1. تدقيق تقاطعي مع الاستعلامات الفعلية.
## Downstream Impact
أساس 8 و11 و17.
## Recommended Priority and Timing
P0 بالتوازي مع 4/5.
## Operational Notes
أي migration طارئة خلال التجميد تتطلب استثناء حوكمي.
## Definition of Successful Completion
وجود baseline schema موثق ومعتمد وقابل للمقارنة.

# 11 توثيق صلاحيات النظام
## Executive Intent
تثبيت مصفوفة صلاحيات رسمية متوافقة مع RLS وسلوك التطبيق.
## Why This Step Exists
لتفادي فجوات أمنية وتضارب بين الواجهة وقاعدة البيانات.
## Strategic Outcome
نموذج صلاحيات قابل للتحقق والتنفيذ.
## Scope
### Includes
1. من يرى/ينشئ/يعدل/يعتمد.
2. mapping أدوار ↔ عمليات.
3. ربط صلاحيات التطبيق بـRLS.
### Excludes
1. إدارة هوية خارج النظام المعني.
## Current Status Interpretation
غير مكتملة؛ blocker أمني وتشغيلي.
## Execution Assumptions
1. baseline schema وsource of truth متوفران.
## Inputs Required
1. الأدوار الرسمية.
2. سياسات RLS الحالية.
3. workflows الأساسية.
## Deliverables
1. Permission Matrix رسمية.
2. تقرير فجوات صلاحيات.
## Execution Approach
### Preparation
1. جرد endpoints/actions حسب الدور.
### Implementation
1. بناء matrix مفصلة.
2. مواءمة السياسات مع RLS.
### Validation
1. اختبارات وصول سالب/موجب.
### Adoption / Enforcement
1. إلزام مراجعة أمان عند أي تعديل صلاحيات.
### Closure
1. اعتماد matrix من الأمن + الهندسة.
## Detailed Execution Tasks
1. تعريف الإجراءات لكل domain.
2. ربط كل إجراء بسياسة قاعدة بيانات.
3. توثيق حالات deny المتوقعة.
## Roles and Ownership
1. Security Lead.
2. Backend Lead.
3. QA.
## Dependencies
1. 4,10,5.
## Risks
1. عدم تطابق app checks مع RLS.
## Mitigation Plan
1. توحيد المصدر في مصفوفة واحدة واختبارات دورية.
## Acceptance Criteria
1. كل إجراء حرج له قاعدة سماح/منع موثقة ومختبرة.
## Verification Method
1. automated permission tests + مراجعة RLS.
## Downstream Impact
شرط لـ8 و17.
## Recommended Priority and Timing
P0 قبل runtime verification النهائي.
## Operational Notes
أي صلاحية افتراضية غير موثقة تعتبر ثغرة.
## Definition of Successful Completion
مصفوفة صلاحيات معتمدة ومتحققة اختباريًا ومطبقة فعليًا.

# 12 إغلاق الفجوات التقنية في المكونات النشطة
## Executive Intent
تحويل حالات Partial إلى Done ضمن المكونات النشطة.
## Why This Step Exists
لأن الاستمرار مع فجوات أساسية يضاعف الدين التقني ويمنع الثقة.
## Strategic Outcome
استقرار وظيفي للمكونات المؤثرة بنيويًا.
## Scope
### Includes
1. مراجعة كل مكوّن Partial.
2. إصلاح فجوات الإكمال.
3. منع توسيع domain قبل الإغلاق.
### Excludes
1. features جديدة خارج الإصلاح.
## Current Status Interpretation
غير مكتملة؛ عمل تنفيذي مباشر.
## Execution Assumptions
1. DoD Matrix محدثة.
## Inputs Required
1. قائمة Partial من الخطوة 3.
2. نتائج quality/runtime checks.
## Deliverables
1. إغلاقات موثقة لكل فجوة.
2. تحديث حالة المكونات إلى Done.
## Execution Approach
### Preparation
1. ترتيب الفجوات حسب التأثير البنيوي.
### Implementation
1. تنفيذ إصلاحات موجهة DoD-first.
### Validation
1. تمرير runtime + quality gates.
### Adoption / Enforcement
1. منع فتح domain جديد قبل إغلاق partials الحرجة.
### Closure
1. تحديث رسمي لـDoD Matrix.
## Detailed Execution Tasks
1. تفكيك كل gap إلى مهام قابلة للاختبار.
2. تنفيذ الإصلاح.
3. ربط دليل الإغلاق بالمصفوفة.
## Roles and Ownership
1. Domain Owners.
2. QA.
## Dependencies
1. 3,4,5,9.
## Risks
1. توسع نطاق غير مقصود أثناء الإصلاح.
## Mitigation Plan
1. Change freeze على feature expansion.
## Acceptance Criteria
1. انخفاض Partial الحرجة إلى 0 أو بقاءها كblockers موثقة.
## Verification Method
1. مراجعة حالة DoD + نتائج CI/E2E.
## Downstream Impact
يمهد 13 و15 و17.
## Recommended Priority and Timing
P1 بعد تثبيت gates.
## Operational Notes
كل فجوة مغلقة يجب أن تحمل رابط تحقق.
## Definition of Successful Completion
المكونات النشطة الحرجة بلغت Done بمعيار موحد.

# 13 ترتيب الدومينات حسب الأولوية التنفيذية
## Executive Intent
بناء تسلسل تنفيذ يقلل المخاطر ويزيد توحيد النظام.
## Why This Step Exists
لمنع اختيار أعمال ثقيلة تنظيميًا قبل الأساس البنيوي.
## Strategic Outcome
Roadmap تنفيذية domain-first مبنية على الأثر.
## Scope
### Includes
1. ترتيب الدومينات المتبقية.
2. معيار أثر بنيوي.
3. شروط دخول domain جديد.
### Excludes
1. تقديرات غير مرتبطة بالتبعيات الفعلية.
## Current Status Interpretation
غير مكتملة؛ خطوة تخطيط تنفيذ.
## Execution Assumptions
1. الفجوات الحرجة مرئية بوضوح.
## Inputs Required
1. DoD matrix.
2. backlog الإصلاحي.
## Deliverables
1. أولوية domains مصنفة ومبررة.
## Execution Approach
### Preparation
1. تعريف نموذج scoring (impact/dependency/risk).
### Implementation
1. تطبيق scoring على كل domain.
### Validation
1. مراجعة الترتيب مع القيادة التقنية.
### Adoption / Enforcement
1. منع القفز بين الدومينات دون قرار موثق.
### Closure
1. نشر roadmap تنفيذية.
## Detailed Execution Tasks
1. بناء جدول تقييم.
2. احتساب ترتيب نهائي.
3. ربط كل domain بشروط الدخول.
## Roles and Ownership
1. Tech Leadership.
2. PM/EM.
## Dependencies
1. 3,12,15.
## Risks
1. انحياز الأولوية لضغط أعمال غير بنيوية.
## Mitigation Plan
1. قفل معايير الاختيار واعتمادها مسبقًا.
## Acceptance Criteria
1. وجود ترتيب نهائي لكل domain مع rationale واضح.
## Verification Method
1. تدقيق consistency مع التبعيات المسجلة.
## Downstream Impact
يضبط 15 ومرحلة ما بعد 17.
## Recommended Priority and Timing
P2 بعد تقدم ملموس في 12 و15.
## Operational Notes
تحديث الأولويات دوريًا لكن عبر نفس النموذج.
## Definition of Successful Completion
خطة domains قابلة للتنفيذ وتمنع العشوائية.

# 14 توثيق Workflow Matrix
## Executive Intent
تثبيت خريطة تشغيلية لكل Workflow رئيسي.
## Why This Step Exists
لتفادي إعادة الغموض عند التوسع أو التحقيق في الأعطال.
## Strategic Outcome
رؤية end-to-end لحالة كل workflow ونقاط فشله.
## Scope
### Includes
1. بداية workflow.
2. المكونات الداخلة.
3. مصدر الحقيقة.
4. نقاط الفشل.
5. حالة الاكتمال.
### Excludes
1. workflows خارج النطاق النشط.
## Current Status Interpretation
غير مكتملة؛ تمكّن التحكم التشغيلي.
## Execution Assumptions
1. source of truth موثقة.
## Inputs Required
1. نتائج 4 و5 و8.
## Deliverables
1. Workflow Matrix شاملة للمسارات الحرجة.
## Execution Approach
### Preparation
1. اختيار workflows الأساسية المعتمدة.
### Implementation
1. توثيق كل workflow بمدخلات/مخرجات وحالات فشل.
### Validation
1. مطابقة matrix مع نتائج runtime verification.
### Adoption / Enforcement
1. استخدام matrix في triage وplanning.
### Closure
1. اعتماد النسخة baseline.
## Detailed Execution Tasks
1. رسم التسلسل لكل workflow.
2. تحديد نقاط التحكم.
3. وسم الحالة الفعلية (Done/Partial).
## Roles and Ownership
1. QA Lead.
2. Domain Leads.
## Dependencies
1. 4,5,8.
## Risks
1. توثيق غير متزامن مع الواقع.
## Mitigation Plan
1. تحديث matrix بعد كل تغيير مؤثر.
## Acceptance Criteria
1. كل workflow حرج موثق end-to-end مع failure points.
## Verification Method
1. تمرين incident walkthrough على matrix.
## Downstream Impact
يغذي 15 و17.
## Recommended Priority and Timing
P1 بعد الجولة الأولى من runtime verification.
## Operational Notes
matrix هي مرجع التحليل عند الأعطال، لا وثيقة نظرية.
## Definition of Successful Completion
Workflow Matrix محدثة وموظفة تشغيلياً في التحقيقات والتخطيط.

# 15 إنشاء Backlog إصلاحي حقيقي
## Executive Intent
تحويل الفجوات إلى خطة عمل إصلاحية مصنفة وقابلة للتنفيذ.
## Why This Step Exists
لفصل أعمال الاستعادة عن توسعة المنتج ومنع خلط الأولويات.
## Strategic Outcome
Backlog إصلاحية شفافة تحكم التقدم نحو الجاهزية.
## Scope
### Includes
1. تحويل كل gap إلى تذكرة.
2. التصنيف: blocker/foundational/important/later.
3. فصل إصلاح الكود عن features.
### Excludes
1. تجميع مبهم لمهام غير قابلة للقياس.
## Current Status Interpretation
غير مكتملة؛ blocker إداري للانتقال.
## Execution Assumptions
1. الفجوات التقنية موثقة.
## Inputs Required
1. مخرجات 12 و14 و8 و9.
## Deliverables
1. Backlog إصلاحي مصنف.
2. لوحة تنفيذ زمنية.
## Execution Approach
### Preparation
1. تعريف قواعد تصنيف موحدة.
### Implementation
1. إنشاء التذاكر وربطها بمصادر الخلل.
### Validation
1. مراجعة التصنيف من القيادة التقنية.
### Adoption / Enforcement
1. منع إدراج features في backlog الإصلاحية.
### Closure
1. اعتماد baseline backlog برقم إصدار.
## Detailed Execution Tasks
1. جمع gaps من كل domain.
2. تصنيفها حسب الخطورة والتبعية.
3. تحديد owner وتاريخ استحقاق لكل عنصر.
## Roles and Ownership
1. EM/PMO.
2. Tech Leads.
## Dependencies
1. 3,12,14.
## Risks
1. تضخم backlog بعناصر غير إصلاحية.
## Mitigation Plan
1. سياسة قبول backlog مع معايير دخول واضحة.
## Acceptance Criteria
1. 100% من الفجوات الحرجة ممثلة بتذاكر blocker/foundational.
## Verification Method
1. تدقيق عينة أسبوعية للتصنيف.
## Downstream Impact
أساس 13 و17.
## Recommended Priority and Timing
P0 قبل قرار الانتقال.
## Operational Notes
أي عنصر بلا owner أو موعد يعتبر غير صالح.
## Definition of Successful Completion
Backlog إصلاحية دقيقة، مصنفة، ومُدارة ضد مؤشرات تقدم.

# 16 تعريف قواعد الاستكمال بعد الإصلاح
## Executive Intent
تثبيت قواعد منع الانتكاس بعد إنهاء الاستعادة.
## Why This Step Exists
لضمان أن أي تطوير لاحق لا يعيد خلق الفوضى السابقة.
## Strategic Outcome
إطار استمرارية تطوير مضبوط بالمرجعيات.
## Scope
### Includes
1. البدء من DoD.
2. الالتزام بالمعمارية النشطة.
3. منع خلق source of truth جديد.
4. منع إعادة mocks للمسار النشط.
### Excludes
1. أي استثناء دائم غير محكوم.
## Current Status Interpretation
غير مكتملة؛ طبقة حوكمة ما بعد الإصلاح.
## Execution Assumptions
1. المعايير والسياسات السابقة معتمدة.
## Inputs Required
1. 1,3,5,7,9.
## Deliverables
1. Post-Recovery Completion Rules.
2. آلية تدقيق امتثال دورية.
## Execution Approach
### Preparation
1. تحويل القواعد إلى checklist قابلة للقياس.
### Implementation
1. إدراجها في lifecycle التطوير.
### Validation
1. اختبار الالتزام عبر Sprint تجريبي.
### Adoption / Enforcement
1. بوابة قبول رسمية قبل البدء بأي feature.
### Closure
1. اعتماد السياسة من القيادة التقنية.
## Detailed Execution Tasks
1. صياغة القاعدة + دليل التحقق.
2. ربطها بقوالب التخطيط والـPR.
3. إعداد مؤشرات امتثال شهرية.
## Roles and Ownership
1. Engineering Governance Owner.
2. Tech Leads.
## Dependencies
1. 1,3,5,7,9.
## Risks
1. تآكل الالتزام بمرور الوقت.
## Mitigation Plan
1. مراجعات امتثال دورية مع تصعيد رسمي.
## Acceptance Criteria
1. كل feature جديدة تمر checklist القواعد قبل التنفيذ.
## Verification Method
1. تدقيق PMO + مراجعة عينات PR/Epics.
## Downstream Impact
شرط استدامة بعد 17.
## Recommended Priority and Timing
P1 قبل وبعد الانتقال مباشرة.
## Operational Notes
هذه القواعد تمثل guardrail دائم وليس نشاطًا مؤقتًا.
## Definition of Successful Completion
قواعد الاستكمال مفعلة ومقاسة ومطبقة بدون استثناءات صامتة.

# 17 اعتماد نقطة انتقال رسمية
## Executive Intent
إصدار قرار رسمي بأن النظام جاهز للعودة إلى تطوير الميزات.
## Why This Step Exists
لمنع الانتقال المبكر قبل اكتمال أسس السلامة الهندسية.
## Strategic Outcome
Transition Gate واضح ومحكوم بمتطلبات موضوعية.
## Scope
### Includes
1. تحقق شروط الجاهزية السبعة المذكورة.
2. قرار اعتماد رسمي من القيادة.
3. تفعيل قاعدة ما بعد الانتقال.
### Excludes
1. إطلاق features قبل اجتياز gate.
## Current Status Interpretation
غير مكتملة؛ خطوة إغلاق البرنامج.
## Execution Assumptions
1. جميع الأدلة المطلوبة متاحة وقابلة للتدقيق.
## Inputs Required
1. مخرجات 4,5,6,8,9,15 إضافة 3.
## Deliverables
1. محضر Transition Readiness.
2. قرار Go/No-Go موثق.
## Execution Approach
### Preparation
1. تجميع حزمة الأدلة من الخطوات الشرطية.
### Implementation
1. عقد لجنة جاهزية وتقييم الشروط.
### Validation
1. التحقق المستقل من الأدلة من QA/Platform.
### Adoption / Enforcement
1. منع أي Epic feature جديد قبل Go رسمي.
### Closure
1. نشر القرار وربطه بقواعد 16.
## Detailed Execution Tasks
1. قائمة تحقق انتقال رسمية.
2. تقييم كل شرط (pass/fail/evidence).
3. إصدار قرار نهائي وتوقيعات الملاك.
## Roles and Ownership
1. CTO (صاحب قرار نهائي).
2. Architect.
3. QA Lead.
4. EM/PMO.
## Dependencies
1. 3,4,5,6,8,9,15.
## Risks
1. ضغط تجاري لتمرير انتقال غير جاهز.
## Mitigation Plan
1. قاعدة No Evidence = No Transition.
## Acceptance Criteria
1. تحقق 100% من شروط الانتقال السبعة بأدلة قابلة للتدقيق.
## Verification Method
1. تدقيق لجنة مستقلة + سجل Go/No-Go.
## Downstream Impact
يفتح مرحلة تطوير ميزات جديدة بشكل منضبط.
## Recommended Priority and Timing
آخر خطوة P0 لإغلاق برنامج الاستعادة.
## Operational Notes
القرار ثنائي: Go أو No-Go، لا حالات وسط.
## Definition of Successful Completion
قرار انتقال رسمي مع أدلة مكتملة وتفعيل ضوابط ما بعد الانتقال.

## 5) Consistency Pass
1. **اتساق المصطلحات:** تثبيت المصطلحات (DoD, Source of Truth, Active Path, Legacy, Transition Gate) عبر جميع الخطوات.
2. **عدم التعارض:** لا توجد خطوة تسمح ببدء feature قبل 17؛ 16 تقنن ما بعد 17 فقط.
3. **اتساق التبعيات:** كل خطوة غير مكتملة مرتبطة بمدخلات تأسيسية واضحة.
4. **قابلية الاختبار:** جميع معايير القبول محددة بقيود كمية أو حالات pass/fail.
5. **المخرجات التشغيلية:** كل خطوة تحتوي Deliverables تشغيلية قابلة للأرشفة والتدقيق.
6. **منع العمومية:** جميع الأقسام تصف مهام تنفيذ وحوكمة قابلة للتطبيق المباشر.

## 6) Final Readiness Synthesis

### Recovery Readiness Conditions
1. اكتمال وتفعيل: 4، 5، 6، 8، 9، 10، 11، 15.
2. تحديث DoD Matrix (3) بحالات واقعية بعد الإغلاق الفني (12).
3. تفعيل قواعد الاستكمال (16) قبل أول موجة features جديدة.

### Blocking Gaps
1. غياب Source of Truth Matrix.
2. غياب Active Architecture Baseline.
3. عدم عزل legacy بشكل تقني مفروض.
4. عدم اكتمال runtime verification.
5. عدم تفعيل quality gates في CI.
6. عدم تجميد baseline schema + matrix صلاحيات.
7. عدم وجود backlog إصلاحي مصنف.

### Recommended Implementation Order
1. 4 → 5 → 10 → 11.
2. 6 → 7.
3. 8 → 9.
4. 12 → 14.
5. 15 → 13.
6. 16.
7. 17.

### Governance Warning
أي بدء تطوير ميزات قبل اجتياز الخطوة 17 يعد خرق حوكمة من الفئة الحرجة ويجب تسجيله كـPolicy Breach مع إجراء تصحيحي فوري.

### Formal Transition Rule
لا يسمح بإطلاق أي مسار تطوير ميزات جديدة ما لم يصدر قرار **Go** رسمي موثق في الخطوة 17، مدعومًا بأدلة تحقق لكل شرط جاهزية، ومع تفعيل قواعد الخطوة 16 كضابط دائم.

## افتراضات التنفيذ
1. المصطلحات التشغيلية (domain, active path, DoD) موحدة داخل المؤسسة.
2. الفريق يملك صلاحيات الوصول لأدوات CI وقاعدة البيانات ووثائق الهندسة.
3. هناك جهة حوكمة تقنية قادرة على فرض قرارات Go/No-Go.
