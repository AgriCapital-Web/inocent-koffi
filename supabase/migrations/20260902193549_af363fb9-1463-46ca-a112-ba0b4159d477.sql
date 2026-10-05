
CREATE TABLE IF NOT EXISTS public.internal_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

REVOKE ALL ON public.internal_config FROM anon, authenticated;
GRANT ALL ON public.internal_config TO service_role;
ALTER TABLE public.internal_config ENABLE ROW LEVEL SECURITY;

INSERT INTO public.internal_config (key, value)
VALUES ('sync_cron_secret', encode(gen_random_bytes(32), 'hex'))
ON CONFLICT (key) DO NOTHING;

-- Blog reactions: ensure contact details are unreadable through the public API
REVOKE SELECT ON public.blog_likes FROM anon, authenticated;
GRANT SELECT (id, post_id, reaction_type, created_at) ON public.blog_likes TO anon, authenticated;
GRANT ALL ON public.blog_likes TO service_role;

-- Reschedule the daily sync so it authenticates with the private secret
SELECT cron.unschedule('sync-agricapital-daily');
SELECT cron.schedule(
  'sync-agricapital-daily',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://mlatmyzmjsouxjpjzshd.supabase.co/functions/v1/sync-agricapital',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (SELECT value FROM public.internal_config WHERE key = 'sync_cron_secret')
    ),
    body := '{"source": "cron"}'::jsonb
  );
  $$
);
