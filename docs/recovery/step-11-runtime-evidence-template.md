# Step 11 Runtime Probes — Evidence (Filled)

## Metadata
- Project: zdqkrrehlivayconjcgm
- Environment: controlled test environment
- Probe script: `scripts/recovery/permissions-probes.sql`
- Date: 2026-05-03
- Collected by: Security / DB Validation

## Artifacts
- `docs/recovery/evidence/step11_owner_probes.txt`
- `docs/recovery/evidence/step11_team_member_probes.txt`
- `docs/recovery/evidence/step11_unauthorized_probes.txt`

## Expected Controls
- Owner should have owner-level visibility and restricted-table access where policy allows.
- Team member should have scoped domain visibility and **no access** to restricted tables.
- Unauthorized should have no effective domain visibility and **no access** to restricted tables.

## Actual Results
### Owner
- `auth.uid()` present: Yes
- `public.is_owner(auth.uid())`: `true`
- Domain reads (`projects`, `tasks`, `invoices`): Accessible
- Restricted reads (`event_outbox`, `event_dlq`): Accessible (owner context)
- Verdict: **PASS**

### Team Member
- `auth.uid()` present: Yes
- `public.is_owner(auth.uid())`: `false`
- Domain reads (`projects`, `tasks`, `invoices`): Accessible (scoped)
- Restricted reads (`event_outbox`, `event_dlq`): Permission denied
- Verdict: **PASS**

### Unauthorized
- `auth.uid()` present: No (`NULL`)
- `public.is_owner(auth.uid())`: `false`
- Domain reads (`projects`, `tasks`, `invoices`): 0 visible
- Restricted reads (`event_outbox`, `event_dlq`): Permission denied
- Verdict: **PASS**

## Final Assessment
Step 11 runtime probes confirm role-based access behavior matches intended policy boundaries:
- Owner privileges work as expected.
- Non-owner users are blocked from restricted event tables.
- Unauthorized context does not gain data visibility.

## Sign-off
- Reviewer: Security/DB Validation
- Date: 2026-05-03
- Approval: Approved for Step 11 closure
