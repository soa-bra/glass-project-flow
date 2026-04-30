
-- =========================================================
-- P0 Security Hardening Migration
-- =========================================================

-- 1) Functions: set search_path on the three custom functions
ALTER FUNCTION public.calculate_invoice_total() SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_invoice_number() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public, pg_temp;

-- 2) Revoke anon EXECUTE on SECURITY DEFINER helpers (keep authenticated)
REVOKE EXECUTE ON FUNCTION public.user_has_board_role(uuid, uuid, board_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.user_has_board_role(uuid, uuid, board_role) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_user_board_role(uuid, uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_user_board_role(uuid, uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_widget_data(text, uuid, jsonb, integer) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_widget_data(text, uuid, jsonb, integer) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_widget_stats(text, uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_widget_stats(text, uuid) TO authenticated;

-- validate_board_invite_token must remain callable by anonymous users (join page)
REVOKE EXECUTE ON FUNCTION public.validate_board_invite_token(text) FROM public;
GRANT EXECUTE ON FUNCTION public.validate_board_invite_token(text) TO anon, authenticated;

-- =========================================================
-- 3) Re-scope policies from `public` role to `authenticated`
-- =========================================================

-- ---------- boards ----------
DROP POLICY IF EXISTS "Authenticated hosts can update boards" ON public.boards;
DROP POLICY IF EXISTS "Authenticated owners can delete boards" ON public.boards;
DROP POLICY IF EXISTS "Authenticated users can create boards" ON public.boards;
DROP POLICY IF EXISTS "Authenticated users can view accessible boards" ON public.boards;

CREATE POLICY "Authenticated hosts can update boards" ON public.boards
  FOR UPDATE TO authenticated
  USING (public.user_has_board_role(id, auth.uid(), 'host'::board_role));
CREATE POLICY "Authenticated owners can delete boards" ON public.boards
  FOR DELETE TO authenticated
  USING (owner_id = auth.uid());
CREATE POLICY "Authenticated users can create boards" ON public.boards
  FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Authenticated users can view accessible boards" ON public.boards
  FOR SELECT TO authenticated
  USING ((owner_id = auth.uid()) OR (is_public = true) OR public.user_has_board_role(id, auth.uid(), 'viewer'::board_role));

-- ---------- board_objects ----------
DROP POLICY IF EXISTS "Authenticated editors can create objects" ON public.board_objects;
DROP POLICY IF EXISTS "Authenticated editors can delete objects" ON public.board_objects;
DROP POLICY IF EXISTS "Authenticated editors can update objects" ON public.board_objects;
DROP POLICY IF EXISTS "Authenticated users can view board objects" ON public.board_objects;

CREATE POLICY "Authenticated editors can create objects" ON public.board_objects
  FOR INSERT TO authenticated
  WITH CHECK (public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role) AND created_by = auth.uid());
CREATE POLICY "Authenticated editors can delete objects" ON public.board_objects
  FOR DELETE TO authenticated
  USING (public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role));
CREATE POLICY "Authenticated editors can update objects" ON public.board_objects
  FOR UPDATE TO authenticated
  USING (public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role));
CREATE POLICY "Authenticated users can view board objects" ON public.board_objects
  FOR SELECT TO authenticated
  USING (public.user_has_board_role(board_id, auth.uid(), 'viewer'::board_role));

-- ---------- board_permissions ----------
DROP POLICY IF EXISTS "Authenticated hosts can manage permissions" ON public.board_permissions;
DROP POLICY IF EXISTS "Authenticated users can view board permissions" ON public.board_permissions;

CREATE POLICY "Authenticated hosts can manage permissions" ON public.board_permissions
  FOR ALL TO authenticated
  USING (public.user_has_board_role(board_id, auth.uid(), 'host'::board_role));
CREATE POLICY "Authenticated users can view board permissions" ON public.board_permissions
  FOR SELECT TO authenticated
  USING (public.user_has_board_role(board_id, auth.uid(), 'viewer'::board_role));

-- ---------- board_invite_links ----------
DROP POLICY IF EXISTS "Hosts can manage invite links" ON public.board_invite_links;
CREATE POLICY "Hosts can manage invite links" ON public.board_invite_links
  FOR ALL TO authenticated
  USING (public.user_has_board_role(board_id, auth.uid(), 'host'::board_role));

-- ---------- board_join_requests ----------
DROP POLICY IF EXISTS "Board hosts can view join requests" ON public.board_join_requests;
DROP POLICY IF EXISTS "Hosts can manage join requests" ON public.board_join_requests;
DROP POLICY IF EXISTS "Users with valid tokens can create join requests" ON public.board_join_requests;

CREATE POLICY "Board hosts can view join requests" ON public.board_join_requests
  FOR SELECT TO authenticated
  USING (board_id IN (SELECT b.id FROM public.boards b WHERE b.owner_id = auth.uid()));
