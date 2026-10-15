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
SELECT set_config('request.jwt.claim.sub','33333333-3333-3333-3333-333333333333',false);
DO $$ BEGIN
  IF public.is_editor() THEN RAISE EXCEPTION 'unassigned user is editor'; END IF;
  IF (SELECT count(*) FROM public.articles WHERE status='draft') <> 0 THEN
    RAISE EXCEPTION 'unassigned user read drafts';
  END IF;
END $$;
RESET ROLE;
SELECT 'CMS AUTHORIZATION PASS' AS result;
