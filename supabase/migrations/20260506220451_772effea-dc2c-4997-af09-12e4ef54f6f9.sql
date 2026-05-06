
DROP POLICY IF EXISTS "Public can view approved testimonials safe fields" ON public.testimonials;

-- Recreate the view as SECURITY DEFINER (default) so the public can read it without RLS on testimonials
DROP VIEW IF EXISTS public.public_testimonials;
CREATE VIEW public.public_testimonials AS
SELECT id, first_name, last_name, locality, message, rating, photo_url, created_at, is_approved
FROM public.testimonials
WHERE is_approved = true;

GRANT SELECT ON public.public_testimonials TO anon, authenticated;
