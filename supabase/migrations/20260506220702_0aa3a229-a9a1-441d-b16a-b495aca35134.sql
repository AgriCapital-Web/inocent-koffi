
-- Restore full column grants for the authenticated role so admin users (RLS-gated) can still read PII
GRANT SELECT ON public.testimonials TO authenticated;
REVOKE SELECT ON public.testimonials FROM anon;

-- Drop the public-row policy so non-admins can't read raw testimonials directly
DROP POLICY IF EXISTS "Public can view approved testimonials" ON public.testimonials;

-- Recreate the public view as SECURITY DEFINER so it works without an RLS pass-through
DROP VIEW IF EXISTS public.public_testimonials;
CREATE VIEW public.public_testimonials
WITH (security_invoker = false) AS
SELECT id, first_name, locality, message, rating, photo_url, created_at, is_approved
FROM public.testimonials
WHERE is_approved = true;

GRANT SELECT ON public.public_testimonials TO anon, authenticated;