CREATE POLICY "Hosts can manage join requests" ON public.board_join_requests
  FOR ALL TO authenticated
  USING (board_id IN (SELECT b.id FROM public.boards b WHERE b.owner_id = auth.uid()));
-- Public INSERT preserved for guest join flow
CREATE POLICY "Anyone with valid token can create join requests" ON public.board_join_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.board_invite_links bil
    WHERE bil.id = invite_link_id
      AND bil.board_id = board_join_requests.board_id
      AND bil.is_active = true
      AND (bil.expires_at IS NULL OR bil.expires_at > now())
  ));

-- ---------- links ----------
DROP POLICY IF EXISTS "Authenticated editors can manage links" ON public.links;
DROP POLICY IF EXISTS "Authenticated users can view links" ON public.links;

CREATE POLICY "Authenticated editors can manage links" ON public.links
  FOR ALL TO authenticated
  USING (public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role))
  WITH CHECK (public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role) AND created_by = auth.uid());
CREATE POLICY "Authenticated users can view links" ON public.links
  FOR SELECT TO authenticated
  USING (public.user_has_board_role(board_id, auth.uid(), 'viewer'::board_role));

-- ---------- snapshots ----------
DROP POLICY IF EXISTS "Editors can create snapshots" ON public.snapshots;
DROP POLICY IF EXISTS "Hosts can delete snapshots" ON public.snapshots;
DROP POLICY IF EXISTS "Users can view snapshots" ON public.snapshots;

CREATE POLICY "Editors can create snapshots" ON public.snapshots
  FOR INSERT TO authenticated
  WITH CHECK (public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role) AND created_by = auth.uid());
CREATE POLICY "Hosts can delete snapshots" ON public.snapshots
  FOR DELETE TO authenticated
  USING (public.user_has_board_role(board_id, auth.uid(), 'host'::board_role));
CREATE POLICY "Users can view snapshots" ON public.snapshots
  FOR SELECT TO authenticated
  USING (public.user_has_board_role(board_id, auth.uid(), 'viewer'::board_role));

-- ---------- op_log ----------
DROP POLICY IF EXISTS "Editors can log operations" ON public.op_log;
DROP POLICY IF EXISTS "Users can view operations" ON public.op_log;

CREATE POLICY "Editors can log operations" ON public.op_log
  FOR INSERT TO authenticated
  WITH CHECK (public.user_has_board_role(board_id, auth.uid(), 'editor'::board_role) AND user_id = auth.uid());
CREATE POLICY "Users can view operations" ON public.op_log
  FOR SELECT TO authenticated
  USING (public.user_has_board_role(board_id, auth.uid(), 'viewer'::board_role));

-- ---------- smart_element_data ----------
DROP POLICY IF EXISTS "Editors can create smart element data" ON public.smart_element_data;
DROP POLICY IF EXISTS "Editors can delete smart element data" ON public.smart_element_data;
DROP POLICY IF EXISTS "Editors can update smart element data" ON public.smart_element_data;
DROP POLICY IF EXISTS "Users can view smart element data" ON public.smart_element_data;

CREATE POLICY "Editors can create smart element data" ON public.smart_element_data
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.board_objects bo
    WHERE bo.id = board_object_id
      AND public.user_has_board_role(bo.board_id, auth.uid(), 'editor'::board_role)));
CREATE POLICY "Editors can delete smart element data" ON public.smart_element_data
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.board_objects bo
    WHERE bo.id = board_object_id
      AND public.user_has_board_role(bo.board_id, auth.uid(), 'editor'::board_role)));
CREATE POLICY "Editors can update smart element data" ON public.smart_element_data
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.board_objects bo
    WHERE bo.id = board_object_id
      AND public.user_has_board_role(bo.board_id, auth.uid(), 'editor'::board_role)));
CREATE POLICY "Users can view smart element data" ON public.smart_element_data
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.board_objects bo
    WHERE bo.id = board_object_id
      AND public.user_has_board_role(bo.board_id, auth.uid(), 'viewer'::board_role)));

-- ---------- projects ----------
DROP POLICY IF EXISTS "Users can manage own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;

CREATE POLICY "Users can manage own projects" ON public.projects
  FOR ALL TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- ---------- project_phases ----------
DROP POLICY IF EXISTS "Users can access project phases" ON public.project_phases;
CREATE POLICY "Users can access project phases" ON public.project_phases
  FOR ALL TO authenticated
  USING (project_id IN (SELECT p.id FROM public.projects p WHERE p.owner_id = auth.uid()))
  WITH CHECK (project_id IN (SELECT p.id FROM public.projects p WHERE p.owner_id = auth.uid()));

