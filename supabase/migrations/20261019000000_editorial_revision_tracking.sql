-- Draft editing stays behind existing Auth/RLS; publication remains backend-only.
-- Snapshots and audit entries commit in the same transaction as each draft write.
ALTER TABLE public.article_revisions ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}';

CREATE OR REPLACE FUNCTION public.track_editorial_revision()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  revision integer;
BEGIN
  IF auth.uid() IS NULL OR NOT public.is_editor() THEN RETURN NEW; END IF;
  IF TG_WHEN = 'BEFORE' THEN
    IF TG_OP = 'UPDATE' THEN
      -- Seed the original content of existing drafts before the first managed edit.
      INSERT INTO public.article_revisions(article_id, revision_number, title, subtitle, summary,
        short_answer, body_markdown, seo_title, seo_description, author_id, change_summary, metadata)
      VALUES(OLD.id, OLD.current_revision, OLD.title, OLD.subtitle, OLD.summary, OLD.short_answer,
        OLD.body_markdown, OLD.seo_title, OLD.seo_description, auth.uid(), 'Before editor update',
        pg_catalog.jsonb_build_object('slug',OLD.slug,'category_id',OLD.category_id,'tags',OLD.tags,
          'reading_minutes',OLD.reading_minutes,'indexable',OLD.indexable))
      ON CONFLICT (article_id, revision_number) DO NOTHING;
      SELECT COALESCE(MAX(r.revision_number),0) + 1 INTO revision
        FROM public.article_revisions r WHERE r.article_id=NEW.id;
      NEW.current_revision := revision;
    ELSE
      NEW.current_revision := 1;
    END IF;
    NEW.updated_at := pg_catalog.clock_timestamp();
  ELSE
    INSERT INTO public.article_revisions(article_id, revision_number, title, subtitle, summary,
      short_answer, body_markdown, seo_title, seo_description, author_id, change_summary, metadata)
    VALUES(NEW.id, NEW.current_revision, NEW.title, NEW.subtitle, NEW.summary, NEW.short_answer,
      NEW.body_markdown, NEW.seo_title, NEW.seo_description, auth.uid(),
      CASE WHEN TG_OP='INSERT' THEN 'Draft created' ELSE 'Draft saved' END,
      pg_catalog.jsonb_build_object('slug',NEW.slug,'category_id',NEW.category_id,'tags',NEW.tags,
        'reading_minutes',NEW.reading_minutes,'indexable',NEW.indexable));
    INSERT INTO public.audit_events(user_id,action,entity_type,entity_id)
    VALUES(auth.uid(),CASE WHEN TG_OP='INSERT' THEN 'create_article' ELSE 'update_article' END,'article',NEW.id::text);
  END IF;
  RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.track_editorial_revision() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.track_editorial_revision() TO authenticated;
CREATE TRIGGER editorial_revision_before BEFORE INSERT OR UPDATE ON public.articles
  FOR EACH ROW WHEN (NEW.status IN ('draft','ready')) EXECUTE FUNCTION public.track_editorial_revision();
CREATE TRIGGER editorial_revision_after AFTER INSERT OR UPDATE ON public.articles
  FOR EACH ROW WHEN (NEW.status IN ('draft','ready')) EXECUTE FUNCTION public.track_editorial_revision();

-- Only never-published drafts are deletable. Published rows and jobs stay protected.
CREATE POLICY "Admins delete unpublished drafts" ON public.articles FOR DELETE TO authenticated
  USING (public.is_admin() AND status IN ('draft','ready') AND published_at IS NULL);
