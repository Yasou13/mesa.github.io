CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE SCHEMA auth;
CREATE TABLE auth.users(id uuid PRIMARY KEY);
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
GRANT USAGE ON SCHEMA public,auth TO anon,authenticated; GRANT EXECUTE ON FUNCTION auth.uid() TO anon,authenticated;

-- SCHEMA IS APPLIED HERE BY THE RUNNER
GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO anon,authenticated;
INSERT INTO auth.users VALUES('11111111-1111-1111-1111-111111111111'),('22222222-2222-2222-2222-222222222222'),('33333333-3333-3333-3333-333333333333');
INSERT INTO public.editor_roles(user_id,email,role) VALUES('11111111-1111-1111-1111-111111111111','admin@example.test','ADMIN'),('22222222-2222-2222-2222-222222222222','editor@example.test','EDITOR');
INSERT INTO public.articles(slug,language,title,summary,body_markdown,seo_title,seo_description,status) VALUES('private-draft','en','Title','Summary','PRIVATE_DRAFT','SEO','SEO','draft'),('public-article','en','Title','Summary','PUBLISHED','SEO','SEO','published');
SET ROLE authenticated; SELECT set_config('request.jwt.claim.sub','22222222-2222-2222-2222-222222222222',false);
UPDATE public.articles SET status='published' WHERE slug='private-draft';
RESET ROLE; SET ROLE anon;
DO $$ BEGIN IF NOT EXISTS(SELECT FROM public.articles WHERE body_markdown='PRIVATE_DRAFT') THEN RAISE EXCEPTION 'baseline exploit not reproduced'; END IF; END $$;
SELECT 'BASELINE EDITOR PUBLICATION BYPASS REPRODUCED' AS result;
RESET ROLE; UPDATE public.articles SET status='draft' WHERE slug='private-draft';
