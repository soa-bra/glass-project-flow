
-- 1) Require token possession for board_join_requests inserts
ALTER TABLE public.board_join_requests
  ADD COLUMN IF NOT EXISTS invite_token text;

DROP POLICY IF EXISTS "Authenticated users with valid token can create join requests" ON public.board_join_requests;

CREATE POLICY "Authenticated users with valid token can create join requests"
ON public.board_join_requests
FOR INSERT
TO authenticated, anon
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.board_invite_links bil
    WHERE bil.id = board_join_requests.invite_link_id
      AND bil.board_id = board_join_requests.board_id
      AND bil.token = board_join_requests.invite_token
      AND bil.is_active = true
      AND (bil.expires_at IS NULL OR bil.expires_at > now())
  )
);

-- 2) Broaden realtime topic regex to cover all published board-scoped tables
DROP POLICY IF EXISTS "Authenticated can read accessible realtime channels" ON realtime.messages;
DROP POLICY IF EXISTS "Authenticated can broadcast on accessible realtime channels" ON realtime.messages;

CREATE POLICY "Authenticated can read accessible realtime channels"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  CASE
    WHEN realtime.topic() ~ '^(board|planning_board|board_objects|board_permissions|board_join_requests|op_log|links|board-)[:_-][0-9a-f-]{36}$'
      THEN public.user_has_board_role((regexp_replace(realtime.topic(), '^[^:_-]+[:_-]', ''))::uuid, auth.uid(), 'viewer'::board_role)
    WHEN realtime.topic() LIKE 'engine_jobs%' OR realtime.topic() LIKE 'outbox%'
      THEN public.is_owner(auth.uid())
    WHEN realtime.topic() ~ '^user[:_-][0-9a-f-]{36}$'
      THEN (regexp_replace(realtime.topic(), '^user[:_-]', ''))::uuid = auth.uid()
    ELSE false
  END
);

CREATE POLICY "Authenticated can broadcast on accessible realtime channels"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (
  CASE
    WHEN realtime.topic() ~ '^(board|planning_board|board_objects|board_permissions|board_join_requests|op_log|links|board-)[:_-][0-9a-f-]{36}$'
      THEN public.user_has_board_role((regexp_replace(realtime.topic(), '^[^:_-]+[:_-]', ''))::uuid, auth.uid(), 'editor'::board_role)
    WHEN realtime.topic() LIKE 'engine_jobs%' OR realtime.topic() LIKE 'outbox%'
      THEN public.is_owner(auth.uid())
    WHEN realtime.topic() ~ '^user[:_-][0-9a-f-]{36}$'
      THEN (regexp_replace(realtime.topic(), '^user[:_-]', ''))::uuid = auth.uid()
    ELSE false
  END
);
