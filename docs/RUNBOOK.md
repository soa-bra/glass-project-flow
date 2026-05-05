# Runbook — SoaBra v1.0

## الفحوصات الدورية
- **يوميًا**: مراجعة `event_dlq` — يجب أن يبقى فارغًا.
- **أسبوعيًا**: تشغيل Supabase linter للتأكّد من عدم ظهور تحذيرات أمنية جديدة.
- **شهريًا**: مراجعة الأدوار غير المستخدمة في `user_roles`.

## السيناريوهات

### 1) Edge Function تتوقّف
1. افحص لوجات `outbox-relay` و `engine-jobs-worker` في Supabase.
2. تأكّد من أن `pg_cron` لا يزال مفعّلًا: `SELECT * FROM cron.job;`
3. أعد نشر الـ Function عبر `supabase/functions/<name>`.

### 2) Realtime لا يحدّث لوحة المحركات
- تأكّد من أن `engine_jobs` ضمن `supabase_realtime` publication.
- أعد تحميل الصفحة (يفشل subscription في حال فقد الاتصال).

### 3) مستخدم لا يملك صلاحية متوقّعة
1. تحقّق من `user_roles` — يجب أن يحتوي السجلّ المطلوب.
2. تحقّق من `role_permissions` — تأكّد من ربط الإذن بالدور.
3. استخدم RPC `has_permission(user_id, code)` للاختبار.

### 4) أداء بطيء
- تحقّق من React Query staleTime (مضبوط على 30s افتراضيًا في `App.tsx`).
- تأكّد من أن lazy loading يعمل (Workspaces مقسّمة عبر `React.lazy`).

## Rollback
كل migration في `supabase/migrations/` قابلة للعكس يدويًا عبر Supabase SQL editor.
احتفظ بنسخة من الـ migration السابقة قبل أي تطبيق.
