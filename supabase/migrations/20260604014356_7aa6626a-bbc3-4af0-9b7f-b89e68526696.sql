
-- 1) Fix overly-permissive INSERT on public.dependencies (was WITH CHECK true)
DROP POLICY IF EXISTS "auth manage dependencies" ON public.dependencies;
CREATE POLICY "owners insert dependencies"
ON public.dependencies
FOR INSERT
TO authenticated
WITH CHECK (public.is_owner(auth.uid()));

-- 2) Add RLS policies on realtime.messages so authenticated users can only
--    subscribe to channels they have access to.
ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can read accessible realtime channels" ON realtime.messages;
CREATE POLICY "Authenticated can read accessible realtime channels"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  -- Board-scoped topics: "board:<uuid>" or "planning_board:<uuid>" or "board_objects:<uuid>"
  CASE
    WHEN realtime.topic() ~ '^(board|planning_board|board_objects|board-)[:_-][0-9a-f-]{36}$' THEN
      public.user_has_board_role(
        (regexp_replace(realtime.topic(), '^[^:_-]+[:_-]', ''))::uuid,
        auth.uid(),
        'viewer'::public.board_role
      )
    -- Owner-only operational channels
    WHEN realtime.topic() LIKE 'engine_jobs%' OR realtime.topic() LIKE 'outbox%' THEN
      public.is_owner(auth.uid())
    -- User-scoped channels: "user:<uuid>"
    WHEN realtime.topic() ~ '^user[:_-][0-9a-f-]{36}$' THEN
      (regexp_replace(realtime.topic(), '^user[:_-]', ''))::uuid = auth.uid()
    ELSE FALSE
  END
);

DROP POLICY IF EXISTS "Authenticated can broadcast on accessible realtime channels" ON realtime.messages;
CREATE POLICY "Authenticated can broadcast on accessible realtime channels"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (
  CASE
    WHEN realtime.topic() ~ '^(board|planning_board|board_objects|board-)[:_-][0-9a-f-]{36}$' THEN
      public.user_has_board_role(
        (regexp_replace(realtime.topic(), '^[^:_-]+[:_-]', ''))::uuid,
        auth.uid(),
        'editor'::public.board_role
      )
    WHEN realtime.topic() LIKE 'engine_jobs%' OR realtime.topic() LIKE 'outbox%' THEN
      public.is_owner(auth.uid())
    WHEN realtime.topic() ~ '^user[:_-][0-9a-f-]{36}$' THEN
      (regexp_replace(realtime.topic(), '^user[:_-]', ''))::uuid = auth.uid()
    ELSE FALSE
  END
);
