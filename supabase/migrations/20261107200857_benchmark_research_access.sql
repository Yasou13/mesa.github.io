BEGIN;

CREATE TABLE public.benchmark_research_requests (
  user_id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  purpose text NOT NULL CHECK (length(btrim(purpose)) BETWEEN 20 AND 1000),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'revoked')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.benchmark_research_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.benchmark_research_requests FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.benchmark_research_requests TO authenticated;
GRANT INSERT (purpose), UPDATE (status) ON public.benchmark_research_requests TO authenticated;

CREATE POLICY benchmark_research_read ON public.benchmark_research_requests
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR (SELECT public.is_admin()));

CREATE POLICY benchmark_research_request ON public.benchmark_research_requests
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()) AND status = 'pending');

CREATE POLICY benchmark_research_review ON public.benchmark_research_requests
  FOR UPDATE TO authenticated
  USING ((SELECT public.is_admin()))
  WITH CHECK ((SELECT public.is_admin()));

-- Buckets are created as private through the Storage API or Dashboard.
CREATE POLICY benchmark_archive_owner_only ON storage.objects
  AS RESTRICTIVE FOR ALL TO anon, authenticated
  USING (bucket_id <> 'benchmark-corpus-archive')
  WITH CHECK (bucket_id <> 'benchmark-corpus-archive');

CREATE POLICY benchmark_research_anon_denied ON storage.objects
  AS RESTRICTIVE FOR ALL TO anon
  USING (bucket_id <> 'benchmark-research')
  WITH CHECK (bucket_id <> 'benchmark-research');

CREATE POLICY benchmark_research_read_gate ON storage.objects
  AS RESTRICTIVE FOR SELECT TO authenticated
  USING (
    bucket_id <> 'benchmark-research'
    OR (
      name IN ('v1/mesa-legal-v1-s.tar.gz', 'v1/mesa-legal-v1-m.tar.gz', 'v1/mesa-legal-v1-l.tar.gz')
      AND EXISTS (
        SELECT 1 FROM public.benchmark_research_requests
        WHERE user_id = (SELECT auth.uid()) AND status = 'approved'
      )
    )
  );

CREATE POLICY benchmark_research_download ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'benchmark-research');

CREATE POLICY benchmark_research_no_client_insert ON storage.objects
  AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (bucket_id <> 'benchmark-research');

CREATE POLICY benchmark_research_no_client_update ON storage.objects
  AS RESTRICTIVE FOR UPDATE TO authenticated
  USING (bucket_id <> 'benchmark-research') WITH CHECK (bucket_id <> 'benchmark-research');

CREATE POLICY benchmark_research_no_client_delete ON storage.objects
  AS RESTRICTIVE FOR DELETE TO authenticated USING (bucket_id <> 'benchmark-research');

NOTIFY pgrst, 'reload schema';
COMMIT;
