# Audit — سجلّ القرارات والعمليات

## الجدول `audit_events`

| العمود | الوصف |
|---|---|
| `actor_id` | المستخدم المُنفِّذ (أو `null` لعمليات النظام). |
| `action` | اسم الحدث (`project.create`, `task.complete`, …). |
| `resource_type`, `resource_id` | المورد المتأثّر. |
| `decision` | `allowed` / `denied`. |
| `reason` | سبب اختياري (مفيد للإنكار). |
| `scope_type`, `scope_id` | نطاق الحدث. |
| `metadata` | JSONB حر. |

## RLS

- `SELECT`: `actor_id = auth.uid()` أو `is_owner(auth.uid())`.
- `INSERT`: `actor_id = auth.uid()` أو `null` (للنظام).
- لا `UPDATE`، لا `DELETE` — السجل غير قابل للتعديل.

## نقطة الكتابة الموحَّدة

```ts
import { AuditService } from "@/services/central/audit.service";

await AuditService.log({
  action: "project.archive",
  resource_type: "project",
  resource_id: projectId,
  decision: "allowed",
  metadata: { previous_state: "active" },
});
```

أو الأفضل عبر decorator:

```ts
withAuthorizationAndAudit(
  { permission: "project:archive", resource_type: "project", action: "project.archive" },
  command,
  { resolveResourceId: ([id]) => id },
);
```

## واجهة المستخدم

- **Audit Center** — `Settings → Audit Center` (`src/components/SettingsPanel/categories/AuditCenterPanel.tsx`).
  - آخر 100 حدث مع فلترة `resource_type` / `action`.
  - Auto-refresh كل 30 ثانية.
  - متاح لكل مستخدم لأحداثه + owner للكل.

## الاحتفاظ والتنظيف

لا حذف من التطبيق. سياسة retention مؤجَّلة لـ P6 (مقترح: 365 يومًا للأحداث العادية، دائم لـ `denied`).

## استعلام مباشر

```sql
SELECT created_at, actor_id, action, resource_type, decision
FROM audit_events
WHERE resource_type = 'project'
ORDER BY created_at DESC
LIMIT 50;
```
