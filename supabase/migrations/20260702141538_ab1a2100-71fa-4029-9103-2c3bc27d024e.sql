ALTER TABLE public.newsletter_subscribers 
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'confirmed',
  ADD COLUMN IF NOT EXISTS confirmed_at timestamptz DEFAULT now();

ALTER TABLE public.newsletter_subscribers
  DROP CONSTRAINT IF EXISTS newsletter_subscribers_status_check;
ALTER TABLE public.newsletter_subscribers
  ADD CONSTRAINT newsletter_subscribers_status_check
  CHECK (status IN ('pending','confirmed','unsubscribed'));