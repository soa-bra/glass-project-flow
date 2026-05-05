## السبب
`ProtectedRoute` يدعم الفلاغ بالفعل، لكن:
1. `VITE_DISABLE_AUTH` **غير موجود** في `.env` → الفلاغ يبقى false → الحراسة فعّالة.
2. حتى لو فُعّل، الزيارة المباشرة لـ `/auth` ستظل تعرض نموذج الدخول لأن `AuthPage` لا يحترم الفلاغ.

## التغييرات

### 1) `.env` — إضافة سطر
```
VITE_DISABLE_AUTH=true
```

### 2) `.env.example` — توثيق
قسم جديد:
```
# تعطيل المصادقة محليًا (DEV فقط). احذف قبل التسليم.
VITE_DISABLE_AUTH="false"
```

### 3) `src/pages/AuthPage.tsx`
في أعلى الكومبوننت، قبل أي شيء:
```tsx
const AUTH_DISABLED =
  import.meta.env.DEV && import.meta.env.VITE_DISABLE_AUTH === "true";
if (AUTH_DISABLED) return <Navigate to="/" replace />;
```
بهذا، `/auth` تُحوِّل فورًا إلى `/` ولا يظهر النموذج.

### 4) ملف توثيق `docs/recovery/step-17-temporary-auth-disable.md` (جديد)
- السبب، النطاق، التفعيل/التعطيل بسطر واحد.
- **قائمة ما قبل التسليم**: حذف السطر من `.env`، إعادة تشغيل، التحقق من إعادة التحويل إلى `/auth`.
- ضمان `import.meta.env.DEV` يمنع الإنتاج.

### 5) `docs/RBAC.md`
استبدال فقرة "تعطيل مؤقت" الحالية بإشارة دقيقة إلى `VITE_DISABLE_AUTH` ورابط الخطوة 17.

## ما لن يُمَس
`AuthContext`, `useAuth`, `usePermission`, `App.tsx`, نموذج الدخول/التسجيل، جداول/سياسات Supabase — كل شيء يبقى جاهزًا لإعادة التفعيل بحذف سطر واحد.

## الأثر بعد التنفيذ
- أي مسار محمي يدخل مباشرة بدون تسجيل.
- `/auth` يُحوِّل فورًا إلى `/`.
- `useAuth().user === null` — استدعاءات تعتمد على `auth.uid()` ستفشل بـ RLS (متوقّع وموثَّق).
- العودة للوضع الإنتاجي = حذف `VITE_DISABLE_AUTH` من `.env`.
