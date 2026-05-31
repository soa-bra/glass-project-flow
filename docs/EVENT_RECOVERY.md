# Event Recovery Playbook

## 1) Idempotency keys

All event producers should provide `idempotencyKey` (or legacy `dedupKey`).

Recommended format:

```text
<domain>:<entity-id>:<operation>:<monotonic-version>
```

Examples:

- `project:proj_123:status-changed:v17`
- `invoice:inv_778:posted:v3`

## 2) Retry tiers

Outbox retries are now tiered:

- `fast`: low-latency non-critical notifications (3 retries)
- `standard`: default business events (6 retries)
- `critical`: legally/financially significant events (10 retries)

When retries are exhausted, events are moved to `event_dlq`.

## 3) Replay tool

Use the replay CLI to requeue DLQ events into outbox:

```bash
# Preview what would replay (no writes)
node scripts/replay-events.ts --dry-run --limit=50

# Replay only one event family
node scripts/replay-events.ts --event=InvoicePosted --limit=200
```

## 4) Recovery workflow

1. Pause relay workers to avoid contention.
2. Run replay in `--dry-run` and capture candidate IDs.
3. Replay by event family in small batches.
4. Restart relay and monitor outbox/dlq metrics.
5. Verify side effects in downstream systems.

## 5) Post-recovery validation queries

```sql
-- Ensure replayed events are marked in DLQ
SELECT id, event_name, replay_status, replayed_at
FROM event_dlq
WHERE replayed_at IS NOT NULL
ORDER BY replayed_at DESC
LIMIT 100;

-- Ensure no critical events remain stuck for too long
SELECT event_name, retry_tier, count(*)
FROM event_outbox
WHERE status IN ('pending','failed')
  AND created_at < now() - interval '15 minutes'
GROUP BY event_name, retry_tier
ORDER BY count(*) DESC;
```
