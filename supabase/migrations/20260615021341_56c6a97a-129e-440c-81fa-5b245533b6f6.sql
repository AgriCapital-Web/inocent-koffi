
-- =====================================================================
-- 1. Column-level PII protection (revoke SELECT on sensitive columns)
-- =====================================================================

-- blog_comments: hide author_email, author_phone from public
REVOKE SELECT ON public.blog_comments FROM anon, authenticated;
GRANT SELECT (id, post_id, author_name, author_photo, content, is_approved, created_at, updated_at)
  ON public.blog_comments TO anon, authenticated;

-- forum_topics: hide author_email
REVOKE SELECT ON public.forum_topics FROM anon, authenticated;
GRANT SELECT (id, title, content, category, is_pinned, is_locked, view_count, reply_count, created_at, updated_at, author_name)
  ON public.forum_topics TO anon, authenticated;

-- forum_replies: hide author_email
REVOKE SELECT ON public.forum_replies FROM anon, authenticated;
GRANT SELECT (id, topic_id, content, is_approved, created_at, author_name)
  ON public.forum_replies TO anon, authenticated;

-- blog_posts: hide auto_save_data
REVOKE SELECT ON public.blog_posts FROM anon, authenticated;
GRANT SELECT (id, title, slug, content, excerpt, featured_image, author_id, is_published,
              published_at, created_at, updated_at, category_id, tagline, author,
              hashtags, view_count, article_number, share_version)
  ON public.blog_posts TO anon, authenticated;

-- testimonials: hide email, phone from anon (admins still see all via separate policy + service_role)
REVOKE SELECT ON public.testimonials FROM anon, authenticated;
GRANT SELECT (id, first_name, last_name, message, rating, locality, photo_url, is_approved, created_at)
  ON public.testimonials TO anon, authenticated;

-- =====================================================================
-- 2. Lock down UPDATE on forum_topics + RPC for view count
-- =====================================================================
DROP POLICY IF EXISTS "Anyone can update view count" ON public.forum_topics;

CREATE OR REPLACE FUNCTION public.increment_topic_view_count(_topic_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.forum_topics
     SET view_count = COALESCE(view_count, 0) + 1
   WHERE id = _topic_id;
$$;
REVOKE ALL ON FUNCTION public.increment_topic_view_count(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_topic_view_count(uuid) TO anon, authenticated;

-- =====================================================================
-- 3. Lock down UPDATE on site_visitors + RPCs for presence
-- =====================================================================
DROP POLICY IF EXISTS "Anyone can update visitors" ON public.site_visitors;

CREATE OR REPLACE FUNCTION public.upsert_site_visitor(_session_id text, _user_agent text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _session_id IS NULL OR length(_session_id) = 0 OR length(_session_id) > 128 THEN
    RETURN;
  END IF;
  INSERT INTO public.site_visitors (session_id, is_online, last_active, user_agent)
  VALUES (_session_id, true, now(), left(COALESCE(_user_agent, ''), 512))
  ON CONFLICT (session_id) DO UPDATE
    SET is_online = true,
        last_active = now(),
        user_agent = COALESCE(EXCLUDED.user_agent, public.site_visitors.user_agent);
END;
$$;
REVOKE ALL ON FUNCTION public.upsert_site_visitor(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.upsert_site_visitor(text, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.set_visitor_offline(_session_id text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.site_visitors
     SET is_online = false
   WHERE session_id = _session_id;
$$;
REVOKE ALL ON FUNCTION public.set_visitor_offline(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_visitor_offline(text) TO anon, authenticated;

-- =====================================================================
-- 4. Lock down UPDATE on article_views + session-scoped RPC
-- =====================================================================
DROP POLICY IF EXISTS "Anyone can update own view" ON public.article_views;

CREATE OR REPLACE FUNCTION public.update_article_view(
  _view_id uuid,
  _session_id text,
  _reading_progress integer,
  _time_spent_seconds integer,
  _finished_reading boolean
) RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.article_views
     SET reading_progress = LEAST(GREATEST(COALESCE(_reading_progress, 0), 0), 100),
         time_spent_seconds = GREATEST(COALESCE(_time_spent_seconds, 0), 0),
         finished_reading = COALESCE(_finished_reading, false)
   WHERE id = _view_id
     AND session_id = _session_id;
$$;
REVOKE ALL ON FUNCTION public.update_article_view(uuid, text, integer, integer, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_article_view(uuid, text, integer, integer, boolean) TO anon, authenticated;

-- =====================================================================
-- 5. Drop unused Realtime publication for blog_posts and site_visitors
-- =====================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='blog_posts') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.blog_posts';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='site_visitors') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.site_visitors';
  END IF;
END $$;
