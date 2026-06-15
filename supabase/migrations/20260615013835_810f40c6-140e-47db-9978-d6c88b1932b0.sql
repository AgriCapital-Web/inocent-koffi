DROP POLICY IF EXISTS "Service role can insert audit history" ON public.og_audit_history;
CREATE POLICY "Service role can insert audit history"
ON public.og_audit_history FOR INSERT TO service_role WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages"
ON public.contact_messages FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can view partnership requests" ON public.partnership_requests;
CREATE POLICY "Admins can view partnership requests"
ON public.partnership_requests FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));

REVOKE SELECT ON public.forum_topics FROM anon, authenticated;
GRANT SELECT (id, title, content, category, is_pinned, view_count, reply_count, created_at, updated_at, author_name) ON public.forum_topics TO anon, authenticated;
GRANT ALL ON public.forum_topics TO service_role;

REVOKE SELECT ON public.forum_replies FROM anon, authenticated;
GRANT SELECT (id, topic_id, content, is_approved, created_at, author_name) ON public.forum_replies TO anon, authenticated;
GRANT ALL ON public.forum_replies TO service_role;

REVOKE SELECT ON public.blog_posts FROM anon;
GRANT SELECT (id, title, slug, content, excerpt, featured_image, hashtags, tagline, author, author_id, category_id, is_published, published_at, created_at, updated_at, share_version, article_number, view_count) ON public.blog_posts TO anon;