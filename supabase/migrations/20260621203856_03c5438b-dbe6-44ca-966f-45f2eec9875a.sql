
-- 1) Critical fix: smart_connectors INSERT/UPDATE/DELETE must require board editor role
DROP POLICY IF EXISTS smart_connectors_insert_own ON public.smart_connectors;
DROP POLICY IF EXISTS smart_connectors_update_own ON public.smart_connectors;
DROP POLICY IF EXISTS smart_connectors_delete_own ON public.smart_connectors;

CREATE POLICY smart_connectors_insert_own
  ON public.smart_connectors
  FOR INSERT
  TO authenticated
  WITH CHECK (
    created_by = auth.uid()
    AND public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role)
  );

CREATE POLICY smart_connectors_update_own
  ON public.smart_connectors
  FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid()
    AND public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role)
  )
  WITH CHECK (
    created_by = auth.uid()
    AND public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role)
  );

CREATE POLICY smart_connectors_delete_own
  ON public.smart_connectors
  FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid()
    AND public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role)
  );

-- 2) Restrict every public-schema policy currently applied to PUBLIC (which includes anon)
--    down to the `authenticated` role. These policies all check auth.uid(), so anon
--    was already effectively denied — this just removes the anonymous role from the
--    policy's role list so the linter no longer flags it.
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND 'public' = ANY(roles)
  LOOP
    EXECUTE format(
      'ALTER POLICY %I ON %I.%I TO authenticated',
      r.policyname, r.schemaname, r.tablename
    );
  END LOOP;
END$$;
