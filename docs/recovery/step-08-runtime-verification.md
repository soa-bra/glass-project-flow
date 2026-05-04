# Step 08 Runtime Verification — Execution Record

- التاريخ: 2026-05-04
- الحالة: In Progress
- النطاق: Login / Project CRUD (create/read) / Task CRU / Invoice CRU / Department shell read

## Execution Inputs
1. `docs/recovery/step-10-baseline-schema.md`
2. `docs/recovery/step-11-permissions-matrix.md`
3. `scripts/recovery/permissions-probes.sql`

## Verification Matrix
| Workflow | Verification Mode | Evidence Artifact | Current Result |
|---|---|---|---|
| Login | manual/runtime | `docs/recovery/evidence/step08-login-check.txt` | Pending |
| Project create/read | manual/runtime | `docs/recovery/evidence/step08-project-cr-check.txt` | Pending |
| Task create/read/update | manual/runtime | `docs/recovery/evidence/step08-task-cru-check.txt` | Pending |
| Invoice create/read/update | manual/runtime | `docs/recovery/evidence/step08-invoice-cru-check.txt` | Pending |
| Department shell read | manual/runtime | `docs/recovery/evidence/step08-department-shell-read-check.txt` | Pending |

## Run Procedure
1. Execute each workflow in a controlled runtime environment against the active path.
2. Record timestamp, actor role, input payload, and observed response.
3. Attach outputs to the corresponding evidence files in `docs/recovery/evidence/`.
4. Mark each row in the matrix as Pass/Fail with concrete evidence reference.

## Closure Criteria
1. All five workflows have evidence artifacts populated.
2. No workflow remains in Pending state.
3. Failures (if any) are linked to recovery backlog items before closure.
