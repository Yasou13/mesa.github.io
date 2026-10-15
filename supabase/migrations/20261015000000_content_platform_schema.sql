-- ====================================================================
-- MESA Content Platform — Database Schema & Row Level Security (RLS)
-- Version: 1.0.0 (2026-10-15)
-- Target: Supabase PostgreSQL
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USER ROLES ENUM & TABLE
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'editor_role_type') THEN
        CREATE TYPE editor_role_type AS ENUM ('ADMIN', 'EDITOR');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'article_status_type') THEN
        CREATE TYPE article_status_type AS ENUM ('draft', 'ready', 'publishing', 'published', 'failed', 'unpublished');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'publication_job_status') THEN
        CREATE TYPE publication_job_status AS ENUM ('pending', 'building', 'success', 'failed');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.editor_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role editor_role_type NOT NULL DEFAULT 'EDITOR',
    display_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. CATEGORIES & TAXONOMY
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title_en TEXT NOT NULL,
    title_tr TEXT NOT NULL,
    description_en TEXT,
    description_tr TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.tags (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_tr TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. ARTICLES
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'learn', -- 'learn', 'guide', 'research', 'methodology', 'glossary'
    language TEXT NOT NULL CHECK (language IN ('en', 'tr')),
    translation_group_id UUID NOT NULL DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    summary TEXT NOT NULL,
    short_answer TEXT,
    body_markdown TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    author TEXT NOT NULL DEFAULT 'MESA contributors',
    reading_minutes INT NOT NULL DEFAULT 5,
    cover_image TEXT,
    status article_status_type NOT NULL DEFAULT 'draft',
    current_revision INT NOT NULL DEFAULT 1,
    seo_title TEXT NOT NULL,
    seo_description TEXT NOT NULL,
    indexable BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    published_at TIMESTAMPTZ,
    CONSTRAINT uq_article_slug_language UNIQUE (slug, language)
);

CREATE INDEX IF NOT EXISTS idx_articles_status_indexable ON public.articles(status, indexable);
CREATE INDEX IF NOT EXISTS idx_articles_language ON public.articles(language);
CREATE INDEX IF NOT EXISTS idx_articles_translation_group ON public.articles(translation_group_id);

-- 5. ARTICLE REVISIONS (IMMUTABLE SNAPSHOTS)
CREATE TABLE IF NOT EXISTS public.article_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    revision_number INT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    summary TEXT NOT NULL,
    short_answer TEXT,
    body_markdown TEXT NOT NULL,
    seo_title TEXT NOT NULL,
    seo_description TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    change_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_article_revision UNIQUE (article_id, revision_number)
);

CREATE INDEX IF NOT EXISTS idx_article_revisions_article ON public.article_revisions(article_id);

-- 6. MEDIA ASSETS
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    storage_path TEXT NOT NULL UNIQUE,
    mime_type TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    width INT,
    height INT,
    alt_text_en TEXT,
    alt_text_tr TEXT,
    caption_en TEXT,
    caption_tr TEXT,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. PUBLICATION JOBS
CREATE TABLE IF NOT EXISTS public.publication_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL,
    revision_id UUID REFERENCES public.article_revisions(id) ON DELETE SET NULL,
    requested_by UUID NOT NULL REFERENCES auth.users(id),
    status publication_job_status NOT NULL DEFAULT 'pending',
    build_run_id TEXT,
    error_message TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_publication_jobs_status ON public.publication_jobs(status);

-- 8. AUDIT EVENTS
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'create_article', 'update_article', 'publish', 'restore_revision', etc.
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_audit_events_created ON public.audit_events(created_at DESC);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.editor_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publication_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Helper functions to check role
CREATE OR REPLACE FUNCTION public.is_editor()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.editor_roles
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.editor_roles
        WHERE user_id = auth.uid() AND role = 'ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for editor_roles
CREATE POLICY "Users can view their own role"
    ON public.editor_roles FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Only admins can modify roles"
    ON public.editor_roles FOR ALL
    TO authenticated
    USING (public.is_admin());

-- Policies for categories and tags
CREATE POLICY "Public read categories"
    ON public.categories FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Editors manage categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (public.is_editor());

CREATE POLICY "Public read tags"
    ON public.tags FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Editors manage tags"
    ON public.tags FOR ALL
    TO authenticated
    USING (public.is_editor());

-- Policies for articles
-- 1. Anonymous / Public can ONLY view published, indexable articles
CREATE POLICY "Public read published articles"
    ON public.articles FOR SELECT
    TO public
    USING (status = 'published' AND indexable = true);

-- 2. Authenticated Editors can view all articles (including drafts)
CREATE POLICY "Editors read all articles"
    ON public.articles FOR SELECT
    TO authenticated
    USING (public.is_editor());

-- 3. Editors can insert and update articles
CREATE POLICY "Editors insert articles"
    ON public.articles FOR INSERT
    TO authenticated
    WITH CHECK (public.is_editor());

CREATE POLICY "Editors update articles"
    ON public.articles FOR UPDATE
    TO authenticated
    USING (public.is_editor())
    WITH CHECK (public.is_editor());

-- 4. Only admins can delete articles
CREATE POLICY "Admins delete articles"
    ON public.articles FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- Policies for article_revisions
-- Private: Only authenticated editors and admins can view or create revisions
CREATE POLICY "Editors view revisions"
    ON public.article_revisions FOR SELECT
    TO authenticated
    USING (public.is_editor());

CREATE POLICY "Editors insert revisions"
    ON public.article_revisions FOR INSERT
    TO authenticated
    WITH CHECK (public.is_editor());

-- Policies for media_assets
CREATE POLICY "Public view media assets"
    ON public.media_assets FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Editors upload media assets"
    ON public.media_assets FOR INSERT
    TO authenticated
    WITH CHECK (public.is_editor());

CREATE POLICY "Admins delete media assets"
    ON public.media_assets FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- Policies for publication_jobs
CREATE POLICY "Editors view publication jobs"
    ON public.publication_jobs FOR SELECT
    TO authenticated
    USING (public.is_editor());

CREATE POLICY "Admins create publication jobs"
    ON public.publication_jobs FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- Policies for audit_events
CREATE POLICY "Admins view audit events"
    ON public.audit_events FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Authenticated users log audit events"
    ON public.audit_events FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);
