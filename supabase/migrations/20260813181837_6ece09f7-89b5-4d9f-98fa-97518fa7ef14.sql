DROP POLICY IF EXISTS "Anyone can read cache" ON public.ai_cache;
REVOKE SELECT ON public.ai_cache FROM anon, authenticated;
CREATE POLICY "Admins can read cache" ON public.ai_cache
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));
GRANT SELECT ON public.ai_cache TO authenticated;
GRANT ALL ON public.ai_cache TO service_role;

DROP POLICY IF EXISTS "Anyone can view shares" ON public.article_shares;
REVOKE SELECT ON public.article_shares FROM anon;
CREATE POLICY "Admins can view shares" ON public.article_shares
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));
GRANT SELECT ON public.article_shares TO authenticated;
GRANT ALL ON public.article_shares TO service_role;

REVOKE SELECT ON public.blog_likes FROM anon, authenticated;
GRANT SELECT (id, post_id, reaction_type, created_at) ON public.blog_likes TO anon, authenticated;
GRANT ALL ON public.blog_likes TO service_role;

DROP POLICY IF EXISTS "Admins can view likes with details" ON public.blog_likes;
CREATE POLICY "Admins can view likes with details" ON public.blog_likes
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));
