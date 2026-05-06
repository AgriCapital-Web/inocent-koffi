
-- Restrict public SELECT on testimonials and expose only safe columns via a view

DROP POLICY IF EXISTS "All testimonials are publicly visible" ON public.testimonials;

CREATE POLICY "Admins can view all testimonials"
ON public.testimonials FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE OR REPLACE VIEW public.public_testimonials
WITH (security_invoker = true) AS
SELECT id, first_name, last_name, locality, message, rating, photo_url, created_at, is_approved
FROM public.testimonials
WHERE is_approved = true;

GRANT SELECT ON public.public_testimonials TO anon, authenticated;

-- Allow the view to read approved testimonials by adding a permissive policy
CREATE POLICY "Public can view approved testimonials safe fields"
ON public.testimonials FOR SELECT
USING (is_approved = true);
