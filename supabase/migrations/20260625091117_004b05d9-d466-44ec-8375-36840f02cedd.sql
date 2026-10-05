
-- 1) article_views: restrict SELECT to admins
DROP POLICY IF EXISTS "Anyone can view article stats" ON public.article_views;
CREATE POLICY "Admins can view article stats"
  ON public.article_views FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- 2) site_visitors: restrict SELECT to admins
DROP POLICY IF EXISTS "Anyone can view visitors" ON public.site_visitors;
CREATE POLICY "Admins can view visitors"
  ON public.site_visitors FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- 3) blog_posts: remove broad authenticated ALL policy
DROP POLICY IF EXISTS "Authenticated users can manage own posts" ON public.blog_posts;

-- 4) Aggregate RPCs for public-facing widgets
CREATE OR REPLACE FUNCTION public.get_visitor_counts()
RETURNS TABLE(total_count bigint, online_count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(*) FROM public.site_visitors) AS total_count,
    (SELECT count(*) FROM public.site_visitors
      WHERE is_online = true
        AND last_active >= now() - interval '5 minutes') AS online_count;
$$;

GRANT EXECUTE ON FUNCTION public.get_visitor_counts() TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_article_engagement(_post_id uuid)
RETURNS TABLE(views bigint, reads bigint, shares bigint, reactions bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(*) FROM public.article_views WHERE post_id = _post_id) AS views,
    (SELECT count(*) FROM public.article_views WHERE post_id = _post_id AND finished_reading = true) AS reads,
    (SELECT count(*) FROM public.article_shares WHERE post_id = _post_id) AS shares,
    (SELECT count(*) FROM public.blog_likes WHERE post_id = _post_id) AS reactions;
$$;

GRANT EXECUTE ON FUNCTION public.get_article_engagement(uuid) TO anon, authenticated;
