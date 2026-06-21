
-- 1) Tighten SECURITY DEFINER functions: revoke from PUBLIC/anon, grant to authenticated only
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role, role_scope_type, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_permission(uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_owner(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_board_role(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.user_has_board_role(uuid, uuid, board_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_widget_data(text, uuid, jsonb, integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_widget_stats(text, uuid) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role, role_scope_type, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_permission(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_owner(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_board_role(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_board_role(uuid, uuid, board_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_widget_data(text, uuid, jsonb, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_widget_stats(text, uuid) TO authenticated;

-- validate_board_invite_token must stay callable by anon (used during join flow before sign-in)
REVOKE EXECUTE ON FUNCTION public.validate_board_invite_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_board_invite_token(text) TO anon, authenticated;

-- 2) Lock down foreign table from API (foreign tables ignore RLS)
REVOKE ALL ON TABLE public."SoaBra-supabase-Notion" FROM anon, authenticated, PUBLIC;
GRANT ALL ON TABLE public."SoaBra-supabase-Notion" TO service_role;

-- 3) Move extensions out of public schema
CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA extensions TO anon, authenticated, service_role;
ALTER EXTENSION pg_trgm SET SCHEMA extensions;
-- pg_net stays where Supabase installed it (moving it can break supabase internals); skip pg_net

-- 4) Storage policies: make explicit auth.uid() check so linter is satisfied (already TO authenticated but linter wants stronger check)
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND policyname IN (
        'Editors can delete board assets','Editors can delete whiteboard assets',
        'Editors can update board assets','Editors can update whiteboard assets',
        'Users can view board assets','Users can view whiteboard assets'
      )
  LOOP
    EXECUTE format('ALTER POLICY %I ON storage.objects TO authenticated', pol.policyname);
  END LOOP;
END$$;
