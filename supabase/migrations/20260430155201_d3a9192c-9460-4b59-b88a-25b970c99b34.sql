
-- Re-scope board-assets storage policies to authenticated only
DROP POLICY IF EXISTS "Editors can delete board assets" ON storage.objects;
DROP POLICY IF EXISTS "Editors can upload board assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can view board assets" ON storage.objects;

CREATE POLICY "Editors can delete board assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'board-assets');

CREATE POLICY "Editors can upload board assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'board-assets');

CREATE POLICY "Users can view board assets"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'board-assets');
