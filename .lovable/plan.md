
# P1 Root Blocker Repair — Plan

نطاق ملزم: Auth bypass + جلسة حقيقية + owner role + onError واضح + اختبار Project/Audit فقط.

> ملاحظة فحص فعلي: `auth.users = 2`، `user_roles owners = 0`، `profiles = 0`.
> `handle_new_user` trigger أُضيف بعد إنشاء المستخدمين، لذا backfill إلزامي.

---

## 1. تعديل `src/components/auth/ProtectedRoute.tsx`

استبدال الثابت الصلب بمنطق بيئي آمن:

```ts
const AUTH_DISABLED =
  import.meta.env.VITE_DISABLE_AUTH === "true" && import.meta.env.DEV;

if (AUTH_DISABLED) {
  console.warn("[ProtectedRoute] ⚠️ AUTH DISABLED via VITE_DISABLE_AUTH=true. Never enable in production.");
}
```

- الافتراضي: المصادقة مفعَّلة (المتغير غير موجود في `.env`).
- شرط `import.meta.env.DEV` يضمن استحالة التعطيل في build إنتاجي حتى لو سُرّب المتغير.
- باقي منطق الحارس (loading / Navigate to /auth) يبقى كما هو.

## 2. AuthContext / AuthPage

**فحصت كلاهما — لا تعديل مطلوب**:
- `AuthContext` يلتزم النمط الصحيح: `onAuthStateChange` قبل `getSession()`.
- `AuthPage` يستخدم `signInWithPassword` و`signUp` مع `emailRedirectTo`.
- `signOut` متاح. لا يوجد bypass ثانوي للجلسة.

## 3. Migration: Backfill profiles + أوّل owner (idempotent)

ملف migration واحد:

```sql
-- 1) Profiles backfill: لكل مستخدم في auth.users بدون profile
INSERT INTO public.profiles (user_id, display_name)
SELECT u.id,
       COALESCE(u.raw_user_meta_data->>'display_name', split_part(u.email, '@', 1))
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE p.user_id IS NULL;

-- 2) Owner backfill: فقط إذا لم يوجد أي owner عالمي
--    يُمنح للمستخدم الأقدم. idempotent عبر WHERE NOT EXISTS.
INSERT INTO public.user_roles (user_id, role, scope_type)
SELECT u.id, 'owner'::app_role, 'global'::role_scope_type
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE role = 'owner' AND scope_type = 'global'
)
ORDER BY u.created_at ASC
LIMIT 1
ON CONFLICT (user_id, role) DO NOTHING;

-- 3) team_member لباقي المستخدمين الموجودين بدون أي دور
INSERT INTO public.user_roles (user_id, role, scope_type)
SELECT u.id, 'team_member'::app_role, 'global'::role_scope_type
FROM auth.users u
LEFT JOIN public.user_roles ur
  ON ur.user_id = u.id AND ur.scope_type = 'global'
WHERE ur.user_id IS NULL
ON CONFLICT (user_id, role) DO NOTHING;
```

ضمانات:
- لا يكرر أدوارًا (`ON CONFLICT DO NOTHING` على `unique(user_id, role)`).
- لا يمنح owner للجميع — فقط لأقدم مستخدم وفقط في غياب أي owner.
- آمن لإعادة التشغيل.

## 4. تعديل `src/components/ProjectWorkspace.tsx`

إضافة `onError` صريح لـ `useCreateProject` و`useUpdateProject`:

```ts
import { toast } from "sonner";

createProject.mutate(uiCreateInputToCentral({...}), {
  onSuccess: (created) => {
    toast.success(`تم إنشاء المشروع: ${created.name}`);
    void AuditService.log({...});
  },
  onError: (err) => {
    console.error("[ProjectWorkspace] createProject failed:", err);
    toast.error("تعذّر إنشاء المشروع", {
      description: err instanceof Error ? err.message : "خطأ غير معروف",
    });
  },
});
```

نفس النمط لـ `handleProjectUpdated`. نقطتا تعديل فقط داخل ملف واحد.

## 5. خطوات الاختبار التنفيذية (بعد الإصلاح)

أ. تأكد أن `.env` لا يحتوي `VITE_DISABLE_AUTH=true`.
ب. التطبيق يحوّل إلى `/auth` عند فتح `/`.
ج. تسجيل دخول بأحد المستخدمَين الموجودَين.
د. التحقق برمجيًا (psql عبر tools المتاحة):

```sql
-- بعد إنشاء مشروع من UI:
select id, name, owner_id, created_at from projects order by created_at desc limit 5;
select action, resource_type, resource_id, actor_id, created_at
  from audit_events order by created_at desc limit 5;
select user_id, role from user_roles where role='owner';
```

معايير النجاح المُلزمة:
- `projects` يحتوي صفًا، `owner_id` يساوي `auth.uid()` للمستخدم الذي سجّل الدخول.
- `audit_events` يحتوي حدث `central.project.create`.
- `user_roles` يحتوي owner واحد على الأقل.
- `select * from projects` بصلاحية المستخدم لا يُرجع فارغًا (RLS يعمل).

## 6. المخرجات بعد التنفيذ

سأعرض في رسالة الإكمال:
1. الملفات المعدَّلة (3 فقط: ProtectedRoute.tsx, ProjectWorkspace.tsx, migration).
2. شرح كل تعديل.
3. نتائج الاختبار من قراءة فعلية للجداول.
4. أي blocker متبقٍّ — وإلا فالتأكيد بأن Flow 1 و Flow 6 يعملان.

## ما سيتم تجنّبه صراحة

- ❌ Tasks / DepartmentTabs / Invoice / Board.
- ❌ `lib/prisma`, `modules/*`, `api/*`.
- ❌ أي schema جديد، أي refactor.
- ❌ تغيير AuthContext/AuthPage (سليمان).

## ملاحظة هامّة للمستخدم

اختبار "إنشاء مشروع من UI" يتطلّب تفاعلًا بشريًا في المتصفح بعد الإصلاح. سأستخدم browser tool لمحاكاة تسجيل الدخول وإنشاء مشروع، ثم أتحقق من DB. إذا فشل تسجيل الدخول لسبب خارج الكود (كلمة مرور غير معروفة)، سأبلّغك للقيام بذلك يدويًا ثم أتحقق من النتائج في DB.
