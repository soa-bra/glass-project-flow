# Step 09 Testing Evidence Policy

- التاريخ: 2026-05-04
- النطاق: جميع claims المتعلقة بنتائج lint/typecheck/test/smoke/runtime.

## Mandatory Rule
1. يمنع توثيق أي نتيجة على أنها **Passed** بدون دليل مرفق قابل للتدقيق داخل المستودع أو CI logs.

## Accepted Evidence
1. رابط job/run في CI مع log ظاهر للحكم النهائي.
2. ملف output محفوظ داخل `docs/recovery/evidence/` أو artifact CI قابل للتنزيل.
3. أمر التنفيذ الفعلي + timestamp + exit code.

## Prohibited Claims
1. "Passed" بدون مخرجات فعلية.
2. "Executed in pipeline" بدون reference للـ run ID أو log.
3. نسب نجاح لا يمكن إعادة التحقق منها.

## Enforcement
1. أي PR يضيف/يعدل وثائق recovery يجب أن يتضمن قسم Testing Evidence.
2. إذا تعذر التشغيل بيئيًا، توثق الحالة كـ `⚠️` مع سبب التعذر بدل الادعاء بالنجاح.

## Closure Impact
1. هذه السياسة تعتبر حاكمة لتحديثات Step 09 وما بعدها.
