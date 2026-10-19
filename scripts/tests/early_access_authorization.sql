RESET ROLE;
INSERT INTO public.editor_roles(user_id,email,role) VALUES('11111111-1111-1111-1111-111111111111','admin@example.test','ADMIN');
SET ROLE anon;
SELECT set_config('request.headers','{"x-forwarded-for":"192.0.2.42"}',false);
DO $$ BEGIN
  IF NOT public.early_access_available() THEN RAISE EXCEPTION 'health check failed'; END IF;
  BEGIN
    PERFORM * FROM public.early_access_requests;
    RAISE EXCEPTION 'anonymous request read allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    INSERT INTO public.early_access_requests(email,intent,use_case,language) VALUES('forged@example.test','try','A valid but forged use case','en');
    RAISE EXCEPTION 'anonymous direct insert allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    PERFORM public.submit_early_access('bad','try','too short','','','en','',true);
    RAISE EXCEPTION 'bad input accepted';
  EXCEPTION WHEN invalid_parameter_value THEN NULL; END;
  BEGIN
    PERFORM public.submit_early_access('test@example.test','try','Valid use case for consent check','','','en','',false);
    RAISE EXCEPTION 'missing acknowledgement accepted';
  EXCEPTION WHEN invalid_parameter_value THEN NULL; END;
  BEGIN
    PERFORM public.submit_early_access('test@example.test','try','Valid use case for bot check','','','en','bot',true);
    RAISE EXCEPTION 'honeypot accepted';
  EXCEPTION WHEN invalid_parameter_value THEN NULL; END;
  BEGIN
    PERFORM public.submit_early_access('test@example.test','try','Valid use case for URL check','','javascript:alert(1)','en','',true);
    RAISE EXCEPTION 'unsafe URL accepted';
  EXCEPTION WHEN invalid_parameter_value THEN NULL; END;
END $$;
SELECT public.submit_early_access(' Test@Example.test ','try','Private use case for testing','Example project','https://github.com/Yasou13/MESA','tr','',true);
SELECT public.submit_early_access('test@example.test','try','Duplicate must not overwrite private request','','','en','',true);
SELECT public.submit_early_access('test@example.test','integration','Another intent for the same email','','','en','',true);
SELECT public.submit_early_access('second@example.test','try','Another legitimate test request','','','en','',true);
SELECT public.submit_early_access('third@example.test','try','A fifth request from this address','','','en','',true);
DO $$ BEGIN
  BEGIN
    PERFORM public.submit_early_access('fourth@example.test','try','Too many requests from this address','','','en','',true);
    RAISE EXCEPTION 'rate cap bypassed';
  EXCEPTION WHEN SQLSTATE 'P0429' THEN NULL; END;
END $$;
RESET ROLE;
DO $$ BEGIN
  IF (SELECT count(*) FROM public.early_access_requests) <> 4 THEN RAISE EXCEPTION 'deduplication failed'; END IF;
  IF (SELECT use_case FROM public.early_access_requests WHERE email='test@example.test' AND intent='try') <> 'Private use case for testing' THEN RAISE EXCEPTION 'duplicate overwrote request'; END IF;
END $$;
SET ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','22222222-2222-2222-2222-222222222222',false);
DO $$ BEGIN
  IF (SELECT count(*) FROM public.early_access_requests) <> 0 THEN RAISE EXCEPTION 'editor read private requests'; END IF;
  UPDATE public.early_access_requests SET status='invited';
  IF FOUND THEN RAISE EXCEPTION 'editor changed request'; END IF;
  DELETE FROM public.early_access_requests;
  IF FOUND THEN RAISE EXCEPTION 'editor deleted request'; END IF;
END $$;
SELECT set_config('request.jwt.claim.sub','11111111-1111-1111-1111-111111111111',false);
DO $$ BEGIN
  IF (SELECT count(*) FROM public.early_access_requests) <> 4 THEN RAISE EXCEPTION 'admin request read failed'; END IF;
  UPDATE public.early_access_requests SET status='reviewing',admin_notes='Internal note' WHERE email='test@example.test' AND intent='try';
  IF NOT FOUND THEN RAISE EXCEPTION 'admin update failed'; END IF;
  BEGIN
    UPDATE public.early_access_requests SET email='forged@example.test';
    RAISE EXCEPTION 'admin rewrote original submission';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    UPDATE public.early_access_requests SET status='published';
    RAISE EXCEPTION 'invalid request status accepted';
  EXCEPTION WHEN check_violation THEN NULL; END;
END $$;
RESET ROLE;
SELECT 'EARLY ACCESS AUTHORIZATION PASS' AS result;
