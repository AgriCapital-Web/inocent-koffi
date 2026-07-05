
-- Revoke sensitive columns from public roles
REVOKE SELECT (author_email, author_phone) ON public.blog_comments FROM anon, authenticated;
REVOKE SELECT (auto_save_data) ON public.blog_posts FROM anon, authenticated;
REVOKE SELECT (author_email) ON public.forum_replies FROM anon, authenticated;
REVOKE SELECT (author_email) ON public.forum_topics FROM anon, authenticated;
REVOKE SELECT (email, phone) ON public.testimonials FROM anon, authenticated;

-- Grant back all remaining columns explicitly (safety in case of blanket revokes)
-- Re-grant column-level SELECT for non-sensitive columns to preserve app access
GRANT SELECT (id, post_id, author_name, author_photo, content, is_approved, created_at, updated_at)
  ON public.blog_comments TO anon, authenticated;

GRANT SELECT (id, author_id, title, slug, content, excerpt, featured_image, share_version,
              article_number, view_count, author, hashtags, tagline, category_id,
              updated_at, created_at, published_at, is_published)
  ON public.blog_posts TO anon, authenticated;

-- forum_replies: grant remaining columns (schema: id, topic_id, author_name, content, is_approved, created_at, updated_at, author_id if present)
DO $$
DECLARE cols text;
BEGIN
  SELECT string_agg(quote_ident(column_name), ', ')
    INTO cols
  FROM information_schema.columns
  WHERE table_schema='public' AND table_name='forum_replies' AND column_name <> 'author_email';
  EXECUTE format('GRANT SELECT (%s) ON public.forum_replies TO anon, authenticated', cols);
END $$;

DO $$
DECLARE cols text;
BEGIN
  SELECT string_agg(quote_ident(column_name), ', ')
    INTO cols
  FROM information_schema.columns
  WHERE table_schema='public' AND table_name='forum_topics' AND column_name <> 'author_email';
  EXECUTE format('GRANT SELECT (%s) ON public.forum_topics TO anon, authenticated', cols);
END $$;

DO $$
DECLARE cols text;
BEGIN
  SELECT string_agg(quote_ident(column_name), ', ')
    INTO cols
  FROM information_schema.columns
  WHERE table_schema='public' AND table_name='testimonials' AND column_name NOT IN ('email','phone');
  EXECUTE format('GRANT SELECT (%s) ON public.testimonials TO anon, authenticated', cols);
END $$;

-- site_visitors: admin-only UPDATE/DELETE policies
CREATE POLICY "Admins can update site_visitors"
  ON public.site_visitors FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete site_visitors"
  ON public.site_visitors FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- testimonials storage bucket: admin-only DELETE/UPDATE
CREATE POLICY "Admins can delete testimonial uploads"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'testimonials' AND public.is_admin(auth.uid()));

CREATE POLICY "Admins can update testimonial uploads"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'testimonials' AND public.is_admin(auth.uid()))
  WITH CHECK (bucket_id = 'testimonials' AND public.is_admin(auth.uid()));
