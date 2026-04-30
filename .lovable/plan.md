سبب الصفحة البيضاء الحالي لم يعد سطر `@import` في `index.css`؛ تم حذفه فعلاً. بعد فحص المعاينة وسجلات المتصفح ظهر الخطأ الفعلي الآن:

```text
ReferenceError: process is not defined
at node_modules/.vite/deps/prom-client.js
```

هذا يعني أن كود الواجهة يستورد `prom-client`، وهي مكتبة مخصصة لـ Node/الخادم وتستخدم `process` و`zlib`، لذلك تنهار في المتصفح قبل أن يرسم React الواجهة.

المسار الذي يسحبها إلى الواجهة هو:

```text
PlanningCanvas.tsx
→ features/planning/domain/commands/index.ts
→ commandProcessor.ts
→ planning/integration/telemetry/collaborationMetrics.ts
→ infra/metrics.ts
→ prom-client
```

## خطة الإصلاح

1. تعديل `src/features/planning/domain/commands/index.ts`
   - إيقاف تصدير `commandProcessor` من الـ public API المستخدم داخل `PlanningCanvas`.
   - إبقاء تصدير `executeCommandWithAuthorization` فقط، لأن `PlanningCanvas` يحتاجه ولا يحتاج `commandProcessor`.
   - هذا يقطع مسار استيراد `prom-client` من التطبيق عند تحميل الصفحة.

2. إضافة حماية للقياسات في `src/features/planning/integration/telemetry/collaborationMetrics.ts`
   - جعل استيراد `@/infra/metrics` ديناميكياً/مشروطاً أو استبداله بواجهة آمنة no-op في المتصفح.
   - الهدف: حتى لو استُخدم `processDomainCommand` لاحقاً في كود الواجهة، لا يعود `prom-client` للمتصفح.

3. عدم تغيير `CanvasElement.tsx` حالياً
   - راجعت imports الحالية فيه وهي سليمة بالنسبة للخطأ الحالي.
   - وجود `require(...)` داخل مكوّن React ليس سبب الصفحة البيضاء الحالية، ويمكن تنظيفه لاحقاً إن أردت، لكنه ليس مانع تشغيل الآن.

4. التحقق بعد التنفيذ
   - إعادة فتح المعاينة وفحص console.
   - التأكد أن خطأ `process is not defined` و`prom-client/zlib` اختفى.
   - التأكد أن الصفحة تعرض واجهات التطبيق بدلاً من الصفحة البيضاء.

## ملاحظة

تحذيرات `postMessage` القادمة من `cdn.gpteng.co/lovable.js` ليست سبب المشكلة؛ هي تحذيرات من بيئة المعاينة وليست من كود التطبيق.

إذا وافقت، سأطبق التعديلين أعلاه ثم أتحقق من المعاينة.