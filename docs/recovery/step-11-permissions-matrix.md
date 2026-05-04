# Step 11 Artifact — System Permissions Matrix

- التاريخ: 2026-05-03
- الحالة: In Progress
- المالك: Security Lead + Backend Lead
- المرجع الحاكم: `docs/recovery_execution_package.md` (الخطوة 11)

## Roles in Current Active Model
1. `owner`
2. `team_member`
3. `unauthorized` (negative test actor)

## Permissions Matrix (Active Domains)
| Domain/Action | owner | team_member | unauthorized | Policy Reference | Service/App Reference |
|---|---|---|---|---|---|
| Auth: login/read session | Allow | Allow | Deny | ProtectedRoute + Supabase Auth | `src/components/auth/ProtectedRoute.tsx` |
| Projects: read | Allow | Allow (scope) | Deny | `owners manage projects` | `src/services/central/projects.service.ts` |
| Projects: create/update/delete | Allow | Scope-limited | Deny | `owners manage projects` | `src/services/central/projects.service.ts` |
| Tasks: read | Allow | Allow (scope/assignee) | Deny | `tasks visibility` | `src/services/central/tasks.service.ts` |
| Tasks: create/update/delete | Allow | Scope-limited | Deny | `tasks owner manage/update/delete` | `src/services/central/tasks.service.ts` |
| Invoices: read | Allow | Allow (own scope) | Deny | `Users can view own invoices` | `src/services/invoices/invoices.service.ts` |
| Invoices: create/update/delete | Allow | Allow (own scope) | Deny | `Users can create/update/delete own invoices` | `src/services/invoices/invoices.service.ts` |
| Departments shell read | Allow | Allow (scope) | Deny | `owners manage departments` | `src/services/central/departments.service.ts` |
| Audit: insert/read | Allow | Allow (own) | Deny | `audit insert auth`, `audit read own` | `src/services/central/audit.service.ts` |
| Outbox read | Allow | Deny | Deny | `owner reads outbox` | direct DB restricted |
| DLQ read | Allow | Deny | Deny | `owner reads dlq` | direct DB restricted |
| Roles read | Allow | Allow (own roles) | Deny | `users read own roles`, `owner manages roles` | `src/services/central/roles.service.ts` |

## Runtime Evidence Status
| Evidence Item | Status |
|---|---|
| Live `pg_policies` inventory | Done |
| Policy-to-domain matrix mapping | Done |
| Runtime probes executed as owner | Pending |
| Runtime probes executed as team_member | Pending |
| Runtime probes executed as unauthorized | Pending |
| Evidence template filled with outputs/logs | Pending |

## Evidence Links
1. `docs/recovery/step-11-policy-mapping.md`
2. `scripts/recovery/permissions-probes.sql`
3. `docs/recovery/step-11-runtime-evidence-template.md`
4. `docs/recovery/step-11-runtime-verification-checklist.md`

## Remaining to Close Step 11
1. تنفيذ probes فعليًا تحت الأدوار الثلاثة.
2. تعبئة evidence template بنتائج pass/fail لكل probe.
3. إرفاق outputs تثبت deny/allow على `event_outbox` و`event_dlq`.
