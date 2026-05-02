# Step 11 Checklist — Runtime Allow/Deny Verification

- الحالة: Open
- الغرض: استكمال أدلة الإغلاق للخطوة 11.

## Test Matrix (must capture pass/fail evidence)
1. team_member:
   - يستطيع قراءة/تعديل بياناته ضمن scope الخاص به.
   - يُمنع من قراءة Outbox/DLQ.
2. owner:
   - يستطيع إدارة roles/permissions.
   - يستطيع قراءة outbox/dlq.
3. unauthorized user:
   - يُرفض الوصول للمسارات المحمية.

## Required Evidence per test
1. user role used.
2. request/action attempted.
3. expected result.
4. actual result (screenshot/log/sql output).

## SQL probes (optional)
1. `select public.is_owner(auth.uid());`
2. `select public.has_permission(auth.uid(), '<permission_code>');`
3. queries against `event_outbox` and `event_dlq` with non-owner account.
