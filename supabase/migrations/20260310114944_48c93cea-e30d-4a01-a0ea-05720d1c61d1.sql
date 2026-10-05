-- Ensure blog post view counter increments whenever a view is recorded
CREATE OR REPLACE FUNCTION public.increment_view_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.blog_posts
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = NEW.post_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_increment_view_count ON public.article_views;

CREATE TRIGGER trg_increment_view_count
AFTER INSERT ON public.article_views
FOR EACH ROW
EXECUTE FUNCTION public.increment_view_count();

-- Helpful indexes for article counters shown on public pages
CREATE INDEX IF NOT EXISTS idx_article_views_post_id ON public.article_views(post_id);
CREATE INDEX IF NOT EXISTS idx_article_shares_post_id ON public.article_shares(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_post_id ON public.blog_likes(post_id);