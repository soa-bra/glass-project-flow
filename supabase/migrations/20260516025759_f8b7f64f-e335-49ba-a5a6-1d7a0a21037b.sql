-- Enum for planning element types (UR-001, UR-006, UR-007, UR-008)
CREATE TYPE public.planning_element_type AS ENUM (
  'sticky',
  'shape',
  'text',
  'smart_doc',
  'interactive_sheet',
  'mindmap_node',
  'frame',
  'connector',
  'entity_card'
);

-- Planning boards (top-level canvas)
CREATE TABLE public.planning_boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  state public.central_state NOT NULL DEFAULT 'draft',
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_planning_boards_owner ON public.planning_boards(owner_id);

ALTER TABLE public.planning_boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owners manage planning_boards"
ON public.planning_boards
FOR ALL TO authenticated
USING ((owner_id = auth.uid()) OR public.is_owner(auth.uid()))
WITH CHECK ((owner_id = auth.uid()) OR public.is_owner(auth.uid()));

-- Planning elements (children of a board)
CREATE TABLE public.planning_elements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid NOT NULL REFERENCES public.planning_boards(id) ON DELETE CASCADE,
  element_type public.planning_element_type NOT NULL,
  position jsonb NOT NULL DEFAULT '{"x":0,"y":0}'::jsonb,
  size jsonb NOT NULL DEFAULT '{"width":200,"height":120}'::jsonb,
  rotation real NOT NULL DEFAULT 0,
  z_index integer NOT NULL DEFAULT 0,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  style jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  schema_version integer NOT NULL DEFAULT 1,
  locked_by uuid,
  locked_at timestamptz,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_planning_elements_board_updated
  ON public.planning_elements(board_id, updated_at DESC);
CREATE INDEX idx_planning_elements_locked_by
  ON public.planning_elements(locked_by) WHERE locked_by IS NOT NULL;

ALTER TABLE public.planning_elements ENABLE ROW LEVEL SECURITY;

-- Helper: a user can read planning_elements if they own the board OR are global owner
CREATE POLICY "read planning_elements on accessible boards"
ON public.planning_elements
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.planning_boards b
    WHERE b.id = planning_elements.board_id
      AND ((b.owner_id = auth.uid()) OR public.is_owner(auth.uid()))
  )
);

CREATE POLICY "insert planning_elements on owned boards"
ON public.planning_elements
FOR INSERT TO authenticated
WITH CHECK (
  created_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.planning_boards b
    WHERE b.id = planning_elements.board_id
      AND ((b.owner_id = auth.uid()) OR public.is_owner(auth.uid()))
  )
);

CREATE POLICY "update planning_elements on owned boards"
ON public.planning_elements
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.planning_boards b
    WHERE b.id = planning_elements.board_id
      AND ((b.owner_id = auth.uid()) OR public.is_owner(auth.uid()))
  )
);

CREATE POLICY "delete planning_elements on owned boards"
ON public.planning_elements
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.planning_boards b
    WHERE b.id = planning_elements.board_id
      AND ((b.owner_id = auth.uid()) OR public.is_owner(auth.uid()))
  )
);

-- Auto updated_at triggers
CREATE TRIGGER trg_planning_boards_updated
  BEFORE UPDATE ON public.planning_boards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_planning_elements_updated
  BEFORE UPDATE ON public.planning_elements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();