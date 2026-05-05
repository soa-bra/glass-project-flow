# Step 17 — تعطيل مؤقّت للمصادقة لأغراض التطوير

## الهدف
تمكين الدخول المباشر إلى التطبيق دون تسجيل دخول أثناء مرحلة التطوير، مع **الحفاظ الكامل** على بنية المصادقة (`AuthContext`, `useAuth`, `ProtectedRoute`, `AuthPage`, جداول `profiles`/`user_roles`، RLS) جاهزة لإعادة التفعيل بسطر واحد.

## آلية العمل
- مفتاح بيئة واحد: `VITE_DISABLE_AUTH=true` في `.env`.
- محمي بـ `import.meta.env.DEV` ⇒ **مستحيل تفعيله في build الإنتاج**.
- `ProtectedRoute` يعرض الأطفال مباشرة عند تفعيل المفتاح (موجود مسبقًا).
- `AuthPage` يحوّل إلى `/` فور تفعيل المفتاح فلا يظهر النموذج.
- يطبع تحذير في الـ console: `[ProtectedRoute] ⚠️ AUTH DISABLED ...`.

## الملفات المتأثرة
| الملف | التغيير |
|---|---|
| `.env` | إضافة `VITE_DISABLE_AUTH="true"` |
| `.env.example` | توثيق المفتاح بقيمة افتراضية `"false"` |
| `src/pages/AuthPage.tsx` | تحويل مبكر إلى `/` عند تفعيل المفتاح |
| `src/components/auth/ProtectedRoute.tsx` | (لا تغيير — يدعم المفتاح أصلًا) |

## ما لم يُمَس
`AuthContext`, `useAuth`, `usePermission`, `signIn/signUp/signOut`, نموذج الدخول/الاشتراك، مسارات `App.tsx`, جداول Supabase، سياسات RLS، دوال `has_permission`.

## الأثر التشغيلي
- جميع المسارات المحمية تفتح مباشرة.
- `useAuth().user === null` ⇒ أي استعلام يعتمد على `auth.uid()` سيفشل بسبب RLS (سلوك متوقع وموثَّق).
- مناسب للتطوير البصري فقط، **غير مناسب** لاختبار سيناريوهات الصلاحيات الفعلية.

## قائمة ما قبل التسليم (إعادة التفعيل)
1. حذف السطر `VITE_DISABLE_AUTH="true"` من `.env` (أو تعيينه `"false"`).
2. إعادة تشغيل dev server.
3. التحقق:
   - زيارة `/` تحوّل إلى `/auth`.
   - تسجيل الدخول يعمل ويعيد التوجيه.
   - اختفاء التحذير `AUTH DISABLED` من الـ console.
4. مراجعة `docs/RBAC.md` للتأكد من إزالة أي إشارة لوضع التطوير.

## مرجع
- المفتاح يُقرأ في `src/components/auth/ProtectedRoute.tsx` و `src/pages/AuthPage.tsx`.
- شرط `import.meta.env.DEV` يضمن السلامة في الإنتاج.
