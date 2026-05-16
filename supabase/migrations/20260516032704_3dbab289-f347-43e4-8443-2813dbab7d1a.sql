-- History table for planning_elements changes
CREATE TABLE public.planning_element_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  element_id uuid NOT NULL,
  board_id uuid NOT NULL,
  actor_id uuid,
  action text NOT NULL CHECK (action IN ('insert','update','delete')),
  changed_fields jsonb NOT NULL DEFAULT '{}'::jsonb,
  snapshot jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_planning_element_history_element
  ON public.planning_element_history (element_id, created_at DESC);
CREATE INDEX idx_planning_element_history_board
  ON public.planning_element_history (board_id, created_at DESC);

ALTER TABLE public.planning_element_history ENABLE ROW LEVEL SECURITY;

-- Read access: anyone who can read the parent board
CREATE POLICY "read planning_element_history on accessible boards"
ON public.planning_element_history
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.planning_boards b
    WHERE b.id = planning_element_history.board_id
      AND (b.owner_id = auth.uid() OR public.is_owner(auth.uid()))
  )
);

-- No direct INSERT/UPDATE/DELETE policies — only the trigger (SECURITY DEFINER) writes here.

-- Trigger function: capture diffs
CREATE OR REPLACE FUNCTION public.log_planning_element_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  v_changes jsonb := '{}'::jsonb;
  v_actor uuid := auth.uid();
  v_tracked text[] := ARRAY[
    'position','size','rotation','z_index','content','style','metadata',
    'element_type','locked_by','locked_at','schema_version'
  ];
  v_field text;
  v_old jsonb;
  v_new jsonb;
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.planning_element_history
      (element_id, board_id, actor_id, action, changed_fields, snapshot)
    VALUES
      (NEW.id, NEW.board_id, COALESCE(v_actor, NEW.created_by),
       'insert', '{}'::jsonb, to_jsonb(NEW));
    RETURN NEW;

  ELSIF TG_OP = 'UPDATE' THEN
    FOREACH v_field IN ARRAY v_tracked LOOP
      v_old := to_jsonb(OLD) -> v_field;
      v_new := to_jsonb(NEW) -> v_field;
      IF v_old IS DISTINCT FROM v_new THEN
        v_changes := v_changes || jsonb_build_object(
          v_field, jsonb_build_object('old', v_old, 'new', v_new)
        );
      END IF;
    END LOOP;

    IF v_changes <> '{}'::jsonb THEN
      INSERT INTO public.planning_element_history
        (element_id, board_id, actor_id, action, changed_fields, snapshot)
      VALUES
        (NEW.id, NEW.board_id, v_actor, 'update', v_changes, NULL);
    END IF;
    RETURN NEW;

  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.planning_element_history
      (element_id, board_id, actor_id, action, changed_fields, snapshot)
    VALUES
      (OLD.id, OLD.board_id, v_actor, 'delete', '{}'::jsonb, to_jsonb(OLD));
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_planning_element_history ON public.planning_elements;
CREATE TRIGGER trg_planning_element_history
AFTER INSERT OR UPDATE OR DELETE ON public.planning_elements
FOR EACH ROW EXECUTE FUNCTION public.log_planning_element_change();
