
-- 1) Fix smart_connectors: scope SELECT to board members
DROP POLICY IF EXISTS smart_connectors_select_auth ON public.smart_connectors;
CREATE POLICY smart_connectors_select_board
  ON public.smart_connectors FOR SELECT TO authenticated
  USING (public.user_has_board_role(board_id, auth.uid(), 'viewer'::board_role));

-- 2) Fix board_join_requests: restrict insert to authenticated only
DROP POLICY IF EXISTS "Anyone with valid token can create join requests" ON public.board_join_requests;
CREATE POLICY "Authenticated users with valid token can create join requests"
  ON public.board_join_requests FOR INSERT TO authenticated
  WITH CHECK (true);

-- 3) Rebind archive_documents policies from public -> authenticated
DROP POLICY IF EXISTS "owners read archive_documents" ON public.archive_documents;
DROP POLICY IF EXISTS "owners insert archive_documents" ON public.archive_documents;
DROP POLICY IF EXISTS "owners update archive_documents" ON public.archive_documents;
DROP POLICY IF EXISTS "owners delete archive_documents" ON public.archive_documents;

CREATE POLICY "owners read archive_documents" ON public.archive_documents
  FOR SELECT TO authenticated
  USING ((owner_id = auth.uid()) OR public.is_owner(auth.uid()));
CREATE POLICY "owners insert archive_documents" ON public.archive_documents
  FOR INSERT TO authenticated
  WITH CHECK ((owner_id = auth.uid()) OR public.is_owner(auth.uid()));
CREATE POLICY "owners update archive_documents" ON public.archive_documents
  FOR UPDATE TO authenticated
  USING ((owner_id = auth.uid()) OR public.is_owner(auth.uid()))
  WITH CHECK ((owner_id = auth.uid()) OR public.is_owner(auth.uid()));
CREATE POLICY "owners delete archive_documents" ON public.archive_documents
  FOR DELETE TO authenticated
  USING ((owner_id = auth.uid()) OR public.is_owner(auth.uid()));

-- 4) Rebind user_settings policies from public -> authenticated
DROP POLICY IF EXISTS "users select own settings" ON public.user_settings;
DROP POLICY IF EXISTS "users insert own settings" ON public.user_settings;
DROP POLICY IF EXISTS "users update own settings" ON public.user_settings;
DROP POLICY IF EXISTS "users delete own settings" ON public.user_settings;
DROP POLICY IF EXISTS "owners manage all settings" ON public.user_settings;

CREATE POLICY "users select own settings" ON public.user_settings
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "users insert own settings" ON public.user_settings
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "users update own settings" ON public.user_settings
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "users delete own settings" ON public.user_settings
  FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "owners manage all settings" ON public.user_settings
  FOR ALL TO authenticated
  USING (public.is_owner(auth.uid())) WITH CHECK (public.is_owner(auth.uid()));
