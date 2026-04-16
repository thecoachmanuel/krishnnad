-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('dog-images', 'dog-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to read files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'dog-images' );

-- 3. Allow authenticated admins to upload files
CREATE POLICY "Admin Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'dog-images' 
  AND (
    SELECT role = 'admin'
    FROM public.profiles
    WHERE id = auth.uid()
  )
);

-- 4. Allow authenticated admins to delete files
CREATE POLICY "Admin Delete Access"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'dog-images'
  AND (
    SELECT role = 'admin'
    FROM public.profiles
    WHERE id = auth.uid()
  )
);
