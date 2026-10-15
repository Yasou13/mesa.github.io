-- Browser writers may prepare drafts; only a trusted backend may publish.
-- This migration does not implement that backend and must be applied/tested
-- on an isolated database before any production enablement.
ALTER FUNCTION public.is_editor() SET search_path = '';
ALTER FUNCTION public.is_admin() SET search_path = '';
REVOKE EXECUTE ON FUNCTION public.is_editor() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_editor() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

DROP POLICY "Editors insert articles" ON public.articles;
CREATE POLICY "Editors insert articles" ON public.articles FOR INSERT TO authenticated
    WITH CHECK (public.is_editor() AND status IN ('draft', 'ready') AND published_at IS NULL);
DROP POLICY "Editors update articles" ON public.articles;
CREATE POLICY "Editors update articles" ON public.articles FOR UPDATE TO authenticated
    USING (public.is_editor() AND status IN ('draft', 'ready'))
    WITH CHECK (public.is_editor() AND status IN ('draft', 'ready') AND published_at IS NULL);
-- Unpublish and delete must rebuild static output; direct deletes cannot do that.
DROP POLICY "Admins delete articles" ON public.articles;
DROP POLICY "Admins create publication jobs" ON public.publication_jobs;
-- Identity in audit/revision records must not be impersonated by clients.
DROP POLICY "Authenticated users log audit events" ON public.audit_events;
CREATE POLICY "Editors log own audit events" ON public.audit_events FOR INSERT TO authenticated
    WITH CHECK (public.is_editor() AND user_id = auth.uid());
DROP POLICY "Editors insert revisions" ON public.article_revisions;
CREATE POLICY "Editors insert revisions" ON public.article_revisions FOR INSERT TO authenticated
    WITH CHECK (public.is_editor() AND author_id = auth.uid());
-- Draft media metadata must not be publicly enumerable.
DROP POLICY "Public view media assets" ON public.media_assets;
CREATE POLICY "Editors view media assets" ON public.media_assets FOR SELECT TO authenticated
    USING (public.is_editor());
