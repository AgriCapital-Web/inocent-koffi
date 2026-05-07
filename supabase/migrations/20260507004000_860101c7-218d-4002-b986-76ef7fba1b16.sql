
-- 1. Lock down trigger-only SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.assign_article_number() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_topic_reply_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.bump_share_version() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.increment_view_count() FROM PUBLIC, anon, authenticated;

-- 2. Public buckets: drop broad listing SELECT policies (public URL serving still works)
DROP POLICY IF EXISTS "Blog media are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view testimonial photos" ON storage.objects;

-- 3. Restrict ai_cache writes to service_role (edge functions use service role)
DROP POLICY IF EXISTS "Edge functions can insert cache" ON public.ai_cache;
DROP POLICY IF EXISTS "Edge functions can delete cache" ON public.ai_cache;
CREATE POLICY "Service role can insert cache" ON public.ai_cache
  FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Service role can delete cache" ON public.ai_cache
  FOR DELETE TO service_role USING (true);
