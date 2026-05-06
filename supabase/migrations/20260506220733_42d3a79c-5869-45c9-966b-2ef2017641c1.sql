
-- Reset
REVOKE SELECT ON public.testimonials FROM anon, authenticated;

-- Column-level grant for anon (safe fields only)
GRANT SELECT (id, first_name, locality, message, rating, photo_url, created_at, is_approved)
  ON public.testimonials TO anon;

-- Authenticated still gets full SELECT (admin RLS gates the rows)
GRANT SELECT ON public.testimonials TO authenticated;

-- RLS: anon sees only approved rows; admins see everything (existing admin policy already covers updates/deletes/select via is_admin)
DROP POLICY IF EXISTS "Public can view approved testimonials" ON public.testimonials;
CREATE POLICY "Anon can view approved testimonials safe columns"
ON public.testimonials FOR SELECT
TO anon
USING (is_approved = true);

-- Recreate the convenience view as security_invoker so it respects the anon policy
DROP VIEW IF EXISTS public.public_testimonials;
CREATE VIEW public.public_testimonials
WITH (security_invoker = true) AS
SELECT id, first_name, locality, message, rating, photo_url, created_at, is_approved
FROM public.testimonials
WHERE is_approved = true;

GRANT SELECT ON public.public_testimonials TO anon, authenticated;
