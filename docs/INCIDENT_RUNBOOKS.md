# Incident Runbooks: Partial Subsystem Failures

## Scope

This runbook covers degraded operation where only part of the eventing subsystem is failing: producer API, outbox relay, handlers, or downstream webhooks.

---

## Runbook A: Producer healthy, relay failing

**Symptoms**
- `event_outbox` grows.
- Relay logs contain repeated processing errors.

**Immediate actions**
1. Confirm DB health and handler dependency health.
2. Reduce blast radius by lowering `OUTBOX_BATCH_SIZE`.
3. Switch affected event families to `retryTier=critical` only when business impact justifies it.

**Recovery**
1. Fix failing handler dependency.
2. Restart relay.
3. Confirm backlog drains and `event_dlq` rate normalizes.

---

## Runbook B: Handler subset failing, others healthy

**Symptoms**
- Only specific event names enter DLQ.
- Other event names continue to send.

**Immediate actions**
1. Identify failing `event_name` from DLQ.
2. Disable only impacted handlers (feature flag / config).
3. Keep relay active to process healthy families.

**Recovery**
1. Patch handler.
2. Replay impacted DLQ events with `scripts/replay-events.ts`.
3. Re-enable handler and monitor duplicate side effects.

---

## Runbook C: Downstream webhook outage

**Symptoms**
- Timeout failures for webhook handlers.
- Rising `failed` events with increasing `retry_count`.

**Immediate actions**
1. Verify downstream status page / endpoint health.
2. Temporarily route event family to `standard` tier to avoid aggressive retries.
3. Alert owning team with impacted event list.

**Recovery**
1. After downstream recovery, replay DLQ by event family.
2. Reconcile downstream side effects using idempotency key audit.

---

## Runbook D: DLQ surge (possible bad deploy)

**Symptoms**
- Sudden sharp increase in DLQ writes.
- Errors begin immediately after deploy.

**Immediate actions**
1. Freeze new deploys.
2. Roll back last known-good release.
3. Keep replay paused until error rate returns to baseline.

**Recovery**
1. Validate root cause fix in staging.
2. Replay DLQ gradually (`--limit` batches).
3. Confirm no replay loops and no duplicate business actions.

---

## Operational guardrails

- Never bulk replay full DLQ without an event-name filter.
- Always perform dry-run first during incidents.
- Record incident timeline: detection time, mitigation, replay window, validation timestamp.
