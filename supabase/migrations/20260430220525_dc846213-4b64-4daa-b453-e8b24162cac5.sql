
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT jobid, jobname FROM cron.job
           WHERE jobname IN ('outbox-relay-every-minute','engine-jobs-worker-every-minute')
  LOOP
    PERFORM cron.unschedule(r.jobid);
  END LOOP;
END $$;

SELECT cron.schedule(
  'outbox-relay-every-minute',
  '* * * * *',
  $cmd$
  SELECT net.http_post(
    url := 'https://zdqkrrehlivayconjcgm.supabase.co/functions/v1/outbox-relay',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcWtycmVobGl2YXljb25qY2dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NjAxNjQsImV4cCI6MjA2NTQzNjE2NH0.ZEwZo8TNkaWP0SxVmfXCx2zQt5sdIwWXiy9US4E2i1I'
    ),
    body := jsonb_build_object('source','cron')
  );
  $cmd$
);

SELECT cron.schedule(
  'engine-jobs-worker-every-minute',
  '* * * * *',
  $cmd$
  SELECT net.http_post(
    url := 'https://zdqkrrehlivayconjcgm.supabase.co/functions/v1/engine-jobs-worker',
    headers := jsonb_build_object(
      'Content-Type','application/json',
      'Authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkcWtycmVobGl2YXljb25qY2dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NjAxNjQsImV4cCI6MjA2NTQzNjE2NH0.ZEwZo8TNkaWP0SxVmfXCx2zQt5sdIwWXiy9US4E2i1I'
    ),
    body := jsonb_build_object('source','cron')
  );
  $cmd$
);
