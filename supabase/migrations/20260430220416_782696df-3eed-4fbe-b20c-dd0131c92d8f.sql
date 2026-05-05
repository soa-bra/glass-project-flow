
-- Idempotent guards
ALTER TABLE public.event_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_dlq ENABLE ROW LEVEL SECURITY;

-- Generic state-change emitter
CREATE OR REPLACE FUNCTION public.emit_state_change_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_aggregate_type text := TG_TABLE_NAME;
  v_event_type text;
  v_old_state text;
  v_new_state text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_event_type := v_aggregate_type || '.created';
    v_new_state := NEW.state::text;
    INSERT INTO public.event_outbox (aggregate_type, aggregate_id, event_type, payload)
    VALUES (
      v_aggregate_type, NEW.id, v_event_type,
      jsonb_build_object('id', NEW.id, 'state', v_new_state, 'op', 'INSERT')
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    v_old_state := OLD.state::text;
    v_new_state := NEW.state::text;
    IF v_old_state IS DISTINCT FROM v_new_state THEN
      v_event_type := v_aggregate_type || '.state_changed';
      INSERT INTO public.event_outbox (aggregate_type, aggregate_id, event_type, payload)
      VALUES (
        v_aggregate_type, NEW.id, v_event_type,
        jsonb_build_object('id', NEW.id, 'from', v_old_state, 'to', v_new_state, 'op', 'UPDATE')
      );
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    v_event_type := v_aggregate_type || '.deleted';
    INSERT INTO public.event_outbox (aggregate_type, aggregate_id, event_type, payload)
    VALUES (
      v_aggregate_type, OLD.id, v_event_type,
      jsonb_build_object('id', OLD.id, 'state', OLD.state::text, 'op', 'DELETE')
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_emit_state_change ON public.projects;
CREATE TRIGGER trg_emit_state_change
AFTER INSERT OR UPDATE OR DELETE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.emit_state_change_event();

DROP TRIGGER IF EXISTS trg_emit_state_change ON public.tasks;
CREATE TRIGGER trg_emit_state_change
AFTER INSERT OR UPDATE OR DELETE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.emit_state_change_event();

DROP TRIGGER IF EXISTS trg_emit_state_change ON public.tools;
CREATE TRIGGER trg_emit_state_change
AFTER INSERT OR UPDATE OR DELETE ON public.tools
FOR EACH ROW EXECUTE FUNCTION public.emit_state_change_event();

DROP TRIGGER IF EXISTS trg_emit_state_change ON public.engine_jobs;
CREATE TRIGGER trg_emit_state_change
AFTER INSERT OR UPDATE OR DELETE ON public.engine_jobs
FOR EACH ROW EXECUTE FUNCTION public.emit_state_change_event();

CREATE INDEX IF NOT EXISTS idx_event_outbox_pending
ON public.event_outbox (created_at)
WHERE dispatched_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_engine_jobs_planned
ON public.engine_jobs (created_at)
WHERE state = 'planned';

ALTER TABLE public.engine_jobs REPLICA IDENTITY FULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname='supabase_realtime' AND tablename='engine_jobs'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.engine_jobs';
  END IF;
END $$;
