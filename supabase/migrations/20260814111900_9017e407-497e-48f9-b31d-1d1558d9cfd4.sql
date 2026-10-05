CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.unschedule('sync-agricapital-daily')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'sync-agricapital-daily');

SELECT cron.schedule(
  'sync-agricapital-daily',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://mlatmyzmjsouxjpjzshd.supabase.co/functions/v1/sync-agricapital',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{"source": "cron"}'::jsonb
  );
  $$
);