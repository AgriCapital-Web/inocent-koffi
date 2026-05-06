
DROP VIEW IF EXISTS public.public_testimonials;
CREATE VIEW public.public_testimonials
WITH (security_invoker = true) AS
SELECT id, first_name, last_name, locality, message, rating, photo_url, created_at, is_approved
FROM public.testimonials
WHERE is_approved = true;

GRANT SELECT ON public.public_testimonials TO anon, authenticated;

CREATE POLICY "Public can view approved testimonials"
ON public.testimonials FOR SELECT
USING (is_approved = true);