-- ---------- project_tasks ----------
DROP POLICY IF EXISTS "Assigned users can update task status" ON public.project_tasks;
DROP POLICY IF EXISTS "Owners can delete project tasks" ON public.project_tasks;
DROP POLICY IF EXISTS "Owners can manage project tasks" ON public.project_tasks;
DROP POLICY IF EXISTS "Owners can update project tasks" ON public.project_tasks;
DROP POLICY IF EXISTS "Users can view relevant tasks" ON public.project_tasks;

CREATE POLICY "Assigned users can update task status" ON public.project_tasks
  FOR UPDATE TO authenticated
  USING (assigned_to = auth.uid());
CREATE POLICY "Owners can delete project tasks" ON public.project_tasks
  FOR DELETE TO authenticated
  USING (project_id IN (SELECT p.id FROM public.projects p WHERE p.owner_id = auth.uid()));
CREATE POLICY "Owners can insert project tasks" ON public.project_tasks
  FOR INSERT TO authenticated
  WITH CHECK (project_id IN (SELECT p.id FROM public.projects p WHERE p.owner_id = auth.uid()));
CREATE POLICY "Owners can update project tasks" ON public.project_tasks
  FOR UPDATE TO authenticated
  USING (project_id IN (SELECT p.id FROM public.projects p WHERE p.owner_id = auth.uid()));
CREATE POLICY "Users can view relevant tasks" ON public.project_tasks
  FOR SELECT TO authenticated
  USING (project_id IN (SELECT p.id FROM public.projects p WHERE p.owner_id = auth.uid()) OR assigned_to = auth.uid());

-- ---------- invoices ----------
DROP POLICY IF EXISTS "المستخدمون يمكنهم إنشاء فواتيرهم " ON public.invoices;
DROP POLICY IF EXISTS "المستخدمون يمكنهم تحديث فواتيرهم " ON public.invoices;
DROP POLICY IF EXISTS "المستخدمون يمكنهم حذف فواتيرهم ال" ON public.invoices;
DROP POLICY IF EXISTS "المستخدمون يمكنهم عرض فواتيرهم ال" ON public.invoices;

CREATE POLICY "Users can create own invoices" ON public.invoices
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own invoices" ON public.invoices
  FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own invoices" ON public.invoices
  FOR DELETE TO authenticated
  USING (auth.uid() = owner_id);
CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT TO authenticated
  USING (auth.uid() = owner_id);

-- ---------- invoice_items ----------
DROP POLICY IF EXISTS "المستخدمون يمكنهم إدارة بنود فوات" ON public.invoice_items;
CREATE POLICY "Users can manage own invoice items" ON public.invoice_items
  FOR ALL TO authenticated
  USING (invoice_id IN (SELECT i.id FROM public.invoices i WHERE i.owner_id = auth.uid()))
  WITH CHECK (invoice_id IN (SELECT i.id FROM public.invoices i WHERE i.owner_id = auth.uid()));

-- ---------- invoice_payments ----------
DROP POLICY IF EXISTS "المستخدمون يمكنهم إدارة مدفوعات ف" ON public.invoice_payments;
CREATE POLICY "Users can manage own invoice payments" ON public.invoice_payments
  FOR ALL TO authenticated
  USING (invoice_id IN (SELECT i.id FROM public.invoices i WHERE i.owner_id = auth.uid()))
  WITH CHECK (invoice_id IN (SELECT i.id FROM public.invoices i WHERE i.owner_id = auth.uid()));

-- ---------- telemetry_events ----------
DROP POLICY IF EXISTS "Users can insert own telemetry" ON public.telemetry_events;
DROP POLICY IF EXISTS "Users can view own telemetry" ON public.telemetry_events;

CREATE POLICY "Users can insert own telemetry" ON public.telemetry_events
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can view own telemetry" ON public.telemetry_events
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ---------- kv_store_* (5 legacy tables): authenticated only ----------
DROP POLICY IF EXISTS "Authenticated users can access kv_store_06871a1a" ON public.kv_store_06871a1a;
CREATE POLICY "Authenticated users can access kv_store_06871a1a" ON public.kv_store_06871a1a
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can access kv_store_4c8546af" ON public.kv_store_4c8546af;
CREATE POLICY "Authenticated users can access kv_store_4c8546af" ON public.kv_store_4c8546af
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can access kv_store_7c857198" ON public.kv_store_7c857198;
CREATE POLICY "Authenticated users can access kv_store_7c857198" ON public.kv_store_7c857198
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can access kv_store_7e6493e3" ON public.kv_store_7e6493e3;
CREATE POLICY "Authenticated users can access kv_store_7e6493e3" ON public.kv_store_7e6493e3
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can access kv_store_8cde9397" ON public.kv_store_8cde9397;
CREATE POLICY "Authenticated users can access kv_store_8cde9397" ON public.kv_store_8cde9397
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
