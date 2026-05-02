# Step 11 Artifact — System Permissions Matrix

- التاريخ: 2026-05-02
- الحالة: In Progress
- المالك: Security Lead + Backend Lead
- المرجع الحاكم: `docs/recovery_execution_package.md` (الخطوة 11)

## Roles in Current Active Model
1. `owner`
2. `team_member`

## Permissions Matrix (Active Domains)

| Domain/Action | owner | team_member | RLS/App Reference |
|---|---|---|---|
| Auth: login/read self session | Allow | Allow | Supabase Auth + `ProtectedRoute` |
| Projects: read own scope | Allow | Allow (own scope) | central RLS pattern (owner_id/auth.uid) |
| Projects: create | Allow | Allow (own scope) | services + RLS check |
| Projects: update | Allow | Allow (own scope) | services + RLS check |
| Tasks: read | Allow | Allow (own scope/assignee) | tasks RLS exception (`assignee_id`) |
| Tasks: create | Allow | Allow (own scope) | services + RLS |
| Tasks: update | Allow | Allow (own scope/assignee) | services + RLS |
| Invoices: read | Allow | Allow (scope owner) | invoices service + DB policy |
| Invoices: create/update | Allow | Allow (scope owner) | invoices service + DB policy |
| Departments shell read | Allow | Allow (authorized scope) | departments service + RLS |
| Audit events read | Allow | Limited (owner of event) | `audit_events` policy |
| Event outbox/dlq read | Allow | Deny | owner-only policy |

## Control Mapping
1. DB-level enforcement: RLS policies + helper functions (`is_owner`, `has_role`, `has_permission`).
2. App-level enforcement: route guard + service-layer authorization wrapper.

## Evidence Links
1. `docs/RBAC.md`
2. `supabase/migrations/20260430160310_91fd3b59-915f-463d-8e01-63b1c31b6330.sql`
3. `src/services/central/withAuthorizationAndAudit.ts`
4. `src/components/auth/ProtectedRoute.tsx`

## Remaining to Close Step 11
1. ربط كل صف matrix باسم policy فعلي (policy-by-policy mapping).
2. إضافة دليل اختبارات deny/allow runtime لكل domain حرج.
3. إقفال الثغرة المذكورة في `AUTH_DISABLED_FOR_DEV` إن كانت ما زالت فعالة.
