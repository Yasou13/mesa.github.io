-- ====================================================================
-- MESA Content Platform — Storage Bucket & Media Policies
-- Migration: 20261015020000_storage_and_media_policies.sql
-- ====================================================================

-- 1. Create media bucket in Supabase Storage (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'media',
    'media',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']::text[];

-- 2. Storage RLS Policies for media bucket
DROP POLICY IF EXISTS "Public view media bucket" ON storage.objects;
CREATE POLICY "Public view media bucket"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Editors upload media objects" ON storage.objects;
CREATE POLICY "Editors upload media objects"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'media'
        AND public.is_editor()
    );

DROP POLICY IF EXISTS "Editors update media objects" ON storage.objects;
CREATE POLICY "Editors update media objects"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'media' AND public.is_editor())
    WITH CHECK (bucket_id = 'media' AND public.is_editor());

DROP POLICY IF EXISTS "Admins delete media objects" ON storage.objects;
CREATE POLICY "Admins delete media objects"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'media' AND public.is_admin());

-- 3. Media Assets table RLS write policies
DROP POLICY IF EXISTS "Editors insert media assets" ON public.media_assets;
CREATE POLICY "Editors insert media assets"
    ON public.media_assets FOR INSERT
    TO authenticated
    WITH CHECK (public.is_editor() AND uploaded_by = auth.uid());

DROP POLICY IF EXISTS "Editors update media assets" ON public.media_assets;
CREATE POLICY "Editors update media assets"
    ON public.media_assets FOR UPDATE
    TO authenticated
    USING (public.is_editor())
    WITH CHECK (public.is_editor());

DROP POLICY IF EXISTS "Admins delete media assets" ON public.media_assets;
CREATE POLICY "Admins delete media assets"
    ON public.media_assets FOR DELETE
    TO authenticated
    USING (public.is_admin());
