-- Private request inbox; anonymous visitors can only use the bounded submission RPC.
BEGIN;
CREATE TABLE public.early_access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL CHECK (length(email) <= 254 AND email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'),
  intent text NOT NULL CHECK (intent IN ('try','integration','contribute')),
  use_case text NOT NULL CHECK (length(btrim(use_case)) BETWEEN 20 AND 2000),
  organization text NOT NULL DEFAULT '' CHECK (length(organization) <= 160),
  github_url text NOT NULL DEFAULT '' CHECK (length(github_url) <= 240 AND (github_url = '' OR github_url ~* '^https://github[.]com/[a-z0-9_-]+(/[a-z0-9_.-]+)?/?$')),
  language text NOT NULL CHECK (language IN ('en','tr')),
  privacy_version text NOT NULL DEFAULT '2026-10-19',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewing','contacted','invited','closed','spam')),
  admin_notes text NOT NULL DEFAULT '' CHECK (length(admin_notes) <= 4000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX early_access_email_intent ON public.early_access_requests (lower(email), intent);
CREATE INDEX early_access_created ON public.early_access_requests (created_at DESC, id);
ALTER TABLE public.early_access_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.early_access_requests FROM PUBLIC, anon, authenticated;
GRANT SELECT, DELETE ON public.early_access_requests TO authenticated;
GRANT UPDATE(status,admin_notes) ON public.early_access_requests TO authenticated;
CREATE POLICY early_access_admin_read ON public.early_access_requests FOR SELECT TO authenticated USING ((SELECT public.is_admin()));
CREATE POLICY early_access_admin_update ON public.early_access_requests FOR UPDATE TO authenticated USING ((SELECT public.is_admin())) WITH CHECK ((SELECT public.is_admin()));
CREATE POLICY early_access_admin_delete ON public.early_access_requests FOR DELETE TO authenticated USING ((SELECT public.is_admin()));

CREATE TABLE public.early_access_rate_limits (bucket timestamptz NOT NULL, fingerprint text NOT NULL, attempts integer NOT NULL, PRIMARY KEY(bucket,fingerprint));
ALTER TABLE public.early_access_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.early_access_rate_limits FROM PUBLIC, anon, authenticated;
CREATE FUNCTION public.early_access_touch() RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN NEW.updated_at := clock_timestamp(); RETURN NEW; END; $$;
REVOKE ALL ON FUNCTION public.early_access_touch() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER early_access_touch BEFORE UPDATE ON public.early_access_requests FOR EACH ROW EXECUTE FUNCTION public.early_access_touch();

CREATE FUNCTION public.early_access_available() RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path = '' AS $$ SELECT true $$;
REVOKE ALL ON FUNCTION public.early_access_available() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.early_access_available() TO anon, authenticated;

CREATE FUNCTION public.submit_early_access(p_email text, p_intent text, p_use_case text, p_organization text DEFAULT '', p_github_url text DEFAULT '', p_language text DEFAULT 'en', p_website text DEFAULT '', p_acknowledged boolean DEFAULT false)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  headers jsonb := coalesce(nullif(current_setting('request.headers',true),'')::jsonb,'{}'::jsonb);
  v_fingerprint text;
  attempt_count integer;
  hour_bucket timestamptz := date_trunc('hour',now());
BEGIN
  IF p_email IS NULL OR length(btrim(p_email)) > 254 OR btrim(p_email) !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    OR p_intent IS NULL OR p_intent NOT IN ('try','integration','contribute')
    OR p_use_case IS NULL OR length(btrim(p_use_case)) NOT BETWEEN 20 AND 2000
    OR p_organization IS NULL OR length(p_organization) > 160
    OR p_github_url IS NULL OR length(p_github_url) > 240 OR (p_github_url <> '' AND p_github_url !~* '^https://github[.]com/[a-z0-9_-]+(/[a-z0-9_.-]+)?/?$')
    OR p_language IS NULL OR p_language NOT IN ('en','tr') OR p_website IS DISTINCT FROM '' OR p_acknowledged IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Invalid request' USING ERRCODE = '22023';
  END IF;
  -- A fixed lock makes the global cap and per-hour checks atomic under concurrency.
  PERFORM pg_advisory_xact_lock(729641052);
  -- Only a hash of the forwarded network address is retained, and expired buckets are pruned on submission.
  v_fingerprint := md5('mesa-early-access:' || coalesce(nullif(headers->>'cf-connecting-ip',''),nullif(split_part(headers->>'x-forwarded-for',',',1),''),'unknown'));
  DELETE FROM public.early_access_rate_limits WHERE bucket < now() - interval '48 hours';
  INSERT INTO public.early_access_rate_limits AS limits(bucket,fingerprint,attempts) VALUES(hour_bucket,v_fingerprint,1)
    ON CONFLICT(bucket,fingerprint) DO UPDATE SET attempts = limits.attempts + 1 RETURNING attempts INTO attempt_count;
  IF attempt_count > 5 OR (SELECT coalesce(sum(attempts),0) FROM public.early_access_rate_limits WHERE bucket >= now() - interval '24 hours') > 500 THEN
    RAISE EXCEPTION 'Too many requests' USING ERRCODE = 'P0429';
  END IF;
  INSERT INTO public.early_access_requests(email,intent,use_case,organization,github_url,language)
    VALUES(lower(btrim(p_email)),p_intent,btrim(p_use_case),btrim(p_organization),p_github_url,p_language)
    ON CONFLICT(lower(email),intent) DO NOTHING;
  -- Identical acknowledgement for new and duplicate submissions; never disclose records.
  RETURN jsonb_build_object('accepted',true);
END; $$;
REVOKE ALL ON FUNCTION public.submit_early_access(text,text,text,text,text,text,text,boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_early_access(text,text,text,text,text,text,text,boolean) TO anon, authenticated;
NOTIFY pgrst, 'reload schema';
COMMIT;
