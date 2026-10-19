-- Run after both migrations in an isolated PostgreSQL instance with Supabase-like
-- auth.uid(), anon/authenticated roles and table grants (see audit evidence).
\set ON_ERROR_STOP on
SET ROLE anon;
DO $$ BEGIN
  IF (SELECT count(*) FROM public.articles WHERE status <> 'published') <> 0 THEN
    RAISE EXCEPTION 'anonymous draft leakage';
  END IF;
  BEGIN
    INSERT INTO public.articles(slug,language,title,summary,body_markdown,seo_title,seo_description)
    VALUES('anonymous-draft','en','Title','Summary','Secret','SEO','SEO');
    RAISE EXCEPTION 'anonymous draft insert allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    PERFORM public.is_admin();
    RAISE EXCEPTION 'anonymous privileged helper execution allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END $$;
RESET ROLE;
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','22222222-2222-2222-2222-222222222222',false);
DO $$ BEGIN
  IF public.is_admin() THEN RAISE EXCEPTION 'editor is admin'; END IF;
  UPDATE public.editor_roles SET role='ADMIN' WHERE user_id=auth.uid();
  IF FOUND THEN RAISE EXCEPTION 'self-promotion allowed'; END IF;
  BEGIN
    UPDATE public.articles SET status='published' WHERE slug='private-draft';
    RAISE EXCEPTION 'editor published draft';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  UPDATE public.articles SET body_markdown='LEAKED' WHERE slug='public-article';
  IF FOUND THEN RAISE EXCEPTION 'editor changed public payload'; END IF;
  BEGIN
    INSERT INTO public.articles(slug,language,title,summary,body_markdown,seo_title,seo_description,status)
    VALUES('forged-public','en','Title','Summary','Secret','SEO','SEO','published');
    RAISE EXCEPTION 'editor inserted published row';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    INSERT INTO public.audit_events(user_id,action,entity_type,entity_id)
    VALUES('11111111-1111-1111-1111-111111111111','publish','article','forged');
    RAISE EXCEPTION 'editor impersonated admin audit event';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  UPDATE public.articles SET title='Edited draft' WHERE slug='private-draft';
  IF NOT FOUND THEN RAISE EXCEPTION 'editor cannot edit draft'; END IF;
END $$;
SELECT set_config('request.jwt.claim.sub','11111111-1111-1111-1111-111111111111',false);
DO $$ BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'admin role failed'; END IF;
  BEGIN
    UPDATE public.articles SET status='published' WHERE slug='private-draft';
    RAISE EXCEPTION 'admin bypassed trusted publishing backend';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    INSERT INTO public.publication_jobs(requested_by) VALUES(auth.uid());
    RAISE EXCEPTION 'unimplemented dispatcher accepted a job';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END $$;

-- New editorial behavior: complete snapshots, atomic rollback and draft-only deletion.
DO $$ DECLARE target uuid; rev integer; saved_time timestamptz;
BEGIN
 SELECT id,current_revision,updated_at INTO target,rev,saved_time FROM public.articles WHERE slug='private-draft';
 UPDATE public.articles SET title='Revision check',seo_title='Restorable SEO',tags=ARRAY['traceable'] WHERE id=target AND updated_at=saved_time;
 IF NOT FOUND THEN RAISE EXCEPTION 'optimistic draft save failed'; END IF;
 IF NOT EXISTS(SELECT FROM public.article_revisions WHERE article_id=target AND revision_number=rev+1 AND title='Revision check' AND metadata->'tags'='["traceable"]'::jsonb) THEN RAISE EXCEPTION 'revision snapshot missing content or metadata'; END IF;
 UPDATE public.articles SET title='stale' WHERE id=target AND updated_at=saved_time;
 IF FOUND THEN RAISE EXCEPTION 'stale update unexpectedly accepted'; END IF;
 BEGIN
   UPDATE public.articles SET title='must roll back' WHERE id=target;
   RAISE EXCEPTION 'force rollback';
 EXCEPTION WHEN raise_exception THEN NULL;
 END;
 IF (SELECT title FROM public.articles WHERE id=target)<>'Revision check' THEN RAISE EXCEPTION 'draft transaction did not roll back'; END IF;
 IF EXISTS(SELECT FROM public.article_revisions WHERE article_id=target AND title='must roll back') THEN RAISE EXCEPTION 'revision transaction did not roll back'; END IF;
 DELETE FROM public.articles WHERE slug='public-article';
 IF FOUND THEN RAISE EXCEPTION 'admin deleted published content'; END IF;
 INSERT INTO public.articles(slug,language,title,summary,body_markdown,seo_title,seo_description)
 VALUES('disposable-draft','tr','Draft','Summary','Body','SEO','SEO') RETURNING id INTO target;
 IF NOT EXISTS(SELECT FROM public.article_revisions WHERE article_id=target AND revision_number=1) THEN RAISE EXCEPTION 'creation snapshot missing'; END IF;
 DELETE FROM public.articles WHERE id=target;
 IF NOT FOUND THEN RAISE EXCEPTION 'admin could not delete draft'; END IF;
 IF EXISTS(SELECT FROM public.article_revisions WHERE article_id=target) THEN RAISE EXCEPTION 'orphan revision remained'; END IF;
END $$;
SELECT 'EDITORIAL REVISIONS AND DRAFT DELETION PASS' AS result;
SELECT set_config('request.jwt.claim.sub','33333333-3333-3333-3333-333333333333',false);
DO $$ BEGIN
  IF public.is_editor() THEN RAISE EXCEPTION 'unassigned user is editor'; END IF;
  IF (SELECT count(*) FROM public.articles WHERE status='draft') <> 0 THEN
    RAISE EXCEPTION 'unassigned user read drafts';
  END IF;
END $$;
RESET ROLE;
-- Private metadata is protected even when it exists (not just an empty-table check).
INSERT INTO public.media_assets(filename,storage_path,mime_type,file_size_bytes)
VALUES('private-draft.png','private/draft.png','image/png',123);
SET ROLE anon;
DO $$ BEGIN
 IF (SELECT count(*) FROM public.media_assets) <> 0 THEN RAISE EXCEPTION 'anonymous media metadata leak'; END IF;
 IF (SELECT count(*) FROM public.article_revisions) <> 0 THEN RAISE EXCEPTION 'anonymous revision leak'; END IF;
END $$;
RESET ROLE;
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','33333333-3333-3333-3333-333333333333',false);
DO $$ BEGIN
 IF (SELECT count(*) FROM public.media_assets) <> 0 THEN RAISE EXCEPTION 'unassigned media metadata leak'; END IF;
END $$;
RESET ROLE;
DELETE FROM public.editor_roles WHERE user_id='11111111-1111-1111-1111-111111111111';
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','11111111-1111-1111-1111-111111111111',false);
DO $$ BEGIN
 IF public.is_admin() THEN RAISE EXCEPTION 'revoked administrator still authorized'; END IF;
 IF (SELECT count(*) FROM public.articles WHERE status='draft') <> 0 THEN RAISE EXCEPTION 'revoked administrator read draft'; END IF;
END $$;
RESET ROLE;
SELECT 'CMS AUTHORIZATION PASS' AS result;
