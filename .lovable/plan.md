سأعالج المشكلة من جذورها وفق الخطة التالية:

1. **إصلاح مصدر الخلل في تحميل التوكنز**
   - نقل استيراد `src/styles/z-index.css` إلى أعلى `src/index.css` قبل `@tailwind`، لأن `@import` الحالي بعد قواعد Tailwind قد يجعل متغيرات `--z-*` غير محمّلة أو غير مضمونة.
   - التأكد أن كل كلاس مثل `z-popover` يحسب فعلياً إلى رقم وليس `auto`.

2. **إعادة ترتيب هرم z-index بشكل ثابت ومقروء**
   - اعتماد ترتيب واضح في `src/styles/z-index.css`:
     ```text
     base/canvas < workspace < sidebar/columns < project-panel < header < toolbar < dropdown < popover < modal < tooltip < toast
     ```
   - إبقاء اللوحات والسايدبار وعمود المشاريع في طبقات منخفضة، وعدم السماح لها بتجاوز طبقات القوائم والنوافذ.

3. **تصحيح علاقة الهيدر بالقوائم**
   - جعل الهيدر نفسه يستخدم `z-header` فقط.
   - جعل قوائم البحث/الإشعارات/المستخدم ونافذة الرسائل تستخدم `z-popover` أو `z-modal-*` حسب نوعها.
   - إزالة أي اعتماد خاطئ على أن `z-popover` داخل أب محبوس في stacking context منخفض.

4. **تنظيف المكونات التي تكسر الهرم**
   - مراجعة وإزالة القيم الرقمية المباشرة مثل `zIndex: 110` في `DepartmentsWorkspace` واستبدالها بتوكن مناسب.
   - مراجعة `MainContent`, `Sidebar`, `ProjectWorkspace`, `ProjectManagementBoard`, و`HeaderBar` للتأكد أن كل طبقة تستخدم توكن واحد صحيح.

5. **اختبار بصري/سلوكي أقوى من الاختبار الحالي**
   - تحديث اختبار `header-z-index.visual.test.tsx` حتى لا يكتفي بقراءة ملف التوكنز.
   - إضافة تحقق runtime من `getComputedStyle(document.documentElement).getPropertyValue('--z-popover')` ومن `getComputedStyle(popover).zIndex`.
   - اختبار فتح البحث/الإشعارات/الرسائل/المستخدم فوق السايدبار وعمود المشاريع ولوحة إدارة المشروع، مع التأكد أن computed z-index للقوائم أعلى من كل اللوحات.

6. **التحقق النهائي**
   - تشغيل اختبار Vitest المخصص بعد التعديل.
   - فحص preview إن أمكن بفتح القوائم فوق لوحة إدارة المشروع للتأكد أن المشكلة لا تعود.