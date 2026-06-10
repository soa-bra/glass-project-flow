
DROP POLICY IF EXISTS "Authenticated users with valid token can create join requests" ON public.board_join_requests;

CREATE POLICY "Authenticated users with valid token can create join requests"
ON public.board_join_requests
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.board_invite_links bil
    WHERE bil.id = board_join_requests.invite_link_id
      AND bil.board_id = board_join_requests.board_id
      AND bil.is_active = true
      AND (bil.expires_at IS NULL OR bil.expires_at > now())
  )
);
