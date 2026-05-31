-- Add UPDATE policy to board-assets bucket (matches existing INSERT policy pattern)
CREATE POLICY "Editors can update board assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'board-assets'
  AND (storage.foldername(name))[1] IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.boards b
    WHERE b.id::text = (storage.foldername(name))[1]
    AND public.user_has_board_role(b.id, auth.uid(), 'editor'::public.board_role)
  )
);

-- Add access policies for make-7c857198-whiteboard bucket
-- SELECT: board viewers can view whiteboard assets
CREATE POLICY "Users can view whiteboard assets"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'make-7c857198-whiteboard'
  AND (storage.foldername(name))[1] IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.boards b
    WHERE b.id::text = (storage.foldername(name))[1]
    AND public.user_has_board_role(b.id, auth.uid(), 'viewer'::public.board_role)
  )
);

-- INSERT: board editors can upload whiteboard assets
CREATE POLICY "Editors can upload whiteboard assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'make-7c857198-whiteboard'
  AND (storage.foldername(name))[1] IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.boards b
    WHERE b.id::text = (storage.foldername(name))[1]
    AND public.user_has_board_role(b.id, auth.uid(), 'editor'::public.board_role)
  )
);

-- UPDATE: board editors can update whiteboard assets
CREATE POLICY "Editors can update whiteboard assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'make-7c857198-whiteboard'
  AND (storage.foldername(name))[1] IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.boards b
    WHERE b.id::text = (storage.foldername(name))[1]
    AND public.user_has_board_role(b.id, auth.uid(), 'editor'::public.board_role)
  )
);

-- DELETE: board editors can delete whiteboard assets
CREATE POLICY "Editors can delete whiteboard assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'make-7c857198-whiteboard'
  AND (storage.foldername(name))[1] IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM public.boards b
    WHERE b.id::text = (storage.foldername(name))[1]
    AND public.user_has_board_role(b.id, auth.uid(), 'editor'::public.board_role)
  )
);