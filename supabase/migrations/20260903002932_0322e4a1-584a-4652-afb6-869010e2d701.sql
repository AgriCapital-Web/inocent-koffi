-- 1) blog_likes: hard-lock contact columns for the public
REVOKE ALL ON public.blog_likes FROM anon, authenticated;
GRANT SELECT (id, post_id, reaction_type, created_at) ON public.blog_likes TO anon, authenticated;
GRANT INSERT (post_id, reaction_type, session_id, author_name, author_phone) ON public.blog_likes TO anon, authenticated;
GRANT ALL ON public.blog_likes TO service_role;

DROP POLICY IF EXISTS "Anyone can view likes" ON public.blog_likes;
CREATE POLICY "Public can view like counts"
ON public.blog_likes FOR SELECT TO anon, authenticated
USING (true);

-- 2) testimonials bucket: image-only uploads via storage policy
DROP POLICY IF EXISTS "Anyone can upload testimonial photos" ON storage.objects;
CREATE POLICY "Public can upload testimonial images only"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (
  bucket_id = 'testimonials'
  AND lower(storage.extension(name)) IN ('jpg','jpeg','png','webp','gif','avif')
  AND COALESCE((metadata ->> 'size')::bigint, 0) <= 5242880
  AND COALESCE(metadata ->> 'mimetype', 'image/jpeg') LIKE 'image/%'
);