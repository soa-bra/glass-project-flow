
-- 1) Restrict has_permission to self-checks only (prevents role enumeration)
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission_code text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
  SELECT
    _user_id = auth.uid()
    AND (
      EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.role_permissions rp ON rp.role = ur.role
        WHERE ur.user_id = _user_id
          AND rp.permission_code = _permission_code
          AND (ur.expires_at IS NULL OR ur.expires_at > now())
      )
      OR public.is_owner(_user_id)
    );
$$;

-- 2) Tighten board-assets storage policies to require board membership
DROP POLICY IF EXISTS "Users can view board assets" ON storage.objects;
DROP POLICY IF EXISTS "Editors can upload board assets" ON storage.objects;
DROP POLICY IF EXISTS "Editors can update board assets" ON storage.objects;
DROP POLICY IF EXISTS "Editors can delete board assets" ON storage.objects;

CREATE POLICY "Users can view board assets"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'board-assets'
  AND (storage.foldername(name))[1] IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.boards b
    WHERE b.id::text = (storage.foldername(objects.name))[1]
      AND public.user_has_board_role(b.id, auth.uid(), 'viewer'::board_role)
  )
);

CREATE POLICY "Editors can upload board assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'board-assets'
  AND (storage.foldername(name))[1] IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.boards b
    WHERE b.id::text = (storage.foldername(objects.name))[1]
      AND public.user_has_board_role(b.id, auth.uid(), 'editor'::board_role)
  )
);

CREATE POLICY "Editors can update board assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'board-assets'
  AND (storage.foldername(name))[1] IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.boards b
    WHERE b.id::text = (storage.foldername(objects.name))[1]
      AND public.user_has_board_role(b.id, auth.uid(), 'editor'::board_role)
  )
);

CREATE POLICY "Editors can delete board assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'board-assets'
  AND (storage.foldername(name))[1] IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.boards b
    WHERE b.id::text = (storage.foldername(objects.name))[1]
      AND public.user_has_board_role(b.id, auth.uid(), 'editor'::board_role)
  )
);
