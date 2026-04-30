# RBAC — نموذج الصلاحيات

## الجداول

| الجدول | الدور |
|---|---|
| `profiles` | بيانات المستخدم الإضافية، تُنشأ تلقائيًا عبر trigger `handle_new_user`. |
| `user_roles` | إسناد دور لمستخدم ضمن نطاق (`global` / `department` / `project` / …) مع `expires_at` اختياري. |
| `permissions` | كتالوج الأذونات (`code`, `module`, `description`). |
| `role_permissions` | ربط دور بأذونات. |

## الأدوار (`app_role`)

تم تعريف 18 دورًا مؤسسيًا في enum `app_role`. الأدوار الفاعلة في v1.0:

- `owner` — تجاوز كامل (`is_owner` يعيد true).
- `team_member` — الافتراضي لكل مستخدم جديد بعد الأول.
- بقية الأدوار محجوزة لمراحل ما بعد v1.0 (admin panels, JIT…).

أول مستخدم يُسجَّل تلقائيًا كـ `owner` عبر `handle_new_user`.

## الدوال (SECURITY DEFINER)

كلها `STABLE` و `SET search_path = public, pg_temp` و `EXECUTE TO authenticated` فقط:

| Function | الغرض |
|---|---|
| `has_role(uid, role, scope_type, scope_id)` | فحص دور دقيق. |
| `is_owner(uid)` | اختصار لـ `owner @ global`. |
| `has_permission(uid, code)` | يقرأ `role_permissions`؛ owner دائمًا true. |

## نمط RLS الموحَّد

كل جدول central يستخدم النمط:

```sql
USING ((owner_id = auth.uid()) OR is_owner(auth.uid()))
WITH CHECK ((owner_id = auth.uid()) OR is_owner(auth.uid()))
```

استثناءات:
- `tasks` تسمح للـ `assignee_id` و owner المشروع المرتبط.
- `audit_events` يقرأها صاحب الحدث + owner فقط.
- `event_outbox` و `event_dlq` يقرأها owner فقط.

## الواجهة الأمامية

- `useAuth()` — جلسة Supabase + `user`.
- `usePermission(code)` — يستعلم `has_permission` ويُخزّن في React Query.
- `<ProtectedRoute>` — يحوّل غير المصادَقين إلى `/auth`.
- `withAuthorizationAndAudit(...)` — Command Gateway (انظر `CENTRAL_SERVICES.md`).

## ⚠️ تعطيل مؤقت أثناء التطوير

`AUTH_DISABLED_FOR_DEV = true` في `src/components/auth/ProtectedRoute.tsx` يتجاوز الحماية. **يجب** إعادته إلى `false` قبل أي إطلاق.

## مؤجَّل لما بعد v1.0

- Approval Workflow متدرّج، JIT/Break-Glass، SCIM/SSO، SIEM/PagerDuty.
- لوحة Admin Roles موجودة (`src/features/admin-roles`) لكنها أساسية فقط.
