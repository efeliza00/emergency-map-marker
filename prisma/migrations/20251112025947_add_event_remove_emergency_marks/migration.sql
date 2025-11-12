-- 1. Enable the pg_cron extension (only needs to be run once per database)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Schedule the daily job to run at midnight (00:00)
SELECT cron.schedule(
  'delete-old-emergencies-job', -- A unique name for the job
  '0 0 * * *',                  -- Cron string: "At 00:00 every day"
  $$ DELETE FROM "EmergencyMarker" WHERE "createdAt" < NOW() - INTERVAL '7 days' $$
);
