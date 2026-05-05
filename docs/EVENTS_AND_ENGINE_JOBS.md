# Events & Engine Jobs — النموذج الحدثي

## الفلسفة

كل تحوّل حالة مهم في central يُنشر كحدث في `event_outbox` (Outbox Pattern)،
ثم تستهلكه Edge Functions غير متزامنة. هذا يفصل العمليات الكاتبة عن
الـ side-effects (الإشعارات، التزامن، تشغيل engines).

## المكوّنات

```
projects/tasks/tools/engine_jobs
        │
        │ trigger emit_state_change_event()
        ▼
   event_outbox  ──► outbox-relay (cron 1m)  ──► [side effects]
        │                                 │ fail x3
        │                                 ▼
        │                            event_dlq
        ▼
 engine_jobs (state machine)  ◄── engine-jobs-worker (cron 1m)
```

## الجداول

### `event_outbox`
- `aggregate_type`, `aggregate_id`, `event_type` (مثل `projects.state_changed`).
- `payload` (JSONB): `{ from, to, op }`.
- `attempts`, `dispatched_at`, `last_error`.
- RLS: قراءة لـ owner فقط.

### `event_dlq`
- يستقبل الأحداث بعد 3 محاولات فاشلة.
- يحتفظ بـ `original_event_id` و `error`.
- RLS: قراءة لـ owner فقط.

### `engine_jobs`
- State machine: `draft → planned → active → completed` (أو `failed`).
- Realtime publication مفعّلة — يُبَطَّل cache فور أي تحديث.

## Trigger: `emit_state_change_event()`

`SECURITY DEFINER`, مثبَّت على `projects, tasks, tools, engine_jobs`:

| TG_OP | event_type | payload |
|---|---|---|
| `INSERT` | `<table>.created` | `{ id, state, op: "INSERT" }` |
| `UPDATE` (state changed) | `<table>.state_changed` | `{ id, from, to, op: "UPDATE" }` |
| `DELETE` | `<table>.deleted` | `{ id, state, op: "DELETE" }` |

## Edge Functions

### `outbox-relay`
- يقرأ `event_outbox WHERE dispatched_at IS NULL` (دفعات 100).
- لكل حدث: ينفّذ side-effect → يحدّث `dispatched_at`.
- عند فشل: يزيد `attempts`. بعد 3 محاولات → ينقل إلى `event_dlq`.
- مُجدوَلة عبر `pg_cron` كل دقيقة.

### `engine-jobs-worker`
- ينقل `engine_jobs.state` آليًا: `planned → active → completed`.
- مُجدوَلة كل دقيقة.

## Realtime

```ts
import { useEngineJobsRealtime } from "@/hooks/central";

useEngineJobsRealtime(); // يُبطل React Query cache فور أي INSERT/UPDATE/DELETE
```

## مراقبة DLQ

Audit Center في الإعدادات يعرض الأحداث؛ لرؤية الـ DLQ مباشرة:

```sql
SELECT failed_at, aggregate_type, event_type, error
FROM event_dlq
ORDER BY failed_at DESC LIMIT 50;
```

## Runbook عند تراكم Outbox

1. تحقّق من logs:
   `Edge Functions → outbox-relay → Logs`.
2. إذا كان الفشل في side-effect خارجي: أصلح ثم أعد المحاولة بـ
   `UPDATE event_outbox SET attempts = 0, last_error = NULL WHERE id = ...;`.
3. إذا كان حدث dead: استعرض في `event_dlq` ثم احذف يدويًا بعد التحقيق.
