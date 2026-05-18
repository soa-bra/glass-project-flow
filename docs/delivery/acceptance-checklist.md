# Checklist القبول — Tabs / Boxes / Backend Alignment

> هذا الملف هو مرجع القبول الرسمي للتسليم. أي تبويب أو صندوق أو نافذة **لا يُوسم Accepted** حتى يطابق صفّه المقابل في ملفات `docs/*tabs-boxes-backend.md` حرفيًا (tabCode / boxRef / API / Service / Permissions / States).

## 1) مصادر المواصفات المعتمدة (Source of Truth)

- `docs/DepartmentsWorkspace-tabs-boxes-backend.md`
- `docs/ProjectManagementBoard-tabs-boxes-backend.md`
- `docs/SettingsWorkspace-tabs-boxes-backend.md`
- `docs/ArchiveWorkspace-tabs-boxes-backend.md`

## 2) سياسة القبول الإلزامية

لكل عنصر مواصفة (Tab/Box/Modal) يجب التحقق من جميع البنود التالية قبل وضع الحالة `accepted`:

- [ ] وجود المكوّن فعليًا في الواجهة (صفحة/تبويب/صندوق/نافذة).
- [ ] وجود `tabCode` أو `boxRef` مطابق تمامًا لسجل المواصفة.
- [ ] وجود API أو service مرتبط مطابق (endpoint + service scope).
- [ ] وجود صلاحيات مطبقة ومطابقة (read/write/approve/manage... حسب الصف).
- [ ] وجود حالات `loading` و `error` و `empty`.
- [ ] وجود سيناريو قبول يدوي موثّق وقابل لإعادة التنفيذ.

> قاعدة حاكمة: لا يُعتمد أي عنصر بالاعتماد على UI فقط؛ القبول يجب أن يثبت الربط مع طبقة الخدمة والصلاحيات والحالات التشغيلية.

## 3) نموذج التحقق لكل صف مواصفة

انسخ هذا الصف لكل عنصر من ملفات المواصفات الأربعة أعلاه:

| Workspace | Dashboard | نوع العنصر | tabCode / boxRef | مرجع المواصفة (ملف + صف) | المكوّن موجود | التطابق (tabCode/boxRef) | API/Service | Permissions | Loading | Error | Empty | سيناريو قبول يدوي | الحالة |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| مثال: Departments | HRDashboard | Box | `HRDashboard.employees.table` | `docs/DepartmentsWorkspace-tabs-boxes-backend.md` | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | `pending` |

### تعريف الحالة

- `pending`: لم يكتمل التحقق.
- `blocked`: يوجد مانع (يوثّق السبب + owner).
- `failed`: تحقق منفذ لكن عنصر/ربط غير مطابق.
- `accepted`: جميع أعمدة التحقق مكتملة + التطابق مثبت مع صف المواصفة.

## 4) Storybook / صفحة المعاينة الداخلية

المشروع يدعم Storybook، لذا يجب اعتماد معاينة لكل Box/State ضمن توثيق الاختبار المرئي:

- مسار القصص الحالي: `src/stories/`
- قصص أساسية موجودة (مثال):
  - `src/stories/BaseBox.stories.tsx`
  - `src/stories/BaseBadge.stories.tsx`
  - `src/stories/BaseStatsCard.stories.tsx`

### متطلبات المعاينة

لكل عنصر رئيسي (خاصة الصناديق) أضف/تحقق من Story يغطي:

- الحالة الطبيعية (default/ready).
- حالة التحميل (loading).
- حالة الخطأ (error).
- حالة الفراغ (empty).
- حالة الصلاحيات (authorized vs unauthorized إذا كانت مطبقة على UI).

> إذا كان عنصر معين لا يمكن تمثيله مباشرة في Storybook، تُضاف صفحة داخلية محمية (internal preview route) مع نفس الحالات ويُشار لمسارها في عمود “سيناريو قبول يدوي”.

## 5) خطة الاختبارات اللاحقة (عند التحول من QA read-only إلى Code mode)

عند الانتقال إلى Code mode، يجب فتح مهام اختبار تنفيذية حسب النطاق التالي:

### 5.1 Unit Tests (Transformers / Services)
- [ ] اختبارات المحوّلات (mapping/parsing/normalization) لكل payload مرتبط بالتبويبات المعتمدة.
- [ ] اختبارات service layer للتعامل مع الاستجابات الناجحة وحالات الخطأ.
- [ ] اختبارات الصلاحيات على مستوى helper/guard إن كانت منطقية في الطبقة.

### 5.2 Component Tests (Boxes)
- [ ] اختبار rendering للصندوق حسب data states.
- [ ] اختبار سلوك loading/error/empty.
- [ ] اختبار ظهور/إخفاء الإجراءات حسب permissions.
- [ ] اختبار انبعاث الأحداث/الأزرار التي تفتح modals أو تنفذ save.

### 5.3 E2E (Save Flows / Modals)
- [ ] مسارات الحفظ الأساسية (create/update) مع تأكيد API call الصحيح.
- [ ] فتح/إغلاق النوافذ (modals/drawers) والتحقق من البيانات المعروضة.
- [ ] حالات الفشل (4xx/5xx) مع رسائل الخطأ واسترجاع الحالة.
- [ ] إعادة التحميل/التحديث بعد الحفظ والتحقق من تماسك الجدول/القوائم.

## 6) قواعد رفض القبول (Hard Rejection Rules)

يرفض القبول مباشرة في الحالات التالية:

- عدم تطابق `tabCode` أو `boxRef` مع صف المواصفة.
- API endpoint أو service scope مختلف عن المواصفة.
- غياب صلاحية واحدة مطلوبة في الصف المرجعي.
- غياب حالة من الحالات الثلاث: loading/error/empty.
- عدم وجود سيناريو قبول يدوي واضح أو غير قابل للتكرار.
- محاولة تعليم عنصر `accepted` بدون مرجع صف واضح في `docs/*tabs-boxes-backend.md`.

## 7) آلية التنفيذ العملية لفريق QA/Delivery

1. اختر Workspace واحدًا.
2. استخرج كل صفوف التبويبات/الصناديق/النوافذ منه.
3. عبّئ جدول التحقق بندًا بندًا.
4. اربط كل نتيجة بدليل (رابط Storybook، لقطة، log API، أو فيديو قصير).
5. لا تغيّر الحالة إلى `accepted` إلا بعد اكتمال جميع أعمدة التحقق.
6. راجع عيّنة عشوائية Cross-check بواسطة مراجع ثانٍ قبل الإغلاق النهائي.
